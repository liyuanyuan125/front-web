<template>
  <Modal v-model='showDlg'
  title="设置投放任务"
  :transfer='false'
  :width='700'
  :styles="{top: '20px'}"
  :mask-closable='false'
  @on-cancel="cancel()">
    <div class="detail-box">
      <Form :model="form" ref="dataform" :rules="rule" label-position="left" :label-width="100" class="edit-input">
        <FormItem label="广告位" prop="name">
          <RadioGroup v-model="form.name">
            <Radio label="单图文" ></Radio>
            <Radio label="图文"></Radio>
            <Radio label="多图文"></Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="文章标题" prop="name">
          <Input  v-model="form.title" placeholder='例如"2019奥迪Q3'></Input>
        </FormItem>

        <FormItem label="封面图" prop="name">
          <Upload v-model="form.img" :maxCount="1" accept="image/*" />
        </FormItem>

        <FormItem label="摘要" prop="name">
          <Input v-model="form.value" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入" />
        </FormItem>

        <FormItem label="正文内容" prop="name">
          <Froala v-model="form.content" />
        </FormItem>

        <FormItem label="发布时间" prop="name">
          <DatePicker format="yyyy-MM-dd HH:mm" :options="startDate" type="datetime" placeholder="Select date" style="width: 200px"></DatePicker>
        </FormItem>

        <FormItem label="原文链接" prop="name">
          <Input  v-model="form.name" placeholder='例如"2019奥迪Q3'></Input>
        </FormItem>
      </Form>
    </div>
    <div slot="footer" class="foot">
      <Button class="foot-button" type="default" @click="cancel">取消</Button>
      <Button class="foot-button" type="primary" @click="open">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fileList, queryList } from '@/api/shopping'
import Upload from '@/components/upload.vue'
import Froala from './froala.vue'

@Component({
  components: {
    Froala,
    Upload
  }
})
export default class DlgEditCinema extends ViewBase {
  @Prop() id!: any
  showDlg = false
  numId = 0
  data: any = []
  dataName = ''
  form: any = {
    img: [],
    value: '',
    name: '',
    title: '',
    content: ''
  }

  rule: any = {}

  startDate: any = {
    disabledDate: (date: any) => {
      return date && date.valueOf() < Date.now()
    }
  }

  async init(id: number) {
    this.numId = id
    this.showDlg = true
  }

  open() {
  }

  drop(name: any) {
  }

  cancel() {
    this.showDlg = false
  }

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
/deep/ .edit-input .ivu-form-item-content .ivu-input-wrapper {
  width: 100%;
}
.detail-box {
  padding: 0 20px;
  /deep/ .ivu-btn {
    height: 30px;
    text-align: center;
  }
}
.foot {
  text-align: center;
  /deep/ .ivu-btn {
    height: 34px;
    text-align: center;
  }
}
</style>
