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
                  v-if="dict2.length > 0"
                  @on-change='currentTypeChange'
                  v-model="currentIndex"
                  type="button">
        <Radio v-for="(item,index) in dict2"
              :key="item.key"
              :label="index">{{item.name}}</Radio>
      </RadioGroup>
    </div>
    <div ref="barChart" v-if="initDone" style="width: 100%; height: 400px"></div>
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
// 柱状y轴分类
export default class BarYCategory extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: [] }) dict1!: any[]
  @Prop({ type: Array, default: [] }) dict2!: any[]
  @Prop({ type: Array, default: [] }) dataList!: any[]
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
    if (this.dict1.length > 0) {
      this.chartOptions.name = this.dict1[this.currentTypeIndex].name
    } else {
      this.chartOptions.name = 'default'
    }
  }
  // 接口没调
  updateCharts() {
    if (!this.dataList[this.currentIndex].list || this.dataList[this.currentIndex].list.length < 1) { return }
    const chartData = this.dataList[this.currentIndex].list
    const myChart = echarts.init(this.$refs.barChart as any)

    let seriesData: any = []
    this.dict2.forEach((item, index) => {
      const _name = item.key
      const obj: any = {}
      obj[_name] = {
        data: [],
        itemNames: [],
        text: item.text
      }
      seriesData = Object.assign(obj, seriesData)
    })
    chartData.forEach((item: any, index: number ) => {
      seriesData[item.key].data.push(item.data)
      seriesData[item.key].itemNames.push(item.itemName)
    })

    const option: any = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        y: 'bottom'
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '10%',
        containLabel: true,
        show: false,
        borderWidth: 0
      },
      yAxis: {
        splitLine: {show: false},
        splitArea : {show : false},
        show: true,
        type: 'category',
        data: seriesData[this.currentIndex].itemNames
      },
      xAxis: [
        {
        splitLine: {show: false},
        splitArea : {show : false},
        type: 'value',
        axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value} %'
          },
        show: false
        }
      ],
      series: [
        {
          name: seriesData[this.currentIndex].text,
          type: 'bar',
          data: seriesData[this.currentIndex].data
        }
      ],
      color: ['#ff9933'],
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