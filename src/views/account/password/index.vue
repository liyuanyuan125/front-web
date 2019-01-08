<template>
  <div class="page home-bg">
    <Form ref="form" :model="from" class="edit-input from" :rules="dataRule" :label-width="100">
      <FormItem label="输入旧密码" prop="oldPassword">
        <Input type="password" v-model="from.oldPassword"></Input>
      </FormItem>
      <FormItem label="输入新密码" prop="newPassword">
        <Input type="password" v-model="from.newPassword"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="newPasswords">
        <Input type="password" v-model="from.newPasswords"></Input>
      </FormItem>
    </Form>
    <div class="btnCenter sumbit-button">
      <button class="button-ok" @click="passwordkSet('form')">修改</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { toast } from '@/ui/modal'
import { slice } from '@/fn/object'
import ViewBase from '@/util/ViewBase'
import { setPassword } from '@/api/password'
@Component
export default class Main extends ViewBase {
  from = {
    oldPassword: '',
    newPassword: '',
    newPasswords: ''
  }

  get dataRule() {
      const password = (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请重新输入新密码'))
        } else {
          if (value !== this.from.newPassword) {
            callback(new Error('密码不匹配，请重新输入'))
          }
          callback()
        }
      }
     return {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'change' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'change' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
            message: '请输入同时包含数字、字母且长度要在8-16位之间的密码',
            trigger: 'change'
          }
        ],
        newPasswords: [
          { required: true, message: '请重新输入新密码', trigger: 'change' },
          { validator: password }
        ]
     }
  }
  async passwordkSet(form: string) {
    const valid = await (this.$refs[form] as any).validate()
    if (!valid) {
      return
    }
    try {
      const {oldPassword, newPassword} = this.from
      const data = { oldPassword, newPassword }
      await setPassword(data)
      toast('密码修改成功')
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
.from {
  padding: 30px 0 0 30px;
}
</style>
