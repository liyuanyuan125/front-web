<template>
  <div class="page home-bg as">
    <Form :model="form"  :rules="rule"  ref="dataform" label-position="left" class="edit-input" :label-width="100">
      <div class='bs'>
      <h3 class="layout-title">登录信息</h3>
      <FormItem label="账号类型" class="item-top">
        <CheckboxGroup v-model="form.accountType" >
          <Checkbox :label="item.code" v-for="item in queryDate.systemList" :key="item.code">{{item.desc}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="登录邮箱">
        <Input v-model="form.email" placeholder="请输入登录邮箱"></Input>
        <span class="modifyCode" @click="isEmailCode = !isEmailCode">修改邮箱</span>
      </FormItem>
      <FormItem label="邮箱验证码" v-if="isEmailCode">
        <Input v-model="form.emailCaptcha" :maxlength="6" class="email-code" placeholder="请输入邮箱验证码"></Input>
        <Button class="btn-code  sok" :disabled="displayCode" @click="getEmailCode">{{emailMes}}</Button>
      </FormItem>
      </div>
      <div class='bs'>
      <h3 class="layout-title">公司名称</h3>
      <FormItem label="公司名称" class="item-top" prop="companyName">
        <Input v-model="form.companyName" placeholder="请输入公司名称"></Input>
      </FormItem>
      <FormItem label="公司所在地" prop="area">
        <AreaSelect v-model="form.area" :max-level="2" no-self/>
      </FormItem>
      <FormItem label="联系人" prop="contact">
        <Input v-model="form.contact" placeholder="请输入联系人"></Input>
      </FormItem>
      <FormItem label="手机号" prop="contactTel">
        <Input v-model="form.contactTel" placeholder="请输入手机号"></Input>
      </FormItem>
      <FormItem label="邮箱" prop="companyEmail">
        <Input v-model="form.companyEmail" placeholder="请输入个人邮箱"></Input>
      </FormItem>
      </div>
      <div class='bs'>
      <h3 class="layout-title">开户资质</h3>
      <FormItem label="资质类型" class="item-top">
        <Select v-model="form.qualificationType" clearable style="width:400px">
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
      </div>
    </Form>
    <div class="btnCenter">
      <Button v-auth="'account-manage.info#change'" type="primary" class="button-ok edit-submit bok"
       @click="updateAccount('dataform')">更新账号</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { validateEmail } from '@/util/validateRules'
import { countDown } from '@/fn/timer'
import ViewBase from '@/util/ViewBase'
import AreaSelect from '@/components/areaSelect'
import { accountDetail, getLoginEmail, pendingAudit } from '@/api/account'
import Upload, { FileItem } from '@/components/upload'
import { updateEmail } from '@/store'

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
  systems = []
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

  get rule() {
    return {
      companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
      // area: [{ required: true, message: '请输入公司所在地', trigger: 'blur' },
      //  { validator: (rule: any, value: any, callback: any) => {
      //    console.log()
      //  } }],
      contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
      contactTel: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      companyEmail: [{ required: true, message: '请输入个人邮箱', trigger: 'blur' }],
    }
  }
  async mounted() {
    try {
      const { data } = await accountDetail()
      this.queryDate = data
      this.systems = data.account.systems
      const arryList: [number, string] = data.account.systems.map((item: any) => {
        return item.code
      })

      this.form = {
        accountType: arryList,
        email: data.account.email,
        companyName: data.company.name,

        area: [data.company.provinceId, data.company.cityId],
        contact: data.account.name,
        contactTel: data.account.mobile,
        companyEmail: data.company.email,
        qualificationType: data.company.qualificationType || '',
        qualificationCode: data.company.qualificationCode,
        imageList: data.company.images || []
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async getEmailCode() {
    this.displayCode = true
    try {
      const msg = await getLoginEmail(this.form.email)
      await countDown(60, sec => {
        this.emailMes = sec + 's'
      })

      this.emailMes = '重新获取验证码'
    } catch (ex) {
      this.handleError(ex)
      this.displayCode = false
    } finally {
      this.displayCode = false
    }
  }

  async updateAccount(dataform: any) {
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) {
      return
    }
    // 如果验证码为空，不必传邮箱
    const cloneForm = this.form
    cloneForm.imageList = cloneForm.imageList.length != 0 ? cloneForm.imageList.map( (item: any) => item.fileId) : []
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
      if (this.form.email) {
        updateEmail(this.form.email)
      }
      this.$router.push({ name: 'account-company' })
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
.bok {
  width: 200px;
  height: 50px;
  background: rgba(0, 32, 45, 1);
  border-radius: 25px;
  color: #fff;
}
.sok {
  width: 190px;
  height: 40px;
  background: rgba(0, 32, 45, 1);
  border-radius: 5px;
  border: 1px solid rgba(0, 32, 45, 1);
}
/deep/ .ivu-select-selection {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-select-input {
  margin-top: 3px;
}
/deep/ .ivu-input {
  border-radius: 5px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 1);
}
.bs {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.3);
}
.as {
  background: rgba(255, 255, 255, 0);
  padding: 20px 30px 0 30px;
}
.layout-title {
  background: rgba(255, 255, 255, 0);
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 32, 45, 1);
  margin-top: 10px;
}
@c-bg: #fff;
.page {
  .upload-wrap {
    position: relative;
    margin-top: 5px;
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
    font-size: 13px;
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
