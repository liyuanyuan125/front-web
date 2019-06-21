<template>
  <div class="page home-bg as">

    <!-- <div class="userTitle">
      <span class="nav-top-title">财务信息</span>
    </div> -->
    <div class="fince"  v-auth="'financial-manage.info#viewsummary'">
      <h3 class="userTitle">
        <span style="color:#222222;" class="nav-top-title">账户总览</span>
      </h3>
      <div class="fince-list">
        <div class="fince-list-big">
          <p class="fince-list-sm">账户余额 / 元</p>
          <div class="fince-list-acc count-to-count-text count-style">{{balance}}</div>
        </div>
        <div class="fince-list-big">
          <p class="fince-list-sm">可用金额 / 元</p>
          <div class="fince-list-acc">{{availableAmount}}</div>
        </div>
        <div class="fince-list-big">
          <p class="fince-list-sm">冻结金额 / 元</p>
          <div class="fince-list-accd">{{freezeAmount}}</div>
        </div>
      </div>
    </div>
    <div class="table-box" v-auth="'financial-manage.info#viewlist'">
      <div class="table-left-title">最近充值记录</div>
      <router-link
        :to="{path:'/finance/info/more' , params: {companyId: userList.companyId,}}"
        tag="div"
        class="table-right-title"
      >查看更多</router-link>
    </div>
    <Table
      ref="selection"
      class="tables"
      v-auth="'financial-manage.info#viewlist'"
      :loading="tableLoading"
      :columns="columns4"
      :data="tableData"
    ></Table>

    <div class="finceadd">
      <h3 class="userTitle zhc">
        <span >账户充值</span>
      </h3>
      <div class="fince-list-item">
        <Form
          :model="dataForm"
          :label-width="88"
          :rules="rules"
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
            <Col span="12">
              <FormItem label="汇款底单" prop="receipts">
                <Upload v-model="dataForm.receipts" multiple :maxCount="1" accept="image/*"/>
                <span class='is'>格式为jpg/jpeg/png，大小不超过5M的图片</span>
              </FormItem>
            </Col>
          </Row>
          <Row class="add-row">
            <Col span="12">
              <FormItem label="银行账号" prop="accountNumber">
                <Input v-model="dataForm.accountNumber" class="inp-style" placeholder="请输入汇款银行账号"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="充值金额" prop="amount">
                <Input v-model="dataForm.amount" class="inp-style" placeholder="请输入充值金额"/>
              </FormItem>
            </Col>
          </Row>
          <Row class="add-row">
            <Col span="7">
              <FormItem label="汇款人姓名" prop="accountName">
                <Input
                  v-model="dataForm.accountName"
                  class="inp-style-center"
                  placeholder="请输入汇款人姓名"
                />
              </FormItem>
            </Col>
            <Col span="7" style='margin-left: 5%;'>
              <FormItem label="汇款时间">
                <Date-picker
                  type="date"
                  prop="remittanceDate"
                  v-model="dataForm.remittanceDate"
                  on-change="selectTime"
                  placeholder="选择日期"
                  class="inp-style-center"
                ></Date-picker>
              </FormItem>
            </Col>
            <Col span="7" style='margin-left: 5%;'>
              <FormItem label="联系电话" prop="contactPhone">
                <Input
                  v-model="dataForm.contactPhone"
                  class="inp-style-center"
                  placeholder="请输入联系人电话号码"
                />
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
                  placeholder="限50字"
                  maxlength = "50"
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div class='btnq' style="text-align: center">
          <Button class='but'  v-auth="'financial-manage.info#submit'" type="primary" @click="dataFormSubmit('dataForm')">提交充值申请</Button>
        </div>
      </div>
    </div>
    <Modal v-model="viewerShow" title="查看图片" width="500" height="500">
      <img style="width: 100%;" :src="viewerImage" alt sizes srcset>
    </Modal>
  </div>
</template>

