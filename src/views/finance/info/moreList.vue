<template>
  <div class="page home-bg as">
     <!-- <h2 class="layout-nav-title">财务信息 > 充值记录</h2> -->
    <div class="flex-box">
      <form class="form item-top" @submit.prevent="seach">
        <em style='color: #fff;display: inline-block;'>充值状态</em>
        <Select v-model="dataForm.status" placeholder="所有状态" clearable @on-change="seach">
          <Option v-for="it in approvalStatusList" :key="it.key" :value="it.key"
            :label="it.text">{{it.text}}</Option>
        </Select>
        <!-- <Button type="primary" @click="seach" class="button-ok">查询</Button> -->
      </form>
    </div>
    <!-- <div class='tiao'>
      当前共有记录<span style='color:#222'>&nbsp;&nbsp;{{total}}条</span>
      <span style='float: right; margin-right: 2.5%;'>当前结果共项&nbsp;&nbsp;第{{currentsize}}页/共{{dataForm.pageSize}}页</span>
    </div> -->
    <Table ref="selection"  class="tables" :loading="tableLoading" :columns="columns4" :data="tableData"></Table>
    <!-- <Page v-if="total>0" class="btnCenter"
      :current="dataForm.pageIndex"
      :page-size="dataForm.pageSize"
      show-sizer
      show-elevator
      @on-change="sizeChangeHandle"
      @on-page-size-change="currentChangeHandle"/> -->
      <Page
      :total="total"
      v-if="total>0"
      class="btnCenter"
      :current="dataForm.pageIndex"
      :page-size="dataForm.pageSize"
      show-total
      show-elevator
      @on-change="sizeChangeHandle"
      @on-page-size-change="currentChangeHandle"
    />
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
const timeFormat = 'YYYY-MM-DD'

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

  currentsize = 1

  columns4 = [
    { title: '充值ID', key: 'id', align: 'center' , width: 70},
    {
      title: '申请时间',
      key: 'applyTime',
      align: 'center',
      width: 120,
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
      align: 'center',
      width: 90,
      render: (hh: any, { row: { accountNumber } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = String(accountNumber).substring(String(accountNumber).length - 4)
        return accountNumber == null ? (
          <span class="datetime" v-html="-" />
        ) : (
          <span class="datetime" v-html={'****' + html} />
        )
        /* tslint:enable */
      }
    },
    {
      title: '汇款人姓名',
      key: 'accountName',
      align: 'center',
      width: 115,
    },
    {
      title: '汇款时间',
      key: 'remittanceDate',
      width: 120,
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
      align: 'center',
      width: 120,
    },
    {
      title: '充值金额/元',
      key: 'amount',
      align: 'center',
      width: 125,
    },
    {
      title: '备注',
      key: 'remark',
      align: 'center',
      render: (hh: any, { row: { remark } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html1 = String(remark).slice(0, 4) + '...'
        if (String(remark).length >= 4) {
          return (
            <div>
              <tooltip max-width="200" transfer content={remark} placement="top">
                <span class="bei" v-html={html1} />
              </tooltip>
            </div>
          )
        } else {
          return (
              <span class="bei" v-html={remark} />
          )
        }
        /* tslint:enable */
      }
    },
    {
      title: '汇款凭证',
      align: 'center',
      width: 100,
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
            查看
          </a>
        )
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      key: 'statusText',
      width: 90,
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
    // console.log(val)
    this.currentsize = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    // console.log(val)
    this.dataForm.pageSize = val
    this.seach()
  }
  search() {
    // console.log(123)
    this.dataForm.pageIndex = 1
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
.as {
  background: rgba(255, 255, 255, 0);
}
.tiao {
  width: 100%;
  line-height: 31px;
  padding-left: 20px;
  padding-top: 20px;
  // font-weight: bold;
}
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
      width: 300px;
      margin-right: 30px;
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
  /deep/ .item-top {
    padding-left: 20px;
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
/deep/ .ivu-table-cell {
  padding-left: 0;
  padding-right: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  box-sizing: border-box;
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
/deep/ .ivu-table-wrapper {
  margin: 0;
  border: none;
}
/deep/ .ivu-table-tip {
  overflow-x: auto;
  overflow-y: hidden;
  background: rgba(32, 67, 80, 1);
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
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
</style>
