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
          :platformList="platformList"
          :brandList="brandList"
        />
      </div>

      <section class="board-pane">
        <nav class="flatform-nav">
          <a
            v-for="it in platformNavList"
            :key="it.icon"
            class="flatform-nav-item"
            :class="{'flatform-nav-on': it.icon == platformNav}"
            @click="platformNav = it.icon"
          >
            <i :class="`platform-icon-${it.icon}`"></i>
            <span class="platform-name">{{it.name}}</span>
          </a>
        </nav>

        <div class="board-row flex-box">
          <FansPane
            title="粉丝画像"
            :man="fansMan"
            :woman="fansWoman"
            :more="{ name: 'home' }"
            tip="与奔驰用户匹配度：72%"
            class="fans-pane"
          />
          <PiePane
            title="近7日评论分析"
            :more="{ name: 'home' }"
            :data="commentData"
            class="comment-pane"
          />
        </div>

        <div class="board-row">
          <HotPane
            title="近30日微博指数"
            :data="hotData"
            :more="{ name: 'home' }"
            tooltip="爽肤水发发送方是否舒服舒服是否时所发生的撒旦法"
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
    name: 'Papi酱',
    subName: '',
    title: '搞笑视频自媒体',
    figure: 'https://picsum.photos/id/435/154/218',
    rankNo: '86.5',
    rankTitle: '全网排名：100<br>搞笑类：1',
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

  platformList = [
    { icon: 'douyin', name: '抖音', percent: 100, count: '3288万' },
    { icon: 'weibo', name: '微博', percent: 80, count: '2288万' },
    { icon: 'wechat', name: '微信', percent: 60, count: '1888万' },
    { icon: 'kuaishou', name: '快手', percent: 50, count: '1288万' },
    { icon: 'xiaohongshu', name: '小红书', percent: 30, count: '888万' },
  ]

  platformNav = 'weibo'

  platformNavList = [
    { icon: 'weibo', name: '微博' },
    { icon: 'wechat', name: '微信' },
    { icon: 'douyin', name: '抖音' },
    { icon: 'kuaishou', name: '快手' },
    { icon: 'xiaohongshu', name: '小红书' },
  ]

  brandList = [
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
@import './style.less';

.main-content {
  position: relative;
  justify-content: space-between;
  padding-right: 80px;
  /deep/ .brand-list {
    padding-right: 42px;
  }
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
  margin: 22px 0 0 102px;
  /deep/ .basic-in {
    width: 246px;
    margin-left: 30px;
  }
  /deep/ .figure {
    top: 42px;
    width: 162px;
    height: 162px;
    border-radius: 6px;
  }
}

.board-pane {
  min-width: 580px;
  margin-top: 14px;
}

.flatform-nav {
  display: flex;
  line-height: 68px;
  background-color: rgba(0, 31, 44, 0.85);
  border-radius: 5px 5px 0 0;
  user-select: none;
}

.flatform-nav-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  color: #fff;
  font-size: 14px;
  padding: 0 2px;
  margin: 0 22px;
  opacity: .6;
  cursor: pointer;

  .platform-icon-xiaohongshu {
    margin: 0 5px;
  }
}

.flatform-nav-item:hover,
.flatform-nav-on {
  opacity: 1;
}

.flatform-nav-on {
  &::after {
    content: '';
    position: absolute;
    left: 4px;
    bottom: 10px;
    width: calc(100% - 2px);
    height: 4px;
    background-color: #fff;
    border-radius: 8px;
  }
}

.board-row {
  justify-content: space-between;
  margin-top: 6px;
}

.active-fans-pane {
  height: 260px;
}

.hot-pane {
  height: 295px;
  border-radius: 0 0 5px 5px;
  /deep/ .chart {
    height: 218px;
  }
}
</style>