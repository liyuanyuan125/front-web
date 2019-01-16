<template>
  <div class="activeEmail">
    <Form :model="form" label-position="left" class="edit-input" :label-width="100">
      <h3 class="logo">
        <img src="~@/assets/site/logo.png">
      </h3>
      <FormItem label="登录邮箱" class="item-top">
        <Input v-model="form.firstPass" placeholder="请输入正确的邮箱地址"></Input>
      </FormItem>
      <FormItem label="登录邮箱" class="item-top">
        <Input v-model="form.secondPass" placeholder="请输入正确的邮箱地址"></Input>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <button class="button-ok addSumbit" @click="handleInforma">确定增加</button>
    </div>
  </div>
</template>
<script>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { activeEmailSumbit } from '@/api/user'

@Component
export default class Main extends ViewBase {
  form = {
    firstPass: '',
    secondPass: ''
  }
  async handleInforma() {
    try {
      await activeEmailSumbit({
        password: this.form.firstPass,
        ticket: '33333'
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>
<style lang="less" scoped>
.activeEmail {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -80%);
  .logo {
    text-align: center;
    padding-bottom: 60px;
  }
}
.addSumbit {
  margin-top: 70px;
}
</style>
