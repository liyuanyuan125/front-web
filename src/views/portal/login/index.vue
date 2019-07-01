<template>
  <div class="login-home">
    <content class="content">
      <img src="../assets/logo.png" class="login-logo"/>
      <p class="login-title">全网精准娱乐营销平台</p>
      <Button type="primary" :to="{name: 'tologin'}" class="login-but">登 录 / 注 册</Button>
    </content>
    <!-- <div class="login-whale">
      <img src="../assets/whale.png" />
    </div> -->
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { login } from '@/api/auth'
import setUserByData from '@/util/setUserByData'
import { getCaptchaImage } from '@/api/captcha'
// import detail from './detail.vue'

@Component
export default class Main extends ViewBase {
  form = {
    systemCode: 'ads',
    email: '',
    password: '',
    captchaId: '',
    captchaCode: ''
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

      this.$router.push({ name: 'home' })
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

  onLogin10002(ex: any) {
    this.handleError(ex)
  }

  onLogin10006() {
    this.captchaCodeError = '验证码错误'
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/assets/iconFont/iconfont.css';
.login-home {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background: url('../assets/logo-bg1.png') no-repeat center;
  background-size: cover;
  .login-whale {
    position: absolute;
    width: 100%;
    bottom: 0;
    text-align: center;
    img {
      width: 560px;
    }
  }
  .content {
    width: 350px;
    position: absolute;
    left: 50%;
    top: 115px;
    transform: translate(-50%, 0);
    text-align: center;
    .login-logo {
      width: 350px;
    }
    .login-title {
      font-size: 34px;
      color: #fff;
      margin-bottom: 40px;
    }
  }
  /deep/ .ivu-btn {
    width: 250px;
    height: 38px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    background: #2f6af9;
    border-radius: 17px;
    border: none;
  }
}
// media < 600 屏幕适配
@media screen and(max-height: 600px) {
  .login-home {
    .login-whale {
      position: absolute;
      width: 100%;
      bottom: 0;
      text-align: center;
      img {
        width: 350px;
      }
    }
    .content {
      width: 350px;
      position: absolute;
      left: 50%;
      top: 25px;
      transform: translate(-50%, 0);
      text-align: center;
      .login-logo {
        width: 300px;
      }
      .login-title {
        font-size: 27px;
        color: #fff;
        margin-bottom: 30px;
      }
    }
  }
}

</style>
