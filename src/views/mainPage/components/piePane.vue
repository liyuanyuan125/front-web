<template>
  <Pane :title="title" :more="more">
    <ECharts
      :options="chartData"
      auto-resize
      class="chart"
      v-if="data && data.length > 0"
    />
  </Pane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'
import Pane from './pane.vue'
import { tooltipStyles } from '@/util/echarts'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'

export interface DataItem {
  name: string
  value: number
  color: string
}

@Component({
  components: {
    Pane,
    ECharts
  }
})
export default class PiePane extends Vue {
  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: Array, default: () => [] }) data!: DataItem[]

  @Prop({ type: [ Object, String ], default: null }) more!: RawLocation

  // https://www.echartsjs.com/option.html#tooltip.formatter
  @Prop({ type: [String, Function], default: '{a} <br>{b} : {d}%' })
  formatter!: string | ((data: any) => string)

  get chartData() {
    return {
      tooltip: tooltipStyles({
        trigger: 'item',
        formatter: this.formatter
      }),

      series: [
        {
          name: this.title,
          type: 'pie',
          radius: [33, 49],
          label: {
            formatter: '{b}\n{d}%',
            lineHeight: 18,
            rich: {}
          },
          labelLine: {
            show: false
          },
          data: (this.data || []).map(it => ({
            name: it.name,
            value: it.value,
            itemStyle: { color: it.color }
          }))
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.chart {
  width: 100%;
  height: 170px;
}
</style>
