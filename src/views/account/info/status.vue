<template>
  <div class="stateContent flex-box">
    <div>
      <img :src="status[statuCode].img" width="64px" alt="alias">
    </div>
    <div class="textMes">
      <h6>{{status[statuCode].title}}</h6>
      <p>{{status[statuCode].message}}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class InfoStatus extends ViewBase {
  @Prop({ type: Number }) statuCode: any

  status = [
    {
      img: require('../../../assets/icon/waiting.png'),
      title: '未上传资质',
      message: '您的账号尚未补全开户资质，请尽快上传营业执照通过账号审核！'
    },
    {
      img: require('../../../assets/icon/waiting.png'),
      title: '审核中',
      message: '您的账号正在审核中，审核通过后即可开始上传资源位。'
    },
    {
      img: require('../../../assets/icon/waiting.png'),
      title: '审核失败',
      message: '您的账号审核未通过，请修改注册信息。 '
    },
    {
      img: require('../../../assets/icon/waiting.png'),
      title: '正常使用',
      message: '您的账号正常，可进行广告投放！如需变更公司账号请联系我司。！'
    }
  ]
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
      padding-bottom: 12px;
      color: @c-head;
    }
    p {
      font-size: 14px;
      color: @c-sub-text;
    }
  }
}
</style>

