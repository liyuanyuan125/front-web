
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
    <Row type="flex" justify="space-between">
      <Col :span="24">
        <div ref="refChart"
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
import {
  pubOption,
  seriesOption,
  dottedLineStyle,
  yOption,
  xOption,
  barThinStyle
} from '../chartsOption'
@Component({
  components: {
    TinyLoading
  }
})
// 简单饼图
export default class PieSimple extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: String, default: '' }) titleTips?: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: () => [] }) dict1!: any[]
  @Prop({ type: Array, default: () => [] }) dict2!: any[]
  @Prop({ type: Array, default: () => [] }) dict3!: any[]
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
    const chartData = this.dataList[this.currentIndex]
    const myChart = echarts.init(this.$refs.refChart as any)

    // series数据处理等接口设计结束后调整。nxd fans 和 matching都有数据问题
    // const chartSeries: any[] = []
    // this.dict2.forEach((item, index) => {
    //   chartSeries.push({
    //     name: '',
    //     type: 'bar',
    //     data: []
    //   })
    // })
    // chartData.forEach((item: any, index: number) => {
    //   chartSeries[item.key].name = this.dict2[item.key].text
    //   chartSeries[item.key].data.push({
    //     value: item.data,
    //     key2: item.key2
    //   })
    // })

    const option: any = {
      color: this.color,
      ...pubOption,
      xAxis: {
        ...xOption,
        data: this.dict3.map((item: any) => {
          return item.text
        })
      },
      yAxis: {
        ...dottedLineStyle,
        ...yOption
      },
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