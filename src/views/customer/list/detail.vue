<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title"><span @click="goBack">客户管理</span> > 查看客户</h2>
    <h3 class="layout-title">概览</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>客户名称</label>
            <span>{{data.name}}</span>
          </p>
          <p>
            <label>客户简称</label>
            <span>{{data.nameShort}}</span>
          </p>
          <p>
            <label>客户行业</label>
            <span>{{code}}</span>
          </p>
          <p>
            <label>所属品类</label>
            <span>{{businss}}</span>
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>联系人</label>
            <span>{{data.contactName}}</span>
          </p>
          <p>
            <label>联系电话</label>
            <span>{{data.contactTel}}</span>
          </p>
          <p>
            <label>联系地址</label>
            <span>{{data.contactAddress}}</span>
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">已关联子账号</h3>
    <div class="">
      <Row>
        <Table
          stripe
          :columns="columns"
          :data="tabledata"
        ></Table>
      </Row>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { formatTimes } from '@/util/validateRules'
import { contact, adminId } from '@/api/customer'
import PermTree, { PermTreeModal } from '@/components/permTree'

@Component
export default class Main extends ViewBase {
  data: any = []
  tabledata: any = []
  businessCategoryList: any = []
  businessList: any = []

  columns = [
    { title: '联系人名称', key: 'name', align: 'center' },
    {
      title: '登录邮箱',
      width: 160,
      key: 'name',
      align: 'center'
    },
    {
      title: '权限角色',
      key: 'roleName',
      align: 'center'
    },
    {
      title: '手机号码',
      key: 'mobile',
      align: 'center'
    }
  ]

  created() {
    this.init()
    this.tableInit()
  }

  get code() {
    if (this.businessList.length > 0) {
      return this.businessList.filter((it: any) => it.code == this.data.businessCode)[0].desc
    } else {
      return ''
    }
  }

  get businss() {
    if (this.businessCategoryList.length > 0) {
      return this.businessCategoryList.filter((it: any) => it.code == this.data.businessCategoryCode)[0].desc
    } else {
      return ''
    }
  }

  async tableInit() {
    try {
      const {
        data: {
          accountList
        }
      } = await adminId({
        partnerId: this.$route.params.id,
        pageSize: 100,
        pageIndex: 1
      })
      this.tabledata = accountList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async init() {
    if (!this.$route.params.id) {
      return
    }
    try {
      const { data: {
        partner,
        businessCategoryList,
        businessList }
      } = await contact(this.$route.params.id)
      this.data = partner
      this.businessCategoryList = businessCategoryList
      this.businessList = businessList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  goBack() {
    this.$router.push({ name: 'customer-list' })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.submitBtn {
  margin-bottom: 30px;
}
.layout-nav-title {
  background: rgba(249, 249, 249, 1);
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


