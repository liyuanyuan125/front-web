<template>
  <div>
    <Modal v-model="showDlg" title="支付定金" width="600" @on-cancel="cancel()" >
      <p class='cell-box'>您需要支付【{{depositAmount}}】为定金即可开始投放，
        投放结束后定金可抵结算款，如对方案有任何疑问，请点击“联系商务”</p>
      <Form ref="form" :model="form" :label-width="90" :rules="formRules" class="edit-input">
        <FormItem label="支付定金">
          <div style="margin-top: -6px;">{{depositAmount}}元</div>
        </FormItem>
        <FormItem label="支付方式" prop="status">
          <RadioGroup v-model="form.status" >
            <Radio v-for="it in moneyList" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div class='posimg'>
        <div>
          <span class='disimg'><img src="./assets/accountbalance.png" alt=""></span>
          <span class='availableAmount'>可用余额{{availableAmount}}</span>
        </div>
        <div>
          <span class='disimg'><img src="./assets/alipay.png" alt=""></span>
          <span class='availableAmount' style='color: rgba(255, 110, 110, 1);'>优惠： 单笔最高减99元</span>
        </div>
        <div>
          <span class='disimg'><img src="./assets/offlineTransfer.png" alt=""></span>
          <span class='availableAmount' style='color: rgba(255, 110, 110, 1);'>优惠： 单笔最高减99元</span>
        </div>
      </div>
      <div slot="footer" class="btn-center-footer">
        <Button class="button-cancel "  @click="cancel('form')" >取消</Button>
        <Button type="primary" v-if='this.form.status == 0' class="button-ok ok" ><a href="javascript:;" @click='hrefJump'>确认支付</a></Button>
        <Button type="primary" v-if='this.form.status == 1' class="button-ok ok" ><a href="javascript:;" @click='hrefJump'>确认支付</a></Button>
        <Button type="primary" v-if='this.form.status == 2' class="button-ok ok" @click="changeData('form')">确认支付</Button>
      </div>
    </Modal>
    <Modal v-model="showoffline" title="线下转账" width="1000" @on-cancel="cancelDataForm()" >
     <Row class='moneyTip'>
       <Col :span='12' class='top'>应付金额: <span>{{formatNumber(Number(dataForm.amount))}}</span> 元</Col>
     </Row>
     <Form
          :model="dataForm"
          :label-width="88"
          label-position="left"
          class="form page"
          ref="dataForm"
        >
          <Row class="add-row">
            <Col span="12">
              <FormItem label="汇款信息">
                <div class="hui-div">
                  <div>
                    <p class="sma1">{{defaultdata.accountBank}}</p>
                    <p class="sma2">开户银行</p>
                  </div>
                  <div>
                    <p class="sma3">开户账号</p>
                    <div class="sma4">{{accountSplice}}</div>
                    <!-- <div class='sma4'>{{defaultdata.accountNumber.slice(0, 4)}}&nbsp;&nbsp;{{defaultdata.accountNumber.slice(4, 8)}}&nbsp;&nbsp;{{defaultdata.accountNumber.slice(8, 12)}}&nbsp;&nbsp;{{defaultdata.accountNumber.slice(12, 16)}}</div> -->
                  </div>
                  <div>
                    <p class="sma5">开户名称</p>
                    <p class="sma6">{{defaultdata.accountName}}</p>
                  </div>
                </div>
              </FormItem>
            </Col>
            <Col span="9" style='margin-left: 9%;'>
              <FormItem label="汇款底单" prop="receipts">
                <Upload v-model="dataForm.receipts" multiple :maxCount="1" accept="image/*"/>
                <span class='is'>格式为jpg/jpeg/png，大小不超过5M的图片</span>
              </FormItem>
            </Col>
          </Row>
          <Row class="add-row">
            <Col span="10">
              <FormItem label="汇款方式" prop="remittanceType">
                <RadioGroup v-model="dataForm.remittanceType" >
                  <Radio v-for="it in addMoneyList" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="10" style='margin-left: 15%'>
              <FormItem label="汇款流水单号" prop="remittanceNo">
                <Input v-model="dataForm.remittanceNo" class="inp-style" placeholder="请输入充值金额"/>
              </FormItem>
            </Col>
          </Row>
          <Row class="add-row">
            <Col span="10">
              <FormItem label="汇款人姓名" prop="accountName">
                <Input
                  v-model="dataForm.accountName"
                  class="inp-style"
                  placeholder="请输入汇款人姓名"
                />
              </FormItem>
            </Col>
            <Col span="10" style='margin-left: 15%;'>
              <FormItem label="汇款时间">
                <Date-picker
                  :options="options3"
                  type="date"
                  prop="remittanceDate"
                  v-model="dataForm.remittanceDate"
                  on-change="selectTime"
                  placeholder="选择日期"
                  class="inp-style"
                ></Date-picker>
              </FormItem>
            </Col>
          </Row>
          <Row class="add-row">
            <Col span="24">
              <FormItem label="备注" prop="remark">
                <Input
                  v-model="dataForm.remark"
                  class="inp-style-tex"
                  type="textarea"
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      <div slot="footer" class="btn-center-footer">
        <Button class="button-cancel "  @click="cancelDataForm()" >取消</Button>
        <Button type="primary" class="button-ok ok" @click="dataFormSubmit('dataForm')">确认支付</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { formatNumber } from '@/util/validateRules'
