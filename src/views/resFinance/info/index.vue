<template>
  <div class="home-bg">
    <h2 class="layout-nav-title">财务信息</h2>
    <h3 class="userTitle">
      <span>账户总览</span>
      <em class="addUser" @click="withdraw">
        <Icon type="ios-add" size="27"/>提现
      </em>
    </h3>
    <Row class="item-bill-list" type="flex" justify="space-between">
      <Col span="7" class="item-col">
        <h6>{{accountMoney.totalRevenue}}</h6>
        <p>总收益/元</p>
        <p>截止日期：xxxx</p>
      </Col>
      <Col span="7" class="item-col">
        <h6>{{accountMoney.balance}}</h6>
        <p>账户余额/元</p>
      </Col>
      <Col span="7" class="item-col">
        <h6>{{accountMoney.totalCashWithdrawal}}</h6>
        <p>总提现金额/元</p>
      </Col>
    </Row>
    <h3 class="layout-title">线下提现记录</h3>
    <Table stripe :columns="columns" :data="dataList"></Table>
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
    <queryVoucher v-model="tableImgs" v-if ="tableImgs.visible"></queryVoucher>
  </div>
</template>
<script lang="tsx">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import { formatTimes } from '@/util/validateRules'
import { resInfo } from '@/api/resourceBill'
import queryVoucher from '@/views/resFinance/info/voucherDlg.vue'

@Component({
  components: {
    queryVoucher
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
  columns = [
    { title: '提现时间', key: 'withdrawalTimeName' },
    { title: '项目', key: 'type' },
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
@import '~@/site/lib.less';
.userTitle {
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: @c-head-bg;
  .addUser {
    width: 140px;
    height: 40px;
    line-height: 40px;
    display: block;
    text-align: center;
    color: #fff;
    cursor: pointer;
    background: @c-res-btn;
  }
}
.item-bill-list {
  padding: 0 20px 20px;
  .item-col {
    background: #ecf5ff;
    height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h6 {
      font-size: 36px;
      font-weight: normal;
      color: @c-res-btn;
    }
  }
}
.info-page {
  text-align: center;
  padding: 20px 0;
}
</style>

