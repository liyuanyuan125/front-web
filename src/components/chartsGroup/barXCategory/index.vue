<style lang="less" scoped>
@import '~@/site/lib.less';
h1 {
  text-align: left;
  font-size: 14px
}
</style>
<template>
  <div>
    <div style='text-align:center'>
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
// 柱状x轴分类
export default class BarXCategory extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: [] }) dict1!: any[]
  @Prop({ type: Array, default: [] }) dict2!: any[]
  @Prop({ type: Array, default: [] }) dict3!: any[]
  @Prop({ type: Array, default: [] }) color!: any[]
  @Prop({ type: Array, default: [] }) dataList!: any[]
  xaxisList: any = []
  seriesList: any[] = []
  chartOptions: IchartOptions = {
    name: '',
    type: 'bar',
    color: ['#ff9933', '#169bd5']
  }
  currentIndex: number = this.currentTypeIndex
  currentTypeChange(index: number) {
    this.currentIndex = index
    this.$emit('typeChange', index)
  }
  resetOptions() {
    this.currentIndex = this.currentTypeIndex
    this.seriesList = []
    this.xaxisList = []
  }
  updateCharts() {
    if (!this.dataList[this.currentIndex].list || this.dataList[this.currentIndex].list.length < 1) { return }
    const chartData = this.dataList[this.currentIndex].list
    const myChart = echarts.init(this.$refs.barChart as any)

    const chartSeries: any[] = []
    this.dict2.forEach((item, index) => {
      chartSeries.push({
        name: '',
        type: 'bar',
        data: []
      })
    })
    this.xaxisList = this.dict3.map((item: any) => {
      return item.text
    })
    // 数据处理等接口设计结束后调整。nxd
    chartData.forEach((item: any, index: number ) => {
      chartSeries[item.key].name = this.dict2[item.key].text
      chartSeries[item.key].data.push({
        value: item.data,
        key2: item.key2
      })
    })
    this.seriesList = chartSeries.map(item => item)

    let option: any = {}
    option = Object.assign({
      color: this.color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: this.xaxisList
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      // series: this.seriesList,
      series: [
        {
          name: 'Papi酱',
          type: 'bar',
          data: [230230, 330230, 630230, 230230, 630230]
        },
        {
          name: '奔驰',
          type: 'bar',
          data: [134141, 681807, 630230, 630230, 630230]
        }
      ]
    }, option)
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