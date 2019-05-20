<style lang="less" scoped>
@import '~@/site/lib.less';
.layout-panel {
  padding-top: 30px;
  border-radius: 10px;
}
.ivu-form-item {
  padding-left: 30px;
  color: @c-text;
  margin-bottom: 0;
}
/deep/ .ivu-input-icon {
  line-height: 40px;
  height: 40px;
}
.radio-item-type {
  font-size: 14px;
  margin-top: 4px;
  .ivu-radio-wrapper {
    font-size: 14px;
    margin-right: 35px;
  }
}
/deep/ .ivu-select-input {
  height: 40px;
  line-height: 40px;
}
</style>
<style lang='less'>
/* 公用 */
.my-card {
  .ivu-card-head {
    background: #f6f6f6;
  }
  .ivu-card-body {
    padding: 0;
  }
  .content {
    padding: 15px 0;
    .chart-wp {
      border-radius: 5px;
      background: #fff;
      min-height: 520px;
    }
  }
}
</style>
<template>
  <div style='display:flex; background:blue'>
    <div style='width:300px; text-align:center; color:#ffffff'>
      <h3>吴京</h3>
      <h5>演员/导演/制片人</h5>
      <ul>
        <li>概览</li>
        <li>作品列表</li>
        <li>全网热度</li>
        <li>平台运营</li>
      </ul>
    </div>
    <div style='flex:1; background:#ffffff'>
      <div style='background:#ffffff'>
        <Row>
          <Col span="24">
          <Form label-position="left"
                :label-width="100"
                class="edit-input">
            <Card class="my-card">
              <div slot="title">
                <Row type="flex"
                     justify="space-between">
                  <Col :span="24">
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
                </Row>
              </div>
              <div class="content">
                <Row type="flex"
                     justify="space-between">
                  <Col :span="12">
                  <div class='chart-wp'
                       style='margin-right:10px'>
                    <PieNest :initDone="pieNest.initDone"
                             :title='pieNest.title'
                             :dict1="pieNest.dict1"
                             :dict2="pieNest.dict2"
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
                                      :dataList="barStack.dataList"
                                      :currentTypeIndex="barStack.currentTypeIndex"
                                      @typeChange='typeChangeHander2' />
                  </div>
                  </Col>
                </Row>
                <Row type="flex"
                     justify="space-between">
                  <Col :span="12">
                  <div class='chart-wp'
                       style='margin-right:10px'>
                    <WordCloud :initDone="wordCloud1.initDone"
                               :title='wordCloud1.title'
                               :dict1="wordCloud1.dict1"
                               :dataList="wordCloud1.dataList"
                               :currentTypeIndex="wordCloud1.currentTypeIndex"
                               @typeChange='typeChangeHander3' />
                  </div>
                  </Col>
                  <Col :span="12">
                  <div class='chart-wp'>
                    <WordCloud :initDone="wordCloud2.initDone"
                               :title='wordCloud2.title'
                               :dict1="wordCloud2.dict1"
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
    </div>
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
import { platformData1, comment1 } from '@/api/kolDetailMoreInfo'
import numAdd from '../number.vue'
import PieNest from '@/components/chartsGroup/pieNest/'
import BarCategoryStack from '@/components/chartsGroup/barCategoryStack/'
import WordCloud from '@/components/chartsGroup/wordCloud/'
import DetailNavBar from './components/detailNavBar.vue'

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
    statisticTimeId: 0
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
    dataList: []
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
    dataList: []
  }
  wordCloud1: any = {
    title: '正面评论关键词',
    dict1: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  wordCloud2: any = {
    title: '负面评论关键词',
    dict1: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
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