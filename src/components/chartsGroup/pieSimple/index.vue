<template>
  <div>
    <div style='text-align:center'>
      <div class='title-box'>
        <span v-if=" title !=='' ">{{title}}</span>
        <Tooltip max-width="200" v-if=" titleTips !=='' " :content="titleTips">
          <Icon type="md-help-circle" />
        </Tooltip>
      </div>
      <RadioGroup size="small" v-if="dict1.length > 0" @on-change='currentTypeChange' v-model="currentIndex" type="button">
        <Radio v-for="(item,index) in dict1" :key="item.key" :label="index">{{item.name}}</Radio>
      </RadioGroup>
    </div>

    <Row type="flex" justify="center" align="middle">
      <Col :span="24">

      <div v-if="initDone && !noData">
        <div ref="refChart" :style="`width: 100%; height:${ (height > 0) ? height : 400 }px`"></div>
      </div>

      <div v-else-if="noData" class="nodata-wp" :style="`width: 100%; height:${ (height > 0) ? height : 400 }px`">暂无数据</div>

      <div v-else class="loading-wp" :style="`width: 100%; height:${ (height > 0) ? height : 400 }px`">
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
import { tooltipStyles } from '@/util/echarts'
const tooltipsDefault = tooltipStyles({
  trigger: 'item',
  formatter: '{b} <br/> {c}%'
})

@Component({
  components: {
    TinyLoading
  }
})
// 简单饼图
export default class PieSimple extends ViewBase {
  @Prop({ type: Boolean, default: false }) noData?: boolean
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: String, default: '' }) titleTips?: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: () => [] }) dict1!: any[]
  @Prop({ type: Array, default: () => [] }) dict2!: any[]
  @Prop({ type: Array, default: () => [] }) color!: any[]
  @Prop({ type: Array, default: () => [] }) dataList!: any[]
  @Prop({ type: Number, default: 0 }) height?: number
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

    const myChart = echarts.init(this.$refs.refChart as any)

    const chartSeries: any[] = []

    const option: any = {
      color: this.color,
      ...pubOption,
      tooltip: this.toolTip,
      series: [
        {
          name: this.title,
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          label: {
            formatter: ' \n {b} \n {d}%',
            fontSize: 18,
            align: 'center'
          },
          data: chartData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    // console.save(option, `${new Date()}.json`)
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
.nodata-wp {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #999;
}
</style>