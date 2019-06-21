<template>
  <div>
      <Modal v-model="value.visible" :title="value.title" width="700" class="modal-dlg">
        <Form ref="form" :model="form" :rules="rule" :label-width="90" class="edit-input">
            <FormItem label="产品名称" prop="name" >
                <Input v-model="form.name" placeholder="请输入产品名称" />
            </FormItem>
            <FormItem label="产品描述" prop="description" >
                <Input v-model="form.description" placeholder="可输入价格或者产品介绍等" />
            </FormItem>
            <FormItem label="上传图片" prop="imgs">
                <Upload v-model="form.imgs" :max-count="1" accept="images/*" class="upload-list" confirm-on-del/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button class="btn-cancel" @click="value.visible = false">取消</Button>
            <Button type="primary" @click="addProduct">确定</Button>
        </div>
     </Modal>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Upload, { FileItem } from '@/components/upload'
import {productList, createProduct, editProduct } from '@/api/brandList'

@Component({
    components: {
        Upload
    }
})
export default class Main extends ViewBase {
  @Prop({ type: Object}) value!: any
  form: any = {
    imgs: []
  }
  get rule() {
    return {
      name: [{ required: true, type: 'string', message: '产品名称不能为空', trigger: 'blur' }],
      description: [{ required: true, type: 'string', message: '产品描述不能为空', trigger: 'blur' }],
      imgs: [{ required: true, type: 'array', message: '上传图片不能为空', trigger: 'blur' }]
    }
  }

  mounted() {
      if (this.value.flag == 2) {
          const item = this.value.items
          this.form = {
            id: item.id,
            name: item.name,
            description: item.description,
            imgs: item.imgs
            }
      }
  }
  async addProduct() {
    const brandId = this.value.brandId
    const volid = await (this.$refs.form as any).validate()
    if (!volid) { return }

    const filedIds = this.form.imgs.map((item: any) => item.fileId)
    try {
      // 创建
      if (this.value.flag == 1) {
        const { data } = await createProduct({
          ...this.form,
          imgs: filedIds,
          brandId
        })
      } else {
        const { data } = await editProduct({
          ...this.form,
          imgs: filedIds,
          brandId
        })
      }
      this.$emit('updataProduct')
      this.value.visible = false
    } catch (ex) {
      this.handleError(ex)
      this.value.visible = false
    }
  }

}

</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
.upload-list {
  background: none;
}
</style>