import {
  queryList,
  moneyList,
  dataFrom,
  defaultList,
  add,
  lineUnderRemittances,
  before
} from '@/api/financeinfo'
import Upload from '@/views/finance/upload/Upload.vue'
import { warning , success, toast , info } from '@/ui/modal'
import { deposit, getmoney, adverdetail } from '@/api/popPlan'

const form = {
  amount: '',
  status: 1
}

@Component({
  components: {
    Upload
  }
})
export default class Change extends ViewBase {
  user: any = getUser()!
  availableAmount: any = ''
  showDlg: any = false
  // 输入框验证规则
  get formRules() {
    const rules = {
      amount: [
          { required: true, message: '请输入充值金额', trigger: 'blur' }
      ],
      status: [
          { required: true }
      ]
    }
    return rules
  }

  id = 0

  depositAmount: any = ''

  showoffline: any = false
  // 默认银行卡信息
  defaultdata: any = {}
  accountSplice = ''

  moneyList: any = [
    {
      key: 0,
      text: '账户余额'
    },
    {
      key: 1,
      text: '支付宝'
    },
    {
      key: 2,
      text: '线下转账'
    }
  ]

  addMoneyList: any = [
    {
      key: 0,
      text: '账户余额'
    },
    {
      key: 1,
      text: '银行转账'
    },
    {
      key: 2,
      text: '支付宝转账'
    }
  ]

  options3: any = {
    disabledDate(date: any) {
       return date && date.valueOf() < Date.now() - 86400000
    }
  }

  form = { ...form }

  dataForm: any = {
    accountName: '',
    amount: '0.01', // 充值金额
    remittanceDate: null,
    remittanceType: 1,
    remittanceNo: '',
    remark: '',
    receipts: [],
    receipt: '',
    payType: 1,
  }

  async init(id: any) {
    // 银行卡信息
    if (id || (this.$route.query.id && this.$route.query.success == 'false')) {
      const { data: {
        item
      }} = await adverdetail(id)
      if (item.status == 3) {
        this.showDlg = true
        const { data } = await deposit(id)
        this.depositAmount = data.depositAmount
        this.availableAmount = data.availableAmount
        this.defaultdata = data // accountSplice
        this.accountSplice = data.accountNumber
          ? data.accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
          : ''
      } else {

      }
    }
  }

  get formatNumber() {
    return formatNumber
  }

  cancel() {
    this.showDlg = false
    this.showoffline = false
    ; (this.$refs.form as any).resetFields()
  }

  cancelDataForm() {
    this.showoffline = false
    this.showDlg = true
    ; (this.$refs.dataForm as any).resetFields()
  }

  async hrefJump() {
    try {
      const res = await lineUnderRemittances({amount: this.form.amount , payType: 0})
      window.location = res.data
      // this.form = {}
    } catch (ex) {
      this.handleError(ex)
    }
  }


  async changeData(forms: any) {
    const myThis: any = this
    myThis.$refs[forms].validate(async ( valid: any ) => {
      this.dataForm.amount = this.form.amount
      this.showDlg = false
      this.showoffline = true
    })
    const aaa = await before()
    this.addMoneyList = aaa.data.remittanceTypeList
  }

