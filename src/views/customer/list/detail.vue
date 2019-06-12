<template>
  <div class="page home-bg as">
    <!-- <h2 class="layout-nav-title"><span @click="goBack">客户管理</span> > 查看客户</h2> -->
    <h3 class="layout-title nav">概览</h3>
    <div class="text-rows bgs">
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
    <h3 class="layout-title nav" style='margin-top: 10px;height: 50px;line-height: 50px;background: rgba(32, 67, 80, 1);'>已关联子账号</h3>
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
.as {
  background: rgba(255, 255, 255, 0);
}
.nav {
  height: 60px;
  background: rgba(0, 32, 45, 0.8);
  border-radius: 5px 5px 0 0;
  color: #fff;
  line-height: 60px;
  font-size: 16px;
  font-weight: 400;
}
.bgs {
  background: rgba(32, 67, 80, 1);
}
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
/deep/ .text-rows p label {
  color: #b3bcc0;
}
/deep/ .text-rows p span {
  color: #fff;
}
/deep/ .ivu-table th, /deep/ .ivu-table-header {
  background: rgba(0, 32, 45, 0.8);
  height: 40px;
  line-height: 40px;
  color: rgba(179, 188, 192, 1);
  font-size: 15px;
  font-weight: 400;
}
/deep/ .ivu-table td {
  background: rgba(32, 67, 80, 1);
  transition: background-color 0.2s ease-in-out;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  height: 50px;
  line-height: 50px;
}
/deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table-body {
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table-tip {
  overflow-x: auto;
  overflow-y: hidden;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table-wrapper {
  margin: 0;
  border: none;
}
/deep/ .btnCenter {
  text-align: center;
  height: 100px;
  background: rgba(32, 67, 80, 1);
  margin: 0 20px 0 20px;
  line-height: 100px;
  color: #fff;
}
/deep/ .ivu-page-prev {
  border: 0;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-page-next {
  border: 0;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-page-item-active {
  border-color: #eee;
  background: #eee !important;
  border-radius: 50%;
  color: #fff;
  width: 30px;
  height: 30px;
}
/deep/ .ivu-page-item {
  border: 0;
  display: inline-block;
  vertical-align: middle;
  background: rgba(32, 67, 80, 1);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-right: 4px;
  text-align: center;
  list-style: none;
  user-select: none;
  cursor: pointer;
  font-weight: 500;
  transition: border 0.2s ease-in-out, color 0.2s ease-in-out;
}
</style>



