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
                    <RadioGroup style='margin-right:15px'
                              @on-change="handleChange"
                              v-model="form.statisticTimeId"
                              size="large"
                              type="button">
                    <Radio v-for="(item) in dict.statisticTime"
                           :key="item.id"
                           :disabled="item.disabled"
                           :label="item.id">{{item.name}}</Radio>
                  </RadioGroup>
                  <DatePicker type="daterange"
                              v-model="form.beginDate"
                              @on-change="handleChange"
                              placement="bottom-end"
                              placeholder="自定义时间段"></DatePicker>
                  </div>
                </DetailNavBar>
              </Col>
              <Col :span="7" style="text-align:right" >
                平台
                <Select v-model="form.platformId"
                        clearable
                        @on-change="handleChange"
                        style="width:150px; text-align:left">
                  <Option v-for="(item) in dict.platform"
                          :key="item.id"
                          :value="item.id">{{item.name}}</Option>
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
import {
  formatTimestamp,
  formatTimes,
  formatNumber
} from '@/util/validateRules'
import { platformData, comment1 } from '@/api/kolDetailMoreInfo'
import numAdd from '../number.vue'
import PieNest from '@/components/chartsGroup/pieNest/'
import BarCategoryStack from '@/components/chartsGroup/barCategoryStack/'
import WordCloud from '@/components/chartsGroup/wordCloud/'
import DetailNavBar from './components/detailNavBar.vue'
// #D0BF6B 中性
// #AD686C 正面
// #57B4C9 负面
const colors: any[] = ['#D0BF6B', '#AD686C', '#57B4C9']
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
    statisticTimeId: 0,
    platformId: 0
  }
  dict: any = {
    statisticTime: [
      {
        id: 0,
        name: '昨天',
        disabled: false
      },
      {
        id: 1,
        name: '最近7天',
        disabled: false
      },
      {
        id: 2,
        name: '最近30天',
        disabled: false
      },
      {
        id: 3,
        name: '最近90天',
        disabled: true
      }
    ],
    platform: [
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
  chart1: any = {
    title: '评论情绪分布',
    dict1: [
      // {
      //   key: 0,
      //   name: '新增'
      // },
      // {
      //   key: 1,
      //   name: '累计'
      // }
    ],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: colors
  }
  chart2: any = {
    title: '',
    dict1: [
      {
        key: 0,
        name: '新增'
      },
      {
        key: 1,
        name: '累计'
      }
    ],
    dict2: [],
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
      beginDate: formatTimestamp(new Date(2019, 3, 9)),
      endDate: formatTimestamp(new Date(2019, 9, 11)),
      accountType: 'ads',
      effectType: typeIndex
    }
    try {
      const { data } = await comment1({ ...mockObj })
      that.chart1.dict2 = data.chart1.effectTypeList
      that.chart1.dataList[0] = data.chart1.dataList
      that.chart1.initDone = true

      that.chart2.dict2 = data.chart2.effectTypeList
      that.chart2.dataList[0] = data.chart2.dataList
      that.chart2.dataList[1] = data.chart2.dataList
      that.chart2.initDone = true

      that.chart3.dataList[0] = data.chart3.dataList
      that.chart3.initDone = true
      that.chart4.dataList[0] = data.chart4.dataList
      that.chart4.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleChange() {
    this.chart2.initDone = false
    this.chart1.initDone = false
    this.chart3.initDone = false
    this.chart4.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }
  async mounted() {
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
    this.chart1.dataList.forEach((item: any) => {
      item = []
    })
    this.chart2.dataList.forEach((item: any) => {
      item = []
    })
    this.chart3.dataList.forEach((item: any) => {
      item = []
    })
    this.chart4.dataList.forEach((item: any) => {
      item = []
    })
  }
}
</script>