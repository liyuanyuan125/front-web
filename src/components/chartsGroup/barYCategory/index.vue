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
         justify="space-between">
      <Col :span="24">
      <div ref="barChart"
           v-if="initDone"
           style="width: 100%; height: 400px"></div>
      <div v-else
           style="width: 100%; height: 400px">
        <TinyLoading />
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
import { pubOption, seriesOption, dottedLineStyle, yOption, xOption, barThinStyle } from '../chartsOption'
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
      color: this.color,
      ...pubOption,
      yAxis: {
        ...yOption,
        splitLine: { show: false },
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        data: seriesData[this.currentIndex].itemNames
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
          name: seriesData[this.currentIndex].text,
          data: seriesData[this.currentIndex].data
        }
      ]
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