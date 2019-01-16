<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">财务信息</span>
    </h3>
    <div class='fince'>
      <h3 class="userTitle">
        <span style='color:#222222;' class="nav-top-title">账户总览</span>
      </h3>
      <!-- {{datamoney}} -->
      <div class='fince-list'>
          <div class='fince-list-big'>
            <!-- <div class='fince-list-acc'>{{datamoney.balance}}</div> -->
            <div class='fince-list-acc count-to-count-text count-style'>53200.00</div>
            <p class='fince-list-sm'>账户余额/元</p>
          </div>
          <div class='fince-list-big'>
            <!-- <div class='fince-list-acc'>{{datamoney.availableAmount}}</div> -->
            <div class='fince-list-acc'>53200.00</div>
            <p class='fince-list-sm'>可用金额/元</p>
          </div>
          <div class='fince-list-big'>
            <!-- <div class='fince-list-accd'>{{datamoney.freezeAmount}}</div> -->
            <div class='fince-list-accd'>53200.00</div>
            <p class='fince-list-sm'>冻结金额/元</p>
          </div>
      </div>
    </div>
    <div class="table-box">
      <div class="table-left-title">最近充值记录</div>
      <router-link :to="{path:'/finance/info/more' , params: {companyId: userList.companyId,}}" tag="div" class="table-right-title">查看更多</router-link>
      <!-- <div class="table-right-title">查看更多</div> -->
    </div>
    <Table ref="selection" stripe class="tables" :loading="tableLoading" :columns="columns4" :data="tableData"></Table>
    <!-- <Page :total="total" v-if="total>0" class="btnCenter"
      :current="dataForm.pageIndex"
      :page-size="dataForm.pageSize"
      :page-size-opts="[10, 20, 50, 100]"
      show-total
      show-sizer
      show-elevator
      @on-change="sizeChangeHandle"
      @on-page-size-change="currentChangeHandle"/> -->
    <div class='finceadd'>
      <h3 class="userTitle">
        <span style='color:#222222;' class="nav-top-title">账户充值</span>
      </h3>
      <div class='fince-list'>
        <Form  :model='dataForm' :label-width='88' :rules='rules' label-position="left" class='form page' ref='dataForm'>
            <Row class='add-row'>
              <Col span="12">
                <FormItem label="汇款信息">
                  <div class='hui-div'>
                    <div>
                        <p class='sma1'>{{defaultdata.accountBank}}</p>
                        <p class='sma2'>开户银行</p>
                    </div>
                    <div>
                        <p class='sma3'>开户账号</p>
                        <div class='sma4'>{{defaultdata.accountNumber.slice(0, 4)}}&nbsp;&nbsp;{{defaultdata.accountNumber.slice(4, 8)}}&nbsp;&nbsp;{{defaultdata.accountNumber.slice(8, 12)}}&nbsp;&nbsp;{{defaultdata.accountNumber.slice(12, 16)}}</div>
                    </div>
                    <div>
                        <p class='sma5'>开户名称</p>
                        <p class='sma6'>{{defaultdata.accountName}}</p>
                    </div>
                  </div>
                </FormItem>
              </Col>
              <Col span='12'>
                <FormItem label="汇款底单" prop='receipts'>
                <Upload v-model="dataForm.receipts" multiple :maxCount="1" accept="image/*"/>
                  <!-- <Input class='inp-style' placeholder="请输入充值金额"/> -->
                </FormItem>
              </Col>
            </Row>
            <Row class='add-row'>
              <Col span="12">
                <FormItem label="银行账号" prop='accountNumber'>
                  <Input v-model="dataForm.accountNumber" class='inp-style' placeholder="请输入汇款银行账号"/>
                </FormItem>
              </Col>
              <Col span='12'>
                <FormItem label="充值金额" prop='amount'>
                  <Input v-model="dataForm.amount" class='inp-style' placeholder="请输入充值金额"/>
                </FormItem>
              </Col>
            </Row>
            <Row class='add-row'>
              <Col span="8">
                <FormItem label="汇款人姓名" prop='accountName'>
                  <Input v-model="dataForm.accountName" class='inp-style-center' placeholder="请输入汇款人姓名"/>
                </FormItem>
              </Col>
              <Col span='8'>
                <FormItem label="汇款时间">
                  <Date-picker type="date" prop='remittanceDate' v-model="dataForm.remittanceDate"
          on-change="selectTime" placeholder="选择日期" class='inp-style-center'></Date-picker>
                  <!-- <Input v-model="dataForm.remittanceDate" class='inp-style-center' placeholder=""/> -->
                </FormItem>
              </Col>
              <Col span='8'>
                <FormItem label="联系电话" prop='contactPhone'>
                  <Input v-model="dataForm.contactPhone" class='inp-style-center' placeholder="请输入联系人电话号码"/>
                </FormItem>
              </Col>
            </Row>
            <Row class='add-row'>
              <Col span="24">
                <FormItem label="备注" prop='remark'>
                  <Input v-model="dataForm.remark" class='inp-style-tex' type='textarea' placeholder="限50字"/>
                </FormItem>
              </Col>
            </Row>
        </Form>
        <div style="text-align: center">
          <Button type="primary" @click="dataFormSubmit('dataForm')">提交充值申请</Button>
        </div>
      </div>
    </div>
    <Modal v-model="viewerShow" title="查看图片" width="500" height='500'>
      <img style='width: 100%;' :src=viewerImage alt="" sizes="" srcset="">
    </Modal>
  </div>
