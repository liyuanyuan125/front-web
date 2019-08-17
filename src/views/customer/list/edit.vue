<template>
  <div class="page home-bg as">
    <h3 class="nav">
      <span>{{titles}}</span>
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
    <div class="btn-center-footer sumbit-button">
      <Button type="primary" v-if="!$route.params.id" class="button-ok but" @click="passwordkSet('form')">提交</Button>
      <Button type="primary" v-else class="button-ok but" @click="passwordkSet('form')">修改</Button>
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
  titles = '客户基础信息'
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
    this.titles = '编辑客户基础信息'
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
.as {
  background: rgba(255, 255, 255, 0);
}
.nav {
  background: rgba(0, 32, 45, 1);
  height: 60px;
  line-height: 60px;
  color: rgba(179, 188, 192, 1);
  font-size: 15px;
  font-size: 400;
  border-radius: 5px 5px 0 0;
  span {
    font-size: 16px;
    font-weight: 400;
    color: #fff;
    margin-left: 40px;
  }
}
.login-email {
  font-size: 14px;
  position: relative;
  top: 3px;
}
.from {
  background: rgba(0, 32, 45, 0.8);
  padding: 30px 0 60px 30px;
  border-radius: 0 0 5px 5px;
}
.sumbit-button {
  margin-top: 80px;
}
.but {
  width: 200px;
  height: 50px;
  background: rgba(249, 216, 94, 1);
  border-radius: 25px;
  border: 0;
  color: rgba(0, 32, 45, 1);
  font-size: 18px;
  font-weight: 500;
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
/deep/ .ivu-select-selection {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-select-input {
  margin-top: 3px;
  height: 40px;
  width: 400px;
  font-size: 14px;
  margin-bottom: 30px;
}
/deep/ .ivu-input {
  font-size: 14px;
  border-radius: 5px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-form-item-label {
  color: rgba(179, 188, 192, 1);
  text-align: left;
  padding-left: 13px;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
/deep/ .ivu-select-disabled .ivu-select-selection .ivu-select-arrow {
  color: #808695;
  font-size: 17px;
}
/deep/ .ivu-select-arrow {
  font-size: 17px;
}
</style>
