<template>
  <div class="loginHome">
    <header>
      <div class="nav">
        <div class="logo">
          <img src="../assets/logo.png" height="44px">
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
          <img src="../assets/bannerlogo.png" height="115px">
          <br>
          <router-link to="/register">
            <img src="../assets/bannerbtn.png" height="50px">
          </router-link>
        </div>
        <div>
          <div class="tablist">
            <div :class="{active:activeTab}" @click="tabs(1)">我是广告主</div>
            <div :class="{active:!activeTab}" @click="tabs(2)">我是资源方</div>
          </div>
          <Form :model="form" :rules="rules" ref="form" class="form">
            <FormItem prop="email" :error="emailError">
              <Input type="email" v-model="form.email" prefix="md-person" placeholder="请输入邮箱"/>
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                v-model="form.password"
                prefix="ios-unlock-outline"
                placeholder="请输入密码"
              />
            </FormItem>
            <FormItem prop="code" :error="codeError">
              <Input class="code" type="text" v-model="form.code" prefix placeholder="请输入右图验证码"/>
            </FormItem>
            <Button type="warning" long @click="submit('form')" class="submit">登录</Button>
            <Row class="toRegister">
              <Col span="4">
                <router-link tag="span" to="/register">注册</router-link>
              </Col>
              <Col align="right" span="6" offset="14">
                <router-link tag="span" to="/forgetpass">忘记密码</router-link>
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

@Component
export default class Main extends ViewBase {
  form = {
    email: '',
    password: '',
    code: ''
  }

  emailError = ''
  codeError = ''

  activeTab = true
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
    code: [{ required: true, message: '请输入你的验证码', trigger: 'blur' }]
  }

  tabs(val: number) {
    val === 2 ? (this.activeTab = false) : (this.activeTab = true)

    // https://router.vuejs.org/zh/api/#router-link
  }

  async submit() {
    const valid = await (this.$refs.form as any).validate()
    if (valid) {
      try {
        const {
          data: { user }
        } = await login({
          username: this.form.email,
          password: this.form.password,
          imageCode: this.form.code
        })
        setUser(user)
        // debugger
        // this.$router.push({ name: 'register' })
      } catch (ex) {
        (this as any)[`onAjax${ex.code}`].call(this, ex)
      }
    }
  }

  onAjax600600() {
    this.emailError = '邮箱不存在'
  }

  onAjax600608() {
    this.codeError = '验证码不正确'
  }
}
</script>

<style lang='less' scoped>
@import '../site/login.less';

.loginHome {
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
  /deep/ .ivu-btn {
    padding: 0;
    background: #fe8135;
    font-size: 16px;
    height: 50px;
  }
  /deep/ .ivu-input-prefix i {
    line-height: 50px;
  }
  .toRegister {
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
    background: url('../assets/loginBg.png') no-repeat center;
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
</style>
