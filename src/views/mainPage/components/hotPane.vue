<template>
  <Pane :title="title" tooltip="史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。">
    <ul class="legend-list">
      <li v-for="it in legendList" :key="it.name" class="legend-item">
        <label class="legend-name">{{it.name}}</label>
        <em class="legend-no">{{it.no}}</em>
        <em
          class="legend-inc"
          :class="{
            'legend-ping': it.inc == 0,
            'legend-down': it.inc < 0
          }"
        >{{it.inc != 0 ? Math.abs(it.inc) : ''}}</em>
      </li>
    </ul>
    <ECharts :options="chartData" auto-resize class="chart"/>
  </Pane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
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

@Component({
  components: {
    Pane,
    ECharts
  }
})
export default class ActiveFansPane extends Vue {
  @Prop({ type: String, default: '近30日全网热度' }) title!: string

  chartData: any = {
    tooltip: tooltipStyles({
      trigger: 'axis',
      formatter: '综合热度：{c}<br>男演员排名：',
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
      }
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
      containLabel: true
    },

    series: [
      {
        name: '近30日全网热度',
        type: 'line',
        smooth: true,
        data: [855000, 200000, 1508800, 80888, 2000000, 188088, 888130],
        itemStyle: {
          color: '#57b4c9'
        },
        symbol: 'circle',
        showSymbol: false,
      }
    ]
  }

  legendList: any[] = [
    { name: '新浪', no: 'No.3', inc: 0 },
    { name: '微信', no: 'No.2', inc: -1 },
    { name: '百度', no: 'No.4', inc: 2 },
    { name: '头条', no: 'No.1', inc: 1 },
  ]
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
  height: 178px;
  // background-color: rgba(255, 255, 255, .1);
}
</style>
