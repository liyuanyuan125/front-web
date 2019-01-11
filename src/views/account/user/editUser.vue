<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">用户管理 > 编辑子用户</h2>
    <Form :model="form" label-position="left" :label-width="100" class="edit-input">
      <h3 class="layout-title">设置登录账号</h3>
      <FormItem label="登录邮箱" class="item-top">
        <Input v-model="form.email" placeholder="请输入登录邮箱"></Input>
      </FormItem>
      <h3 class="layout-title">设置联系人（选项）</h3>
      <FormItem label="联系人名称" class="item-top">
        <Input v-model="form.contactName" placeholder="请输入联系人名称"></Input>
      </FormItem>
      <FormItem label="手机号码">
        <Input v-model="form.mobile" :maxlength="11" placeholder="请输入手机号码"></Input>
      </FormItem>
      <h3 class="layout-title">关联客户（选项）</h3>
      <div class="text-rows">
        <Row>
          <Col :span="12">
            <p>
              <label>关联客户</label>
              {{customer}}个
            </p>
            <p class="query-cinema" @click="queryList">查看关联客户</p>
            <p class="query-cinema" @click="handleEdit">编辑关联客户</p>
          </Col>
        </Row>
      </div>
      <h3 class="layout-title">设置账号权限</h3>
      <FormItem label="权限角色" class="item-top">
        <Select v-model="form.role" style="width:400px" @on-change="handleSelect">
          <Option :value="item.id" :key="item.id" v-for="item in rolelist">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="相关权限">
        <Tree :data="data2"></Tree>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <button class="button-ok editSumbit" @click="handleInforma">确定修改</button>
    </div>
    <detailDlg v-model="detailVisible" v-if="detailVisible.visibleDetail"></detailDlg>
    <editDig v-model="editVisible" @save="save" v-if="editVisible.editVis"></editDig>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import detailDlg from '@/views/account/user/detailDlg.vue'
import editDig from '@/views/account/user/editDlg.vue'
import { userDetail, rolesList, roleIdDetail, userEditSub } from '@/api/user'
import { getUser } from '@/store'

@Component({
  components: {
    detailDlg,
    editDig
  }
})
export default class Main extends ViewBase {
  customer = ''
  detailVisible = {
    visibleDetail: false,
    customer: []
  }
  editVisible = {
    editVis: false,
    check: []
  }

  form: any = {
    email: '',
    contactName: '',
    mobile: '',
    role: '',
    partnerIds: []
  }

  data: any = []
  rolelist = []
  data2 = [
    {
      title: '首页',
      expand: true,
      children: [{ title: '查看' }]
    },
    {
      title: '推广管理',
      expand: true,
      children: [
        {
          title: '广告计划'
        }
      ]
    }
  ]

  async mounted() {
    this.getRoleList()
    try {
      const id = this.$route.params.useid
      const { data } = await userDetail({ id })
      this.form = {
        email: data.email,
        contactName: data.name,
        mobile: data.mobile,
        role: data.role.id
      }
      this.data = data
      this.customer = data.partners == null ? 0 : data.partners.length
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async getRoleList() {
    const user: any = getUser()!
    const systemCode = user.systemCode
    const role = { pageIndex: 1, pageSize: 100, systemCode }
    const { data } = await rolesList(role)
    this.rolelist = data.items
  }

  queryList() {
    this.detailVisible.visibleDetail = true
    this.detailVisible.customer = this.data.partners
  }
  handleEdit() {
    this.editVisible.editVis = true
    this.editVisible.check = this.data.partners
  }
  save(val: any) {
    if (val.length > 0) {
      this.form.partnerIds = val.map((item: any) => item.id)
    }
  }
  async handleSelect(val: any) {
    const { data } = await roleIdDetail({ id: val })
  }
  async handleInforma() {
    try {
      const id = this.$route.params.useid
      const { data } = await userEditSub(this.form, id)
      this.$router.push({name: 'account-user'})
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.ivu-form-item {
  padding-left: 30px;
  color: @c-text;
}
.editSumbit {
  margin-bottom: 30px;
}
</style>


