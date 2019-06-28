<template>
  <Pane :title="title" :more="more" :tooltip="tooltip">
    <ul class="legend-list" v-if="legends && legends.length > 0">
      <li v-for="it in legends" :key="it.name" class="legend-item">
        <label class="legend-name">{{it.name}}</label>
        <em class="legend-no">{{it.no}}</em>
        <em
          class="legend-inc"
          :class="{
            'legend-ping': it.inc == 0,
            'legend-down': it.inc < 0
          }"
        >{{it.inc != 0 ? it.incShow : ''}}</em>
      </li>
    </ul>
    <ECharts :options="chartData" auto-resize class="chart" @mousemove="chartMouseMove"/>
  </Pane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'
import Pane from './pane.vue'
import { tooltipStyles } from '@/util/echarts'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'

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
  rank: number
  legends: Legend[]
}

export interface Legend {
  name: string
  no: string
  inc: number
}

@Component({
  components: {
    Pane,
    ECharts
  }
})
export default class HotPane extends Vue {
  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: Array, default: () => [] }) data!: DataItem[]

  @Prop({ type: [Object, String], default: null }) more!: RawLocation

  @Prop({ type: String, default: '' }) tooltip!: string

  // https://www.echartsjs.com/option.html#tooltip.formatter
  @Prop({ type: [String, Function], default: '{a} <br>{b} : {c}' })
  formatter!: string | ((data: any) => string)

  hoverIndex = 0

  get legends() {
    const hoverItem = this.data && this.data[this.hoverIndex]
    return hoverItem ? hoverItem.legends : []
  }

  get chartData() {
    return {
      tooltip: tooltipStyles({
        trigger: 'axis',
        formatter: this.formatter
      }),

      axisPointer: {
        type: 'line',
        lineStyle: {
          width: 22,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(87, 180, 201, .01)'
              },
              {
                offset: 1,
                color: 'rgba(87, 180, 201, .9)'
              }
            ]
          }
        }
      },

      xAxis: {
        type: 'category',
        data: this.data.map(it => it.name),
        axisLine: lineStyle,
        axisTick: false,
        axisLabel,
        boundaryGap: false
      },

      yAxis: {
        type: 'value',
        axisLine: false,
        splitLine: lineStyle,
        axisLabel,
        splitNumber: 4
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
          name: this.title,
          type: 'line',
          smooth: true,
          data: this.data.map(it => it.value),
          itemStyle: {
            color: '#57b4c9'
          },
          symbol: 'circle',
          showSymbol: false
        }
      ]
    }
  }

  chartMouseMove({ componentType, dataIndex }: any) {
    if (componentType == 'series') {
      this.hoverIndex = dataIndex
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.legend-list {
  display: flex;
  padding: 0 45px;
  margin-top: -6px;
}

.legend-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > * {
    display: inline-block;
    height: 24px;
  }
}

.legend-inc {
  color: #d16b6f;
  font-size: 12px;
  padding-left: 15px;
  background: url(../assets/up.png) no-repeat left 2px;
  background-size: 12px 14px;
  position: relative;
  top: 3px;
}

.legend-ping {
  top: 0;
  width: 13px;
  background: linear-gradient(#f3d873, #f3d873) no-repeat center;
  background-size: 100% 2px;
}

.legend-down {
  color: #58b6cc;
  background-image: url(../assets/down.png);
}

.chart {
  width: 100%;
  height: 172px;
  // background-color: rgba(255, 255, 255, .1);
}
</style>
