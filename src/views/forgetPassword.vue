<template>
  <div>
    <com-header></com-header>
    <div class="forgetpass">找回密码</div>
    <div class="firstNext">
      <Form ref="form" :model="form" :rules="rulesfrom" label-position="left" :label-width="120">
        <FormItem label="登录邮箱" prop="email">
          <Input v-model="form.email" placeholder="请输入登录邮箱"/>
        </FormItem>
        <FormItem label="邮箱验证码" prop="emailCode">
          <Input
            v-model="form.emailCode"
            :maxlength="6"
            style="width:260px;"
            placeholder="请输入邮箱验证码"
          />
          <span @click="getCode" class="codemess">{{codeMess}}</span>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="form.password" :maxlength="16" placeholder="请设置包含大小写的英文字母与数字的组合"/>
        </FormItem>
        <FormItem label="重复密码" prop="confirm">
          <Input v-model="form.confirm" :maxlength="16" placeholder="请再次输入密码"/>
        </FormItem>
      </Form>
      <Button type="warning" @click="next" long class="submit">下一步</Button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { countDown } from '@/fn/timer'
import { email } from '@/util/common.ts'
import comHeader from '@/views/header/head.vue'

@Component({
  components: {
    comHeader
  }
})
export default class Main extends ViewBase {
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

.forgetpass {
  .wid-auto;

  text-align: center;
  font-size: 15px;
  color: @theme-color;
  border-bottom: solid 1px #efefef;
  padding: 50px 0 20px;
}
.firstNext {
  width: 600px;
  margin: 80px auto 40px;
  .submit {
    .form-btn;

    margin-top: 30px;
  }
  & > form {
    margin-top: 40px;
    .ivu-form-item {
      margin-bottom: 40px;
      /deep/.ivu-form-item-label {
        .form-label;
      }
      /deep/ .ivu-form-item-content {
        input {
          .form-input;
        }
        span.codemess {
          width: 200px;
          display: block;
          .form-input;

          cursor: pointer;
          line-height: 50px;
          border: solid 1px #dcdee2;
          text-align: center;
          background: #fff;
          position: absolute;
          right: 0;
          top: 0;
          color: @theme-color;
        }
      }
    }
  }
}
</style>


