<style lang="less" scoped>
@import '~@/site/lib.less';
h1 {
  text-align: left;
  font-size: 14px
}
</style>
<template>
  <div>
    <div style='text-align:center; padding-top:50px'>
      <h1 v-if="title !==''">{{title}}</h1>
      <RadioGroup size="small"
                  v-if="dict1.length > 0"
                  @on-change='currentTypeChange'
                  v-model="currentIndex"
                  type="button">
        <Radio v-for="(item,index) in dict1"
              :key="item.key"
              :label="index">{{item.name}}</Radio>
      </RadioGroup>
    </div>
    <div ref="barChart" v-if="initDone" style="width: 100%; height: 400px"></div>
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
// bar-category-stack
export default class BarCategoryStack extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: [] }) dict1!: any[]
  @Prop({ type: Array, default: [] }) dict2!: any[]
  @Prop({ type: Array, default: [] }) dataList!: any[]
  xaxisList: any = []
  yAxList: any = {}
  thisdown: boolean = false
  chartOptions: IchartOptions = {
    name: '',
    type: 'bar',
    color: ['#ca7273', '#f3d872', '#57b4c9']
  }
  currentIndex: number = this.currentTypeIndex
  currentTypeChange(index: number) {
    this.currentIndex = index
    this.$emit('typeChange', index)
  }
  resetOptions() {
    this.currentIndex = this.currentTypeIndex
    if (this.dict1.length > 0) {
      this.chartOptions.name = this.dict1[this.currentTypeIndex].name
    } else {
      this.chartOptions.name = 'default'
    }
  }
  updateCharts() {
    if (!this.dataList[this.currentIndex].list || this.dataList[this.currentIndex].list.length < 1) { return }
    const chartData = this.dataList[this.currentIndex].list
    const myChart = echarts.init(this.$refs.barChart as any)

    let chartSeries: any[] = []
    this.dict2.forEach((item, index) => {
      const _name = item.key
      const obj: any = {}
      obj[_name] = {}
      chartSeries = Object.assign(obj, chartSeries)
    })
    chartSeries = this.dict2.map((item: any) => {
      return {
        name: '',
        type: 'bar',
        stack: 'total',
        label: {
          normal: {
            show: true,
            position: 'insideRight'
          }
        },
        data: []
      }
    })
    chartData.forEach((item: any, index: number ) => {
      chartSeries[item.key].data.push(item.data)
      chartSeries[item.key].name = this.dict2[item.key].text
      if (!this.xaxisList.includes(item.date)) {
        this.xaxisList.push(item.date)
      }
    })
    this.yAxList = chartSeries.map(item => item)
    let option: any = {}
    if ( this.chartOptions.type === 'bar' ) {
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
          data: this.dict2.map((item: any) => {
            return item.text
          }),
          y: 'bottom'
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '10%',
          containLabel: true
        },
        color: this.chartOptions.color,
        xAxis:  {
            type: 'category',
            data: this.xaxisList
        },
        yAxis: {
          type: 'value'
        },
        series: this.yAxList
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