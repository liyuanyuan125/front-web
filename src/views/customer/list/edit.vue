<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">客户管理</span>
      <em class="addUser" @click="addUser">
        <Icon type="ios-add" size="27"/>新增客户
      </em>
    </h3>
    <Form ref="form" :model="from" class="edit-input from" :rules="dataRule" :label-width="100">
      <FormItem label="客户名称" class="item-account-email">
        <Input type="text" v-model="from.name" ></Input>
      </FormItem>
      <FormItem label="客户简称" prop="oldPassword">
        <Input type="text" v-model="from.nameShort" ></Input>
      </FormItem>
      <FormItem label="客户行业" prop="newPassword">
        <Select v-model="item.qualificationType" clearable>
          <Option v-for="it in qualificationTypeList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属品类" prop="newPasswords">
        <Select v-model="item.qualificationType" clearable>
          <Option v-for="it in qualificationTypeList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
      </FormItem>
      <FormItem label="联系人" prop="newPasswords">
        <Input type="text" v-model="from.newPasswords" ></Input>
      </FormItem>
      <FormItem label="联系电话" prop="newPasswords">
        <Input type="text" v-model="from.newPasswords" ></Input>
      </FormItem>
      <FormItem label="联系地址" prop="newPasswords">
        <Input type="text" v-model="from.newPasswords" ></Input>
      </FormItem>
    </Form>
    <div class="btnCenter sumbit-button">
      <Button type="primary" class="button-ok" @click="passwordkSet('form')">修改</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { toast } from '@/ui/modal'
import { slice } from '@/fn/object'
import ViewBase from '@/util/ViewBase'
import { setPassword } from '@/api/password'
import { getUser } from '@/store'


@Component
export default class Main extends ViewBase {
  loginEmail = ''
  from = {
    oldPassword: '',
    newPassword: '',
    newPasswords: ''
  }
  mounted() {
    const use: any = getUser()
    this.loginEmail = JSON.parse(JSON.stringify(use)).email
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
      ; (this.$refs.form as any).resetFields()
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
.item-account-email {
  /deep/ .ivu-form-item-label {
    padding-left: 10px;
  }
}
.login-email {
  font-size: 14px;
  position: relative;
  top: 3px;
}
.from {
  padding: 30px 0 0 30px;
}
</style>
