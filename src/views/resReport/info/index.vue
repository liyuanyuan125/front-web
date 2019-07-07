<template>
  <div class="effect-report-wp">
    <!-- <BannerCard></BannerCard> -->
    <div class="search-pane">
      <SelectXadvertOrders :fetch="xadvertOrders" v-model="form.xadvertOrderId"></SelectXadvertOrders>
    </div>
    <TotalCard :data="totalData"></TotalCard>
    <ReportPane title="广告趋势分析">
      <div class="echarts-box">
        <AreaBasic
          :initDone="chart1.initDone"
          :title="chart1.title"
          :dict1="chart1.dict1"
          :dict2="chart1.dict2"
          :toolTip="chart1.toolTip"
          :color="chart1.color"
          :dataList="chart1.dataList"
          :currentTypeIndex="chart1.currentTypeIndex"
          @typeChange="typeChangeHander1"
        />
      </div>
    </ReportPane>

    <ReportPane title="影片贡献度分析">
      <div class="echarts-box">
        <BarXCategory
          :initDone="chart2.initDone"
          :noData="chart2.noData"
          :title="chart2.title"
          :dict1="chart2.dict1"
          :dict2="chart2.dict2"
          :dict3="chart2.dict3"
          :toolTip="chart2.toolTip"
          :color="chart2.color"
          :dataList="chart2.dataList"
          :currentTypeIndex="chart2.currentTypeIndex"
          @typeChange="typeChangeHander2"
        />
      </div>
    </ReportPane>

    <ReportPane title="影院贡献度分析">
      <div class="echarts-box">
        <BarXCategory
          :initDone="chart3.initDone"
          :noData="chart3.noData"
          :title="chart3.title"
          :dict1="chart3.dict1"
          :dict2="chart3.dict2"
          :dict3="chart3.dict3"
          :toolTip="chart3.toolTip"
          :color="chart3.color"
          :dataList="chart3.dataList"
          :currentTypeIndex="chart3.currentTypeIndex"
          @typeChange="typeChangeHander3"
        />
      </div>
    </ReportPane>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatTimestamp, formatTimes, formatNumber } from '@/util/validateRules'
import ReportPane from './components/report-pane.vue'
import BannerCard from './components/banner-card.vue'
import TotalCard from './components/total-card.vue'
import AreaBasic from '@/components/chartsGroup/areaBasic/area-basic.vue'
import BarXCategory from '@/components/chartsGroup/barXCategory/'
import { getTrend, xadvertOrders } from '@/api/resReport'
import SelectXadvertOrders from './components/x-select-xadvertOrders.vue'

const toolTip: any = {
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, .8)',
  backgroundColor: 'rgba(0, 0, 0, .8)',
  padding: [7, 10],
  textStyle: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 22
  },
  trigger: 'axis',
  axisPointer: {
    type: 'line',
    lineStyle: {
      width: 22,
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(255, 255, 255, .01)'
          },
          {
            offset: 1,
            color: 'rgba(255, 255, 255, .5)'
          }
        ]
      }
    }
  }
}

@Component({
  components: {
    BannerCard,
    TotalCard,
    ReportPane,
    AreaBasic,
    BarXCategory,
    SelectXadvertOrders
  }
})
export default class Index extends ViewBase {
  form: any = {
    xadvertOrderId: 111
  }

  xadvertOrders = xadvertOrders

  loading: boolean = false

  totalData: any = {
    showCountSum: 0,
    personCountSum: 0,
    profitAmountSum: 0
  }

  chart1: any = {
    title: '',
    dict1: [
      {
        name: 'profitAmount',
        text: '收益',
        key: 0
      },
      {
        name: 'showCount',
        text: '场次',
        key: 1
      },
      {
        name: 'personCount',
        text: '人次',
        key: 2
      }
    ],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [
      {
        data: [],
        date: []
      },
      {
        data: [],
        date: []
      },
      {
        data: [],
        date: []
      }
    ],
    color: ['#CA7273'],
    toolTip
  }

  chart2: any = {
    title: '',
    dict1: [
      {
        text: 'movieProfits',
        name: '收益',
        key: 0
      },
      {
        text: 'movieShows',
        name: '场次',
        key: 1
      },
      {
        text: 'moviePersons',
        name: '人次',
        key: 2
      }
    ],
    dict2: [],
    dict3: [],
    currentTypeIndex: 0,
    initDone: false,
    noData: false,
    dataList: [
      { type: 'bar', data: [], barMaxWidth: '20' },
      { type: 'bar', data: [], barMaxWidth: '20' },
      { type: 'bar', data: [], barMaxWidth: '20' }
    ],
    color: ['#f3d872'],
    toolTip
  }

