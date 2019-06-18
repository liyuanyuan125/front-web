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
            :man="fansMan"
            :woman="fansWoman"
            :more="{ name: 'film-detail-fans', params: {id} }"
            tip="与奔驰用户匹配度：72%"
            class="fans-pane"
          />
          <div class="pane-group">
            <TextPane
              title="今日实时票房"
              :main="boxOfficeToday.main"
              :sub="boxOfficeToday.sub"
              class="box-office-today"
            />
            <TextPane title="累计票房" :main="boxOfficeTotal.main" class="box-office-total"/>
          </div>
        </div>

        <div class="board-row">
          <BarPane
            title="近7日新增想看人数"
            :data="activeFansData"
            :more="{ name: 'film-detail-trend', params: {id} }"
            class="active-fans-pane"
          />
        </div>

        <div class="board-row">
          <HotPane
            title="全网热度"
            :data="hotData"
            :more="{ name: 'film-detail-hot', params: {id} }"
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
import BarPane from './components/barPane.vue'
import HotPane from './components/hotPane.vue'
import TextPane from './components/textPane.vue'

import { getMovie } from './data'

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
export default class FigurePage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  basic = {
    id: this.id,
    name: '流浪地球',
    subName: 'The Wandering Earth',
    title: '',
    figure: 'https://picsum.photos/id/428/154/218',
    rankNo: '86.5',
    rankTitle: '同档期：第2'
  }

  bigFigure =
    this.id == 1
      ? 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bjnoh5p3lbm00083qlb0.png'
      : ''

  boxOfficeToday = {
    main: '116.3 万',
    sub: '同档期第一'
  }

  boxOfficeTotal = {
    main: '3.8 亿'
  }

  fansMan = 66

  fansWoman = 34

  bubbleList = ['师兄李连杰', '流浪地球', '教练吴彬', '功夫小子', '导演', '少林寺']

  movie = {
    preview: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    director: '林德路',
    type: '动作/犯罪',
    date: '2019-04-03',
    address: '香港'
  }

  actorData = {
    star: 2,
    list: [
      { id: 1, name: '吴京', avatar: 'https://dummyimage.com/80x80/000/fff' },
      { id: 2, name: '阿娇', avatar: 'https://dummyimage.com/80x80/fff/000' },
      { id: 3, name: '吴奇隆', avatar: 'https://dummyimage.com/80x80/e2e/fff' }
    ],
    more: {
      name: 'film-figure',
      params: { id: this.id }
    }
  }

  activeFansData = [
    { name: '5-16', value: 855000 },
    { name: '5-17', value: 800000 },
    { name: '5-18', value: 808000 },
    { name: '5-19', value: 860000 },
    { name: '5-20', value: 600000 },
    { name: '5-21', value: 755000 },
    { name: '5-22', value: 555000 }
  ]

  legendList = [
    { name: '新浪', no: 'No.3', inc: 0 },
    { name: '微信', no: 'No.2', inc: -2 },
    { name: '百度', no: 'No.4', inc: 8 },
    { name: '头条', no: 'No.1', inc: 3 }
  ]

  hotData = [
    { name: '5-16', value: 855000, rank: 1 },
    { name: '5-17', value: 100000, rank: 2 },
    { name: '5-18', value: 808000, rank: 8 },
    { name: '5-19', value: 260000, rank: 6 },
    { name: '5-20', value: 600000, rank: 5 },
    { name: '5-21', value: 755000, rank: 3 },
    { name: '5-22', value: 555000, rank: 2 }
  ]

  hotFormatter([{ dataIndex }]: any) {
    const { value, rank } = this.hotData[dataIndex]
    return `综合热度：${value}<br>男演员排名：${rank}`
  }

  created() {
    this.init()
  }

  init() {
    this.initBasic()
  }

  async initBasic() {
    const data = await getMovie(this.id)
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
  min-width: 580px;
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

.box-office-today {
  border-radius: 0 5px 0 0;
}

.box-office-total {
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
