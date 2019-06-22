<template>
  <div>
    <div style='text-align:center'>
      <div class='title-box'>
        <span v-if=" title !=='' ">{{title}}</span>
        <Tooltip max-width="200"
                 v-if=" titleTips !=='' "
                 :content="titleTips">
          <Icon type="md-help-circle" />
        </Tooltip>
      </div>
      <Row type="flex"
           justify="space-between"
           v-if="dict1.length > 0"
           class="areaExtra-type-selectbox">
        <Col v-for="(item,index) in dict1"
             span="6"
             :key="item.key"
             :label="index">
        <div class="wp"
             @click="currentTypeChange(item.key)">
          <div :class="['inner', currentIndex === item.key ? '' : 'noBorder']"
               :style="{ 'border-color':color[item.key] }">
            <div class="content name-box">
              <i :style="`backgroundImage: url(${ icons[cName2PicName(item.text)] })`"></i>{{item.text}}</div>
            <div class="chart">
              <div :ref="'type-'+index"
                   style="width: 100%; height: 100px"></div>
            </div>
          </div>
        </div>
        </Col>
      </Row>
    </div>
    <Row type="flex"
         justify="center"
         align="middle">
      <Col :span="24">
      <div ref="refChart"
           v-if="initDone"
           :style="`width: 100%; height:${ (height > 0) ? height : 400 }px`"></div>
      <div v-else
           class='loading-wp'
           :style="`width: 100%; height:${ (height > 0) ? height : 400 }px`">
        <TinyLoading />
      </div>
      </Col>
    </Row>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import echarts from 'echarts'
import { tooltipStyles } from '@/util/echarts'
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
export default class AreaBasic extends ViewBase {
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
    if (
      !this.dataList[this.currentIndex] ||
      this.dataList[this.currentIndex].length < 1
    ) {
      return
    }

    const chartData = this.dataList[this.currentIndex]
    const myChart = echarts.init(this.$refs.refChart as any)
    const option: any = {
      color: this.color[this.currentIndex],
      legend: {
        show: false,
        y: 'bottom'
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '20%',
        containLabel: true,
        show: false,
        borderWidth: 0
      },
      tooltip: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, .8)',
        backgroundColor: 'rgba(0, 0, 0, .8)',
        padding: [
          7,
          10
        ],
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
        ...xOption,
        boundaryGap: false,
        data: chartData.date
      },
      yAxis: {
        type: 'value',
        ...dottedLineStyle,
        ...yOption
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
    const ref: any[] = []
    this.dict1.forEach((item, index) => {
      const refArr = this.$refs[`type-${index}`] as any
      ref.push(refArr[0])
    })
    let option: any = {}
    function quadraticIn(k: number) {
      return k * k
    }
    const N_POINT: number = 10
    const grids: any[] = []
    const xAxes: any[] = []
    const yAxes: any[] = []
    const series: any[] = []
    const count: number = 0
    const data: any[] = []
    for (let i = 0; i <= N_POINT; i++) {
      const x = i / N_POINT
      const y = quadraticIn(x)
      data.push([x, y])
    }
    grids.push({
      show: true,
      borderWidth: 0,
      // backgroundColor: '#fff',
      // shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowBlur: 2
    })
    xAxes.push({
      type: 'value',
      show: false,
      min: 0,
      max: 1,
      gridIndex: count
    })
    yAxes.push({
      type: 'value',
      show: false,
      min: -0.4,
      max: 1.4,
      gridIndex: count
    })
    series.push({
      name,
      type: 'line',
      xAxisIndex: count,
      yAxisIndex: count,
      data,
      showSymbol: false,
      animationEasing: name,
      animationDuration: 1000
    })
    option = {
      grid: grids,
      xAxis: xAxes,
      yAxis: yAxes,
      series
    }
    this.dict1.forEach((item: any, index: number) => {
      option.color = [this.color[index]]
      echarts.init(ref[index]).setOption(option)
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
</style>