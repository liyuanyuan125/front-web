
<template>
  <div class="page-wrap">
    <div class="steps">
      <Steps :current="current">
        <Step title="创建帐号" style="width:48%"></Step>
        <Step title="补充资质" style="width:48%"></Step>
      </Steps>
    </div>
    <div class="reg-body">
      <router-view/>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

const stepMap: any = {
  register: 0,
  registerComplete: 1,
}

@Component
export default class Main extends ViewBase {
  get current() {
    const name = this.$route.name
    return stepMap[name!] || 0
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/login.less';

.page-wrap {
  height: 100%;
}
.steps {
  border-bottom: solid 1px #efefef;
  padding: 50px 0 20px;
  .wid-auto;
  /deep/ .ivu-steps .ivu-steps-tail > i {
    position: relative;
    top: -2px;
  }
  /deep/ .ivu-steps {
    width: 500px;
    margin: 0 auto;
    margin-left: 345px;
  }
  /deep/ .ivu-steps .ivu-steps-title {
    font-weight: none;
  }
  /deep/ .ivu-steps .ivu-steps-head-inner {
    width: 16px;
    height: 16px;
    line-height: 14px;
    font-size: 12px;
    margin: 2px 5px 0 0;
  }
  /deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
    border-color: @theme-color;
    background-color: @theme-color;
  }
  /deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-title {
    color: @text-color;
  }
  /deep/ .ivu-steps .ivu-steps-head-inner > .ivu-steps-icon.ivu-icon {
    position: relative;
    font-size: 22px;
    top: -4px;
    left: -4px;
  }
}

.reg-body {
  margin-bottom: 80px;

  // /deep/ .submit {
  //   width: 600px;
  //   display: block;
  //   margin: 0 auto;
  //   .form-btn;
  // }
}
</style>
