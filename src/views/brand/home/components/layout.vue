<template>
  <div class="page">
    <section class="summary-bar pane-like">
      <div class="summary-name">
        <h3 class="summary-title">{{item.name}}</h3>
        <Button type="primary" :to="{}" class="button-manage">品牌管理</Button>
      </div>

      <div class="summary-hot">
        <h3 class="summary-title">昨日综合热度</h3>
        <div class="hot-node">
          <em class="hot-value">{{hot.value}}</em>
          <i :class="`hot-${hot.inc > 0 ? 'inc' : 'dec'}`" v-if="hot.inc != 0">{{hot.inc}}</i>
        </div>
        <TrendChart :value="hot.list" class="hot-chart"/>
      </div>

      <div class="summary-count">
        <h3 class="summary-title">进行的推广计划</h3>
        <div class="pop-count">{{popCount}}</div>
      </div>
    </section>

    <section class="content-box">
      <div class="content-left">
        <Pane title="百度搜索用户画像" :more="{}" class="baidu-pane">
          <ul class="baidu-list">
            <li class="baidu-item">
              <em>{{baidu.man}}</em>%
            </li>
            <li class="baidu-item">
              <em>{{baidu.woman}}</em>%
            </li>
          </ul>
        </Pane>

        <Pane title="评论分析" :more="{}" class="analyze-pane">
          <div
            class="analyze-summary"
            v-if="baidu.negativeInc != 0"
          >负面占比{{baidu.negativeInc > 0 ? '上升' : '下降'}} {{Math.abs(baidu.negativeInc)}}%</div>

          <ul class="analyze-list">
            <li class="analyze-item flex-mid">
              <em>{{baidu.positive}}%</em>正面
            </li>
            <li class="analyze-item flex-mid">
              <em>{{baidu.negative}}%</em>负面
            </li>
            <li class="analyze-item flex-mid">
              <em>{{baidu.neutral}}%</em>中立
            </li>
          </ul>
        </Pane>
      </div>

      <div class="content-main">
        <figure class="item-figure flex-mid">
          <img :src="item.figure || item.logo" class="item-img">
        </figure>

        <nav class="sub-bar pane-like" v-if="type == 'brand'">
          <label class="sub-name">{{subData.name}}</label>
          <div class="sub-main">
            <a
              class="sub-prev"
              :style="{ visibility: bscrollOn ? 'visible' : 'hidden' }"
              @click="subPrev"
            >&lt;</a>
            <div class="sub-wrap" ref="subWrap">
              <ul class="sub-list">
                <li v-for="it in subData.list" :key="it.id" class="sub-item">
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

        <Pane title="映前广告投放" :more="{}" class="putting-pane">

        </Pane>
      </div>

      <div class="content-right">
        <Pane title="KOL推广" :more="{}" class="kol-pane">
          <div class="count-stats" v-if="kol.pendCount > 0 || kol.runningCount > 0">
            <label>{{kol.pendCount}}个待处理</label>
            <label>{{kol.runningCount}}个执行中</label>
          </div>
          <div class="count-stats" v-else>
            <label>暂无推广计划</label>
            <router-link :to="{}">去创建 &gt;</router-link>
          </div>

          <ul class="kol-list">
            <li
              v-for="it in kol.recommendList"
              :key="it.id"
              class="kol-item"
              :class="{
                'item-recommended': it.recommended
              }"
            >
              <figure class="kol-figure">
                <img :src="it.avatar" class="kol-img">
              </figure>
              <a class="kol-add">加入投放</a>
              <div class="kol-name text-omit">
                <i :class="`platform-icon-${it.type}`"></i>
                <span>{{it.name}}</span>
              </div>
              <div class="kol-title text-omit" v-if="it.title">{{it.title}}</div>
              <div class="kol-fans text-omit" v-if="it.fans">
                关注数：<em>{{it.fans}}</em>
              </div>
            </li>
          </ul>
        </Pane>

        <Pane title="影片合作" :more="{}" class="film-pane">
          <div class="count-stats" v-if="film.pendCount > 0 || film.runningCount > 0">
            <label>{{film.pendCount}}个待处理</label>
            <label>{{film.runningCount}}个执行中</label>
          </div>
          <div class="count-stats" v-else>
            <label>暂无合作计划</label>
            <router-link :to="{}">去申请 &gt;</router-link>
          </div>

          <div class="film-recommend item-recommended">
            <figure class="film-figure">
              <img :src="film.recommend.cover" class="film-img">
            </figure>
            <div class="film-main">
              <div class="film-name text-omit">{{film.recommend.name}}</div>
              <div class="film-date">{{film.recommend.date}}</div>
              <div class="film-type text-omit">{{film.recommend.type}}</div>
              <div class="film-rate">
                用户匹配度：<em>{{film.recommend.rate}}</em>
              </div>
            </div>
          </div>

          <div class="film-acts">
            <Button type="primary" class="film-apply">申请合作</Button>
          </div>
        </Pane>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Pane from './pane.vue'
