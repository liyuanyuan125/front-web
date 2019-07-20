<template>
  <div>
    <div style="text-align:center">
      <div class="title-box">
        <span v-if=" title !=='' ">{{title}}</span>
        <Tooltip max-width="200" v-if=" titleTips !=='' " :content="titleTips">
          <Icon type="md-help-circle" />
        </Tooltip>
      </div>
      <RadioGroup size="small" v-if="dict1.length > 0 && dataList" @on-change="currentTypeChange" v-model="currentIndex" type="button">
        <Radio v-for="(item,index) in dict1" :key="item.key" :label="index">{{item.name}}</Radio>
      </RadioGroup>
    </div>
    <div class="content-wrap">
      <div v-if="initDone" ref="refChart" class="chart-wrap"></div>
      <div v-show="!initDone" class="chart-loading">
        <TinyLoading />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import echarts from 'echarts'
import { tooltipStyles } from '@/util/echarts'
import { find } from 'lodash'
import {
  pubOption,
  seriesOption,
  dottedLineStyle,
  yOption,
  xOption,
  barThinStyle
} from '../chartsOption'

const tooltipsDefault = tooltipStyles({
  trigger: 'item',
  formatter: '{b} <br/> {c}%'
})

@Component({
  components: {
    TinyLoading
  }
})
export default class BarXCategory extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean

  @Prop({ type: String, default: '' }) title?: string

  @Prop({ type: String, default: '' }) titleTips?: string

  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number

  @Prop({ type: Array, default: () => [] }) dict1!: any[]

  @Prop({ type: Array, default: () => [] }) dict2!: any[]

  @Prop({ type: Array, default: () => [] }) dict3!: any[]

  @Prop({ type: Array, default: () => [] }) color!: any[]

  @Prop({ type: Array, default: () => [] }) dataList!: any[]

  @Prop({ type: Number, default: 0 }) height?: number

  @Prop({ type: Object, default: () => ({ ...tooltipsDefault }) }) toolTip?: any

  @Prop({ type: String, default: '{value} %' }) axisLabelFormatter?: string

  // formatter: '{value} %'

  currentIndex: number = this.currentTypeIndex

  currentTypeChange(index: number) {
    if (!this.initDone) {
      return
    }
    this.currentIndex = index
    this.$emit('typeChange', index)
  }

  resetOptions() {
    this.currentIndex = this.currentTypeIndex
  }

  updateCharts() {
    const chartData: any = this.dataList[this.currentIndex] || {}

    if ( !chartData || chartData.length === 0 ) {
      return
    }

    const chartEl = this.$refs.refChart as HTMLDivElement

    echarts.dispose(chartEl)
    chartEl.innerHTML = ''

    const myChart = echarts.init(chartEl)

    const option: any = {
      color: this.color,
      ...pubOption,
      tooltip: this.toolTip,
      xAxis: {
        axisLine: {
          lineStyle: {
            color: '#CDD0D3'
          }
        },
        axisTick: {
          show: false
        },
        data: this.dict3.map((item: any) => {
          return item.text
        }),
        // todo 20190709 文字超出限定数目就旋转展示
        // axisLabel : {// 坐标轴刻度标签的相关设置。
        //   interval: 0,
        //   rotate: '-45'
        // },
        // nameLocation: 'end'
      },
      yAxis: {
        ...yOption,
        axisLabel: {
          formatter: `${this.axisLabelFormatter}`
        },
        axisLine: {
          show: false,
          type: 'dashed',
          lineStyle: {
            color: '#CDD0D3',
            width: 0,
            opacity: 0
          },
          axisTick: {
            show: false
          }
        }
      },
      series: chartData
    }
    // debugger
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

/deep/ .ivu-radio-group {
  .ivu-radio-wrapper {
    background: none;
    border: none;
    box-shadow: none !important;
    color: #cdd0d3;
    &::before,
    &::after {
      display: none;
    }
  }
  /deep/ .ivu-radio-wrapper-checked {
    color: #fff;
    border-bottom: 2px solid #fff;
    .ivu-radio-inner {
      display: none;
    }
    &::before,
    &::after {
      display: none;
    }
  }
}
.nav {
  .ivu-radio-wrapper {
    height: 60px;
    padding: 0;
    line-height: 60px;
    margin: 0 10px;
    border-radius: 0 !important;
  }
  .ivu-radio-wrapper-checked {
    color: #fff;
    border-bottom: 2px solid #fff;
  }
}

.content-wrap {
  position: relative;
  width: 100%;
  height: 400px;
}
.chart-wrap {
  width: 100%;
  height: 400px;
}
.chart-wrap:empty {
  display: flex;
  align-items: center;
  justify-content: center;
  &::before {
    content: '暂无数据';
    font-size: 18px;
    color: #999;
  }
}
.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
}
</style>