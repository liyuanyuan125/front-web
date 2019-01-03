<template>
  <div class="page">
    <h2 class="title">权限管理 > 编辑权限角色</h2>
    <Form :model="form" label-position="left" :label-width="100">
       <FormItem label="权限角色名称">
        <Input v-model="form.name" placeholder="请输入名称"/>
      </FormItem>
      <FormItem label="相关权限">
        <Tree :data="data2" show-checkbox></Tree>
      </FormItem>
    </Form>
    <div class="tableSubmit btnCenter">
      <button class="submitBtn" @click="handleInforma">确定修改</button>
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
@import '~@/site/common.less';
.page {
  height: 100%;
  background: #fff;
  .title {
    height: 50px;
    padding: 14px 30px 33px;
    font-size: 14px;
    border-bottom: solid 10px #f2f2f2;
    color: @c-link;
  }
  .ivu-form-item {
    padding-left: 30px;
    color: @c-text;
    /deep/ .ivu-form-item-label {
      font-size: 14px;
      padding: 14px 12px 14px 0;
    }
    /deep/ .ivu-form-item-content {
      .ivu-input-wrapper {
        width: 400px;
        /deep/ .ivu-input {
          height: 40px;
          line-height: 40px;
        }
      }
      .ivu-select {
        width: 400px;
        .ivu-select-selection {
          height: 40px;
          .ivu-select-selected-value {
            height: 40px;
            line-height: 40px;
          }
          .ivu-select-placeholder {
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }
  }
  h3 {
    .h3Bg;
  }
  .rows {
    padding: 20px 30px 35px;
    font-size: 14px;
    p {
      padding-bottom: 15px;
      &.btn {
        color: @c-button;
        padding-top: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>


