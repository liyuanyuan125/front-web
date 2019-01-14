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
      <Form :model="from" :label-width="90" class="edit-input">
        <FormItem label="账号类型">
          <CheckboxGroup v-model="from.accountType">
            <Checkbox size="large" label="广告方"></Checkbox>
            <Checkbox size="large" label="资源方"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="公司名称">
          <Input v-model="from.companyName"></Input>
        </FormItem>
        <FormItem label="资质类型">
          <Input v-model="from.input"></Input>
        </FormItem>
        <FormItem label="资质编号">
          <Input v-model="from.input"></Input>
        </FormItem>
        <FormItem label="资质图片">
          <div class="upload-wrap">
            <Upload
              v-model="from.imageList"
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
        <button class="button-cancel" @click="value.visibleInforma = false">取消</button>
        <button class="button-ok" @click="changeData">变更数据</button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Upload, { FileItem } from '@/components/upload'

@Component({
  components: {
    Upload
  }
})
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any
  from: any = {
    accountType: [],
    companyName: '',
    imageList: [],
    qualificationType: '',
    qualificationCode: ''
  }
  fruit = []
  changeData() {}
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
/deep/ .ivu-modal-footer {
  padding-bottom: 30px;
}
</style>

