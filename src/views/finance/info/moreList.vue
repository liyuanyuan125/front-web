<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <Button type="default" icon="md-return-left" @click="goback">返回</Button>
      <!-- <span class="nav-top-title">财务信息</span> -->
    </h3>
    <div class="flex-box">
      <!-- {{query}} -->
      <form class="form flex-1" @submit.prevent="seach">
        <Select v-model="dataForm.status" placeholder="启用状态" clearable>
          <Option v-for="it in approvalStatusList" :key="it.key" :value="it.key"
            :label="it.text">{{it.text}}</Option>
        </Select>
        <Button type="warning" @click="seach" class="btn-reset"><Icon type="ios-search" size="18"/>搜索</Button>
      </form>
    </div>
    <!-- <div class="table-box">
      <div class="table-left-title">最近充值记录</div>
      <router-link :to="{path:'/finance/info/more' , params: {companyId: userList.companyId,}}" tag="div" class="table-right-title">查看更多</router-link>
    </div> -->
    <div class='total'>当前共有记录{{total}}条</div>
    <Table ref="selection" stripe class="tables" :loading="tableLoading" :columns="columns4" :data="tableData"></Table>
    <Page :total="total" v-if="total>0" class="btnCenter"
      :current="dataForm.pageIndex"
      :page-size="dataForm.pageSize"
      :page-size-opts="[10, 20, 50, 100]"
      show-total
      show-sizer
      show-elevator
      @on-change="sizeChangeHandle"
      @on-page-size-change="currentChangeHandle"/>
      <Modal v-model="viewerShow" title="查看图片" width="500" height='500'>
        <img style='width: 100%;' :src=viewerImage alt="" sizes="" srcset="">
    </Modal>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { queryList } from '@/api/financeinfo'
// import { queryList } from '@/api/asd'
// import { clean } from '@/fn/object'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'

// 获取当前登录用户信息
const user: any = getUser()!

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm'

@Component
export default class Main extends ViewBase {
//   user : any = getUser()
  dataForm = {
    companyId: user.companyId,
    status: null,
    pageIndex: 1,
    pageSize: 10,
  }
  total = 0
  items: any = []
  loading = false
  tableLoading = false
  options: any = []
  userList: any = {}
  // 状态列表
  approvalStatusList: any = []

  // 查看图片
  viewerShow = false
  viewerImage = ''

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
    this.userList = user
    this.seach()
  }


  // 每页数
  sizeChangeHandle(val: any) {
    this.dataForm.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.dataForm.pageSize = val
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

    // 查看图片
  onView(url: string) {
    // console.log(url)
    this.viewerImage = url
    this.viewerShow = true
  }

  goback() {
    this.$router.go(-1)
  }


  async seach() {
    this.tableLoading = true
    try {
      const query = { ...this.dataForm }
      const {
        data: {
          items,
          totalCount,
          approvalStatusList
        }
      } = await queryList(clean({...query}))
    //   console.log(items.length)
      // if (items.length <= 5 ) {
        this.items = items
      // } else {
        // return
      // }
      this.total = totalCount
      this.approvalStatusList = approvalStatusList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
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
    /deep/ .ivu-select-placeholder {
      line-height: 37px;
    }
    /deep/ .ivu-select-selected-value {
      line-height: 37px;
    }
    /deep/ .ivu-select-selection {
      height: 40px;
      width: 200px;
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
  /deep/ .ivu-btn-default {
    border: 0;
    color: #222;
  }
  .flex-box {
    span {
      display: block;
      height: 40px;
      width: 60px;
      color: #fff;
      text-align: center;
      padding-top: 8px;
      background: @c-button;
    }
  }
  .total {
    padding-left: 2%;
    padding-top: 2%;
    margin-bottom: -1.5%;
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
        color: rgba(254, 129, 53, 1);
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
    border: 1px solid rgba(210, 210, 210, 1);
    border-radius: 2px;
  }
  .inp-style-center {
    width: 95%;
    border: 1px solid rgba(210, 210, 210, 1);
    border-radius: 2px;
  }
  .inp-style-tex {
    width: 98.5%;
    border: 1px solid rgba(210, 210, 210, 1);
    border-radius: 2px;
  }
  /deep/ .ivu-btn {
    font-size: 14px;
    height: 40px;
  }
}
</style>
