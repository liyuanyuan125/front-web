<template>
  <loginLayout>
      <div class="main-wrap">
          <div class="tablist">
            <p class="systerm flex-box">
                <span>申请加入</span>
                <em>已有账户？<router-link :to="{name: 'tologin'}">立即登录</router-link></em>
            </p>
          </div>
          <Form :model="form" :rules="rules" ref="form"
            @submit.native.prevent="submit" novalidate>
            <FormItem prop="companyName">
              <Input v-model="form.companyName" placeholder="企业名称">
                <i class="iconfont icon-qiye" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="name" >
              <Input  v-model="form.name" placeholder="联系人姓名">
                <i class="iconfont icon-lianxiren" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="tel">
              <Input  v-model="form.tel" placeholder="联系电话">
                <i class="iconfont icon-lianxidianhua" slot="prefix" />
              </Input>
            </FormItem>
            <FormItem prop="area" >
               <AreaSelect v-model="form.area" :max-level="2" no-self/>
               <i class="iconfont icon-suozaidi" slot="prefix" />
            </FormItem>
            <FormItem prop="info" class="text-area">
              <Input type="textarea"  v-model="form.info" :rows="3" placeholder="请简单备注您的需求"></Input>
            </FormItem>
            <Button type="primary" html-type="submit" class="submit" long :disabled="submitDisabled">提交申请</Button>
          </Form>
      </div>
    </loginLayout>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { login } from '@/api/auth'
import setUserByData from '@/util/setUserByData'
import { getCaptchaImage } from '@/api/captcha'
import loginLayout from './loginLayout.vue'
import AreaSelect from '@/components/areaSelect'
@Component({
  components: {
    loginLayout,
    AreaSelect
  }
})
export default class Main extends ViewBase {
  form = {
    companyName: '',
    adress: '',
    name: '',
    tel: '',
    info: ''
  }
  nameError = ''
  emailError = ''
  passwordError = ''

//   captchaImg = ''
//   captchaCodeError = ''

  submitDisabled = false

  rules = {
    companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
    area: [{ required: true, message: '请输入地址', trigger: 'blur' }],
    name: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
    tel: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
    info: [{ required: true, message: '请输入备注', trigger: 'blur' }],
    // captchaCode: [{ required: true, message: '请输入图片验证码', trigger: 'blur' }]
  }


  async submit() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) {
      return
    }

    this.emailError = ''
    this.passwordError = ''

    this.submitDisabled = true

    // try {
    //   const postData = { ...this.form }
    //   const { data } = await login(postData)
    //   setUserByData({
    //     ...data,
    //     systemCode: postData.systemCode
    //   })

    //   this.$router.push({ name: 'home' })
    // } catch (ex) {
    //   ((this as any)[`onLogin${ex.code}`] || this.handleError).call(this, ex)
    //   this.resetCaptcha()
    // } finally {
    //   this.submitDisabled = false
    // }
  }

  onLogin9006201() {
    this.emailError = '账号不存在'
  }

  onLogin10002(ex: any) {
    this.handleError(ex)
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
// @import '~@/site/login.less';
@import '~@/assets/iconFont/iconfont.css';

.main-wrap {
  width: 450px;
  background: #fff;
  padding: 23px 40px 20px;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -55%);
  .tablist {
    width: 100%;
    margin-bottom: 20px;
    .systerm {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-size: 23px;
      }
      em {
        font-size: 15px;
      }
    }
  }
  /deep/ input {
    outline: none;
    height: 48px;
    font-size: 15px;
    border-radius: 10px;
    border: solid 1px #d0d0d0;
    &:last-child {
      padding-left: 16px;
    }
    &::placeholder {
      color: #4a506a;
    }
  }
  /deep/ .ivu-input-with-prefix {
    padding-left: 40px;
  }
  /deep/ .ivu-input-prefix {
    width: 33px;
    text-align: right;
    i {
      line-height: 48px;
      font-size: 19px;
      color: #4a506a;
    }
  }
  /deep/ .ivu-checkbox-wrapper {
    font-size: 15px;
  }
}
.submit {
  border-radius: 25px;
  height: 47px;
  background: #4561d7;
  font-size: 17px;
  color: #fff;
  text-align: center;
  border: none;
}
.captcha-wrap {
  position: relative;
  width: 100%;
}
.captcha-img {
  position: absolute;
  top: 3px;
  right: 3px;
  height: 41px;
  border-left: 1px solid @c-border;
  cursor: pointer;
}
// /deep/ .ivu-form-item{
//   margin-bottom: 20px;
// }
/deep/ .text-area {
  textarea.ivu-input {
    border-radius: 10px;
    border: solid 1px #d0d0d0;
    padding-left: 12px;
    &::placeholder {
      color: #4a506a;
    }
  }
}
@media screen and(max-height: 600px) {
  .main-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
