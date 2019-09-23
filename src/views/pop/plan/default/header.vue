<template>
  <div>
    <div v-if="value.status == 13" class="plan-message">
      <span style="padding-top: 40px">当前计划已失效或已关闭，如有疑问，请点击下放"联系商务"</span>
      <div class="btn-box" style="margin-top: 40px">
        <Button  type="default" @click="collect" class="btn-contact">联系商务</Button>
      </div>
    </div>
    <div v-if="value.status == 2" class="plan-message">
      <p v-if='value.discount'>本次投放折扣【{{value.discount * 10}}折】</p>
      <p>以下为平台专业投放人员为您提供的投放方案，如对方案有任何疑问，请点击“联系商务”</p>
      <p请确认无误后点击下方“确认方案”按钮</p>
      <span style="margin-top: 20px">如对方案有任何疑问请点击“ 联系商务 ” </span>
      <span style="margin-bottom: 20px">请确认无误后点击下方“ 确认方案 ”按钮</span>
      <div class="btn-box">
        <Button type="default" class="btn-contact" @click="sure">确认方案</Button>
        <Button type="default" @click="collect" class="btn-contact wirte">联系商务</Button>
      </div>
    </div>

    <div v-if="value.status == 4" class="plan-message" style="height:80px; padding-top: 16px;">
      <p v-if='value.discount'>本次投放折扣【{{value.discount * 10}}折】</p>
      <div class="btn-box">
        <Button type="default" :to="{ name: 'effect-report', params: { 
          id: $route.params.id
        }}" class="btn-contact">查看效果报表</Button>
      </div>
    </div>

    <div v-if="value.status == 3" class="plan-message">
      <!-- <p>以下为平台专业投放人员为您提供的投放方案，确认后您只需缴纳 -->
      <p v-if='value.discount'>本次投放折扣【{{value.discount * 10}}折】</p>
      <p>您需要支付 ￥{{formatNums(depositAmount)}} 为定金 </p>
      <!-- <p>¥
        <span v-if="value.needPayAmount || value.needPayAmount == 0">
          {{formatNums(value.needPayAmount)}}
        </span>
        <span v-else>
          {{formatNums(value.estimateCostAmount)}}
        </span>为保证金即可开始投放，投放结束后保证金剩余余额将退还到您的账户</p> -->
      <span style="margin-top: 20px">如对方案有任何疑问请点击“ 联系商务 ” </span>
      <span style="margin-bottom: 20px">请确认无误后点击下方“ 立即缴费 ”按钮</span>
      <div class="btn-box">
        <Button type="default" class="btn-contact" @click="pay">立即缴费</Button>
        <Button type="default" @click="collect" class="btn-contact wirte">联系商务</Button>
      </div>
    </div>
<!-- 
    <div v-if="value.status == 6 && value.status == 7" class="plan-message">
      <p>您已缴纳 ￥{{formatNums(value.budgetAmount)}} 为保证金，投放结束后保证金剩余余额将退还到您的账户 </p>
      <div class="btn-box">
        <Button type="default" :to="{ name: 'effect-report', params: { 
          id: $route.params.id
        }}" class="btn-contact">查看效果报表</Button>
      </div>
    </div> -->

    <div v-if="value.status == 9 || value.status == 8 || value.status == 6 ||  value.status == 7 ||  value.status == 5"
      class="plan-message">
      <p v-if='value.discount'>本次投放折扣【{{value.discount * 10}}折】</p>
      <p>您已缴纳 ￥{{formatNums(depositAmount)}} 为定金 </p>
      <span style="margin-top: 20px; margin-bottom: 20px">本计划将于【{{formatDate(value.beginDate)}}】开始 </span>
      <div class="btn-box">
        <Button type="default" :to="{ name: 'effect-report', params: { 
          id: $route.params.id
        }}" class="btn-contact">查看效果报表</Button>
      </div>
    </div>

    <div v-if="value.status == 10" class="plan-message">
      <!-- <p>以下为平台专业投放人员为您提供的投放方案，确认后您只需缴纳 -->
      <p v-if='value.discount'>本次投放折扣【{{value.discount * 10}}折】</p>
      <p>应结金额￥{{formatNums(value.needPayAmount)}}, 您已支付￥{{formatNums(depositAmount)}} 为定金</p>
      <!-- <p>¥
        <span v-if="value.needPayAmount || value.needPayAmount == 0">
          {{formatNums(value.needPayAmount)}}
        </span>
        <span v-else>
          {{formatNums(value.estimateCostAmount)}}
        </span>为保证金即可开始投放，投放结束后保证金剩余余额将退还到您的账户</p> -->
      <span style="margin-top: 20px">如对方案有任何疑问请点击“ 联系商务 ” </span>
      <span style="margin-bottom: 20px">请确认无误后点击下方“ 立即缴费 ”按钮</span>
      <div class="btn-box">
        <Button type="default" class="btn-contact" @click="payend">立即结算</Button>
        <Button type="default" @click="collect" class="btn-contact wirte">联系商务</Button>
      </div>
    </div>

    <div v-if="value.status == 11" class="plan-message">
      <p v-if='value.discount'>本次投放折扣【{{value.discount * 10}}折】</p>
      <p style=" margin-bottom: 10px">
        您已缴纳 ￥{{formatNums(value.needPayAmount)}} 为应结金额，￥{{formatNums(depositAmount)}} 为定金，投放结束后保证金剩余余额将退还到您的账户 </p>
      <div class="btn-box">
        <Button type="default" :to="{ name: 'effect-report', params: { 
          id: $route.params.id
        }}" class="btn-contact">查看效果报表</Button>
      </div>
    </div>

    <div v-if="value.status == 12" class="plan-message">
      <p v-if='value.discount'>本次投放折扣【{{value.discount * 10}}折】</p>
      <p style=" margin-bottom: 10px">
        您已缴纳 ￥{{formatNums(value.needPayAmount)}} 为应结金额，￥{{formatNums(depositAmount)}} 为定金，您可在下方点击“查看效果报告” </p>
      <div class="btn-box">
        <Button type="default" :to="{ name: 'effect-report', params: { 
          id: $route.params.id
        }}" class="btn-contact">查看效果报表</Button>
      </div>
    </div>
    <Sure ref="Sure" @uplist="uplist" />
    <Payend ref="Payend" @uplist="uplist" />  
    <Expenditure ref='Pay' @uplist="uplist"></Expenditure>
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
import Payend from '../planlistmodel/payend.vue'
import moment from 'moment'
import Expenditure from '../planlistmodel/expenditure.vue'
import { deposit } from '@/api/popPlan'

const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    Sure,
    Pay,
    Collect,
    Payend,
    Expenditure
  }
})
export default class App extends ViewBase {
  @Prop() value: any

  depositAmount: any = 0
  created() {
    this.init()
  }

  async init() {
    try {
      const { data } = await deposit(this.$route.params.id)
      this.depositAmount = data.depositAmount || 0
    } catch (ex) {

    }
  }

  formatNums(data: any) {
    return data ? formatCurrency(data) : '0'
  }

  uplist() {
    this.$emit('done')
  }

  pay() {
    this.$nextTick(() => {
      (this.$refs as any).Pay.init(this.value.id)
    })
  }

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  payend() {
    this.$nextTick(() => {
      (this.$refs as any).Pay.init(this.value.id)
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