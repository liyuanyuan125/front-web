<template>
  <div>
    <Form label-position="left" :label-width="100">
      <Card class="detailmore-card">
        <div slot="title">
          <Row type="flex" justify="space-between">
            <DetailNavBar titleText="统计周期">
              <div slot="item">
                <RadioGroup
                  class="nav"
                  style="margin-right:15px"
                  @on-change="handleChange"
                  v-model="form.dayRangesKey"
                  size="large"
                  type="button"
                >
                  <Radio
                    v-for="(item) in dict.dayRanges"
                    :key="item.key"
                    :disabled="item.disabled"
                    :label="item.key"
                  >{{item.text}}</Radio>
                </RadioGroup>

                <DatePicker
                  type="daterange"
                  v-model="form.beginDate"
                  @on-change="handleChangePic"
                  placement="bottom-end"
                  placeholder="自定义时间段"
                  style="width: 200px"
                ></DatePicker>
              </div>
            </DetailNavBar>
          </Row>
        </div>

        <div class="content">
          <Row type="flex" justify="space-between">
            <Col :span="24">
              <div class="chart-wp">
                <!-- 累计和增加 -->
                <!-- <RadioGroup
                  size="small"
                  class="grand-total"
                  @on-change="currentTypeChange"
                  v-model="currentIndex"
                  type="button"
                >
                  <Radio
                    v-for="(item,index) in grandTotal"
                    :key="item.key"
                    :label="index"
                  >{{item.name}}</Radio>
                </RadioGroup> -->
                <!-- 观影title -->
                <RadioGroup
                  size="small"
                  class="nav watch-film"
                  @on-change="handleWatchFilm"
                  v-model="filmIndex"
                  type="button"
                >
                  <Radio
                    v-for="(item,index) in watchFilm"
                    :key="index"
                    :label="item.key"
                  >{{item.text}}</Radio>
                </RadioGroup>

                <div class="area-basic-wrap" v-if="filmIndex == 'watchNum'">
                  <AreaBasic
                    :initDone="chart1.initDone"
                    :title="chart1.title"
                    :dict1="chart1.dict1"
                    :dict2="chart1.dict2"
                    :toolTip="chart1.toolTip"
                    :height="chart1.height"
                    :color="chart1.color"
                    :dataList="chart1.dataList"
                    :currentTypeIndex="chart1.currentTypeIndex"
                  />
                </div>

                <div class="area-basic-wrap" v-if="filmIndex == 'movieNum'">
                  <AreaBasic
                    :initDone="chart2.initDone"
                    :title="chart2.title"
                    :dict1="chart2.dict1"
                    :dict2="chart2.dict2"
                    :toolTip="chart2.toolTip"
                    :height="chart2.height"
                    :color="chart2.color"
                    :dataList="chart2.dataList"
                    :currentTypeIndex="chart2.currentTypeIndex"
                  />
                </div>

                <!-- @typeChange='typeChangeHander' -->
                <BarxCategoryStack
                  :initDone="chart3.initDone"
                  v-if="filmIndex == 'wantNum'"
                  :title="chart3.title"
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
  formatNumber,
  formatConversion
} from '@/util/validateRules'
import DetailNavBar from './components/detailNavBar.vue'
import { trend } from '@/api/kolDetailMoreInfo'
import { movieView, wanttosee, MovieStatus } from '@/api/filmPersonDetail'
import AreaBasic from '@/components/chartsGroup/areaBasic/area-basic.vue'
import AreaBasicView from '@/components/chartsGroup/areaBasic/area-basic.vue'
import BarxCategoryStack from '@/components/chartsGroup/barxCategoryStack/'
import { tooltipStyles } from '@/util/echarts'
import { cloneDeep } from 'lodash'

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

  // 上映状态
  releaseStatus: any = null

  releaseDate: any = null

  releaseEndDate: any = null

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
    { key: 'watchNum', text: '观影人数' },
    { key: 'movieNum', text: '影片票房' },
    { key: 'wantNum', text: '想看人数' }
  ]

  form: any = {
    dayRangesKey: 'sevenDay',
    beginDate: []
  }

  // 提交日期初始化
  formBeginDate: any = null

  formEndDate: any = null

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
    color: ['#00b6cc'],
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
    color: ['#00b6cc'],
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

  get formatConversion() {
    return formatConversion
  }

  comInitDone() {
    this.chart1.initDone = false
    this.chart2.initDone = false
    this.chart3.initDone = false
  }

  async handleWatchFilm(val: any) {
    this.filmIndex = val
    this.comInitDone()
    this.resetData()
    if (this.filmIndex == 'wantNum') {
      // 想看
      await this.wanttoseeList()
    } else if (this.filmIndex == 'watchNum') {
      await this.watchFilmList()
    } else if (this.filmIndex == 'movieNum') {
      await this.watchFilmList()
    }
  }

  mounted() {
    this.formBeginDate = this.beginDate(this.form.dayRangesKey)
    this.formEndDate = this.endDate()
    this.movieStatus()
  }

  // 观影人数 影片票房
  async watchFilmList() {
    const mockObj = {
      beginDate: this.formBeginDate,
      endDate: this.formEndDate
    }

    const id = this.id // this.id  55184
    try {
      const { data } = await movieView({ ...mockObj }, id)
      // 取出 票神boxoffice 观看view数据
      const items = data || []
      // 放置后台数据顺序错乱
      items.sort((a: any, b: any) => a.date - b.date)
      const date: any[] = [] // 存放日期

      if (items && items.length > 0) {
        this.chart1.dataList = []
        this.chart2.dataList = []

        this.chart1.dataList.push({
          data: [],
          date: []
        })
        this.chart2.dataList.push({
          data: [],
          date: []
        })
        const boxoTrendData: any[] = [] // 票神新增数据
        const boxoCountData: any[] = [] // 票神累计数据
        const viewTrendData: any[] = [] // 观看新增数据
        const viewCountData: any[] = [] // 观看累计数据

        items.filter((it: any) => {
          date.push(formatConversion(it.date))
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
        }
        // // 票神
        if (this.filmIndex == 'movieNum') {
          this.chart2.dataList[0] = {
            date,
            data: boxoTrendData
          }
          this.chart2.dataList[1] = {
            date,
            data: boxoCountData
          }
        }
      }
      this.chart1.initDone = true
      this.chart2.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 想看人数
  async wanttoseeList() {
    const mockObj = {
      beginDate: this.formBeginDate,
      endDate: this.formEndDate
    }
    const id = this.id // this.id  55184
    try {
      const {
        data
      } = await wanttosee({ ...mockObj }, id)

      const items = data.items || null

      if (items && items.length > 0) {
        // sort 调整后台日期数据顺序
        items.sort((a: any, b: any) => {
          return a.date - b.date
        })
        const date: any = [] // 日期
        const dataTrend: any = {
          // 新增
          douban: [],
          maoyan: [],
          taopiaopiao: []
        }
        const dataCount: any = {
          // 累计
          douban: [],
          maoyan: [],
          taopiaopiao: []
        }
        // 观影总人数 对应页面是累计，趋势是每日新增
        const douban = {chanelCode: 'douban', count: 0, ranking: null, trend: 0}
        const maoyan = {chanelCode: 'maoyan', count: 0, ranking: null, trend: 0}
        const taopiaopiao = {chanelCode: 'taopiaopiao', count: 0, ranking: null, trend: 0}
        items.map((it: any, index: number) => {
          date.push(formatConversion(it.date))
          const isTao = it.channels.findIndex((col: any) => col.chanelCode == 'taopiaopiao')
          const isDou = it.channels.findIndex((col: any) => col.chanelCode == 'douban')
          const isMao = it.channels.findIndex((col: any) => col.chanelCode == 'maoyan')
          isTao == -1 ? it.channels.push(taopiaopiao) : null
          isDou == -1 ? it.channels.push(douban) : null
          isMao == -1 ? it.channels.push(maoyan) : null

          it.channels.map((code: any) => {
            dataTrend[code.chanelCode].push(code.trend || 0)
            dataCount[code.chanelCode].push(code.count || 0)
          })
        })

        this.chart3.xAxis = date
        this.chart3.dataList[0][0].data = dataTrend.maoyan || 0
        this.chart3.dataList[0][1].data = dataTrend.taopiaopiao || 0
        this.chart3.dataList[0][2].data = dataTrend.douban || 0

        this.chart3.dataList[1][0].data = dataCount.maoyan || 0
        this.chart3.dataList[1][1].data = dataCount.taopiaopiao || 0
        this.chart3.dataList[1][2].data = dataCount.douban || 0
      }
      this.chart3.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async movieStatus() {
    const id = this.id
    try {
      const { data } = await MovieStatus(id)
      this.releaseStatus = data.releaseStatus || null // 上映状态
      this.releaseDate = data.releaseDate || null
      this.releaseEndDate = data.releaseEndDate || null
      // 假如是0,1,2 展示想看人数， 3-4展示观影人数，4 下映展示出上映时间和下映时间
      if (this.releaseStatus < 3) {
        this.filmIndex = 'wantNum'
        this.wanttoseeList()
      } else {
        this.filmIndex = 'watchNum'
        if (this.releaseStatus == 3) {
          this.form.dayRangesKey = 'sevenDay'
          this.formBeginDate = this.beginDate(this.form.dayRangesKey)
          this.formEndDate = this.endDate()
        } else if (this.releaseStatus == 4) {
          this.form.dayRangesKey = ''
          this.form.beginDate = [
            formatConversion(data.releaseDate),
            formatConversion(data.releaseEndDate)
          ]
          this.formBeginDate = data.releaseDate
          this.formEndDate = data.releaseEndDate
        }
        this.watchFilmList()
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  currentTypeChange(index: number = 0) {
    if (this.filmIndex == 'watchNum') {
      // 观影人数
      this.chart1.currentTypeIndex = index
    } else if (this.filmIndex == 'movieNum') {
      this.chart2.currentTypeIndex = index
    } else if (this.filmIndex == 'wantNum') {
      // 想看人数
      this.chart3.currentTypeIndex = index
    }
  }

  /**
   * 根据筛选返回起始日期，影人、影片、kol字段名未统一
   * @param dayRangesKey 昨天 | 过去7天 | 过去30天 | 过去90天
   */
  beginDate(dayRangesKey: string) {
    switch (dayRangesKey) {
      case 'yesterday':
        return moment(new Date())
          .add(-1, 'days')
          .format(timeFormat)
      case 'thirtyDay':
        return moment(new Date())
          .add(-30, 'days')
          .format(timeFormat)
      case 'ninetyDay':
        return moment(new Date())
          .add(-90, 'days')
          .format(timeFormat)
      default:
        return moment(new Date())
          .add(-7, 'days')
          .format(timeFormat)
    }
  }

  endDate() {
    return ( this.form.dayRangesKey == 'yesterday' )
    ? moment(new Date()).add(-1, 'days').format(timeFormat)
    : moment(new Date()).format(timeFormat)
  }

  async handleChange() {
    this.comInitDone()
    this.resetData()
    this.form.beginDate = []
    this.formBeginDate = this.beginDate(this.form.dayRangesKey)
    this.formEndDate = this.endDate()
    if (this.filmIndex == 'wantNum') {
      // 想看
      this.wanttoseeList()
    } else {
      this.watchFilmList()
    }
  }

  handleChangePic(val: any) {
    this.comInitDone()

    this.form.dayRangesKey = ''
    this.resetData()
    if (val[0]) {
      this.formBeginDate = formatConversion(val[0], 2)
      this.formEndDate = formatConversion(val[1], 2)
      if (this.filmIndex == 'wantNum') {
        // 想看
        this.wanttoseeList()
      } else {
        this.watchFilmList()
      }
    }
  }

  resetData() {
    this.chart1.dataList = []
    this.chart2.dataList = []
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';

.detailmore-card {
  .watch-film {
    .ivu-radio-wrapper {
      height: 40px;
      line-height: 40px;
    }
  }
}
.grand-total {
  display: block;
  padding: 30px 0 0 50px;
}

.watch-film {
  padding-top: 30px;
  display: block;
  text-align: center;
}

.area-basic-wrap {
  padding: 0 20px 0 10px;
}
</style>
