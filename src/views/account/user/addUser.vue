<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">用户管理 > 新增子用户</h2>
    <Form
      ref="forms"
      :model="form"
      :rules="rules"
      label-position="left"
      class="edit-input"
      :label-width="100"
    >
      <h3 class="layout-title">设置登录账号</h3>
      <FormItem label="登录邮箱" class="item-top" prop="email">
        <Input v-model="form.email" @on-blur="handleEmail" placeholder="请输入正确的邮箱地址"></Input>
      </FormItem>
      <h3 class="layout-title">设置联系人（选项）</h3>
      <FormItem label="联系人名称" class="item-top" v-if="!isAccountAuth">
        <Input v-model="form.contactName" placeholder="请输入联系人名称"></Input>
      </FormItem>
      <FormItem label="手机号码" class="padbottom" v-if="!isAccountAuth">
        <Input v-model="form.mobile" :maxlength="11" placeholder="请输入手机号码"></Input>
      </FormItem>
      <h3 class="layout-title">关联影院（选项）</h3>
      <div class="text-rows">
        <Row>
          <Col :span="4">
            <p>
              <label>客户</label>
              {{custList}} 个
            </p>
            <p class="query-cinema" @click="handleEdit">编辑关联客户</p>
          </Col>
        </Row>
      </div>
      <h3 class="layout-title">设置账号权限</h3>
      <FormItem label="权限角色" class="item-top" prop="role">
        <Select v-model="form.role" style="width:400px" @on-change="handleChange">
          <Option :value="item.id" :key="item.id" v-for="item in roleList">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="相关权限">
        <PermTree v-model="permTreeModal" readonly v-if="permTreeModal"/>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <Button
        type="primary"
        v-if="!isAccountAuth"
        class="button-ok addSumbit"
        @click="handleInforma"
      >确定增加</Button>
      <Button type="primary" v-else class="button-ok addSumbit" @click="handleChangeAccount">更改信息</Button>
    </div>
    <editDig v-model="editVisible" @save="save"></editDig>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import editDig from '@/views/account/user/editDlg.vue'
import {
  rolesList,
  roleIdDetail,
  addUser,
  vaildNonEmail,
  accountSystem
} from '@/api/user'
import { getUser } from '@/store'
import PermTree, { PermTreeModal } from '@/components/permTree'

@Component({
  components: {
    editDig,
    PermTree
  }
})
export default class Main extends ViewBase {
  editVisible = {
    editVis: false,
    totalCount: null
  }
  permTreeModal: PermTreeModal | null = null

  form = {
    email: '',
    contactName: '',
    mobile: '',
    role: ''
  }
  systemCode = ''
  partnerIds = []
  roleList = []

  custList = 0

  // 查询非当前系统的有效子账户信息
  isAccountAuth: any = false

  get rules() {
    return {
      email: [
        { require: true, message: '请输入登录邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
      ]
    }
  }
  async mounted() {
    const user: any = getUser()!
    const systemCode = user.systemCode
    this.systemCode = user.systemCode
    const role = { pageIndex: 1, pageSize: 100, systemCode }
    const { data } = await rolesList(role)
    this.roleList = data.items || []
  }
  save(val: any) {
    if (val.length > 0) {
      this.partnerIds = val.map((item: any) => item.id)
      this.custList = this.partnerIds.length
    }
  }
  async handleEmail() {
    // 判断当前有效子用户
    if (this.form.email) {
      try {
        const { data } = await vaildNonEmail({
          type: this.systemCode,
          email: this.form.email
        })
        // 如果能查询出信息说明在别的系统存在，需要变更权限
        this.isAccountAuth = data == null ? false : true
      } catch (ex) {}
    }
  }
  async handleInforma() {
    try {
      if (this.systemCode == 'ads') {
        const { data } = await addUser(
          {
            ...this.form,
            partnerIds: this.partnerIds
          },
          this.systemCode
        )
      } else if (this.systemCode == 'resource') {
        const { data } = await addUser(
          {
            ...this.form,
            cinemaIds: this.partnerIds
          },
          this.systemCode
        )
      }
      this.$router.push({ name: 'account-user' })
    } catch (ex) {
      this.handleError.call(this, ex)
    }
  }
  async handleChangeAccount() {
    // 子账户存在 变更权限
    const obj = {
      email: this.form.email,
      system: this.systemCode,
      role: this.form.role
    }
    try {
      if (this.systemCode == 'ads') {
        await accountSystem({ ...obj, partnerIds: this.partnerIds })
      } else if (this.systemCode == 'resource') {
        await accountSystem({ ...obj, cinemaIds: this.partnerIds })
      }
    } catch (ex) {
      this.showError(ex)
    }
  }
  async handleChange() {
    const id = this.form.role
    const {
      data: { menu, role }
    } = await roleIdDetail({ id })
    this.permTreeModal = {
      menu,
      perms: (role && role.perms) || []
    }
  }
  handleEdit() {
    this.editVisible.editVis = true
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.page {
  .ivu-form-item {
    padding-left: 30px;
    color: @c-text;
  }
  .addSumbit {
    margin: 20px 0 30px;
  }
}
</style>

