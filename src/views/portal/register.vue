<template>
  <RegisterLayout>
    <div class="page-wrap">
      <Form :model="form" :rules="rules" label-position="left" :label-width="120"
        class="form" @submit.native.prevent="submit" ref="form">
        <DisableAutoFill/>

        <FormItem prop="systems" :label-width="0">
          <CheckboxGroup v-model="form.systems" class="check-group">
            <Checkbox label="ads" class="check-type xadvert"
              :class="{checked: form.systems.includes('ads')}"/>
            <Checkbox label="resource" class="check-type resource"
              :class="{checked: form.systems.includes('resource')}"/>
          </CheckboxGroup>
        </FormItem>

        <FormItem label="登录邮箱" prop="email" :error="emailError">
          <Input v-model="form.email" placeholder="请输入邮箱"/>
        </FormItem>
        <FormItem label="邮箱验证码" prop="captcha" :error="captchaError">
          <Input v-model="form.captcha" :maxlength="6" class="input-captcha"
            placeholder="请输入邮箱验证码"/>
          <Button class="btn-code" :disabled="codeDisabled || emailIsValid"
            @click="getCode">{{codeMsg}}</Button>
        </FormItem>

        <FormItem label="密码" prop="password">
          <Input type="password" v-model="form.password" :maxlength="16"
            placeholder="请设置包含大小写的英文字母与数字的组合，8-16 位"/>
        </FormItem>
        <FormItem label="重复密码" prop="passwordAgain">
          <Input type="password" v-model="form.passwordAgain" :maxlength="16"
            placeholder="请再次输入密码"/>
        </FormItem>

        <FormItem label="公司名称" prop="company" :error="companyError">
          <Input v-model="form.company" placeholder="请输入公司名称，并与营业执照保持一致"/>
        </FormItem>
        <FormItem label="公司所在地" prop="area">
          <AreaSelect v-model="form.area" :max-level="2" no-self/>
        </FormItem>

        <FormItem label="联系人姓名" prop="name">
          <Input v-model="form.name" placeholder="请输入您的姓名"/>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input v-model="form.mobile" :maxlength="11" placeholder="请输入您的手机号码"/>
        </FormItem>
        <FormItem label="联系人邮箱" prop="contactEmail">
          <Input v-model="form.contactEmail" placeholder="请输入您的邮箱"/>
        </FormItem>

        <FormItem class="agreement-ln">
          <Checkbox v-model="agreement">我同意并遵守
            <router-link to>《平台运营条款》</router-link>
          </Checkbox>
        </FormItem>

        <div class="submit-ln">
          <Button type="primary" html-type="submit" long
            class="submit" :disabled="submitDisabled">下一步</Button>
        </div>
      </Form>
    </div>
  </RegisterLayout>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import RegisterLayout from './registerLayout.vue'
import { countDown } from '@/fn/timer'
import { validateEmail, validatePassword, validataTel } from '@/util/validateRules'
import { sendRegisterEmail, register } from '@/api/register'
import DisableAutoFill from '@/components/DisableAutoFill.vue'
import AreaSelect from '@/components/areaSelect'
import { except } from '@/fn/object'
import { scrollToError } from '@/util/form'
import setUserByData from '@/util/setUserByData'

@Component({
  components: {
    RegisterLayout,
    DisableAutoFill,
    AreaSelect
  }
})
export default class Main extends ViewBase {
  codeDisabled = false
  codeMsg = '获取邮箱验证码'

  emailError = ''
  captchaError = ''
  companyError = ''

  agreement = true

  submitDisabled = false

  form = {
    systems: [],

    email: '',
    captcha: '',

    password: '',
    passwordAgain: '',

    company: '',
    area: [],
    provinceId: 0,
    cityId: 0,

    name: '',
    mobile: '',
    contactEmail: ''
  }

  get rules() {
    return {
      systems: [
        {
          trigger: 'change',
          validator(rule: any, value: string[], callback: any) {
            value.length == 0
              ? callback(new Error('请选择账户类型'))
              : callback()
          }
        }
      ],

      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
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

      company: [
        { required: true, message: '请输入您的公司名称', trigger: 'blur' }
      ],
      area: [
        {
          required: true,
          message: '不能为空',
          trigger: 'change',
          type: 'array',
          validator(rule: any, value: number[], callback: any) {
            const strVal = (value || []).join('');
            /^0*$/.test(strVal) ? callback(new Error(rule.message)) : callback()
          }
        }
      ],

      name: [{ required: true, message: '请输入您的姓名', trigger: 'blur' }],
      mobile: [
        { required: true, message: '请输入您的手机号', trigger: 'blur' },
        {
          trigger: 'blur',
          validator(rule: any, value: string, callback: any) {
            const msg = validataTel(value)
            msg ? callback(new Error(msg)) : callback()
          }
        }
      ],
      contactEmail: [
        { required: true, message: '请输入联系人邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
      ]
    }
  }

  get emailIsValid() {
    const failMsg = validateEmail(this.form.email)
    return !!failMsg
  }

  async getCode() {
    this.codeDisabled = true

    try {
      await sendRegisterEmail(this.form.email)

      await countDown(60, sec => {
        this.codeMsg = sec + 's'
      })

      this.codeMsg = '重新获取验证码'
    } catch (ex) {
      ((this as any)[`onGetCode${ex.code}`] || this.handleError).call(this, ex)
    } finally {
      this.codeDisabled = false
    }
  }

  onGetCode8007203() {
    this.emailError = '邮箱已被注册'
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

    if (!this.agreement) {
      return this.showError('必须存在《平台运行条款》')
    }

    this.submitDisabled = true

    try {
      const postData: any = except(this.form, 'passwordAgain,area')
      const { data } = await register(postData)

      setUserByData({
        ...data,
        systemCode: postData.systems[0],
      })

      this.$router.push({ name: 'register-complete' })
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

  onSubmit9006305() {
    this.companyError = '公司名称已被使用'
    this.scrollToError()
  }

  @Watch('form.area', { deep: true })
  watchArea(val: number[]) {
    this.form.provinceId = val[0]
    this.form.cityId = val[1]
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './common.less';
/deep/ .ivu-form-item-required .ivu-form-item-label::before {
  content: '';
}

/deep/ .ivu-steps .ivu-steps-status-process {
  .ivu-steps-head-inner span {
    font-size: 12px;
  }
}
.page-wrap {
  width: 600px;
  margin: 80px auto 0;
}

.check-group {
  display: flex;
  justify-content: space-between;
}
.check-type {
  display: inline-block;
  width: 275px;
  height: 120px;
  border: solid 1px #fff;
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
  margin: 0;
  /deep/ * {
    display: none;
  }
}
.xadvert {
  background-image: url(./assets/ggzhu.png);
  &.checked {
    background-image: url(./assets/ggzhuChecked.png);
  }
}
.resource {
  background-image: url(./assets/resource.png);
  &.checked {
    background-image: url(./assets/resourceChecked.png);
  }
}

.input-captcha {
  width: 260px;
}
.btn-code {
  margin-left: 20px;
  width: 200px;
}

.agreement-ln {
  margin-top: -10px;
}

.submit-ln {
  margin-top: -10px;
  padding-top: 40px;
  border-top: 1px solid @c-divider;
}
</style>
