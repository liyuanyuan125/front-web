<template>
  <section class="chart-pane">
    <ul class="legend-list">
      <li v-for="(it, i) in data.legends" :key="i" class="legend-item">
        <div class="legend-name">{{it.name}}</div>
        <div class="legend-value">{{it.value || '-'}}</div>
      </li>
    </ul>

    <ul class="chart-list">
      <li v-for="(it, i) in chartList" :key="i" class="chart-item" :class="{
          'chart-item-on': nav == i
        }" @click="nav = i">
        <a class="chart-nav">{{it.title}}</a>
        <div class="chart-wrap" v-if="nav == i">
          <ECharts :options="it.chart" class="chart" auto-resize v-if="it.chart" />
        </div>
      </li>
    </ul>
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
  color: '#cdd0d3'
}

export interface Data {
  legends: Array<{
    name: string
    value: string
  }>

  charts: Array<{
    title: string
    yAxisName?: string
    list: Array<{
      name: string
      value: number
    }>
  }>
}

@Component({
  components: {
    ECharts
  }
})
export default class ChartPane extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: Data

  nav = 0

  get chartList() {
    const list = this.data.charts.map(it => {
      if ((it.list || []).length == 0) {
        return { title: it.title, chart: null }
      }

      const chart = {
        tooltip: tooltipStyles({
          // trigger: 'axis',
        }),

        xAxis: {
          type: 'category',
          data: (it.list || []).map(tt => tt.name),
          axisLine: {
            lineStyle: {
              color: '#3191aa',
              opacity: 0.5
            }
          },
          axisTick: false,
          axisLabel
        },

        yAxis: {
          type: 'value',
          name: it.yAxisName || '',
          nameGap: 30,
          nameTextStyle: {
            color: '#cdd0d3',
            fontSize: 14,
            padding: [0, 57, 0, 0]
          },
          axisLine: false,
          splitLine: {
            lineStyle: {
              color: '#3191aa',
              opacity: 0.5,
              type: 'dashed'
            }
          },
          axisLabel,
          splitNumber: 4
        },

        grid: {
          left: 42,
          right: 42,
          top: it.yAxisName ? 55 : 10,
          bottom: 20,
          containLabel: true
        },

        series: [
          {
            name: it.title,
            type: 'line',
            data: (it.list || []).map(tt => tt.value),
            itemStyle: {
              color: '#da6c70'
            },
            symbol: 'circle',
            symbolSize: 8,
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
                    color: 'rgba(218, 108, 112, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(218, 108, 112, 0)'
                  }
                ]
              }
            }
          }
        ]
      }

      return { title: it.title, chart }
    })
    return list
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.legend-list {
  display: flex;
  color: #fff;
  font-size: 16px;
  text-align: center;
  justify-content: space-between;
}

.legend-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  // width: 24.375%;
  height: 120px;
  background-color: rgba(0, 32, 45, 0.8);
  flex: 1;
  margin: 0 5px;
}
.legend-item:first-child {
  margin-left: 0;
}
.legend-item:last-child {
  margin-right: 0;
}
.legend-value {
  font-size: 30px;
}

.chart-list {
  position: relative;
  display: flex;
  min-height: 525px;
  border-radius: 0 0 5px 5px;
  background-color: rgba(0, 32, 45, 0.8);
  margin-top: 10px;
  padding: 34px 40px;
  box-sizing: border-box;
}

.chart-nav {
  padding: 5px 0;
  color: #cdd0d3;
  border: solid transparent;
  border-width: 2px 0;
  margin-right: 60px;
  font-size: 16px;
}

.chart-item-on {
  .chart-nav {
    color: #fff;
    border-bottom-color: #fff;
  }
}

.chart-wrap {
  position: absolute;
  top: 90px;
  left: 0;
  width: 100%;
  height: calc(100% - 90px - 15px);
  box-sizing: border-box;

  &:empty {
    &::before {
      content: '暂无数据';
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 18px;
    }
  }
}

.chart {
  width: 100%;
  height: 100%;
  // background-color: rgba(255, 255, 255, .1);
}
</style>
