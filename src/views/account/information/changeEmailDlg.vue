<template>
  <div>
    <div @click="onView">
      <slot>变更邮箱</slot>
    </div>
    <Modal v-model="visible" width="445px">
        <h2 class="title">变更邮箱</h2>
        <Form :model="form" :rules="rule" ref="form">
          <FormItem prop="email" :error="errorEmail">
            <Input v-model="form.email" placeholder="请输入邮箱" />
          </FormItem>
          <FormItem prop="captcha" class="form-item-getcode">
            <Input v-model="form.captcha" :maxlength="6" class="input-captcha" placeholder="请输入验证码" />
            <Button class="get-code" @click="getCode" :disabled="codeDisable || emailIsValid">{{codeMsg}}</Button>
          </FormItem>
        </Form>
        <div class="footer">
          <Button class="footer-btn" @click="emailSubmit">提交</Button>
        </div>
    </Modal>
  </div>
  
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { validateEmail, validataTel } from '@/util/validateRules'
import { countDown } from '@/fn/timer'
import { sendRegisterEmail } from '@/api/register'

@Component
export default class Main extends ViewBase {
  visible = false
  codeMsg = '获取验证码'

  codeDisable = false
  errorEmail = ''

  form = {
    email: '',
    captcha: ''
  }

  get rule() {
    return {
      email: [
        { required: true, message: '请输入您的邮箱', trigger: 'blur' },
        {
          trigger: 'blur',
          validator(rule: any, value: string, callback: any) {
            const msg = validateEmail(value)
            msg ? callback(new Error(msg)) : callback()
          }
        }
      ],
      captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
      ],
    }
  }

  get emailIsValid() {
    const isValid = validateEmail(this.form.email)
    return !!isValid
  }

  async getCode() {
    this.codeDisable = true

    try {
      await sendRegisterEmail(this.form.email)

      await countDown(60, sec => {
        this.codeMsg = sec + 's'
      })

      this.codeMsg = '重新获取验证码'
    } catch (ex) {
      ((this as any)[`onGetCode${ex.code}`] || this.handleError).call(this, ex)
    } finally {
      this.codeDisable = false
    }
  }

  onView() {
    this.visible = true
  }

  onGetCode8007203() {
    this.errorEmail = '邮箱已存在'
  }

  async emailSubmit() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) { return}
    this.visible = false
    // 重新调用接口刷新页面
  }
}
</script>
<style lang='less' scoped>
@import './common.less';

.title {
  text-align: center;
  font-size: 16px;
  color: #00202d;
  padding: 30px 0;
}
/deep/ .ivu-modal-body {
  padding: 0 40px  70px;
}
/deep/ .ivu-modal-footer {
  display: none;
}
/deep/ .ivu-input {
  height: 40px;
  font-size: 14px;
  border-radius: 5px;
  outline: none;
}
/deep/ .form-item-getcode {
  .ivu-form-item-content {
    display: flex;
    justify-content: space-between;
  }
}
.input-captcha {
  width: 230px;
}
.get-code {
  width: 119px;
  height: 40px;
  background: #3398db;
  border-radius: 5px;
  color: #fff;
}
.footer-btn {
  width: 200px;
  height: 50px;
  background: rgba(0, 32, 45, 1);
  border-radius: 25px;
  color: #fff;
  border: 0;
  margin-top: 50px;
  &:hover {
    background: rgba(0, 32, 45, 1);
    color: #fff;
  }
}
.footer {
  text-align: center;
}
</style>