<template>
  <div class="effect-report-wp">
    <!-- <BannerCard></BannerCard> -->
    <div class="search-pane">
      <SelectXadvertOrders :fetch="xadvertOrders" v-model="form.xadvertOrderId"></SelectXadvertOrders>
    </div>
    <TotalCard :data="totalData"></TotalCard>
    <ReportPane title="广告趋势分析">
      <div class="echarts-box">
        <AreaBasic :initDone="chart1.initDone" :title="chart1.title" :dict1="chart1.dict1" :dict2="chart1.dict2" :toolTip="chart1.toolTip" :color="chart1.color" :dataList="chart1.dataList" :currentTypeIndex="chart1.currentTypeIndex" @typeChange="typeChangeHander1" />
      </div>
    </ReportPane>

    <ReportPane title="影片贡献度分析">
      <div class="echarts-box">
        <BarXCategory :initDone="chart2.initDone" :noData="chart2.noData" :title="chart2.title" :dict1="chart2.dict1" :dict2="chart2.dict2" :dict3="chart2.dict3" :color="chart2.color" :dataList="chart2.dataList" :currentTypeIndex="chart2.currentTypeIndex" axisLabelFormatter="{value}" :toolTip="chart2.toolTip" @typeChange="typeChangeHander2" />
      </div>
    </ReportPane>

    <ReportPane title="影院贡献度分析">
      <div class="echarts-box">
        <BarXCategory :initDone="chart3.initDone" :noData="chart3.noData" :title="chart3.title" :dict1="chart3.dict1" :dict2="chart3.dict2" :dict3="chart3.dict3" :toolTip="chart3.toolTip" :color="chart3.color" :dataList="chart3.dataList" :currentTypeIndex="chart3.currentTypeIndex" axisLabelFormatter="{value}" @typeChange="typeChangeHander3" />
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
import { tooltipStyles } from '@/util/echarts'
import { intDate } from '@/util/dealData'
import { toThousands } from '@/util/dealData'

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
    xadvertOrderId: 10
  }

  tooltipStyles = tooltipStyles

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
        text: 'profitAmount',
        name: '收益金额',
        key: 0
      },
      {
        text: 'showCount',
        name: '播放场次',
        key: 1
      },
      {
        text: 'personCount',
        name: '覆盖人次',
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
    color: ['#57B4C9', '#57B4C9', '#57B4C9'],
    toolTip
  }

  chart2: any = {
    title: '',
    dict1: [
      {
        text: 'movieProfits',
        name: '收益金额',
        key: 0
      },
      {
        text: 'movieShows',
        name: '播放场次',
        key: 1
      },
      {
        text: 'moviePersons',
        name: '覆盖人次',
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
        name: '收益金额',
        key: 0
      },
      {
        text: 'movieShows',
        name: '播放场次',
        key: 1
      },
      {
        text: 'moviePersons',
        name: '覆盖人次',
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
    this.resetData()
    if ( this.form.xadvertOrderId && this.form.xadvertOrderId !== '' ) {
      try {
        const { data } = await getTrend(this.form.xadvertOrderId)

        const items = data.item || null

        if ( !items || items.length === 0 ) {
          this.chart1.initDone = true
          this.chart2.initDone = true
          this.chart3.initDone = true
          return
        }

        const showCountSum = items.showCountSum || null // 总播放场次
        const personCountSum = items.personCountSum || null // 总覆盖人次
        const profitAmountSum = items.profitAmountSum || null // 总收益
        const orderReports = items.orderReports || null // 广告趋势分析
        const movieProfits = items.movieProfits || null // 影片贡献度分析（收益）
        const movieShows = items.movieShows || null // 影片贡献度分析（场次）
        const moviePersons = items.moviePersons || null // 影片贡献度分析（人次）
        const cinemaProfits = items.cinemaProfits || null // 影院贡献度分析（收益）
        const cinemaShows = items.cinemaShows || null // 影院贡献度分析（场次）
        const cinemaPersons = items.cinemaPersons || null // 影院贡献度分析（人次）

        // TODO: xadvertOrderId 与 id 是不是重复的？？
        this.totalData.showCountSum = showCountSum || '-' // 总播放场次
        this.totalData.personCountSum = personCountSum || '-' // 总覆盖人次
        // 总收益
        if ( profitAmountSum &&  profitAmountSum !== 0 ) {
          this.totalData.profitAmountSum = parseFloat(profitAmountSum) / 100
        } else {
          this.totalData.profitAmountSum = '-'
        }

        // 广告趋势分析
        if (orderReports && orderReports.length > 0) {
          (orderReports as any[])
            .sort((a, b) => a.date - b.date)
            .forEach((item: any, index: number) => {
              const date = intDate(item.date) // 日期
              this.chart1.dataList[0].date.push(date) // 日期
              this.chart1.dataList[1].date.push(date) // 日期
              this.chart1.dataList[2].date.push(date) // 日期
              this.chart1.dataList[0].data.push( parseFloat(item.profitAmount) / 100 ) // 总收益
              this.chart1.dataList[1].data.push(item.showCount) // 场次
              this.chart1.dataList[2].data.push(item.personCount) // 人次
            })
        }

        if (movieProfits && movieProfits.length > 0) {
          // 影片 贡献度分析（收益）
          movieProfits.forEach((item: any) => {
            this.chart2.dict3.push({
              text: item.name
            })
            this.chart2.dataList[0].data.push( parseFloat(item.profitAmount) / 100 )
          })

          // 影片 贡献度分析（场次）
          if (movieShows && movieShows.length > 0) {
            movieShows.forEach((item: any) => {
              this.chart2.dataList[1].data.push(item.showCount)
            })
          }

          // 影片 贡献度分析（人次）
          if (moviePersons && moviePersons.length > 0) {
            moviePersons.forEach((item: any) => {
              this.chart2.dataList[2].data.push(item.personCount)
            })
          }
        }

        if (cinemaProfits && cinemaProfits.length > 0) {
          // 影院 贡献度分析（场次）
          cinemaProfits.forEach((item: any) => {
            this.chart3.dict3.push({
              text: item.name
            })
            this.chart3.dataList[0].data.push( parseFloat(item.profitAmount) / 100 )
          })

          // 影院 贡献度分析（场次）
          if (cinemaShows && cinemaShows.length > 0) {
            cinemaShows.forEach((item: any) => {
              this.chart3.dataList[1].data.push(item.showCount)
            })
          }

          // 影院 贡献度分析（人次）
          if (cinemaPersons && cinemaPersons.length > 0) {
            cinemaPersons.forEach((item: any) => {
              this.chart3.dataList[2].data.push(item.personCount)
            })
          }
        }

        this.chart1.initDone = true
        this.chart2.initDone = true
        this.chart3.initDone = true
        this.loading = false
      } catch (ex) {
        this.handleError(ex)
      }
    } else {
      this.loading = false
    }
  }

  async handleChange() {
    this.resetData()
    await this.getChartsData('', 0)
  }

  async mounted() {
    await this.getChartsData('', 0)
  }

  resetData() {
    this.loading = true
    this.chart1.initDone = false
    this.chart2.initDone = false
    this.chart3.initDone = false
    this.chart1.dataList = [
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
    ]
    this.chart2.dict3 = []
    this.chart2.dataList = [
      { type: 'bar', data: [], barMaxWidth: '20' },
      { type: 'bar', data: [], barMaxWidth: '20' },
      { type: 'bar', data: [], barMaxWidth: '20' }
    ]
    this.chart3.dict3 = []
    this.chart3.dataList = [
      { type: 'bar', data: [], barMaxWidth: '20' },
      { type: 'bar', data: [], barMaxWidth: '20' },
      { type: 'bar', data: [], barMaxWidth: '20' }
    ]
  }

  @Watch('form.xadvertOrderId')
  watchId(value: number) {
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
<style lang="less" >
.echarts-box .ivu-radio-group-button .ivu-radio-wrapper {
  padding: 0 !important;
  border-radius: 0 !important;
  border-color: #fff !important;
  height: 35px !important;
  line-height: 35px !important;
  margin: 0 10px !important;
}
.echarts-box .ivu-radio-group-button .ivu-radio-wrapper-checked:hover {
  color: #fff !important;
}
</style>

