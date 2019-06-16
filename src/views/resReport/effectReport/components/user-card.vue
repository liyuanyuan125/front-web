<template>
  <div>
    <section class="pane-wp">
      <h4 class="pane-head flex-box">
        <em>
          {{title}}
        </em>
      </h4>
      <div class="pane-body">
        <div class="user-content-wp">
          <div class="left">
            <div class="user-pane-group"
                 style="width: 49.2%; height: 310px">
              <div class="user-pane-head">
                <h6>性别分布</h6>
              </div>
              <div class="user-pane-body">
                <SexCompare :data="sexData"></SexCompare>
              </div>
            </div>
            <div class="user-pane-group"
                 style="width: 49.2%; margin-left: 0.6%;height: 310px">
              <div class="user-pane-head">
                <h6>线级分布</h6>
              </div>
              <div class="user-pane-body">
                <PieNest :initDone="cityLevelData.initDone"
                         :dict1="cityLevelData.dict1"
                         :dict2="cityLevelData.dict2"
                         :height="cityLevelData.height"
                         :toolTip="tooltipStyles({trigger:  'item', formatter:'{b}:{c}'})"
                         :color="cityLevelData.color"
                         :dataList="cityLevelData.dataList"
                         :currentTypeIndex="cityLevelData.currentTypeIndex" />
              </div>
            </div>
            <div class="user-pane-group"
                 style="width: 100%; margin-top: 10px; height: 380px; border-radius:0px 0px 0px 5px;">
              <div class="user-pane-head">
                <h6>年龄分布</h6>
              </div>
              <div class="user-pane-body">
                <BarXCategory :initDone="ageData.initDone"
                              :dict1="ageData.dict1"
                              :dict3="ageData.dict3"
                              :color="ageData.color"
                              :height="ageData.height"
                              :toolTip="tooltipStyles({trigger:  'item', formatter:'{b}:{c}'})"
                              :dataList="ageData.dataList"
                              :currentTypeIndex="ageData.currentTypeIndex" />
              </div>
            </div>
          </div>
          <div class="right">
            <div class="user-pane-group"
                 style="height: 700px; border-radius:0px 0px 5px 0px;">
              <div class="user-pane-head">
                <h6>城市 TOP10</h6>
                <a href="javascript:;">查看更多</a>
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

@Component({
  components: {
    SexCompare,
    CitysCompare,
    PieNest,
    BarXCategory
  }
})
export default class UserCard extends Vue {
  // @Prop({ type: Object, default: () => ({}) }) data!: any

  tooltipStyles = tooltipStyles

  title: string = '用户画像'

  sexData: any = {
    malePercent: 55,
    femalePercent: 45
  }
  cityLevelData: any = {
    dict1: [],
    dcit2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [
      [
        {
          name: '一线城市',
          value: 80,
          itemStyle: {
            color: '#ca7273'
          }
        },
        {
          name: '二线城市',
          value: 30,
          itemStyle: {
            color: '#f3d872'
          }
        },
        {
          name: '三线城市',
          value: 20,
          itemStyle: {
            color: '#57b4c9'
          }
        }
      ]
    ],
    color: colors,
    height: 200
  }

  ageData: any = {
    dict1: [],
    dict2: [],
    dict3: [
      { text: '18岁以下' },
      { text: '18-25岁' },
      { text: '26-30岁' },
      { text: '31-40岁' },
      { text: '40岁以上' }
    ],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [
      [{ type: 'bar', data: ['8372.4', '8372.4', '25117.2', '16744.8', '25117.2'] }]
    ],
    color: ['#B8E986'],
    height: 300
  }

  citysData: any = [
    {
      cityName: '北京',
      percent: 99.71
    },
    {
      cityName: '上海',
      percent: 88.71
    },
    {
      cityName: '深圳',
      percent: 77.71
    },
    {
      cityName: '广州',
      percent: 22.71
    },
    {
      cityName: '杭州',
      percent: 55.71
    },
    {
      cityName: '成都',
      percent: 31.71
    },
    {
      cityName: '重庆',
      percent: 22.71
    }
  ]
  mounted() {
    this.cityLevelData.initDone = true
    this.ageData.initDone = true
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
  min-height: 254px;
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
