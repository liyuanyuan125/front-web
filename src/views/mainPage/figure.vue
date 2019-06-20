<template>
  <Layout :bubbleList="bubbleList" :class="bigFigure ? 'layout-big-figure' : ''">
    <div class="main-content flex-box">
      <div
        class="big-figure"
        :style="{
          backgroundImage: `url(${bigFigure})`
        }"
        v-if="bigFigure"
      ></div>

      <div class="basic-box">
        <BasicPane
          :item="basic"
          :opusData="opusData"
          :brandData="brandData"
          :more="{name: 'film-figure-detail-information', params: {id}}"
        />
      </div>

      <section class="board-pane">
        <div class="board-row flex-box">
          <FansPane
            title="粉丝画像"
            :man="fansRate.man"
            :woman="fansRate.woman"
            :more="{ }"
            class="fans-pane"
            v-if="fansRate"
          />

          <PiePane
            title="近7日评论分析"
            :more="{ }"
            :data="commentData"
            class="comment-pane"
            v-if="commentData"
          />
        </div>

        <div class="board-row">
          <BarPane
            title="近7日活跃粉丝数"
            :data="activeFansData"
            :more="{ }"
            class="active-fans-pane"
            v-if="activeFansData"
          />
        </div>

        <div class="board-row">
          <HotPane
            title="近30日全网热度"
            :data="hotData"
            :more="{ }"
            tooltip="爽肤水发发送方是否舒服舒服是否时所发生的撒旦法"
            :legendList="legendList"
            :formatter="hotFormatter"
            class="hot-pane"
          />
        </div>
      </section>
    </div>
  </Layout>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Layout from './components/layout.vue'
import BasicPane from './components/basicPane.vue'
import FansPane from './components/fansPane.vue'
import PiePane from './components/piePane.vue'
import BarPane from './components/barPane.vue'
import HotPane from './components/hotPane.vue'

import { getFigure, getFigureActiveFans, getFigureHot } from './data'

@Component({
  components: {
    Layout,
    BasicPane,
    FansPane,
    PiePane,
    BarPane,
    HotPane
  }
})
export default class FigurePage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  bubbleList: string[] = []

  basic: any = null

  bigFigure = ''

  fansRate: any = null

  opusData: any = null

  brandData: any = null

  commentData: any = null

  activeFansData = [
    { name: '5-16', value: 855000 },
    { name: '5-17', value: 800000 },
    { name: '5-18', value: 808000 },
    { name: '5-19', value: 860000 },
    { name: '5-20', value: 600000 },
    { name: '5-21', value: 755000 },
    { name: '5-22', value: 555000 },
  ]

  legendList = [
    { name: '新浪', no: 'No.3', inc: 0 },
    { name: '微信', no: 'No.2', inc: -2 },
    { name: '百度', no: 'No.4', inc: 8 },
    { name: '头条', no: 'No.1', inc: 3 },
  ]

  hotData = [
    { name: '5-16', value: 855000, rank: 1 },
    { name: '5-17', value: 100000, rank: 2 },
    { name: '5-18', value: 808000, rank: 8 },
    { name: '5-19', value: 260000, rank: 6 },
    { name: '5-20', value: 600000, rank: 5 },
    { name: '5-21', value: 755000, rank: 3 },
    { name: '5-22', value: 555000, rank: 2 },
  ]

  hotFormatter([{ dataIndex }]: any) {
    const { value, rank } = this.hotData[dataIndex]
    return `综合热度：${value}<br>男演员排名：${rank}`
  }

  created() {
    this.init()
  }

  init() {
    this.initMain()
    this.initActiveFans()
    this.initHot()
  }

  async initMain() {
    const {
      bubbleList,
      basic,
      bigFigure,
      fansRate,
      opusData,
      brandData,
      commentData,
    } = await getFigure(this.id)

    this.bubbleList = bubbleList
    this.basic = basic
    this.bigFigure = bigFigure
    this.fansRate = fansRate
    this.opusData = opusData
    this.brandData = brandData
    this.commentData = commentData
  }

  async initActiveFans() {
    const activeFansData = await getFigureActiveFans(this.id)
    this.activeFansData = activeFansData
  }

  async initHot() {
    await getFigureHot(this.id)
  }
}
</script>

<style lang="less" scoped>
.main-content {
  position: relative;
  justify-content: space-between;
  padding-right: 80px;
}

.layout-big-figure {
  /deep/ .main-content {
    padding-right: 56px;
  }

  /deep/ .basic-box {
    margin: 62px 0 0 180px;

    .basic-pane {
      min-width: 348px;
    }

    .basic-in {
      margin-left: 128px;
    }

    .figure {
      display: none;
    }
  }

  /deep/ .bubble-text-list {
    margin-left: 0;
  }
}

.big-figure {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 303px;
  background: no-repeat -5px 20px;
  z-index: 88;
  pointer-events: none;
}

.basic-box {
  position: relative;
  margin: 47px 0 0 102px;
}

.board-pane {
  min-width: 580px;
  margin-top: 14px;
}

.board-row {
  justify-content: space-between;
  margin-top: 6px;
  &:last-child .pane-item {
    border-radius: 0 0 5px 5px;
  }
}

.fans-pane {
  border-radius: 5px 0 0 0;
}

.comment-pane {
  border-radius: 0 5px 0 0;
}

.active-fans-pane {
  height: 260px;
}

.hot-pane {
  height: 314px;
}
</style>
