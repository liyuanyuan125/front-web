<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">用户管理 > 新增子用户</h2>
    <Form :model="form" label-position="left" class="edit-input" :label-width="100">
      <h3 class="layout-title">设置登录账号</h3>
      <FormItem label="登录邮箱" class="item-top">
        <Input v-model="form.type" placeholder="请输入正确的邮箱地址"></Input>
      </FormItem>
      <h3 class="layout-title">设置联系人（选项）</h3>
      <FormItem label="联系人名称" class="item-top">
        <Input v-model="form.name" placeholder="请输入联系人名称"></Input>
      </FormItem>
      <FormItem label="手机号码" class="padbottom">
        <Input v-model="form.mobile" placeholder="请输入手机号码"></Input>
      </FormItem>
      <h3 class="layout-title">关联影院（选项）</h3>
      <div class="text-rows">
        <Row>
          <Col :span="4">
            <p><label>客户</label> {{editVisible.totalCount}} 个</p>
            <p class="query-cinema" @click="handleEdit">编辑关联客户</p>
          </Col>
        </Row>
      </div>
      <h3 class="layout-title">设置账号权限</h3>
      <FormItem label="权限角色" class="item-top">
        <Select v-model="form.role" style="width:400px">
          <Option :value="item.id" :key="item.id" v-for="item in roleList" >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="相关权限">
        <Tree :data="treeObject.list" show-checkbox></Tree>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <button class="button-ok addSumbit" @click="handleInforma">确定增加</button>
    </div>
    <editDig v-model="editVisible" @save="save" ></editDig>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import editDig from '@/views/account/user/editDlg.vue'
import TreeList from '@/components/tree.vue'
import {roleList, roleIdDetail} from '@/api/user'
import { getUser } from '@/store'


@Component({
  components: {
    editDig,
    TreeList
  }
})
export default class Main extends ViewBase {
  editVisible = {
    editVis: false,
    totalCount: null
  }

  form = {
    type: '',
    name: '',
    mobile: '',
    role: ''
  }
  roleList = []

  treeObject = {
    list: [
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
  }

  async mounted() {
    const user: any = getUser()!
    const systemCode = user.systemCode
    const role = { pageIndex: 1, pageSize: 100, systemCode}
    const { data } = await roleList(role)
    this.roleList = data.items
  }
  save(val: any) {
  }
  handleInforma() {}
  handleEdit() {
    this.editVisible.editVis = true
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.page {
  .ivu-form-item {
    padding-left: 30px;
    color: @c-text;
  }
  .addSumbit {
    margin: 20px 0 30px;
  }
}
</style>

