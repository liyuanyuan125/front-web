<template>
  <PortalLayout>
    <div class="forgetpass">找回密码</div>
    <div class="reset-pwd">
      <Form :model="form" :rules="rules" class="form" label-position="left"
        :label-width="120" @submit.native.prevent="submit" ref="form">
        <DisableAutoFill/>

        <FormItem label="登录邮箱" prop="email" :error="emailError">
          <Input v-model="form.email" placeholder="请输入注册时的邮箱地址"/>
        </FormItem>
        <FormItem label="邮箱验证码" prop="captcha" :error="captchaError">
          <Input v-model="form.captcha" :maxlength="6" class="input-captcha"
            placeholder="请输入邮箱验证码"/>
          <Button class="btn-code" :disabled="codeDisabled || emailIsValid"
            @click="getCode">{{codeMsg}}</Button>
        </FormItem>

        <FormItem label="密码" prop="password">
          <Input type="password" v-model="form.password" :maxlength="16"
            placeholder="请设置包含大小写的英文字母与数字的组合，8－16位的新密码"/>
        </FormItem>
        <FormItem label="重复密码" prop="passwordAgain">
          <Input type="password" v-model="form.passwordAgain" :maxlength="16"
            placeholder="请再次输入密码"/>
        </FormItem>

        <div class="submit-ln">
          <Button type="primary" html-type="submit" long class="submit"
            :disabled="submitDisabled">提交</Button>
        </div>
      </Form>
    </div>
  </PortalLayout>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import PortalLayout from './portalLayout.vue'
import { countDown } from '@/fn/timer'
import { validateEmail, validatePassword } from '@/util/validateRules'
import { except } from '@/fn/object'
import { scrollToError } from '@/util/form'
import DisableAutoFill from '@/components/DisableAutoFill.vue'
import { sendResetpwdEmail, resetPassword } from '@/api/register'
import { success } from '@/ui/modal'
import { setTimeout } from 'timers'
import { now } from 'moment'

@Component({
  components: {
    PortalLayout,
    DisableAutoFill
  }
})
export default class Main extends ViewBase {
  codeDisabled = false
  codeMsg = '获取邮箱验证码'

  emailError = ''
  captchaError = ''

  submitDisabled = false

  form = {
    email: '',
    captcha: '',
    password: '',
    passwordAgain: '',
  }

  rules = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式有误', trigger: 'blur' },
    ],
    captcha: [
      { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
    ],

    password: [
      {
        required: true,
        message: '请输入你的密码',
        trigger: 'blur'
      },
      {
        trigger: 'blur',
        validator(rule: any, value: string, callback: any) {
          const msg = validatePassword(value)
          msg ? callback(new Error(msg)) : callback()
        }
      }
    ],
    passwordAgain: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        trigger: 'blur',
        validator: (rule: any, value: string, callback: any) => {
          value != this.form.password
            ? callback(new Error('两次密码不一致，请重新输入'))
            : callback()
        }
      }
    ],
  }

  get emailIsValid() {
    const failMsg = validateEmail(this.form.email)
    return !!failMsg
  }
  async getCode() {
    this.codeDisabled = true

    try {
      await sendResetpwdEmail(this.form.email)

      await countDown(60, sec => {
        this.codeMsg = sec + 's'
      })

      this.codeMsg = '重新获取验证码'
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.codeDisabled = false
    }
  }

  scrollToError() {
    const form = this.$refs.form as any
    this.$nextTick(() => scrollToError(form))
  }

  async submit() {
    const form = this.$refs.form as any
    const valid = await form.validate()
    if (!valid) {
      return this.scrollToError()
    }

    this.submitDisabled = true

    try {
      const postData = except(this.form, 'passwordAgain,area')
      const { data } = await resetPassword(postData)
      await success('重置密码成功')
      this.$router.push({ name: 'login' })
    } catch (ex) {
      ((this as any)[`onSubmit${ex.code}`] || this.handleError).call(this, ex)
    } finally {
      this.submitDisabled = false
    }
  }

  onSubmit8007203() {
    this.emailError = '邮箱已存在'
    this.scrollToError()
  }

  onSubmit8007303() {
    this.captchaError = '验证码错误'
    this.scrollToError()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './common.less';
/deep/ .ivu-form-item-required .ivu-form-item-label::before {
  content: '';
}
.forgetpass {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  font-size: 15px;
  color: @c-button;
  border-bottom: solid 1px @c-divider;
  padding: 50px 0 20px;
}

.reset-pwd {
  width: 600px;
  margin: auto;
  padding: 80px auto 40px;
}

.input-captcha {
  width: 260px;
}
.btn-code {
  margin-left: 20px;
  width: 200px;
}

.submit-ln {
  margin-top: 100px;
}
</style>
