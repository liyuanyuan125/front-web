<template>
  <div>
    <h2 class="model-table-title list-title">
      <span class="count">全部门店（{{total}}）家</span>
      <Button type="primary"  class="btn-edit" @click="handleAddShop">添加门店</Button>
    </h2>
    <ul class="ul-lists">
      <li class="li-items" v-for="item in list" :key="item.id">
        <div class="first-item">
          <p>{{item.name}}</p>
          <p class="item-address">{{item.address}}</p>
        </div>
        <!-- <div class="second-item">国籍</div> -->
        <div class="third-item">{{item.provinceName}}</div>
        <div class="fourth-item">{{item.phone}}</div>
        <div class="fifth-item">
          <img src="../assets/add-icon.png" alt="alias" @click="editShow(item)" class="img" width="20" />
          <img src="~@/views/pop/assets/del-icon.png" alt="alias" @click="delShowList(item.id)" class="img" width="20" />
        </div>
      </li>
    </ul>
     <ul class="no-data-list" v-if="list.length == 0">暂无数据</ul>
     <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>

      <addShop v-model="visible" v-if="visible.visibleShop" @updata="updata"/>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import pagination from '@/components/page.vue'
import areaSelect from '@/components/areaSelect/AreaSelect.vue'
import {confirm} from '@/ui/modal'
import { shopList, createList, editList, delShopList } from '@/api/brandList'
import addShop from '../modalDlg/addShop.vue'

@Component({
  components: {
    pagination,
    areaSelect,
    addShop
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0}) brandId!: number

  total = 0
  pageList = {
    pageIndex: 1,
    pageSize: 20
  }
  list = []

  // 添加门店
  visible: any = {
    visibleShop: false,
    title: '',
    flag: 1 // 1-创建 2-编辑
  }

  mounted() {
    this.tableList()
  }

  async tableList() {
    try {
      const { data: {items, totalCount} } = await shopList({
        ...this.pageList,
        brandId: this.brandId
      })
      this.total = totalCount
      this.list = items
    } catch (ex) {
      this.handleError(ex)
    }
  }
  // 添加门店
  handleAddShop() {
    this.visible = {
      visibleShop: true,
      title: '添加门店',
      brandId: this.brandId,
      flag: 1
    }
  }

  // 编辑门店
  async editShow(item: any) {
    this.visible = {
      visibleShop: true,
      title: '编辑门店',
      brandId: this.brandId,
      flag: 2,
      items: {
        name: item.name,
        areas: [item.provinceId, item.cityId, item.countyId],
        address: item.address,
        phone: item.phone,
        id: item.id
      }
    }
  }

  // 删除门店
  async delShowList(id: number) {
    await confirm('你确定要删除当前门店吗', {title: '删除门店'})
    try {
      const { data } = await delShopList(id)
      this.tableList()
    } catch (ex) {
      this.handleError(ex)
    }
  }


  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }

  updata() {
    this.tableList()
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';

.ul-lists {
  padding: 0 40px;
  .li-items {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #fff;
    border-bottom: solid 1px rgba(188, 226, 240, .56);
    padding: 23px 0;
    .img {
      cursor: pointer;
      margin-right: 20px;
    }
    .first-item {
      width: 45%;
    }
    .third-item {
      width: 20%;
    }
    .fourth-item {
      width: 25%;
    }
    .fifth-item {
      width: 10%;
    }
    .item-address {
      font-size: 12px;
      color: #b3bcc0;
      padding-top: 4px;
    }
  }
}
</style>