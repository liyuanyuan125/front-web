<template>
  <Modal
    v-model="showDlg"
    title="设置投放任务"
    :transfer="false"
    :width="640"
    :styles="{top: '20px'}"
    :mask-closable="false"
    @on-cancel="cancel()"
  >
    <div class="detail-box">
      <Form
        :model="form"
        ref="dataform"
        :rules="rule"
        label-position="left"
        :label-width="100"
        class="edit-input"
      >
        <FormItem label="发布时间" prop="name">
          <DatePicker
            format="yyyy-MM-dd HH:mm"
            :options="startDate"
            v-model="form.publishTime"
            type="datetime"
            placeholder="请选择执行时间"
            style="width: 300px"
          ></DatePicker>
        </FormItem>

        <FormItem label="任务类型" prop="name">
          <RadioGroup v-model="form.publishCategoryCode">
            <Radio label="单图文"></Radio>
            <Radio label="图文"></Radio>
            <Radio label="多图文"></Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="原发内容" prop="summary">
          <Input
            v-model="form.summary"
            type="textarea"
            :autosize="{minRows: 4,maxRows: 10}"
            placeholder="请输入"
          />
        </FormItem>

        <FormItem label="原发图片" prop="img">
          <Upload v-model="form.img" :maxCount="1" accept="image/*"/>
        </FormItem>

        <FormItem label="推广链接" prop="url">
          <Input v-model="form.url" placeholder="例如2019奥迪Q3"></Input>
        </FormItem>
        <div>
          <FormItem label="转发链接" prop="url">
            <Input v-model="form.url" placeholder="例如2019奥迪Q3"></Input>
          </FormItem>

          <FormItem label="转发语" prop="name">
            <Input
              v-model="form.summary"
              type="textarea"
              :autosize="{minRows: 4,maxRows: 10}"
              placeholder="请输入"
            />
          </FormItem>
        </div>
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
    summary: '',
    publishTime: '',
    publishCategoryCode: '',
    url: ''
  }

  rule: any = {}

  startDate: any = {
    disabledDate: (date: any) => {
      return date && date.valueOf() < Date.now() + 3600 * 1000 * 24
    }
  }

  async init(id: number) {
    this.numId = id
    this.showDlg = true
  }

  open() {}

  drop(name: any) {}

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
