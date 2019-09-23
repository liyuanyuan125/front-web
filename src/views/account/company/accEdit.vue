<template>
  <div class="page as">
    <Form :model="form"   ref="dataform" label-position="left" :label-width="100" class="edit-input">
      <div class='bs'>
      <h3 class="layout-title">公司信息</h3>
      <FormItem label="公司所在地" class="item-top">
        <AreaSelect v-model="form.area" :max-level="2" no-self/>
      </FormItem>
      <FormItem label="联系人" >
        <Input v-model="form.contact" placeholder="请输入联系人姓名"></Input>
      </FormItem>
      <FormItem label="手机号" >
        <Input v-model="form.contactTel" :maxlength="11" placeholder="请输入手机号"></Input>
      </FormItem>
      <FormItem label="个人邮箱" >
        <Input v-model="form.companyEmail" placeholder="请输入个人邮箱"></Input>
      </FormItem>
    </div>
    </Form>
    <div class="btn-center-footer">
      <Button
        type="primary"
        :disabled="submitDisabled"
        class="button-ok edit-submit bok"
        @click="editAccount()"
      >提交申请</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { countDown } from '@/fn/timer'
import AreaSelect from '@/components/areaSelect'
import { accountDetail, getLoginEmail, auditingAccount } from '@/api/account'
import { updateEmail } from '@/store'

@Component({
  components: {
    AreaSelect
  }
})
export default class Main extends ViewBase {
  submitDisabled = false

  form: any = {
    contact: '',
    contactTel: '',
    companyEmail: '',
    area: []
  }

  async mounted() {
    const { data } = await accountDetail()
    this.form = {
      contact: data.company.contact,
      contactTel: data.company.contactTel,
      companyEmail: data.company.email,
      area: [data.company.provinceId, data.company.cityId]
    }
  }

  async editAccount() {
    this.submitDisabled = true
    const cloneForm = Object.assign(this.form)
    try {
      await auditingAccount({
        ...cloneForm,
        provinceId: this.form.area[0],
        cityId: this.form.area[1]
      })
      this.$router.push({ name: 'account-company' })
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.submitDisabled = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/common.less';
@import '~@/views/account/less/formInput.less';

.item-top {
  padding-top: 20px;
}
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
  width: 400px;
}
/deep/ .ivu-input-wrapper {
  width: auto;
}
.layout-title {
  background: rgba(255, 255, 255, 0);
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 32, 45, 1);
  margin-top: 10px;
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

.page {
  .ivu-form-item {
    padding-left: 30px;
    color: @c-text;
  }
  .modifyCode {
    cursor: pointer;
    font-size: 13px;
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
