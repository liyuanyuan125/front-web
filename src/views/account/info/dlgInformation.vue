<template>
  <div>
    <Modal
      v-model="value.visibleInforma"
      class-name="vertical-center-modal"
      title="变更账号信息"
      width="800"
    >
      <div class="digtext">
        说明：如有需要可对以下账号信息进行变更，账号变更申请提交后将由平台进行审核，
        账号变更期间不会影响账号的正常使用。
      </div>
      <Form :model="form" :label-width="90" class="edit-input">
        <FormItem label="账号类型">
          <CheckboxGroup v-model="form.accountType" class="item-type">
            <Checkbox size="large" label="ads">广告方</Checkbox>
            <Checkbox size="large" label="resource">资源方</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="公司名称">
          <Input v-model="form.companyName" placeholder="请输入公司名称"></Input>
        </FormItem>
        <FormItem label="资质类型">
           <Select v-model="form.qualificationType" style="width:400px">
          <Option
            v-for="item in value.qualificationTypeList"
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
            <Upload
              v-model="form.imageList"
              :max-count="3"
              multiple
              accept="images/*"
              confirm-on-del
            />
            <div class="upload-tip">支持1或3张，格式为jpg/jpeg/png，大小不超过5M的图片</div>
          </div>
        </FormItem>
      </Form>
      <div slot="footer" class="btnCenter">
        <Button  class="button-cancel" @click="value.visibleInforma = false">取消</Button>
        <Button type="primary" class="button-ok" @click="changeData">变更数据</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Upload, { FileItem } from '@/components/upload'
import { changeCompanyList } from '@/api/account'

@Component({
  components: {
    Upload
  }
})
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any
  form: any = {
    accountType: [],
    companyName: '',
    imageList: [],
    qualificationType: '',
    qualificationCode: ''
  }
  async changeData() {
    const cloneForm = Object.assign(this.form)
    cloneForm.imageList = cloneForm.imageList.map((item: any) => item.fileId)
    try {
      await changeCompanyList(cloneForm)
      this.value.visibleInforma = false
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
.upload-wrap {
  position: relative;
  margin-top: 10px;
}
/deep/ .ivu-modal-header {
  border-bottom: 0;
  padding: 10px 13px;
  background: #f9f9f9;
}
/deep/ .ivu-modal-body {
  font-size: 14px;
  color: #444;
  .digtext {
    margin: 0 115px 25px;
    padding: 10px;
    color: rgba(68, 68, 68, 1);
    background: rgba(230, 247, 255, 1);
    border-radius: 2px;
    border: 1px solid rgba(145, 213, 255, 1);
    line-height: 23px;
  }
  .ivu-form-item {
    margin-left: 113px;
  }
}
.item-type {
  margin-top: 3px;
}
/deep/ .ivu-modal-footer {
  padding-bottom: 30px;
}
/deep/ .ivu-checkbox + span {
  margin-left: 3px;
}
</style>

