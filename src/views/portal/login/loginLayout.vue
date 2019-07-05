<template>
  <div class="login-home">
    <img src="//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkcpcgljqctg008ubl7g.png" class="layout-log" />
    <slot></slot>
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
}
</style>
