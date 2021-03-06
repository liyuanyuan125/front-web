<template>
  <div class="page">
    <h3 class="page-title">账户概览</h3>
    <ul class="summary-list">
      <li class="summary-item summary-item-balance">
        <h4 class="summary-title">账户余额</h4>
        <div class="balance-number">
          &yen; <numAdd :addNum="accountBalance"></numAdd>
        </div>
      </li>

      <li class="summary-item summary-item-plan">
        <h4 class="summary-title">广告单</h4>
        <ul class="film-list">
          <li class="film-item">待接单：{{dispatch.waiting}}个</li>
          <li class="film-item">已接单：{{dispatch.received}}个</li>
          <li class="film-item">已拒绝：{{dispatch.refuse}}个</li>
          <li class="film-item">已失效：{{dispatch.faliure}}个</li>
        </ul>
      </li>

      <li class="summary-item summary-item-film">
        <h4 class="summary-title">执行单</h4>
        <ul class="film-list">
          <li class="film-item">待执行：{{executeOrder.unExecuteCount}}个</li>
          <li class="film-item">执行中：{{executeOrder.beExecuteCount}}个</li>
          <li class="film-item">已完成：{{executeOrder.outExecuteCount}}个</li>
        </ul>
      </li>
    </ul>


    <h3 class="page-title page-title-chart">映前广告成效</h3>

    <Tabs v-model="chartNav" class="chart-tabs">
      <TabPane v-for="it in chartList" :key="it.key" :name="it.key" :label="it.label">
        <ChartPane :data="it.data" v-if="it.data"/>
      </TabPane>
    </Tabs>
  </div>
</template>

<script lang="ts">
import { Component, Watch  } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { effect , nums , resdata , viewdata } from '@/api/home'
import { getStats, queryReport, getBrandList } from './api'
import echarts from 'echarts'
import numAdd from '../number.vue'
import { capitalize } from 'lodash'
import { MapType } from '@/util/types'
import { RawLocation } from 'vue-router'
import { dayOffsetRange } from '@/util/date'
import ChartPane from './chartPane.vue'

const offsetDay = (offset = 0) => moment().add(offset, 'day').format('YYYYMMDD')


@Component({
  components: {
    numAdd,
    ChartPane
  }
})
export default class Overview extends ViewBase {
  balance = 0

  planList: any[] = []

  filmSummary = {}

  brandList: any[] = []
  dispatch: any = []
  executeOrder: any = []
  accountBalance: any = 0

  chartNav = '7days'

  chartList: any[] = [
    {
      key: 'yesterday',
      label: '昨天',
      data: null,
      dateRange: dayOffsetRange(-1, -1),
    },

    {
      key: '7days',
      label: '最近7天',
      data: null,
      dateRange: dayOffsetRange(-7),
    },

    {
      key: '30days',
      label: '最近30天',
      data: null,
      dateRange: dayOffsetRange(-30),
    }
  ]

  async created() {
    this.initStats()
    this.queryReport()
    this.initBrandList()
  }

  async initStats() {
    // const { balance, planList, filmSummary } = await getStats()
    // this.balance = balance
    // this.planList = planList
    // this.filmSummary = filmSummary
    try {
      const { data } = await resdata()
        this.accountBalance = data.balance
        this.executeOrder = data.executeOrder
        this.dispatch = data.dispatchMsg
        // this.abc = true
        // this.searchsas()
        // this.searchs()
    } catch (ex) {
    this.handleError(ex)
    } finally {
    }
  }

  async initBrandList() {
    const list = await getBrandList()
    this.brandList = list
  }

  async queryReport() {
    const key = this.chartNav
    const chart = this.chartList.find(it => it.key == key)!
    if (chart.data != null) {
      return
    }
    const [beginDate, endDate] = chart.dateRange
    // console.log(beginDate, endDate)
    const start = new Date (String(beginDate).slice(0, 4) + '-' + String(beginDate).slice(4, 6)
      + '-' + String(beginDate).slice(6, 8)).getTime() - (8 * 60 * 60 * 1000)
    const end = new Date (String(endDate).slice(0, 4) + '-' + String(endDate).slice(4, 6)
      + '-' + String(endDate).slice(6, 8)).getTime() + (16 * 60 * 60 * 1000 - 1)
    // console.log(a , b)
    const data = await queryReport({ beginDate: start, endDate: end, effectType: 1, accountType: 'resource', })
    chart.data = data
  }