    // 表单提交
  async dataFormSubmit(dataForms: any) {
    const aaa = new Date(this.dataForm.remittanceDate)
    this.dataForm.remittanceDate =
    this.dataForm.receipt =
      this.dataForm.receipts.length > 0 ? this.dataForm.receipts[0].fileId : []
      if (this.dataForm.receipts.length == 0 ) {
        info('请上传汇款底单')
        return
      }
    const myThis: any = this
    myThis.$refs[dataForms].validate(async (valid: any) => {
      if (valid) {
        const query = !this.id
          ? {...this.dataForm , remittanceDate: String(aaa.getFullYear()) +
            ((aaa.getMonth() + 1) < 10 ? '0' + String((aaa.getMonth() + 1)) : (aaa.getMonth() + 1) ) +
            ((aaa.getDate()) < 10 ? '0' + String((aaa.getDate())) : (aaa.getDate()) )}
          : {
              // id: this.id,
              ...this.dataForm,
              remittanceDate: String(aaa.getFullYear()) +
              ((aaa.getMonth() + 1) < 10 ? '0' + String((aaa.getMonth() + 1)) : (aaa.getMonth() + 1) ) +
              ((aaa.getDate()) < 10 ? '0' + String((aaa.getDate())) : (aaa.getDate()) )
            }
        const title = '添加'
        try {
          const res = await lineUnderRemittances(query)
          toast('添加成功')
          // this.dataForm = {}
          // this.seach()
          history.go(0)
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/common.less';
@import '~@/views/account/less/formInput.less';
.item-type {
  margin-top: 3px;
}

.cell-box {
  background: rgba(0, 32, 45, 1);
  color: #fff;
  font-size: 16px;
  padding: 10px;
}

.ok {
  height: 50px;
  background: rgba(0, 32, 45, 1);
  border-radius: 25px;
  color: #fff;
  border: 0;
  a {
    color: #fff;
  }
}

.posimg {
  position: absolute;
  top: 39.3%;
  left: 17.8%;
  width: 454px;
  height: 120px;
  div {
    width: 100%;
    height: 60px;
    line-height: 54px;
    display: flex;
    .disimg {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-left: 22px;
      margin-top: 13px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.add-row {
  padding-left: 30px;
  padding-right: 40px;
}
.inp-style {
  width: 97%;
}
.inp-style-tex {
  width: 97.2%;
}
.hui-div {
  width: 86%;
  height: 183px;
  background: url('./assets/bank.png');
  border-radius: 6px;
  padding: 12px 30px;
  background-size: cover;
  .hui-big {
    width: 100%;
  }
  .sma1 {
    display: block;
    text-align: right;
    height: 12px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 12px;
    margin-top: 5px;
  }
  .sma2 {
    width: 100%;
    text-align: right;
    height: 12px;
    font-size: 12px;
    font-weight: 400;
    color: #222;
    line-height: 12px;
    margin-top: 6px;
  }
  .sma3 {
    width: 100%;
    height: 12px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(34, 34, 34, 1);
    line-height: 12px;
    margin-top: 24px;
  }
  .sma4 {
    width: 100%;
    height: 24px;
    font-size: 24px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 24px;
    margin-top: 9px;
  }
  .sma5 {
    width: 100%;
    height: 12px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(34, 34, 34, 1);
    line-height: 12px;
    margin-top: 32px;
  }
  .sma6 {
    display: block;
    height: 12px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 12px;
    margin-top: 4px;
  }
}
.moneyTip {
  width: 95%;
  margin: 0 0 2% 3%;
  line-height: 50px;
  border-bottom: 1px solid rgba(216, 216, 216, 0.5);
  .top {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 32, 45, 1);
    span {
      color: rgba(255, 128, 128, 1);
    }
  }
}
.availableAmount {
  display: inline-block;
  margin-top: 6px;
  margin-left: 100px;
}
.button-ok-a {
  display: inline-block;
  line-height: 50px;
}
/deep/ .ivu-modal-header {
  background: rgba(216, 216, 216, 1);
}
/deep/ .edit-input .ivu-form-item-content .ivu-input-wrapper {
  width: 255px;
  line-height: 52px;
}

/deep/ .ivu-modal-footer {
  padding-bottom: 30px;
}

/deep/ .ivu-checkbox + span {
  margin-left: 3px;
}

/deep/.ivu-modal-header-inner {
  text-align: center;
  line-height: 38px;
  height: 30px;
  font-size: 24px;
}

/deep/ .ivu-modal-close {
  z-index: 1;
  font-size: 12px;
  position: absolute;
  right: -17px;
  top: -18px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border-radius: 50%;
  border: 2px solid #00202d;
  color: #fff;
  width: 30px;
  height: 30px;
}

/deep/ .ivu-modal-close .ivu-icon-ios-close {
  font-size: 30px;
  font-weight: bold;
  color: #00202d;
  transition: color 0.2s ease;
  position: relative;
  top: -1px;
  left: -2px;
}
// 取消按钮
/deep/ .ivu-modal-close .ivu-icon-ios-close:hover {
  color: #00202d;
}
/deep/ .button-cancel[data-v-6f61fbef]:hover {
  color: #00202d;
  background-color: #fff;
  border-color: #334d57;
}
/deep/ .button-cancel {
  display: inline-block;
  height: 50px;
  width: 160px;
  background-color: #fff;
  border-color: #00202d;
  border-radius: 25px;
  color: #00202d;
  border: none;
  font-size: 16px;
  margin-right: 20px;
  cursor: pointer;
}
// 单选按钮样式
.edit-input {
  /deep/ .ivu-radio-wrapper {
    width: 456px;
    height: 61px;
    line-height: 60px;
    border-bottom: 1px solid rgba(0, 32, 45, 0.2);
  }
  /deep/ .ivu-radio {
    margin-right: 35px;
  }
  /deep/ .ivu-radio-group {
    margin-top: -10px;
  }
}

/deep/ .upload-box {
  width: 300px;
  height: 145px;
  border-radius: 2px;
  border: 1px solid #ccc;
}
/deep/ .upload-add {
  position: relative;
  user-select: none;
  margin-top: 53px;
  margin-left: 99px;
}
/deep/ .upload-list {
  margin-top: 0;
  left: 25%;
}
/deep/ .upload-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 320px;
  height: 120px;
  margin-left: 16px;
  margin-top: -9px;
  vertical-align: top;
}
/deep/ .ivu-input {
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(0, 32, 45, 0.1);
}
</style>

