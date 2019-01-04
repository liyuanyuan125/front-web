<template>
  <div class="page">
    <Form :model="form" label-position="left" :label-width="120">
      <h3>登录信息</h3>
      <FormItem label="账号类型">
        <Input v-model="form.type"></Input>
      </FormItem>
      <FormItem label="登录账号">
        <Input v-model="form.account"></Input>
      </FormItem>
      <h3>公司信息</h3>
      <!-- <FormItem label="公司名称">
        <Input v-model="form.type"></Input>
      </FormItem> -->
      <FormItem label="公司所在地">
        <Input v-model="form.account"></Input>
      </FormItem>
      <FormItem label="联系人">
        <Input v-model="form.type"></Input>
      </FormItem>
      <FormItem label="手机号">
        <Input v-model="form.account"></Input>
      </FormItem>
      <FormItem label="邮箱">
        <Input v-model="form.account"></Input>
      </FormItem>
      <!-- <h3>开户资质</h3>
      <FormItem label="资质类型">
        <Input v-model="form.account"></Input>
      </FormItem>
      <FormItem label="资质编号">
        <Input v-model="form.account"></Input>
      </FormItem>
      <FormItem label="资质图片">
        <Input v-model="form.account"></Input>
      </FormItem> -->
    </Form>
    <div class="btnCenter">
      <button class="submitBtn">提交申请</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  form = {
    type: '11111111',
    account: 'xxxx@.com',
    message: 'xxxx'
  }
  async mounted() {}
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@c-bg: #fff;
.page {
  background: @c-bg;
  height: 100%;
  h3 {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    padding-left: 30px;
    background: @c-head-bg;
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
    }
  }
}
</style>
