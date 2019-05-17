<template>
  <div>
    <div id="summaryLint" ref="summaryLint" style="width: 100%; height: 400px"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import CityMap from '@/components/cityMap'
import echarts from 'echarts'

// import { chartsTypes, chartsTypesName } from '../resReportChartsTypes'
@Component({
  components: {}
})
export default class ResReportCharts extends ViewBase {
  @Prop({ type: Object }) data: any

  xaxisList: any = []
  yAxList: any = []

  mounted() {
    // console.dir(this.data)
    this.$nextTick(() => {
      this.updateCharts()
    })
  }
  updateCharts() {
    // console.log(this.data.type)
    if (!this.data.dataList[this.data.chartsTypeKey]) { return }
    const myChart = echarts.init(this.$refs.summaryLint as any)
    this.xaxisList = this.data.dataList[this.data.chartsTypeKey].map((item: any) => item.date)
    this.yAxList = this.data.dataList[this.data.chartsTypeKey].map((item: any) => item.data)
    let option: any = {}
    if ( this.data.type === 'line' ) {
      option = Object.assign({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: this.data.backgroundColor
            }
          }
        },
        legend: {
          data: ['test']
        },
        color: this.data.color[0],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.xaxisList
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.data.name,
            type: this.data.type,
            stack: this.data.stack,
            areaStyle: {},
            data: this.yAxList
          }
        ]
      }, option)
    } else if ( this.data.type === 'bar' ) {
      option = Object.assign({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: this.data.backgroundColor
            }
          }
        },
        legend: {
          data: ['test']
        },
        color: this.data.color[0],
        xAxis: [
          {
            type: 'category',
            data: this.xaxisList
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.data.name,
            type: 'bar',
            stack: this.data.stack,
            areaStyle: {},
            data: this.yAxList
          }
        ]
      }, option)
    }
    myChart.setOption(option)
  }
  @Watch('data.time')
  watchValue(item: any) {
    this.updateCharts()
  }
  @Watch('data.chartsTypeKey')
  watchChartsTypeName(val: string) {
    this.updateCharts()
  }
}
</script>