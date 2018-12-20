
<template>
  <div>
    <header-com></header-com>
    <div class='steps'>
      <Steps :current='current'>
        <Step title='创建帐号' style='width:33.3%'></Step>
        <Step title='添加公司信息' style='width:33.3%'></Step>
        <Step title='补充资质' style='width:33.3%'></Step>
      </Steps>
    </div>
    <div class='firstNext'>
      <Row type='flex' justify='space-between'>
        <Col :span='11'>
        <p><img src='../assets/img1.png' width='275px'></p>
        </Col>
        <Col :span='11'>
        <p><img src='../assets/img-hover.png' width='275px'></p>
        </Col>
      </Row>
      <Form ref='form' :model='form' :rules='rulesfrom' label-position='left' :label-width='120'>
        <FormItem label='登录邮箱' prop='email'>
          <Input v-model='form.email' placeholder='请输入登录邮箱'></Input>
        </FormItem>
        <FormItem label='邮箱验证码' prop='emailCode'>
          <Input v-model='form.emailCode' :maxlength='6' placeholder='请输入邮箱验证码'></Input>
        </FormItem>
        <FormItem label='密码' prop='password'>
          <Input v-model='form.password' @keyup='handlekeyup' :maxlength='16' placeholder='请输入密码'></Input>
        </FormItem>
        <FormItem label='重复密码' prop='confirm'>
          <Input v-model='form.confirm' @keyup='handlekeyup' :maxlength='16' placeholder='请再次输入密码'></Input>
        </FormItem>
        <FormItem>
          <p>
            <Checkbox v-model='single'>我同意并遵守
              <router-link to=''>《平台运营条款》</router-link>
            </Checkbox>
          </p>
        </FormItem>
        <Button type='warning' long class="submit">下一步</Button>
      </Form>
     
    </div>
    <footer-com></footer-com>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import View from '@/util/View'
import headerCom from '../components/header/head.vue'
import footerCom from '../components/header/footer.vue'
@Component({
  components: {
    headerCom,
    footerCom
  }
})
export default class Main extends View {
  current = 0
  single = true
  form = {
    email: '',
    emailCode: '',
    password: '',
    confirm: ''
  }
  validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入你的密码'))
    } else {
      if (this.form.password !== '') {
        // 对第二个密码框单独验证
        (this.$refs.form as any).validateField('confirm')
      }
      callback()
    }
  }
  validatePassCheck = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入你的确定密码'))
    } else if (value !== this.form.password) {
      callback(new Error('两次密码输入不同'))
    } else {
      callback()
    }
  }
  rulesfrom = {
    email: [
      { required: true, message: '请输入登录邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
    ],
    emailCode: [
      { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
    ],
    password: [{required: true, validator: this.validatePass, trigger: 'blur' }],
    confirm: [{required: true, validator: this.validatePassCheck, trigger: 'blur' }]
  }
  handlekeyup() {}
}
</script>
<style lang='less' scoped>
@import '../site/login.less';
.steps {
  border-bottom: solid 1px #efefef;
  padding-bottom: 20px;
  .wid-auto;
  /deep/ .ivu-steps .ivu-steps-tail > i {
    position: relative;
    top: -2px;
  }
  /deep/ .ivu-steps {
    width: 500px;
    margin: 0 auto;
  }
  /deep/ .ivu-steps .ivu-steps-title {
    font-weight: none;
  }
  /deep/ .ivu-steps .ivu-steps-head-inner {
    width: 16px;
    height: 16px;
    line-height: 14px;
    font-size: 12px;
    margin: 2px 5px 0 0;
  }
  /deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
    border-color: @theme-color;
    background-color: @theme-color;
  }
  /deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-title {
    color: @text-color;
  }
}
.firstNext {
  width: 600px;
  margin: 80px auto 40px;
  &>form{
    margin-top:40px;
  }
  .ivu-form-item{
    /deep/ label{
      .form-label
    }
  }
  .ivu-input-wrapper{
    /deep/ input {
     .form-input
    }
  }
  .submit{
    .form-btn
  }
}
</style>