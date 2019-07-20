<template>
  <div>
    <div style="text-align:center">
      <div class="title-box">
        <span v-if=" title !=='' ">{{title}}</span>
        <Tooltip max-width="200" v-if=" titleTips !=='' " :content="titleTips">
          <Icon type="md-help-circle" />
        </Tooltip>
      </div>
      <RadioGroup size="small" v-if="dict1.length > 0 && dataList" @on-change="currentTypeChange" v-model="currentIndex" type="button">
        <Radio v-for="(item,index) in dict1" :key="item.key" :label="index">{{item.name}}</Radio>
      </RadioGroup>
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
import { find } from 'lodash'
import {
  pubOption,
  seriesOption,
  dottedLineStyle,
  yOption,
  xOption,
  barThinStyle
} from '../chartsOption'
import { tooltipStyles } from '@/util/echarts'

const tooltipsDefault = tooltipStyles({
  trigger: 'item',
  formatter: '{b} <br/> {c}'
})

@Component({
  components: {
    TinyLoading
  }
})
// x轴堆叠条形图
export default class BarXCategoryStack extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean

  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: String, default: '' }) titleTips?: string

  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number

  @Prop({ type: Array, default: () => [] }) dict1!: any[]

  @Prop({ type: Array, default: () => [] }) dict2!: any[]

  @Prop({ type: Array, default: () => [] }) xAxis!: any[]

  @Prop({ type: Array, default: () => [] }) color!: any[]

  @Prop({ type: Array, default: () => [] }) dataList!: any[]

  @Prop({ type: Function, default: () => {} }) fn?: any

  @Prop({ type: Number, default: 0 }) height?: number

  @Prop({ type: Object, default: () => ({ ...tooltipsDefault }) }) toolTip?: any

  currentIndex: number = this.currentTypeIndex

  currentTypeChange(index: number) {
    if (!this.initDone) {
      return
    }
    this.currentIndex = index
    this.$emit('typeChange', index)
  }

  resetOptions() {
    this.currentIndex = this.currentTypeIndex
  }

  updateCharts() {
    const chartData: any[] = this.dataList[this.currentIndex] || []

    if (chartData.length == 0) {
      return
    } else if (chartData.length > 0) {
      const res = find(chartData, 'data').data
      if (res && res.length === 0) {
        return
      }
    }

    const chartEl = this.$refs.refChart as HTMLDivElement

    echarts.dispose(chartEl)
    chartEl.innerHTML = ''

    const myChart = echarts.init(chartEl)

    // 数据过多对width处理
    let _width = '20'
    const dataLen = this.dataList[0][0].data.length
    if (this.dict1 && this.dict1.length > 1 && dataLen && dataLen > 7) {
      if (dataLen > 30 && dataLen < 100) {
        _width = '3'
      } else if (dataLen > 7 && dataLen < 30) {
        _width = '10'
      } else {
        _width = '20'
      }
      this.dataList.forEach((it: any) => {
        it.forEach((item: any) => {
          item.barWidth = _width
        })
      })
    } else {
      this.dataList.forEach((it: any) => {
        it.forEach((item: any) => {
          item.barWidth = _width
        })
      })
    }

    const option: any = {
      color: this.color,
      tooltip: {
        borderWidth: 1,
        borderColor: 'rgba(87, 180, 201, .8)',
        backgroundColor: 'rgba(0, 39, 52, .8)',
        padding: [7, 10],
        textStyle: {
          color: '#fff',
          fontSize: 12,
          lineHeight: 22
        },
        trigger: 'item',
        formatter: (v: any) => {
          const i1 = parseInt(v.seriesIndex, 0) // 正面、负面、中性 索引
          const i3 = parseInt(v.dataIndex, 0) // 当前数据索引
          let infos = `
            <p style="background-color: ${this.color[0]}; margin: 3px 0;">
              ${this.dict1.length > 1 ? this.dict1[this.currentIndex].name : ''}
              ${this.dict2[0].text}：${this.dataList[this.currentIndex][0].data[i3]}
            </p>
          `
          if (this.dict2.length > 1) {
            infos = ''
            this.dict2.forEach((it: any, i: number) => {
              const vv = this.dataList[this.currentIndex][i].data[i3]
              const value = vv == null ? '-' : vv
              infos += `
                <p style="background-color: ${this.color[i]}; margin: 3px 0;">
                  ${this.dict1.length > 1 ? this.dict1[this.currentIndex].name : ''}
                  ${this.dict2[i].text}：${value}
                </p>
              `
            })
          }
          return `
            <p>${this.xAxis[i3]}</p>
            ${infos}
          `
        }
      },
      legend: {
        data: this.dict2.map((item: any) => {
          return item.text
        }),
        textStyle: {
          color: '#fff'
        },
        icon: 'circle',
        y: '25'
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#1c6079',
            width: 1
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#CDD0D3'
          }
        },
        // max: 7,
        data: this.xAxis
      },
      yAxis: {
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            opacity: 1,
            color: ['#1c6079']
          }
        },
        axisLabel: {
          textStyle: {
            color: '#CDD0D3'
          }
        },
        axisLine: {
          show: false,
          axisTick: {
            show: false
          }
        }
      },
      series: this.dataList[this.currentIndex]
    }
    // console.save(option, `${new Date()}.json`)
    myChart.setOption(option)
    if (this.fn !== null) {
      myChart.on('click', this.fn)
    }
  }

  @Watch('initDone')
  watchInitDone(val: boolean) {
    if (val) {
      this.$nextTick(() => {
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
@import '~@/site/lib.less';
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
