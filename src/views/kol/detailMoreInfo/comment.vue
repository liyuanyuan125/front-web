<style lang="less">
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
      <Form label-position="left"
            :label-width="100">
        <Card class="detailmore-card">
          <div slot="title">
            <Row type="flex" justify="space-between" align="middle">
              <Col :span="17">
                <DetailNavBar titleText='统计周期'>
                  <div slot='item'>
                    <RadioGroup class='nav'
                              @on-change="handleChange"
                              v-model="form.dayRangesKey"
                              size="large"
                              type="button">
                    <Radio v-for="(item) in dict.dayRanges"
                           :key="item.key"
                           :disabled="item.disabled"
                           :label="item.key">{{item.text}}</Radio>
                  </RadioGroup>
                  </div>
                </DetailNavBar>
              </Col>
              <Col :span="7" style="text-align:right" >
                平台
                <Select v-model="form.channelCode"
                        clearable
                        @on-change="handleChange"
                        style="width:150px; text-align:left">
                  <Option v-for="(item) in dict.channelList"
                          :key="item.key"
                          :value="item.key">{{item.text}}</Option>
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
                         :color="chart1.color"
                         :dataList="chart1.dataList"
                         :currentTypeIndex="chart1.currentTypeIndex"
                         @typeChange='typeChangeHander1' />
                </div>
              </Col>
              <Col :span="12">
                <div class='chart-wp'>
                  <BarCategoryStack :initDone="chart2.initDone"
                                  :title='chart2.title'
                                  :dict1="chart2.dict1"
                                  :dict2="chart2.dict2"
                                  :color="chart2.color"
                                  :dataList="chart2.dataList"
                                  :currentTypeIndex="chart2.currentTypeIndex"
                                  @typeChange='typeChangeHander2' />
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
                           :currentTypeIndex="chart3.currentTypeIndex"
                           @typeChange='typeChangeHander3' />
                </div>
              </Col>
              <Col :span="12">
                <div class='chart-wp borderRadius'>
                  <WordCloud :initDone="chart4.initDone"
                           :title='chart4.title'
                           :dict1="chart4.dict1"
                           :color="chart4.color"
                           :dataList="chart4.dataList"
                           :currentTypeIndex="chart4.currentTypeIndex"
                           @typeChange='typeChangeHander4' />
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </Form>
      </Col>
    </Row>
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
import { comment } from '@/api/kolDetailMoreInfo'
import PieNest from '@/components/chartsGroup/pieNest/'
import BarCategoryStack from '@/components/chartsGroup/barCategoryStack/'
import WordCloud from '@/components/chartsGroup/wordCloud/'
import DetailNavBar from './components/detailNavBar.vue'
const timeFormat = 'YYYYMMDD'
// #D0BF6B 中性
// #AD686C 正面
// #57B4C9 负面
const colors: string[] = ['#D0BF6B', '#AD686C', '#57B4C9']
@Component({
  components: {
    PieNest,
    BarCategoryStack,
    WordCloud,
    DetailNavBar
  }
})

export default class Temporary extends ViewBase {
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
    channelList: [{
      text: '微博',
      key: 'weibo'
    }, {
      text: '微信',
      key: 'wechat'
    }, {
      text: '快手',
      key: 'kuaishou'
    }, {
      text: '抖音',
      key: 'douyin'
    }, {
      text: '小红书',
      key: 'xiaohongshu'
    }]
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
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
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
  async typeChangeHander1(index: number = 0) {
    if (this.chart1.dataList[index].length < 1) {
      await this.getChartsData('chart1', index)
    }
    this.chart1.currentTypeIndex = index
  }
  async typeChangeHander2(index: number = 0) {
    this.chart2.currentTypeIndex = index
  }
  async typeChangeHander3(index: number = 0) {
    if (this.chart3.dataList[index].length < 1) {
      await this.getChartsData('chart3', index)
    }
    this.chart3.currentTypeIndex = index
  }
  async typeChangeHander4(index: number = 0) {
    if (this.chart3.dataList[index].length < 1) {
      await this.getChartsData('chart4', index)
    }
    this.chart4.currentTypeIndex = index
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
      channelCode: this.form.channelCode
    }
    // 1 dev有数据
    const id = parseInt(this.$route.params.id, 0)
    try {
      const {
        data,
        data: {
          rate
        },
        data: {
          items
        },
        data: {
          commentKeyword
        }
      } = await comment({ ...mockObj }, id)

      for ( const k in rate ) {
        if ( rate[k] ) {
          this.chart1.dataList[0].push({
            data: rate[k],
            key: this.dict.emotion.findIndex((item: any) => {
              return item.name === k
            })
          })
        }
      }
      // api文档缺少备注，待联调 nxd 20190604
      // dates.forEach((item: any) => {
      //   for ( let num = 0; num < 3; num++ ) {
      //     that.chart2.dataList[0].push({
      //       data: item[this.dict.emotion[num].name].trend,
      //       date: item.date,
      //       key: num
      //     })
      //     that.chart2.dataList[1].push({
      //       data: item[this.dict.emotion[num].name].count,
      //       date: item.date,
      //       key: num
      //     })
      //   }
      // })
      commentKeyword[this.form.dayRangesKey].positive.forEach((item: any) => {
        that.chart3.dataList[0].push({
          name: item,
          value: Math.floor(Math.random() * 100 + 1)
        })
      })
      commentKeyword[this.form.dayRangesKey].passive.forEach((item: any) => {
        that.chart4.dataList[0].push({
          name: item,
          value: Math.floor(Math.random() * 100 + 1)
        })
      })
      that.chart1.initDone = true
      // that.chart2.initDone = true
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
        break
      case 'thirtyDay' :
        return moment(new Date()).add(-30, 'days').format(timeFormat)
        break
      case 'ninetyDay' :
        return moment(new Date()).add(-90, 'days').format(timeFormat)
        break
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
  async mounted() {}
  async initHandler() {
    if (this.chart1.dict1.length > 0) {
      this.chart1.dict1.map((item: any, index: number) => {
        this.chart1.dataList.push([])
      })
    } else {
      this.chart1.dataList.push([])
    }

    if (this.chart2.dict1.length > 0) {
      this.chart2.dict1.map((item: any, index: number) => {
        this.chart2.dataList.push([])
      })
    } else {
      this.chart2.dataList.push([])
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
    this.chart2.dataList.forEach((item: any) => {
      item.splice(0, item.length)
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