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
          <p class="query-cinema" v-if="typeCode == 'ads'" @click="queryCustomer">查看关联客户</p>
          <p class="query-cinema" v-if="typeCode == 'resource'" @click="queryCustomer">查看关联影院列表</p>
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
      <Button type="primary" class="button-ok submitBtn" @click="goBack">返回</Button>
    </div>
    <detailDlg v-model="objDlg" v-if="objDlg.visibleDetail"></detailDlg>
    <resDefaultDlg v-model="resDlg" v-if="resDlg.visible"></resDefaultDlg>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { userDetail, operationLog, roleIdDetail } from '@/api/user'
import detailDlg from './detailDlg.vue'
import resDefaultDlg from './resDefaultDlg.vue'
import PermTree, { PermTreeModal } from '@/components/permTree'
import { getUser } from '@/store'

@Component({
  components: {
    detailDlg,
    PermTree,
    resDefaultDlg
  }
})
export default class Main extends ViewBase {
  data: any = []
  customer: any = ''
  roleName = ''
  // 广告主
  objDlg = {
    visibleDetail: false,
    customer: ''
  }
  // 资源方
  resDlg = {
    visible: false,
    customer: ''
  }

  typeCode = ''
  permTreeModal: PermTreeModal | null = null

  async mounted() {
    const id = this.$route.params.useid
    const user: any = getUser()!
    const systemCode = user.systemCode
    this.typeCode = user.systemCode
    const { data } = await userDetail({ id, systemCode })
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
    // 资源方 cinemas  广告主partners
    if (this.typeCode == 'ads') {
      this.objDlg = {
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


