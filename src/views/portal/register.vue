<template>
  <registerLayout>
    <div class="main-wrap">

      <div class="tablist">
        <h4 class="tabs" v-if="!registerNext || subForm.companyType == 2">
          <span :class="{active: subForm.companyType == 1}" @click="handleCompany">我是企业</span>
          <span :class="{active: subForm.companyType == 2}" @click="handlePerson">我是个人</span>
        </h4>
        <h5 class="go-back" v-if="registerNext && subForm.companyType == 1">
          <span>设置账号</span>
          <span @click="nextBack">返回上一步</span>
        </h5>
      </div>

      <Form :model="form" :rules="rules" class="form"  ref="form" v-if="!registerNext" :key="keyRandom" >
        <FormItem prop="companyName">
          <Input type="text" v-model="form.companyName" placeholder="请输入公司名称" />
        </FormItem>

        <div class="flex-justify-between">
          <FormItem prop="businessParentCode" style="width: 170px">
            <Select v-model="form.businessParentCode" clearable placeholder="请选择所属行业">
              <Option v-for=" item in tradeList" :key="item.id" :value="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="area" style="width: 190px">
              <AreaSelect v-model="form.area" ref="areas"  :max-level="2" no-self :placeholder="placeholder" />
          </FormItem>
        </div>
        
         <FormItem prop="recommendTel">
          <Input v-model="form.recommendTel" :maxlength="11" placeholder="推荐人手机号（选填）"/>
        </FormItem>
        <FormItem prop="qualificationImageList">
           <Upload v-model="form.qualificationImageList" :max-count="4" multiple accept="images/*" confirm-on-del>
              <Icon type="ios-camera" size="20"/>
              <span style="line-height: 18px">上传营<br />业资质</span>
           </Upload>
           <!-- <span class="upload-tip">上传营业执照</span> -->
        </FormItem>
        <Button type="primary" long class="submit" @click="submitNext" >下一步</Button>
      </Form>

      <Form :model="subForm" :rules="subRules" class="form"  ref="subForm" v-if="registerNext" :key="keyRandom" >
        <DisableAutoFill />
        <div class="flex-justify-between">
          <FormItem prop="name" style="width: 170px">
            <Input  v-model="subForm.name" placeholder="请输入姓名" />
          </FormItem>
          <FormItem prop="mobile" style="width: 190px">
            <Input  v-model="subForm.mobile" :maxlength="11" placeholder="请输入手机号" />
          </FormItem>
        </div>
        
        <FormItem prop="smsCode" :error="smsCodeError" class="form-item-getcode">
          <Input v-model="subForm.smsCode" :maxlength="6" class="input-smsCode"
            placeholder="输入手机验证码"/>
          <Button type="primary" class="btn-code" :disabled="codeDisabled || mobileIsValid" @click="getCode">{{codeMsg}}</Button>
        </FormItem>
        <FormItem  prop="password">
          <Input type="password" v-model="subForm.password" :maxlength="16"
            placeholder="请设置包含大小写的英文字母与数字的组合，8-16 位"/>
        </FormItem>
        <FormItem  prop="passwordAgain">
          <Input type="password" v-model="subForm.passwordAgain" :maxlength="16"
            placeholder="请再次输入密码"/>
        </FormItem>

         <FormItem prop="recommendTel" v-if="subForm.companyType == 2" class="check-ready">
          <Input v-model="subForm.recommendTel" :maxlength="11" placeholder="推荐人手机号(选填）"/>
        </FormItem>

        <FormItem class="check-ready agreement" prop="agreement" >
          <Checkbox v-model="subForm.agreement">已阅读并同意</Checkbox>
          <agreementDlg>《鲸鱼数据-广告主合作协议》</agreementDlg>
        </FormItem>
         <Button type="primary"  long class="submit" @click="submit">提交申请</Button>
      </Form>


      <p class="to-apply">已有账户？<router-link :to="{name: 'tologin'}">立即登录</router-link> </p>
    </div>
  </registerLayout>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { countDown } from '@/fn/timer'
