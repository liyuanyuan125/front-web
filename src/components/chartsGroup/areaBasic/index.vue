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
import echarts from 'echarts'
@Component({
  components: {
    TinyLoading
  }
})
// 基础面积图
export default class AreaBasic extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: [] }) dict1!: any[]
  @Prop({ type: Array, default: [] }) dict2!: any[]
  @Prop({ type: Array, default: [] }) color!: any[]
  @Prop({ type: Array, default: [] }) dataList!: any[]
  currentIndex: number = this.currentTypeIndex
  currentTypeChange(index: number) {
    this.currentIndex = index
    this.$emit('typeChange', index)
  }
  resetOptions() {
    this.currentIndex = this.currentTypeIndex
  }
  // 接口没调
  updateCharts() {
    if (!this.dataList[this.currentIndex].list || this.dataList[this.currentIndex].list.length < 1) { return }

    const chartData = this.dataList[this.currentIndex].list
    const myChart = echarts.init(this.$refs.barChart as any)
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
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.date
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: chartData.data,
          type: 'line',
          areaStyle: {}
      }],
      color: this.color[this.currentIndex],
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