  @Watch('chartNav')
  watchChartNav() {
    this.queryReport()
  }
}
</script>

<style lang="less" scoped>
.page {
  padding: 20px 10px 88px;
}

.page-title {
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  user-select: none;
}

.summary-list {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  color: #fff;
  font-size: 14px;
}

.summary-item {
  position: relative;
  width: 32.34%;
  height: 200px;
  border: 2px solid;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.summary-item-balance {
  border-color: #ffde63;
  border-radius: 5px 0 0 0;
  background-color: rgba(239, 204, 74, .5);
  &::before {
    width: 98px;
    height: 106px;
    background-image: url(./assets/balance.png);
  }
}

.summary-item-plan {
  // width: 43.75%;
  border-color: #ff8f93;
  background-color: rgba(214, 86, 91, .5);
  &::before {
    width: 102px;
    height: 98px;
    background-image: url(./assets/plan.png);
  }
}

.summary-item-film {
  border-color: #2dd4e8;
  border-radius: 0 5px 0 0;
  background-color: rgba(40, 167, 182, .33);
  &::before {
    width: 91px;
    height: 96px;
    background-image: url(./assets/film.png);
  }
}

.summary-title {
  position: absolute;
  top: 22px;
  left: 21px;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  user-select: none;
}

.balance-number {
  font-size: 36px;
  margin-top: 83px;
  text-align: center;
}

.plan-list {
  display: flex;
  margin-top: 75px;
  line-height: 34px;
}

.plan-item {
  position: relative;
  flex: 1;
  padding-left: 30px;
  &::before {
    content: '';
    position: absolute;
    top: 11px;
    left: 0;
    width: 2px;
    height: 82px;
    background-color: rgba(255, 255, 255, .5);
    opacity: .3;
  }
  &:first-child::before {
    visibility: hidden;
  }
}

.plan-title {
  font-size: 16px;
  font-weight: 500;
}

.film-list {
  display: flex;
  flex-wrap: wrap;
  line-height: 34px;
  margin-top: 88px;
}

.film-item {
  width: 40.57%;
  padding-left: 30px;
}

.action-list {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.action-node {
  width: 15.86%;
  height: 150px;
  color: #ff8f93;
  margin-right: 10px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  padding-top: 30px;
  user-select: none;
  background: rgba(0, 32, 45, .8) url(./assets/tuiguang.png) no-repeat center 82px;
  background-size: 35px 35px;
  cursor: pointer;

  &:hover {
    opacity: .88;
  }

  &:first-child {
    color: #ffde63;
    background-image: url(./assets/toufang.png);
  }

  &:nth-child(3) {
    color: #2dd4e8;
    background-image: url(./assets/hezuo.png);
  }
}

.brand-pane {
  position: relative;
  flex: 1;
  color: #fff;
  background-color: rgba(0, 32, 45, .8);
}

.brand-title {
  position: absolute;
  top: 15px;
  left: 18px;
  font-size: 20px;
  font-weight: 400;
  line-height: 1;
  user-select: none;
}

.brand-more {
  position: absolute;
  top: 16px;
  right: 18px;
  color: #fff;
  &:hover {
    color: #fff;
    opacity: .88;
  }
}

.brand-list {
  display: flex;
  justify-content: center;
  line-height: 1;
  margin-top: 62px;
}

.brand-item {
  margin: 0 2.97%;
}

.brand-img {
  width: 62px;
  height: 60px;
}

.page-title-chart {
  margin-top: 52px;
}

.chart-tabs {
  /deep/ .ivu-tabs-bar {
    background: rgba(0, 32, 45, .8);
    border: 0;
    border-radius: 5px 5px 0 0;
    user-select: none;
    padding-left: 18px;
    margin: 13px 0 10px;
  }

  /deep/ .ivu-tabs-ink-bar {
    background-color: transparent;
    &::before {
      content: '';
      position: absolute;
      left: 21px;
      right: 21px;
      height: 100%;
      background-color: #fff;
    }
  }

  /deep/ .ivu-tabs-tab {
    color: #b3bcc0;
    line-height: 60px;
    padding: 0 21px;
  }

  /deep/ .ivu-tabs-tab-active {
    color: #fff;
  }
}
</style>
