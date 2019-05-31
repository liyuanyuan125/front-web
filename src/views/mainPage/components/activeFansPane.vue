<template>
  <Pane :title="title">
    <ECharts :options="chartData" auto-resize class="chart"/>
  </Pane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
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

@Component({
  components: {
    Pane,
    ECharts
  }
})
export default class ActiveFansPane extends Vue {
  @Prop({ type: String, default: '近7日活跃粉丝数' }) title!: string

  chartData: any = {
    tooltip: tooltipStyles({
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}'
    }),

    xAxis: {
      type: 'category',
      data: ['5-16', '5-17', '5-18', '5-19', '5-20', '5-21', '5-22'],
      axisLine: lineStyle,
      axisTick: false,
      axisLabel
    },

    yAxis: {
      type: 'value',
      axisLine: false,
      splitLine: lineStyle,
      axisLabel,
      splitNumber: 3,
    },

    grid: {
      left: 42,
      right: 42,
      top: 20,
      bottom: 20,
      containLabel: true,
    },

    series: [
      {
        name: '近7日活跃粉丝数',
        type: 'bar',
        data: [855000, 200000, 150000, 808888, 123730, 11088, 888130],
        barWidth: 9,
        itemStyle: {
          color: '#08b6ca',
          barBorderRadius: [8, 8, 0, 0],
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
  height: 188px;
}
</style>
