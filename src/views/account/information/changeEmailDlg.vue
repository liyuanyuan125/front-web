<template>
  <div>
    <div @click="onView">
      <slot>变更邮箱</slot>
    </div>
    <Modal v-model="visible" width="445px" ref="form" class="comDlg">
        <h2 class="title">变更邮箱</h2>
        <Form :model="form" :rules="rule" ref="form" :key="randomKey">
          <FormItem prop="email" :error="errorEmail">
            <Input v-model="form.email" placeholder="请输入邮箱" />
          </FormItem>
          <FormItem prop="code" class="form-item-getcode">
            <Input v-model="form.code" :maxlength="6" class="input-captcha" placeholder="请输入验证码" />
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
import { mobileOrEmail, bindEmail } from '@/api/register'
import { success } from '@/ui/modal'
import { random } from '@/fn/string'

@Component
export default class Main extends ViewBase {
  visible = false
  codeMsg = '获取验证码'

  codeDisable = false
  errorEmail = ''

  form = {
    email: '',
    code: ''
  }
  randomKey = random()

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
      code: [
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
      await mobileOrEmail({
        mobileOrEmail: this.form.email,
        codeType: 'email-reset',
      })

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
    this.randomKey = random()
  }

  onGetCode8007203() {
    this.errorEmail = '邮箱已存在'
  }

  async emailSubmit() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) { return}
    // 重新调用接口刷新页面
    try {
      const { data } = await bindEmail({...this.form})
      await success('重置邮箱成功')
      this.visible = false
      this.$emit('uploadEmail')
    } catch (ex) {
      this.handleError(ex)
      this.codeMsg = '获取验证码';
      (this.$refs.form as any).resetFields()
    }
  }
}
</script>
<style lang='less' scoped>
@import './common.less';
</style>