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
            <div v-if="typeCode == 'ads'">
              <p><label>关联客户</label>{{customer}}个</p>
              <p class="query-cinema" @click="queryList">查看关联客户</p>
              <p class="query-cinema" @click="handleEdit">编辑关联客户</p>
            </div>
            <div v-if="typeCode == 'resource'">
              <p> 覆盖区域  &nbsp;0个 &nbsp;&nbsp; &nbsp; &nbsp; 覆盖省份  &nbsp;0个&nbsp;&nbsp; &nbsp; &nbsp;
                  覆盖城市  &nbsp;0个&nbsp;&nbsp; &nbsp; &nbsp;  影院  &nbsp;0个</p>
              <p class="query-cinema" @click="queryList">查看关联影院</p>
              <p class="query-cinema" @click="handleEdit">编辑关联影院</p>
            </div>
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
        <PermTree v-model="permTreeModal" readonly v-if="permTreeModal"/>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <Button type="primary" class="button-ok editSumbit" @click="handleInforma">确定修改</Button>
    </div>
    <detailDlg v-model="detailVisible" v-if="detailVisible.visibleDetail"></detailDlg>
    <editDig v-model="editVisible" @save="save" v-if="editVisible.editVis"></editDig>
    <resDefaultDlg v-model="resDlg" v-if="resDlg.visible"></resDefaultDlg>
    <resEditDlg v-model="resEditDlg" v-if="resEditDlg.visible"></resEditDlg>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import detailDlg from '@/views/account/user/detailDlg.vue'
import editDig from '@/views/account/user/editDlg.vue'
import resDefaultDlg from './resDefaultDlg.vue'
import resEditDlg from './resEditDlg.vue'
import { userDetail, rolesList, roleIdDetail, userEditSub } from '@/api/user'
import { getUser } from '@/store'
import PermTree, { PermTreeModal } from '@/components/permTree'

@Component({
  components: {
    detailDlg,
    editDig,
    resDefaultDlg,
    PermTree,
    resEditDlg
  }
})
export default class Main extends ViewBase {
  customer = ''
  // 广告主查看
  detailVisible = {
    visibleDetail: false,
    customer: []
  }
  // 资源方查看
  resDlg = {
    visible: false,
    customer: ''
  }
  // 广告主编辑
  editVisible = {
    editVis: false,
    check: []
  }
  // 资源方编辑
  resEditDlg = {
    visible: false,
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
  typeCode = ''
  permTreeModal: PermTreeModal | null = null

  async mounted() {
    this.getRoleList()
    try {
      const id = this.$route.params.useid
      const user: any = getUser()!
      const systemCode = user.systemCode
      this.typeCode = user.systemCode

      const { data } = await userDetail({ id, systemCode })
      this.form = {
        email: data.email,
        contactName: data.name,
        mobile: data.mobile,
        role: data.role.id
      }
      this.data = data
      this.customer = data.partners == null ? 0 : data.partners.length

      // tree
      this.handleSelect(data.role.id)
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
    // 判断资源方 广告方
    if (this.typeCode == 'ads') {
      this.detailVisible = {
        visibleDetail: true,
        customer: this.data.partners
      }
    } else if (this.typeCode == 'resource') {
      this.resDlg = {
        visible: true,
        customer: this.data.cinemas
      }
    }
  }
  handleEdit() {
    // 判断资源方 广告方 ----
    if (this.typeCode == 'ads') {
      this.editVisible = {
        editVis: true,
        check: this.data.partners
      }
    } else if (this.typeCode == 'resource') {
      this.resEditDlg = {
        visible: true,
        check: this.data.cinemas
      }
    }
  }
  save(val: any) {
    if (val.length > 0) {
      this.form.partnerIds = val.map((item: any) => item.id)
    }
  }
  async handleSelect(id: any) {
    const {
      data: { menu, role }
    } = await roleIdDetail({ id })
    this.permTreeModal = {
      menu,
      perms: (role && role.perms) || []
    }
  }
  async handleInforma() {
    try {
      const id = this.$route.params.useid
      const { data } = await userEditSub(this.form, id)
      this.$router.push({ name: 'account-user' })
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