<script lang="tsx">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import {
  queryList,
  moneyList,
  dataFrom,
  defaultList,
  add
} from '@/api/financeinfo'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import Upload from '../upload/Upload.vue'
import { slice, clean } from '@/fn/object'
import { warning , success, toast , info } from '@/ui/modal'

// 获取当前登录用户信息
const user: any = getUser()!

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD'

const dataForm = {
  accountNumber: '',
  accountName: '',
  amount: null,
  remittanceDate: null,
  contactPhone: '',
  remark: '',
  receipts: [],
  receipt: '',
  companyId: user.companyId,
  companyName: user.companyName
}

@Component({
  components: {
    Upload
    // countTo
  }
})
export default class Main extends ViewBase {
  //   user : any = getUser()
  dataFormget = {
    companyId: user.companyId,
    pageIndex: 1,
    pageSize: 10
  }


  accountSplice = ''

  total = 0
  id = 0
  items: any = []
  loading = false
  tableLoading = false
  options: any = []
  userList: any = {}
  // 状态列表
  approvalStatusList: any = []
  // 财产
  datamoney: any = {}
  // 默认银行卡信息
  defaultdata: any = {}
  // 银行账号
  accountNumbers: any = ''

  rules = {
    accountName: []
  }
  count = 0
  end: any = 0
  end2: any = 0
  end3: any = 0

  balance: any = ''
  availableAmount: any = ''
  freezeAmount: any = ''
  newend: any = ''

  // 查看图片
  viewerShow = false
  viewerImage = ''

  dataForm: any = { ...dataForm }

