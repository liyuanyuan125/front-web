<template>
  <div class="">
    <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="form">
      <Row>
        <Col span="14" offset="3" class="adver-name select-adv-type">
          <FormItem :label-width="210" label="请输入广告计划名称:" prop="name">
            <Input style="border-radius: 5px"  v-model="form.name" placeholder=""></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="14" offset="3">
          <Row>
            <Col span="24">
              <Row :gutter="24" class="adver-detail">
                <Col span="17">
                  <FormItem :labelWidth='100' label="广告片:" :prop="setadver ? '': 'videoId'">
                    <Select v-model="form.videoId" :disabled="setadver" filterable clearable>
                      <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="6">
                  <Checkbox style="width: 180px" v-model="setadver" class="check-item check-no form-item-first">暂不设置</Checkbox>
                </Col>
              </Row>
              <Row class="adver-detail" :gutter="10">
                <Col :span="7">
                  <FormItem style="margin-left: 3px" label="广告片规格:" :labelWidth='100'>
                    <Select :disabled="!setadver" v-model="form.specification" filterable clearable>
                      <Option v-for="(item, index) in adverList" :value="item.specification" :key="index">{{ item.specification }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="5">
                  <FormItem label="客户:" :labelWidth='50'>
                    <Select :disabled="!setadver" v-model="form.customerId" filterable clearable>
                      {{adverList}}
                      <Option v-for="(item, index) in adverList" :value="item.customerId" :key="index">{{ item.customerName }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="6">
                  <FormItem label="品牌:" :labelWidth='60'>
                    <Select :disabled="!setadver" v-model="form.brandId" filterable clearable>
                      <Option v-for="(item, index) in adverList" :value="item.brandId" :key="index">{{ item.brandName }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="6">
                  <FormItem label="产品:" :labelWidth='60'>
                    <Select :disabled="!setadver" v-model="form.productId" filterable clearable>
                      <Option v-for="(item, index) in adverList" :value="item.productId" :key="index">{{ item.productName }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span="12">
              <Row class="adver-detail">
                <FormItem label="投放排期:" class="timer" :labelWidth='100' prop="advertime" :show-message="form.advertime.length == 0">
                  <weekDatePicker v-model="form.advertime" style="margin-left: 4px" type="daterange" placeholder="请选择日期"></weekDatePicker>
                </FormItem>
              </Row>
            </Col>
            <Col span="24">
              <Row>
                <Col :span="12" style="padding-left: 0px" class="adver-schedule">
                  <FormItem label="推广预算:" :labelWidth='100' prop="budgetAmount">
                    <Input v-model="form.budgetAmount" placeholder="请输入"></Input>
                    <span class="hint">万元 </span>
                  </FormItem>
                </Col>
                <Col :span="10">
                  <div class="adver-time">
                    <p>预估曝光人次：<span>{{nums}}</span>人</p>
                  </div>
                </Col>
              </Row>
              
            </Col>
          </Row>
        </Col>
      </Row>

      <div class="btn-center">
        <Button type="primary" class="button-ok" @click="next('dataform')">下一步,进入定向设置</Button>
      </div>
    </Form>  
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { advertising, estimate, createdDraft, adverdetail } from '@/api/popPlan.ts'
import { formatCurrency } from '@/fn/string.ts'
import { clean } from '@/fn/object.ts'
import weekDatePicker from '@/components/weekDatePicker/weekDatePicker.vue'
import moment, { relativeTimeRounding } from 'moment'

const timeFormat = 'YYYYMMDD'
@Component({
  components: {
    weekDatePicker
  }
})
export default class Promotion extends ViewBase {
  @Prop() value!: number
  setadver: any = false
  form: any = {
    name: '',
    beginDate: '',
    endDate: '',
    budgetAmount: '',
    videoId: null,
    specification: null,
    customerId: null,
    productId: 1,
    brandId: 1,
    advertime: []
  }
  planID: any = ''
  length = 0
  customerName = ''
  adverList: any = []
  nums: any = 0

  get rule() {
    const moneyvalidator = ( rules: any, value: any, callback: any) => {
      const msg: any = value + ''
      const reg = /^(?!(0[0-9]{0,}$))[0-9]+(.[0-9]+)?$/
      if (msg.length == 0) {
        callback(new Error('请输入推广预算'))
      } else if (!reg.test(msg)) {
        callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }
    const video = ( rules: any, value: any, callback: any) => {
      if (!this.setadver && !value) {
        callback(new Error('请选择广告片'))
      } else {
        callback()
      }
    }
    return {
      name: [
        { required: true, message: '请输入广告片名称', trigger: 'change' }
      ],
      videoId: [
        { validator: video }
      ],
      budgetAmount: [
        { validator: moneyvalidator }
      ],
      advertime: [
        {
          type: 'array',
          required: true,
          message: '请选择投放排期',
          trigger: 'change',
          fields: {
            0: {type: 'date', required: true, message: '请选择投放排期'},
            1: {type: 'date', required: true, message: '请选择投放排期'}
          }
        }
      ]
    }
  }

  created() {
    this.init()
  }

  async init() {
    (this.$Spin as any).show()
    try {
      const { data } = await advertising( {
        pageIndex: 1,
        pageSize: 200000,
        status: 4
      } )
      this.adverList = data.items || []
      this.seach()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async seach() {
    if (!this.$route.params.setid) {
      (this.$Spin as any).hide()
      return
    }
    try {
      const { data } = await adverdetail(this.$route.params.setid)
      this.form.name = data.item.name
      this.form.specification = data.item.specification
      this.form.budgetAmount = data.item.budgetAmount
      this.form.customerId = data.item.customerId
      if (!data.item.videoId) {
        this.setadver = true
      } else {
        this.form.videoId = data.item.videoId
      }
      this.form.advertime = [new Date(this.formatDate(data.item.beginDate)),
        new Date(this.formatDate(data.item.endDate))]
    } catch (ex) {
      this.handleError(ex)
    }
    (this.$Spin as any).hide()
  }

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  async next(dataform: any) {
    try {
      const volid = await (this.$refs[dataform] as any).validate()
      if (volid) {
        const data = await createdDraft(clean({
          ...this.form,
          id: this.$route.params.setid ? this.$route.params.setid : '',
          advertime: '',
          specification: this.form.specification ?  this.form.specification + '' : '',
          budgetAmount: Number(this.form.budgetAmount)}))
        if (!this.$route.params.setid) {
          this.$router.push({
            name: 'pop-planlist-add',
            params: { id: '1', setid: data.data  }
          })
        } else {
          this.$router.push({
            name: 'pop-planlist-edit',
            params: { id: '1', setid: data.data  }
          })
        }
        this.$emit('input', 1)
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async getnums(val: any) {
    try {
      const { data } = await estimate({budgetAmount: val})
      this.nums = formatCurrency(data.estimatePersonCount)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('form.videoId')
  watchformVideoId(val: any) {
    if (val) {
      const data = this.adverList.filter((it: any) => val == it.id)
      this.form.customerId = data[0].customerId
      this.form.brandId = data[0].brandId
      this.form.specification = data[0].specification
      this.form.productId = data[0].productId
    }
  }
  @Watch('form.advertime', {deep: true})
  watchformAdvertime(val: any) {
    if (val.length > 0) {
      this.form.beginDate = moment(val[0]).format(timeFormat)
      this.form.endDate = moment(val[1]).format(timeFormat)
    }
  }

  @Watch('form.budgetAmount')
  watchformBudgetAmount(val: any) {
    const reg = /^(?!(0[0-9]{0,}$))[0-9]+(.[0-9]+)?$/
    if (val && reg.test(val)) {
      this.getnums(val)
    } else {
      this.nums = 0
    }
  }

  @Watch('setadver')
  watchSetadver(val: any) {
    if (val) {
      this.form.videoId = 0
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.item-top {
  margin-left: 30px;
}
.form {
  height: 570px;
}
.input-height {
  height: 58px;
  line-height: 48px;
}
.adver-sel {
  /deep/ .ivu-form-item-label {
    color: #a3d5e6;
    text-align: right;
  }
}
.adver-name {
  margin-top: 30px;
  margin-bottom: 52px;
  /deep/ .ivu-form-item-label {
    font-size: 20px;
    color: #fff;
    margin-left: 10px;
    line-height: 38px;
  }
  /deep/ .ivu-select-input {
    color: #fff;
  }
  /deep/ .ivu-form-item {
    border: none;
    background: #00202d;
    height: 57px;
    border-radius: 5px;
    /deep/ .ivu-input-wrapper, .ivu-input {
      background: #00202d;
      height: 47px;
      line-height: 60px;
      border: 0;
      font-size: 20px;
      color: #fff;
      width: 400px;
      &::placeholder {
        color: #fff;
      }
    }
    /deep/ .ivu-form-item-error-tip {
      padding-top: 14px;
      margin-left: 15px;
      font-size: 16px;
    }
  }
}
/deep/ .ivu-form-item-label {
  text-align: right;
}
.adver-detail {
  background: rgba(0, 32, 45, 0);
  /deep/ .ivu-select-selection,
  /deep/ .ivu-input-wrapper,
  /deep/ .ivu-select,
  /deep/ .ivu-input,
  /deep/ .ivu-select-input {
    background: rgba(208, 233, 246, 0);
    border: 0;
    outline: none;
    font-size: 16px;
    &::placeholder {
      font-size: 16px;
      color: #fff;
    }
  }
  /deep/ .ivu-form-item-error-tip {
    font-size: 16px;
  }
  /deep/ .ivu-form-item-label {
    font-size: 16px;
    font-weight: 500;
    color: #00202d;
  }
  /deep/ .ivu-select-input, /deep/ .ivu-input-default {
    border-bottom: 1px solid #00202d;
  }
  /deep/ .ivu-select-selection {
    padding-left: 5px;
  }
  /deep/ .ivu-input, /deep/ .ivu-select-input {
    color: #fff;
    line-height: 30px;
    height: 30px;
  }
  /deep/ .ivu-select-arrow {
    right: 0;
    color: #00202d;
  }
  /deep/ .ivu-date-picker {
    display: block;
  }
  /deep/ .ivu-icon-ios-calendar-outline {
    position: absolute;
    right: -64px;
    width: 22px;
    top: 4px;
    height: 22px;
    background: url(./assets/time.png) no-repeat;
    background-size: 20px;
  }
  .timer {
    /deep/ .ivu-form-item-content {
      border-bottom: 1px solid #00202d;
      label {
        color: #fff;
        font-size: 16px;
        width: 185px;
      }
    }
    /deep/ .ivu-icon-ios-close-circle {
      width: 20px;
      background: url(./assets/cancel.png) no-repeat;
      background-size: 20px;
    }
  }
  /deep/ .ivu-input-prefix i, /deep/ .ivu-input-suffix i {
    color: rgba(255, 255, 255, 0);
  }
}
.adver-time {
  margin-left: 30px;
  span {
    font-size: 22px;
  }
}
.adver-schedule {
  /deep/ .ivu-input-wrapper,
  /deep/ .ivu-form-item-content,
  /deep/ .ivu-input,
  /deep/ .ivu-select-input {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 1);
    color: #00202d;
    border-radius: 5px;
    font-size: 16px;
    &::placeholder {
      font-size: 16px;
      color: #00202d;
    }
  }
  /deep/ .ivu-form-item-label {
    font-size: 16px;
    font-weight: 500;
    color: #00202d;
  }
}
.check-ra {
  /deep/ .ivu-checkbox {
    display: none;
  }
  /deep/&.ivu-checkbox-wrapper-checked {
    color: #fff;
    border-color: @c-button;
    background-color: @c-button;
    &::after {
      content: '\2713';
      color: #fff;
      position: absolute;
      right: -8px;
      top: -8px;
      border: 1px solid #00202d;
      background: #00202d;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
    }
  }
}
.check-item {
  /deep/ .ivu-checkbox-inner {
    width: 20px;
    height: 20px;
    border-color: #fff;
    background: #fff;
    &::after {
      line-height: 20px;
      text-align: center;
      width: 7px;
      height: 11px;
      top: 1px;
      left: 5px;
      border-color: #00202d;
    }
  }
  &.check-no {
    margin-top: 3px;
    font-size: 16px;
    margin-left: 6px;
  }
}
.hint {
  position: absolute;
  right: 10px;
  top: 2px;
  color: #00202d;
}
.button-ok {
  width: 200px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.btn-center {
  position: absolute;
  margin: 40px 0 30px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
}
</style>

