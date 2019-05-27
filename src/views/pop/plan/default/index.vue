<template>
  <div class="app">
    计划详情
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class App extends ViewBase {
}
</script>

<style lang="less" scoped>
.app {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style>

