<template>
  <div class="page home-bg">
    <div class="layout-title nav-top-title">资金账单</div>
    <Form :model="form" label-position="left" class="edit-input" :label-width="100">
      <FormItem label="账单类型" class="item-top">
        <RadioGroup v-model="form.transactionType" class="radio-item-type" @on-change="tableList">
            <Radio label="-1" >全部</Radio>
            <Radio :label="item.key"  :key="item.key" v-for="item in billTypeList" v-if="item.key != 6">{{item.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="账单日期">
        <DatePicker type="daterange" v-model="beginDate" @on-change="handleChange" 
        placement="bottom-end" placeholder="请选择开始日期和结束日期" ></DatePicker>
        <Button class="search" @click="searchTableList">查询</Button>
      </FormItem>
    </Form>
    <Table stripe :columns="columns" :data="dataList">
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
  margin-left: 30px;
  background: @c-button;
}
.radio-item-type {
  font-size: 14px;
  margin-top: 4px;
  .ivu-radio-wrapper {
    font-size: 14px;
    margin-right: 35px;
  }
}
</style>


