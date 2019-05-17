<template>
  <div class="page home-bg">
    <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="edit-input forms">
      <h3 class="layout-title">基本信息</h3>

      <FormItem label="计划名称" class="item-top select-adv-type" prop="name">
        <Input  v-model="form.name" placeholder="请输入广告计划名称"></Input>
      </FormItem>

      <div class="item-top select-adv-type">
        <div class="adv-left">
          <FormItem style="margin-left:0px" class="float-right pr30" label="关联广告片" prop="videoId">
            <Select v-model="form.videoId" filterable clearable>
              <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }} ({{item.length}}s) {{ item.customerName }}</Option>
            </Select>
          </FormItem>
        </div>
      </div>

      <FormItem label="投放排期" class="item-top select-adv-type">
        <DatePicker type="daterange" placeholder="请选择日期"></DatePicker>
      </FormItem>

      <div>
        <FormItem label="推广预算" class="item-top select-adv-type" prop="budgetAmount">
          <Input style="width: 100px" v-model="form.budgetAmount" placeholder="请输入"></Input>
          <span class="hint">万元.  预估曝光人次：289,374人 </span>
        </FormItem>
      </div>

      <div class="btn-center">
        <Button type="primary" class="button-ok" @click="next('dataform')">下一步,进入定向设置</Button>
      </div>
    </Form>  
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { advertising } from '@/api/popPlan.ts'

@Component
export default class Promotion extends ViewBase {
  @Prop() value!: number

  form: any = {
    name: '',
    beginDate: '',
    endDate: '',
    budgetAmount: null,
    videoId: 0
  }
  adverList: any = {}

  startDate: any = {
    disabledDate: (date: any) => {
      return date && (this.form.endDate && date.valueOf() > new Date(this.form.endDate).getTime())
      || date.valueOf() < Date.now()
    }
  }
  endDate: any = {
    disabledDate: (date: any) => {
      return date && this.form.beginDate && date.valueOf() < new Date(this.form.beginDate).getTime()
      || date.valueOf() < Date.now()
    }
  }

  get rule() {
    const moneyvalidator = ( rules: any, value: any, callback: any) => {
      const msg: any = value + ''
      const reg = /^(?!(0[0-9]{0,}$))[0-9]{1,}$/
      if (msg.length == 0) {
        callback(new Error('请输入推广预算'))
      } else if (!reg.test(msg)) {
        callback(new Error('只能是整数'))
      } else {
        callback()
      }
    }
    return {
      name: [
        { required: true, message: '请输入广告片名称', trigger: 'change' }
      ],
      videoId: [
        { required: true, message: '请选择关联广告片', trigger: 'change', type: 'number' }
      ],
      budgetAmount: [
        { validator: moneyvalidator }
      ]
    }
  }

  created() {
    this.init()
  }

  async init() {
    try {
      const { data } = await advertising( {
        pageIndex: 1,
        pageSize: 200000,
      } )
      this.adverList = data.items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async next(dataform: any) {
    this.$emit('input', 1)
    try {
      const volid = await (this.$refs[dataform] as any).validate()
      if (volid) {
        // this.$emit('input', 1)
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
.item-top {
  margin-left: 30px;
}
.adv-left {
  width: 500px;
  /deep/ .ivu-select-dropdown {
    /deep/ li, /deep/ .ivu-select-loading {
      line-height: 30px;
      height: 30px;
    }
    /deep/ .ivu-select-item {
      line-height: 25px;
      height: 30px;
    }
  }
  /deep/ .ivu-select-input {
    height: 40px;
    font-size: 14px;
    line-height: 40px;
  }
}
.hint {
  position: absolute;
  left: 105px;
  top: 14px;
}
.button-ok {
  width: 200px;
}
.btn-center {
  margin: 40px 0 30px;
  text-align: center;
}
</style>