import TrendChart from '@/components/trendChart'
import BScroll from '@better-scroll/core'

type Type = 'brand' | 'item'

@Component({
  components: {
    Pane,
    TrendChart
  }
})
export default class BrandHomeLayout extends ViewBase {
  @Prop({ type: String, default: 'brand' }) type!: Type

  @Prop({ type: Number, default: 0 }) id!: number

  item = {
    name: '奥迪Q3',
    logo: 'https://picsum.photos/id/259/350/220',
    figure: 'https://picsum.photos/id/435/1920/1080'
    // figure: 'https://picsum.photos/id/260/640/480',
    // figure: 'https://picsum.photos/id/261/320/220',
    // figure: 'https://picsum.photos/id/235/1080/1920',
    // figure: 'https://picsum.photos/id/268/320/640',
  }

  // 综合热度
  hot = {
    value: '6,789',
    inc: -158,
    list: [10, 18, 28, 16, 19, 32, 38]
  }

  // 进行的推广计划
  popCount = 1

  baidu = {
    man: 58,
    woman: 42,
    negativeInc: 1.1,
    positive: 66.6,
    negative: 30,
    neutral: 20
  }

  // 产品数据
  subData = {
    name: '车　型',
    list: new Array(15).fill(1).map((it, i) => ({
      id: i + 1,
      name: `奥迪Audi X${i + 1}`
    }))
  }

  // 广告投放数据
  putting = [
    { name: '1月', cost: 200000, exposure: 300000 },
    { name: '2月', cost: 300000, exposure: 380000 },
    { name: '4月', cost: 180000, exposure: 420000 },
    { name: '5月', cost: 280000, exposure: 320000 },
    { name: '8月', cost: 100000, exposure: 520000 },
    { name: '10月', cost: 380000, exposure: 260000 },
    { name: '12月', cost: 680000, exposure: 880000 }
  ]

  kol = {
    pendCount: 2,
    runningCount: 2,
    recommendList: [
      {
        id: 1,
        type: 'weibo',
        name: '莫言清风不识字',
        avatar: 'https://randomuser.me/api/portraits/women/66.jpg',
        title: '中国非著名骑车评论员、鲁迅文学院卫生管理员',
        fans: '94,869',
        recommended: true
      },

      {
        id: 2,
        type: 'wechat',
        name: '西门吹雪',
        avatar: 'https://randomuser.me/api/portraits/women/60.jpg',
        title: '汽车达人',
        fans: '85,869'
      }
    ]
  }

  film = {
    pendCount: 0,
    runningCount: 0,
    recommend: {
      id: 1,
      name: '莫言清风不识字',
      cover: 'https://picsum.photos/id/268/320/480',
      date: '2019-09-30上映',
      type: '剧情/冒险',
      rate: '88%'
    }
  }

  bscroll: BScroll | null = null

  bscrollOn = false

  mounted() {
    const subWrap = this.$refs.subWrap as HTMLElement
    if (subWrap != null) {
      this.bscroll = new BScroll(subWrap, {
        scrollX: true,
        scrollY: false,
        click: true,
        momentum: false,
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
  height: 308px;
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
  margin-top: 10px;
  padding-bottom: 20px;
}

.film-recommend {
  display: flex;
  margin: 44px 0 0 11px;
  &::before {
    top: -28px;
  }
}

.film-figure {
  width: 110px;
  height: 158px;
}

.film-img {
  width: 100%;
  height: 100%;
}

.film-main {
  width: 120px;
  margin: -8px 0 0 8px;
  font-size: 12px;
  line-height: 2;
}

.film-name {
  font-size: 20px;
}

.film-rate {
  color: #ff6d6d;
  margin-top: 18px;
  em {
    font-size: 16px;
  }
}

.film-acts {
  margin-top: 10px;
  text-align: center;
}

.film-apply {
  width: 108px;
  height: 30px;
  padding: 0;
  .button-style(14px);
}
</style>
