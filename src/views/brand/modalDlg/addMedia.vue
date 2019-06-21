<template>
  <div>
      <Modal v-model="value.visMedia" :title="value.title" width="700" class="modal-dlg">
        <Form ref="form" :model="form" :rules="rule" :label-width="90" class="edit-input">
            <FormItem label="媒体平台" prop="channelCode">
                <Select v-model="form.channelCode" style="width: 400px" clearable>
                  <Option v-for="item in channelCodeList" :key="item.key" :value="item.key">{{item.text}}</Option>
                </Select>
            </FormItem>
            <FormItem label="账号名称" prop="name" >
                <Input v-model="form.name" placeholder="请输入账号名称" />
            </FormItem>
            <FormItem label="账号id" prop="channelDataId">
              <Input v-model="form.channelDataId" placeholder="请输入账号id" />
            </FormItem>
            <FormItem label="访问链接" prop="url" >
                <Input v-model="form.url"  placeholder="请输入访问链接" />
            </FormItem>
        </Form>
        <div slot="footer">
          <Button class="btn-cancel" @click="value.visMedia = false">取消</Button>
          <Button type="primary" @click="addMedia">确定</Button>
        </div>
     </Modal>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { querySelectList, mediaList, createMedia, editMedia, delMadia } from '@/api/brandList'
@Component
export default class Main extends ViewBase {
  @Prop({type: Object}) value!: any

  // 媒体平台类型list
  channelCodeList = []
  form: any = {}
  get rule() {
    return {
      name: [{ required: true, type: 'string', message: '账号名称不能为空', trigger: 'blur' }],
      channelCode: [{ required: true, type: 'string', message: '媒体平台不能为空', trigger: 'change' }],
      channelDataId: [{ required: true, type: 'string', message: '账号id不能为空', trigger: 'blur' }],
      // url: [{ required: true, type: 'string', message: '访问链接不能为空', trigger: 'blur' }]
    }
  }
  mounted() {
    this.queryMediaList()
    if (this.value.flag == 2) {
        const item = this.value.items
        this.form = {
            name: item.name,
            id: item.id,
            channelCode: item.channelCode,
            url: item.url,
            channelDataId: item.channelDataId
        }
    }
  }

  async queryMediaList() {
    try {
      const {data: {channelCodeList}} = await querySelectList()
      this.channelCodeList = channelCodeList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async addMedia() {
    const volid = await (this.$refs.form as any).validate()
    if (!volid) { return }
    try {
      if (this.value.flag == 1) { // create
        const { data } = await createMedia({
          ...this.form,
          brandId: this.value.brandId
        })
      } else { // 编辑
        const { data } = await editMedia({
          ...this.form,
          brandId: this.value.brandId
        })
      }
      this.value.visMedia = false
      this.$emit('updata')
      // this.tableList()
    } catch (ex) {
      this.value.visMedia = false
      this.handleError(ex)
    }
  }

}
</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
</style>