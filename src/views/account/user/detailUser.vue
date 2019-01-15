<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">用户管理 > 查看子用户</h2>
    <h3 class="layout-title">账号信息</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>账户状态</label>
            {{data.status}}
          </p>
          <p>
            <label>账号ID</label>
            {{data.id}}
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>登录账号</label>
            {{data.email}}
          </p>
          <p>
            <label>联系人</label>
            {{data.name}}
          </p>
          <p>
            <label>手机号码</label>
            {{data.mobile}}
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">关联客户</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>客户</label>
            {{customer}} 个
          </p>
          <p class="query-cinema" @click="queryCustomer">查看关联客户</p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">账号权限</h3>
    <div class="text-rows">
      <Row>
        <Col :span="24">
          <p>
            <label>权限角色</label>
            {{roleName}}
          </p>
          <p class="flex-box">
            <label>相关权限</label>
            <PermTree v-model="permTreeModal" readonly v-if="permTreeModal"/>
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">操作日志</h3>
    <div class="text-rows"></div>
    <div class="btnCenter">
      <button class="button-ok submitBtn" @click="goBack">返回</button>
    </div>
    <detailDlg v-model="objDlg" v-if="objDlg.visibleDetail"></detailDlg>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { userDetail, operationLog, roleIdDetail } from '@/api/user'
import detailDlg from './detailDlg.vue'
import PermTree, { PermTreeModal } from '@/components/permTree'

@Component({
  components: {
    detailDlg,
    PermTree
  }
})
export default class Main extends ViewBase {
  data: any = []
  customer: any = ''
  roleName = ''
  objDlg = {
    visibleDetail: false,
    customer: ''
  }

  permTreeModal: PermTreeModal | null = null

  async mounted() {
    const id = this.$route.params.useid
    const { data } = await userDetail({ id })
    this.data = data
    this.roleName = data.role.name
    this.customer = this.data.partners == null ? 0 : this.data.partners.length

    // 操作日志
    const obj = { pageIndex: 1, pageSize: 10 }
    const datalog = operationLog(obj, id)

    // tree
    const {
      data: { menu, role }
    } = await roleIdDetail({ id: data.role.id })
    this.permTreeModal = {
      menu,
      perms: (role && role.perms) || []
    }
  }

  queryCustomer() {
    this.objDlg.visibleDetail = true
    this.objDlg.customer = this.data.partners
  }
  goBack() {
    this.$router.push({ name: 'account-user' })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.page {
  .submitBtn {
    margin-bottom: 30px;
  }
}
</style>


