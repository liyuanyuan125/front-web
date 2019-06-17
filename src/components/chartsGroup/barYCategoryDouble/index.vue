
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
    <Row type="flex" justify="space-between" v-if="initDone">  
      <Col :span="12">
        <div ref="refChart0" style="width: 100%; min-height: 300px"></div>
      </Col>
      <Col :span="12">
        <div ref="refChart1" style="width: 100%; min-height: 300px"></div>
      </Col>  
    </Row>
    <div v-else class='loading-wp' style="width: 100%; height: 400px">
        <TinyLoading />
    </div>
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
  barThinStyle
} from '../chartsOption'
import { tooltipStyles } from '@/util/echarts'
const tooltipsDefault = tooltipStyles({
    trigger:  'item',
    formatter:  '{b} <br/> {c}'
})
@Component({
  components: {
    TinyLoading
  }
})
// 简单饼图
export default class BarYCategoryDouble extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: String, default: '' }) titleTips?: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: () => [] }) dict1!: any[]
  @Prop({ type: Array, default: () => [] }) dict2!: any[]
  @Prop({ type: Array, default: () => [] }) color!: any[]
  @Prop({ type: Array, default: () => [] }) dataList!: any[]
  @Prop({ type: Object, default: () => ({ ...tooltipsDefault }) }) toolTip?: any

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
    const chartData = this.dataList[this.currentIndex]
    const myChart0 = echarts.init(this.$refs.refChart0 as any)
    const myChart1 = echarts.init(this.$refs.refChart1 as any)

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
    chartData.forEach((item: any, index: number) => {
      seriesData[item.key].data.push(item.data)
      seriesData[item.key].itemNames.push(item.itemName)
    })
    const option0: any = {
      ...pubOption,
      tooltip : this.toolTip,
      yAxis: {
        splitLine: { show: false },
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        type: 'category',
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#cdd0d3'
          }
        },
        data: seriesData[0].itemNames
      },
      series: [
        {
          ...barThinStyle,
          name: seriesData[0].text,
          data: seriesData[0].data
        }
      ],
      color: this.color[0]
    }

    const option1: any = {
      ...pubOption,
      tooltip : this.toolTip,
      yAxis: {
        splitLine: { show: false },
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        type: 'category',
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#cdd0d3'
          }
        },
        data: seriesData[1].itemNames
      },
      series: [
        {
          ...barThinStyle,
          name: seriesData[1].text,
          data: seriesData[1].data
        }
      ],
      color: this.color[1]
    }
    myChart0.setOption(option0)
    myChart1.setOption(option1)
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