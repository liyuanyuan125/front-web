<style lang="less" scoped>
@import '~@/site/lib.less';
h1 {
  text-align: left;
  font-size: 14px;
}
</style>
<template>
  <div>
    <div style='text-align:center'>
      <h1 v-if="title !==''">{{title}}</h1>
      <RadioGroup size="small"
                  v-if="dict1.length > 0"
                  @on-change='currentTypeChange'
                  v-model="currentIndex"
                  type="button">
        <Radio v-for="(item,index) in dict1"
               :key="item.key"
               :label="index">{{item.name}}</Radio>
      </RadioGroup>
    </div>
    <div ref="barChart"
         v-if="initDone"
         style="width: 100%; height: 400px"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import { IchartOptions } from './types'
import echarts from 'echarts'
import china from './china'

@Component({
  components: {
    TinyLoading
  }
})
// 中国地图
export default class MapChina extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: [] }) dict1!: any[]
  @Prop({ type: Array, default: [] }) dict2!: any[]
  @Prop({ type: Array, default: [] }) dataList!: any[]
  chartOptions: IchartOptions = {
    name: '',
    type: 'bar',
    color: ['#ff9933', '#169bd5']
  }
  currentIndex: number = this.currentTypeIndex
  currentTypeChange(index: number) {
    this.currentIndex = index
    this.$emit('typeChange', index)
  }
  resetOptions() {
    this.currentIndex = this.currentTypeIndex
    if (this.dict1.length > 0) {
      this.chartOptions.name = this.dict1[this.currentTypeIndex].name
    } else {
      this.chartOptions.name = 'default'
    }
  }
  updateCharts() {
    if (
      !this.dataList[this.currentIndex].list ||
      this.dataList[this.currentIndex].list.length < 1
    ) {
      return
    }
    const chartData = this.dataList[this.currentIndex].list
    const myChart = echarts.init(this.$refs.barChart as any)

    let seriesData: any = []
    this.dict2.forEach((item, index) => {
      const _name = item.key
      const obj: any = {}
      obj[_name] = {
        data: [],
        itemNames: [],
        text: item.text
      }
      seriesData = Object.assign(obj, seriesData)
    })
    chartData.forEach((item: any, index: number) => {
      seriesData[item.key].data.push(item.data)
      seriesData[item.key].itemNames.push(item.itemName)
    })

    echarts.registerMap('china', (china as any))
    const option: any = {
      tooltip: {}, // 鼠标移到图里面的浮动提示框
      visualMap: {
        // 左侧小柱子的配置
        min: 0, // 最小值
        max: 15000, // 最大值
        left: 'left', // 定位左边
        top: 'bottom', // 定位底部
        text: ['高', '低'], // 上下两个文字
        seriesIndex: [1],
        inRange: {
          color: ['#e0ffff', '#006edd'] // 深浅颜色
        },
        calculable: true // 显示与否
      },
      geo: {
        // 这个是重点配置区
        map: 'china', // 表示中国地图
        roam: true,
        label: {
          normal: {
            show: true, // 是否显示对应地名
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
          data: [{ name: '广东', value: 1324 }] // 这里就是数据，即数组可以单独放在外面也可以直接写
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
