<template>
  <div>
    <div v-if="value.status == 12" class="plan-message">
      <span style="padding-top: 40px">当前计划已失效或已关闭，如有疑问，请点击下放"联系商务"</span>
      <div class="btn-box" style="margin-top: 40px">
        <Button  type="default" @click="collect" class="btn-contact">联系商务</Button>
      </div>
    </div>
    <div v-if="value.status == 3" class="plan-message">
      <p>以下为平台专业投放人员为您提供的投放方案，确认后您只需缴纳您的预算 
      <p>¥{{formatNums(value.budgetAmount)}}为保证金即可开始投放，投放结束后保证金剩余余额将退还到您的账户</p>
      <p>   （ 如果实际花费超出您的保证金，您无需补交任何款项 ）</p>
      <span style="margin-top: 20px">如对方案有任何疑问请点击“ 联系商务 ” </span>
      <span style="margin-bottom: 20px">请确认无误后点击下方“ 确认方案 ”按钮</span>
      <div class="btn-box">
        <Button type="default" class="btn-contact" @click="sure">确认方案</Button>
        <Button type="default" @click="collect" class="btn-contact wirte">联系商务</Button>
      </div>
    </div>

    <div v-if="value.status == 2" class="plan-message" style="height:80px; padding-top: 16px;">
      <div class="btn-box">
        <Button type="default" class="btn-contact">查看效果报表</Button>
      </div>
    </div>

    <div v-if="value.status == 4" class="plan-message">
      <p>以下为平台专业投放人员为您提供的投放方案，确认后您只需缴纳您的预算 
      <p>¥{{formatNums(value.budgetAmount)}}为保证金即可开始投放，投放结束后保证金剩余余额将退还到您的账户</p>
      <p>   （ 如果实际花费超出您的保证金，您无需补交任何款项 ）</p>
      <span style="margin-top: 20px">如对方案有任何疑问请点击“ 联系商务 ” </span>
      <span style="margin-bottom: 20px">请确认无误后点击下方“ 立即缴费 ”按钮</span>
      <div class="btn-box">
        <Button type="default" class="btn-contact" @click="pay">立即缴费</Button>
        <Button type="default" @click="collect" class="btn-contact wirte">联系商务</Button>
      </div>
    </div>

    <div v-if="value.status == 6 && value.status == 7" class="plan-message">
      <p>您已缴纳 ￥{{formatNums(value.budgetAmount)}} 为保证金，投放结束后保证金剩余余额将退还到您的账户 </p>
      <p style="margin-bottom: 20px">（ 如果实际花费超出您的保证金，您无需补交任何款项 ）</p>
      <div class="btn-box">
        <Button type="default" class="btn-contact">查看效果报表</Button>
      </div>
    </div>

    <div v-if="value.status == 9 && value.status == 8" class="plan-message">
      <p>您已缴纳 ￥{{formatNums(value.budgetAmount)}} 为保证金，投放结束后保证金剩余余额将退还到您的账户 </p>
      <p>（ 如果实际花费超出您的保证金，您无需补交任何款项 ）</p>
      <span style="margin-top: 20px; margin-bottom: 20px">本计划将于【2019/02/21日】开始 </span>
      <div class="btn-box">
        <Button type="default" class="btn-contact">查看效果报表</Button>
      </div>
    </div>
    <Sure ref="Sure" @uplist="uplist" />
    <Pay ref="Pay" @uplist="uplist" />  
    <Collect ref="collect" />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatCurrency } from '@/fn/string.ts'
import Sure from '../planlistmodel/sure.vue'
import Pay from '../planlistmodel/pay.vue'
import Collect from '../planlistmodel/collect.vue'
@Component({
  components: {
    Sure,
    Pay,
    Collect
  }
})
export default class App extends ViewBase {
  @Prop() value: any

  formatNums(data: any) {
    return data ? formatCurrency(data) : '0'
  }

  uplist() {
    this.$emit('done')
  }

  pay() {
    this.$nextTick(() => {
      (this.$refs as any).Pay.init(this.value.companyId, this.value.budgetAmount, this.value.id)
    })
  }

  sure() {
    this.$nextTick(() => {
      (this.$refs as any).Sure.init(this.value.id)
    })
  }

  collect() {
     this.$nextTick(() => {
      (this.$refs as any).collect.init()
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './index.less';
</style>