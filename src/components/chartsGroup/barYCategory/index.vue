<template>
  <div>
    <div style="text-align:center">
      <div class="title-box">
        <span v-if=" title !=='' ">{{title}}</span>
        <Tooltip max-width="200" v-if=" titleTips !=='' " :content="titleTips">
          <Icon type="md-help-circle" />
        </Tooltip>
      </div>
      <RadioGroup
        size="small"
        v-if="dict1.length > 0"
        @on-change="currentTypeChange"
        v-model="currentIndex"
        type="button"
      >
        <Radio v-for="(item,index) in dict1" :key="item.key" :label="index">{{item.name}}</Radio>
      </RadioGroup>
    </div>

    <Row type="flex" justify="center" align="middle">
      <div ref="refChart" v-if="initDone" class="chart-wrap"></div>
      <div v-else class="loading-wp chart-loading">
        <TinyLoading />
      </div>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import echarts from 'echarts'
import { tooltipStyles } from '@/util/echarts'
import {
  pubOption,
  seriesOption,
  dottedLineStyle,
  yOption,
  xOption,
  barThinStyle,
  barItemStyleColor
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
// 柱状y轴分类
export default class BarYCategory extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean

  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: String, default: '' }) titleTips?: string

  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number

  @Prop({ type: Array, default: () => [] }) dict1!: any[]

  @Prop({ type: Array, default: () => [] }) color!: any[]

  @Prop({ type: Array, default: () => [] }) dataList!: any[]

  @Prop({ type: Object, default: () => ({ ...tooltipsDefault }) }) toolTip?: any

  currentIndex = this.currentTypeIndex

  currentTypeChange(index: number) {
    this.currentIndex = index
    this.$emit('typeChange', index)
  }

  resetOptions() {
    this.currentIndex = this.currentTypeIndex
  }

  updateCharts() {
    const chartData: any[] = this.dataList[this.currentIndex] || []
    // chartData = chartData.reverse() // 排序问题，组件内翻转 nxd20190710
    const chartEl = this.$refs.refChart as HTMLDivElement

    echarts.dispose(chartEl)
    chartEl.innerHTML = ''

    if (chartData.length == 0) {
      return
    }

    const myChart = echarts.init(chartEl)
    const seriesData: any = {
      k: [],
      v: []
    }

    chartData.forEach(item => {
      seriesData.k.push(item.name)
      seriesData.v.push(item.value)
    })

    const option: any = {
      color: this.color,
      ...pubOption,
      tooltip: this.toolTip,
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
        axisTick: { show: false },
        show: false
      },
      series: [
        {
          ...barThinStyle,
          ...barItemStyleColor,
          label: {
            normal: {
              show: true,
              formatter: '{c}%',
              position: 'right'
            }
          },
          data: seriesData.v
        }
      ]
    }
    // nxd
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

.chart-wrap,
.chart-loading {
  width: 100%;
  height: 400px;
}

.chart-wrap {
  padding: 0 20px 0 10px;
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
</style>
