<template>
  <div class="home-bg as">
    <!-- <h2 class="layout-nav-title">财务信息</h2> -->
    <h3 class="userTitle">
      <span>账户总览</span>
      <em class="addUser" @click="withdraw">
        <Icon type="ios-add" size="27"/>提现
      </em>
    </h3>
    <Row class="item-bill-list" type="flex" justify="space-between" 
    v-auth="'financeManage.info#viewSummary'">
      <Col span="7" class="item-col" style='background:rgba(214,86,91,0.5);border:2px solid rgba(255,143,147,1);'>
        <p class='zong'>总收益 / 元</p>
        <h6 style='margin-top: 30px;'>￥<Number :addNum='accountMoney.totalRevenue'></Number></h6>
        <!-- <p>截止日期：{{getYear}}</p> -->
        <Tooltip :content="'截止日期：' + getYear" style='top: 35px;left: 116px;' placement="bottom-start">
            <p class='wenhao'>?</p>
        </Tooltip>
      </Col>
      <Col span="7" class="item-col">
        <p class='zong'>账户余额 / 元</p>
        <h6 style='margin-top: 30px;'>￥<Number :addNum='accountMoney.balance'></Number></h6>
      </Col>
      <Col span="7" class="item-col" style='background:rgba(40,167,182,0.33);border:2px solid rgba(45,212,232,1);'>
        <p class='zong'>总提现金额 / 元</p>
        <h6 style='margin-top: 30px;'>￥<Number :addNum='accountMoney.totalCashWithdrawal'></Number></h6>
      </Col>
    </Row>
    <div v-auth="'financeManage.info#viewlist'">
      <h3 class="layout-title tiok">线下提现记录</h3>
      <Table :columns="columns" :data="dataList">
        <template  slot="type" slot-scope="{row, index}">
          <span v-for="item in typeList" v-if="item.key == row.type">{{item.text}}</span>
        </template>
      </Table>
      <Page
        class="info-page"
        :total="total"
        :current="pageIndex"
        :page-size="pageSize"
        show-total
        show-elevator
        @on-change="handlepageChange"
        @on-page-size-change="handlePageSize"
      ></Page>
    </div>
    <queryVoucher v-model="tableImgs" v-if="tableImgs.visible"></queryVoucher>
  </div>
</template>
<script lang="tsx">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import { formatTimes } from '@/util/validateRules'
import { resInfo } from '@/api/resourceBill'
import queryVoucher from '@/views/resFinance/info/voucherDlg.vue'
import Number from '@/components/number.vue'


@Component({
  components: {
    queryVoucher,
    Number
  }
})
export default class Info extends ViewBase {
  dataList = []
  accountMoney = {}
  total = 0
  pageIndex = 1
  pageSize = 10

  tableImgs: any = {
    visible: false
  }

  typeList = []

  get getYear() {
    const myDate: string = new Date().toLocaleDateString()
    return myDate.split('/').join('-')
  }

  columns = [
    { title: '提现时间', key: 'withdrawalTimeName' },
    { title: '项目', slot: 'type' },
    { title: '提现金额/元', key: 'amount' },
    { title: '实时账户余额/元', key: 'afterWithdrawalAmount' },
    {
      title: '汇款凭证',
      key: 'imgList',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return (
          <div>
            <a on-click={this.queryImg.bind(this, row.imgList)}>查看凭证</a>
          </div>
        )
        /* tslint:disable */
      }
    },
    {
      title: '备注',
      key: 'remark',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (!row.remark) {
          return <a>/</a>
        } else {
          return <a>{row.remark}</a>
        }
        /* tslint:disable */
      }
    }
  ]

  async mounted() { 
    const { data } = await resInfo({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    })
    this.dataList = data.items || []
    this.accountMoney = data.account != null ? data.account : {}
    this.total = data.totalCount
    this.typeList = data.typeList || []
    // 毫秒转时间戳
    if (data.items) {
      data.items.map((item: any) => {
        item.withdrawalTimeName = formatTimes(item.withdrawalTime)
      })
    }
  }
  withdraw() {
    this.showWaring(
      '您好，目前暂时不支持线上提现，请联系对接商务进行线下提现，感谢您的合作。'
    )
  }
  queryImg(list: any) {
    this.tableImgs = {
      visible: true,
      imglist: list
    }
  }
  handlepageChange(val: any) {
    this.pageIndex = val
  }
  handlePageSize(val: any) {
    this.pageIndex = val
  }
}
</script>
<style lang="less" scoped>
// @import '~@/site/lib.less';
// @import '~@/views/brand/less/common.less';
// @import '~@/views/kol/less/common.less';
@import '~@/views/account/less/common.less';
.as {
  background: rgba(255, 255, 255, 0);
}
.tiok {
  background: rgba(255, 255, 255, 0);
  font-size: 24px;
  color: #fff;
  font-weight: 500;
}
.zong {
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  padding-left: 20px;
  margin-top: -20px;
}
.wenhao {
  width: 18px;
  height: 18px;
  border: 1px solid #eee;
  font-weight: 400;
  background: #eee;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  line-height: 18px;
  border-radius: 50%;
  position: absolute;
  left: 29%;
  top: 11%;
}
.userTitle {
  font-size: 24px;
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-weight: 500;
  color: #fff;
  .addUser {
    line-height: 40px;
    display: block;
    text-align: center;
    cursor: pointer;
    width: 160px;
    height: 40px;
    background: rgba(249, 216, 94, 1);
    border-radius: 20px;
    color: rgba(0, 32, 45, 1);
    font-size: 20px;
  }
}
.item-bill-list {
  padding: 0 20px 20px;
  .item-col {
    background: rgba(239, 204, 74, 0.5);
    border: 2px solid rgba(255, 222, 99, 1);
    height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h6 {
      font-size: 36px;
      font-weight: normal;
      color: #fff;
    }
  }
}
.info-page {
  text-align: center;
  padding: 20px 0;
  margin: 0 20px;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table th, /deep/ .ivu-table-header {
  background: rgba(0, 32, 45, 0.8);
  height: 60px;
  line-height: 60px;
  color: rgba(179, 188, 192, 1);
  font-size: 14px;
  font-weight: 400;
}
/deep/ .ivu-table td {
  background: rgba(32, 67, 80, 1);
  transition: background-color 0.2s ease-in-out;
  font-size: 14px;
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
/deep/ .ivu-table-wrapper {
  margin: 30px 20px 0;
  border: none;
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
/deep/ .btn-center-footer {
  text-align: center;
  height: 100px;
  background: rgba(32, 67, 80, 1);
  line-height: 100px;
  color: #fff;
}
/deep/ .theme-resource tr.ivu-table-row-hover td {
  background: rgba(32, 67, 80, 1) !important;
}
/deep/ .ivu-tooltip-rel {
  display: inline-block;
  width: inherit;
  position: absolute;
  left: 33%;
  top: 11%;
}
/deep/ .ivu-page-total, /deep/ .ivu-page-options-elevator {
  color: #fff;
}
</style>

