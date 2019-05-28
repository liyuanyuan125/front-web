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
                  <PieNest :initDone="pieNest.initDone"
                         :title='pieNest.title'
                         :dict1="pieNest.dict1"
                         :dict2="pieNest.dict2"
                         :color="pieNest.color"
                         :dataList="pieNest.dataList"
                         :currentTypeIndex="pieNest.currentTypeIndex"
                         @typeChange='typeChangeHander1' />
                </div>
              </Col>
              <Col :span="12">
                <div class='chart-wp'>
                  <BarCategoryStack :initDone="barStack.initDone"
                                  :title='barStack.title'
                                  :dict1="barStack.dict1"
                                  :dict2="barStack.dict2"
                                  :color="barStack.color"
                                  :dataList="barStack.dataList"
                                  :currentTypeIndex="barStack.currentTypeIndex"
                                  @typeChange='typeChangeHander2' />
                </div>
              </Col>
            </Row>
            <Row type="flex" justify="space-between" style='margin-top:10px'>
              <Col :span="12">
                <div class='chart-wp borderRadius' style='margin-right:10px'>
                  <WordCloud :initDone="wordCloud1.initDone"
                           :title='wordCloud1.title'
                           :dict1="wordCloud1.dict1"
                           :color="wordCloud1.color"
                           :dataList="wordCloud1.dataList"
                           :currentTypeIndex="wordCloud1.currentTypeIndex"
                           @typeChange='typeChangeHander3' />
                </div>
              </Col>
              <Col :span="12">
                <div class='chart-wp borderRadius'>
                  <WordCloud :initDone="wordCloud2.initDone"
                           :title='wordCloud2.title'
                           :dict1="wordCloud2.dict1"
                           :color="wordCloud2.color"
                           :dataList="wordCloud2.dataList"
                           :currentTypeIndex="wordCloud2.currentTypeIndex"
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
  barStack: any = {
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
  pieNest: any = {
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
  wordCloud1: any = {
    title: '正面评论关键词',
    dict1: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: colors
  }
  wordCloud2: any = {
    title: '负面评论关键词',
    dict1: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: colors
  }
  async typeChangeHander1(index: number = 0) {
    if (this.pieNest.dataList[index].list.length < 1) {
      await this.getChartsData('pieNest', index)
    }
    this.pieNest.currentTypeIndex = index
  }
  async typeChangeHander2(index: number = 0) {
    if (this.barStack.dataList[index].list.length < 1) {
      await this.getChartsData('barStack', index)
    }
    this.barStack.currentTypeIndex = index
  }
  async typeChangeHander3(index: number = 0) {
    if (this.wordCloud1.dataList[index].list.length < 1) {
      await this.getChartsData('wordCloud1', index)
    }
    this.wordCloud1.currentTypeIndex = index
  }
  async typeChangeHander4(index: number = 0) {
    if (this.wordCloud1.dataList[index].list.length < 1) {
      await this.getChartsData('wordCloud2', index)
    }
    this.wordCloud2.currentTypeIndex = index
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
      that.barStack.dict2 = data.barStack.effectTypeList
      that.barStack.dataList[0].list = data.barStack.dataList
      that.barStack.dataList[1].list = data.barStack.dataList
      that.barStack.initDone = true
      that.pieNest.dict2 = data.pieNest.effectTypeList
      that.pieNest.dataList[0].list = data.pieNest.dataList
      that.pieNest.initDone = true
      that.wordCloud1.dataList[0].list = data.wordCloud1.dataList
      that.wordCloud1.initDone = true
      that.wordCloud2.dataList[0].list = data.wordCloud2.dataList
      that.wordCloud2.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleChange() {
    this.barStack.initDone = false
    this.pieNest.initDone = false
    this.wordCloud1.initDone = false
    this.wordCloud2.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }
  async mounted() {
    this.initHandler()
  }
  async initHandler() {
    if (this.barStack.dict1.length > 0) {
      this.barStack.dict1.map((item: any, index: number) => {
        this.barStack.dataList.push({
          list: []
        })
      })
    } else {
      this.barStack.dataList.push({
        list: []
      })
    }
    if (this.pieNest.dict1.length > 0) {
      this.pieNest.dict1.map((item: any, index: number) => {
        this.pieNest.dataList.push({
          list: []
        })
      })
    } else {
      this.pieNest.dataList.push({
        list: []
      })
    }
    if (this.wordCloud1.dict1.length > 0) {
      this.wordCloud1.dict1.map((item: any, index: number) => {
        this.wordCloud1.dataList.push({
          list: []
        })
      })
    } else {
      this.wordCloud1.dataList.push({
        list: []
      })
    }
    if (this.wordCloud2.dict1.length > 0) {
      this.wordCloud2.dict1.map((item: any, index: number) => {
        this.wordCloud2.dataList.push({
          list: []
        })
      })
    } else {
      this.wordCloud2.dataList.push({
        list: []
      })
    }
    await this.getChartsData('', 0)
  }
  resetData() {
    this.pieNest.dataList.forEach((item: any) => {
      item.list = []
    })
    this.barStack.dataList.forEach((item: any) => {
      item.list = []
    })
    this.wordCloud1.dataList.forEach((item: any) => {
      item.list = []
    })
    this.wordCloud2.dataList.forEach((item: any) => {
      item.list = []
    })
  }
}
</script>