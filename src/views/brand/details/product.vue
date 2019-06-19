<template>
  <div>
    <h2 class="model-table-title list-title">
      <span class="count">全部产品（{{total}}）个</span>
      <Button type="primary"  class="btn-edit" @click="handleAddProduct">添加产品</Button>
    </h2>
     <ul class="ul-list">
      <li v-for="item in list" :key="item.id">
        <div class="inner">
          <div class="flex-box">
            <img :src="item.imgsUrl[0]" width="80" height="80" />
            <div class="item">
              <p class="item-name">{{item.name}}</p>
              <p><span :title="item.description">{{cutLength(item.description)}}</span></p>
            </div>
          </div>
          <p class="operate">
            <img src="../assets/add-icon.png" @click="editProductList(item)" class="img" width="20" />
          </p>
        </div>
      </li>
    </ul>
     <ul class="no-data-list" v-if="list.length == 0">暂无数据</ul>
     <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>

     <!-- 添加产品 -->
      <Modal v-model="modal.visible" :title="modal.title" width="700" class="modal-dlg">
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
            <Button class="btn-cancel" @click="handleCancel">取消</Button>
            <Button type="primary" @click="addProduct">确定</Button>
        </div>
     </Modal>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import pagination from '@/components/page.vue'
import Upload, { FileItem } from '@/components/upload'
import {productList, createProduct, editProduct } from '@/api/brandList'

@Component({
  components: {
    pagination,
    Upload
  }
})
export default class Main extends ViewBase {
  brandId: string = ''

  total = 0
  pageList = {
    pageIndex: 1,
    pageSize: 20
  }
  list = []

  modal = {
    visible: false,
    title: '添加产品',
    flag: 1, // 1-create 2-edit
  }

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
    this.brandId = this.$route.params.brandId
    this.tableList()
  }

  // 添加产品
  handleAddProduct() {
    this.modal = {
      visible: true,
      title: '添加产品',
      flag: 1
    }
  }
  // 编辑产品
  editProductList(item: any) {
    this.modal = {
      visible: true,
      title: '编辑产品',
      flag: 2
    }
    const fileds = [{
      fileId: item.imgs[0],
      url: item.imgsUrl[0]
    }]
    this.form = {
      id: item.id,
      name: item.name,
      description: item.description,
      imgs: fileds
    }
  }

  async tableList() {
    const brandId = this.brandId
    try {
      const { data: {totalCount, items}} = await productList({
        ...this.pageList,
        brandId
      })
      this.total = totalCount
      this.list = items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handleCancel() {
    this.modal.visible = false
    this.form = {}
  }

  async addProduct() {
    const brandId = this.brandId
    const volid = await (this.$refs.form as any).validate()
    if (!volid) { return }

    const filedIds = this.form.imgs.map((item: any) => item.fileId)
    try {
      // 创建
      if (this.modal.flag == 1) {
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
      this.tableList()
      this.modal.visible = false
      this.form = {}
    } catch (ex) {
      this.handleError(ex)
      this.modal.visible = false
    }
  }

  cutLength(text: any) {
    return text && text.length > 20 ? text.substr(0, 20) + '....' : text
  }

  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
.upload-list {
  background: none;
}
</style>