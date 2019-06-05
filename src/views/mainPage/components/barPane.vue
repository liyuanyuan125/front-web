<template>
  <Pane :title="title" :more="more">
    <ECharts :options="chartData" auto-resize class="chart"/>
  </Pane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'
import Pane from './pane.vue'
import { tooltipStyles } from '@/util/echarts'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

// :initOptions="{ renderer: 'svg' }"
// import 'zrender/lib/svg/svg'

const lineStyle = {
  lineStyle: {
    color: 'rgba(129, 180, 230, .6)'
  }
}

const axisLabel = {
  color: 'rgba(255, 255, 255, .8)'
}

export interface DataItem {
  name: string
  value: number
}

@Component({
  components: {
    Pane,
    ECharts
  }
})
export default class BarPane extends Vue {
  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: Array, default: () => [] }) data!: DataItem[]

  @Prop({ type: [Object, String], default: null }) more!: RawLocation

  chartData: any = {
    tooltip: tooltipStyles({
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}'
    }),

    xAxis: {
      type: 'category',
      boundaryGap: false,
      // 两端加空串，是为了等宽分割
      data: ['', ...this.data.map(it => it.name), ''],
      axisLine: lineStyle,
      axisTick: false,
      axisLabel
    },

    yAxis: {
      type: 'value',
      axisLine: false,
      splitLine: lineStyle,
      axisLabel,
      splitNumber: 3
    },

    grid: {
      left: 42,
      right: 42,
      top: 20,
      bottom: 20,
      containLabel: true
    },

    series: [
      {
        type: 'bar',
        name: this.title,
        data: [0, ...this.data.map(it => it.value), 0],
        barWidth: 9,
        itemStyle: {
          color: '#08b6ca',
          barBorderRadius: [8, 8, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#ca7273'
          }
        }
      }
    ]
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.chart {
  width: 100%;
  height: 182px;
}
</style>
