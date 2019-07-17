<template>
  <div class="page">
    <div class="page-title-btn">
      <Button type="primary" @click="addUser" class="btn-add"
          v-auth="'account-manage.users#create'">
          <Icon type="ios-add" size="27"/>新增子用户
      </Button>
    </div>
  
    <Form :model="form" class="jyd-form flex-box-center search-list">
      <Select v-model="form.roleId" clearable style="width: 200px">
        <Option :value="item.id" :key="item.id" v-for="item in rolelist">{{item.name}}</Option>
      </Select>

      <Select v-model="form.status" style="width: 200px" clearable>
        <Option :value="item.key" :key="item.id" v-for="item in statusList">{{item.text}}</Option>
      </Select>

      <div class="flex-box">
        <Input v-model="form.searchKey" style="width: 328px" placeholder="请输入联系人姓名／邮箱账号／手机号码进行搜索"/>
        <Button type="primary" @click="searchTableList" class="search-icon-btn">
          <Icon type="ios-search" size="22"/>
        </Button>
      </div>
    </Form>

    <Table ref="selection" class="table-jydata"  :columns="columns" :data="data"  @on-selection-change="singleSelect"  @on-select-all="selectAll"
>
      <template slot-scope="{row, index}" slot="roleId">
        <span>{{roleList(row.roleId)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="statusCode">
        <span v-if="row.statusCode === 1" class="aneble">已启用</span>
        <span v-else-if="row.statusCode === 2" class="display">已禁用</span>
        <span v-else-if="row.statusCode === 3" class="warting">待激活</span>
      </template>
      <template slot-scope="{row, index}" slot="lastLoginTime">
        <span>{{formatTimes(row.lastLoginTime)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="action">
        <a v-auth="'account-manage.users#view'" class="action-btn" @click="toDetail(row.id)">查看</a>
        <a v-auth="'account-manage.users#edit'" class="action-btn" @click="toEdit(row.id)">编辑</a>
        
        <a  v-auth="'account-manage.users#enable'" class="action-btn" v-if="row.statusCode == 2" @click="handleEnable(row.id, 1)">启用</a>
        <a  v-auth="'account-manage.users#enable'" class="action-btn" v-else-if="row.statusCode == 1" @click="handleEnable(row.id, 2)">禁用</a>
        <a class="action-btn" v-else-if="row.statusCode == 3" @click="activeEmail(row.id)">重新激活</a>
      </template>
    </Table>
    <div class="checkAll flex-box"   v-if="total>0" v-auth="'account-manage.users#delete'">
      <span @click="handleSelectAll">
        <Checkbox v-model="checkboxAll"></Checkbox>全选
      </span>
      <i class="check-line">|</i>
      <span @click="deleteList">批量删除</span>
    </div>
    <Page
      :total="total"
      v-if="total>0"
      class="btnCenter page-bottom"
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
import { confirm, info } from '@/ui/modal'

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
  systemCode: any = ''

  formatTimes: any = ''
  columns = [
    { type: 'selection', width: 30,  align: 'center' },
    { title: '联系人', key: 'name', minWidth: 50},
    { title: '登录邮箱', minWidth: 110,  key: 'email'},
    { title: '手机号码', key: 'mobile',  },
    {  title: '权限角色',   slot: 'roleId', minWidth: 100 },
    { title: '状态',  slot: 'statusCode', minWidth: 40 },
    { title: '上次登录时间',  slot: 'lastLoginTime', minWidth: 100 },
    { title: '操作', slot: 'action',  width: 180  }
  ]

  async mounted() {
    const user: any = getUser()!
    this.form.systemCode = this.systemCode = user.systemCode
    this.userList()

    this.formatTimes = formatTimes
  }

  async userList() {
    try {
      const { data } = await subAccount({ ...this.form, ...this.pageObject })
      this.rolelist = data.roleList || []
      this.statusList = data.statusList || []
      this.total = data.totalCount || 0

      // 读取当前广告主或资源方statusCode
      const code = this.systemCode
      if (data.list) {
        data.list.map((item: any) => {
          for (const i of item.systems) {
            if (i.code == code) {
              item.statusCode = i.status
            }
          }
        })
      }

      // 只有禁用数据可以删除
      if (data.list) {
        for (const it of data.list) {
          if (it.statusCode == 2) {
            it._checked = false
          } else {
            it._disabled = true
          }
        }
      }

      this.data = data.list || []
    } catch (ex) {
      this.handleError(ex)
    }
  }
  searchTableList() {
    this.pageObject.pageIndex = 1
    this.userList()
  }
  roleList(id: any) {
    const list: any = this.rolelist
    for (const item of list) {
      if (item.id == id) {
        return item.name
      }
    }
  }
  addUser() {
    if (this.rolelist.length) {
      this.$router.push({ name: 'account-user-add' })
    } else {
      this.showWaring('当前您没有角色列表, 请到权限管理添加角色')
    }
  }
  // 单选
  singleSelect(select: any) {
    this.checkboxAll = select.length == this.data.length ? true : false
    this.selectIds = select
  }
  // 全选
  selectAll(select: any) {
    this.checkboxAll = true
    this.selectIds = select
  }

  handleSelectAll() {
    const selection = this.$refs.selection as any
    selection.selectAll(!this.checkboxAll)
  }

  async deleteList() {
    if (this.selectIds.length) {
      const ids = this.selectIds.map((item: any) => item.id)
      const systemCode = this.systemCode
      await confirm('您确定要删除当前信息吗？')
      try {
        await delectSub({ ids, systemCode })
        this.userList()
      } catch (ex) {
        this.handleError(ex)
      }
    } else {
      this.showWaring('请选择你要删除的元素')
    }
  }

  async handleEnable(id: any, type: any) {
    if (type == 1) {
      await confirm('您确定启用当前信息吗？')
      try {
        await accountStatu({ status: 1, systemCode: this.systemCode }, id)
        this.userList()
      } catch (ex) {
        this.handleError(ex)
      }
    } else {
      await confirm('您确定禁用当前信息吗？')
      try {
        await accountStatu({ status: 2, systemCode: this.systemCode }, id)
        this.userList()
      } catch (ex) {
        if (ex.code == '8007403') {
          this.handleError(ex)
        } else {
          this.handleError(ex)
        }
      }
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
      await info('激活链接已重新发送，请查收激活邮件', { title: '提示' })
    } catch (ex) {
      if (ex.code != 0) {
        this.handleError(ex)
      } else {
        this.handleError(ex)
      }
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
@import '~@/site/common.less';
@import '~@/views/brand/less/common.less';
@import '~@/views/kol/less/common.less';

.page {
  padding: 0 20px 30px;
}
.search-list {
  margin: 30px 0;
}
.user-add {
  padding: 20px 0;
  text-align: right;
}
.action-btn {
  margin-right: 10px;
  color: #4fa6bb;
}
.aneble {
  color: #5f961f;
}
.display {
  color: #da6c70;
}
.warting {
  color: #fff;
}
.page-bottom {
  padding: 40px 0 100px;
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
/deep/ .btnCenter {
  text-align: center;
  height: 100px;
  background: rgba(32, 67, 80, 1);
  line-height: 100px;
  color: #fff;
}
</style>
