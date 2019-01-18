<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">用户管理</span>
      <em class="addUser" @click="addUser">
        <Icon type="ios-add" size="27"/>新增子用户
      </em>
    </h3>

    <Form :model="form" class="form">
      <Row type="flex" justify="space-between">
        <Col :span="6">
          <FormItem label="权限角色" :label-width="100">
            <Select v-model="form.roleId" clearable>
              <Option :value="item.id" :key="item.id" v-for="item in rolelist">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="5">
          <FormItem label="账号状态" :label-width="100">
            <Select v-model="form.status" clearable>
              <Option :value="item.key" :key="item.id" v-for="item in statusList">{{item.text}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="10">
          <FormItem>
            <div class="flex-box">
              <Input v-model="form.searchKey" placeholder="请输入联系人姓名／邮箱账号／手机号码进行搜索"/>
              <span @click="userList">
                <Icon type="ios-search" size="22"/>
              </span>
            </div>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Table
      ref="selection"
      stripe
      :columns="columns"
      :data="data"
      @on-select="singleSelect"
      @on-select-all="selectAll"
    >
      <template slot-scope="{row, index}" slot="status">
        <span v-if="row.status === 1" class="aneble">已启用</span>
        <span v-else-if="row.status === 2" class="display">已禁用</span>
        <span v-else-if="row.status === 3" class="warting">待激活</span>
      </template>
      <template slot-scope="{row, index}" slot="lastLoginTime">
        <span>{{formatTimes(row.lastLoginTime)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="action">
        <a class="action-btn" @click="toDetail(row.id)">查看</a>
        <a class="action-btn" @click="toEdit(row.id)">编辑</a>
        
        <a class="action-btn" v-if="row.status == 2" @click="handleEnable(row.id, 1)">启用</a>
        <a class="action-btn" v-else-if="row.status == 1" @click="handleEnable(row.id, 2)">禁用</a>
        <a class="action-btn" v-else-if="row.status == 3" @click="activeEmail(row.id)">重新激活</a>
      </template>
    </Table>
    <h4 class="checkAll">
      <span @click="handleSelectAll">
        <Checkbox v-model="checkboxAll"></Checkbox>全选
      </span>
      <span @click="deleteList">批量删除</span>
    </h4>
    <Page
      :total="total"
      v-if="total>0"
      class="btnCenter"
      :current="pageObject.pageIndex"
      :page-size="pageObject.pageSize"
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
import { formatTimes } from '@/util/validateRules'
import {
  rolesList,
  subAccount,
  delectSub,
  accountStatu,
  activeEmail
} from '@/api/user'
import { getUser } from '@/store'
import { confirm } from '@/ui/modal'

@Component({})
export default class Main extends ViewBase {
  checkboxAll = false
  total = 0
  pageObject = {
    pageIndex: 1,
    pageSize: 10
  }

  form = {
    systemCode: null,
    roleId: null,
    status: null,
    searchKey: null
  }

  rolelist = []
  statusList = []
  data = []
  selectIds = []

  formatTimes: any = ''
  columns = [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    { title: '联系人', key: 'name' },
    {
      title: '登录邮箱',
      width: 160,
      key: 'email'
    },
    {
      title: '手机号码',
      key: 'mobile'
    },
    {
      title: '权限角色',
      key: 'roleName'
    },
    {
      title: '状态',
      slot: 'status'
    },
    {
      title: '上次登录时间',
      slot: 'lastLoginTime'
    },
    {
      title: '操作',
      slot: 'action',
      width: 160
    }
  ]

  async mounted() {
    const user: any = getUser()!
    this.form.systemCode = user.systemCode
    this.userList()

    this.formatTimes = formatTimes
  }

  async userList() {
    const { data } = await subAccount({ ...this.form, ...this.pageObject })

    // 处理 roleList 新增 releName
    if (data.list) {
      data.list.map((item: any) => {
        data.roleList.map((role: any) => {
          if (role.id == item.roleId) {
            item.roleName = role.name
          }
        })
      })
      this.data = data.list
    }

    this.rolelist = data.roleList
    this.statusList = data.statusList
    this.total = data.totalCount
  }
  addUser() {
    if (this.rolelist.length) {
      this.$router.push({ name: 'account-user-add' })
    } else {
      this.showWaring('当前您没有角色列表, 请到权限管理添加角色')
    }
  }
  singleSelect(select: any) {
    this.selectIds = select
  }
  // 全选
  selectAll(select: any) {
    this.selectIds = select
  }

  handleSelectAll() {
    const selection = this.$refs.selection as any
    selection.selectAll(!this.checkboxAll)
  }

  async deleteList() {
    if (this.selectIds.length) {
      const ids = this.selectIds.map((item: any) => item.id)
      await delectSub({ ids })
      this.userList()
    } else {
      this.showWaring('请选择你要删除的元素')
    }
  }
  async handleEnable(id: any, type: any) {
    if (type == 1) {
      await confirm('您确定启用当前信息吗？')
      await accountStatu({ status: 1 }, id)
      this.userList()
    } else {
      await confirm('您确定禁用当前信息吗？')
      await accountStatu({ status: 2 }, id)
      this.userList()
    }
  }

  toDetail(id: any) {
    this.$router.push({ name: 'account-user-detail', params: { useid: id } })
  }
  toEdit(id: any) {
    this.$router.push({ name: 'account-user-edit', params: { useid: id } })
  }
  async activeEmail(id: any) {
    try {
      await activeEmail({ id })
    } catch (ex) {
      this.showError(ex)
    }
  }

  handlepageChange(size: any) {
    this.pageObject.pageIndex = size
    this.userList()
  }
  handlePageSize(size: any) {
    this.pageObject.pageIndex = size
    this.userList()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.action-btn {
  margin-right: 10px;
}
.aneble { color: @c-text; }
.display { color: @c-fail; }
.warting { color: @c-done; }
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
  font-size: 14px;
  .checkAll {
    cursor: pointer;
    margin: 10px 20px 0;
    .colBg;
    span:last-child {
      color: @c-link;
    }
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
