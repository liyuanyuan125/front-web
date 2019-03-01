<template>
  <i-circle class="circle-progress" :percent="percent" :size="opt.size"
    :stroke-width="opt.strokeWidth" :stroke-color="strokeColor">
    <slot name="fail" v-if="fail">
      <Icon type="ios-close" :style="{color: strokeColor}" class="icon-fail"/>
    </slot>
    <slot name="done" v-else-if="percent >= 100">
      <Icon type="ios-checkmark" :style="{color: strokeColor}" class="icon-done"/>
    </slot>
    <slot v-else>
      <span class="percent-text">{{percent}}%</span>
    </slot>
  </i-circle>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { CircleProgressOptions } from './types'

/** 默认选项 */
const defaultOptions: CircleProgressOptions = {
  size: 96,
  strokeWidth: 6,
  strokeColorDefault: '#2db7f5',
  strokeColorDone: '#5cb85c',
  strokeColorFail: '#f50',
}

@Component
export default class CircleProgress extends ViewBase {
  /** 进度，默认 0 */
  @Prop({ type: Number, default: 0, required: true }) percent!: number

  /** 是否失败，默认 false */
  @Prop({ type: Boolean, default: false }) fail!: boolean

  /** 选项，默认空对象 */
  @Prop({ type: Object, default: () => ({}) }) options!: CircleProgressOptions

  get opt() {
    const options = { ...defaultOptions, ...this.options }
    return options
  }

  get strokeColor() {
    const { strokeColorDefault, strokeColorDone, strokeColorFail } = this.opt
    const color = this.fail
      ? strokeColorFail
      : this.percent >= 100
      ? strokeColorDone
      : strokeColorDefault
    return color
  }
}
</script>

<style lang="less" scoped>
.icon-fail,
.icon-done {
  font-size: 60px;
}
.percent-text {
  font-size: 24px;
}
</style>
