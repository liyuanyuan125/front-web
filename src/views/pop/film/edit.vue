<template>
  <div class="page home-bg">
     <h2 class="layout-nav-title">广告片 >
       <span v-if="!$route.params.id"> 新建广告片</span>
       <span v-else> 编辑广告片</span>
     </h2>
     <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="edit-input edit-form">
        <FormItem  label="广告片名称" prop="name">
          <Input v-model="form.name" placeholder="请输入广告片名称"></Input>
        </FormItem>

        <FormItem  label="选择客户" prop="customerId">
          <Select v-model="form.customerId"  clearable>
            <Option v-for="(item, index) in customerList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem  label="广告片规格" prop="specification">
          <Select v-model="form.specification"  clearable filterable>
            <Option v-for="(item, index) in specificationList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <em class="remark">备注：广告片规格请输入15s的倍数</em>
        </FormItem>

        <FormItem  label="上传广告片">
          <UploadLabel class="upload-label" @start="uploadStart" @success="uploadSuccess">
            <div class="update">
              <p class="update-video">上传广告片</p>
              <p>小于2G的视频文件</p>
            </div>
          </UploadLabel>
        </FormItem>
     </Form>
     <div class="btnCenter create-submit-btn">
       <Button v-if="!$route.params.id" type="primary" @click="createSubmit('dataform')" class="button-ok">提交审核</Button>
       <Button v-else type="primary" class="button-ok" @click="editSubmit('dataform')">保存修改</Button>
     </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { confirm } from '@/ui/modal'
import { popPartners, detailPop, createPop, editPop, transFee} from '@/api/popFilm'
import UploadLabel, { SuccessEvent } from '@/components/uploadLabel'

@Component({
  components: {
    UploadLabel
  }
})
export default class Main extends ViewBase {
  form: any = {
    name: '',
    customerId: '',
    specification: '',
  }

  // 源视频文件上传后的ID
  srcFileId = ''
  // 广告片时长
  length = 29
  // 转码费
  transFee = 1

  customerList = []
  specificationList: any = []

  get rule() {
    return {
      name: [
        { required: true, message: '请输入广告片名称', trigger: 'change' }
      ],
      customerId: [
        { required: true, message: '请选择客户', trigger: 'change', type: 'number'  }
      ],
      specification: [
        { required: true, message: '请选择广告片规格', trigger: 'change', type: 'number'  }
      ],
    }
  }

  async mounted() {
    this.partnersList()
    this.creSpecificationList()
    // 编辑
    if (this.$route.params.id) {
       this.detailList()
    }
  }

  uploadStart() {
    this.srcFileId = ''
  }

  uploadSuccess({ file }: SuccessEvent) {
    this.srcFileId = file.fileId
  }

  creSpecificationList() {
    for ( let i = 1 ; i < 41; i ++) {
      this.specificationList.push({id: i * 15, name: i * 15})
    }
  }

  async detailList() {
    const id = this.$route.params.id
    try {
      const { data: { item} } = await detailPop(id)
      this.form = {
         name: item.name,
         customerId: item.customerId,
         specification: item.specification,
      }
    } catch (ex) {
      // this.handleError(ex.msg)
    }
  }

  async createSubmit(dataform: any) {
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) {
      return
    }
    // 二次确定弹框
    const specification = this.form.specification
    try {
      const { data } = await transFee({ specification })
      await confirm(`数字转制费用：${data} 元`, {title: '确认新建广告片'})
      this.createSub()
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }

  async createSub() {
    const customerName: any = this.customerList.filter( (item: any) => item.id == this.form.customerId)
    try {
      const { data } = await createPop({
        ...this.form,
        srcFileId: this.srcFileId,
        length: this.length,
        transFee: this.transFee,
        customerName: customerName[0].name
      })

      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }

  async editSubmit(dataform: any) {
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) {
      return
    }
    const id = this.$route.params.id
    try {
      const { data } = await editPop({
        ...this.form,
        srcFileId: this.srcFileId,
        length: this.length,
        transFee: this.transFee
      }, id)
      this.$router.push({name: 'pop-film'})
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }

  async partnersList() {
    const id = getUser()!.id
    try {
      const { data: {items} } = await popPartners(id)
      this.customerList = items
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/common.less';
/deep/ .ivu-form-item-required .ivu-form-item-label::before {
  content: '';
}
.create-submit-btn {
  margin-bottom: 30px;
}
.edit-form {
  padding: 20px 0 30px 30px;
  .remark {
    color: #c5c8ce;
    margin-left: 20px;
    font-size: 13px;
  }
  .upload-label {
    margin-top: 15px;
    width: 300px;
    height: 225px;
    border: solid 1px #ccc;
    border-radius: 2px;
  }
  .update {
    display: inline-block;
    width: 100%;
    height: 100%;
    text-align: center;
    color: #888;
    font-size: 12px;
    cursor: pointer;
    .update-video {
      margin: 100px 0 50px;
    }
  }
}
</style>
