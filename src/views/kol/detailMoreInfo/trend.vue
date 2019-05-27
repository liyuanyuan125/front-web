<style lang="less">
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
      <Form label-position="left"
            :label-width="100"
            class="edit-input">
        <Card class="detailmore-card">
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
              <Col :span="24">
              <div class='chart-wp'>
                <AreaBasic :initDone="chart1.initDone"
                           :title='chart1.title'
                           :dict1="chart1.dict1"
                           :dict2="chart1.dict2"
                           :color="chart1.color"
                           :dataList="chart1.dataList"
                           :currentTypeIndex="chart1.currentTypeIndex"
                           @typeChange='typeChangeHander1' />
              </div>
              </Col>
            </Row>
            <Row type="flex"
                 justify="space-between">
              <Col :span="24">
              <div class='chart-wp'>
                <AreaBasicxtra :initDone="chart2.initDone"
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
import { trend } from '@/api/kolDetailMoreInfo'
import AreaBasic from '@/components/chartsGroup/areaBasic/'
import AreaBasicxtra from '@/components/chartsGroup/areaBasicExtra/'

import DetailNavBar from './components/detailNavBar.vue'

@Component({
  components: {
    AreaBasic,
    AreaBasicxtra,
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
  chart1: any = {
    title: '综合热度',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#0099cc']
  }
  chart2: any = {
    title: '',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#ff0000', '#3fb23f', '#0099cc', '#cc6600']
  }
  async typeChangeHander1(index: number = 0) {}
  async typeChangeHander2(index: number = 0) {
    if (this.chart2.dataList[index].list.length < 1) {
      await this.getChartsData('chart2', index)
    }
    this.chart2.currentTypeIndex = index
  }
  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const mockObj = {
      effectType: typeIndex
    }
    try {
      const { data } = await trend({ ...mockObj })
      if (data.chart1.effectTypeList.length > 0) {
        this.chart1.dataList = data.chart1.effectTypeList.map(
          (item: any, index: number) => {
            return {
              list: {
                data: [],
                date: []
              }
            }
          }
        )
      } else {
        this.chart1.dataList.push({
          list: {
            data: [],
            date: []
          }
        })
      }
      this.chart1.dict1 = data.chart1.effectTypeList
      data.chart1.dataList.forEach((item: any, index: number) => {
        this.chart1.dataList[item.key].list.data.push(item.data)
        this.chart1.dataList[item.key].list.date.push(item.date)
      })
      this.chart1.initDone = true
      if (data.chart2.effectTypeList.length > 0) {
        this.chart2.dataList = data.chart2.effectTypeList.map(
          (item: any, index: number) => {
            return {
              list: {
                data: [],
                date: []
              }
            }
          }
        )
      } else {
        this.chart2.dataList.push({
          list: {
            data: [],
            date: []
          }
        })
      }
      this.chart2.dict1 = data.chart2.effectTypeList
      data.chart2.dataList.forEach((item: any, index: number) => {
        this.chart2.dataList[item.key].list.data.push(item.data)
        this.chart2.dataList[item.key].list.date.push(item.date)
      })
      this.chart2.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleChange() {
    this.chart1.initDone = false
    this.chart2.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }
  async mounted() {
    await this.getChartsData('', 0)
  }
  resetData() {
    this.chart1.dataList = []
    this.chart2.dataList = []
  }
}
</script>