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
          :more="{ name: 'home' }"
          :figureWorks="{name: 'film-figure-detail-works', params: {id}}"
          :figureBrand="{name: 'film-figure-detail-brand', params: {id}}"
          :figureInfor="{name: 'film-figure-detail-information', params: {id}}"
          :opusList="opusList"
          :figureList="figureList"
        />
      </div>

      <section class="board-pane">
        <div class="board-row flex-box">
          <FansPane
            title="粉丝画像"
            :man="fansMan"
            :woman="fansWoman"
            :more="{ name: 'film-figure-detail-fans', params: {id} }"
            class="fans-pane"
          />
          <PiePane
            title="近7日评论分析"
            :more="{ name: 'film-figure-detail-comment', params: {id}}"
            :data="commentData"
            class="comment-pane"
          />
        </div>

        <div class="board-row">
          <BarPane
            title="近7日活跃粉丝数"
            :data="activeFansData"
            :more="{ name: 'film-figure-detail-platform', params: {id}}"
            class="active-fans-pane"
          />
        </div>

        <div class="board-row">
          <HotPane
            title="近30日全网热度"
            :data="hotData"
            :more="{ name: 'film-figure-detail-hot', params: {id} }"
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

  basic = {
    id: this.id,
    name: '吴京',
    subName: 'Wu Jing',
    title: '演员 / 导演 / 制片人',
    figure: 'https://picsum.photos/id/435/154/218',
    rankNo: '92.02',
    rankTitle: '中国男演员票房 : TOP1',
  }

  bigFigure = this.id == 1 ? '' : 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bjnoh5p3lbm00083qlb0.png'

  fansMan = 66

  fansWoman = 34

  bubbleList = [
    '师兄李连杰',
    '流浪地球',
    '教练吴彬',
    '功夫小子',
    '导演',
    '少林寺',
  ]

  opusList = [
    { title: '《流浪地球》演员是放松放松时发生地方', count: '46.8亿' },
    { title: '《流浪地球》演员', count: '6.8亿' },
    { title: '《流浪地球》演员是', count: '16.8亿' },
  ]

  figureList = [
    { logo: 'https://dummyimage.com/60x60/000/fff' },
    { logo: 'https://dummyimage.com/60x60/fff/000' },
    { logo: 'https://dummyimage.com/60x60/e2e/fff' },
  ]

  commentData = [
    { name: '正面', value: 80, color: '#ca7273' },
    { name: '中立', value: 30, color: '#f3d872' },
    { name: '负面', value: 20, color: '#57b4c9' },
  ]

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
