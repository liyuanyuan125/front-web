<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title"><span @click="goBack">客户管理</span> > {{title}}</span>
    </h3>
    <Form ref="form" :model="from" class="edit-input from" :rules="dataRule" :label-width="100">
      <FormItem label="客户名称" class="item-account-email" prop="name">
        <Input type="text" v-model="from.name" ></Input>
      </FormItem>
      <FormItem label="客户简称" prop="nameShort">
        <Input type="text" v-model="from.nameShort" ></Input>
      </FormItem>
      <FormItem label="客户行业" prop="businessCode">
        <Select v-model="from.businessCode" clearable>
          <Option v-for="it in businessList" :key="it.code"
            :value="it.code">{{it.desc}}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属品类" prop="businessCategoryCode" :show-message="!!from.businessCode">
        <Select :disabled="!from.businessCode" v-model="from.businessCategoryCode" clearable>
          <Option v-for="it in codeList" :key="it.code"
            :value="it.code">{{it.desc}}</Option>
        </Select>
      </FormItem>
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
      <Button type="primary" v-if="!$route.params.id" class="button-ok" @click="passwordkSet('form')">提交</Button>
      <Button type="primary" v-else class="button-ok" @click="passwordkSet('form')">修改</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { toast } from '@/ui/modal'
import { slice } from '@/fn/object'
import ViewBase from '@/util/ViewBase'
import { setPassword } from '@/api/password'
import { getUser } from '@/store'
import { postcontact, contact, putcontact, business, codeList } from '@/api/customer'

@Component
export default class Main extends ViewBase {
  title = '新增客户'
  businessList: any = []
  codeList: any = []
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
    this.business()
    this.init()
  }

  async business() {
    try {
      const { data } = await business()
      this.businessList = data
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async codeSearch() {
    const datas = await codeList(this.from.businessCode)
    this.codeList = datas.data || []
  }

  async init() {
    if (!this.$route.params.id) {
      return
    }
    this.title = '编辑客户'
    try {
      const { data: { partner } } = await contact(this.$route.params.id)
      this.from.name = partner.name
      this.from.nameShort = partner.nameShort
      this.from.businessCode = partner.businessCode
      this.from.businessCategoryCode = partner.businessCategoryCode
      this.from.contactName = partner.contactName
      this.from.contactTel = partner.contactTel
      this.from.contactAddress = partner.contactAddress
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
      this.$route.params.id ? await putcontact(this.$route.params.id, {...this.from}) :
      await postcontact({...this.from})
      toast('操作成功')
      this.$router.push({name: 'customer-list'})
      ; (this.$refs.form as any).resetFields()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  goBack() {
    this.$router.push({ name: 'customer-list' })
  }

  @Watch('from.businessCode', {deep: true})
  watchbusinessCode(val: any) {
    if (val) {
      this.codeSearch()
    } else {
      this.from.businessCategoryCode = ''
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
.sumbit-button {
  margin-top: 80px;
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
.ivu-select {
  width: auto;
  /deep/ .ivu-select-selection {
    height: 40px;
    /deep/ .ivu-select-input {
      height: 40px;
      width: 400px;
      font-size: 14px;
      margin-bottom: 30px;
    }
  }
  /deep/ .ivu-select-dropdown {
    /deep/ li, /deep/ .ivu-select-loading {
      line-height: 35px;
      height: 35px;
    }
    /deep/ .ivu-select-item {
      font-size: 14px;
      line-height: 25px;
      height: 35px;
    }
  }
}
/deep/ .ivu-input {
  font-size: 14px;
}
</style>