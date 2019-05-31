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
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'

@Component({
  components: {
    Pane,
    ECharts
  }
})
export default class CommentPane extends Vue {
  @Prop({ type: String, default: '近7日评论分析' }) title!: string

  chartData: any = {
    tooltip: tooltipStyles({
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    }),

    series: [
      {
        name: '近7日评论分析',
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
        data: [
          { name: '正面', value: 80, itemStyle: { color: '#ca7273' } },
          { name: '中立', value: 30, itemStyle: { color: '#f3d872' } },
          { name: '负面', value: 20, itemStyle: { color: '#57b4c9' } }
        ]
      }
    ]
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
