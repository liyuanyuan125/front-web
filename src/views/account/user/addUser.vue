<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">用户管理 > 新增子用户</h2>
    <Form :model="form" label-position="left" class="edit-input" :label-width="100">
      <h3 class="layout-title">设置登录账号</h3>
      <FormItem label="邮箱类型" class="item-top">
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
          <Col :span="12">
            <p>覆盖区域 0 个</p>
            <p>覆盖省份 0 个</p>
            <p class="query-cinema" @click="queryList">查看已关联影院列表</p>
          </Col>
          <Col :span="12">
            <p>覆盖区域 0 个</p>
            <p>覆盖省份 0 个</p>
            <p class="query-cinema" @click="handleEdit">编辑关联影院</p>
          </Col>
        </Row>
      </div>
      <h3 class="layout-title">设置账号权限</h3>
      <FormItem label="权限角色" class="item-top">
        <Select v-model="form.role">
          <Option :value="item.key" v-for="item in rolelist">{{item.value}}</Option>
        </Select>
      </FormItem>
      <FormItem label="相关权限">
        <Tree :data="treeObject.list" show-checkbox></Tree>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <button class="button-ok addSumbit" @click="handleInforma">确定增加</button>
    </div>
    <detailDlg v-model="detailVisible" v-if="detailVisible.visible"></detailDlg>
    <editDig v-model="editVisible" v-if="editVisible.editVis"></editDig>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import detailDlg from '@/views/account/user/detailDlg.vue'
import editDig from '@/views/account/user/editDlg.vue'
import TreeList from '@/components/tree.vue'

@Component({
  components: {
    detailDlg,
    editDig,
    TreeList
  }
})
export default class Main extends ViewBase {
  detailVisible = {
    visible: false
  }
  editVisible = {
    editVis: false
  }

  form = {
    type: '',
    name: '',
    mobile: '',
    role: ''
  }

  rolelist = [{ key: 0, value: '销售人员' }, { key: 1, value: '财务人员' }]
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

  handleInforma() {}
  queryList() {
    this.detailVisible.visible = true
  }
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

