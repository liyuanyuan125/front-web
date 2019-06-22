<template>
  <Layout :bubbleList="bubbleList" class="layout">
    <main class="main-content">
      <div class="header-bar">
        <h3 class="item-title">{{item.name}}</h3>
        <Button type="primary" :to="{ name: 'brand-list' }" class="button-manage">品牌管理</Button>
      </div>

      <div class="pane-group">
        <Pane class="hot-pane">
          <div class="hot-wrap">
            <img :src="item.logoUrl" class="logo">
            <div class="hot-main">
              <h3 class="hot-title">昨日综合热度</h3>
              <div class="hot-node">
                <em class="hot-value">{{item.jyIndex | thousands}}</em>
                <i
                  :class="`hot-${item.jyTrend > 0 ? 'inc' : 'dec'}`"
                  v-if="item.jyTrend != 0"
                >{{item.jyTrend}}</i>
              </div>
            </div>
          </div>
        </Pane>

        <FansPane
          title="百度搜索用户画像"
          :man="item.malePercent"
          :woman="item.femalePercent"
          :more="{ name: 'brand-homedetail-fans', params: { id } }"
          class="fans-pane"
        />
      </div>

      <Pane title="映前广告计划" class="plan-pane">
        <Button
          type="primary"
          :to="{ name: 'pop-planlist-add', params: { id: 0 } }"
          class="button-put"
        >创建广告计划</Button>
        <ul class="plan-count-list">
          <li class="plan-count-item">
            <i>待付款</i>
            <em>{{item.unpay}}</em>
          </li>
          <li class="plan-count-item">
            <i>进行中</i>
            <em>{{item.onexecute}}</em>
          </li>
          <li class="plan-count-item">
            <i>已完成</i>
            <em>{{item.finish}}</em>
          </li>
        </ul>
      </Pane>

      <Pane title="热门影片" class="film-pane" v-if="hotFilmGroup">
        <Tabs v-model="hotFilmTab">
          <TabPane v-for="it in hotFilmGroup" :key="it.name" :name="it.name" :label="it.name">
            <div class="film-wrap">
              <ul class="film-list">
                <li
                  v-for="sub in it.list"
                  :key="sub.id"
                  class="film-item"
                  :class="{'film-item-hot': sub.hasShow}"
                >
                  <router-link
                    :to="{ name: 'film-movie', params: { id: sub.id } }"
                    class="film-item-in"
                  >
                    <figure class="film-figure">
                      <img :src="sub.movieMainPic" class="film-img">
                    </figure>
                    <div class="film-main">
                      <div class="film-name text-omit">{{sub.name}}</div>
                      <div class="film-index">鲸娱指数：{{sub.jyIndex}}</div>
                      <div class="film-date">{{sub.date}}上映</div>
                      <div
                        class="film-stats text-omit"
                        v-if="sub.hasShow"
                      >已上映{{sub.showDays}}天，累计{{sub.custom}}</div>
                      <div class="film-stats text-omit" v-else>
                        预估票房：
                        <em>{{sub.customPredict}}</em>
                      </div>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>
          </TabPane>
        </Tabs>
      </Pane>
    </main>
  </Layout>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TrendChart from '@/components/trendChart'
import BScroll from '@better-scroll/core'
import ThrowPane from './throwPane.vue'
import PieChart from './pieChart.vue'
import WordCloud from '@/components/chartsGroup/wordCloud'
import Layout from '../../components/layout.vue'
import Pane from '../../components/pane.vue'
import FansPane from '../../components/fansPane.vue'

import { dayOffsetRange } from '@/util/date'
import FetchData from './fetchData'
import { Type } from './types'
import { toThousands } from '@/util/dealData'

@Component({
  components: {
    Layout,
    Pane,
    FansPane,
    TrendChart,
    ThrowPane,
    PieChart,
    WordCloud
  },

  filters: {
    thousands: toThousands
  }
})
export default class BrandLayout extends ViewBase {
  @Prop({ type: String, default: 'brand' }) type!: Type

