<template>
  <div class="login-home">
    <content class="content">
      <div class="to-register">还没有账户？<router-link :to="{name: 'register'}"><span>立即注册</span></router-link></div>
      <div class="main-wrap">
        <div>
          <img src="../assets/home-logo.png" alt="alias" class="home-logo">
        </div>
        <!-- 第二个版本 -->
        <div class="tab-list">
          <p class="systerm">
            <span :class="{active: form.systemCode == 'ads'}" @click="form.systemCode = 'ads'">广告主</span>
            <span :class="{active: form.systemCode == 'resource'}" @click="form.systemCode = 'resource'">资源方</span>
          </p>

          <Form :model="form" :rules="rules" ref="form" class="form-list"
            @submit.native.prevent="submit" novalidate>
            <FormItem prop="email" :error="emailError">
              <Input type="email" v-model="form.email" placeholder="请输入邮箱">
                <!-- <i class="iconfont icon-ren" slot="prefix" /> -->
              </Input>
            </FormItem>
            <FormItem prop="password" :error="passwordError">
              <Input type="password" autocomplete="off" v-model="form.password" placeholder="请输入密码" :maxlength="16">
                 <!-- <i class="iconfont icon-mima" slot="prefix" size="20" /> -->
              </Input>
            </FormItem>
            <!-- <FormItem prop="captchaCode" :error="captchaCodeError">
              <div class="captcha-wrap">
                <Input class="captcha" type="text" v-model="form.captchaCode"
                  placeholder="请输入右图验证码"/>
                <img :src="captchaImg" v-if="captchaImg" class="captcha-img"
                  title="点击更换" @click="changeCaptcha">
              </div>
            </FormItem> -->
            <Row class="login-etc">
              <Col span="10">
               <Radio v-model="toLogin">七日内免登陆</Radio>
              </Col>
              <Col align="right" span="10" offset="4">
                <router-link :to="{name: 'resetpwd'}"><span class="forgot">忘记密码?</span></router-link>
              </Col>
            </Row>
             <Button type="primary" class="submit" html-type="submit" long :disabled="submitDisabled">登录</Button>
          </Form>
        </div>

        <!-- <div>
          <div class="tablist">
            <div :class="{active: form.systemCode == 'ads'}" @click="form.systemCode = 'ads'">
              <p v-if="form.systemCode == 'resource'" >我是广告主</p>
              <p v-if="form.systemCode == 'ads'" class="adv-ative-text"><span>广告主</span><em>我是</em></p>
            </div>
            <div :class="{active: form.systemCode == 'resource'}" @click="form.systemCode = 'resource'">
              <p v-if="form.systemCode == 'ads'" >我是资源方</p>
              <p v-if="form.systemCode == 'resource'" class="adv-ative-text"><span>资源方</span><em>我是</em></p>
            </div>
          </div>

          <Form :model="form" :rules="rules" ref="form" class="form"
            @submit.native.prevent="submit" novalidate>
            <FormItem prop="email" :error="emailError">
              <Input type="email" v-model="form.email" placeholder="请输入邮箱">
                <i class="iconfont icon-ren" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="password" :error="passwordError">
              <Input type="password" autocomplete="off" v-model="form.password" placeholder="请输入密码" :maxlength="16">
                 <i class="iconfont icon-mima" slot="prefix" size="20" />
              </Input>
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
        </div> -->
      </div>
    </content>

    <!-- <detail /> -->
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { login } from '@/api/auth'
import setUserByData from '@/util/setUserByData'
import { getCaptchaImage } from '@/api/captcha'
import detail from './detail.vue'
@Component({
  components: {
    detail
  }
})
export default class Main extends ViewBase {
  form = {
    systemCode: 'ads',
    email: '',
    password: '',
    captchaId: '',
    captchaCode: ''
  }

  toLogin = false

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

  // async changeCaptcha() {
  //   const { id, img } = await getCaptchaImage()
  //   this.form.captchaId = id
  //   this.captchaImg = img
  // }

  // async resetCaptcha() {
  //   this.form.captchaCode = ''
  //   this.changeCaptcha()
  // }

