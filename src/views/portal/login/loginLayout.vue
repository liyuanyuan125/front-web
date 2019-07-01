<template>
  <div class="login-home">
    <img src="../assets/logo.png" class="layout-log" />
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
  background: url('../assets/logo-bg.png') no-repeat center;
  background-size: cover;
  .layout-log {
    width: 189px;
    position: absolute;
    left: 37px;
    top: 31px;
  }
}
</style>
