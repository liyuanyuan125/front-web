<template>
  <div class="page home-bg as">
    <div class="layout-title nav-top-title">资金账单</div>
    <Form :model="form" label-position="left" class="edit-input" :label-width="100">
      <FormItem label="账单日期">
        <DatePicker type="daterange" v-model="beginDate" @on-change="handleChange" 
        placement="bottom-end" placeholder="请选择开始日期和结束日期" ></DatePicker>
        <Button class="search bl" @click="searchTableList">查询</Button>
      </FormItem>
      <FormItem label="账单类型" class="item-top">
        <!-- <RadioGroup v-model="form.transactionType" class="radio-item-type" @on-change="tableList">
            <Radio label="-1" >全部</Radio>
            <Radio :label="item.key"  :key="item.key" v-for="item in billTypeList" v-if="item.key != 6">{{item.text}}</Radio>
        </RadioGroup> -->
        <div @click="active(-1)" :class="['tag', invalue == -1 ? 'activeClass' : '']">
        全部
      </div>
        <div @click="active(item.key)" :class="['tag', invalue == item.key ? 'activeClass' : '']" v-for="item in billTypeList" :key="item.key" v-if="item.key != 6">
        {{item.text}}
      </div>
      </FormItem>
    </Form>
    <Table  :columns="columns" :data="dataList">
      <template slot-scope="{row, index}" slot="transactionTime">
        <span>{{formatTimes(row.transactionTime)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="transactionAmount">
        <span v-if="row.transactionAmount < 0">{{formatNumber(row.transactionAmount) }}</span>
        <span v-else class="success">{{formatNumber(row.transactionAmount) }}</span>
      </template>
      <template slot-scope="{row, index}" slot="transactionType">
        <span>{{formatTypeList(row.transactionType)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="remark">
        <span v-if="!row.remark">/</span>
        <span v-else>{{row.remark}}</span>
      </template>
    </Table>
    <Page  :total="total"  class="btnCenter page-list" :current="pageIndex" 
      :page-size="pageSize" show-total show-elevator @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"/>
  </div>
</template>
<script lang="ts">
 import { Component } from 'vue-property-decorator'
 import ViewBase from '@/util/ViewBase'
 import { bill } from '@/api/bill'
 import { formatTimestamp, formatTimes, formatNumber } from '@/util/validateRules'

 @Component
 export default class Index extends ViewBase {
   pageIndex = 1
   pageSize = 10
   total = 0
   invalue = -1

   beginDate = []
   form: any = {
     transactionType: '-1'
   }

   billTypeList = []
   formatTimes: any = ''

   dataList = []
   columns = [
     { title: '账单ID', key: 'id'},
     { title: '交易时间', slot: 'transactionTime'},
     { title: '费用/元', slot: 'transactionAmount'},
     { title: '类型', slot: 'transactionType'},
     { title: '交易说明', slot: 'remark'},
   ]
   formatNumber = formatNumber

   async mounted() {
     this.formatTimes = formatTimes
     this.tableList()
   }

   active(id: any) {
    this.invalue = id
    this.form.transactionType = id
    this.tableList()
   }

   async tableList() {
     let types: any = ''
     if (this.form.transactionType < 0) {
       types = null
     } else {
       types = this.form.transactionType
     }
     const { data }  = await bill({
       pageIndex: this.pageIndex,
       pageSize: this.pageSize,
       ...this.form,
       transactionType: types,
       beginDate: formatTimestamp(this.beginDate[0]),
       endDate: formatTimestamp(this.beginDate[1])
     })
     this.dataList = data.items
     this.billTypeList = data.transactionTypeList
     this.total = data.totalCount
   }
   searchTableList() {
     this.pageIndex = 1
     this.tableList()
   }
   formatTypeList(id: any) {
     const list: any = this.billTypeList
     for (let i = 0; list.length; i++) {
       if (list[i].key == id) {
         return list[i].text
       }
     }
   }
   handleChange(data: any) {
     this.beginDate = data
   }
   handlepageChange(size: any) {
    this.pageIndex = size
    this.tableList()
  }
   handlePageSize(size: any) {
    this.pageIndex = size
    this.tableList()
  }
 }

</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
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
.success {
  color: @c-done;
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
/deep/ .ivu-input {
  border-radius: 5px 0 0 5px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 1);
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
/deep/ .ivu-form .ivu-form-item-label {
  color: #fff;
}
/deep/ .ivu-table-wrapper {
  margin: 30px 20px 0;
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


