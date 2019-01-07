<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">权限管理 >新建权限角色</h2>
    <Form :model="form" label-position="left" :label-width="100" class="edit-input">
      <FormItem label="角色名称" class="item-top">
        <Input v-model="form.type" placeholder="请输入权限角色名称"></Input>
      </FormItem>
      <FormItem label="相关权限">
        <Tree :data="data2" show-checkbox></Tree>
      </FormItem>
    </Form>
    <div class="tableSubmit btnCenter">
      <button class="submitBtn button-ok" @click="handleInforma">确定增加</button>
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
    type: '',
    name: '',
    mobile: '',
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
.page {
  .ivu-form-item {
    padding-left: 30px;
    color: @c-text;
  }
}
</style>

