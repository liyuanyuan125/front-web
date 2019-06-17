<template>
  <div class="page">
    <WeekDatePicker v-model="weekDate"/>

    <div>
      <a @click="visible = true">打开</a>
    </div>

    <CitySelectDialog
      v-model="visible"
      :cityIds.sync="cityIds"
      :topCityIds="topCityIds"
      @ok="onCitySelectOk"
    />

    <ECharts :options="chartData" auto-resize class="chart"/>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import WeekDatePicker from '@/components/weekDatePicker'
import CitySelectDialog from '@/components/citySelectDialog'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'

@Component({
  components: {
    WeekDatePicker,
    CitySelectDialog,
    ECharts
  }
})
export default class AboutPage extends ViewBase {
  // weekDate = [null, null]
  weekDate = [new Date(2019, 4, 9), new Date(2019, 4, 15)]

  cityIds = [349, 170, 353]

  topCityIds = [349, 430, 170, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428]

  visible = false

  chartData: any = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
      {
        name: '近7日评论分析',
        type: 'pie',
        radius: [33, 49],
        label: {
          formatter: '{b}\n{d}%',
          lineHeight: 156
        },
        labelLine: {
          show: false
        },
        data: [
          { name: '正面', value: 80, itemStyle: { color: '#ca7273' } },
          { name: '中立', value: 30, itemStyle: { color: '#f3d872' } },
          { name: '负面', value: 20, itemStyle: { color: '#57b4c9' } }
        ]
      }
    ]
  }

  onCitySelectOk({ fastList }: any) {
    debugger
  }

  async mounted() {
    // const xx = list.filter(it => it.subList != null)
    // console.log(xx)
    // const one = xx.filter(it => it.subList.length == 1)
    // console.log(one)
  }
}
</script>

<style lang="less" scoped>
.page {
  padding: 15px;
  height: 1800px;
}
</style>
