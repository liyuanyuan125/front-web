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
              :label="index">{{item.text}}</Radio>
      </RadioGroup>
    </div>
    <div ref="refChart" v-if="initDone" style="width: 100%; height: 400px"></div>
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
// 简单饼图
export default class PieSimple extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: [] }) dict1!: any[]
  @Prop({ type: Array, default: [] }) dict2!: any[]
  @Prop({ type: Array, default: [] }) color!: any[]
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
  }
  updateCharts() {
    if (!this.dataList[this.currentIndex].list || this.dataList[this.currentIndex].list.length < 1) { return }
    const chartData = this.dataList[this.currentIndex].list
    const myChart = echarts.init(this.$refs.refChart as any)

    const chartSeries: any[] = []
    this.dict2.forEach((item, index) => {
      chartSeries.push({
        name: item.text,
        value: 0
      })
    })
    chartData.forEach((item: any, index: number ) => {
      chartSeries[item.key].value = item.data
    })
    const option: any = {
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series : [
        {
          name: this.title,
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data: chartSeries,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      color: this.color,
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