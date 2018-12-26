<template>
  <div  class="firstNext">
    <com-header></com-header>
    <Form
     
      ref="form"
      :model="form"
      :rules="rulesfrom"
      label-position="left"
      :label-width="120"
    >
      <FormItem label="登录邮箱" prop="email">
        <Input v-model="form.email" placeholder="请输入登录邮箱"></Input>
      </FormItem>
      <FormItem label="邮箱验证码" prop="emailCode" class="getEmailCode">
        <Input v-model="form.emailCode" :maxlength="6" placeholder="请输入邮箱验证码"></Input>
        <span @click="getCode">{{codeMess}}</span>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="form.password" :maxlength="16" placeholder="请设置包含大小写的英文字母与数字的组合"></Input>
      </FormItem>
      <FormItem label="重复密码" prop="confirm">
        <Input v-model="form.confirm" :maxlength="16" placeholder="请再次输入密码"></Input>
      </FormItem>
    </Form>
    <Button type="warning" @click="next" long class="submit">下一步</Button>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import View from '@/util/View'
import comHeader from '../views/header/head.vue'
import { countDown } from '@/fn/timer'
import { email } from '@/util/common.ts'

@Component({
  components: {
    comHeader
  }
})
export default class Main extends View {
  codeMess = '获取邮箱验证码'
  isRun = false

  form = {
    email: '',
    emailCode: '',
    password: '',
    confirm: ''
  }
  rulesfrom = {
    email: [
      { required: true, message: '请输入登录邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
    ],
    emailCode: [
      { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
    ],
    password: [{ required: true, message: '请输入你的密码', trigger: 'blur' }],
    confirm: [{ required: true, message: '请再次输入密码', trigger: 'blur' }]
  }
  async downTime() {
    this.isRun = true
    await countDown(10, sec => {
      this.codeMess = sec + 's'
    })

    this.codeMess = '重新获取验证码'
    this.isRun = false
  }
  getCode() {
    if (email(this.form.email)) {
      if (!this.isRun) {
        this.downTime()
      }
    } else {
      this.showWaring('用户邮箱格式有误')
    }
  }
  async next() {
    const valid = await (this.$refs.form as any).validate()
    if (valid) {
      this.$emit('iscurrent', 1)
    }
  }
}
</script>
<style lang="less" scoped>
@import '../site/login.less';
.firstNext {
  width: 600px;
  margin: 80px auto 40px;
  .submit{
      .form-btn
  }
  & > form {
    margin-top: 40px;
    border-bottom: 1px solid rgba(239, 239, 239, 1);
  }
  /deep/ .ivu-select-selection {
    height: 50px;
  }
  /deep/ .ivu-select-selected-value {
    height: 50px;
    line-height: 50px;
    font-size: 15px;
  }
  /deep/ .ivu-select-placeholder {
    height: 50px;
    line-height: 50px;
    font-size: 15px;
  }

  .getEmailCode {
    .ivu-input-wrapper {
      width: auto;
    }
    /deep/ input {
      width: 260px;
    }
    /deep/ span {
      width: 200px;
      display: block;
      .form-input;
      cursor: pointer;
      line-height: 50px;
      border: solid 1px #dcdee2;
      text-align: center;
      background: #ffffff;
      position: absolute;
      right: 0;
      top: 0;
      color: @theme-color;
    }
  }
  .ivu-form-item {
    margin-bottom: 40px;
    /deep/ .ivu-form-item-label {
      .form-label;
    }
  }
  .ivu-checkbox-wrapper {
    font-size: 14px;
  }
  .ivu-input-wrapper {
    /deep/ input {
      .form-input;
    }
   /deep/ button{
        height: 50px;
        line-height: 50px;
    }
  }
}
</style>


