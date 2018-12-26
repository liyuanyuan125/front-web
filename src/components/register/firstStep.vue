<template>
     <div class='firstNext'>
        <Row type='flex' justify='space-between'>
          <Col :span='11'>
          <p><img src='../../assets/img1.png' width='275px' class=''></p>
          </Col>
          <Col :span='11'>
          <p><img src='../../assets/img-hover.png' width='275px'></p>
          </Col>
        </Row>
        <Form ref='form' :model='form' :rules='rulesfrom' label-position='left' :label-width='120'>
          <FormItem label='登录邮箱' prop='email'>
            <Input v-model='form.email' placeholder='请输入登录邮箱'></Input>
          </FormItem>
          <FormItem label='邮箱验证码' prop='emailCode' class='getEmailCode'>
            <Input v-model='form.emailCode' :maxlength='6' placeholder='请输入邮箱验证码'></Input>
            <span @click='getCode' ref='getcode'>获取邮箱验证码</span>
          </FormItem>
          <FormItem label='密码' prop='password'>
            <Input v-model='form.password'  ref="pass" :maxlength='16' placeholder='请设置包含大小写的英文字母与数字的组合'></Input>
          </FormItem>
          <FormItem label='重复密码' prop='confirm'>
            <Input v-model='form.confirm'  :maxlength='16' placeholder='请再次输入密码'></Input>
          </FormItem>
          <FormItem>
            <p>
              <Checkbox v-model='single'>我同意并遵守
                <router-link to=''>《平台运营条款》</router-link>
              </Checkbox>
            </p>
          </FormItem>
        </Form>
      </div>
</template>
<script lang="ts">
import { Component, Watch} from 'vue-property-decorator'
import View from '@/util/View'
@Component
export default class Main extends View {
  single = true
  second = 10 // 倒计时时间
  isRun = false // 是否启动按钮
  clearTime = 0 // 组件销毁清除定时器

  form = {
    email: '',
    emailCode: '',
    password: '',
    confirm: ''
  }
  rulesfrom = {
    email: [
      { required: true, message: '请输入登录邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
    ],
    emailCode: [
      { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
    ],
    password: [{ required: true, message: '请输入你的密码', trigger: 'blur' }],
    confirm: [{ required: true, message: '请再次输入密码', trigger: 'blur' }]
  }
  downTime() {
    this.isRun = true
    const innter  = this.$refs.getcode as any
    if (this.second == 0) {
      innter.innerText = '重新获取验证码'
      this.second = 10
      this.isRun = false
    } else {
      this.second = this.second - 1
      innter.innerText = this.second + 's'

      this.clearTime = setTimeout(() => {
        this.downTime()
      }, 1000)
    }
  }
  getCode() {
    const reg = new RegExp(
      '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'
    )
    if (this.form.email) {
      if (reg.test(this.form.email)) {
        if (!this.isRun) {
          this.downTime()
        }
      } else {
        // this.showWaring('用户邮箱格式有误')
      }
    } else {
      this.showWaring('用户登录邮箱不能为空')
    }
  }
  destroyed() {
    clearTimeout(this.clearTime)
  }

  @Watch('password', {deep: true})
  checkChange(val: any, oldVal: string) {
  }
}
</script>
<style lang="less" scoped>
@import '../../site/login.less';
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
  & > form {
    margin-top: 40px;
    border-bottom: 1px solid rgba(239,239,239,1)
  }
  .getEmailCode {
    .ivu-input-wrapper {
      width: auto;
    }
    /deep/ input {
      width: 260px;
    }
    /deep/ span {
      width: 200px;
      display: block;
      .form-input;
      cursor: pointer;
      line-height: 50px;
      border: solid 1px #dcdee2;
      text-align: center;
      background: #ffffff;
      position: absolute;
      right: 0;
      top: 0;
      color: @theme-color;
    }
  }
  .ivu-form-item {
    margin-bottom: 40px;
    /deep/ .ivu-form-item-label {
      .form-label;
    }
  }
  .ivu-checkbox-wrapper{
    font-size: 14px;
  }
  .ivu-input-wrapper {
    /deep/ input {
      .form-input;
    }
  }
  
}
</style>
