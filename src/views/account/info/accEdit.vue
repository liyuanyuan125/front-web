<template>
  <div class="page home-bg">
    <Form :model="form" label-position="left" :label-width="100" class="edit-input">
      <h3 class="layout-title">登录信息</h3>
      <FormItem label="登录邮箱" class="item-top">
        <Input v-model="form.email" placeholder="请输入登录邮箱"></Input>
        <span class="modifyCode" @click="isEmailCode = !isEmailCode">修改邮箱</span>
      </FormItem>
      <FormItem label="邮箱验证码" v-if="isEmailCode">
        <Input v-model="form.emailCaptcha" :maxlength="6" class="email-code" placeholder="请输入邮箱验证码"></Input>
        <Button class="btn-code" :disabled="displayCode" @click="getEmailCode">{{emailMes}}</Button>
      </FormItem>
      <h3 class="layout-title">公司信息</h3>
      <FormItem label="公司所在地" class="item-top">
        <AreaSelect v-model="form.area" :max-level="2" no-self/>
      </FormItem>
      <FormItem label="联系人">
        <Input v-model="form.contact" placeholder="请输入联系人姓名"></Input>
      </FormItem>
      <FormItem label="手机号">
        <Input v-model="form.contactTel" :maxlength="11" placeholder="请输入手机号"></Input>
      </FormItem>
      <FormItem label="个人邮箱">
        <Input v-model="form.companyEmail" placeholder="请输入个人邮箱"></Input>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <button class="button-ok edit-submit" @click="editAccount">提交申请</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { countDown } from '@/fn/timer'
import AreaSelect from '@/components/AreaSelect.vue'
import { accountDetail, getLoginEmail, auditingAccount } from '@/api/account'

@Component({
  components: {
    AreaSelect
  }
})
export default class Main extends ViewBase {
  isEmailCode = false
  emailMes = '获取邮箱验证码'
  displayCode = false

  form: any = {
    email: '',
    emailCaptcha: '',
    contact: '',
    contactTel: '',
    companyEmail: '',
    area: []
  }
  async mounted() {
    const { data } = await accountDetail()
    this.form = {
      email: data.account.email,
      emailCaptcha: '',
      contact: data.company.contact,
      contactTel: data.company.contactTel,
      companyEmail: data.company.email,
      area: [data.company.provinceId, data.company.cityId]
    }
  }
  async getEmailCode() {
    try {
      const msg = await getLoginEmail(this.form.email)
      await countDown(10, sec => {
        this.emailMes = sec + 's'
      })

      this.emailMes = '重新获取验证码'
    } catch (ex) {
      this.handleError(ex)
    } finally {
      // this.displayCode = false
    }
  }

  async editAccount() {
    const cloneForm = Object.assign(this.form)
    if (!this.form.emailCaptcha) {
      cloneForm.emailCaptcha = null
      cloneForm.email = null
    }
    try {
      await auditingAccount({
        ...cloneForm,
        provinceId: this.form.area[0],
        cityId: this.form.area[1]
      })
      this.$router.push({name: 'account-info'})
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@c-bg: #fff;
.page {
  .ivu-form-item {
    padding-left: 30px;
    color: @c-text;
  }
  .modifyCode {
    cursor: pointer;
    font-size: 14px;
    color: @c-button;
    margin-left: 20px;
  }
  .item-top {
    padding-top: 20px;
  }
  .edit-submit {
    margin: 50px 0 40px;
  }
  .btn-code {
    width: 180px;
    height: 40px;
    margin-left: 20px;
  }
  /deep/ .ivu-cascader-rel {
    width: auto;
  }
}
</style>
