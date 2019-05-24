<template>
  <div class="page home-bg">
    <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="">
      
      <Row>
        <Col span="14" offset="3" class="adver-name select-adv-type">
          <FormItem :labelWidth='0' prop="name">
            <Input  v-model="form.name" placeholder="请输入广告计划名称"></Input>
          </FormItem>
        </Col>
      </Row>
      
      <Row>
        <Col span="14" offset="3">
          <Row>
            <Col span="24">
              <Row :gutter="24" class="adver-detail">
                <Col span="10">
                  <FormItem :labelWidth='74' label="广告片:" prop="videoId">
                    <Select v-model="form.videoId" filterable clearable>
                      <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }} ({{item.length}}s) {{ item.customerName }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="8">
                  <FormItem label="广告片规格:" :labelWidth='100' prop="videoId">
                    <Select v-model="form.videoId" filterable clearable>
                      <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }} ({{item.length}}s) {{ item.customerName }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="6">
                  <FormItem label="客户:" :labelWidth='60' prop="videoId">
                    <Select v-model="form.videoId" filterable clearable>
                      <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }} ({{item.length}}s) {{ item.customerName }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span="11">
              <Row class="adver-detail">
                <FormItem label="投放排期:" :labelWidth='74'>
                  <DatePicker style="margin-left: 4px" type="daterange" placeholder="请选择日期"></DatePicker>
                </FormItem>
              </Row>
            </Col>
            <Col span="24">
              <Row>
                <Col :span="11" style="padding-left: 0px" class="adver-schedule">
                  <FormItem label="投放排期:" :labelWidth='74' prop="budgetAmount">
                    <Input v-model="form.budgetAmount" placeholder="请输入"></Input>
                    <span class="hint">万元 </span>
                  </FormItem>
                </Col>
                <Col :span="10">
                  <div class="adver-time">
                    <p>预估曝光人次：<span>289,374</span>人</p>
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
@import '~@/site/lib.less';
.item-top {
  margin-left: 30px;
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
  margin-top: 100px;
  /deep/ .ivu-form-item {
    border: none;
    background: #00202d;
    height: 57px;
    /deep/ .ivu-input-wrapper, .ivu-input {
      margin-left: 10px;
      background: #00202d;
      height: 47px;
      line-height: 60px;
      border: 0;
      border-radius: 5px;
      font-size: 20px;
      color: #fff;
      width: 400px;
      &::placeholder {
        color: #fff;
      }
    }
    /deep/ .ivu-form-item-error-tip {
      padding-top: 14px;
      margin-left: 45px;
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
    &::placeholder {
      color: #fff;
    }
  }
  /deep/ .ivu-select-input, /deep/ .ivu-input-default {
    border-bottom: 1px solid #00202d;
  }
  /deep/ .ivu-select-selection {
    padding-left: 5px;
  }
  /deep/ .ivu-input, /deep/ .ivu-select-input {
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
    width: 20px;
    background: url(./assets/time.png) no-repeat;
    background-size: 20px;
  }
  /deep/ .ivu-icon-ios-close-circle {
    width: 20px;
    background: url(./assets/cancel.png) no-repeat;
    background-size: 20px;
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
  /deep/ .ivu-input,
  /deep/ .ivu-select-input {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 1);
    color: #00202d;
    &::placeholder {
      color: #00202d;
    }
  }
}
.hint {
  position: absolute;
  right: 10px;
  top: 2px;
}
.button-ok {
  width: 200px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.btn-center {
  margin: 40px 0 30px;
  text-align: center;
}
</style>

