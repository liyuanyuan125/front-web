<template>
  <div class="page home-bg">
    <!-- <h2 class="layout-nav-title">用户管理 > 查看子用户</h2> -->
    <div class="layout-nav-title">
       <router-link :to="{name: 'account-user'}" >用户管理</router-link> > 
       <span>查看子用户</span>
    </div>
    <h3 class="layout-title">账号信息</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>账户状态</label>
            {{statusCode.statusDesc}}
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
    <h3 class="layout-title" v-if="typeCode == 'ads'">关联客户</h3>
    <h3 class="layout-title" v-if="typeCode == 'resource'">关联影院</h3>
    <div class="text-rows">
      <Row>
        <Col :span="20">
          <div v-if="typeCode == 'ads'">
             <p><label>客户</label> {{customer}} 个</p>
          </div>
          <div v-if="typeCode == 'resource'">
            <p>
                覆盖区域 &nbsp;{{data.cinemaAreaCount || 0}}个 &nbsp;&nbsp; &nbsp; &nbsp; 覆盖省份 &nbsp;{{data.cinemaProvinceCount || 0}}个&nbsp;&nbsp; &nbsp; &nbsp;
                覆盖城市 &nbsp;{{data.cinemaCityCount || 0}}个&nbsp;&nbsp; &nbsp; &nbsp; 影院 &nbsp;{{cinemaLen}}个
              </p>
          </div>
         
          <p class="query-cinema" v-if="typeCode == 'ads'" @click="queryCustomer">查看关联客户</p>
          <p class="query-cinema" v-if="typeCode == 'resource'" @click="queryCustomer">查看关联影院列表</p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">账号权限</h3>
    <Form  :label-width="120"  class="edit-input forms">
      <FormItem label="权限角色" >
        <span class="span-class">{{roleName}}</span>
      </FormItem>
      <FormItem label="相关权限">
        <PermTree v-model="permTreeModal" readonly v-if="permTreeModal"/>
      </FormItem>
    </Form>
    <h3 class="layout-title more-list">操作日志
      <em @click="moreList">更多...</em>
    </h3>
    <div class="text-rows log-list">
      <p v-for="(item, index) in logList" :key="index">
        <span>{{formatTimes(item.createTime)}}</span>
        <em>{{item.operateDesc}}</em>
      </p>
    </div>
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
import { getUser } from '@/store'
import { formatTimes } from '@/util/validateRules'
import { userDetail, operationLog } from '@/api/user'
import detailDlg from './detailDlg.vue'
import resDefaultDlg from './resDefaultDlg.vue'
import PermTree, { PermTreeModal } from '@/components/permTree'

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
.forms {
  padding: 20px 0 30px 30px;
}
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


