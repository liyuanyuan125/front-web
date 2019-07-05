<template>
  <div>
      <Modal v-model="visibleBrand" title="添加品牌" width="700" class="modal-dlg">
      <Form ref="form" :model="form" :rules="rule" :label-width="90" class="edit-input">
        <FormItem label="品牌" prop="brandId">
          <Select
            v-model="form.brandId"
            clearable
            filterable
            remote
            :loading="loading"
            class="select-dlg"
            :remote-method="remoteMethod"
            @on-clear="brandList = []"
            style="width: 400px"
            placeholder="请输入品牌模糊查询"
          >
            <Option v-for="item in brandList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="上传图片" prop="fileIds">
          <Upload v-model="form.fileIds" :max-count="8" multiple accept="images/*" confirm-on-del/>
          <div class="upload-tip">请上传您管理/代理此品牌的资质扫描件</div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="btn-cancel" @click="visibleBrand = false">取消</Button>
        <Button type="primary" @click="addBrand('form')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { createBrand, selectBrand } from '@/api/brandList'
import Upload, { FileItem } from '@/components/upload'

@Component({
    components: {
        Upload
    }
})
export default class Main extends ViewBase {
  @Prop({ type: Boolean, default: false}) value!: boolean
  form: any = {}
  loading = false
  brandList = []
  visibleBrand = this.value

  get rule() {
    return {
      brandId: [
        {
          require: true,
          trigger: 'change',
          validator(rule: any, value: string[], callback: any) {
            !value ? callback(new Error('请选择品牌')) : callback()
          }
        }
      ],
      fileIds: [
        {
          require: true,
          trigger: 'blur',
          validator(rule: any, value: string[], callback: any) {
            value == undefined || value.length == 0 ? callback(new Error('请选择上传图片')) : callback()
          }
        }
      ]
    }
  }
  async remoteMethod(query: any) {
    try {
      if (query) {
        this.loading = true
        const {
          data: { items }
        } = await selectBrand({
          name: query,
          pageIndex: 1,
          // pageSize: 400
        })
        this.brandList = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }

  async addBrand(dataform: any) {
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) {
      return
    }
    const list: any = this.brandList[0]
    // 处理filelds fileld集合
    const fileIds = this.form.fileIds.map((item: any) => item.fileId)
    try {
      const { data } = await createBrand({
        ...this.form,
        fileIds,
        brandName: list.name,
        brandEnName: list.enName
      })
      this.value = false
      this.$emit('updateBrand')
      // this.tableList()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('visibleBrand')
  watchValue(val: any) {
    this.$emit('input', val)
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
.upload-box {
  background: none;
}
</style>
