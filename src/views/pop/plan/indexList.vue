<template>
  <div class="home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">广告计划</span>
      <em class="addUser">
        <Icon type="ios-add" size="27"/>新建广告计划
      </em>
    </h3>

    <Form :model="form" class="formInline">
      <Row type="flex" justify="space-between">
        <Col span="5">
          <Select v-model="form.status" clearable placeholder="请选择广告计划状态">
            <Option v-for="item in data.statusList" :key="item.key" :value="item.key">{{item.text}}</Option>
          </Select>
        </Col>
        <Col span="5">
          <Select v-model="form.settlementStatus" clearable placeholder="请选择结算状态">
            <Option
              v-for="item in data.settlementStatusList"
              :key="item.key"
              :value="item.key"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col span="5">
          <Select v-model="form.level" clearable placeholder="请选择广告层级">
            <Option
              v-for="item in data.levelTypeList"
              :key="item.key"
              :value="item.key"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col span="7">
          <div class="flex-box">
            <Input v-model="form.query" placeholder="请输入ID/名称进行搜索"/>
            <span class="btn-search-list" @click="searchList">
              <Icon type="ios-search" size="22"/>
            </span>
          </div>
        </Col>
      </Row>
    </Form>

    <Table :columns="columns" :data="tableDate">
        <template slot="createTime" slot-scope="{row, index}">
           <span>{{row.createTime}}</span> 
        </template>
        <template slot="id" slot-scope="{row, index}">
            <span>广告计划ID：{{row.id}}</span>
        </template>
        <template slot="name" slot-scope="{row, index}">
            <span>{{row.name}}</span>
        </template>
    </Table>
    <h4 class="checkAll">
      <span @click="handleSelectAll">
        <Checkbox v-model="checkboxAll"></Checkbox>全选
      </span>
      <span @click="deleteList">批量删除广告计划</span>
    </h4>
    <Page
      :total="totalCount"
      v-if="totalCount>0"
      class="btnCenter"
      :current="pageList.pageIndex"
      :page-size="pageList.pageSize"
      show-total
      show-elevator
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { planList } from '@/api/plan'
import tableExpand from './tableExpand.vue'

@Component({
  components: {
    tableExpand
  }
})
export default class Plan extends ViewBase {
  form = {
    status: '',
    settlementStatus: '',
    level: '',
    query: ''
  }
  pageList = {
    pageIndex: 1,
    pageSize: 10
  }
  totalCount = 2
  data: any = ''
  checkboxAll = false

  columns = [
    {
      type: 'expand',
      className: 'expand-list',
      width: 1,
      render: (h: any, params: any) => {
        return h(tableExpand, {
          props: {
            row: params.row
          }
        })
      }
    },
    { type: 'selection', width: 30 },
    { title: '创建时间', slot: 'createTime', width: 150},
    { title: '广告计划ID', slot: 'id', width: 200},
    { title: '广告计划名称', slot: 'name', minWidth: 300},
  ]
  tableDate = [
    {
      id: '广告计划',
      name: '2019奔驰影院广告－春节档2019奔驰影院广告－春节档哈2019奔驰影院广告－春节档2019奔驰影院广告',
      stauts: '广告计划状态',
      specification: '广告片规格',
      videoId: '广告片ID',
      videoName: '广告片名称/ID',
      cycle: '投放周期',
      freezeAmount: '冻结金额(元）',
      settlementStatus: '结算状态',
      settlementAmount: '广告花费(元）',
      createTime: '创建时间',
      beginDate: '投放排期开始',
      endDate: '投放排期结束',
      _expanded: true
    },
    {
      id: '广告计划',
      name: '广告计划名称',
      stauts: '广告计划状态',
      specification: '广告片规格',
      videoId: '广告片ID',
      videoName: '广告片名称/ID',
      cycle: '投放周期',
      freezeAmount: '冻结金额(元）',
      settlementStatus: '结算状态',
      settlementAmount: '广告花费(元）',
      createTime: '创建时间',
      beginDate: '投放排期开始',
      endDate: '投放排期结束',
      _expanded: true
    }
  ]

  async mounted() {
    this.tableList()
  }
  async tableList() {
    const { data } = await planList({ ...this.form, ...this.pageList })
    this.data = data
    this.totalCount = data.totalCount
  }
  handleSelectAll() {}
  deleteList() {}
  searchList() {
     this.pageList.pageIndex = 1
     this.tableList()
  }
  handlepageChange(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
  handlePageSize(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/common.less';

/deep/ .ivu-table-header {
  margin-bottom: 25px;
}
/deep/ .ivu-table-tbody {
  .ivu-table-row td {
    background: #ffefe7;
  }
  td.ivu-table-expanded-cell {
    background: #fff;
    padding: 0;
    border: solid 1px #d3e7f8;
    border-top: none;
    margin-bottom: 20px;
  }
}
/deep/ .ivu-table-cell-with-expand {
  display: none;
}
.checkAll {
  cursor: pointer;
  margin: 10px 20px 0;
  .colBg;
  span:last-child {
    color: @c-link;
  }
}
</style>



