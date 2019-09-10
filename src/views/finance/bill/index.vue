<template>
  <div class="page as">
    <div style='color: #00202D' class="layout-title nav-top-title">资金账单</div>

    <Form :model="form" label-position="left" class="edit-input" :label-width="100">
      <FormItem label="账单日期">
        <DatePicker type="daterange" v-model="billDate" placement="bottom-end" placeholder="请选择开始日期和结束日期" ></DatePicker>
        <Button class="search bl" @click="searchTableList">查询</Button>
      </FormItem>
      <FormItem label="账单类型" class="item-top">
        <div @click="form.transactionType = item.key" :class="['tag', {activeClass: item.key == form.transactionType}]"
         v-for="item in billTypeList" :key="item.key">{{item.text}}</div>
      </FormItem>
    </Form>

    <Table  :columns="columns" :data="dataList">
      <template slot="transactionType" slot-scope="{row: {transactionType}, index}">
        <span v-if="[3,5,7].includes(transactionType)">消费</span>
        <span v-if="transactionType == 1">充值</span>
        <span v-if="transactionType == 8">提现</span>
        <span v-if="transactionType == 4">退费</span>
      </template>
    </Table>
    <Page  :total="total"  class="btn-center-footer page-list" :current="pageIndex" 
      :page-size="pageSize" show-total @on-change="handlepageChange"  @on-page-size-change="handlepageChange"/>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { bill } from '@/api/bill'
import { formatValidDate, formatValidDateTime } from '@/util/dealData'
import { formatNumber } from '@/util/validateRules'

@Component
export default class Index extends ViewBase {
  pageIndex = 1
  pageSize = 20
  total = 0

  billDate = []
  form: any = {
    transactionType: '-1',
  }

  billTypeList = [
    {text: '全部', key: -1},
    {text: '充值', key: 1},
    {text: '提现', key: 8},
    {text: '消费', key: 3}, // 3，5，7
    {text: '退费', key: 4},
  ]

  dataList = []
  columns = [
    { title: '账单ID', key: 'id'},
    { title: '交易时间', key: 'transactionTime'},
    { title: '费用/元', key: 'transactionAmount'},
    { title: '类型', slot: 'transactionType'},
    { title: '交易说明', key: 'remark'},
  ]

  async tableList() {
   const transType = this.form.transactionType
   const transactionType = transType > 0 && transType != 3 ? transType : null
   const transactionTypes = transType == 3 ? '3,5,7' : null

   const { data }  = await bill({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      ...this.form,
      transactionType,
      transactionTypes
   })
   this.dataList = (data.items || []).map((it: any) => {
      return {
       ...it,
       transactionTime: formatValidDateTime(it.transactionTime),
       transactionAmount: formatNumber(it.transactionAmount),
       remark: it.remark || '/'
      }
   })
   this.total = data.totalCount || 0
  }

  searchTableList() {
    this.pageIndex = 1
    this.tableList()
  }

  handlepageChange(size: any) {
   this.pageIndex = size
   this.tableList()
  }

  @Watch('billDate')
  watchBillDate(val: any) {
   this.form.beginDate = formatValidDate(val[0], {format: 'YYYYMMDD', blank: ''})
   this.form.endDate = formatValidDate(val[1], {format: 'YYYYMMDD', blank: ''})
   this.searchTableList()
  }

  @Watch('form.transactionType')
  watchTransType() {
   this.tableList()
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/common.less';
.item-top {
  padding-top: 20px;
}
.tag {
  box-sizing: content-box;
  text-align: center;
  margin-right: 30px;
  width: 100px;
  height: 38px;
  line-height: 38px;
  color: #00202d;
  font-size: 14px;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
}
.activeClass {
  color: #fff;
  background: #00202d;
  border-radius: 4px;
  border: 1px solid #00202d;
  position: relative;
  &::after {
    content: '\2713';
    color: #fff;
    position: absolute;
    right: -8px;
    top: -8px;
    border: 1px solid #00202d;
    background: #00202d;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    text-align: center;
    line-height: 16px;
  }
}
.as {
  background: rgba(255, 255, 255, 0);
}
.nav-top-title {
  color: #fff;
  background: rgba(255, 255, 255, 0);
  font-size: 24px;
  height: 60px;
}
.page-list {
  margin: 40px 0 100px;
}
.ivu-form-item {
  padding-left: 30px;
  color: @c-text;
}
/deep/ .ivu-input-icon {
  line-height: 40px;
  height: 40px;
}
.search {
  width: 140px;
  height: 40px;
  border-radius: 2px;
  color: #fff;
  background: @c-button;
  text-align: center;
  line-height: 40px;
}
.radio-item-type {
  font-size: 14px;
  margin-top: 4px;
  .ivu-radio-wrapper {
    font-size: 14px;
    margin-right: 35px;
    width: 100px;
  }
}
.bl {
  width: 60px;
  height: 40px;
  background: rgba(0, 32, 45, 0.8);
  border-radius: 0 5px 5px 0;
  border: 0;
  padding: 0;
}
/deep/ .ivu-select-input {
  margin-top: 3px;
  color: #00202d;
  &::-webkit-input-placeholder {
    color: #00202d;
  }
}
/deep/ .ivu-input {
  border-radius: 5px 0 0 5px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 1);
  &::-webkit-input-placeholder {
    color: #00202d;
  }
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
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
/deep/ .btn-center-footer {
  text-align: center;
  height: 100px;
  // background: rgba(32, 67, 80, 1);
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
  a {
    color: #fff;
  }
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
/deep/ .ivu-input-prefix i {
  font-size: 17px;
  line-height: 32px;
  color: #808695;
  margin-top: 5px;
}
/deep/ .ivu-input-suffix i {
  font-size: 17px;
  line-height: 32px;
  color: #808695;
  margin-top: 4px;
}
</style>