  @Prop({ type: Number, default: 0 }) id!: number

  get isBrand() {
    return this.type == 'brand'
  }

  get isItem() {
    return this.type == 'item'
  }

  fetchData = new FetchData(this.type, this.id)

  bubbleList: string[] = ['1', '2', '3', '4', '5', '6']

  item = {}

  commentData: any = null

  // 产品导航所用
  bscroll: BScroll | null = null

  bscrollOn = false

  // 广告投放数据
  putting = []

  hotFilmTab = ''
  hotFilmGroup: any = null

  created() {
    this.init()
  }

  init() {
    this.initHome()
    // 产品调整：不显示
    // this.initTrend()
    // 产品调整，暂时不显示品牌下的产品
    // this.isBrand && this.initSub()
    // this.initPutting()
  }

  async initHome() {
    const {
      item,
      commentData,
      hotFilmGroup
    } = await this.fetchData.getHome()

    this.item = item
    this.commentData = commentData
    this.hotFilmTab = (hotFilmGroup && hotFilmGroup[0].name) || ''
    this.hotFilmGroup = hotFilmGroup
  }

  // async initTrend() {
  //   const list = await this.fetchData.lastDaysIndex()
  //   this.trendList = list
  // }

  // async initSub() {
  //   const list = await this.fetchData.getSubList()
  //   this.subList = list
  // }

  // async initPutting() {
  //   const list = await this.fetchData.getTrack()
  //   this.putting = list
  // }

  mounted() {
    // const subWrap = this.$refs.subWrap as HTMLElement
    // if (subWrap != null) {
    //   this.bscroll = new BScroll(subWrap, {
    //     scrollX: true,
    //     scrollY: false,
    //     click: true,
    //     momentum: false
    //   })
    //   this.$nextTick(() => {
    //     this.bscrollOn = this.bscroll!.hasHorizontalScroll
    //   })
    // }
  }

  subPrev() {
    this.subScroll(false)
  }

  subNext() {
    this.subScroll(true)
  }

  subScroll(isNext: boolean) {
    const bs = this.bscroll
    if (bs == null) {
      return
    }
    const subWrap = this.$refs.subWrap as HTMLElement
    const width = subWrap.clientWidth
    const dx = isNext ? -width : width
    const xx = Math.min(Math.max(bs.x + dx, bs.maxScrollX), 0)
    const toX = xx + (isNext ? -58 : 58)
    bs.scrollTo(toX, 0, 300)
  }

