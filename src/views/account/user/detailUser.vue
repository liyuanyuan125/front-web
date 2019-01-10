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
            <label>客户</label>{{customer}} 个
          </p>
          <p class="query-cinema" @click="queryCustomer">查看关联客户</p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">账号权限</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>权限角色</label>33333
          </p>
          <p class="flex-box">
            <label>相关权限</label>
            <Tree :data="data1"></Tree>
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>授权影院</label> 33333
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">操作日志</h3>
    <div class="text-rows">
      9999
    </div>
    <div class="btnCenter">
      <button class="button-ok submitBtn" @click="goBack">返回</button>
    </div>
    <detailDlg v-model="objDlg" v-if="objDlg.visibleDetail"></detailDlg>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { userDetail, operationLog } from '@/api/user'
import detailDlg from './detailDlg.vue'

@Component({
  components: {
    detailDlg
  }
})
export default class Main extends ViewBase {
  data: any = []
  customer: any = ''
  objDlg = {
    visibleDetail: false,
    customer: ''
  }

  data1 = [
    {
      title: '首页',
      expand: true,
      children: [
        {
          title: '推广管理1',
          expand: true,
          children: [
            {
              title: '推广管理1-1'
            },
            {
              title: '推广管理1-2'
            }
          ]
        },
        {
          title: '推广管理2',
          expand: true,
          children: [
            {
              title: '推广管理2-1'
            },
            {
              title: '推广管理2-2'
            }
          ]
        }
      ]
    }
  ]
  async mounted() {
    const id = this.$route.params.useid
    const { data } = await userDetail({ id })
    this.data = data
    this.customer = this.data.partners == null ? 0 : this.data.partners.length

    const obj = {pageIndex: 1, pageSize: 10}
    const datalog = operationLog(obj, id)
  }

  queryCustomer() {
    this.objDlg.visibleDetail = true
    this.objDlg.customer = this.data.partners
  }
  goBack() {
    this.$router.push({name: 'account-user'})
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


