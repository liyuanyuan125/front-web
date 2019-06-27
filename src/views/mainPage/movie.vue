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
          :movie="movie"
          :actorData="actorData"
          :more="{ name: 'film-detail-information', params: { id } }"
        >
          <router-link
            :to="{
              name: 'film-filmorder-addmovielist',
              params: { id: id }
            }"
            class="button-apply"
          >立即申请</router-link>
        </BasicPane>
      </div>

      <section class="board-pane">
        <div class="board-row flex-box">
          <FansPane
            title="想看用户画像"
            :man="fansRate.man"
            :woman="fansRate.woman"
            :more="{ name: 'film-detail-fans', params: {id} }"
            class="fans-pane"
            v-if="fansRate"
          />
          <!-- TODO: FansPane tip="与奔驰用户匹配度：72%" -->

          <div class="pane-group">
            <TextPane
              :title="boxToday.title"
              :main="boxToday.main"
              :sub="boxToday.sub"
              class="box-today"
              v-if="boxToday != null"
            />
            <TextPane
              :title="boxTotal.title"
              :main="boxTotal.main"
              class="box-total"
              v-if="boxTotal != null"
            />
          </div>
        </div>

        <div class="board-row" v-if="riseData">
          <BarPane
            :title="hasShow ? '近7日观影人次' : '近7日新增想看'"
            :data="riseData"
            :more="{ name: 'film-detail-trend', params: {id} }"
            class="active-fans-pane"
          />
        </div>

        <div class="board-row" v-if="hotData && hotData.length > 0">
          <HotPane
            title="全网热度"
            :data="hotData"
            :more="{ name: 'film-detail-hot', params: {id} }"
            tooltip=""
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
import BarPane from './components/barPane.vue'
import HotPane from './components/hotPane.vue'
import TextPane from './components/textPane.vue'

import { getMovie, getVideoRise, getVideoHot } from './data'

@Component({
  components: {
    Layout,
    BasicPane,
    FansPane,
    BarPane,
    HotPane,
    TextPane
  }
})
export default class MoviePage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  bubbleList: string[] = []

  basic: any = null

  hasShow = false

  bigFigure = ''

  movie: any = null

  actorData: any = null

  fansRate: any = null

  boxToday: any = null

  boxTotal: any = null

  riseData: any = null

  hotData: any[] = []

  hotFormatter([{ dataIndex }]: any) {
    const { value, rank } = this.hotData[dataIndex]
    return `综合热度：${+value || '-'}<br>排名：${+rank || '-'}`
  }

  created() {
    this.init()
  }

  init() {
    this.initMain()
    this.initHot()
  }

  async initMain() {
    const {
      bubbleList,
      basic,
      hasShow,
      movie,
      actorData,
      fansRate,
      boxToday,
      boxTotal
    } = await getMovie(this.id)

    this.bubbleList = bubbleList
    this.basic = basic
    this.hasShow = hasShow
    this.movie = movie
    this.actorData = actorData
    this.fansRate = fansRate
    this.boxToday = boxToday
    this.boxTotal = boxTotal

    // 拿到 hasShow 后，再调用 initRise
    this.initRise()
  }

  async initRise() {
    const riseData = await getVideoRise(this.id, this.hasShow)
    this.riseData = riseData
  }

  async initHot() {
    const hotData = await getVideoHot(this.id)
    this.hotData = hotData
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
  /deep/ .name-zone {
    padding-bottom: 24px;
  }
  /deep/ .figure {
    top: 42px;
    width: 154px;
    height: 218px;
    border-radius: 4px;
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
  opacity: 0.6;
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
  &:last-child .pane-item {
    border-radius: 0 0 5px 5px;
  }
}

.fans-pane {
  border-radius: 5px 0 0 0;
}

.hot-pane {
  height: 314px;
}

.offer-pane {
  border-radius: 0 0 5px 5px;
}

.box-today {
  border-radius: 0 5px 0 0;
}

.box-total {
  margin-top: 6px;
}

.button-apply {
  position: absolute;
  top: 218px;
  right: -91px;
  width: 154px;
  line-height: 42px;
  color: #d3615b !important;
  border-radius: 0 0 4px 4px;
  background-color: #fbd76c;
  font-size: 18px;
  text-align: center;
  opacity: 0.88;
  &:hover {
    opacity: 1;
  }
}
</style>
