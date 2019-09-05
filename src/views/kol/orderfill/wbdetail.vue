<template>
  <Modal
    v-model="showDlg"
    title="设置投放任务"
    :transfer="false"
    :width="700"
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
        <FormItem label="广告位" prop="publishCategoryCode">
          <RadioGroup v-model="form.publishCategoryCode">
            <Radio :disabled="!pricelist.includes(it.key)" v-for="it in statuslist" :key="it.key" :label="it.key">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="文章标题" prop="title">
          <Input v-model="form.title" placeholder="例如2019奥迪Q3"></Input>
        </FormItem>

        <FormItem label="封面图" prop="pictureFileIds">
          <Upload v-model="form.pictureFileIds" :maxCount="1" accept="image/*"/>
        </FormItem>

        <FormItem label="摘要" prop="summary">
          <Input
            v-model="form.summary"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem label="正文内容" prop="content">
          <Froala v-model="form.content"/>
        </FormItem>
        <FormItem label="发布时间" prop="publishTime">
          <DatePicker
            format="yyyy-MM-dd HH:mm"
            v-model="form.publishTime"
            type="datetime"
            placeholder="Select date"
            style="width: 200px"
          ></DatePicker>
        </FormItem>

        <FormItem label="原文链接" prop="url">
          <Input v-model="form.url" placeholder="例如2019奥迪Q3"></Input>
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
    pictureFileIds: [],
    publishCategoryCode: '',
    title: '',
    summary: '',
    content: '',
    publishTime: '',
    url: ''
  }
  kolid: any = null
  statuslist: any = []
  pricelist: any = []

  get rule() {
    const validator = ( rules: any, value: any, callback: any) => {
      const msg: any = new Date(value).getTime()
      const time = Date.now()
      if (!msg) {
        callback(new Error('请选择发布时间'))
      } else if (msg - time < 86400) {
        callback(new Error('时间距离发布时间不足一天'))
      } else {
        callback()
      }
    }
    return {
      publishTime: [
        { validator }
      ],
      publishCategoryCode: [
        { required: true, message: '请选择投放类型', type: 'number', trigger: 'change' },
      ],
      content: [
        { required: true, message: '请输入原发内容', trigger: 'change' },
      ]
    }
  }

  async init(statuslist: any, id: any, kolid: any, pricelist: any, orderItemList?: any) {
    (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: hidden'
    this.statuslist = statuslist
    this.numId = id
    this.kolid = kolid
    this.pricelist = (pricelist || []).map((it: any) => Number(it.categoryCode))
    this.showDlg = true
    if (orderItemList) {
      this.form.publishCategoryCode = Number(orderItemList.publishCategoryCode)
      this.form.content = orderItemList.content || ''
      this.form.pictureFileIds = orderItemList.pictureFileIds || []
      this.form.publishTime = orderItemList.publishTime || ''
      this.form.url = orderItemList.url
      this.form.title = orderItemList.title
    }
  }

  async open() {
    try {
      const volid = await (this.$refs.dataform as any).validate()
      if (volid) {
        // const { data } = await kolprice({
        //   channelCode: this.$route.params.code,
        //   categoryCode: this.form.publishCategoryCode,
        //   channelDataId: this.kolid
        // })
        if (typeof this.numId == 'number') {
          this.$emit('done', {
            id: [this.numId],
            form: {
              ...this.form
            },
            check: false
          })
        } else {
          this.$emit('done', {
            id: this.numId,
            form: {
              ...this.form
            },
            check: true
          })
        }
        this.cancel()
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  drop(name: any) {}

  cancel() {
    (this.$refs.dataform as any).resetFields()
    const html: any = (document.getElementsByTagName('html')[0] as HTMLHtmlElement)
    html.style = 'overflow-y: auto'
    this.form.content = ''
    this.showDlg = false
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/formInput.less';

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
