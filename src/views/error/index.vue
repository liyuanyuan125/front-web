<template>
  <div class="error-page">
    <div class="message">出错了{{message ? `：${message}` : ''}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { MapType } from '@/util/types'

const code2Message: MapType = {
  noauth: '没有权限',
}

@Component
export default class Error extends ViewBase {
  @Prop({ type: String, default: '' }) code!: string

  get message() {
    const code = this.code
    const msg = code2Message[code] || ''
    return msg
  }
}
</script>

<style lang="less" scoped>
.error-page {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.message {
  font-size: 28px;
  color: #e20;
}
</style>
