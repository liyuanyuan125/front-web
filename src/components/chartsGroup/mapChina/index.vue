<template>
  <div>
    <div style="text-align:center">
      <div class="title-box">
        <span v-if=" title !=='' ">{{title}}</span>
        <Tooltip max-width="200" v-if=" titleTips !=='' " :content="titleTips">
          <Icon type="md-help-circle" />
        </Tooltip>
      </div>
      <RadioGroup
        size="small"
        v-if="dict1.length > 0"
        @on-change="currentTypeChange"
        v-model="currentIndex"
        type="button"
      >
        <Radio v-for="(item,index) in dict1" :key="item.key" :label="index">{{item.name}}</Radio>
      </RadioGroup>
    </div>
    <Row type="flex" justify="center" align="middle">
      <div ref="refChart" v-if="initDone" class="chart-wrap"></div>
      <div v-else class="loading-wp chart-loading">
        <TinyLoading />
      </div>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import echarts from 'echarts'
import china from './china'
import {
  pubOption,
  seriesOption,
  dottedLineStyle,
  yOption,
  xOption
} from '../chartsOption'

@Component({
  components: {
    TinyLoading
  }
})
// 中国地图
export default class MapChina extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean

  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: String, default: '' }) titleTips?: string

  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number

  @Prop({ type: Number, default: 0 }) max!: number

  @Prop({ type: Array, default: () => [] }) dict1!: any[]

  @Prop({ type: Array, default: () => [] }) dict2!: any[]

  @Prop({ type: Array, default: () => [] }) color!: any[]

  @Prop({ type: Array, default: () => [] }) dataList!: any[]

  currentIndex: number = this.currentTypeIndex

  currentTypeChange(index: number) {
    this.currentIndex = index
    this.$emit('typeChange', index)
  }

  resetOptions() {
    this.currentIndex = this.currentTypeIndex
  }

  updateCharts() {
    if (
      !this.dataList[this.currentIndex] ||
      this.dataList[this.currentIndex].length < 1
    ) {
      return
    }
    const chartData = this.dataList[this.currentIndex]
    const myChart = echarts.init(this.$refs.refChart as any)

    echarts.registerMap('china', china as any)
    const option: any = {
      ...pubOption,
      visualMap: {
        type: 'continuous',
        min: 0,
        max: this.max,
        right: '5%',
        bottom: '10%',
        text: ['高', '低'],
        textStyle: {
          color: '#fff'
        },
        seriesIndex: [1],
        inRange: {
          color: ['#fff', '#009ac2']
        },
        calculable: true
      },
      geo: {
        // 这个是重点配置区
        map: 'china', // 表示中国地图
        // roam: true,
        label: {
          normal: {
            show: false, // 是否显示对应地名
            textStyle: {
              color: 'rgba(0,0,0,0.4)'
            }
          }
        },
        itemStyle: {
          normal: {
            borderColor: 'rgba(0, 0, 0, 0.2)'
          },
          emphasis: {
            areaColor: null,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 20,
            borderWidth: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo' // 对应上方配置
        },
        {
          name: '启动次数', // 浮动框的标题
          type: 'map',
          geoIndex: 0,
          data: chartData
          // data: [{ name: '广东', value: 1324 }, { name: '山东', value: 3324 }, { name: '北京', value: 11324 }]
          // 这里就是数据，即数组可以单独放在外面也可以直接写
        }
      ]
    }
    myChart.setOption(option)
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
.chart-wrap,
.chart-loading {
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
</style>
