<template>
  <div class="page home-bg">
    <Form :model="form" label-position="left" class="edit-input" :label-width="100">
      <h3 class="layout-title">登录信息</h3>
      <FormItem label="账号类型" class="item-top">
        <CheckboxGroup v-model="form.accountType">
          <Checkbox :label="item.code" v-for="item in queryDate.systemList" :key="item.code">{{item.desc}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="登录邮箱">
        <Input v-model="form.email" placeholder="请输入登录邮箱"></Input>
        <span class="modifyCode" @click="isEmailCode = !isEmailCode">修改邮箱</span>
      </FormItem>
      <FormItem label="邮箱验证码" v-if="isEmailCode">
        <Input v-model="form.emailCaptcha" :maxlength="6" class="email-code" placeholder="请输入邮箱验证码"></Input>
        <Button class="btn-code" :disabled="displayCode" @click="getEmailCode">{{emailMes}}</Button>
      </FormItem>
      <h3 class="layout-title">公司名称</h3>
      <FormItem label="公司名称" class="item-top">
        <Input v-model="form.companyName" placeholder="请输入公司名称"></Input>
      </FormItem>
      <FormItem label="公司所在地">
        <AreaSelect v-model="form.area" :max-level="2" no-self/>
      </FormItem>
      <FormItem label="联系人">
        <Input v-model="form.contact" placeholder="请输入联系人"></Input>
      </FormItem>
      <FormItem label="手机号">
        <Input v-model="form.contactTel" placeholder="请输入手机号"></Input>
      </FormItem>
      <FormItem label="邮箱">
        <Input v-model="form.companyEmail" placeholder="请输入个人邮箱"></Input>
      </FormItem>
      <h3 class="layout-title">开户资质</h3>
      <FormItem label="资质类型" class="item-top">
        <Select v-model="form.qualificationType" style="width:400px">
          <Option
            v-for="item in queryDate.qualificationTypeList"
            :value="item.code"
            :key="item.code"
          >{{ item.desc }}</Option>
        </Select>
      </FormItem>
      <FormItem label="资质编号">
        <Input v-model="form.qualificationCode" placeholder="请输入资质编号"></Input>
      </FormItem>
      <FormItem label="资质图片">
        <div class="upload-wrap">
          <Upload v-model="form.imageList" :max-count="3" multiple accept="images/*" confirm-on-del/>
          <div class="upload-tip">支持1或3张，格式为jpg/jpeg/png，大小不超过5M的图片</div>
        </div>
      </FormItem>
    </Form>
    <div class="btnCenter">
      <Button type="primary" class="button-ok edit-submit" @click="updateAccount">更新账号</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { validateEmail } from '@/util/validateRules'
import { countDown } from '@/fn/timer'
import ViewBase from '@/util/ViewBase'
import AreaSelect from '@/components/AreaSelect.vue'
import { accountDetail, getLoginEmail, pendingAudit } from '@/api/account'
import Upload, { FileItem } from '@/components/upload'

@Component({
  components: {
    AreaSelect,
    Upload
  }
})
export default class Main extends ViewBase {
  emailMes = '获取邮箱验证码'
  displayCode = false
  queryDate: any = ''
  isEmailCode = false

  form: any = {
    accountType: [],
    email: '',
    emailCaptcha: '',
    companyName: '',
    area: [],
    cityId: '',

    contact: '',
    contactTel: '',

    companyEmail: '',
    qualificationType: '',
    qualificationCode: '',
    imageList: []
  }
  async mounted() {
    try {
      const { data } = await accountDetail()
      this.queryDate = data
      const arryList: [number, string] = data.systemList.map((item: any) => {
        return item.code
      })

      this.form = {
        accountType: arryList,
        email: data.account.email,
        companyName: data.company.name,

        area: [data.company.provinceId, data.company.cityId],
        contact: data.account.name,
        contactTel: data.account.mobile,
        companyEmail: data.account.email,
        qualificationType: data.company.qualificationType || '',
        qualificationCode: data.company.qualificationCode,
        imageList: data.company.images || []
      }
    } catch (ex) {
      this.handleError(ex)
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

  async updateAccount() {
    // 如果验证码为空，不必传邮箱
    const cloneForm = this.form
    cloneForm.imageList = cloneForm.imageList.map( (item: any) => item.fileId)
    try {
      if (!cloneForm.emailCaptcha) {
         await pendingAudit({
            ...cloneForm,
            email: null,
            emailCaptcha: null,
            provinceId: this.form.area[0],
            cityId: this.form.area[1]
         })
      } else {
         await pendingAudit({
            ...cloneForm,
            provinceId: this.form.area[0],
            cityId: this.form.area[1]
         })
      }
      this.$router.push({ name: 'account-info' })
    } catch (ex) {
      ((this as any)[`onSumbit${ex.code}`] || this.handleError).call(this, ex)
    }
  }
  onSumbit9006305(msg: any) {
    this.handleError(msg)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@c-bg: #fff;
.page {
  .upload-wrap {
    position: relative;
    margin-top: 10px;
  }
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
  .modifyCode {
    cursor: pointer;
    font-size: 14px;
    color: @c-button;
    margin-left: 20px;
  }
  .btn-code {
    width: 180px;
    height: 40px;
    margin-left: 20px;
  }
  .ivu-checkbox-group-item {
    margin-right: 25px;
  }
}
</style>
