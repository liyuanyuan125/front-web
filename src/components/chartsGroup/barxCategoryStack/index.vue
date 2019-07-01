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
                  v-if=" dict1.length > 0 "
                  @on-change='currentTypeChange'
                  v-model="currentIndex"
                  type="button">
        <Radio v-for="(item,index) in dict1" v-show=" initDone "
               :key="item.key"
               :label="index">{{item.name}}</Radio>
      </RadioGroup>
    </div>    
    <Row type="flex" justify="center" align="middle">
      <Col :span="24">
        <div v-if="noData" class="nodata-wp" :style="`width: 100%; height:${ (height > 0) ? height : 400 }px`">暂无数据</div>
        <div v-else-if=" initDone && !noData ">
          <div ref="refChart" :style="`width: 100%; height:${ (height > 0) ? height : 400 }px`"></div>
        </div>
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
    trigger:  'item',
    formatter:  '{b} <br/> {c}'
})
@Component({
  components: {
    TinyLoading
  }
})
// x轴堆叠条形图
export default class BarXCategoryStack extends ViewBase {
  @Prop({ type: Boolean, default: false }) noData?: boolean
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: String, default: '' }) titleTips?: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: () => [] })  dict1!: any[]
  @Prop({ type: Array, default: () => [] })  dict2!: any[]
  @Prop({ type: Array, default: () => [] })  xAxis!: any[]
  @Prop({ type: Array, default: () => [] })  color!: any[]
  @Prop({ type: Array, default: () => [] })  dataList!: any[]
  @Prop({ type: Function, default: () => {} }) fn?: any
  @Prop({ type: Number, default: 0 }) height?: number
  @Prop({ type: Object, default: () => ({ ...tooltipsDefault }) }) toolTip?: any


  currentIndex: number = this.currentTypeIndex
  currentTypeChange(index: number) {
    if ( !this.initDone ) { return }
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
    // debugger
    const myChart = echarts.init(this.$refs.refChart as any)
    // debugger
    const option: any = {
      color: this.color,
      ...pubOption,
      tooltip : this.toolTip,
      legend: {
        data: this.dict2.map((item: any) => {
          return item.text
        }),
        textStyle: {
          color: '#fff'
        },
        icon: 'circle',
        y: '25'
      },
      xAxis: {
        ...xOption,
        type: 'category',
        data: this.xAxis
      },
      yAxis: {
        ...dottedLineStyle,
        ...yOption,
        type: 'value'
      },
      series: this.dataList[this.currentIndex]
    }
    // console.save(option, `${new Date()}.json`)
    myChart.setOption(option)
    if ( this.fn !== null ) {
      myChart.on('click', this.fn)
    }
  }
  @Watch('initDone')
  watchInitDone(val: boolean) {
    if (val && !(this.noData) ) {
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