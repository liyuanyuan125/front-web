<template>
  <div class="page">
    <h2 class="title">用户管理 > 新增子用户</h2>
    <Form :model="form" label-position="left" :label-width="100">
      <h3>设置登录账号</h3>
      <FormItem label="邮箱类型" class="padItem">
        <Input v-model="form.type" placeholder="请输入正确的邮箱地址"></Input>
      </FormItem>
      <h3>设置联系人（选项）</h3>
      <FormItem label="联系人名称" class="padTop">
        <Input v-model="form.name" placeholder="请输入联系人名称"></Input>
      </FormItem>
      <FormItem label="手机号码" class="padbottom">
        <Input v-model="form.mobile" placeholder="请输入手机号码"></Input>
      </FormItem>
      <h3>关联影院（选项）</h3>
      <div class="rows">
        <Row>
          <Col :span="12">
            <p>覆盖区域 0 个</p>
            <p>覆盖省份 0 个</p>
            <p class="btn">查看已关联影院列表</p>
          </Col>
          <Col :span="12">
            <p>覆盖区域 0 个</p>
            <p>覆盖省份 0 个</p>
            <p class="btn">编辑关联影院</p>
          </Col>
        </Row>
      </div>
      <h3>设置账号权限</h3>
      <FormItem label="权限角色" class="padTop">
        <Select v-model="form.role">
          <Option :value="item.key" v-for="item in rolelist">{{item.value}}</Option>
        </Select>
      </FormItem>
      <FormItem label="相关权限">
        <Tree :data="data2" show-checkbox></Tree>
      </FormItem>
    </Form>
    <div class="tableSubmit btnCenter">
      <button class="submitBtn" @click="handleInforma">确定增加</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

export default class Main extends ViewBase {
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

