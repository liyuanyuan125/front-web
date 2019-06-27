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
        <Radio v-for="(item,index) in dict1" v-show=" initDone "
               :key="item.key"
               :label="index">{{item.name}}</Radio>
      </RadioGroup>
    </div>
    <Row type="flex"
         justify="center" align="middle">
      <Col :span="24">
        <div v-if="initDone">
          <div ref="refChart" :style="`width: 100%; height:${ (height > 0) ? height : 400 }px`"></div>
        </div>
        <div v-else class="loading-wp" :style="`width: 100%; height:${ (height > 0) ? height : 400 }px`">
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
    trigger:  'item',
    formatter:  '{b} <br/> {c}%'
})
@Component({
  components: {
    TinyLoading
  }
})
// 嵌套环形图
export default class PieNest extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean
  @Prop({ type: String, default: '' }) title?: string
  @Prop({ type: String, default: '' }) titleTips?: string
  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number
  @Prop({ type: Array, default: () => [] }) dict1!: any[]
  @Prop({ type: Array, default: () => [] }) dict2!: any[]
  @Prop({ type: Array, default: () => [] }) color!: any[]
  @Prop({ type: Array, default: () => [] }) dataList!: any[]
  @Prop({ type: Number, default: 0 }) height?: number
  @Prop({ type: Object, default: () => ({ ...tooltipsDefault }) }) toolTip?: any

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
    const chartData = this.dataList[this.currentIndex]
    const myChart = echarts.init(this.$refs.refChart as any)
    // 组件内组装
    // const chartSeries: any[] = []
    // chartData.forEach((item: any, index: number) => {
    //   chartSeries.push({
    //     value: item.data,
    //     name: this.dict2[item.key].text
    //   })
    // })
    const option: any = {
      ...pubOption,
      tooltip : this.toolTip,
      series: [
        {
          name: ' ',
          type: 'pie',
          avoidLabelOverlap: true,
          minAngle: 25, // 最小的扇区角度
          radius: ['40%', '55%'],
          color: this.color,
          label: {
            normal: {
              formatter(v: any) {
                let text = Math.round(v.percent) + '%' + '' + v.name
                if ( text.length <= 8 ) {
                  return text
                } else if (text.length > 8 && text.length <= 16) {
                  return text = `${text.slice(0, 8)}\n${text.slice(8)}`
                } else if (text.length > 16 && text.length <= 24) {
                  return text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16)}`
                } else if (text.length > 24 && text.length <= 30) {
                  return text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24)}`
                } else if (text.length > 30) {
                  return text = `
                    ${text.slice(0, 8)}
                    \n${text.slice(8, 16)}
                    \n${text.slice(16, 24)}
                    \n${text.slice(24, 30)}
                    \n${text.slice(30)}
                  `
                }
              },
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                b: {
                  fontSize: 16,
                  lineHeight: 33
                }
              }
            }
          },
          data: chartData
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
@import '~@/site/lib.less';
/deep/ .ivu-radio-group {
  .ivu-radio-wrapper {
    background: none;
    border: none;
    box-shadow: none !important;
    color: #cdd0d3;
    &::before,
    &::after {
      display: none;
    }
  }
  /deep/ .ivu-radio-wrapper-checked {
    color: #fff;
    border-bottom: 2px solid #fff;
    .ivu-radio-inner {
      display: none;
    }
    &::before,
    &::after {
      display: none;
    }
  }
}
.nav {
  .ivu-radio-wrapper {
    height: 60px;
    padding: 0;
    line-height: 60px;
    margin: 0 10px;
    border-radius: 0 !important;
  }
  .ivu-radio-wrapper-checked {
    color: #fff;
    border-bottom: 2px solid #fff;
  }
}
.loading-wp {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
}
</style>