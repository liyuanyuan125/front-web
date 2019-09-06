<template>
  <div>
    <div @click="onView">
      <slot>绑定手机</slot>
    </div>
    <Modal v-model="visible" width="445px" class="comDlg">
        <h2 class="title">变更手机</h2>
        <Form :model="form" :rules="rule" ref="form" :key="randomKey">
          <FormItem prop="mobile" :error="errorMobile">
            <Input v-model="form.mobile" :maxlength="11" placeholder="请输入手机号" />
          </FormItem>
          <FormItem prop="smsCode" class="form-item-getcode">
            <Input v-model="form.smsCode" :maxlength="6" class="input-captcha" placeholder="请输入验证码" />
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
import { bindMobile, mobileOrEmail } from '@/api/register'
import { success } from '@/ui/modal'
import { random } from '@/fn/string'

@Component
export default class Main extends ViewBase {
  visible = false
  codeMsg = '获取验证码'

  codeDisable = false
  errorMobile = ''

  form = {
    mobile: '',
    smsCode: '',
    requestId: ''
  }

  randomKey = random()

  get rule() {
    return {
      mobile: [
        { required: true, message: '请输入您的手机号', trigger: 'blur' },
        {
          trigger: 'blur',
          validator(rule: any, value: string, callback: any) {
            const msg = validataTel(value)
            msg ? callback(new Error(msg)) : callback()
          }
        }
      ],
      smsCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
      ],
    }
  }

  get emailIsValid() {
    const isValid = validataTel(this.form.mobile)
    return !!isValid
  }

  async getCode() {
    this.codeDisable = true

    try {
      const {data} = await mobileOrEmail({ mobileOrEmail: this.form.mobile, codeType: 'mobile-reset' })
      this.form.requestId = data.requestId
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
    this.errorMobile = '手机号已存在'
  }

  async emailSubmit() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) { return}

    try {
      const { data } = await bindMobile({...this.form})
      await success('重置手机号成功')
      this.visible = false
      this.$emit('uploadMobile')
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