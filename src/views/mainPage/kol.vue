<template>
  <Layout
    :bubbleList="bubbleList"
    :bubbleLink="{ name: 'kol-detail-comment', params: { id } }"
    :class="bigFigure ? 'layout-big-figure' : ''"
  >
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
          :brandData="brandData"
          :fansList="fansList"
          :more="{ name: 'kol-detail-platform', params: { id } }"
          :favGet="favGet"
          :favSet="favSet"
        />
      </div>

      <section class="board-pane">
        <nav class="flatform-nav" v-if="navList && navList.length > 1">
          <router-link
            v-for="it in navList"
            :key="it.icon"
            :to="{ name: 'kol-figure', params: { id, channel: it.icon } }"
            class="flatform-nav-item"
            :class="{'flatform-nav-on': it.icon == channel}"
          >
            <i :class="`platform-icon-${it.icon}`"></i>
            <span class="platform-name">{{it.name}}</span>
          </router-link>
        </nav>

        <div class="board-row flex-box">
          <FansPane
            title="粉丝画像"
            :man="fansRate.man"
            :woman="fansRate.woman"
            :more="{ name: 'kol-detail-fans', params: { id, channel } }"
            class="fans-pane"
            v-if="fansRate"
          />
          <!-- TODO: FansPane tip="与奔驰用户匹配度：72%" -->

          <PiePane
            title="近7日评论分析"
            :more="{ name: 'kol-detail-comment', params: { id, channel } }"
            :data="commentData"
            :formatter="commentFormatter"
            class="comment-pane"
          />
        </div>

        <div class="board-row">
          <HotPane
            :title="hotData.title"
            :data="hotData.list"
            :more="{ name: 'kol-detail-platform', params: { id, channel } }"
            :formatter="hotFormatter"
            class="hot-pane"
            v-if="hotData"
          />
        </div>

        <div class="board-row">
          <OpusPane
            title="热门作品"
            :data="opusData"
            :more="{ name: 'kol-detail-opus', params: { id, channel }}"
            class="opus-pane"
            v-if="opusData"
          />
        </div>

        <div class="board-row" v-if="offerData">
          <OfferPane
            :title="offerData.title"
            :priceList="offerData.priceList"
            class="offer-pane"
          />
        </div>
      </section>
    </div>
  </Layout>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Layout from './components/layout.vue'
import BasicPane from './components/basicPane.vue'
import FansPane from './components/fansPane.vue'
import PiePane from './components/piePane.vue'
import HotPane from './components/hotPane.vue'
import OpusPane from './components/opusPane.vue'
import OfferPane from './components/offerPane.vue'
import { getKol } from './data'
import { kolHasFav, kolSetFav } from './fav'
import { readableThousands } from '@/util/dealData'
import { setPageTitle } from '@/util/browser'

@Component({
  components: {
    Layout,
    BasicPane,
    FansPane,
    PiePane,
    HotPane,
    OpusPane,
    OfferPane
  }
})
export default class FigurePage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: 'weibo' }) channel!: string

  bubbleList: string[] = []

  basic: any = null

  bigFigure = ''

  fansRate: any = null

  fansList: any[] = []

  navList: any[] | null = null

  brandData: any = null

  commentData: any = null

  hotData: any = null

  opusData: any = null

  offerData: any = null

  favGet = kolHasFav

  favSet = kolSetFav

  commentFormatter({ seriesName, dataIndex }: any) {
    const { name, value, trend } = this.commentData[dataIndex]
    const inc = trend > 0 ? `(上升${trend}%)` : trend < 0 ? `(下降${-trend}%)` : ''
    return `${seriesName}<br>${name}：${value}%${inc}`
  }

  hotFormatter([{ dataIndex }]: any) {
    const { category } = this.hotData
    const { value, categoryRank } = this.hotData.list[dataIndex]
    return `综合热度：${readableThousands(value)}`
      + (category ? `<br>${category}排名：${readableThousands(categoryRank)}` : '')
  }

  created() {
    this.init()
  }

  init() {
    this.initMain()
  }

  async initMain() {
    const {
      bubbleList,
      basic,
      fansRate,
      fansList,
      navList,
      brandData,
      commentData,
      hotData,
      opusData,
      offerData
    } = await getKol({
      id: this.id,
      channel: this.channel
    })

    // 检查 channel 是否在 navList 中，若不在，就强制跳转到第一个 nav
    const navItem = navList.find(it => it.icon == this.channel)
    if (navItem == null && navList.length > 0) {
      const firstNav = navList[0]
      this.$router.push({
        name: 'kol-figure',
        params: { id: this.id as any, channel: firstNav.icon }
      })
      return
    }

    this.bubbleList = bubbleList
    this.basic = basic
    this.fansRate = fansRate
    this.fansList = fansList
    this.navList = navList
    this.brandData = brandData
    this.commentData = commentData
    this.hotData = hotData
    this.opusData = opusData
    this.offerData = offerData

    setPageTitle(`${basic.name}-鲸鱼数据`)
  }

  @Watch('channel')
  watchChannel() {
    this.init()
  }
}
</script>

<style lang="less" scoped>
@import '~@/style/platform/index.less';

.main-content {
  position: relative;
  justify-content: space-between;
  padding-right: 80px;
  /deep/ .brand-list {
    padding-right: 42px;
  }
  // 产品说：先隐藏
  /deep/ .rank-title {
    display: none;
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
  width: 580px;
  margin-top: 19px;
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
  /deep/ .chart {
    height: 202px;
  }
}

.offer-pane {
  border-radius: 0 0 5px 5px;
}
</style>
