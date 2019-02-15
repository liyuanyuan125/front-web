<template>
  <div class="stateContent flex-box">
    <div>
      <img :src="statuList.img" width="64px" alt="alias">
    </div>
    <div class="textMes">
      <h6>{{statuList.title}}</h6>
      <p>{{statuList.text}}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class InfoStatus extends ViewBase {
  @Prop({ type: Number }) statuCode: any
  statuList = []
  list: any = [
      {
          code: 6,
          text: '您的广告片已取消。',
          title: '已取消',
          img: require('../plan/assets/status-cancel.png')
      },
      {
          code: 5,
          text: '拒绝原因：视频内容违反播放条例。',
          title: '已拒绝',
          img: require('../plan/assets/status-reject.png')
      },
  ]
  mounted() {
      this.statuList = this.list.filter( (item: any) => item.code == this.statuCode)[0]
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';

@c-bg: #fff;
.stateContent {
  padding: 50px 0 50px 60px;
  background: @c-bg;
  .textMes {
    padding-left: 30px;
    h6 {
      font-size: 18px;
      padding-top: 5px;
      padding-bottom: 9px;
      font-weight: normal;
      color: @c-head;
    }
    p {
      font-size: 14px;
      color: @c-sub-text;
    }
  }
}
</style>

