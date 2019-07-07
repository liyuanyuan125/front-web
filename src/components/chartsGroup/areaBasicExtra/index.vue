<template>
  <div>
    <div style='text-align:center'>
      <div class='title-box'>
        <span v-if=" title !=='' ">{{title}}</span>
        <Tooltip max-width="200" v-if=" titleTips !=='' " :content="titleTips">
          <Icon type="md-help-circle" />
        </Tooltip>
      </div>
      <Row type="flex" justify="space-between" v-if="dict1.length > 0" class="areaExtra-type-selectbox">
        <Col v-for="(item,index) in dict1" span="6" :key="item.key" :label="index">
        <div class="wp" @click="currentTypeChange(item.key)">
          <div :class="['inner', currentIndex === item.key ? '' : 'noBorder']" :style="{ 'border-color':color[item.key] }">
            <div class="content name-box">
              <i :style="`backgroundImage: url(${ icons[cName2PicName(item.text)] })`"></i>{{item.text}}</div>
            <div class="chart">
              <div :ref="'type-'+index" style="width: 100%; height: 100px"></div>
            </div>
          </div>
        </div>
        </Col>
      </Row>
    </div>
    <div class="content-wrap">
      <div v-if="initDone" ref="refChart" class="chart-wrap"></div>
      <div v-show="!initDone" class="chart-loading">
        <TinyLoading />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import echarts from 'echarts'
import { tooltipStyles } from '@/util/echarts'
import { find } from 'lodash'
const tooltipsDefault = tooltipStyles({
  trigger: 'item',
  formatter: '{b} <br/> {c}'
})
import {
  pubOption,
  seriesOption,
  dottedLineStyle,
  yOption,
  xOption,
  barThinStyle
} from '../chartsOption'

@Component({
  components: {
    TinyLoading
  }
})
export default class AreaBasicExtra extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean

  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: String, default: '' }) titleTips?: string

  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number

  @Prop({ type: Array, default: () => [] }) dict1!: any[]

  @Prop({ type: Array, default: () => [] }) dict2!: any[]

  @Prop({ type: Array, default: () => [] }) color!: any[]

  @Prop({ type: Array, default: () => [] }) dataList!: any[]

  @Prop({ type: Number, default: 0 }) height?: number

  @Prop({ type: Object, default: () => ({ ...tooltipsDefault }) }) toolTip?: any

  icons = {
    weibo: require('../../../assets/icon/weibo.png'),
    wechat: require('../../../assets/icon/wechat.png'),
    baidu: require('../../../assets/icon/baidu.png'),
    toutiao: require('../../../assets/icon/toutiao.png')
  }

  currentIndex: number = this.currentTypeIndex

  currentTypeChange(index: number) {
    this.currentIndex = index
    this.$emit('typeChange', index)
  }

  resetOptions() {
    this.currentIndex = this.currentTypeIndex
  }

  cName2PicName(name: string) {
    switch (name) {
      case '微博指数':
        return 'weibo'
        break
      case '微信指数':
        return 'wechat'
        break
      case '百度指数':
        return 'baidu'
        break
      case '头条指数':
        return 'toutiao'
        break
      default:
        return 'weibo'
    }
  }

  // 接口没调
  updateCharts() {
    const chartData: any = this.dataList[this.currentIndex] || {}

    if ( !chartData.data || chartData.data.length == 0 || chartData.date.length == 0) {
      return
    }

    const chartEl = this.$refs.refChart as HTMLDivElement

    echarts.dispose(chartEl)
    chartEl.innerHTML = ''

    const myChart = echarts.init(chartEl)

    const option: any = {
      color: this.color[this.currentIndex],
      legend: {
        show: false,
        y: 'bottom'
      },
      tooltip: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, .8)',
        backgroundColor: 'rgba(0, 0, 0, .8)',
        padding: [7, 10],
        textStyle: {
          color: '#fff',
          fontSize: 12,
          lineHeight: 22
        },
        trigger: 'axis',
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
                  color: 'rgba(255, 255, 255, .01)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 255, 255, .5)'
                }
              ]
            }
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.date,
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        }
      },
      grid: {
        left: '2%',
        right: '35px',
        bottom: '20%',
        containLabel: true,
        show: false,
        borderWidth: 0
      },
      series: [
        {
          data: chartData.data,
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 1
          },
          areaStyle: {
            shadowColor: this.color[this.currentIndex],
            opacity: 0.4
          }
        }
      ]
    }
    option.tooltip.formatter = this.title + ` {c}`
    let _title = ''
    if (this.title === '') {
      _title = this.dict1[this.currentTypeIndex].text
      option.tooltip.formatter = _title + ` {c}`
    }
    option.tooltip.backgroundColor = this.color[this.currentIndex]
    // console.save(option, `${new Date()}.json`)
    myChart.setOption(option)
  }

  updateTypeCharts() {
    const options: any[] = []
    const refs: any[] = []
    this.dict1.forEach((item, index) => {
      const refArr = this.$refs[`type-${index}`] as any
      refs.push(refArr[0])
      options.push({
        color: '',
        grid: [
          {
            show: true,
            borderWidth: 0,
            shadowBlur: 2
          }
        ],
        xAxis: {
          show: false,
          type: 'category',
          data: []
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true
          }
        ]
      })
    })
    this.dataList.forEach((item: any, index: number) => {
      options[index].color = this.color[index]
      options[index].xAxis.data = item.date
      options[index].series[0].data = item.data
    })
    this.dataList.forEach((item: any, index: number) => {
      echarts.init(refs[index]).setOption(options[index])
    })
  }

  @Watch('initDone')
  watchInitDone(val: boolean) {
    if (val) {
      this.$nextTick(() => {
        this.updateTypeCharts()
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
/deep/ .areaExtra-type-selectbox {
  .wp {
    padding: 0 15px;
    .name-box {
      display: flex;
      flex-flow: row;
      justify-content: center;
      align-items: center;
      i {
        display: inline-block;
        padding: 15px;
        background-size: 100%;
        background-position: center center;
        background-repeat: no-repeat;
        text-align: center;
        margin-right: 5px;
      }
    }
    .inner {
      padding: 15px;
      background: rgba(0, 32, 45, 0.6);
      border-radius: 6px;
      border-width: 2px;
      border-style: solid;
      .charts {
        padding: 0;
        margin: 0;
      }
    }
    .noBorder {
      border-color: rgba(0, 32, 45, 0.6) !important;
    }
  }
}
.content-wrap {
  position: relative;
  width: 100%;
  height: 400px;
}
.chart-wrap {
  width: 100%;
  height: 400px;
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
.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
}
</style>