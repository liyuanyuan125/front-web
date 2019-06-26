<template>
  <div>
    <Form label-position="left" :label-width="100">
      <Card class="detailmore-card">
        <div slot="title">
          <Row type="flex" justify="space-between">
            <Col :span="24">
              <DetailNavBar titleText="统计周期">
                <div slot="item">
                  <RadioGroup
                      class='nav'
                      style="margin-right:15px"
                      @on-change="handleChange"
                      v-model="form.dayRangesKey"
                      size="large"
                      type="button">
                    <Radio v-for="(item) in dict.dayRanges"
                           :key="item.key"
                           :disabled="item.disabled"
                           :label="item.key">{{item.text}}</Radio>
                  </RadioGroup>

                  <DatePicker
                    type="daterange"
                    v-model="form.beginDate"
                    @on-change="handleChange"
                    placement="bottom-end"
                    placeholder="自定义时间段"
                  ></DatePicker>
                </div>
              </DetailNavBar>
            </Col>
          </Row>
        </div>
        <div class="content">
          <Row type="flex" justify="space-between">
            <Col :span="24">
              <div class="chart-wp">
                <!-- 累计和增加 -->
                <RadioGroup size="small" class="grand-total"  @on-change='currentTypeChange'
                        v-model="currentIndex"  type="button">
                  <Radio v-for="(item,index) in grandTotal"
                        :key="item.key"
                        :label="index">{{item.name}}</Radio>
                </RadioGroup>
                <!-- 观影title -->
                <RadioGroup size="small" class="watch-film" @on-change="handleWatchFilm"
                        v-model="filmIndex"  type="button">
                  <Radio v-for="(item,index) in watchFilm"
                        :key="item.key"
                        :label="item.key">{{item.text}}</Radio>
                </RadioGroup>

                <AreaBasic :initDone="chart1.initDone"
                    v-if="filmIndex == 'watchNum'"
                    :title="chart1.title"
                    :dict1="chart1.dict1"
                    :dict2="chart1.dict2"
                    :toolTip="chart1.toolTip"
                    :height="chart1.height"
                    :color="chart1.color"
                    :dataList="chart1.dataList"
                    :currentTypeIndex="chart1.currentTypeIndex" />

                <AreaBasicView :initDone="chart2.initDone"
                    v-if="filmIndex == 'movieNum'"
                    :title="chart2.title"
                    :dict1="chart2.dict1"
                    :dict2="chart2.dict2"
                    :toolTip="chart2.toolTip"
                    :height="chart2.height"
                    :color="chart2.color"
                    :dataList="chart2.dataList"
                    :currentTypeIndex="chart2.currentTypeIndex" />

                    <!-- @typeChange='typeChangeHander' -->
                    <BarxCategoryStack :initDone="chart3.initDone"
                      v-if="filmIndex == 'wantNum'"
                      :title='chart3.title'
                      :dict1="chart3.dict1"
                      :dict2="chart3.dict2"
                      :xAxis="chart3.xAxis"
                      :toolTip="tooltipStyles({trigger:  'item', formatter:'{b}-{c}'})"
                      :color="chart3.color"
                      :dataList="chart3.dataList"
                      :currentTypeIndex="chart3.currentTypeIndex"
                       />
              </div> 
            </Col>
          </Row>
        </div>
      </Card>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import echarts from 'echarts'
import {
  formatTimestamp,
  formatTimes,
  formatNumber
} from '@/util/validateRules'
import DetailNavBar from './components/detailNavBar.vue'
import { trend } from '@/api/kolDetailMoreInfo'
import {movieView, wanttosee} from '@/api/filmPersonDetail'
import AreaBasic from '@/components/chartsGroup/areaBasic/area-basic.vue'
import AreaBasicView from '@/components/chartsGroup/areaBasic/area-basic.vue'
import BarxCategoryStack from '@/components/chartsGroup/barxCategoryStack/'
import { tooltipStyles } from '@/util/echarts'
const timeFormat = 'YYYYMMDD'
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
const colors: string[] = ['#D0BF6B', '#AD686C', '#57B4C9']