</template>

<script lang="tsx">
import { Component, Mixins , Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { queryList , moneyList , dataFrom , defaultList , add } from '@/api/financeinfo'
// import { queryList } from '@/api/asd'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import Upload from '@/components/upload/Upload.vue'
import { slice, clean } from '@/fn/object'

// 获取当前登录用户信息
const user: any = getUser()!

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm'

const dataForm = {
  accountNumber: '',
  accountName: '',
  amount: null,
  remittanceDate: null,
  contactPhone: '',
  remark: '',
  receipts : [],
  receipt: '',
  companyId: user.companyId,
  companyName: user.companyName
}

@Component({
  components: {
    Upload
  }
})
export default class Main extends ViewBase {
//   user : any = getUser()
  dataFormget = {
    companyId: user.companyId,
    pageIndex: 1,
    pageSize: 10,
  }
  // dataForm = {
  //   accountNumber: '',
  //   accountName: '',
  //   amount: null,
  //   remittanceDate: null,
  //   contactPhone: '',
  //   remark: '',
  //   receipts : [],
  //   receipt: '',
  //   companyId: user.companyId,
  //   companyName: user.companyName
  // }
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
    accountName: [

    ]
  }

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
        return applyTime == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={html}></span>
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
        return remittanceDate == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={html}></span>
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
      key: 'freceipt',
      align: 'center',
      render: (hh: any, { row: { freceipt } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html1 = String(freceipt).slice(0,10) + '...'
        if (String(freceipt).length >= 10) {
          return <div>
            <span class='datetime' v-html={html1}></span>
          </div>
        } else {
          return <div>
            <span class='datetime' v-html={freceipt}></span>
          </div>
        }
        /* tslint:enable */
      }
    },
    {
      title: '汇款凭证',
      align: 'center',
      render: (hh: any, { row: { mageList } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <a href='javascript:;' on-click={this.onView.bind( mageList.url )} class="operation" >查看汇款凭证</a>
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      key: 'statusText',
      width: 100,
      align: 'center',
      render: (hh: any, { row: { rejectReason , approvalStatus, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (approvalStatus == 1) {
          return <span class={`status-${1}`}>待审核</span>
        } else if (approvalStatus == 2) {
          return <span class={`status-${2}`}>充值通过</span>
        } else if (approvalStatus == 3) {
          return <tooltip content={rejectReason} placement="top">
              <span class={`status-${3}`}>充值拒绝</span>
            </tooltip>
        }
        /* tslint:enable */
      }
    }
  ]


  created() {
    // this.getUser()
    // console.log(user)
    this.userList = user
    this.seach()
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
      approvalStatus: this.approvalStatusList,
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.items || []).map((it: any) => {
      return {
        ...it,
        statusText: it.approvalStatus,
      }
    })
    return list
  }


  async seach() {
    this.tableLoading = true
    try {
      const query = { ...this.dataFormget }
      const {
        data: {
          items,
          totalCount,
          approvalStatusList
        }
      } = await queryList(clean({...query}))
    //   console.log(items.length)
      if (items.length <= 5 ) {
        this.items = items
      } else {
        this.items.push(items[0] , items[1] , items[2] , items[3] , items[4])
      }
      this.total = totalCount
      this.approvalStatusList = approvalStatusList
      // 财产信息
    //   const {
    //     data
    //   } = await moneyList(user.companyId)
    //   this.datamoney = data
    // 银行卡信息
    const { data } = await defaultList(clean({...query}))
    this.defaultdata = data
    // console.log(data)
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
  }



    // 表单提交
  async dataFormSubmit(dataForms: any) {
    // for ( const i in this.companys) {
    //   if (this.dataForm.companyId == this.companys[i].id) {
    //     this.dataForm.companyName = this.companys[i].name
    //   }
    // }
  this.dataForm.remittanceDate = new Date(this.dataForm.remittanceDate).getTime()
  this.dataForm.receipt = this.dataForm.receipts.length > 0 ? this.dataForm.receipts[0].fileId : []
   const myThis: any = this
   myThis.$refs[dataForms].validate( async ( valid: any ) => {
  // debugger
      if (valid) {
        const query = !this.id ? this.dataForm : {
          id: this.id,
          ...this.dataForm
        }
        const title = '添加'
        try {
           const res =  await add (query)
          //  this.$router.push({ name : 'Finance-examine' })
        } catch (ex) {
           this.handleError(ex)
        }
      }
    })
  // const valid = await (this.$refs[dataForms] as any).validate()
  //   if (!valid) {
  //     return
  //   }
  //   try {
  //     // const {oldPassword, newPassword} = this.dataForm
  //     const data = this.dataForm
  //     await add(data)
  //     // toast('密码修改成功')
  //   } catch (ex) {
  //     this.handleError(ex)
  //   }
  }

  // 查看图片
  onView(url: string) {
    // console.log(url)
    this.viewerImage = url
    this.viewerShow = true
  }

  toDetail(id: any) {
    this.$router.push({ name: 'account-cinema-detail', params: {id} })
  }
  @Watch('dataForms', { deep: true })
    watchdataForms(val: any[]) {
    this.dataForm.receipts = val.map(it => it.fileId)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.colBg {
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: @c-head-bg;
}
.page {
  background: #fff;
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
      /deep/ li, /deep/ .ivu-select-loading {
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
    background: rgba(249, 249, 249, 1);
    border-radius: 2px 2px 0  0;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
  }
  .table-left-title {
    float: left;
    padding-left: 1.2%;
    color: #222;
  }
  .table-right-title {
    float: right;
    padding-right: 1.2%;
    color: #2481d7;
    cursor: pointer;
  }
  .userTitle {
    .colBg;
    .addUser {
      width: 140px;
      height: 40px;
      line-height: 40px;
      display: block;
      text-align: center;
      color: #fff;
      cursor: pointer;
      background: @c-button;
    }
  }
  .tableTotal {
    padding: 0 30px 20px;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  .tables {
    margin: 20px;
    /deep/ .status-2,
    /deep/ .aptitude-status-3 {
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
  .fince-list {
    .fince-list-big {
      width: 32%;
      display: inline-block;
      height: 160px;
      background: rgba(255, 248, 242, 1);
      border-radius: 2px;
      margin-left: 1%;
      margin-bottom: 12px;
      .fince-list-acc {
        width: 100%;
        font-size: 36px;
        font-weight: 400;
        color: rgba(254, 129, 53, 1);
        line-height: 36px;
        text-align: center;
        margin-top: 50px;
      }
      .fince-list-accd {
        width: 100%;
        font-size: 36px;
        font-weight: 400;
        color: #222;
        line-height: 36px;
        text-align: center;
        margin-top: 50px;
      }
      .fince-list-sm {
        width: 100%;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        line-height: 14px;
        text-align: center;
        margin-top: 20px;
      }
    }
  }
  .add-row {
    padding-left: 30px;
    padding-right: 40px;
  }
  .inp-style {
    width: 97%;
    border: 0.5px solid rgba(210, 210, 210, 1);
    border-radius: 5px;
  }
  .inp-style-center {
    width: 95%;
    border: 0.5px solid rgba(210, 210, 210, 1);
    border-radius: 5px;
  }
  .inp-style-tex {
    width: 98.5%;
    border: 0.5px solid rgba(210, 210, 210, 1);
    border-radius: 5px;
  }
  .hui-div {
    width: 400px;
    height: 225px;
    // background: linear-gradient(131deg, rgba(254, 89, 64, 1) 0%, rgba(253, 150, 68, 1) 100%);
    background: url('./../images/银行卡.png');
    border-radius: 6px;
    padding: 12px 30px;
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
    border-radius: 5px;
  }
}
</style>
