<template>
  <div class="page">
    <section class="summary-bar pane-like">
      <div class="summary-name">
        <h3 class="summary-title">{{item.name}}</h3>
        <Button type="primary" :to="{ name: 'brand-list' }" class="button-manage">品牌管理</Button>
      </div>

      <div class="summary-hot">
        <h3 class="summary-title">昨日综合热度</h3>
        <div class="hot-node">
          <em class="hot-value">{{item.jyIndex}}</em>
          <i
            :class="`hot-${item.jyTrend > 0 ? 'inc' : 'dec'}`"
            v-if="item.jyTrend != 0"
          >{{item.jyTrend}}</i>
        </div>
        <TrendChart :value="trendList" class="hot-chart"/>
      </div>

      <div class="summary-count">
        <h3 class="summary-title">进行的推广计划</h3>
        <div class="pop-count">{{item.onExecuteCount}}</div>
      </div>
    </section>

    <section class="content-box">
      <div class="content-left">
        <Pane title="百度搜索用户画像" :more="{name: 'brand-homedetail-fans', params: {id}}" class="baidu-pane">
          <ul class="baidu-list">
            <li class="baidu-item">
              <em>{{item.malePercent}}</em>%
            </li>
            <li class="baidu-item">
              <em>{{item.femalePercent}}</em>%
            </li>
          </ul>
        </Pane>

        <Pane
          title="近7日评论情绪"
          :more="{name: 'brand-homedetail-comment', params: { id }}"
          class="analyze-pane"
        >
          <PieChart title="近7日评论情绪" :data="commentData" v-if="commentData"/>

          <WordCloud v-bind="wordCloudGood" v-if="wordCloudGood"/>

          <WordCloud v-bind="wordCloudBad" v-if="wordCloudBad"/>
        </Pane>
      </div>

      <div class="content-main">
        <figure class="item-figure flex-mid">
          <img :src="item.figure || item.logoUrl" class="item-img">
        </figure>

        <nav class="sub-bar pane-like" v-if="type == 'brand' && subList.length > 0">
          <label class="sub-name">产　品</label>
          <div class="sub-main">
            <a
              class="sub-prev"
              :style="{ visibility: bscrollOn ? 'visible' : 'hidden' }"
              @click="subPrev"
            >&lt;</a>
            <div class="sub-wrap" ref="subWrap">
              <ul class="sub-list">
                <li v-for="it in subList" :key="it.id" class="sub-item">
                  <router-link
                    :to="{
                      name: 'brand-item',
                      params: { brandId: id, id: it.id }
                    }"
                  >{{it.name}}</router-link>
                </li>
              </ul>
            </div>
            <a
              class="sub-next"
              :style="{ visibility: bscrollOn ? 'visible' : 'hidden' }"
              @click="subNext"
            >&gt;</a>
          </div>
        </nav>

        <Pane title="映前广告投放" :more="{name: 'pop-planlist'}" class="putting-pane">
          <ThrowPane :data="putting"/>
        </Pane>
      </div>

      <div class="content-right">
        <Pane title="热门影片" class="film-pane" v-if="hotFilmGroup">
          <Tabs v-model="hotFilmTab">
            <TabPane
              v-for="it in hotFilmGroup"
              :key="it.name"
              :name="it.name"
              :label="it.name"
            >
              <div class="film-wrap">
                <ul class="film-list">
                  <li
                    v-for="sub in it.list"
                    :key="sub.id"
                    class="film-item"
                    :class="{'film-item-hot': sub.hasShow}"
                  >
                    <figure class="film-figure">
                      <img :src="sub.movieMainPic" class="film-img">
                    </figure>
                    <div class="film-main">
                      <div class="film-name text-omit">{{sub.name}}</div>
                      <div class="film-index">鲸娱指数：{{sub.jyIndex}}</div>
                      <div class="film-date">{{sub.date}}上映</div>
                      <div class="film-stats text-omit" v-if="sub.hasShow">
                        已上映{{sub.showDays}}天，累计{{sub.custom}}
                      </div>
                      <div class="film-stats text-omit" v-else>
                        预估票房：<em>{{sub.customPredict}}</em>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </TabPane>
          </Tabs>
          <Button
            type="primary"
            :to="{ name: 'pop-planlist-add', params: { id: 0 } }"
            class="button-put"
          >投放映前广告</Button>
        </Pane>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Pane from './pane.vue'