  @Watch('type')
  @Watch('id')
  watchTypeAndId() {
    this.fetchData = new FetchData(this.type, this.id)
    this.init()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/style/platform/index.less';

.layout /deep/ .bubble-text-list {
  top: -68px;
  margin-left: 418px;
}

.main-content {
  width: 764px;
  margin-left: 74px;
}

.header-bar {
  display: flex;
  color: #fff;
  height: 96px;
  line-height: 96px;
  align-items: center;
  margin-top: -10px;
}

.item-title {
  font-size: 30px;
  font-weight: normal;
}

.button-manage {
  font-size: 14px;
  height: 32px;
  line-height: 28px;
  padding: 0 25px;
  border-radius: 88px;
  .button-style(#fff, #1a2530);
  margin-left: 13px;
}

.pane-group {
  display: flex;
  justify-content: space-between;
}

.hot-pane {
  width: 379px;
  min-height: 150px;
  border-radius: 6px 0 0 0;
}

.hot-wrap {
  display: flex;
  padding: 25px 0 0 21px;
}

.logo {
  width: 98px;
  height: 98px;
  background-color: #fff;
}

.hot-main {
  margin: -3px 0 0 22px;
}

.hot-value {
  color: #f0c749;
  font-size: 38px;
}

.hot-title {
  font-size: 14px;
  font-weight: normal;
}

.hot-node {
  margin: 22px 0 0 32px;
  line-height: 42px;
}

.hot-inc,
.hot-dec {
  display: inline-block;
  color: #ca7273;
  font-size: 20px;
  margin-left: 10px;
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 14px;
    background: url(./assets/inc.png) no-repeat center;
    background-size: 15px 14px;
  }
}

.hot-dec {
  &::before {
    transform: rotate(180deg);
  }
}

.fans-pane {
  width: 379px;
  min-height: 150px;
  border-radius: 0 6px 0 0;

  /deep/ .fans-content {
    padding-top: 0;
    margin-top: -4px;
    &::before {
      top: 15px;
    }
  }

  /deep/ .fans-man,
  /deep/ .fans-woman {
    position: relative;
    height: auto;
  }

  /deep/ .fans-man {
    padding-left: 80px;
    background-position: 119px top;
    .fans-rate {
      left: 52px;
    }
  }

  /deep/ .fans-woman {
    padding-right: 80px;
    background-position: 37px top;
    .fans-rate {
      right: 52px;
    }
  }

  /deep/ .fans-rate {
    position: absolute;
    top: 8px;
    margin-top: 0;
  }
}

.plan-pane {
  position: relative;
  min-height: 140px;
  margin-top: 6px;
}

.button-put {
  position: absolute;
  top: 0;
  left: 30px;
  width: 148px;
  line-height: 37px;
  padding: 0;
  font-size: 14px;
  border-radius: 88px;
  .button-style(#fff, #ca7273);
}

.plan-count-list {
  position: absolute;
  top: -40px;
  right: 18px;
  height: 85px;
  display: flex;
}

.plan-count-item {
  width: 182px;

  &:first-child {
    border-right: 2px solid rgba(255, 255, 255, 0.4);
  }

  &:last-child {
    border-left: 2px solid rgba(255, 255, 255, 0.4);
  }

  i,
  em {
    display: block;
    text-align: center;
  }

  em {
    font-size: 24px;
    margin-top: 22px;
  }
}

.film-pane {
  position: relative;
  overflow: hidden;
  margin-top: 6px;
  /deep/ .ivu-tabs {
    overflow: visible;
  }
  /deep/ .ivu-tabs-bar {
    position: absolute;
    top: -35px;
    left: 105px;
    color: #fff;
    border-bottom: 0;
    margin-bottom: 0;
  }
  /deep/ .ivu-tabs-tab {
    padding: 0 8px;
    line-height: 16px;
    font-size: 12px;
    border-radius: 8px;
    margin-right: 10px;
  }
  /deep/ .ivu-tabs-tab-active {
    color: #000;
    background-color: #32c3e1;
  }
  /deep/ .ivu-tabs-ink-bar {
    display: none;
  }
}

.film-wrap {
  max-height: 520px;
  overflow: auto;
}

.film-list {
  margin-top: 8px;
}

.film-item {
  position: relative;
  margin: 0 0 26px 12px;
}

.film-item-in {
  display: flex;
  color: #fff;
}

.film-figure {
  width: 78px;
  height: 108px;
}

.film-img {
  width: 100%;
  height: 100%;
}

.film-main {
  position: relative;
  width: 152px;
  margin: -8px 0 0 10px;
  font-size: 12px;
  line-height: 2;
}

.film-name {
  font-size: 16px;
}

.film-stats {
  position: absolute;
  left: 0;
  bottom: -5px;
  em {
    font-size: 16px;
  }
}

.film-item-hot {
  &::before {
    content: '正在热映';
    position: absolute;
    top: 0;
    left: 0;
    line-height: 24px;
    padding: 0 7px;
    font-size: 14px;
    text-align: center;
    color: #fff;
    background-color: #ff6d6d;
  }

  .film-stats {
    color: #ff8400;
  }
}
</style>
