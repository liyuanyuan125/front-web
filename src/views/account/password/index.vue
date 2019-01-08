<template>
  <div class="page home-bg">
    <Form :model="from" class="edit-input from" :label-width="100">
      <FormItem label="登录邮箱">
        <span>xxxxxxxxx.com</span>
      </FormItem>
      <FormItem label="输入旧密码">
        <Input v-model="from.input" placeholder="请输入旧密码" :maxlength="16"></Input>
      </FormItem>
      <FormItem label="设置新密码">
        <Input v-model="from.input" placeholder="请输入新密码" :maxlength="16"></Input>
      </FormItem>
      <FormItem label="确定密码">
        <Input v-model="from.input" placeholder="请确定密码" :maxlength="16"></Input>
      </FormItem>
    </Form>
    <div class="btnCenter sumbit-button">
      <button class="button-ok">确定修改</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  from = {
    input: 'xxxxxxx'
  }
  async mounted() {}
}
</script>

<style lang="less" scoped>
.from {
  padding: 30px 0 0 30px;
}
</style>
