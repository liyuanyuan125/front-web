<template>
  <div class="activeEmail">
    <Form :model="form" ref="form" :rules="rules" label-position="left" class="edit-input" :label-width="100">
      <h3 class="logo">
        <img src="../../assets/login/logo.png" @click="toLogin">
      </h3>
      <FormItem label="密码" prop="firstPass" class="item-top">
        <Input
          v-model="form.firstPass"
          type="password"
          :maxlength="16"
          placeholder="请输入包含大小写的英文字母与数字的组合，8-16 位"
        ></Input>
      </FormItem>
      <FormItem label="确认密码" prop="secondPass">
        <Input
          v-model="form.secondPass"
          type="password"
          :maxlength="16"
          placeholder="请输入包含大小写的英文字母与数字的组合，8-16 位"
        ></Input>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <button class="button-ok addSumbit" @click="handleInforma">激活邮箱</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { activeEmailSumbit } from '@/api/user'
import { confirm, toast } from '@/ui/modal'
import { validatePassword } from '@/util/validateRules'

@Component
export default class Main extends ViewBase {
  ticket = ''

  form = {
    firstPass: '',
    secondPass: ''
  }

  get rules() {
    return {
      firstPass: [
        {
          required: true,
          trigger: 'blur',
          validator(rule: any, value: string, callback: any) {
            const msg = validatePassword(value)
            msg ? callback(new Error(msg)) : callback()
          }
        }
      ],
      secondPass: [
        {
          required: true,
          trigger: 'blur',
          validator: (rule: any, value: string, callback: any) => {
            value != this.form.firstPass
              ? callback(new Error('两次密码不一致，请重新输入'))
              : callback()
          }
        }
      ]
    }
  }

  mounted() {
    const url = this.$route.path
    const lastNum = url.lastIndexOf('/') + 1
    this.ticket = url.substr(lastNum)
  }
  toLogin() {
    this.$router.push({ name: 'login' })
  }
  async handleInforma() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) {
      return
    }
    try {
      await activeEmailSumbit({
        password: this.form.firstPass,
        ticket: this.ticket
      })
      toast('已激活成功')
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
}
</script>
<style lang="less" scoped>
.activeEmail {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -55%);
  .logo {
    text-align: center;
    padding-bottom: 60px;
  }
}
.addSumbit {
  margin-top: 70px;
}
</style>
