<template>
  <div class="page home-bg">
    <Form :model="form" label-position="left" class="edit-input" :label-width="100">
      <h3 class="layout-title">登录信息</h3>
      <FormItem label="账号类型" class="item-top">
        <Input v-model="form.type"></Input>
      </FormItem>
      <FormItem label="登录邮箱">
        <Input v-model="form.loginEmail"></Input>
      </FormItem>
      <FormItem label="邮箱验证码">
        <Input v-model="form.emailCode" :maxlength="6" class="email-code" placeholder="请输入邮箱验证码"></Input>
        <Button
          class="btn-code"
          :disabled="displayCode || emailIsValid"
          @click="getEmailCode"
        >{{emailMes}}</Button>
      </FormItem>
      <h3 class="layout-title">公司信息</h3>
      <FormItem label="公司名称" class="item-top">
        <Input v-model="form.type"></Input>
      </FormItem>
      <FormItem label="公司所在地">
        <AreaSelect v-model="form.area" :max-level="2" no-self/>
      </FormItem>
      <FormItem label="联系人">
        <Input v-model="form.type"></Input>
      </FormItem>
      <FormItem label="手机号">
        <Input v-model="form.account"></Input>
      </FormItem>
      <FormItem label="邮箱">
        <Input v-model="form.account"></Input>
      </FormItem>
      <h3 class="layout-title">开户资质</h3>
      <FormItem label="资质类型" class="item-top">
        <Input v-model="form.account"></Input>
      </FormItem>
      <FormItem label="资质编号">
        <Input v-model="form.account"></Input>
      </FormItem>
      <FormItem label="资质图片">
        <Input v-model="form.account"></Input>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <button class="button-ok edit-submit">提交申请</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { validateEmail } from '@/util/validateRules'
import ViewBase from '@/util/ViewBase'
import AreaSelect from '@/components/AreaSelect.vue'

@Component({
  components: {
    AreaSelect
  }
})
export default class Main extends ViewBase {
  emailMes = '获取邮箱验证码'
  displayCode = false

  form = {
    type: '11111111',
    loginEmail: '810805409@qq.com',
    account: 'xxxx@.com',
    message: 'xxxx',
    area: [],
    emailCode: ''
  }
  async mounted() {}
  get emailIsValid() {
    const failMsg = validateEmail(this.form.loginEmail)
    return !!failMsg
  }
  getEmailCode() {
    this.displayCode = true
    try {
    } catch (ex) {
    } finally {
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
  .edit-submit {
    margin: 50px 0 40px;
  }
  /deep/ .ivu-cascader-rel {
    width: auto;
  }
  .email-code {
    width: 200px;
  }
  .btn-code {
    width: 180px;
    height: 40px;
    margin-left: 20px;
  }
}
</style>
