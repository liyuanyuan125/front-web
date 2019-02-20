<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">客户管理 > 查看客户</h2>
    <h3 class="layout-title">账号信息</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>客户名称</label>
            {{statusCode.statusDesc}}
          </p>
          <p>
            <label>联系人</label>
            {{data.id}}
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>客户简称</label>
            {{data.email}}
          </p>
          <p>
            <label>联系电话</label>
            {{data.name}}
          </p>
          <p>
            <label>客户行业</label>
            {{data.mobile}}
          </p>
          <p>
            <label>联系地址</label>
            {{data.mobile}}
          </p>
          <p>
            <label>所属品类</label>
            {{data.mobile}}
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">已关联子账号</h3>
    <div class="text-rows">
      <Row>
        
      </Row>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { formatTimes } from '@/util/validateRules'
import { userDetail, operationLog } from '@/api/user'
import PermTree, { PermTreeModal } from '@/components/permTree'

@Component
export default class Main extends ViewBase {
  data: any = []
  customer: any = ''
  cinemaLen: any = 0
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
  userId: any = ''
  logList = []
  typeCode = ''
  statusCode = ''
  formatTimes: any = ''
  permTreeModal: PermTreeModal | null = null

  async mounted() {
    this.formatTimes = formatTimes
    const user: any = getUser()!
    const systemCode = (this.typeCode = user.systemCode)
    const id = this.userId = this.$route.params.useid
    try {
      const { data } = await userDetail({ id, systemCode })
      this.data = data
      this.permTreeModal = {
        menu: data.menu,
        perms: (data.role && data.role.perms) || []
      }
      this.roleName = data.role.name
      this.statusCode = data.systems.filter((item: any) => item.code == systemCode)[0]
      this.customer = this.data.partners == null ? 0 : this.data.partners.length
      this.cinemaLen = this.data.cinemas == null ? 0 : this.data.cinemas.length
    } catch (ex) {
      this.showError(ex.msg)
    }

    // 操作日志
    this.operationLog()
  }
  async operationLog() {
    // 操作日志
    const id = this.userId
    const obj = { pageIndex: 1, pageSize: 10 }
    try {
      const { data } = await operationLog(obj, id)
      this.logList = data.items || []
    } catch (ex) {
      this.showError(ex)
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

  moreList() {
    this.$router.push({ name: 'account-user-detail-log', params: {id: this.userId}})
  }
  goBack() {
    this.$router.push({ name: 'account-user' })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.submitBtn {
  margin-bottom: 30px;
}
.more-list {
  position: relative;
  em {
    color: #0f4d96;
    position: absolute;
    right: 20px;
    top: 0;
    cursor: pointer;
  }
}
.log-list {
  color: #444;
  span {
    margin-right: 30px;
  }
}
</style>


