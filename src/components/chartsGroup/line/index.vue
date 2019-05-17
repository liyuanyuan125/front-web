<style lang="less" scoped>
@import '~@/site/lib.less';
</style>
<template>
  <div>
    <div style='text-align:center; padding-top:50px'>
      <RadioGroup size="small"
                  @on-change='currentTypeChange'
                  v-model="currentIndex"
                  type="button">
        <Radio v-for="(item,index) in typeList"
              :key="item.key"
              :label="index">{{item.name}}</Radio>
      </RadioGroup>
    </div>
    <div id="summaryLint" ref="summaryLint" v-if="initDone" style="width: 100%; height: 400px"></div>
    <div v-else style="width: 100%; height: 400px" >      
      <TinyLoading />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import { IchartOptions } from './types'
import echarts from 'echarts'
@Component({
  components: {
    TinyLoading
  }
})
export default class LineChartGroup extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: [] }) typeList!: any[]
  @Prop({ type: Array, default: [] }) dataList!: any[]
  xaxisList: any = []
  yAxList: any = []
  thisdown: boolean = false
  chartOptions: IchartOptions = {
    name: this.typeList[this.currentTypeIndex].name,
    type: 'line',
    stack: '总量',
    color: ['#FE8135']
  }
  currentIndex: number = this.currentTypeIndex
  currentTypeKey: string = this.typeList[this.currentTypeIndex].key
  currentTypeChange(index: number) {
    this.currentIndex = index
    this.$emit('typeChange', index)
  }
  resetOptions() {
    this.currentIndex = this.currentTypeIndex
    this.currentTypeKey = this.typeList[this.currentTypeIndex].key
    this.chartOptions.name = this.typeList[this.currentTypeIndex].name
  }
  updateCharts() {
    if (!this.dataList[this.currentIndex].list || this.dataList[this.currentIndex].list.length < 1) { return }
    const chartData = this.dataList[this.currentIndex].list
    const myChart = echarts.init(this.$refs.summaryLint as any)
    this.xaxisList = chartData.map((item: any) => item.date)
    this.yAxList = chartData.map((item: any) => item.data)
    let option: any = {}
    if ( this.chartOptions.type === 'line' ) {
      option = Object.assign({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: this.chartOptions.color
            }
          }
        },
        legend: {
          data: ['曝光分布0']
        },
        color: this.chartOptions.color,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.xaxisList
          }
        ],
        yAxis: [
          {
            boundaryGap: false,
            type: 'value'
          }
        ],
        series: [
          {
            name: this.chartOptions.name,
            type: this.chartOptions.type,
            data: this.yAxList
          }
        ]
      }, option)
    }
    myChart.setOption(option)
  }
  @Watch('initDone')
  watchInitDone(val: boolean) {
    if ( val ) {
      this.$nextTick( () => {
        this.resetOptions()
        this.updateCharts()
      })
    }
  }
  @Watch('currentTypeIndex')
  watchcurrentTypeIndex(newIndex: any, oldIndex: any) {
    if ( newIndex !== oldIndex ) {
      this.resetOptions()
      this.updateCharts()
    }
  }
}
</script>