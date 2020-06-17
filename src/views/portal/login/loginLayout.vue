<template>
  <div class="login-home">
    <router-link :to="{name: 'login'}">
      <img src="~@/assets/site/home-logo.png" class="layout-log" />
    </router-link>
    <slot></slot>
    <p class="home-footer">copyright&copy; 2020 jydata.com &nbsp;&nbsp;&nbsp;&nbsp;北京智能广宣科技有限公司&nbsp;&nbsp;&nbsp;&nbsp; 
      <a href="http://beian.miit.gov.cn" target="_blank">京ICP备19004779号-2</a></p>

      <div class="recordNo">
      <a target="_blank" class="code-link" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502041177">
          <img src="https://bkssl.bdimg.com/static/wiki-common/widget/component/footer/img/icon-police_d8a40a4.png" width="13" height="14" />
          <p style="height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">京公网安备 11010502041177号</p>
      </a>
    </div>
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
.recordNo {
  width: 100%;
  position: absolute;
  bottom: 20px;
  text-align: center;
}
.code-link {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  height: 20px;
  line-height: 20px;
}
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
    bottom: 40px;
  }
}

// @media screen and(max-height: 600px) {
//   .login-home .home-footer {
//     position: absolute;
//     bottom: 20px;
//   }
// }
</style>
