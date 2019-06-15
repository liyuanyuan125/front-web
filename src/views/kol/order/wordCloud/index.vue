
<template>
  <div>
    <div >
      <div class='title-box'>
        <span v-if=" title !=='' ">{{title}}</span>
      </div>
    </div>
    <Row type="flex"
         justify="center" align="middle">
      <Col :span="24">
        <div class="wordCloud-wp">
          <div ref="refChart"
              v-if="initDone"
              style="width: 100%; height: 300px"></div>        
          <div v-else class='loading-wp' style="width: 100%; height: 300px">
            <!-- <TinyLoading  /> -->
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
  // currentIndex: number = this.currentTypeIndex
  myOption: any = {}
  // currentTypeChange(index: number) {
  //   if ( !this.initDone ) { return }
  //   this.currentIndex = index
  //   this.$emit('typeChange', index)
  // }
  // resetOptions() {
  //   this.currentIndex = this.currentTypeIndex
  // }
  mounted() {
    this.updateCharts()
  }
  updateCharts() {
    const ele = this.$refs.refChart as any
    const mocklist = this.dataList.map(
      (item: any, index: number) => {
        return [item.name, Math.floor(Math.random() * 100 + 1)]
      }
    )
    const option: any = {
      backgroundColor: this.color,
      imageShape: 'cardioid',
      color: '#A3D5E6',
      // minSize: true,
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
        // this.resetOptions()
        this.updateCharts()
      })
    }
  }
  @Watch('currentTypeIndex')
  watchcurrentTypeIndex(newIndex: any, oldIndex: any) {
      this.updateCharts()
  }
}
</script>

<style lang='less'>
.title-box {
  height: 65px;
  line-height: 65px;
  font-size: 17px;
  font-weight: 500;
  color: #fff;
}
</style>