  columns4 = [
    { title: '充值ID', key: 'id', align: 'center' },
    {
      title: '申请时间',
      key: 'applyTime',
      align: 'center',
      render: (hh: any, { row: { applyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(applyTime).format(timeFormat)
        return applyTime == null ? (
          <span class="datetime" v-html="-" />
        ) : (
          <span class="datetime" v-html={html} />
        )
        /* tslint:enable */
      }
    },
    {
      title: '银行账号',
      key: 'accountNumber',
      align: 'center'
    },
    {
      title: '汇款人姓名',
      key: 'accountName',
      align: 'center'
    },
    {
      title: '汇款时间',
      key: 'remittanceDate',
      align: 'center',
      render: (hh: any, { row: { remittanceDate } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(remittanceDate).format(timeFormat)
        return remittanceDate == null ? (
          <span class="datetime" v-html="-" />
        ) : (
          <span class="datetime" v-html={html} />
        )
        /* tslint:enable */
      }
    },
    {
      title: '联系人电话',
      key: 'contactPhone',
      align: 'center'
    },
    {
      title: '充值金额/元',
      key: 'amount',
      align: 'center'
    },
    {
      title: '备注',
      key: 'remark',
      align: 'center',
      render: (hh: any, { row: { remark } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html1 = String(remark).slice(0, 10) + '...'
        if (String(remark).length >= 10) {
          return (
            <div>
              <tooltip content={remark} placement="top">
                <span class="datetime" v-html={html1} />
              </tooltip>
            </div>
          )
        } else {
          return (
              <span class="datetime" v-html={remark} />
          )
        }
        /* tslint:enable */
      }
    },
    {
      title: '汇款凭证',
      align: 'center',
      render: (hh: any, { row: { imageList } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        // const url = imageList.url
        // console.log(url)
        return (
          <a
            href="javascript:;"
            on-click={this.onView.bind(this , imageList.url)}
            class="operation">
            查看汇款凭证
          </a>
        )
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      key: 'statusText',
      width: 100,
      align: 'center',
      render: (
        hh: any,
        { row: { rejectReason, approvalStatus, statusText } }: any
      ) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (approvalStatus == 1) {
          return <span class={`status-${1}`}>待审核</span>
        } else if (approvalStatus == 2) {
          return <span class={`status-${2}`}>充值通过</span>
        } else if (approvalStatus == 3) {
          return (
            <tooltip content={rejectReason} placement="top">
              <span class={`status-${3}`}>充值拒绝</span>
            </tooltip>
          )
        }
        /* tslint:enable */
      }
    }
  ]

  async init() {}

  addNumber(number: any) {
    this.newend = ''
    this.count = 0
    if (number.indexOf('.') == -1) {
      for (let i = number.length - 1; i >= 0; i--) {
        if (this.count % 3 == 0 && this.count != 0) {
          this.newend = number.charAt(i) + ',' + this.newend
        } else {
          this.newend = number.charAt(i) + this.newend
        }
        this.count++
      }
      number = this.newend + '.00' // 自动补小数点后两位
      return number
    } else {
      for (let i = number.indexOf('.') - 1; i >= 0; i--) {
        if (this.count % 3 == 0 && this.count != 0) {
          this.newend = number.charAt(i) + ',' + this.newend // 碰到3的倍数则加上“,”号
        } else {
          this.newend = number.charAt(i) + this.newend // 逐个字符相接起来
        }
        this.count++
      }
      number =
        this.newend + (number + '00').substr((number + '00').indexOf('.'), 3)
      return number
    }
  }
  addset(str: any, str1: any) {
    setInterval(() => {
      if (Number(this.end) < Number(str1)) {
        this.end += Math.floor(Math.random() * 50000)
        str = this.addNumber(String(this.end))
      } else {
        return (this.end = str1)
      }
    }, 1)
  }

  created() {
    // this.getUser()
    this.userList = user
    this.seach()
    this.init()
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.dataFormget.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.dataFormget.pageSize = val
    this.seach()
  }

  get cachedMap() {
    return {
      approvalStatus: this.approvalStatusList
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.items || []).map((it: any) => {
      return {
        ...it,
        statusText: it.approvalStatus
      }
    })
    return list
  }

  async seach() {
    this.tableLoading = true
    try {
      const query = { ...this.dataFormget }
      const {
        data: { items, totalCount, approvalStatusList }
      } = await queryList(clean({ ...query }))
      if (items.length <= 5) {
        this.items = items
      } else {
        this.items.push(items[0], items[1], items[2], items[3], items[4])
      }
      this.total = totalCount
      this.approvalStatusList = approvalStatusList
      // 财产信息
      const res = await moneyList(user.companyId)
      this.datamoney = res.data
      // if (this.datamoney.balance == null) {
      //   this.balance = 0
      // } else {
      //   this.balance = this.addNumber(String(this.datamoney.balance))
      // }
      // if (this.datamoney.availableAmount == null) {
      //   this.availableAmount = 0
      // } else {
      //   this.availableAmount = this.addNumber(String(this.datamoney.availableAmount))
      // }
      // this.addset(this.balance , this.datamoney.balance)
      if (this.datamoney.balance == 0 ) {
          this.balance = this.addNumber(String(this.datamoney.balance))
        } else {
        const balance = setInterval(() => {
          if (Number(this.end) < Number(this.datamoney.balance)) {
            this.end += Math.floor(Math.random() * 15)
            this.balance = this.addNumber(String(this.end))
          } else {
            return this.end
          }
        }, 1)
        setTimeout(() => {
          clearInterval(balance)
          this.balance = this.addNumber(String(this.datamoney.balance))
        }, 2000)
      }
      if (this.datamoney.availableAmount == 0 ) {
          this.availableAmount = this.addNumber(String(this.datamoney.availableAmount))
        } else {
        const availableAmount = setInterval(() => {
          if (Number(this.end2) < Number(this.datamoney.availableAmount)) {
            this.end2 += Math.floor(Math.random() * 15)
            this.availableAmount = this.addNumber(String(this.end2))
          } else {
            return this.end2
          }
        }, 1)
        setTimeout(() => {
          clearInterval(availableAmount)
          this.availableAmount = this.addNumber(
            String(this.datamoney.availableAmount)
          )
        }, 2000)
      }
      if (this.datamoney.freezeAmount == 0 ) {
        this.freezeAmount = this.addNumber(String(this.datamoney.freezeAmount))
        // const freezeAmount = setInterval(() => {
        // }, 1)
        // setTimeout(() => {
        //   clearInterval(freezeAmount)
        //   this.freezeAmount = this.addNumber(String(this.datamoney.freezeAmount))
        // }, 0)
      } else {
        const freezeAmount = setInterval(() => {
          if (Number(this.end3) < Number(this.datamoney.freezeAmount)) {
            this.end3 += Math.floor(Math.random() * 15)
            this.freezeAmount = this.addNumber(String(this.end3))
          } else {
            return this.end3
          }
        }, 1)
        setTimeout(() => {
          clearInterval(freezeAmount)
          this.freezeAmount = this.addNumber(String(this.datamoney.freezeAmount))
        }, 2000)
      }

      // 银行卡信息
      const { data } = await defaultList(user.companyId)
      this.defaultdata = data // accountSplice
      this.accountSplice = data.accountNumber
        ? data.accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
        : ''
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    this.dataForm.remittanceDate = new Date(
      this.dataForm.remittanceDate
    ).getTime()
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
          ? this.dataForm
          : {
              id: this.id,
              ...this.dataForm
            }
        const title = '添加'
        try {
          const res = await add(query)
          toast('添加成功')
          this.dataForm = {}
          // this.seach()
          history.go(0)
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  // 查看图片
  onView(url: string) {
    this.viewerImage = url
    this.viewerShow = true
  }

  @Watch('dataForms', { deep: true })
  watchdataForms(val: any[]) {
    this.dataForm.receipts = val.map(it => it.fileId)
  }

  @Watch('dataForm', { deep: true })
  watchdataForm(val: any[]) {
    if (this.dataForm.remark.length > 50) {
      alert(this.dataForm.remark)
      this.dataForm.remark = String(this.dataForm.remark).slice(0, 50)
      info('备注不可大于50字')
      return
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.as {
  background: rgba(255, 255, 255, 0);
}
.page {
  height: 100%;
  font-size: 14px;
  .ivu-select {
    width: auto;
    margin-left: 25px;
    /deep/ .ivu-select-selection {
      height: 40px;
      /deep/ .ivu-select-input {
        height: 40px;
        width: 400px;
        margin-bottom: 30px;
      }
    }
    /deep/ .ivu-select-dropdown {
      /deep/ li,
      /deep/ .ivu-select-loading {
        line-height: 35px;
        height: 35px;
      }
      /deep/ .ivu-select-item {
        line-height: 25px;
        height: 35px;
      }
    }
  }
  .table-box {
    div {
      display: inline-block;
    }
    background: rgba(32, 67, 80, 1);
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 14px;
    width: 98%;
    margin-left: 1%;
    border-radius: 5px 5px 0 0;
  }
  .table-left-title {
    float: left;
    padding-left: 1.2%;
    color: #fff;
    height: 60px;
    line-height: 60px;
  }
  .table-right-title {
    float: right;
    padding-right: 1.2%;
    color: #fff;
    cursor: pointer;
  }
  .userTitle {
    font-size: 24px;
    font-weight: 500;
    color: rgba(0, 32, 45, 1);
    height: 60px;
    line-height: 60px;
    padding-left: 1%;
  }
  .zhc {
    background: rgba(5, 38, 51, 1);
    border-radius: 5px 5px 0 0;
    margin: 10px 1% 0 1%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #fff;
  }
  .tableTotal {
    padding: 0 30px 20px;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  .tables {
    margin-left: 1%;
    margin-right: 1%;
    /deep/ .status-3 {
      color: red;
    }
    /deep/ .status-1 {
      color: #19be6b;
    }
    /deep/ .aptitude-status-2 {
      color: #000;
    }
    /deep/ .aptitude-status-4 {
      color: #ed4014;
    }
    /deep/ .ivu-table-cell > span:only-child:empty {
      &::before {
        content: '-';
      }
    }
  }
  .fince-list-item {
    background: rgba(19, 63, 78, 1);
    margin: 0 1% 0 1%;
    padding-top: 2%;
  }
  .fince-list {
    .fince-list-big {
      width: 32%;
      display: inline-block;
      height: 160px;
      background: rgba(6, 46, 65, 1);
      border-radius: 2px;
      margin-left: 1%;
      margin-bottom: 12px;
      .fince-list-acc {
        width: 100%;
        font-size: 36px;
        font-weight: 400;
        color: rgba(255, 110, 110, 1);
        line-height: 36px;
        text-align: center;
        margin-top: 35px;
      }
      .fince-list-accd {
        width: 100%;
        font-size: 36px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 36px;
        text-align: center;
        margin-top: 35px;
      }
      .fince-list-sm {
        width: 100%;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        line-height: 14px;
        text-align: center;
        margin-top: 40px;
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
  .inp-style-center {
    width: 105%;
  }
  .inp-style-tex {
    width: 98.5%;
  }
  .hui-div {
    width: 83%;
    height: 225px;
    background: url('./../images/bank.png');
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
      margin-top: 12px;
    }
    .sma2 {
      width: 100%;
      text-align: right;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: #222;
      line-height: 12px;
      margin-top: 10px;
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
      margin-top: 12px;
    }
    .sma5 {
      width: 100%;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(34, 34, 34, 1);
      line-height: 12px;
      margin-top: 47px;
    }
    .sma6 {
      display: block;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 12px;
      margin-top: 12px;
    }
  }
  /deep/ .ivu-input {
    height: 40px;
  }
  /deep/ .inp-style-tex .ivu-input {
    height: 100px;
  }
  .btnq {
    margin-top: 35px;
    padding-bottom: 50px;
  }
}
.but {
  width: 200px;
  height: 50px;
  background: rgba(249, 216, 94, 1);
  border-radius: 25px;
  border: 0;
  color: rgba(0, 32, 45, 1);
  font-size: 18px;
}
.is {
  color: rgba(179, 188, 192, 1);
  position: absolute;
  top: 80%;
  left: 18%;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px !important;
  color: rgba(179, 188, 192, 1);
}
/deep/ .ivu-table th, /deep/ .ivu-table-header {
  background: rgba(0, 32, 45, 0.8);
  height: 40px;
  line-height: 40px;
  color: rgba(179, 188, 192, 1);
  font-size: 14px;
  font-weight: 400;
}
/deep/ .ivu-table td {
  background: rgba(32, 67, 80, 1);
  transition: background-color 0.2s ease-in-out;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  height: 50px;
  line-height: 50px;
}
/deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table-body {
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table-tip {
  overflow-x: auto;
  overflow-y: hidden;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-select-selection {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-select-input {
  margin-top: 3px;
}
/deep/ .ivu-input {
  border-radius: 5px 5px  5px 5px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .upload-box {
  width: 400px;
  height: 225px;
  border-radius: 2px;
  border: 1px solid rgba(204, 204, 204, 1);
}
/deep/ .upload-add {
  position: relative;
  user-select: none;
  margin-top: 100px;
  margin-left: 155px;
}
/deep/ .ivu-table-wrapper {
  margin: 0;
  border: none;
}
/deep/ .btnCenter {
  text-align: center;
  height: 100px;
  background: rgba(32, 67, 80, 1);
  margin: 0 20px 0 20px;
  line-height: 100px;
  color: #fff;
}
/deep/ .ivu-page-prev {
  border: 0;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-page-next {
  border: 0;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-page-item-active {
  border-color: #eee;
  background: #eee !important;
  border-radius: 50%;
  color: #fff;
  width: 30px;
  height: 30px;
}
/deep/ .ivu-page-item {
  border: 0;
  display: inline-block;
  vertical-align: middle;
  background: rgba(32, 67, 80, 1);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-right: 4px;
  text-align: center;
  list-style: none;
  user-select: none;
  cursor: pointer;
  font-weight: 500;
  transition: border 0.2s ease-in-out, color 0.2s ease-in-out;
}
</style>
