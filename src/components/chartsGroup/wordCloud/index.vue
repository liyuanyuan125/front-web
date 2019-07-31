
<template>
  <div class="word-cloud">
    <div style="text-align:center">
      <div class="title-box">
        <span v-if=" title !=='' ">{{title}}</span>
        <Tooltip max-width="200" v-if=" titleTips !=='' " :content="titleTips">
          <Icon type="md-help-circle"/>
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
    <div class="content-wrap">
      <div v-if="initDone" ref="refChart" class="chart-wrap" :style="chartStyle"></div>
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
import WordCloud from 'wordcloud'
import {
  pubOption,
  seriesOption,
  dottedLineStyle,
  yOption,
  xOption,
  barThinStyle
} from '../chartsOption'

/**********************************************************************************
 * NOTE: 2019-07-07 EDIT BY ZHANGPENG
 * 为了快速上线，对该组件，进行了破坏性修改：
 *  dataList 里的 value 会被抛弃，改为从开头到结尾，固定大小递减
 **********************************************************************************/

const minSize = 12
const maxSize = 88

// 计算出 size 列表
const makeSizeList = (list: any[]) => {
  const count = list.length
  const step = count > 1 ? (maxSize - minSize) / (count - 1) : 0
  const result = list.map((it, i) => Math.max(maxSize - step * i, minSize))
  return result
}

@Component({
  components: {
    TinyLoading
  }
})
// wordCloud 词云
// https://github.com/timdream/wordcloud2.js/blob/gh-pages/API.md
export default class WordCloudChart extends ViewBase {
  @Prop({ type: Boolean, default: false }) initDone!: boolean

  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: String, default: '' }) titleTips?: string

  @Prop({ type: Number, default: 0 }) currentTypeIndex!: number

  @Prop({ type: Array, default: () => [] }) dict1!: any[]

  @Prop({ type: Array, default: () => [] }) color!: any[]

  @Prop({ type: Array, default: () => [] }) dataList!: any[]

  /** 前景色列表 */
  @Prop({ type: Array, default: () => ['#a3d5e6'] }) foreColor!: string[]

  /** 补丁参数：图表区域高度 */
  @Prop({ type: Number, default: 300 }) chartHeight!: number

  currentIndex: number = this.currentTypeIndex

  myOption: any = {}

  get chartStyle() {
    return {
      width: '100%',
      height: `${this.chartHeight}px`
    }
  }

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
    if (
      !this.dataList[this.currentIndex] ||
      this.dataList[this.currentIndex].length < 1
    ) {
      return
    }
    const ele = this.$refs.refChart as any
    // [['foo', 12], ['bar', 6]]
    const dlist = this.dataList[this.currentIndex] || []
    const sizeList = makeSizeList(dlist)
    const mocklist = dlist.map(
      (item: any, index: number) => {
        const size = sizeList[index]
        return [item.name, size]
        // return [item.name, item.value]
      }
    )
    const option: any = {
      backgroundColor: this.color,
      imageShape: 'cardioid',
      // tooltip: {
      //   show: false,
      //   formatter(item: any) {
      //     console.log(item)
      //   }
      // },
      color: this.foreColor,
      minSize: true,
      list: mocklist,
      shape: 'square',
      ellipticity: 0.65,
      click: this.clickHandle,
      // hover: this.hoverHandle
    }
    WordCloud(ele, option)
  }

  mounted() {
    if (this.initDone) {
      this.resetOptions()
      this.updateCharts()
    }
  }

  clickHandle(item: any, dimension: any, event: any) {
    this.$emit('keyChange', item)
  }

  // hoverHandle(item: any, dimension: any, event: any) {
  //   console.log(item, dimension, event)
  // }

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
.wordCloud-wp {
  cursor: pointer;
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
