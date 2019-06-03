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
        <BasicPane :item="basic" :opusList="opusList" :brandList="brandList"/>
      </div>

      <section class="board-pane">
        <div class="board-row flex-box">
          <FansPane class="fans-pane"/>
          <CommentPane class="comment-pane"/>
        </div>

        <div class="board-row">
          <ActiveFansPane class="active-fans-pane"/>
        </div>

        <div class="board-row">
          <HotPane class="hot-pane"/>
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
import CommentPane from './components/commentPane.vue'
import ActiveFansPane from './components/activeFansPane.vue'
import HotPane from './components/hotPane.vue'

@Component({
  components: {
    Layout,
    BasicPane,
    FansPane,
    CommentPane,
    ActiveFansPane,
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

  brandList = [
    { logo: 'https://dummyimage.com/60x60/000/fff' },
    { logo: 'https://dummyimage.com/60x60/fff/000' },
    { logo: 'https://dummyimage.com/60x60/e2e/fff' },
  ]
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
  border-radius: 0 0 5px 5px;
}
</style>
