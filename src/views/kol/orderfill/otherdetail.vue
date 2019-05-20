<template>
  <Modal v-model='showDlg'
  title="设置投放任务"
  :transfer='false'
  :width='700'
  :styles="{top: '20px'}"
  :mask-closable='false'
  @on-cancel="cancel()">
    <div class="detail-box">
      <Form :model="form" ref="dataform" :rules="rule" label-position="left" :label-width="120" class="edit-input">
        <FormItem label="任务类型" prop="name">
          <RadioGroup v-model="form.name">
            <Radio label="视频" ></Radio>
            <Radio label="图文"></Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="是否提供产品：" prop="name">
          <RadioGroup v-model="form.name">
            <Radio label="是" ></Radio>
            <Radio label="否"></Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="执行时间" prop="name">
          <DatePicker format="yyyy-MM-dd HH:mm:ss" :options="startDate" type="datetime" placeholder="请选择" style="width: 200px"></DatePicker>
        </FormItem>

        <div class="hint">
           如果您需要邮寄产品，博主的发布时间会受到邮寄时间的约束， 建议您邮寄时间和发布时间距离7天
        </div>

        <FormItem label="产品介绍" prop="name">
          <Input v-model="form.value" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入" />
        </FormItem>

        <FormItem label="封面图" v-if="id == 2" prop="name">
          <Upload v-model="form.img" :maxCount="9" multiple accept="image/*" />
        </FormItem>

        <FormItem label="推广链接" prop="name">
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
import { Component, Watch, Prop } from 'vue-property-decorator'
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
  @Prop() id!: number
  showDlg = false
  data: any = []
  dataName = ''
  numId = 0
  form: any = {
    img: [],
    type: 0,
    value: '',
    name: '',
    title: ''
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
.hint {
  margin-left: 120px;
  margin-top: 10px;
  padding: 15px 10px;
  margin-bottom: 20px;
  background: #ecf0f4;
  color: #666;
}
.detail-box {
  padding: 0 20px;
  /deep/ .ivu-btn {
    height: 30px;
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
