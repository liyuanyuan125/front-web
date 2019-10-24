<template>
  <div>
    <section class="pane-wp">
      <h4 class="pane-head flex-box">
        <em>
          {{title}}
        </em>
      </h4>
      <div class="pane-body">
        <div class="nodata-wp" v-if="citysData.length === 0 && !sex.femalePercent && !sex.malePercent">
          暂无数据
        </div>
        <div class="user-content-wp" v-else>
          <div class="left">
            <div class="user-pane-group" style="width: 49.2%; height: 310px">
              <div class="user-pane-head">
                <h6>性别分布</h6>
              </div>
              <div class="user-pane-body">
                <SexCompare :data="sex"></SexCompare>
              </div>
            </div>
            <div class="user-pane-group" style="width: 49.2%; margin-left: 0.6%;height: 310px">
              <div class="user-pane-head">
                <h6>线级分布</h6>
              </div>
              <div class="user-pane-body" style="padding: 5px">
                <PieNest :initDone="cityLevel.initDone" :dict1="cityLevel.dict1" :dict2="cityLevel.dict2" :height="cityLevel.height" :toolTip="tooltipStyles({trigger:  'item', formatter:'{b} : {c} %'})" :color="cityLevel.color" :dataList="cityLevel.dataList" :currentTypeIndex="cityLevel.currentTypeIndex" />
              </div>
            </div>
            <div class="user-pane-group" style="width: 100%; margin-top: 10px; height: 380px; border-radius:0px 0px 0px 5px;">
              <div class="user-pane-head">
                <h6>年龄分布</h6>
              </div>
              <div class="user-pane-body" style='margin-top: -48px;'>
                <BarXCategory :initDone="ageData.initDone" :noData="ageData.noData" :dict1="ageData.dict1" :dict3="ageData.dict3" :color="ageData.color" :height="ageData.height" :toolTip="tooltipStyles({trigger:  'item', formatter:'{b}: {c}%'})" :dataList="ageData.dataList" :currentTypeIndex="ageData.currentTypeIndex" />
              </div>
            </div>
          </div>
          <div class="right">
            <div class="user-pane-group" style="height: 700px; border-radius:0px 0px 5px 0px;">
              <div class="user-pane-head">
                <h6>城市 TOP10</h6>
                <a href="javascript:;" @click="showMore">查看更多</a>
              </div>
              <div class="user-pane-body">
                <CitysCompare :data="citysData"></CitysCompare>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import SexCompare from './x-sex-compare.vue'
import CitysCompare from './x-citys-compare.vue'
import PieNest from '@/components/chartsGroup/pieNest/'
import BarXCategory from '@/components/chartsGroup/barXCategory/'
import { tooltipStyles } from '@/util/echarts'

// #D0BF6B 中性
// #AD686C 正面
// #57B4C9 负面
const colors: string[] = ['#D0BF6B', '#AD686C', '#57B4C9']

// colors: ['#ca7273', '#f3d872', '#57b4c9'],
@Component({
  components: {
    SexCompare,
    CitysCompare,
    PieNest,
    BarXCategory
  }
})
export default class UserCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: any

  tooltipStyles = tooltipStyles

  title: string = '用户画像'

  ageDataInitDone: boolean = false

  cityLevelInitDone: boolean = false

  get sex() {
    return {
      malePercent: this.data.sex.male,
      femalePercent: this.data.sex.female
    }
  }

  get cityLevel() {
    return {
      dict1: [],
      dict2: [],
      currentTypeIndex: 0,
      initDone: this.cityLevelInitDone,
      dataList: [this.data.cityLevelData],
      color: ['#29cfe4', '#ff8b92', '#f5d44e', '#A3D5E6', '#b8e986', '#a400a4'],
      height: 210
    }
  }

  get ageData() {
    return {
      dict1: [],
      dict2: [],
      dict3: this.data.ageData.age.map((it: any) => {
        return {
          text: it
        }
      }),
      dataList: [
        [
          {
            data: this.data.ageData.data,
            type: 'bar',
            barMaxWidth: '20'
          }
        ]
      ],
      currentTypeIndex: 0,
      initDone: this.ageDataInitDone,
      color: ['#B8E986'],
      height: 300
    }
  }

  get citysData() {
    return this.data.cityData.length > 10
      ? this.data.cityData.filter((it: any, index: number) => {
          return index < 10
        })
      : this.data.cityData
  }

  init() {
    this.cityLevelInitDone = true
    this.ageDataInitDone = true
  }

  reset() {
    this.cityLevelInitDone = false
    this.ageDataInitDone = false
  }

  showMore() {
    this.$emit('moreCity')
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.user-pane-group {
  background: rgba(0, 32, 45, 0.8);
  width: 100%;
  .user-pane-head {
    background-color: #153845;
    margin-top: 20px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px 0 29px;
    height: 30px;
  }
  .user-pane-body {
    margin: 10px 0;
    padding: 25px;
  }
}
.pane-wp {
  min-width: 287px;
  min-height: 147px;
  color: #fff;
  font-size: 14px;
  user-select: none;
  .pane-head {
    padding: 24px 30px;
    justify-content: space-between;
    font-weight: 400;
    background: rgba(0, 32, 45, 1);
    border-radius: 5px 5px 0 0;
  }
  .pane-body {
    position: relative;
  }
  .nodata-wp {
    background: rgba(0, 32, 45, 0.6);
    border-radius: 0 0 5px 5px;
    padding: 25px;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #999;
  }
  .user-content-wp {
    margin-top: 10px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: flex-start;
    .left {
      width: 66%;
      display: flex;
      flex-flow: wrap;
      align-items: initial;
      justify-content: space-between;
      min-height: 550px;
    }
    .right {
      width: 33%;
      display: flex;
      flex-flow: wrap;
      margin-left: 10px;
      min-height: 550px;
    }
  }
}
.more-link {
  color: #fff;
  opacity: 0.6;
  &:hover {
    color: #f3d872;
  }
}
dl {
  width: 33%;
  padding: 0 20px;
  border-right: 1px solid #3191aa;
}
dl:last-child {
  border-right: 0;
}
ul.film-list {
  li {
    .film-list-item-inner {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: flex-start;
    }
  }
}
</style>