@Component({
  components: {
    AreaBasic,
    DetailNavBar,
    AreaBasicView,
    BarxCategoryStack
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  tooltipStyles = tooltipStyles
  // 新增和累计
  grandTotal: any = [
    {
      key: 'trend',
      name: '新增'
    },
    {
      key: 'count',
      name: '累计'
    }
  ]
  currentIndex = 0

  // 观影人数
  filmIndex = 'watchNum'
  watchFilm: any = [
    {key: 'watchNum', text: '观影人数'},
    {key: 'movieNum', text: '影片票房'},
    {key: 'wantNum', text: '想看人数' }
  ]

  form: any = {
    dayRangesKey: 'sevenDay',
    channelCode: 'weibo'
  }

  dict: any = {
    dayRanges: [
      {
        key: 'yesterday',
        text: '昨日',
        disabled: false
      },
      {
        key: 'sevenDay',
        text: '最近7天',
        disabled: false
      },
      {
        key: 'thirtyDay',
        text: '最近30天',
        disabled: false
      },
      {
        key: 'ninetyDay',
        text: '最近90天',
        disabled: false
      }
    ]
  }
  // 观影人数
  chart1: any = {
    title: '',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color:  ['#da6c70'],
    height: 450,
    toolTip
  }
  // 影片票房
  chart2: any = {
    title: '',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color:  ['#d0bf6b'],
    height: 450,
    toolTip
  }
  // 想看人数
  chart3: any = {
    title: '',
    dict1: [],
    dict2: [
      {
        key: 'maoyan',
        text: '猫眼'
      },
      {
        key: 'taopiaopiao',
        text: '淘票票'
      },
      {
        key: 'douban',
        text: '豆瓣'
      }
    ],
    xAxis: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [
      [
        {
          name: '猫眼',
          type: 'bar',
          stack: 'totalCount',
          barMaxWidth: '20',
          data: []
        },
        {
          name: '淘票票',
          type: 'bar',
          stack: 'totalCount',
          barMaxWidth: '20',
          data: []
        },
        {
          name: '豆瓣',
          type: 'bar',
          stack: 'totalCount',
          barMaxWidth: '20',
          data: []
        }
      ],
      [
        {
          name: '猫眼',
          type: 'bar',
          stack: 'totalCount',
          barMaxWidth: '20',
          data: []
        },
        {
          name: '淘票票',
          type: 'bar',
          stack: 'totalCount',
          barMaxWidth: '20',
          data: []
        },
        {
          name: '豆瓣',
          type: 'bar',
          stack: 'totalCount',
          barMaxWidth: '20',
          data: []
        }
      ]
    ],
    color: colors
  }
  // 观影人数 影片票房
  async watchFilmList() {
    const mockObj = {
      beginDate: this.beginDate(this.form.dayRangesKey),
      endDate: this.endDate()
    }
    const id = this.id  // this.id  55184
    try {
      const { data } = await movieView({ ...mockObj }, id)
      // 取出 票神boxoffice 观看view数据
      const items = data || []
      // 放置后台数据顺序错乱
      items.sort((a: any, b: any) => a.date - b.date )
      const date: any[] = [] // 存放日期
      const boxoTrendData: any[] = [] // 票神新增数据
      const boxoCountData: any[] = [] // 票神累计数据
      const viewTrendData: any[] = [] // 观看新增数据
      const viewCountData: any[] = [] // 观看累计数据

      this.chart1.dataList = []
      this.chart2.dataList = []
      if (items && items.length > 0) {
        items.filter((it: any) => {
          date.push(it.date)
          viewTrendData.push(it.view.trend)
          viewCountData.push(it.view.count)
          boxoTrendData.push(it.boxoffice.trend)
          boxoCountData.push(it.boxoffice.count)
        })

        // 观影
        if (this.filmIndex == 'watchNum') {
          this.chart1.dataList[0] = {
            date,
            data: viewTrendData
          }
          this.chart1.dataList[1] = {
            date,
            data: viewCountData
          }
          this.chart1.initDone = true
          this.chart2.initDone = false
          this.chart3.initDone = false
        }
        // 票神
        if (this.filmIndex === 'movieNum') {
          this.chart2.dataList[0] = {
            date,
            data: boxoTrendData
          }
          this.chart2.dataList[1] = {
            date,
            data: boxoCountData
          }
          this.chart2.initDone = true
          this.chart1.initDone = false
          this.chart3.initDone = false
        }
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }
  // 想看人数
  async wanttoseeList() {
    const mockObj = {
      beginDate: this.beginDate(this.form.dayRangesKey),
      endDate: this.endDate()
    }
    const id = this.id  // this.id  55184
    try {
      const { data: {items, channelCodeList} } =  await wanttosee({ ...mockObj }, id)
      if (items && items.length > 0) {
        // sort 后台日期数据不准
        items.sort((a: any, b: any) => {
          return a.date - b.date
        })
        const date: any = [] // 日期
        const dataTrend: any = { // 新增
          douban: [],
          maoyan: [],
          taopiaopiao: []
        }
        const dataCount: any = { // 累计
          douban: [],
          maoyan: [],
          taopiaopiao: []
        }
        // 观影总人数 对应页面是累计，趋势是每日新增
        items.map((it: any) => {
          date.push(it.date)
          it.channels.map((code: any) => {
            dataTrend[code.chanelCode].push(code.trend)
            dataCount[code.chanelCode].push(code.count)
          })
        })
        this.chart3.xAxis = date
        this.chart3.dataList[0][0].data = dataTrend.maoyan
        this.chart3.dataList[0][1].data = dataTrend.taopiaopiao
        this.chart3.dataList[0][2].data = dataTrend.douban

        this.chart3.dataList[1][0].data = dataCount.maoyan
        this.chart3.dataList[1][1].data = dataCount.taopiaopiao
        this.chart3.dataList[1][2].data = dataCount.douban
        this.chart3.initDone = true
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }
  currentTypeChange(index: number = 0) {
    // this.chart2.initDone = false
    // this.chart1.initDone = false
    // this.chart3.initDone = false
    if (this.filmIndex == 'watchNum') { // 观影人数
      this.chart1.currentTypeIndex = index
    } else if (this.filmIndex == 'movieNum') {
      this.chart2.currentTypeIndex = index
    } else if (this.filmIndex == 'wantNum') { // 想看人数
      this.chart3.currentTypeIndex = index
    }
  }
  /**
   * 根据筛选返回起始日期，影人、影片、kol字段名未统一
   * @param dayRangesKey 昨天 | 过去7天 | 过去30天 | 过去90天
   */
  beginDate(dayRangesKey: string) {
    switch ( dayRangesKey ) {
      case 'yesterday' :
        return moment(new Date()).add(-1, 'days').format(timeFormat)
      case 'thirtyDay' :
        return moment(new Date()).add(-30, 'days').format(timeFormat)
      case 'ninetyDay' :
        return moment(new Date()).add(-90, 'days').format(timeFormat)
      default :
        return moment(new Date()).add(-7, 'days').format(timeFormat)
    }
  }

  endDate() {
    return moment(new Date()).format(timeFormat)
  }

  async handleChange() { // 修改日期判断我当前请求的接口---------
    this.chart2.initDone = false
    this.chart1.initDone = false
    this.chart3.initDone = false
    if (this.filmIndex == 'wantNum') { // 想看
      this.wanttoseeList()
    } else {
      this.watchFilmList()
    }
  }

  async mounted() {
    await this.watchFilmList()
  }
  async chartList() {
    const myChart = echarts.init(this.$refs.refChart as any)
    const option: any = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [
          {
            name: '猫眼',
            icon: 'circle',
          },
          {
            name: '淘票票',
            icon: 'circle',
          },
          {
            name: '豆瓣',
            icon: 'circle',
          },
        ], // '猫眼', '淘票票', '豆瓣'
        textStyle: {
          color: '#fff'
        }
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap : false,
          data: this.chart1.dataList.date,
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        }
      ],
      yAxis : [
        {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        }
      ],
      series: [
        {
          name: '猫眼',
          type: 'line',
          smooth: true,
          areaStyle: {
              color: '#DA6C70'
          },
          lineStyle: {
            color: '#DA6C70',
            width: 1,
            // opacity: 0.7
          },
          data: this.chart1.dataList.data.maoyan
        },
        {
          name: '淘票票',
          type: 'line',
          smooth: true,
          areaStyle: {
              color: '#00B6CC'
          },
          lineStyle: {
            color: '#00B6CC',
            width: 1,
            // opacity: 0.7
          },
          data: this.chart1.dataList.data.taopiaopiao
        },
        {
          name: '豆瓣',
          type: 'line',
          smooth: true,
          areaStyle: {
              color: '#D0BF6B'
          },
          lineStyle: {
            color: '#D0BF6B',
            width: 1,
            // opacity: 0.7
          },
          data: this.chart1.dataList.data.douban
        }
      ]
    }
    myChart.setOption(option)
  }

  resetData() {
    this.chart1.dataList = []
    this.chart2.dataList = []
    this.chart3.dataList = []
  }
  handleWatchFilm(val: any) {
    this.filmIndex = val
    if (val == 'wantNum') { // 想看
      this.wanttoseeList()
    } else {
      this.watchFilmList()
    }
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
.grand-total {
  display: block;
  padding: 30px 0 0 50px;
}
.watch-film {
  display: block;
  text-align: center;
}
</style>