import { validateEmail, validatePassword, validataTel } from '@/util/validateRules'
import { sendRegisterEmail, register, tradeList, getSms, isCompanyName } from '@/api/register'
import AreaSelect from '@/components/areaSelect'
import Upload, { FileItem } from '@/components/upload'
import { except } from '@/fn/object'
import { scrollToError } from '@/util/form'
import { random } from '@/fn/string'
import DisableAutoFill from '@/components/DisableAutoFill.vue'
import setUserByData from '@/util/setUserByData'
import { info } from '@/ui/modal'
import registerLayout from './login/loginLayout.vue'
import agreementDlg from './register/agreement.vue'

@Component({
  components: {
    AreaSelect,
    registerLayout,
    Upload,
    DisableAutoFill,
    agreementDlg
  }
})
export default class Main extends ViewBase {
  placeholder = '请输入公司地址'

  codeDisabled = false
  codeMsg = '获取验证码'

  keyRandom = random()
  agreement = false

  imageList: any[] = []
  smsCodeError = ''

  registerNext = false
  submitDisabled = true

  tradeList = [] // 行业

  form: any = {
    area: [],
    provinceId: 0,
    cityId: 0,
    qualificationImageList: []
  }

  subForm = {
    companyType: 1, // 1 公司 2个人
    name: '',
    mobile: '',
    smsCode: '',
    password: '',
    passwordAgain: '',
    requestId: '', // 短信成功验证id
  }

  get rules() {
    return {
      companyName: [
        { required: true, message: '请输入公司名称', trigger: 'blur' },
        {
          trigger: 'blur',
          async validator(rule: any, value: string, callback: any) {
            const val = value.trim()
            const {data} = await isCompanyName(val)
            data == 1 ? callback() : callback(new Error('公司已存在'))
          }
        },
      ],

      recommendTel: [
        {
          required: false,
          trigger: 'blur',
          validator(rule: any, value: string, callback: any) {
            if (!!value) {
              const msg = validataTel(value)
              msg ? callback(new Error(msg)) : callback()
            } else {
              callback()
            }
          }
        }
      ],
      businessParentCode: [{ required: true, message: '请选择行业', trigger: 'blur' }],
      area: [{ required: true, type: 'array', message: '公司地址不能为空', trigger: 'change' }],
      // area: [
      //   {
      //     required: true,
      //     message: '公司地址不能为空',
      //     trigger: 'change',
      //     type: 'array',
      //     validator(rule: any, value: number[], callback: any) {
      //       !value[0] ? callback(new Error(rule.message)) : callback()
      //     }
      //   }
      // ],

      qualificationImageList: [
        {
          required: true,
          message: '营业执照不能为空',
          trigger: 'change',
          type: 'array',
          validator(rule: any, value: number[], callback: any) {
            value.length == 0 ? callback(new Error(rule.message)) : callback()
          }
        }
      ]
    }
  }

