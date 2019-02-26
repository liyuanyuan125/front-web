<template>
  <div class="page home-bg">
    <!-- <h2 class="layout-nav-title">用户管理 > 新增子用户</h2> -->
    <div class="layout-nav-title">
       <router-link :to="{name: 'account-user'}" >用户管理</router-link> > 
       <span>新增子用户</span>
    </div>
    <Form
      ref="forms"
      :model="form"
      :rules="rules"
      label-position="left"
      class="edit-input"
      :label-width="100"
    >
      <h3 class="layout-title">设置登录账号</h3>
      <FormItem label="登录邮箱" class="item-top" prop="email" :error="emailError">
        <Input v-model="form.email" @on-blur="handleEmail" placeholder="请输入正确的邮箱地址"></Input>
      </FormItem>
      <h3 class="layout-title">设置联系人（选填）</h3>
      <FormItem label="联系人名称" class="item-top">
        <Input v-model="form.contactName" :disabled="!isAccountAuth" placeholder="请输入联系人名称"></Input>
      </FormItem>
      <FormItem label="手机号码" class="padbottom">
        <Input
          v-model="form.mobile"
          :maxlength="11"
          :disabled="!isAccountAuth"
          placeholder="请输入手机号码"
        ></Input>
      </FormItem>
      <h3 class="layout-title" v-if="systemCode == 'ads'">关联客户（选填）</h3>
      <h3 class="layout-title" v-else-if="systemCode == 'resource'">关联影院（选填）</h3>
      <div class="text-rows">
        <Row>
          <Col :span="24">
            <div v-if="systemCode == 'ads'">
              <p>
                <label>客户</label>
                {{custList}} 个
              </p>
              <p class="query-cinema" @click="handleEdit">编辑关联客户</p>
            </div>
            <div v-else-if="systemCode == 'resource'">
              <p>
                覆盖区域 &nbsp;0个 &nbsp;&nbsp; &nbsp; &nbsp; 覆盖省份 &nbsp;0个&nbsp;&nbsp; &nbsp; &nbsp;
                覆盖城市 &nbsp;0个&nbsp;&nbsp; &nbsp; &nbsp; 影院 &nbsp;{{cinemaLen || 0}}个
              </p>
              <p class="query-cinema" @click="handleEdit">编辑关联影院</p>
            </div>
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
        v-if="isAccountAuth"
        class="button-ok addSumbit"
        @click="handleInforma"
        :disabled="submitDisabled"
      >确定增加</Button>
      <Button type="primary" v-else class="button-ok addSumbit" :disabled="submitDisabled" @click="handleInforma">更改信息</Button>
    </div>
    <editDig v-model="editVisible" v-if="editVisible.editVis" @save="save"></editDig>
    <resEditDlg v-model="resEditDlg" @save="save" v-if="resEditDlg.visible"></resEditDlg>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import editDig from '@/views/account/user/editDlg.vue'
import resEditDlg from './resEditDlg.vue'
import { updateEmail } from '@/store'

import {
  rolesList,
  roleIdDetail,
  addUser,
  vaildNonEmail,
  accountSystem
} from '@/api/user'
import { getUser } from '@/store'
import PermTree, { PermTreeModal } from '@/components/permTree'
import { confirm, info } from '@/ui/modal'

@Component({
  components: {
    editDig,
    PermTree,
    resEditDlg
  }
})
export default class Main extends ViewBase {
  submitDisabled = false
  // 广告主
  editVisible = {
    editVis: false,
    check: []
  }
  // 资源方
  resEditDlg = {
    visible: false,
    check: []
  }
  permTreeModal: PermTreeModal | null = null

  form: any = {
    email: '',
    contactName: '',
    mobile: '',
    role: ''
  }
  emailError = ''
  systemCode = ''
  partnerIds = []
  roleList = []

  custList = 0
  cinemaLen = 0

  // 查询非当前系统的有效子账户信息
  isAccountAuth: any = true

  get rules() {
    return {
      email: [
        {
          require: true,
          message: '请输入登录邮箱',
          trigger: 'blur',
          validator(rule: any, value: string[], callback: any) {
            value.length == 0
              ? callback(new Error('请输入登录邮箱'))
              : callback()
          }
        },
        { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
      ],
      role: [
        {
          require: true,
          trigger: 'change',
          validator(rule: any, value: string[], callback: any) {
            !value
              ? callback(new Error('请选择权限角色'))
              : callback()
          }
        }
      ]
    }
  }

  async mounted() {
    try {
      const user: any = getUser()!
      const systemCode = (this.systemCode = user.systemCode)
      const role = { pageIndex: 1, pageSize: 100, systemCode }
      const { data } = await rolesList(role)
      this.roleList = data.items || []
    } catch (ex) {
      this.handleError(ex)
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
        // “邮箱”在本公司账号其它系统存在时 code =0
        await confirm('该邮箱已存在，是否填充信息？', { okText: '填充' })
        this.isAccountAuth = false
        this.form = {
          email: data.email,
          contactName: data.name,
          mobile: data.mobile
        }
      } catch (ex) {
        if (ex.code == '8007205') {
        } else if (ex.code == '8007220') {
          // 主账号邮箱，不可建为子用户
          this.showWaring(ex.msg)
        } else if (ex.code == '8007203') {
          // 该邮箱已被占用
          this.showWaring(ex.msg)
        } else if (ex.code == '9006201') {
          // “邮箱”在账号库里不存在时，正常新增子用户
          this.isAccountAuth = true
        } else {
          this.showWaring(ex.msg)
        }
      }
    }
  }
  async handleInforma() {
    (this.$refs.forms as any).validate((valid: any) => {
      if (valid) {
        if (this.isAccountAuth) {
          this.submit()
        } else {
          this.handleChangeAccount()
        }
      }
    })
  }
  async submit() {
    this.submitDisabled = true
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
      this.handleError.call(this, ex.msg)
    } finally {
      this.submitDisabled = false
    }
  }
  async handleChangeAccount() {
    // 子账户存在 变更权限
    const obj = {
      email: this.form.email,
      system: this.systemCode,
      role: this.form.role
    }
     this.submitDisabled = true
    try {
      if (this.systemCode == 'ads') {
        await accountSystem({ ...obj, partnerIds: this.partnerIds })
      } else if (this.systemCode == 'resource') {
        await accountSystem({ ...obj, cinemaIds: this.partnerIds })
      }
      this.$router.push({ name: 'account-user' })
    } catch (ex) {
      this.handleError(ex)
    } finally {
       this.submitDisabled = false
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

  save(val: any) {
    if (val.length > 0) {
      this.resEditDlg.check = val
      this.editVisible.check = val
      this.partnerIds = val.map((item: any) => item.id)
      this.custList = this.cinemaLen = this.partnerIds.length
    }
  }

  handleEdit() {
    if (this.systemCode == 'ads') {
      this.editVisible.editVis = true
    } else if (this.systemCode == 'resource') {
      this.resEditDlg.visible = true
    }
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

