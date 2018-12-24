
<template>
  <div class="maxHeight">
    <header-com></header-com>
    <div class='steps'>
      <Steps :current='current'>
        <Step title='创建帐号' style='width:33.3%'></Step>
        <Step title='添加公司信息' style='width:33.3%'></Step>
        <Step title='补充资质' style='width:33.3%'></Step>
      </Steps>
    </div>
    <div class="regStep">
      <component :is="currentView"></component>
      <Button v-if="!current==2" type='warning' long class='submit'>下一步</Button>
      <div class="regSubmit" v-else> 
        <Button type='warning' >稍后补充</Button>
        <Button type='warning' >注册完成</Button>
      </div>
    </div>
    <footer-com></footer-com>
  </div>
</template>

<script lang='ts'>
import { Component, Watch} from 'vue-property-decorator'
import View from '@/util/View'
import headerCom from '../components/header/head.vue'
import footerCom from '../components/header/footer.vue'
import firstStep from '../components/register/firstStep.vue'
import secondStep from '../components/register/secondStep.vue'
import thressStep from '../components/register/threeStep.vue'
@Component({
  components: {
    headerCom,
    footerCom,
    firstStep,
    secondStep,
    thressStep
  }
})
export default class Main extends View {
  currentView = 'thressStep'
  current = 2
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
   height: 68%;
  margin-bottom: 80px;
  .regSubmit{
   width: 600px;
    margin: 0 auto;
    position: relative;
    button{
      width: 280px;
     .form-btn;
     background: #ffffff;
     color: rgba(254,129,53,1);
     &:last-child{
       background: rgba(254,129,53,1);
       position: absolute;
       right: 0;
       top:0;
       color: #ffffff;
     }
    }
  }
    /deep/ .submit {
    width: 600px;
    display: block;
    margin: 0 auto;
    .form-btn;
    }
  }
</style>