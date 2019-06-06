<template>
  <div class="">
    <h3 class="plan-title">
      <span class="adver-tiele">修改密码</span>
    </h3>
    <Form ref="form" :model="from" class="auth-box edit-input from" :rules="dataRule" :label-width="100">
      <FormItem label="邮箱账号" class="item-account-email">
        <em class="login-email">{{loginEmail}}</em>
      </FormItem>
      <FormItem label="输入旧密码" prop="oldPassword">
        <Input type="password" v-model="from.oldPassword" :maxlength="16" placeholder="请输入含大小写的英文字母与数字的组合，8－16位"></Input>
      </FormItem>
      <FormItem label="输入新密码" prop="newPassword">
        <Input type="password" v-model="from.newPassword" :maxlength="16" placeholder="请输入含大小写的英文字母与数字的组合，8－16位"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="newPasswords">
        <Input type="password" v-model="from.newPasswords" :maxlength="16" placeholder="请输入含大小写的英文字母与数字的组合，8－16位"></Input>
      </FormItem>
    </Form>
    <div class="btnCenter sumbit-button">
      <Button type="primary" class="button-ok submitBtn" @click="passwordkSet('form')">修改</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { toast } from '@/ui/modal'
import { slice } from '@/fn/object'
import ViewBase from '@/util/ViewBase'
import { setPassword } from '@/api/password'
import { getUser } from '@/store'


@Component
export default class Main extends ViewBase {
  loginEmail = ''
  from = {
    oldPassword: '',
    newPassword: '',
    newPasswords: ''
  }
  mounted() {
    const use: any = getUser()
    this.loginEmail = JSON.parse(JSON.stringify(use)).email
  }
  get dataRule() {
      const password = (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请重新输入新密码'))
        } else {
          if (value !== this.from.newPassword) {
            callback(new Error('密码不匹配，请重新输入'))
          }
          callback()
        }
      }
     return {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'change' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'change' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
            message: '请输入同时包含数字、字母且长度要在8-16位之间的密码',
            trigger: 'change'
          }
        ],
        newPasswords: [
          { required: true, message: '请重新输入新密码', trigger: 'change' },
          { validator: password }
        ]
     }
  }
  async passwordkSet(form: string) {
    const valid = await (this.$refs[form] as any).validate()
    if (!valid) {
      return
    }
    try {
      const {oldPassword, newPassword} = this.from
      const data = { oldPassword, newPassword }
      await setPassword(data)
      toast('密码修改成功')
      ; (this.$refs.form as any).resetFields()
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/common.less';

.plan-title {
  padding-bottom: 20px;
  margin: 0 20px 20px;
  border-bottom: 1px solid #fff;
  .adver-tiele {
    color: #fff;
    font-size: 24px;
    font-weight: normal;
  }
}
.item-account-email {
  /deep/ .ivu-form-item-label {
    padding-left: 10px;
  }
}
.login-email {
  font-size: 14px;
  position: relative;
  color: #fff;
  top: 3px;
}
.from {
  padding: 30px 0 0 30px;
}
/deep/ .ivu-input {
  font-size: 14px;
}
/deep/ .ivu-form-item-label::before {
  display: none;
}
.auth-box {
  min-height: 270px;
  margin: 30px 40px 0;
  padding: 30px;
  background: rgba(0, 32, 45, 0.8);
  border-radius: 8px;
  /deep/ .ivu-form-item-label {
    color: #fff;
  }
  /deep/ .ivu-input-wrapper,
  /deep/ .ivu-input {
    background: rgba(255, 255, 255, 0.4);
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-radius: 5px;
    color: #fff;
    &::placeholder {
      font-size: 14px;
      color: #00202d;
    }
  }
}
.submitBtn {
  margin-top: 30px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
</style>
