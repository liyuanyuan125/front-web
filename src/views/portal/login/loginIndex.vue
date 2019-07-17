<template>
  <loginLayout>
    <div class="main-wrap">
      <div class="tablist">
        <p class="systerm">
          <span :class="{active: form.systemCode == 'ads'}" @click="form.systemCode = 'ads'">我是广告主</span>
          <span :class="{active: form.systemCode == 'resource'}" @click="form.systemCode = 'resource'" >我是影城</span>
        </p>
      </div>
      <Form :model="form" :rules="rules" ref="form" @submit.native.prevent="submit" novalidate>
        <DisableAutoFill />
        <FormItem prop="email" :error="emailError">
          <Input type="email" v-model="form.email" autocomplete="off" disableautocomplete
           placeholder="请输入邮箱">
            <i class="iconfont icon-youxiang" slot="prefix"><font></font></i>
          </Input>
        </FormItem>
        <FormItem prop="password" :error="passwordError">
          <Input
            type="password"
            autocomplete="off"
            v-model="form.password"
            placeholder="请输入密码"
            :maxlength="16"
          >
            <i class="iconfont icon-mima" slot="prefix" size="20"><font></font></i>
          </Input>
        </FormItem>
        <FormItem prop="captchaCode" :error="captchaCodeError">
          <div class="captcha-wrap">
            <Input class="captcha" type="text" v-model="form.captchaCode" placeholder="请输入右图验证码" >
             <i class="iconfont icon-yanzhengma" slot="prefix" size="20"><font></font></i>
            </Input>
            <img
              :src="captchaImg"
              v-if="captchaImg"
              class="captcha-img"
              title="点击更换"
              @click="changeCaptcha"
            />
          </div>
        </FormItem>
        <Row class="login-etc">
          <Col span="10">
            <Checkbox v-model="form.remember">七日内免登录</Checkbox>
          </Col>
          <Col align="right" span="10" offset="4">
            <router-link :to="{name: 'resetpwd'}">
              <span class="forgot">忘记密码?</span>
            </router-link>
          </Col>
        </Row>
        <Button type="primary" html-type="submit" class="submit" long :disabled="submitDisabled">账号登录</Button>
        <div class="to-apply">还没有账户？
          <router-link :to="{name: 'apply'}">申请加入</router-link>
        </div>
      </Form>
    </div>
  </loginLayout>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { login, LoginData } from '@/api/auth'
import setUserByData from '@/util/setUserByData'
import { getCaptchaImage } from '@/api/captcha'
import loginLayout from './loginLayout.vue'
import { decodeRoute } from '@/util/base64Route'
import { info } from '@/ui/modal'
import DisableAutoFill from '@/components/DisableAutoFill.vue'

@Component({
  components: {
    loginLayout,
    DisableAutoFill
  }
})
export default class Main extends ViewBase {
  form: LoginData = {
    systemCode: 'ads',
    email: '',
    password: '',
    captchaId: '',
    captchaCode: '',
    remember: true
  }

  emailError = ''
  passwordError = ''

  captchaImg = ''
  captchaCodeError = ''

  submitDisabled = false

  rules = {
    email: [
      { required: true, message: '请输入你的邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入你的密码', trigger: 'blur' },
      {
        type: 'string',
        min: 6,
        message: '密码的个数不能少于6位',
        trigger: 'blur'
      }
    ],
    captchaCode: [{ required: true, message: '请输入图片验证码', trigger: 'blur' }]
  }

  async changeCaptcha() {
    const { id, img } = await getCaptchaImage()
    this.form.captchaId = id
    this.captchaImg = img
  }

  async resetCaptcha() {
    this.form.captchaCode = ''
    this.changeCaptcha()
  }

  created() {
    this.changeCaptcha()
  }

  async submit() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) {
      return
    }

    this.emailError = ''
    this.passwordError = ''
    this.captchaCodeError = ''

    this.submitDisabled = true

    try {
      const postData = { ...this.form }
      const { data } = await login(postData)
      setUserByData({
        ...data,
        systemCode: postData.systemCode
      })

      const { ret = '' } = this.$route.query || {}
      const route = ret && decodeRoute(ret as string) || { name: 'home' }
      this.$router.push(route)
    } catch (ex) {
      ((this as any)[`onLogin${ex.code}`] || this.handleError).call(this, ex)
      this.resetCaptcha()
    } finally {
      this.submitDisabled = false
    }
  }

  onLogin9006201() {
    this.emailError = '账号不存在'
  }

  onLogin10002() {
    this.passwordError = '密码错误'
  }

  async onLogin10008(ex: any) {
    await info('请核实您的账号角色，正确选择广告主或影城身份', {
      title: '温馨提示'
    })
  }

  onLogin10006() {
    this.captchaCodeError = '验证码错误'
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/assets/iconFont/iconfont.css';
@import './common.less';

.systerm {
  text-align: center;
  span {
    font-size: 23px;
    color: #2f6af9;
    cursor: pointer;
    &.active {
      color: #fff;
      padding-bottom: 5px;
      border-bottom: solid 1px #fff;
    }
    &:nth-child(1) {
      margin-right: 65px;
    }
  }
}
.main-wrap {
  padding-top: 44px;
  padding-bottom: 70px;
  .login-etc {
    font-size: 15px;
    color: #fff;
    .forgot {
      color: #fff;
    }
  }
}

.submit {
  margin: 29px 0 22px;
}
.captcha-wrap {
  position: relative;
  width: 100%;
}
.captcha-img {
  position: absolute;
  top: 6px;
  right: 8px;
  height: 38px;
  border-radius: 5px;
  cursor: pointer;
}
/deep/ .ivu-checkbox-inner {
  border: none;
  outline: none;
  background-color: #10172c;
  width: 19px;
  height: 19px;
  &::after {
    width: 6px;
    height: 12px;
    left: 6px;
  }
}
@media screen and(max-height: 600px) {
  .main-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
