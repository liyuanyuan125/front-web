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
          :more="{ name: 'film-figure-detail-information', params: { id } }"
        />
      </div>

      <section class="board-pane">
        <div class="board-row flex-box">
          <FansPane
            title="粉丝画像"
            :man="fansRate.man"
            :woman="fansRate.woman"
            :more="{ name: 'film-figure-detail-fans', params: { id } }"
            class="fans-pane"
            v-if="fansRate"
          />

          <PiePane
            title="近7日评论分析"
            :more="{ name: 'film-figure-detail-comment', params: { id } }"
            :data="commentData"
            :formatter="commentFormatter"
            class="comment-pane"
          />
        </div>

        <div class="board-row">
          <BarPane
            title="近7日活跃粉丝数"
            :data="activeFansData"
            :more="{ name: 'film-figure-detail-platform', params: { id } }"
            class="active-fans-pane"
            v-if="activeFansData"
          />
        </div>

        <div class="board-row" v-if="hotData && hotData.length > 0">
          <HotPane
            title="近30日全网热度"
            :data="hotData"
            :more="{ name: 'film-figure-detail-hot', params: { id } }"
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

  activeFansData: any = null

  hotData: any[] = []

  commentFormatter({ seriesName, dataIndex }: any) {
    const { name, value, trend } = this.commentData[dataIndex]
    const inc = trend > 0 ? `(上升${trend}%)` : trend < 0 ? `(下降${-trend}%)` : ''
    return `${seriesName}<br>${name}：${value}%${inc}`
  }

  hotFormatter([{ dataIndex }]: any) {
    const { value } = this.hotData[dataIndex]
    return `综合热度：${+value || '-'}`
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
    const hotData = await getFigureHot(this.id)
    this.hotData = hotData
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
  width: 580px;
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
