<template>
  <div>
    <div v-if="value.status == 1" class="plan-message">
      <span>当前计划已失效或已关闭，如有疑问，请点击下放"联系商务"</span>
      <Button type="default" class="btn-contact">联系商务</Button>
    </div>
    <div v-if="value.status == 3" class="plan-message">
      <p>以下为平台专业投放人员为您提供的投放方案，确认后您只需缴纳您的预算 
      <p>¥{{formatNums(value.freezeAmount)}}为保证金即可开始投放，投放结束后保证金剩余余额将退还到您的账户</p>
      <p>   （ 如果实际花费超出您的保证金，您无需补交任何款项 ）</p>
      <span style="margin-top: 20px">如对方案有任何疑问请点击“ 联系商务 ” </span>
      <span style="margin-bottom: 20px">请确认无误后点击下方“ 确认方案 ”按钮</span>
      <div class="btn-box">
        <Button type="default" class="btn-contact">确认方案</Button>
        <Button type="default" class="btn-contact wirte">联系商务</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatCurrency } from '@/fn/string.ts'

@Component
export default class App extends ViewBase {
  @Prop() value: any

  formatNums(data: any) {
    return data ? formatCurrency(data) : '暂无'
  }

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './index.less';
</style>