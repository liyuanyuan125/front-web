<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">客户管理</span>
      <em class="addUser" @click="addUser">
        <Icon type="ios-add" size="27"/>新建客户
      </em>
    </h3>

    <Form :model="form" class="form">
      <Row type="flex" justify="space-between">
        <Col :span="6">
          <FormItem label="客户行业" :label-width="100">
            <Select v-model="form.businessCode" clearable @on-change='searchcode' style='width: 200px;'>
              <Option :value="item.code" :key="item.code" v-for="item in businessList">{{item.desc}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="6">
          <FormItem label="所属品类" :label-width="100">
            <Select v-model="form.businessCategoryCode" clearable style='width: 200px;'>
              <Option :value="item.code" :key="item.code" v-for="item in businessCodeList">{{item.desc}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="10">
          <FormItem>
            <div class="flex-box">
              <Input v-model="form.searchKey" placeholder="搜索客户ID/联系人/联系电话"/>
              <span @click="searchTableList">
                <Icon type="ios-search" size="22"/>
              </span>
            </div>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Table
      stripe
      :columns="columns"
      :data="data"
      :key="data.length"
    >
      <template slot-scope="{row}" slot="action">
        <a class="action-btn" @click="toDetail(row.id)">查看</a>
        <a class="action-btn" @click="toEdit(row.id)">编辑</a>
      </template>
    </Table>
    <Page
      :total="total"
      v-if="total>0"
      class="btnCenter"
      :current="form.pageIndex"
      :page-size="form.pageSize"
      show-total
      show-elevator
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
  </div>
</template>

<script lang="tsx">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { subAccount , codeList } from '@/api/customer'
import { getUser } from '@/store'
import { confirm, info } from '@/ui/modal'
@Component({})
export default class Main extends ViewBase {
  checkboxAll = false
  total = 0
  // pageObject = {
  //   pageIndex: 1,
  //   pageSize: 10
  // }

  form = {
    pageIndex: 1,
    pageSize: 10,
    businessCode: 'PARTNER_BUSINESS_CAR', // 行业code
    businessCategoryCode: null, // 行业分类code
    searchKey: null // 查询关键字
  }
  // 行业列表
  businessList: any = []
  // 行业分类列表
  businessCodeList: any = []
  // 客户列表
  data: any = []

  columns = [
    { title: '客户ID', key: 'id' },
    {
      title: '客户名称',
      width: 160,
      key: 'name'
    },
    {
      title: '客户行业',
      key: 'businessName'
    },
    {
      title: '所属品类',
      slot: 'businessCategoryName'
    },
    {
      title: '联系人',
      slot: 'contactName'
    },
    {
      title: '联系电话',
      slot: 'contactTel'
    },
    {
      title: '操作',
      slot: 'action',
      width: 160
    }
  ]

  async mounted() {
    this.userList()
  }

  async userList() {
    try {
      const datas = await codeList(this.form.businessCode)
      this.form.businessCategoryCode = (datas.data || [])[0].code
      this.businessCodeList = datas.data || []
      const { data } = await subAccount({ ...this.form})
      this.data = data.items || []
      this.businessList = data.businessList
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
  searchTableList() {
    this.form.pageIndex = 1
    this.userList()
  }

  async searchcode(value: any) {
    // const datas = await codeList(this.form.businessCode)
    // this.form.businessCategoryCode = (datas.data || [])[0].code
    // this.businessCodeList = datas.data || []
    this.userList()
  }
  // 添加
  addUser() {
    this.$router.push({name: 'customer-list-edit'})
  }
  // 查看
  toDetail(id: any) {
    this.$router.push({name: 'customer-list-detail', params: {id}})
  }
  // 编辑
  toEdit(id: any) {
    this.$router.push({name: 'customer-list-edit', params: {id}})
  }

  handlepageChange(size: any) {
    this.form.pageIndex = size
    this.userList()
  }
  handlePageSize(size: any) {
    this.form.pageIndex = size
    this.userList()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/common.less';
.action-btn {
  margin-right: 10px;
}
.aneble {
  color: @c-text;
}
.display {
  color: @c-fail;
}
.warting {
  color: @c-done;
}

.page {
  font-size: 14px;
  .checkAll {
    cursor: pointer;
    margin: 10px 20px 0;
    .colBg;
    span:last-child {
      color: @c-link;
    }
  }

  .tableTotal {
    padding: 0 30px 0;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  .flex-box {
    span {
      display: block;
      height: 40px;
      width: 80px;
      color: #fff;
      text-align: center;
      padding-top: 4px;
      cursor: pointer;
      position: relative;
      left: -1px;
      background: @c-button;
    }
  }
  .form {
    padding: 0 30px;
    .ivu-form-item {
      /deep/ .ivu-form-item-label {
        font-size: 14px;
        padding: 14px 12px 14px 0;
        text-align: left;
      }
      /deep/ .ivu-form-item-content {
        .ivu-select-selection {
          height: 40px;
          .ivu-select-selected-value {
            height: 40px;
            line-height: 40px;
            font-size: 14px;
          }
          .ivu-select-placeholder {
            height: 40px;
            line-height: 40px;
            font-size: 14px;
          }
        }
        .ivu-input-wrapper {
          input {
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }
  }
}
</style>