import TrendChart from '@/components/trendChart'
import BScroll from '@better-scroll/core'
import ThrowPane from './throwPane.vue'
import PieChart from './pieChart.vue'
import WordCloud from '@/components/chartsGroup/wordCloud'

import { dayOffsetRange } from '@/util/date'
import FetchData from './fetchData'
import { Type } from './types'

@Component({
  components: {
    Pane,
    TrendChart,
    ThrowPane,
    PieChart,
    WordCloud
  }
})
export default class BrandHomeLayout extends ViewBase {
  @Prop({ type: String, default: 'brand' }) type!: Type

  @Prop({ type: Number, default: 0 }) id!: number

  get isBrand() {
    return this.type == 'brand'
  }

  get isItem() {
    return this.type == 'item'
  }

  fetchData = new FetchData(this.type, this.id)

  item = {}

  // 综合热度
  trendList = []

  commentData: any = null

  wordCloudGood: any = null

  wordCloudBad: any = null

  // 产品数据
  subList: any = []

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
    this.initTrend()
    // 产品调整，暂时不显示品牌下的产品
    // this.isBrand && this.initSub()
    this.initPutting()
  }

  async initHome() {
    const {
      item,
      commentData,
      wordCloudGood,
      wordCloudBad,
      hotFilmGroup
    } = await this.fetchData.getHome()

    this.item = item
    this.commentData = commentData
    this.wordCloudGood = wordCloudGood
    this.wordCloudBad = wordCloudBad
    this.hotFilmTab = hotFilmGroup && hotFilmGroup[0].name || ''
    this.hotFilmGroup = hotFilmGroup
  }

  async initTrend() {
    const list = await this.fetchData.lastDaysIndex()
    this.trendList = list
  }

  async initSub() {
    const list = await this.fetchData.getSubList()
    this.subList = list
  }

  async initPutting() {
    const list = await this.fetchData.getTrack()
    this.putting = list
  }

  mounted() {
    const subWrap = this.$refs.subWrap as HTMLElement
    if (subWrap != null) {
      this.bscroll = new BScroll(subWrap, {
        scrollX: true,
        scrollY: false,
        click: true,
        momentum: false
      })
      this.$nextTick(() => {
        this.bscrollOn = this.bscroll!.hasHorizontalScroll
      })
    }
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

@color-bar: fade(#35c4de, 50);

.button-style(@fontSize: 12px) {
  font-size: @fontSize;
  color: #fff;
  border-radius: 88px;
  background-color: #008ed7;
  text-align: center;
  &:hover {
    opacity: .88;
  }
}

.pane-like {
  border: 1px solid rgba(68, 216, 254, 0.6);
  background-color: rgba(0, 20, 33, 0.5);
}

.page {
  position: relative;
  padding: 20px 0 40px;
}

.summary-bar {
  display: flex;
  width: 720px;
  height: 80px;
  color: #fff;
  margin: auto;
  user-select: none;
}

.summary-name,
.summary-count {
  position: relative;
  width: 212px;
}

.summary-hot {
  position: relative;
  flex: 1;
  display: flex;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 9px;
    width: 2px;
    height: 62px;
    background-color: @color-bar;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
}

.summary-title {
  position: absolute;
  top: 9px;
  left: 16px;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
}

.button-manage {
  margin: 36px 0 0 16px;
  font-size: 14px;
  line-height: 30px;
  padding: 0 25px;
  border-radius: 88px;
  .button-style(#fff, #0383c2);
}

.hot-node {
  margin: 32px 0 0 16px;
  line-height: 42px;
}

.hot-value,
.pop-count {
  font-size: 42px;
}

.hot-inc,
.hot-dec {
  position: relative;
  top: -6px;
  font-size: 20px;
  margin-left: 6px;
  vertical-align: top;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 24px;
    width: 100%;
    height: 14px;
    background: url(./assets/inc.png) no-repeat center;
    background-size: 15px 14px;
  }
}

.hot-dec {
  &::after {
    transform: rotate(180deg);
  }
}

.hot-chart {
  width: 96px;
  height: 42px;
  margin: 20px 0 0 11px;
}

.pop-count {
  margin: 32px 0 0 16px;
  line-height: 42px;
}

.content-box {
  display: flex;
  margin-top: 1px;
}

.content-left {
  width: 248px;
}

.baidu-pane {
  border-bottom: 0;
}

.analyze-pane {
  border-top: 0;
  padding-top: 20px;
  padding-bottom: 19px;
  // 由于 WordCloud 设计不良，这里需要强制覆盖一些样式
  /deep/ .word-cloud {
    margin-top: 20px;
    .title-box {
      text-align: left;
      text-indent: 18px;
    }
  }
}

.baidu-list {
  display: flex;
  font-size: 16px;
  padding: 6px 0 24px;
  margin: 0 18px;
  border-bottom: 2px solid @color-bar;
}

.baidu-item {
  flex: 1;
  padding-left: 30px;
  background: url(./assets/man.png) no-repeat left center;
  &:last-child {
    background-image: url(./assets/woman.png);
  }
  em {
    font-size: 36px;
  }
}

.analyze-summary,
.analyze-list {
  padding: 0 18px;
}

.analyze-summary {
  color: #ff8687;
}

.analyze-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: -5px 0 48px;
}

.analyze-item {
  position: relative;
  flex-direction: column;
  margin-top: 49px;
  width: 156px;
  height: 109px;
  line-height: 28px;
  background: url(./assets/positive.png) no-repeat center;
  background-size: cover;

  em {
    font-size: 24px;
    margin-top: -8px;
  }

  &:nth-child(2) {
    width: 96px;
    height: 92px;
    line-height: 24px;
    background-image: url(./assets/negative.png);
    em {
      font-size: 20px;
    }
  }

  &:last-child {
    width: 58px;
    height: 54px;
    line-height: 18px;
    background-image: url(./assets/neutral.png);
    font-size: 13px;
    em {
      font-size: 18px;
      margin-top: -4px;
    }
  }
}

.content-main {
  flex: 1;
  margin: 0 20px;
}

.item-figure {
  position: relative;
  height: 342px;
  padding: 20px;
  box-sizing: border-box;
}

.item-img {
  max-width: 100%;
  max-height: 100%;
}

.sub-bar {
  display: flex;
  align-items: center;
  height: 38px;
  line-height: 38px;
  color: #fff;
  font-size: 14px;
  user-select: none;
  box-sizing: content-box;
}

.sub-name {
  display: inline-block;
  padding: 0 18px;
  height: 30px;
  line-height: 30px;
  border-right: 2px solid @color-bar;
}

.sub-main {
  flex: 1;
  position: relative;
  display: flex;
}

.sub-prev,
.sub-next {
  display: inline-block;
  width: 42px;
  color: #33c3e0;
  font-size: 18px;
  text-align: center;
  position: relative;
  top: -1px;
  &:hover {
    opacity: 0.7;
  }
}

.sub-wrap {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.sub-list {
  position: absolute;
  display: flex;
  cursor: move;
}

.sub-item {
  white-space: nowrap;
  margin-right: 24px;
  a {
    display: inline-block;
    color: #fff;
    padding: 0 2px;
    font-weight: 500;
    &:hover {
      opacity: 0.88;
    }
  }
}

.content-right {
  width: 270px;
}

.count-stats {
  line-height: 46px;
  font-size: 16px;
  background-color: fade(#11333a, 80);
  text-align: center;
  > label,
  > a {
    margin: 0 18px;
  }
}

.kol-list {
  display: flex;
  padding: 20px 10px 14px;
  color: rgba(255, 255, 255, .9);
  line-height: 24px;
}

.kol-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}

.item-recommended {
  position: relative;
  &::before {
    content: '推荐';
    position: absolute;
    top: -6px;
    left: 2px;
    width: 48px;
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    color: fade(#000, 90);
    background-color: #ff6d6d;
    text-align: center;
  }
}

.kol-figure {
  width: 74px;
  height: 74px;
  border: 1px solid @color-bar;
  border-radius: 50%;
  overflow: hidden;
}

.kol-add {
  display: block;
  width: 84px;
  height: 24px;
  line-height: 24px;
  margin-top: -5px;
  .button-style;
}

.kol-name,
.kol-title,
.kol-fans {
  max-width: 120px;
}

.kol-name {
  display: flex;
  align-items: center;
  margin-top: 6px;
  [class^=platform-icon] {
    transform: scale(.7);
  }
  .platform-icon-wechat {
    width: 22px;
  }
}

.kol-img {
  width: 100%;
  height: 100%;
}

.film-pane {
  position: relative;
  overflow: hidden;
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
  color: #fff;
  margin-top: 8px;
}

.film-item {
  position: relative;
  display: flex;
  margin: 0 0 26px 12px;
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

.button-put {
  display: block;
  width: 180px;
  line-height: 48px;
  padding: 0;
  border-radius: 88px;
  margin: 25px auto;
  .button-style(#fff, #4ae0fd);
}
</style>