  chart3: any = {
    title: '',
    dict1: [
      {
        text: 'movieProfits',
        name: '收益',
        key: 0
      },
      {
        text: 'movieShows',
        name: '场次',
        key: 1
      },
      {
        text: 'moviePersons',
        name: '人次',
        key: 2
      }
    ],
    dict2: [],
    dict3: [],
    currentTypeIndex: 0,
    initDone: false,
    noData: false,
    dataList: [
      { type: 'bar', data: [], barMaxWidth: '20' },
      { type: 'bar', data: [], barMaxWidth: '20' },
      { type: 'bar', data: [], barMaxWidth: '20' }
    ],
    color: ['#57B4C9'],
    toolTip
  }

  async typeChangeHander1(index: number = 0) {
    if (this.chart1.dataList[index].length < 1) {
      await this.getChartsData('chart1', index)
    }
    this.chart1.currentTypeIndex = index
  }

  async typeChangeHander2(index: number = 0) {
    if (this.chart2.dataList[index].length < 1) {
      await this.getChartsData('chart2', index)
    }
    this.chart2.currentTypeIndex = index
  }

  async typeChangeHander3(index: number = 0) {
    if (this.chart3.dataList[index].length < 1) {
      await this.getChartsData('chart3', index)
    }
    this.chart3.currentTypeIndex = index
  }

  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    if (this.form.xadvertOrderId && this.form.xadvertOrderId !== '') {
      const mockObj = {
        effectType: this.form.xadvertOrderId
      }
      try {
        const {
          data,
          data: {
            item: {
              showCountSum,
              personCountSum,
              profitAmountSum,
              orderReports,
              movieProfits,
              movieShows,
              moviePersons,
              cinemaProfits,
              cinemaShows,
              cinemaPersons
            }
          }
        } = await getTrend(10, { ...mockObj })
        // TODO: xadvertOrderId 与 id 是不是重复的？？
        this.totalData.showCountSum = showCountSum
        this.totalData.personCountSum = personCountSum
        this.totalData.profitAmountSum = profitAmountSum

        if (orderReports && orderReports.length > 0) {
          orderReports.forEach((item: any, index: number) => {
            this.chart1.dataList[0].date.push(item.date)
            this.chart1.dataList[1].date.push(item.date)
            this.chart1.dataList[2].date.push(item.date)
            this.chart1.dataList[0].data.push(item.profitAmount)
            this.chart1.dataList[1].data.push(item.showCount)
            this.chart1.dataList[2].data.push(item.personCount)
          })
          this.chart1.initDone = true
        } else {
          this.chart1.initDone = true
        }

        if (movieProfits && movieProfits.length > 0) {
          movieProfits.forEach((item: any) => {
            this.chart2.dict3.push({
              text: item.name
            })
            this.chart2.dataList[0].data.push(item.profitAmount)
          })

          if (movieShows && movieShows.length > 0) {
            movieShows.forEach((item: any) => {
              this.chart2.dataList[1].data.push(item.showCount)
            })
          }

          if (moviePersons && moviePersons.length > 0) {
            moviePersons.forEach((item: any) => {
              this.chart2.dataList[2].data.push(item.personCount)
            })
          }
          this.chart2.initDone = true
        } else {
          this.chart2.initDone = true
          this.chart2.noData = true
        }

        if (cinemaProfits && cinemaProfits.length > 0) {
          cinemaProfits.forEach((item: any) => {
            this.chart3.dict3.push({
              text: item.name
            })
            this.chart3.dataList[0].data.push(item.profitAmount)
          })

          if (cinemaShows && cinemaShows.length > 0) {
            cinemaShows.forEach((item: any) => {
              this.chart3.dataList[1].data.push(item.showCount)
            })
          }

          if (cinemaPersons && cinemaPersons.length > 0) {
            cinemaPersons.forEach((item: any) => {
              this.chart3.dataList[2].data.push(item.personCount)
            })
          }
          this.chart3.initDone = true
        } else {
          this.chart3.initDone = true
          this.chart3.noData = true
        }
        this.loading = false
      } catch (ex) {
        this.handleError(ex)
      }
    } else {
      this.loading = false
    }
  }

  async handleChange() {
    this.loading = true
    this.chart1.initDone = false
    this.chart2.initDone = false
    this.chart3.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }

  async mounted() {
    await this.getChartsData('', 0)
  }

  resetData() {
    this.chart1.dataList = []
  }

  @Watch('xadvertOrderId')
  watchId(value: number | string) {
    this.getChartsData('', 0)
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
.search-pane {
  margin: 20px 0;
  width: 40%;
}
.echarts-box {
  margin-bottom: 20px;
}
</style>


