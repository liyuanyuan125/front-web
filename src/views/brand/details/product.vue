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
     <addProduct v-model="modal" v-if="modal.visible" @updataProduct = 'uplist' />
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import pagination from '@/components/page.vue'
import {productList, createProduct, editProduct } from '@/api/brandList'
import addProduct from '../modalDlg/addProduct.vue'

@Component({
  components: {
    pagination,
    addProduct
  }
})
export default class Main extends ViewBase {
  @Prop({type: Number, default: 0}) brandId!: number

  total = 0
  pageList = {
    pageIndex: 1,
    pageSize: 20
  }
  list = []

  modal: any = {
    visible: false,
    title: '添加产品',
    flag: 1, // 1-create 2-edit
  }

  mounted() {
    this.tableList()
  }

  // 添加产品
  handleAddProduct() {
    this.modal = {
      visible: true,
      title: '添加产品',
      brandId: this.brandId,
      flag: 1
    }
  }
  // 编辑产品
  editProductList(item: any) {
    const fileds = [{
      fileId: item.imgs[0],
      url: item.imgsUrl[0]
    }]
    this.modal = {
      visible: true,
      title: '编辑产品',
      brandId: this.brandId,
      flag: 2,
      items: {
        id: item.id,
        name: item.name,
        description: item.description,
        imgs: fileds
      }
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