  // created() {
  //   this.changeCaptcha()
  // }

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
      // this.resetCaptcha()
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
// @import '~@/site/login.less';
@import '~@/assets/iconFont/iconfont.css';

.nav,
.main-wrap {
  width: 550px;
  text-align: center;
  position: absolute;
  left: 14%;
  top: 50%;
  transform: translateY(-65%);
  .home-logo {
    height: 255px;
  }
}
.to-register {
  font-size: 20px;
  color: #000;
  text-align: right;
  padding: 56px 57px 0 0;
  span {
    border: solid 1px rgba(12, 3, 6, 1);
    border-radius: 38px;
    color: #000;
    padding: 10px 23px;
  }
}
.tab-list {
  width: 500px;
  .systerm {
    text-align: center;
    padding: 36px 0 20px;
    span {
      font-size: 27px;
      color: #000;
      cursor: pointer;
      &.active {
        color: #2c53a0;
      }
      &:nth-child(1) {
        margin-right: 30px;
      }
    }
  }
  .form-list {
    width: 360px;
    margin: 0 auto;
    .submit {
      height: 47px;
      background: #2c53a0;
      border-radius: 26px;
      text-align: center;
      border: 0;
      font-size: 22px;
      margin-top: 25px;
    }
    /deep/ .ivu-input-wrapper {
      .ivu-input {
        border-radius: 24px;
        border: solid 1px rgba(0, 0, 0, .5);
      }
    }
    /deep/ .ivu-radio-wrapper {
      font-size: 17px;
      .ivu-radio-inner {
        width: 20px;
        height: 20px;
      }
    }
  }
}

.adv-ative-text {
  padding-top: 23px;
  color: #444;
  span {
    display: block;
    font-size: 22px;
  }
  em {
    display: block;
    font-size: 14px;
  }
}
.login-home {
  position: absolute;
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
  // /deep/ .ivu-input-with-prefix {
  //   padding-left: 40px;
  // }
  // /deep/ .ivu-input-prefix {
  //   width: 33px;
  //   text-align: right;
  //   i {
  //     line-height: 50px;
  //     font-size: 19px;
  //     color: #bbb;
  //   }
  // }
  .login-etc {
    margin-top: 20px;
    color: #000;
    font-size: 17px;
    .forgot {
      color: #000;
    }
  }
  // header {
  //   background: #fff;
  //   .nav {
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;

  //     height: 110px;
  //     font-size: 14px;
  //     color: @c-text;
  //     cursor: pointer;
  //     .logo {
  //       flex: 1;
  //     }
  //     .nav-title {
  //       flex: 2;
  //       text-align: right;
  //       span {
  //         padding-left: 90px;
  //       }
  //     }
  //   }
  // }
  .content {
    display: block;
    width: 100%;
    height: 100%;
    background: url('../assets/home-bg.png') no-repeat center;
    background-size: cover;
    // .main-wrap {
    //   // position: relative;
    //   // cursor: pointer;
    //   // & > div:nth-child(1) {
    //   //   padding: 80px 0 0 50px;
    //   // }
    //   // & > div:nth-child(2) {
    //   //   position: absolute;
    //   //   right: 90px;
    //   //   top: 80px;
    //   //   width: 400px;
    //   //   height: 500px;
    //   //   background: #fff;
    //   //   .form {
    //   //     margin: 0 50px;
    //   //   }
    //   // }
    //   .tablist {
    //     width: 100%;
    //     height: 100px;
    //     background: rgba(239, 239, 239, 1);
    //     margin-bottom: 55px;
    //     div {
    //       flex: 1;
    //       height: 100%;
    //       text-align: center;
    //       font-size: 16px;
    //       position: relative;
    //       display: flex;
    //       justify-content: center;
    //       align-items: center;
    //       &.active {
    //         background: #fff;
    //         &::before {
    //           display: block;
    //           content: '';
    //           position: absolute;
    //           width: 100%;
    //           height: 10px;
    //           background: rgba(254, 129, 53, 1);
    //           top: 0;
    //           left: 0;
    //         }
    //       }
    //     }
    //   }
    // }
  }
}
// 做适配 < 580
@media screen and(max-height: 600px) {
  .main-wrap {
    left: 10%;
    transform: translateY(-50%);
    .home-logo {
      height: 180px;
    }
  }
}
</style>
