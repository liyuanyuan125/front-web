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

      <Pane :title="recommendTitle" class="recommend-pane" v-if="recommendList">
        <NavSwiper
          :options="{
            slidesPerView: 2
          }"
          class="recommend-swiper"
        >
          <swiper-slide
            v-for="(it, i) in recommendList"
            :key="it.id"
            class="recommend-item"
          >
            <router-link
              :to="{ name: 'film-movie', params: { id: it.id } }"
              class="recommend-item-in"
            >
              <i class="recommend-no">{{i + 1}}</i>

              <figure class="recommend-figure">
                <img :src="it.movieMainPicUrl" class="recommend-img">
              </figure>

              <div class="recommend-main">
                <div class="recommend-name text-omit">{{it.name}}</div>
                <div class="recommend-type text-omit">{{it.runningTime}}分钟 - {{it.typeName}}</div>
                <div class="recommend-director text-omit">导演：{{it.directorName}}</div>
                <div class="recommend-actor text-omit">主演：{{it.actorName}}</div>
                <div class="recommend-stats text-omit">
                  {{it.hasShow ? '累计' : '预估'}}票房：<em>{{it.boxOffice}}</em>
                </div>
              </div>
            </router-link>
          </swiper-slide>
        </NavSwiper>
      </Pane>

      <Pane title="热门影片" class="film-pane" v-if="hotFilmGroup">
        <Tabs v-model="hotFilmTab">
          <TabPane v-for="(it, i) in hotFilmGroup" :key="it.name" :name="it.name" :label="it.name">
            <NavSwiper class="film-swiper">
              <swiper-slide
                v-for="sub in it.list"
                :key="sub.id"
                class="film-item"
              >
                <router-link
                  :to="{ name: 'film-movie', params: { id: sub.id } }"
                  class="film-item-in"
                >
                  <figure class="film-figure">
                    <img :src="sub.movieMainPicUrl" class="film-img">
                  </figure>
                  <div class="film-main">
                    <div class="film-name text-omit">{{sub.name}}</div>
                    <div class="film-date">上映日期：{{sub.date}}</div>
                    <div class="film-stats text-omit">
                      {{sub.hasShow ? '累计' : '预估'}}票房：<em>{{sub.boxOffice}}</em>
                    </div>
                  </div>
                </router-link>
              </swiper-slide>
            </NavSwiper>
          </TabPane>
        </Tabs>

        <Button
          type="primary"
          :to="{ name: 'pop-planlist-add', params: { id: 0 } }"
          class="button-put"
        >创建广告计划</Button>
      </Pane>
    </main>
  </Layout>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Layout from '../../components/layout.vue'
import Pane from '../../components/pane.vue'
import FansPane from '../../components/fansPane.vue'

import FetchData from './fetchData'
import { Type } from './types'
import { toThousands } from '@/util/dealData'

import NavSwiper from './navSwiper.vue'
import { swiperSlide } from 'vue-awesome-swiper'

import moment from 'moment'

@Component({
  components: {
    Layout,
    Pane,
    FansPane,
    NavSwiper,
    swiperSlide
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

  bubbleList: string[] = []

  item = {}

  commentData: any = null

  recommendList: any = null

  hotFilmTab = ''

  hotFilmGroup: any = null

  get recommendTitle() {
    const year = moment().year()
    return `${year}重点推荐影片`
  }

  created() {
    this.init()
  }

  init() {
    this.initHome()
  }

  async initHome() {
    const {
      item,
      commentData,
      recommendList,
      hotFilmGroup,
      bubbleList
    } = await this.fetchData.getHome()

    this.item = item
    this.commentData = commentData
    this.recommendList = recommendList
    this.hotFilmTab = (hotFilmGroup && hotFilmGroup[0].name) || ''
    this.hotFilmGroup = hotFilmGroup
    this.bubbleList = bubbleList
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
  > .pane-item:last-child {
    border-radius: 0 0 6px 6px;
  }
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

.recommend-pane {
  position: relative;
  margin-top: 6px;
  min-height: 236px;
}

.recommend-swiper {
  width: 666px;
  margin: -8px auto 0;
  /deep/ .swiper-container {
    padding-top: 13px;
  }
}

.recommend-item-in {
  position: relative;
  display: flex;
  width: 250px;
  height: 116px;
  color: #fff;
  font-size: 12px;
  margin-left: 28px;
}

.recommend-no {
  position: absolute;
  top: -13px;
  left: -13px;
  width: 26px;
  height: 26px;
  line-height: 26px;
  color: #fff;
  border-radius: 50%;
  background-color: #ca7273;
  text-align: center;
}

.recommend-figure {
  width: 81px;
  height: 116px;
}

.recommend-img {
  width: 100%;
  height: 100%;
}

.recommend-main {
  position: relative;
  margin-left: 10px;
  max-width: 158px;
  line-height: 1.6;
}

.recommend-type {
  margin-top: 5px;
}

.recommend-stats {
  position: absolute;
  left: 0;
  bottom: 3px;
  em {
    color: #ca7273;
  }
}

.film-pane {
  position: relative;
  margin-top: 6px;
  padding-bottom: 35px;

  /deep/ .pane-head {
    padding: 24px 0 6px;
    margin: 0 30px;
    border-bottom: 1px solid rgba(255, 255, 255, .4);
  }

  /deep/ .ivu-tabs {
    overflow: visible;
  }

  /deep/ .ivu-tabs-bar {
    position: absolute;
    top: -29px;
    right: -12px;
    color: #fff;
    border-bottom: 0;
    margin-bottom: 0;
  }

  /deep/ .ivu-tabs-tab {
    padding: 2px 12px;
    line-height: 16px;
    font-size: 12px;
    font-weight: 600;
    margin-right: 42px;
  }

  /deep/ .ivu-tabs-tab-active {
    color: #001f2c;
    background-color: #fff;
  }

  /deep/ .ivu-tabs-ink-bar {
    display: none;
  }

  .button-put {
    position: static;
    display: block;
    margin: auto;
  }
}

.film-swiper {
  width: 666px;
  margin: 22px auto 30px;
}

.film-list {
  left: 18px;
  margin-top: 8px;
}

.film-item {
  position: relative;
}

.film-item-in {
  display: block;
  color: #fff;
}

.film-figure {
  width: 82px;
  height: 114px;
}

.film-img {
  width: 100%;
  height: 100%;
}

.film-main {
  position: relative;
  font-size: 12px;
  line-height: 1.8;
}

.film-name {
  margin-top: 8px;
}

.film-stats {
  em {
    color: #ca7273;
  }
}
</style>
