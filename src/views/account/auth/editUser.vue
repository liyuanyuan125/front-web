<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">权限管理 > 编辑权限角色</h2>
    <Form :model="form" label-position="left" :label-width="100" class="edit-input form">
      <FormItem label="权限角色名称">
        <Input v-model="form.name" placeholder="请输入名称"/>
      </FormItem>
      <FormItem label="相关权限">
        <Tree :data="data2" show-checkbox></Tree>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <button class="button-ok" @click="handleInforma">确定修改</button>
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

@Component({
  components: {
    detailDlg,
    editDig
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
    name: '',
    role: ''
  }

  rolelist = [{ key: 0, value: '销售人员' }, { key: 1, value: '财务人员' }]
  data2 = [
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

.form {
  padding: 20px 0 0 30px;
}
</style>


