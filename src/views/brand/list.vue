<template>
  <div class="model-home">
    <div class="list-title">
      <span class="count">已关联{{total}}个品牌</span>
      <Button type="primary" icon="md-add" @click="visibleBrand = true" class="btn-add">添加品牌</Button>
    </div>
    <div class="model-bg">
      <h2 class="flex-box model-table-title">
        <span class="col-first">品牌</span>
        <span class="col-second">行业</span>
        <span class="col-third">状态</span>
        <span class="col-fourth">操作</span>
      </h2>
      <ul class="ul-lists">
        <li v-for="item in list" :key="item.id">
          <router-link
            :to="{ name: 'brand-home', params: { id: item.brandId } }"
            class="col-first span-first"
          >
            <img :src="item.logo" class="logo">
            <em>{{item.brandName}}</em>
          </router-link>

          <span
            class="col-second"
            v-for="ite in tradeStatus"
            :key="ite.key"
            v-if="ite.key == item.tradeCode"
          >{{ite.text}}</span>

          <span
            class="col-third"
            v-for="it in brandStatus"
            :key="it.key"
            v-if="it.key == item.status"
          >{{it.text}}</span>

          <span v-if="item.status == 15 && secondaryCode != 'daili'" class="col-fourth">
            <img
              src="./assets/add-icon.png"
              width="20"
              class="cursor"
              @click="$router.push({name: 'brand-moredetail', params: {brandId: item.brandId}})"
            >
          </span>
        </li>
      </ul>
      <ul class="no-data-list" v-if="list.length == 0">暂无数据</ul>
      <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>
    </div>
    <addBrand v-model="visibleBrand" v-if="visibleBrand" @updateBrand="updateBrand" />
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import pagination from '@/components/page.vue'
import { brandList, createBrand, selectBrand } from '@/api/brandList'
import addBrand from './modalDlg/addBrand.vue'
import { getUser } from '@/store'

@Component({
  components: {
    pagination,
    addBrand
  }
})
export default class Main extends ViewBase {
  visibleBrand = false

  total = 0
  pageList = {
    pageIndex: 1,
    pageSize: 20
  }

  // 直客或者代理商
  secondaryCode: any = null
  // 品牌状态
  brandStatus = []
  // 品牌行业
  tradeStatus = []
  list = []

  loading = false
  brandList = []

  mounted() {
    this.tableList()
    this.secondaryCode = getUser() && getUser()!.secondaryCode
  }

  async tableList() {
    try {
      const {
        data: { items, totalCount, brandRelationStatus, tradeCodeStatus }
      } = await brandList({
        ...this.pageList
      })
      this.list = items || []
      this.total = totalCount
      this.brandStatus = brandRelationStatus || []
      this.tradeStatus = tradeCodeStatus || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
  updateBrand() {
    this.tableList()
  }
}
</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
.select-dlg {
  /deep/ .ivu-select {
    width: 400px;
  }
}
.upload-box {
  background-color: none;
}
.list-title {
  display: flex;
  justify-content: space-between;
  color: #00202e;
  margin-bottom: 30px;
  .count {
    font-size: 24px;
    padding-left: 20px;
    color: #fff;
  }
}
.model-table-title {
  padding: 0 40px;
}
.col-first {
  width: 25%;
}
.col-second,
.col-third {
  width: 30%;
  text-align: center;
}
.col-fourth {
  width: 15%;
  text-align: center;
}
.ul-lists {
  color: #fff;
  padding: 0 40px;
  li {
    padding: 20px 0;
    display: flex;
    align-items: center;
    border-bottom: solid 1px rgba(188, 226, 240, 0.56);
    font-size: 14px;
    .span-first {
      display: flex;
      align-items: center;
      color: #fff;
    }
    .logo {
      width: 80px;
      height: 80px;
      border-radius: 5px;
      margin-right: 20px;
    }
  }
}
</style>
