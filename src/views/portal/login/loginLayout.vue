<template>
  <div class="login-home">
    <router-link :to="{name: 'login'}">
      <img src="//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkcpcgljqctg008ubl7g.png" class="layout-log" />
    </router-link>
    <slot></slot>
    <p class="home-footer">copyright&copy; 2019 jydata.com　　北京智能广宣科技有限公司</p>
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
    bottom: 40px;
  }
}

@media screen and(max-height: 600px) {
  .login-home .home-footer {
    position: absolute;
    bottom: 20px;
  }
}
</style>
