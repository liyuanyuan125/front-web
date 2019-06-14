<template>
  <div>
    <div style='text-align:center'>
      <div class='title-box'>
        <span v-if=" title !=='' ">{{title}}</span>
        <Tooltip max-width="200"
                 v-if=" titleTips !=='' "
                 :content="titleTips">
          <Icon type="md-help-circle" />
        </Tooltip>
      </div>
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
    <Row type="flex"
         justify="center" align="middle">
      <Col :span="24">
        <div ref="refChart"
           v-if="initDone"
           style="width: 100%; height: 400px"></div>
        <div v-else class='loading-wp' style="width: 100%; height: 400px">
            <TinyLoading  />
          </div>
      </Col>
    </Row>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import echarts from 'echarts'
import {
  pubOption,
  seriesOption,
  dottedLineStyle,
  yOption,
  xOption,
  barThinStyle,
  barItemStyleColor
} from '../chartsOption'
@Component({
  components: {
    TinyLoading
  }
})
// 柱状y轴分类
export default class BarYCategory extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: String, default: '' }) titleTips?: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: () => [] }) dict1!: any[]
  @Prop({ type: Array, default: () => [] }) color!: any[]
  @Prop({ type: Array, default: () => [] }) dataList!: any[]
  currentIndex: number = this.currentTypeIndex
  currentTypeChange(index: number) {
    this.currentIndex = index
    this.$emit('typeChange', index)
  }
  resetOptions() {
    this.currentIndex = this.currentTypeIndex
  }
  updateCharts() {
    if (
      !this.dataList[this.currentIndex] ||
      this.dataList[this.currentIndex].length < 1
    ) {
      return
    }
    const chartData: any[] = this.dataList[this.currentIndex]
    const myChart = echarts.init(this.$refs.refChart as any)
    const seriesData: any = {
      k: [],
      v: []
    }
    chartData.forEach((item: any): void => {
      seriesData.k.push(item.name)
      seriesData.v.push(item.value)
    })
    const option: any = {
      color: this.color,
      ...pubOption,
      yAxis: {
        ...yOption,
        splitLine: { show: false },
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        data: seriesData.k
      },
      xAxis: {
        ...xOption,
        splitLine: { show: false },
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [
        {
          ...barThinStyle,
          ...barItemStyleColor,
          data: seriesData.v
        }
      ]
    }
    myChart.setOption(option)
  }
  @Watch('initDone')
  watchInitDone(val: boolean) {
    if (val) {
      this.$nextTick(() => {
        this.resetOptions()
        this.updateCharts()
      })
    }
  }
  @Watch('currentTypeIndex')
  watchcurrentTypeIndex(newIndex: any, oldIndex: any) {
    if (newIndex !== oldIndex) {
      this.resetOptions()
      this.updateCharts()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>