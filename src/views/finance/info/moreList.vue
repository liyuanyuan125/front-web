<template>
  <div class="page home-bg as">
    <div class="flex-box">
      <form class="form item-top" @submit.prevent="seach">
        <em style='color: #fff;display: inline-block;'>充值状态</em>
        <Select v-model="dataForm.status" placeholder="所有状态" clearable @on-change="seach">
          <Option v-for="it in statusList" v-if='it.key != 0' :key="it.key" :value="it.key"
            :label="it.text">{{it.text}}</Option>
        </Select>
      </form>
    </div>
    <Table ref="selection"  class="tables" :loading="tableLoading" :columns="columns4" :data="tableData">
      <template slot="transactionAmount" slot-scope="{row}" >
          {{formatNumber(row.transactionAmount)}}
      </template>
      <template slot="billPayType" slot-scope="{row}" >
          <span v-for='(it , index) in billPayTypeList' :key='index' v-if='row.billPayType == it.key'>{{it.text}}</span>
      </template>
      <template slot="status" slot-scope="{row}" >
          <span v-for='(it , index) in statusList' :key='index' v-if='row.status == it.key'>{{it.text}}</span>
      </template>
    </Table>
      <Page
      :total="total"
      v-if="total>0"
      class="btn-center-footer"
      :current="dataForm.pageIndex"
      :page-size="dataForm.pageSize"
      show-total
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
import { queryList , bills } from '@/api/financeinfo'
// import { queryList } from '@/api/asd'
// import { clean } from '@/fn/object'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { formatNumber } from '@/util/validateRules'

// 获取当前登录用户信息
// const user: any = getUser()!

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD'

@Component
export default class Main extends ViewBase {
  user: any = getUser()
  dataForm = {
    // companyId: this.user.companyId,
    status: null,
    transactionType: 1,
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

  // 支付方式
  billPayTypeList: any =  []
  // 充值状态
  statusList: any = []

  columns4 = [
    { title: '充值ID', key: 'id', align: 'center', width: 70, },
    { title: '充值金额', slot: 'transactionAmount', align: 'center'},
    { title: '支付方式', slot: 'billPayType', align: 'center'},
    { title: '流水单号', key: 'streamNo', align: 'center'},
    {
      title: '汇款时间',
      key: 'remittanceDate',
      width: 120,
      align: 'center',
      render: (hh: any, { row: { remittanceDate } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = String(remittanceDate).slice(0, 4) + '-' + String(remittanceDate).slice(4, 6) + '-' + String(remittanceDate).slice(6, 8)
        return remittanceDate == 0 ? (
          <span class="datetime" v-html="-" />
        ) : (
          <span class="datetime" v-html={html} />
        )
        /* tslint:enable */
      }
    },
    {
      title: '汇款账户名',
      key: 'accountName',
      align: 'center',
    },
    {
      title: '汇款底单',
      align: 'center',
      width: 100,
      render: (hh: any, { row: { receipt } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        // const url = imageList.url
        // console.log(url)
        return (
          <a
            href="javascript:;"
            on-click={this.onView.bind(this , receipt)}
            class="operation">
            查看
          </a>
        )
        /* tslint:enable */
      }
    },
    { title: '状态', slot: 'status', align: 'center', width: 70, },
  ]

  created() {
    this.userList = this.user
    this.seach()
  }

  get formatNumber() {
    return formatNumber
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
          billPayTypeList,
          statusList
        }
      } = await bills(clean({...query}))
    //   console.log(items.length)
      // if (items.length <= 5 ) {
        this.items = items
      // } else {
        // return
      // }
      this.billPayTypeList = billPayTypeList
      this.statusList = statusList
      this.total = totalCount
      // this.approvalStatusList = approvalStatusList
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
/deep/ .btn-center-footer {
  text-align: center;
  height: 100px;
  margin: 0 20px 0 20px;
  line-height: 100px;
  color: #fff;
}
/deep/ .ivu-page-prev {
  border: 0;
  background: rgba(255, 255, 255, 0);
}
/deep/ .ivu-page-next {
  border: 0;
  background: rgba(255, 255, 255, 0);
}
/deep/ .ivu-page-item-active {
  border-color: #eee;
  background: #00202d !important;
  border-radius: 50%;
  color: #fff;
  width: 30px;
  height: 30px;
}
/deep/ .ivu-page-item-active:hover a {
  color: #fff;
}
/deep/ .ivu-page-item-active a {
  color: #fff;
}
/deep/ .ivu-page-item {
  border: 0;
  display: inline-block;
  vertical-align: middle;
  background: rgba(255, 255, 255, 0);
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
/deep/ .ivu-table {
  border-radius: 5px;
}
/deep/ .ivu-form .ivu-form-item-label, /deep/ .ivu-icon-ios-arrow-forward::before, /deep/ .ivu-icon-ios-arrow-back::before {
  color: #00202d;
}
</style>
