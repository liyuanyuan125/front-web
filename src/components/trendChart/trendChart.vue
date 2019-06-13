<template>
  <ECharts :options="chartData" auto-resize class="trend-chart"/>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'

@Component({
  components: {
    ECharts
  }
})
export default class TrendChart extends Vue {
  @Prop({ type: Array, default: () => [], required: true }) value!: number[]

  @Prop({ type: String, default: '#ff874c' }) colorFrom!: string

  @Prop({ type: String, default: '#ff6b70' }) colorTo!: string

  @Prop({ type: Number, default: 3 }) thick!: number

  get chartData() {
    const list = this.value || []
    const data = {
      xAxis: {
        type: 'category',
        data: list.map((it, i) => i),
        boundaryGap: false,
        axisLine: false,
        splitLine: false
      },

      yAxis: {
        type: 'value',
        min: 'dataMin',
        max: 'dataMax',
        axisLine: false,
        splitLine: false
      },

      grid: {
        top: 1,
        bottom: 1,
        left: 1,
        right: 1
      },

      series: [
        {
          type: 'line',
          smooth: true,
          data: list,
          lineStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: this.colorFrom
                },
                {
                  offset: 1,
                  color: this.colorTo
                }
              ]
            },
            width: this.thick
          },
          showSymbol: false
        }
      ]
    }
    return data
  }
}
</script>

<style lang="less" scoped>
</style>