  get subRules() {
    return {
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
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
      password: [
        {
          required: true,
          message: '请输入你的密码',
          trigger: 'blur'
        },
        {
          trigger: 'blur',
          validator(rule: any, value: string, callback: any) {
            const msg = validatePassword(value)
            msg ? callback(new Error(msg)) : callback()
          }
        }
      ],
      passwordAgain: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
          trigger: 'blur',
          validator: (rule: any, value: string, callback: any) => {
            value != this.subForm.password
              ? callback(new Error('两次密码不一致，请重新输入'))
              : callback()
          }
        }
      ],
      recommendTel: [
        {
          required: false,
          trigger: 'blur',
          validator(rule: any, value: string, callback: any) {
            if (!!value) {
              const msg = validataTel(value)
              msg ? callback(new Error(msg)) : callback()
            } else {
              callback()
            }
          }
        }
      ],
      agreement: [{ required: true, type: 'boolean', message: '请勾选鲸鱼协议', trigger: 'blur' }]
    }
  }

  get mobileIsValid() {
    const failMsg = validataTel(this.subForm.mobile)
    return !!failMsg
  }

  async mounted() {
    const { data } = await tradeList()
    this.tradeList = data.list || []
  }

  handleCompany() {
    this.subForm.companyType = 1
    this.registerNext = false
    this.keyRandom = random()
  }

  handlePerson() {
    this.subForm.companyType = 2
    this.registerNext = true
    this.keyRandom = random()
  }

  nextBack() {
    this.registerNext = false
    this.keyRandom = random()
  }

  async getCode() {
    this.codeDisabled = true

    try {
      const { data } = await getSms({mobile: this.subForm.mobile, verifyCodeType: 'register'})
      this.subForm.requestId = data.requestId
      await countDown(60, sec => {
        this.codeMsg = sec + 's'
      })

      this.codeMsg = '重新获取验证码'
    } catch (ex) {
      ((this as any)[`onGetCode${ex.code}`] || this.handleError).call(this, ex)
    } finally {
      this.codeDisabled = false
    }
  }

  async submitNext() {
    const form = this.$refs.form as any
    const valid = await form.validate()
    if (!valid) { return}
    this.registerNext = true
  }

  async submit() {
    const form = this.$refs.subForm as any
    const valid = await form.validate()
    if (!valid) { return}
    if (this.subForm.requestId == '') {
      info('请核实你的操作流程，是否获取验证码', {title: '提示'})
      return
    }

    let postData = {}
    const cloneForm: any = except(this.form, 'passwordAgain,area')
    const cloneSubForm: any = except(this.subForm, 'agreement')
    const qualificationImageList = (cloneForm.qualificationImageList || []).map((it: any) => it.fileId)

    if (this.subForm.companyType == 1) { // 公司
      postData = {
        ...cloneForm,
        ...cloneSubForm,
        companyName: cloneForm.companyName.trim(),
        qualificationImageList
      }
    } else if (this.subForm.companyType == 2) { // 个人
       postData = {
        ...cloneSubForm,
       }
    }

    try {
      const { data } = await register(postData)
      this.$router.push({ name: 'register-success' })
    } catch (ex) {
      ((this as any)[`onSubmit${ex.code}`] || this.handleError).call(this, ex)
    }
  }

  onSubmit8007303( ) {
    this.smsCodeError = '验证码错误'
  }

  @Watch('form.area', { deep: true })
  watchArea(val: number[]) {
    this.form.provinceId = val[0]
    this.form.cityId = val[1]
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './login/common.less';
.upload-add-in {
  text-align: center;
}
/deep/ .ivu-cascader {
  .ivu-input {
    padding-left: 20px;
  }
}
/deep/ .form .ivu-input {
  padding-left: 20px;
}
.flex-justify-between {
  display: flex;
  justify-content: space-between;
}
.main-wrap .tablist {
  .systerm {
    padding-bottom: 20px;
  }
  .tabs {
    font-size: 24px;
    color: #2f6af9;
    font-weight: normal;
    display: flex;
    justify-content: space-between;
    padding: 0 35px 30px;
    span {
      cursor: pointer;
      padding-bottom: 5px;
      &.active {
        color: #fff;
        border-bottom: solid 1px #fff;
      }
    }
  }
  .go-back {
    font-size: 14px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0 0 30px;
    font-weight: normal;
    span:nth-child(2) {
      cursor: pointer;
      border-bottom: solid 1px #fff;
    }
  }
}

/deep/ .upload-box {
  background: none;
  .upload-item {
    width: 55px;
    height: 55px;
    margin: 0 8px 0 0;
    background: rgba(16, 23, 44, 0.6);
    color: #fff;
  }
  .upload-list {
    padding: 0;
  }
}
/deep/ .form-item-getcode {
  .ivu-form-item-content {
    display: flex;
    justify-content: space-between;
  }
}
.btn-code {
  width: 126px;
  height: 48px;
  position: absolute;
  right: 0;
  background: none;
  border-radius: 10px;
  color: #2f6af9;
  font-size: 14px;
  border: none;
  &:hover {
    background: none;
    color: #2f6af9;
  }
}
.to-apply {
  padding-top: 18px;
}
.check-ready {
  color: #fff;
  margin-bottom: 18px;
  /deep/ .ivu-form-item-content {
    line-height: 25px;
    display: flex;
  }
}
/deep/ .ivu-checkbox-inner {
  border: none;
  outline: none;
  background-color: rgba(16, 23, 44, 0.6);
  width: 19px;
  height: 19px;
  &::after {
    width: 6px;
    height: 12px;
    left: 6px;
  }
}

@media screen and(max-height: 800px) {
  .main-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -55%);
    max-height: 480px;
    overflow-y: scroll;
  }
  .main-wrap::-webkit-scrollbar {
    width: 8px;
  }
  .main-wrap::-webkit-scrollbar-track {
    background-color: rgba(16, 23, 44, 0.6);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
  .main-wrap::-webkit-scrollbar-thumb {
    background-color: rgba(16, 23, 44, 1);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
}
</style>
