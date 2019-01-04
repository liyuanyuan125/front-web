<template>
  <div class="disable-auto-fill">
    <input type="text">
    <input type="password">
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

/**
 * 该组件的作用主要用来快速去除 chrome 自动填充
 */
@Component
export default class DisableAutoFill extends ViewBase {
}
</script>

<style lang="less" scoped>
.disable-auto-fill {
  height: 0;
  overflow: hidden;
  pointer-events: none;
}
</style>
