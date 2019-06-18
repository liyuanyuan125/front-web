
<template>
  <div>
    <Form label-position="left" :label-width="100">
      <Card class="detailmore-card">
        <div slot="title">
          <Row type="flex" justify="space-between" align="middle">
            <Col :span="17">
              <DetailNavBar titleText="统计周期">
                <div slot="item">
                  <RadioGroup
                    class="nav"
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
                </div>
              </DetailNavBar>
            </Col>
            <Col :span="7" style="text-align:right">
              平台
              <Select
                v-model="form.channelCode"
                clearable
                @on-change="handleChange"
                style="width:150px; text-align:left"
              >
                <Option
                  v-for="(item) in dict.channelList"
                  :key="item.key"
                  :value="item.key"
                >{{item.text}}</Option>
              </Select>
            </Col>
          </Row>
        </div>
        <div class="content">
          <Row type="flex" justify="space-between">
              <Col :span="12">
                <div class='chart-wp' style='margin-right:10px'>
                  <PieNest :initDone="chart1.initDone"
                         :title='chart1.title'
                         :dict1="chart1.dict1"
                         :dict2="chart1.dict2"
                        :toolTip="tooltipStyles({trigger:  'item', formatter:'{b}:{c}'})"
                         :color="chart1.color"
                         :dataList="chart1.dataList"
                         :currentTypeIndex="chart1.currentTypeIndex" />
                </div>
              </Col>
              <Col :span="12">
                <div class='chart-wp'>
                  <BarxCategoryStack :initDone="chart2.initDone"
                                  :title='chart2.title'
                                  :dict1="chart2.dict1"
                                  :dict2="chart2.dict2"
                                  :xAxis="chart2.xAxis"
                                  :toolTip="tooltipStyles({trigger:  'item', formatter:'{b}-{c}'})"
                                  :color="chart2.color"
                                  :dataList="chart2.dataList"
                                  :currentTypeIndex="chart2.currentTypeIndex"
                                  @typeChange='typeChangeHander' />
                </div>
              </Col>
            </Row>
            <Row type="flex" justify="space-between" style='margin-top:10px'>
              <Col :span="12">
                <div class='chart-wp borderRadius' style='margin-right:10px'>
                  <WordCloud :initDone="chart3.initDone"
                           :title='chart3.title'
                           :dict1="chart3.dict1"
                           :color="chart3.color"
                           :dataList="chart3.dataList"
                           :currentTypeIndex="chart3.currentTypeIndex" />
                </div>
              </Col>
              <Col :span="12">
                <div class='chart-wp borderRadius'>
                  <WordCloud :initDone="chart4.initDone"
                           :title='chart4.title'
                           :dict1="chart4.dict1"
                           :color="chart4.color"
                           :dataList="chart4.dataList"
                           :currentTypeIndex="chart4.currentTypeIndex" />
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
import { findIndex } from 'lodash'
import moment from 'moment'
import { dayRanges , comment } from '@/api/brandfans'
import PieNest from '@/components/chartsGroup/pieNest/'
import BarxCategoryStack from '@/components/chartsGroup/barxCategoryStack/'
import WordCloud from '@/components/chartsGroup/wordCloud/'
import DetailNavBar from '@/views/film/figure/detailMoreInfo/components/detailNavBar.vue'
import { tooltipStyles } from '@/util/echarts'
const timeFormat = 'YYYYMMDD'
// #D0BF6B 中性
// #AD686C 正面
// #57B4C9 负面
const colors: string[] = ['#D0BF6B', '#AD686C', '#57B4C9']
@Component({
  components: {
    PieNest,
    BarxCategoryStack,
    WordCloud,
    DetailNavBar
  }
})
export default class Temporary extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
  tooltipStyles = tooltipStyles

  form: any = {
    beginDate: [
      // new Date(2019, 3, 9), new Date(2019, 4, 11)
    ],
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
    ],
    // 情感分类
    emotion: [
      {
        key: 0,
        name: 'positive',
        text: '正面'
      },
      {
        key: 1,
        name: 'passive',
        text: '负面'
      },
      {
        key: 2,
        name: 'neutral',
        text: '中性'
      }
    ],
    channelList: [
      {
        text: '微博',
        key: 'weibo'
      },
      {
        text: '微信',
        key: 'wechat'
      },
      {
        text: '快手',
        key: 'kuaishou'
      },
      {
        text: '抖音',
        key: 'douyin'
      },
      {
        text: '小红书',
        key: 'xiaohongshu'
      }
    ]
  }

  chart1: any = {
    title: '评论情绪分布',
    dict1: [],
    dict2: this.dict.emotion,
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: colors
  }
  chart2: any = {
    title: '',
    dict1: [
      {
        key: 'trend',
        name: '新增'
      },
      {
        key: 'count',
        name: '累计'
      }
    ],
    dict2: this.dict.emotion,
    xAxis: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [
      [
        {
          name: '中性',
          type: 'bar',
          stack: 'totalCount',
          barMaxWidth: '20',
          data: []
        },
        {
          name: '正面',
          type: 'bar',
          stack: 'totalCount',
          barMaxWidth: '20',
          data: []
        },
        {
          name: '负面',
          type: 'bar',
          stack: 'totalCount',
          barMaxWidth: '20',
          data: []
        }
      ],
      [
        {
          name: '中性',
          type: 'bar',
          stack: 'totalCount',
          data: []
        },
        {
          name: '正面',
          type: 'bar',
          stack: 'totalCount',
          data: []
        },
        {
          name: '负面',
          type: 'bar',
          stack: 'totalCount',
          data: []
        }
      ]
    ],
    color: colors
  }
  chart3: any = {
    title: '正面评论关键词',
    dict1: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['rgba(0,32,45,0)']
  }
  chart4: any = {
    title: '负面评论关键词',
    dict1: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['rgba(0,32,45,0)']
  }
  async typeChangeHander(index: number = 0) {
    this.chart2.currentTypeIndex = index
  }

  /**
   * 加载日期区间描述
   */
  async dayRangesFetch() {
    /* const query = {}
    const id: number = 107028
    try {
      const { data } = await dayRanges({ ...query, id })
      this.dict.dayRanges = data.dayRanges
    } catch (ex) {
      this.handleError(ex)
    } */
  }
  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const that: any = this
    const mockObj = {
      beginDate: this.form.beginDate[0],
      endDate: this.form.beginDate[1],
    }
    // 107028 dev有数据
    const id = this.$route.params.id || ''
    try {
      const {
        data,
        data: {
          rate,
          keyWords,
          items,
        }
      } = await comment({ ...mockObj }, id)
      for ( const k in rate ) {
        if ( rate[k] ) {
          const index = findIndex(this.dict.emotion, (it: any) => {
            return it.name == k
          })
          this.chart1.dataList[0].push({
            value: rate[k],
            name: this.dict.emotion[index].text
          })
        }
      }

      items.forEach((item: any, index: number) => {
        //  positive 正面 index:0 | passive 负面 index:1 | neutral 中性 indxe:2
        // trend 新增 index:0 | count 累计 index:1
        const { date, neutral, passive, positive } = item
        that.chart2.xAxis.push( date )
        that.chart2.dataList[0][0].data.push(item.positive.trend)
        that.chart2.dataList[0][1].data.push(item.passive.trend)
        that.chart2.dataList[0][2].data.push(item.neutral.trend)
        that.chart2.dataList[1][0].data.push(item.positive.count)
        that.chart2.dataList[1][1].data.push(item.passive.count)
        that.chart2.dataList[1][2].data.push(item.neutral.count)
      })
      if (keyWords == null ) {
      } else {
        keyWords[this.form.dayRangesKey].positive.forEach((item: any) => {
          that.chart3.dataList[0].push({
            name: item,
            value: Math.floor(Math.random() * 100 + 1)
          })
        })
        keyWords[this.form.dayRangesKey].negative.forEach((item: any) => {
          that.chart4.dataList[0].push({
            name: item,
            value: Math.floor(Math.random() * 100 + 1)
          })
        })
      }
      that.chart1.initDone = true
      that.chart2.initDone = true
      that.chart3.initDone = true
      that.chart4.initDone = true
    } catch (ex) {
      this.handleError(ex)
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
  async handleChange() {
    this.form.beginDate[0] = this.beginDate(this.form.dayRangesKey)
    this.form.beginDate[1] = this.endDate()
    this.chart2.initDone = false
    this.chart1.initDone = false
    this.chart3.initDone = false
    this.chart4.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }
  created() {
    this.form.beginDate[0] = this.beginDate(this.form.dayRangesKey)
    this.form.beginDate[1] = this.endDate()
    // this.dayRangesFetch() // 本地写死，暂时取消
    this.initHandler()
  }
  async initHandler() {
    if (this.chart1.dict1.length > 0) {
      this.chart1.dict1.map((item: any, index: number) => {
        this.chart1.dataList.push([])
      })
    } else {
      this.chart1.dataList.push([])
    }
    if (this.chart3.dict1.length > 0) {
      this.chart3.dict1.map((item: any, index: number) => {
        this.chart3.dataList.push([])
      })
    } else {
      this.chart3.dataList.push([])
    }

    if (this.chart4.dict1.length > 0) {
      this.chart4.dict1.map((item: any, index: number) => {
        this.chart4.dataList.push([])
      })
    } else {
      this.chart4.dataList.push([])
    }
    await this.getChartsData('', 0)
  }
  resetData() {
    this.chart1.dataList.forEach((item: any[]) => {
      item.splice(0, item.length)
    })
    this.chart2.xAxis.splice(0, this.chart2.xAxis.length)
    this.chart2.dataList.forEach((item: any) => {
      item.forEach((it: any) => {
        it.data.splice(0, it.data.length)
      })
    })
    this.chart3.dataList.forEach((item: any) => {
      item.splice(0, item.length)
    })
    this.chart4.dataList.forEach((item: any) => {
      item.splice(0, item.length)
    })
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>