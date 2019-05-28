<style lang='less'>
.areaExtra-type-selectbox {
  .wp{
    padding: 0 15px ;
    .inner {
      padding: 15px;
      background:rgba(0,32,45,0.6);
      border-radius:6px;
      border-width: 2px;
      border-style: solid;
      .charts {
        padding: 0 ;
        margin: 0 ;
      }
    }
    .noBorder {
      border-color: rgba(0,32,45,0.6) !important;
    }
  }
}
</style>
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
      <Row type="flex" justify="space-between" 
          v-if="dict1.length > 0"
          class="areaExtra-type-selectbox">
        <Col v-for="(item,index) in dict1"
            span="6"
            :key="item.key"
            :label="index">
            <div class="wp" @click="currentTypeChange(item.key)">
              <div :class="['inner', currentIndex === item.key ? '' : 'noBorder']"
              :style="{ 'border-color':color[item.key] }" >
                <div class="content"><Icon type="md-help-circle" size="35" />{{item.text}}</div>
                <div class="chart">
                  <div :ref="'type-'+index" style="width: 100%; height: 100px"></div>
                </div>
              </div>
          </div>
        </Col>
      </Row>
    </div>
    <div ref="barChart"
         v-if="initDone"
         style="width: 100%; height: 400px"></div>
    <div v-else
         style="width: 100%; height: 400px">
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
  xOption
} from '../chartsOption'
@Component({
  components: {
    TinyLoading
  }
})
// 基础面积图
export default class AreaBasic extends ViewBase {
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
    if (
      !this.dataList[this.currentIndex].list ||
      this.dataList[this.currentIndex].list.length < 1
    ) {
      return
    }

    const chartData = this.dataList[this.currentIndex].list
    const myChart = echarts.init(this.$refs.barChart as any)
    const option: any = {
      color: this.color[this.currentIndex],
      ...pubOption,
      xAxis: {
        ...xOption,
        boundaryGap: false,
        data: chartData.date
      },
      yAxis: {
        type: 'value',
        ...dottedLineStyle,
        ...yOption
      },
      series: [
        {
          data: chartData.data,
          type: 'line',
          smooth: true,
          ...seriesOption
        }
      ]
    }
    option.tooltip.formatter = this.title + ` {c}`
    let _title = ''
    if (this.title === '') {
      _title = this.dict1[this.currentTypeIndex].text
      option.tooltip.formatter = _title + ` {c}`
    }
    option.tooltip.backgroundColor = this.color[this.currentIndex]
    myChart.setOption(option)
  }
  // 接口没调
  updateTypeCharts() {
    const ref: any[] = []
    this.dict1.forEach((item, index) => {
      const refArr = this.$refs[`type-${index}`] as any
      ref.push(refArr[0])
    })
    let option: any = {}
    function quadraticIn(k: number) {
      return k * k
    }
    const N_POINT: number = 10
    const grids: any[] = []
    const xAxes: any[] = []
    const yAxes: any[] = []
    const series: any[] = []
    const count: number = 0
    const data: any[] = []
    for ( let i = 0; i <= N_POINT; i++ ) {
      const x = i / N_POINT
      const y = quadraticIn(x)
      data.push([x, y])
    }
    grids.push({
      show: true,
      borderWidth: 0,
      // backgroundColor: '#fff',
      // shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowBlur: 2
    })
    xAxes.push({
      type: 'value',
      show: false,
      min: 0,
      max: 1,
      gridIndex: count
    })
    yAxes.push({
      type: 'value',
      show: false,
      min: -0.4,
      max: 1.4,
      gridIndex: count
    })
    series.push({
      name,
      type: 'line',
      xAxisIndex: count,
      yAxisIndex: count,
      data,
      showSymbol: false,
      animationEasing: name,
      animationDuration: 1000
    })
    option = {
      grid: grids,
      xAxis: xAxes,
      yAxis: yAxes,
      series
    }
    this.dict1.forEach( (item: any, index: number) => {
      option.color = [ this.color[index] ]
      echarts.init(ref[index]).setOption(option)
    })
  }
  @Watch('initDone')
  watchInitDone(val: boolean) {
    if (val) {
      this.$nextTick(() => {
        this.updateTypeCharts()
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