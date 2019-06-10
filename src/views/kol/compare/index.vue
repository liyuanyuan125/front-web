<style lang="less">
@import '~@/site/lib.less';
@import './kolcompare.less';
</style>
<template>
  <div>
    <WorksPane
    :filterList="dict.filterList"
    :channelList="dict.channelList"
    :chartData="chartData"
    ></WorksPane>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import {
  formatTimestamp,
  formatTimes,
  formatNumber
} from '@/util/validateRules'
import { fans, brands } from '@/api/kolCompare'
import WorksPane from './works.vue'

@Component({
  components: {
    WorksPane
  }
})
export default class Temporary extends ViewBase {
  form: any = {
    channelCode: 0,
    filterKey: 'key1',
    beginDate: [
      // new Date(2019, 3, 9), new Date(2019, 4, 11)
    ],
  }
  pageQuery: any = {

  }
  dict: any = {
    filterList: [
      {
        key: 'key1',
        text: '点赞数',
        disabled: false
      },
      {
        key: 'key2',
        text: '评论数',
        disabled: false
      },
      {
        key: 'key3',
        text: '播放数',
        disabled: false
      },
      {
        key: 'key4',
        text: '发布频率',
        disabled: false
      }
    ],
    channelList: [
      {
        id: 0,
        name: '微信公众号'
      },
      {
        id: 1,
        name: '新浪微博'
      },
      {
        id: 2,
        name: '小红书'
      },
      {
        id: 3,
        name: '抖音'
      }
    ]
  }
  chartData: any = {
    title: '粉丝男女分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#ff9933', '#169bd5']
  }

  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const that: any = this
    // 107028 dev有数据
    const id = parseInt(this.$route.params.id, 0)
    try {
      // const {
      //   data,
      //   data: {
      //     item: { genders, ages, cities, provinces }
      //   }
      // } = await fans(id)
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleChange() {
    this.resetData()
    await this.getChartsData('', 0)
  }
  async mounted() {
    this.initHandler()
  }
  async initHandler() {
    await this.getChartsData('', 0)
  }
  resetData() {
  }
}
</script>