<template>
  <div class="page home-bg as">
    <h3 class="userTitle title" >
      <span class="nav-top-title"></span>
      <Button  class="btn-new but" type="primary" v-auth="'customer-manage#create'" @click="addUser">
        <Icon type="ios-add" size="27"/>新建客户
      </Button>
    </h3>

    <Form :model="form" class="form">
      <Row type="flex" justify="space-between">
        <Col :span="7">
          <FormItem  >
            <Select v-model="form.businessCode" clearable @on-change='searchcode' style='width: 300px;'>
              <Option :value="item.code" :key="item.code" v-for="item in businessList">{{item.desc}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="7">
          <FormItem  >
            <Select v-model="form.businessCategoryCode" @on-change='gorycode' clearable style='width: 300px;'>
              <Option :value="item.code" :key="item.code" v-for="item in businessCodeList">{{item.desc}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="7">
          <FormItem>
            <div class="flex-box">
              <Input v-model="form.searchKey" placeholder="搜索客户ID/联系人/联系电话"/>
              <Button type="primary" @click="searchTableList" class="btn-new bl">
                <Icon type="ios-search" size="22"/>
              </Button>
            </div>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Table
      
      :columns="columns"
      :data="data"
    >
      <template slot-scope="{row , index}" slot="action">
        <a v-auth="'customer-manage#view'" class="action-btn" @click="toDetail(row.id)">查看</a>
        <a v-auth="'customer-manage#edit'" class="action-btn" @click="toEdit(row.id)">编辑</a>
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
    businessCode: '', // 行业code
    businessCategoryCode: '', // 行业分类code
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
      key: 'businessCategoryName'
    },
    {
      title: '联系人',
      key: 'contactName'
    },
    {
      title: '联系电话',
      key: 'contactTel'
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
      const { data } = await subAccount({ ...this.form})
      this.data = data.items || []
      this.businessList = data.businessList
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }
  searchTableList() {
    this.form.pageIndex = 1
    this.userList()
  }

  async searchcode(value: any) {
    if (value == undefined) {
      this.form.businessCategoryCode = ''
      this.userList()
    }
    const datas = await codeList(this.form.businessCode)
    this.form.businessCategoryCode = (datas.data || [])[0].code
    this.businessCodeList = datas.data || []
    const { data } = await subAccount({ ...this.form})
    this.data = data.items || []
    this.businessList = data.businessList
    this.total = data.totalCount
  }
  async gorycode(value: any) {
    const { data } = await subAccount({ ...this.form})
    this.data = data.items || []
    // this.businessList = data.businessList
    this.total = data.totalCount
  }
  // 添加
  addUser() {
    this.$router.push({name: 'customer-edit'})
  }
  // 查看
  toDetail(id: any) {
    this.$router.push({name: 'customer-detail', params: {id}})
  }
  // 编辑
  toEdit(id: any) {
    this.$router.push({name: 'customer-edit', params: {id}})
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
.as {
  background: rgba(255, 255, 255, 0);
}
.action-btn {
  margin-right: 10px;
  color: #fff;
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
.title {
  border-bottom: 1px solid rgba(255, 255, 255, 0.44);
  height: 80px;
  background: rgba(255, 255, 255, 0);
}
.but {
  width: 200px;
  height: 50px;
  background: rgba(249, 216, 94, 1);
  border-radius: 25px;
  border: 0;
  color: rgba(0, 32, 45, 1);
  font-size: 18px;
  font-weight: 500;
}
.bl {
  width: 50px;
  height: 40px;
  background: rgba(0, 32, 45, 0.8);
  border-radius: 0 5px 5px 0;
  border: 0;
}
.table {
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
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
/deep/ .ivu-input {
  border-radius: 5px 0  0 5px;
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
