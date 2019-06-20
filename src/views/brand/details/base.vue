<template>
  <div class="base-home">
      <h2 class="model-table-title list-title">
         <span class="count">品牌基础信息</span>
         <Button type="primary"  class="btn-edit" @click="toEdit">编辑基础信息</Button>
      </h2>
      <Form ref="form" :model="form" :rules="rule" :label-width="110" class="edit-input base-form">
        <FormItem label="简体中文名称" prop="name">
          <span v-if="!readonly" class="item-only">{{baseList.name}}</span>
          <Input v-else v-model="form.name"  />
        </FormItem>
        <FormItem label="英文名" >
          <span v-if="!readonly" class="item-only">{{baseList.enName}}</span>
          <Input v-else v-model="form.enName"  />
        </FormItem>
        <FormItem label="创立时间" prop="foundDate">
          <span v-if="!readonly" class="item-only" >{{baseList.foundDate}}年</span>
          <Input v-else v-model="form.foundDate" >年</Input>
        </FormItem>
        <FormItem label="国别" prop="countryCode">
          <div v-if="!readonly">
            <span class="item-only"  v-for="item in countryCodeList" :key="item.key" v-if="item.key == baseList.countryCode">{{item.text}}</span>
          </div>
          <Select v-else v-model="form.countryCode" filterable >
              <Option v-for="item in countryCodeList" :key="item.key" :value="item.key">{{item.text}}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属行业" prop="tradeCode">
          <div v-if="!readonly">
             <span class="item-only" v-for="item in tradeCodeList" :key="item.key" v-if="item.key == baseList.tradeCode" >{{item.text}}</span>
          </div>
          <Select v-else v-model="form.tradeCode" filterable >
              <Option v-for="item in tradeCodeList" :key="item.key" :value="item.key">{{item.text}}</Option>
          </Select>
        </FormItem>
        <FormItem label="创始人" prop="founder">
          <span v-if="!readonly" class="item-only">{{baseList.founder}}</span>
          <Input v-else v-model="form.founder" />
        </FormItem>
        <FormItem label="公司口号" prop="companySlogan">
          <span v-if="!readonly" class="item-only">{{baseList.companySlogan}}</span>
          <Input v-else v-model="form.companySlogan" style="width: 100%" />
        </FormItem>
        <FormItem label="公司简介" prop="description">
          <span v-if="!readonly" class="item-only">{{baseList.description}}</span>
          <Input v-else v-model="form.description" type="textarea" style="width: 100%" :rows="4"  />
        </FormItem>
      </Form>
      <div class="footer-btn" v-if="readonly">
          <Button class="btn-cancel" @click="handleCancel">取消</Button>
          <Button type="primary" class="btn-add" @click="baseSubmit">提交审核</Button>
      </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import eventDate from '../eventBus'
import { baseList, editBase } from '@/api/brandList'


@Component
export default class Main extends ViewBase {
  @Prop({type: Number, default: 0}) id!: number
  @Prop({type: Number, default: 0}) brandId!: number

  form = {}

  readonly = false // 默认不编辑
  baseList: any = {}
  countryCodeList = []
  tradeCodeList = []

  get rule() {
    return {
      name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
      createTime: [{ required: true, message: '请输入创立时间', trigger: 'change' }],
      nationality: [{ required: true, message: '请输入国别', trigger: 'change' }],
      type: [{ required: true, message: '请输入所属行业', trigger: 'change' }],
      author: [{ required: true, message: '请输入创始人', trigger: 'change' }],
      slogan: [{ required: true, message: '请输入公司口号', trigger: 'change' }],
      introdution: [{ required: true, message: '请输入公司简介', trigger: 'change' }],
    }
  }

  mounted() {
    this.queryList()
  }

  async queryList() {
    try {
      const { data: {item, tradeCodeList, countryCodeList} } = await baseList(this.brandId)
      this.baseList = item
      this.countryCodeList = countryCodeList || []
      this.tradeCodeList = tradeCodeList || []

    // 给moredetail 带enName 和 tradeCodeName  item.tradeCode
    // eventDate.$emit('passParamer', detail)

    // localStorage.setItem('brandImg', JSON.stringify(imgList))
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async baseSubmit() {
    // const volid = await (this.$refs.form as any).validate()
    // if (!volid) { return }
    const fileId = localStorage.getItem('fileId') || ''
    try {
      const { data } = await editBase({
        ...this.form,
        logo: fileId,
        id: this.brandId,
      })
      this.readonly = false
      eventDate.$emit('uploadImg', false)
      this.queryList()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  toEdit() {
    this.readonly = true
    const { name, enName, foundDate, countryCode, tradeCode, founder,
            companySlogan, description, logoUrl, logo} = this.baseList
    this.form = {
      name,
      enName,
      foundDate,
      countryCode,
      tradeCode,
      founder,
      companySlogan,
      description
    }
    eventDate.$emit('uploadImg', true)
  }
  handleCancel() {
    this.readonly = false
    eventDate.$emit('uploadImg', false)
  }

  destroyed() {
    eventDate.$emit('uploadImg', false)
  }
}
</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
.base-form {
  padding: 30px 30px 10px 20px;
  .item-only {
    display: block;
    font-size: 14px;
    color: #fff;
    padding-top: 3px;
  }
}
.footer-btn {
  text-align: center;
  position: absolute;
  bottom: 30px;
  left: 50%;
}
/deep/ .ivu-form {
  .ivu-form-item-label {
    color: #b3bcc0;
  }
  .ivu-form-item-content {
    padding-left: 24px;
  }
  .ivu-form-item-error-tip {
    left: 24px;
  }
}
/deep/ .ivu-select {
  width: 400px;
  .ivu-select-dropdown {
    width: auto;
  }
}
</style>