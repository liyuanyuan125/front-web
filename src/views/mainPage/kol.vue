<template>
  <Layout :bubbleList="bubbleList">
    <div class="main-content flex-box">
      <div class="basic-box">
        <BasicPane :opusList="opusList" :brandList="brandList"/>
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
import { Component } from 'vue-property-decorator'
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
  bubbleList = [
    '师兄李连杰',
    '流浪地球',
    '教练吴彬',
    '功夫小子',
    '导演',
    '少林寺',
  ]

  opusList = [
    { title: '流浪地球》演员是放松放松时发生地方', count: '46.8亿' },
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
  padding-right: 56px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bjnoh5p3lbm00083qlb0.png) no-repeat -5px 20px;
    z-index: 88;
    pointer-events: none;
  }
}

.basic-box {
  margin: 62px 0 0 180px;
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
