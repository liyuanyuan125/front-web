<template>
  <div class="page home-bg as">
    <div class='bgs'>
      <h3 class="layout-title tits">账号信息</h3>
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
    </div>
    <div class='bgs'>
      <h3 class="layout-title tits" v-if="typeCode == 'ads'">关联客户<p class="query-cinema viewal" v-if="typeCode == 'ads'" @click="queryCustomer">查看关联客户</p></h3>
      <h3 class="layout-title tits" v-if="typeCode == 'resource'">关联影院<p class="query-cinema viewal" v-if="typeCode == 'resource'" @click="queryCustomer">查看关联影院列表</p></h3>
      
      
      <div class="text-rows">
        <Row>
          <Col :span="20">
            <div v-if="typeCode == 'ads'">
               <p><label>客户</label> {{customer}} 个</p>
            </div>
            <div v-if="typeCode == 'resource'">
              <Row style='line-height: 50px;'>
                <Col :span='8'>覆盖区域 &nbsp;&nbsp;{{data.cinemaAreaCount || 0}}个</Col>
                <Col :span='8'>覆盖省份 &nbsp;&nbsp;{{data.cinemaProvinceCount || 0}}个</Col>
              </Row>
              <Row style='line-height: 50px;'>
                <Col :span='8'>覆盖城市 &nbsp;&nbsp;{{data.cinemaCityCount || 0}}个</Col>
                <Col :span='8'>影院 &nbsp;&nbsp;{{cinemaLen}}个</Col>
              </Row>
            </div>
           
            
          </Col>
        </Row>
      </div>
    </div>
    <div class='bgs'>
      <h3 class="layout-title tits">账号权限</h3>
      <Form  :label-width="120"  class="edit-input forms">
        <FormItem label="权限角色" >
          <span class="span-class">{{roleName}}</span>
        </FormItem>
        <FormItem label="相关权限">
          <PermTree v-model="permTreeModal" readonly v-if="permTreeModal"/>
        </FormItem>
      </Form>
    </div>
    <div class='bgs' v-if="logList.length > 0">
      <h3 class="layout-title tits more-list">操作日志<em @click="moreList">更多...</em></h3>
      <div class="text-rows log-list">
        <p v-for="(item, index) in logList" :key="index">
          <span>{{formatTimes(item.createTime)}}</span>
          <em>{{item.operateDesc}}</em>
        </p>
      </div>
    </div>
    
    <!-- <div class="btnCenter">
      <Button type="primary" class="button-ok submitBtn" @click="goBack">返回</Button>
    </div> -->
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
      const permDate = {
        menu: data.menu || {},
        perms: (data.role && data.role.perms) || []
      }
      this.permTreeModal = (data.menu && data.role) ? permDate : null

      this.roleName = data.role ? data.role.name : ''
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
    this.$router.push({ name: 'account-user-log', params: {id: this.userId}})
  }
  goBack() {
    this.$router.push({ name: 'account-user' })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.as {
  background: rgba(255, 255, 255, 0);
  color: #00202d;
}
.bgs {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 5px;
  margin-top: 20px;
}
.tits {
  background: rgba(255, 255, 255, 0);
  color: #00202d;
  font-size: 24px;
  font-weight: 500;
  padding-top: 4px;
  height: 70px;
  line-height: 70px;
}
.viewal {
  color: rgb(0, 139, 211);
  font-size: 14px;
  display: inline-block;
  margin-left: 20px;
}
.forms {
  padding: 20px 0 30px 30px;
}
.submitBtn {
  margin-bottom: 30px;
}
.more-list {
  position: relative;
  em {
    color: #00202d;
    position: absolute;
    right: 20px;
    top: 0;
    cursor: pointer;
    font-size: 16px;
  }
}
.log-list {
  color: #444;
  span {
    margin-right: 30px;
  }
}
/deep/ .text-rows p label {
  display: inline-block;
  width: 105px;
  color: #3c5b6a;
}
/deep/ .ivu-tree-empty {
  padding-top: 5px;
}
</style>


