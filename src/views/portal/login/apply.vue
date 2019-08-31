<template>
  <loginLayout>
      <div class="main-wrap ">
          <div class="tablist">
            <p class="systerm">平台留言</p>
          </div>
          <Form :model="form" :rules="rules" ref="form"
            @submit.native.prevent="submit" novalidate>
            <FormItem prop="companyName">
              <Input type="text" v-model="form.companyName" autocomplete="off" disableautocomplete placeholder="企业名称">
                <i class="iconfont icon-qiye" slot="prefix"><font></font></i>
              </Input>
            </FormItem>
            <FormItem prop="contactName" >
              <Input  v-model="form.contactName" placeholder="联系人姓名">
                <i class="iconfont icon-lianxiren" slot="prefix"><font></font></i>
              </Input>
            </FormItem>
            <FormItem prop="contactTel">
              <Input  v-model="form.contactTel" placeholder="联系电话" :maxlength="11">
                <i class="iconfont icon-lianxidianhua" slot="prefix"><font></font></i>
              </Input>
            </FormItem>
            <FormItem prop="area" >
               <AreaSelect v-model="form.area" ref="areas"  :max-level="2" no-self/>
               <i class="iconfont icon-suozaidi" slot="prefix"><font></font></i>
            </FormItem>
            <FormItem prop="remark" class="text-area">
              <Input type="textarea"  v-model="form.remark" :rows="3" placeholder="请简单备注您的需求"></Input>
            </FormItem>
            <Button type="primary" html-type="submit" class="submit" long :disabled="submitDisabled">提交申请</Button>
            <p class="to-apply">
               已有账户？<router-link :to="{name: 'tologin'}">立即登录</router-link>
            </p>
          </Form>
      </div>
    </loginLayout>
</template>

<script lang='ts'>
import { Component, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { login, getBoards } from '@/api/auth'
import setUserByData from '@/util/setUserByData'
import { getCaptchaImage } from '@/api/captcha'
import loginLayout from './loginLayout.vue'
import AreaSelect from '@/components/areaSelect'


@Component({
  components: {
    loginLayout,
    AreaSelect,
  }
})
export default class Main extends ViewBase {
  form: any = {
    companyName: '',
    area: [],
    provinceId: 0,
    provinceName: '',
    cityId: 0,
    cityName: '',
    contactName: '',
    contactTel: '',
    remark: ''
  }

  submitDisabled = false

  rules = {
    companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
    area: [{ required: true, type: 'array', message: '所在地不能为空', trigger: 'change' }],
    contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
    contactTel: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
    remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
    // captchaCode: [{ required: true, message: '请输入图片验证码', trigger: 'blur' }]
  }

  async submit() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) {
      return
    }
    this.submitDisabled = true
    // provinceId provinceName, cityId, cityName
    const dataList = (this.$refs.areas as any).data
    let provinceName = null
    let cityName = null

    dataList.map( (item: any) => {
      if (item.value == this.form.provinceId) {
        provinceName = item.label
        item.children.map((it: any) => {
          if (it.value == this.form.cityId) {
            cityName = item.label
          }
        })
      }
    })
    try {
      const { data } = await getBoards({
        ...this.form,
        provinceName,
        cityName
      })
      this.$router.push({name: 'login'})
    } catch (ex) {
      this.handleError(ex)
    }
  }
  @Watch('form.area', { deep: true })
  watchArea(val: number[]) {
    this.form.provinceId = val[0]
    this.form.cityId = val[1]
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/assets/iconFont/iconfont.css';
@import './common.less';
.main-wrap {
  padding-top: 0;
  padding-bottom: 30px;
}
.systerm {
  font-size: 31px;
  padding: 31px 0 5px;
  text-align: center;
}
/deep/ .ivu-cascader {
  .ivu-input {
    padding-left: 11px;
  }
}
/deep/ .text-area {
  overflow: hidden;
  textarea.ivu-input {
    color: #fff;
    border: none;
    background: rgba(16, 23, 44, .6);
    border-radius: 10px;
    padding-left: 12px;
    font-size: 14px;
    &::placeholder {
      color: #fff;
    }
  }
}
.to-apply {
  padding-top: 18px;
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
