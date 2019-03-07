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
  @Prop({ type: String}) refuseReason: any

  statuList = []
  list: any = [
      {
          code: 1,
          text: '您的广告计划已存为草稿，提交审核后可开启投放。',
          title: '草稿',
          img: require('../assets/status-draft.png')
      },
      {
          code: 3,
          text: '您的广告花费由于即将超出冻结金额，已为您暂停。',
          title: '已暂停',
          img: require('../assets/status-pause.png')
      },
      {
          code: 9,
          text: '您的广告计划已取消。',
          title: '已取消',
          img: require('../assets/status-cancel.png')
      },
      {
          code: 10,
          text: `拒绝原因：${this.refuseReason}`,
          title: '已拒绝',
          img: require('../assets/status-reject.png')
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

