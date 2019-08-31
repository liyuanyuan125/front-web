<template>
  <loginLayout>
    <div class="main-wrap">
      <div class="tablist">
        <p class="systerm">登录 </p>
      </div>
      <Form :model="form" :rules="rules" ref="form" @submit.native.prevent="submit" novalidate>
        <FormItem prop="email" :error="emailError">
          <Input type="email" v-model="form.email" class="some-class" autocomplete="off" disableautocomplete
           placeholder="请输入账号">
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
        <Button type="primary" html-type="submit" class="submit" long >账号登录</Button>
        <div class="to-register-apply">
          <router-link :to="{name: 'apply'}">给平台留言</router-link>
          <router-link :to="{name: 'register'}">立即注册</router-link>
        </div>
      </Form>

      <!-- 选择登录方式 -->
      <Modal v-model="visLogin" width="700px" class="comDlg" :key="keyRandom">
        <h2 class="title">选择登录方式</h2>
        <RadioGroup v-model="form.systemCode" class="check-way">
           <Radio v-for="(item, index) in systems" :key="index" :label="item.code" 
           class="check-type" :class="[item.code ? item.code : null, {checked: form.systemCode == item.code}]">
              <div class="check-name">{{item.name}}</div>
            </Radio>
        </RadioGroup>
     </Modal>

    </div>
  </loginLayout>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { login, LoginData } from '@/api/auth'
import setUserByData from '@/util/setUserByData'
import { getCaptchaImage } from '@/api/captcha'
import loginLayout from './loginLayout.vue'
import { decodeRoute } from '@/util/base64Route'
import { info } from '@/ui/modal'
import { random } from '@/fn/string'

@Component({
  components: {
    loginLayout
  }
})
export default class Main extends ViewBase {

  visLogin = false
  systems: any[] = []

  keyRandom = ''

  form: LoginData = {
    systemCode: '',
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

  rules = {
    email: [
      { required: true, message: '请输入你的账号', trigger: 'blur' },
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
    // 假如是一种身份直接登录(如果是区域代理身份则弹框禁止登录)
    // 多种身份弹框选择
    try {
      this.systems = [
        {code: 'ads', secondaryCode: 'daili', status: 1, name: '广告主'},
        {code: 'resource', secondaryCode: 'agent', status: 1, name: '资源方'},
        {code: 'producer', secondaryCode: 'agent', status: 1, name: '片商'},
      ]

      if (this.systems.length == 1) {
        if (this.systems[0].code == 'regAgency') { // 区域代理
         await info('很抱歉，此类客户相关功能仍未开放，敬请期待', {
            title: '您的身份为：区域推广代理',
            okText: '我知道了'
         })
         this.$router.push({name: 'login'})
        } else {
          this.form.systemCode = this.systems[0].code
        }
      } else {
        this.visLogin = true
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async handleSubmit() {
    this.emailError = ''
    this.passwordError = ''
    this.captchaCodeError = ''

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
      this.keyRandom = random()
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

  @Watch('form.systemCode')
  watchSystemCode() {
    this.handleSubmit()
    this.visLogin = false
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/assets/iconFont/iconfont.css';
@import '~@/views/account/information/common.less';
@import './common.less';
.main-wrap {
  padding-bottom: 50px;
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
.to-register-apply {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  a {
    color: #fff;
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
