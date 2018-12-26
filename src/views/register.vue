
<template>
  <div class="maxHeight">
    <header-com></header-com>
    <div class='steps'>
      <Steps :current='current'>
        <Step title='创建帐号' style='width:48%'></Step>
        <Step title='补充资质' style='width:48%'></Step>
      </Steps>
    </div>
    <div class="regStep">
      <component :is="currentView" @iscurrent="iscurrent"></component>
    </div>
    <footer-com></footer-com>
  </div>
</template>

<script lang='ts'>
import { Component, Watch} from 'vue-property-decorator'
import View from '@/util/View'
import footerCom from '../views/header/footer.vue'
import headerCom from '../views/header/head.vue'
import firstStep from '../views/register/firstStep.vue'
import thressStep from '../views/register/threeStep.vue'

@Component({
  components: {
    headerCom,
    footerCom,
    firstStep,
    thressStep
  }
})
export default class Main extends View {
  currentView = 'firstStep'
  current = 0
  iscurrent(val: any) {
    this.current = val
    this.currentView = 'thressStep'
  }
}
</script>
<style lang='less' scoped>
@import '../site/login.less';
.maxHeight{
  height: 100%;
}
.steps {
  border-bottom: solid 1px #efefef;
  padding-bottom: 20px;
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
  /deep/ .ivu-steps .ivu-steps-head-inner>.ivu-steps-icon.ivu-icon{
    position: relative;
    font-size: 22px;
    top:-4px;
    left: -4px;
  }
}
.regStep{
  margin-bottom: 80px;
  
    /deep/ .submit {
    width: 600px;
    display: block;
    margin: 0 auto;
    .form-btn;
    }
  }
</style>
