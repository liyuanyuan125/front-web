<template>
  <div class="login-home">
    <header>
      <div class="nav">
        <div class="logo">
          <img src="~@/assets/login/logo.png" alt="alias" height="44px">
        </div>
        <div class="navTitle">
          <router-link tag="span" to>概览</router-link>
          <router-link tag="span" to>平台介绍</router-link>
          <router-link tag="span" to>联系咨询</router-link>
          <router-link tag="span" to>合作伙伴</router-link>
        </div>
      </div>
    </header>
    <content class="content">
      <div class="mainAuto">
        <div>
          <img src="~@/assets/login/bannerlogo.png" alt="alias" height="115px">
          <br>
          <router-link to="/register">
            <img src="~@/assets/login/bannerbtn.png" alt="alias" height="50px">
          </router-link>
        </div>
        <div>
          <div class="tablist">
            <div :class="{active: form.systemCode == 'ad'}"
              @click="form.systemCode = 'ad'">我是广告主</div>
            <div :class="{active: form.systemCode == 'resource'}"
              @click="form.systemCode = 'resource'">我是资源方</div>
          </div>
          <Form :model="form" :rules="rules" ref="form" class="form"
            @submit.native.prevent="submit" novalidate>
            <FormItem prop="email" :error="emailError">
              <Input type="email" v-model="form.email" prefix="md-person" placeholder="请输入邮箱"/>
            </FormItem>
            <FormItem prop="password" :error="passwordError">
              <Input type="password" v-model="form.password" prefix="ios-unlock-outline"
                placeholder="请输入密码" :maxlength="16"/>
            </FormItem>
            <FormItem prop="captchaCode" :error="captchaCodeError">
              <div class="captcha-wrap">
                <Input class="captcha" type="text" v-model="form.captchaCode"
                  placeholder="请输入右图验证码"/>
                <img :src="captchaImg" v-if="captchaImg" class="captcha-img"
                  title="点击更换" @click="changeCaptcha">
              </div>
            </FormItem>
            <Button type="primary" html-type="submit" long :disabled="submitDisabled">登录</Button>
            <Row class="login-etc">
              <Col span="4">
                <router-link tag="span" :to="{name: 'register'}">注册</router-link>
              </Col>
              <Col align="right" span="6" offset="14">
                <router-link tag="span" :to="{name: 'resetpwd'}">忘记密码</router-link>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </content>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { login } from '@/api/auth'
import { setUser } from '@/store'
import { getCaptchaImage } from '@/api/captcha'

@Component
export default class Main extends ViewBase {
  form = {
    systemCode: 'ad',
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
      const user = {
        id: data.userId,
        name: data.email,
        ...data,
      }
      setUser(user)
      this.$router.push({ name: 'home' })
    } catch (ex) {
      ((this as any)[`onLogin${ex.code}`] || this.handleError).call(this, ex)
    } finally {
      this.submitDisabled = false
    }
  }

  onLogin10002() {
    this.emailError = '邮箱不存在'
    this.form.captchaCode = ''
    this.changeCaptcha()
  }

  onLogin10010() {
    this.passwordError = '密码不正确'
    this.form.captchaCode = ''
    this.changeCaptcha()
  }

  onLogin600608() {
    this.captchaCodeError = '验证码不正确'
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/site/login.less';

.login-home {
  height: 100%;
  width: 100%;
  /deep/ input {
    outline: none;
    height: 50px;
    font-size: 15px;
    &:last-child {
      padding-left: 16px;
    }
  }
  /deep/ .ivu-input-prefix i {
    line-height: 50px;
  }
  .login-etc {
    margin-top: 20px;
    color: #272727;
    font-size: 14px;
  }
  header {
    background: #fff;
    .nav {
      .flex;
      .wid-auto;

      height: 124px;
      font-size: 14px;
      color: @text-color;
      cursor: pointer;
      .logo {
        flex: 1;
      }
      .navTitle {
        flex: 2;
        text-align: right;
        span {
          padding-left: 90px;
        }
      }
    }
  }
  .content {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('~@/assets/login/loginBg.png') no-repeat center;
    background-size: cover;
    .mainAuto {
      .wid-auto;

      cursor: pointer;
      display: -webkit-flex;
      display: flex;
      position: relative;
      & > div:nth-child(1) {
        padding: 80px 0 0 50px;
      }
      & > div:nth-child(2) {
        position: absolute;
        right: 90px;
        top: 80px;
        width: 400px;
        height: 500px;
        background: #fff;
        .form {
          margin: 0 50px;
        }
      }
      .tablist {
        width: 100%;
        height: 100px;
        line-height: 100px;
        background: rgba(239, 239, 239, 1);
        margin-bottom: 55px;
        .flex;

        div {
          flex: 1;
          height: 100%;
          text-align: center;
          font-size: 16px;
          position: relative;
          &.active {
            background: #fff;
            &::before {
              display: block;
              content: '';
              position: absolute;
              width: 100%;
              height: 10px;
              background: rgba(254, 129, 53, 1);
              top: 0;
              left: 0;
            }
          }
        }
      }
    }
  }
}

.captcha-wrap {
  position: relative;
  width: 100%;
}
.captcha-img {
  position: absolute;
  top: 1px;
  right: 1px;
  width: 131px;
  height: 48px;
  border-left: 1px solid @c-border;
}
</style>
