<template>
  <section class="throw-pane">
    <ECharts :options="chartData" auto-resize class="throw-chart"/>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'
import { tooltipStyles } from '@/util/echarts'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'

const axisLabel = {
  color: '#30c1e4'
}

const serieData = ({
  data,
  color1,
  color2,
  symbol = 'circle',
  symbolSize = 6
}: any) => {
  const result = {
    type: 'line',
    data,
    itemStyle: {
      color: color1
    },
    symbol,
    symbolSize,
    showSymbol: false,

    // https://www.echartsjs.com/examples/editor.html?c=bar-rich-text
    // markPoint: {
    //   symbolSize: 1,
    //   // symbolOffset: [0, '20%'],
    //   label: {
    //     formatter: '{a|{a}\n}{b|{b} }{c|{c}}',
    //     backgroundColor: 'rgb(242,242,242)',
    //     borderColor: '#aaa',
    //     borderWidth: 1,
    //     borderRadius: 4,
    //     padding: [3, 8],
    //     lineHeight: 26,
    //     position: 'right',
    //     distance: 20,
    //     rich: {
    //       a: {
    //         align: 'center',
    //         color: '#fff',
    //         fontSize: 18,
    //         textShadowBlur: 2,
    //         textShadowColor: '#000',
    //         textShadowOffsetX: 0,
    //         textShadowOffsetY: 1,
    //         textBorderColor: '#333',
    //         textBorderWidth: 2
    //       },
    //       b: {
    //         color: '#333'
    //       },
    //       c: {
    //         color: '#ff8811',
    //         textBorderColor: '#000',
    //         textBorderWidth: 1,
    //         fontSize: 22
    //       }
    //     }
    //   },
    //   data: [
    //     { type: 'max', name: 'max days: ' },
    //     { type: 'min', name: 'min days: ' }
    //   ]
    // },

    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: color1
          },
          {
            offset: 1,
            color: color2
          }
        ]
      }
    }
  }
  return result
}

@Component({
  components: {
    ECharts
  }
})
export default class ChartPane extends Vue {
  @Prop({ type: Array, default: () => [] }) data!: Array<{
    name: string
    cost: number
    exposure: number
  }>

  get chartData() {
    return {
      tooltip: tooltipStyles({
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        }
      }),

      xAxis: {
        type: 'category',
        data: (this.data || []).map(it => it.name),
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#d6dee5',
            opacity: 0.2
          }
        },
        axisTick: false,
        axisLabel
      },

      yAxis: [
        {
          type: 'value',
          nameTextStyle: {
            color: '#30c1e4',
            fontSize: 14
          },
          axisLine: false,
          splitLine: {
            lineStyle: {
              color: '#d6dee5',
              opacity: 0.2
            }
          },
          axisLabel,
          splitNumber: 4
        },

        {
          type: 'value',
          nameTextStyle: {
            color: '#30c1e4',
            fontSize: 14
          },
          axisLine: false,
          splitLine: {
            lineStyle: {
              color: '#d6dee5',
              opacity: 0.2
            }
          },
          axisLabel,
          splitNumber: 4
        }
      ],

      grid: {
        top: 28,
        bottom: 18,
        left: 18,
        right: 18,
        containLabel: true
      },

      series: [
        serieData({
          data: (this.data || []).map(it => it.cost),
          color1: 'rgba(0, 217, 251, 1)',
          color2: 'rgba(0, 217, 251, 0)',
          symbolSize: 0
        }),

        serieData({
          data: (this.data || []).map(it => it.exposure),
          color1: 'rgba(0, 83, 251, 1)',
          color2: 'rgba(0, 83, 251, 0)'
        })
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.throw-chart {
  width: 100%;
  height: 280px;
  // background-color: rgba(255, 255, 255, .1);
}
</style>
