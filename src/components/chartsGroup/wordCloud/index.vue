
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
         justify="space-between">
      <Col :span="24">
      <div class="wordCloud-wp">
        <div ref="refChart"
             v-if="initDone"
             style="width: 100%; height: 300px"></div>
        <div v-else
             style="width: 100%; height: 300px">
          <TinyLoading />
        </div>
      </div>
      </Col>
    </Row>
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
  currentIndex: number = this.currentTypeIndex
  myOption: any = {}
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
    const ele = this.$refs.refChart as any
    // [['foo', 12], ['bar', 6]]
    const mocklist = this.dataList[this.currentIndex].map(
      (item: any, index: number) => {
        return [item.name, item.value]
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
      color: '#A3D5E6',
      minSize: true,
      list: mocklist,
      shape: 'square',
      ellipticity: 0.65
    }
    WordCloud(ele, option)
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