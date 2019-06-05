
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
    <Row type="flex"
         justify="center" align="middle">
      <Col :span="24">
          <div ref="refChart"
            v-if="initDone"
            style="width: 100%; height: 400px"></div>      
          <div v-else class='loading-wp' style="width: 100%; height: 400px">
            <TinyLoading  />
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
// 柱状堆叠
export default class BarCategoryStack extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: String, default: '' }) titleTips?: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: () => [] })  dict1!: any[]
  @Prop({ type: Array, default: () => [] })  dict2!: any[]
  @Prop({ type: Array, default: () => [] })  color!: any[]
  @Prop({ type: Array, default: () => [] })  dataList!: any[]
  xaxisList: any = []
  currentIndex: number = this.currentTypeIndex
  currentTypeChange(index: number) {
    if ( !this.initDone ) { return }
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
    const myChart = echarts.init(this.$refs.refChart as any)

    let chartSeries: any[] = []
    chartSeries = this.dict2.map((item: any) => {
      return {
        name: '',
        type: 'bar',
        // stack: 'total',
        // label: {
        //   normal: {
        //     show: true,
        //     position: 'insideRight'
        //   }
        // },
        data: []
      }
    })
    this.dataList[this.currentIndex].forEach(
      (item: any, index: number) => {
        chartSeries[item.key].data.push(item.data)
        chartSeries[item.key].name = this.dict2[item.key].text
        if (!this.xaxisList.includes(item.date)) {
          this.xaxisList.push(item.date)
        }
      }
    )
    const option: any = {
      color: this.color,
      ...pubOption,
      legend: {
        data: this.dict2.map((item: any) => {
          return item.text
        }),
        textStyle: {
          color: '#fff'
        },
        y: '25'
      },
      xAxis: {
        ...xOption,
        type: 'category',
        data: this.xaxisList
      },
      yAxis: {
        ...dottedLineStyle,
        ...yOption
      },
      series: chartSeries.map(item => item)
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