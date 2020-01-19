<template>
  <div class="login-home">
    <router-link :to="{name: 'login'}">
      <img src="~@/assets/site/home-logo.png" class="layout-log" />
    </router-link>
    <slot></slot>
    <p class="home-footer">copyright&copy; 2020 jydata.com &nbsp;&nbsp;&nbsp;&nbsp;北京智能广宣科技有限公司&nbsp;&nbsp;&nbsp;&nbsp; 
      <a href="http://beian.miit.gov.cn" target="_blank">京ICP备19004779号-2</a></p>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Main extends ViewBase {
}
</script>

<style lang='less' scoped>
.login-home {
  position: absolute;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background: url('//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkcpcetjqctg008ubl70.jpg') no-repeat center;
  background-size: cover;
  .layout-log {
    width: 189px;
    position: absolute;
    left: 37px;
    top: 31px;
    z-index: 999;
  }
  .home-footer {
    width: 100%;
    color: #fff;
    text-align: center;
    font-size: 14px;
    position: absolute;
    bottom: 20px;
  }
}

// @media screen and(max-height: 600px) {
//   .login-home .home-footer {
//     position: absolute;
//     bottom: 20px;
//   }
// }
</style>
