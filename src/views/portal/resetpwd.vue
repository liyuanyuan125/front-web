<template>
  <registerLayout>
    <div class="main-wrap">
      <div class="tablist">
        <p class="systerm">找回密码</p>
      </div>

      <Form :model="form" :rules="rules" class="form" @submit.native.prevent="submit" ref="form">
        <DisableAutoFill/>

        <FormItem prop="email">
          <Input  v-model="form.email" placeholder="请输入手机号或邮箱" />
        </FormItem>
        <FormItem prop="captcha" :error="captchaError" class="form-item-getcode">
          <Input v-model="form.captcha" :maxlength="6" class="input-captcha"
            placeholder="请输入获取验证码"/>
          <Button class="btn-code" :disabled="codeDisabled || emailOrMobileValid" @click="getCode">{{codeMsg}}</Button>
        </FormItem>
        <FormItem  prop="password">
          <Input type="password" v-model="form.password" :maxlength="16" placeholder="请设置包含大小写的英文字母与数字的组合，8-16 位"/>
        </FormItem>
        <FormItem  prop="passwordAgain">
          <Input type="password" v-model="form.passwordAgain" :maxlength="16" placeholder="请再次输入密码"/>
        </FormItem>

        <div class="submit-ln submit-reset">
          <Button type="primary" html-type="submit" long class="submit"
            :disabled="submitDisabled">提交</Button>
        </div>

        <p class="to-apply"><router-link :to="{name: 'tologin'}">返回登录</router-link> </p>
        
      </Form>
    </div>
  </registerLayout>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { countDown } from '@/fn/timer'
import { validateEmail, validatePassword, validataTel } from '@/util/validateRules'
import { except } from '@/fn/object'
import DisableAutoFill from '@/components/DisableAutoFill.vue'
import { sendResetpwdEmail, resetPassword, mobileOrEmail} from '@/api/register'
import { success } from '@/ui/modal'
import registerLayout from './login/loginLayout.vue'

@Component({
  components: {
    DisableAutoFill,
    registerLayout
  }
})
export default class Main extends ViewBase {
  codeDisabled = false
  codeMsg = '获取验证码'

  emailError = ''
  captchaError = ''

  submitDisabled = false

  form = {
    email: '',
    captcha: '',
    password: '',
    passwordAgain: '',
    requestId: null
  }

  rules = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      {
        trigger: 'blur',
        validator(rule: any, value: string, callback: any) {
          const msg = value && value.indexOf('@') != -1 ? validateEmail(value) : validataTel(value)
          msg ? callback(new Error(msg)) : callback()
        }
      },
    ],
    captcha: [
      { required: true, message: '请输入验证码', trigger: 'blur' }
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

  get emailOrMobileValid() {
    const isExist = this.form.email && this.form.email.indexOf('@')
    const failMsg = isExist != -1 ? validateEmail(this.form.email) : validataTel(this.form.email)
    return !!failMsg
  }

  async getCode() {
    this.codeDisabled = true

    try {
      const {data} = await mobileOrEmail({mobileOrEmail: this.form.email, codeType: 'pwd-reset' })
      this.form.requestId = data.requestId ? data.requestId : null

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

  async submit() {
    const form = this.$refs.form as any
    const valid = await form.validate()
    if (!valid) { return }

    this.submitDisabled = true
    // email or mobile
    let formData = {}
    if (this.form.email.indexOf('@') != -1) {
      const postData = except(this.form, 'passwordAgain,requestId')
      formData = postData
    } else {
      const postData = except(this.form, 'passwordAgain,email')
      formData = {
        ...postData,
        mobile: this.form.email
      }
    }

    try {
      const { data } = await resetPassword(formData)
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
  }

  onSubmit8007303() {
    this.captchaError = '验证码错误'
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './login/common.less';

/deep/ .form-item-getcode {
  .ivu-form-item-content {
    display: flex;
    justify-content: space-between;
  }
}
.submit-reset {
  margin-bottom: 15px;
}
.input-captcha {
  width: 230px;
}
/deep/ .ivu-cascader {
  .ivu-input {
    padding-left: 20px;
  }
}
/deep/ .form .ivu-input {
  padding-left: 20px;
}
.btn-code {
  width: 126px;
  height: 48px;
  background-color: #2f6af9;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  border: none;
  &:hover {
    background: #2f6af9;
    color: #fff;
  }
}

</style>
