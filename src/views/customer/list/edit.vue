<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">客户管理 > {{title}}</span>
    </h3>
    <Form ref="form" :model="from" class="edit-input from" :rules="dataRule" :label-width="100">
      <FormItem label="客户名称" class="item-account-email" prop="name">
        <Input type="text" v-model="from.name" ></Input>
      </FormItem>
      <FormItem label="客户简称" prop="nameShort">
        <Input type="text" v-model="from.nameShort" ></Input>
      </FormItem>
      <!-- <FormItem label="客户行业" prop="businessCode">
        <Select v-model="from.businessCode" clearable>
          <Option v-for="it in qualificationTypeList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属品类" prop="businessCategoryCode">
        <Select v-model="form.businessCategoryCode" clearable>
          <Option v-for="it in qualificationTypeList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
      </FormItem> -->
      <FormItem label="联系人" prop="contactName">
        <Input type="text" v-model="from.contactName" ></Input>
      </FormItem>
      <FormItem label="联系电话" prop="contactTel">
        <Input type="text" v-model="from.contactTel" ></Input>
      </FormItem>
      <FormItem label="联系地址" prop="contactAddress">
        <Input type="text" v-model="from.contactAddress" ></Input>
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
import { postcontact, contact, putcontact } from '@/api/customer'

@Component
export default class Main extends ViewBase {
  title = '新增客户'
  from = {
    name: '',
    nameShort: '',
    businessCode: '',
    businessCategoryCode: '',
    contactName: '',
    contactTel: '',
    contactAddress: ''
  }

  get dataRule() {
     return {
       name: { required: true, message: '请输入客户名称', trigger: 'change' },
       nameShort: { required: true, message: '请输入客户简称', trigger: 'change' },
       businessCode: { required: true, message: '请选择客户行业', trigger: 'change' },
       businessCategoryCode: { required: true, message: '请选择所属品类', trigger: 'change' },
       contactName: { required: true, message: '请输入联系人姓名', trigger: 'change' },
       contactTel: { required: true, message: '请输入联系人电话', trigger: 'change' },
       contactAddress: { required: true, message: '请输入联系人地址', trigger: 'change' },
     }
  }

  created() {
    this.init()
  }

  async init() {
    if (!this.$route.params.id) {
      return
    }
    this.title = '编辑客户'
    try {

    } catch (ex) {
      this.handleError(ex)
    }
  }

  async passwordkSet(form: string) {
    const valid = await (this.$refs[form] as any).validate()
    if (!valid) {
      return
    }
    try {
      // const {oldPassword, newPassword} = this.from
      // const data = { oldPassword, newPassword }
      // // await setPassword(data)
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
    padding-left: 0;
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
.userTitle {
  background: rgba(249, 249, 249, 1);
  height: 50px;
  font-size: 14px;
  line-height: 50px;
  padding-left: 30px;
}
/deep/ .ivu-form-item-label::before {
  display: none;
}
</style>
