<template>
  <div class="film-page">
    <div class="page-title">
      <span>广告片</span>
       <Button type="primary" :to="{name: 'pop-film-edit'}" class="btn-new"
        v-auth="'promotion.ad-video#create'">
        <Icon type="ios-add" size="27"/>新建广告片
      </Button>
    </div>
    <Form :model="form" class="jydate-form flex-box jyd-form">
      <Select v-model="form.status" clearable placeholder="广告片状态" class="select-wid" >
          <Option v-for="item in statusList" v-if="item.key != 6" :key="item.key" :value="item.key">{{item.text}}</Option>
      </Select>
      <customerList v-model="form.customerld" />
      <brandList v-model="form.brandld" />
      <productList v-if="form.brandld" :brandld="form.brandld" v-model="form.productld" />
      <div class="flex-box film-search">
          <Input v-model="form.query" placeholder="请输入广告ID/名称进行搜索"/>
          <Button type="primary" class="bth-search" @click="searchList">
            <Icon type="ios-search" size="22"/>
          </Button>
      </div>
    </Form>

    <div class="com-modal">
      <div class="com-modal-title check-title">
        <span>全部文件（{{totalCount}}）</span>
        <span class="checkbox-all"><Checkbox @on-change="checkall" v-model="checkboxAll">全选</Checkbox></span>
        <span class="del-btn" @click="deleteList">删除</span>
      </div>
      <ul class="ul-list">
        <li v-for="item in tableDate " :key="item.id">
          <div class="flex-box inner">
            <div class="left-item"  @click="$router.push({name: 'pop-film-detail', params: {id: item.id}})">
              <img :src="item.logo" class="img" :onerror="defaultImg" />
            </div>
            
            <div class="right-item">
              <p class="name">{{item.name}}</p>
              <p class="brand-name">{{item.brandName || item.productName}}</p>
              <div class="item-icon">
                <span>{{transformSpecif(item.specification)}}</span>
                <div class="icon-img">
                  <img v-if="item.status == 1" title="审核中" src="../assets/audit-icon.png" class="img-wid" />
                  <img v-if="item.status == 5" title="审核拒绝" src="../assets/reject-icon.png" class="img-wid" />
                  <img v-if="item.status == 2" title="支付" src="../assets/pay-icon.png" class="img-wid" />
                  <img v-if="item.status == 3" title="转码中" src="../assets/transing-icon.png" class="img-wid" />
                  <img v-if="item.status == 1 || item.status == 5" title="点击编辑" src="../assets/edit-icon.png" 
                  @click="$router.push({name: 'pop-film-edit', params: {id: item.id}})" class="img-wid" />
                  <img src="../assets/del-icon.png"  @click="deleteList(item.id)" class="img-wid" title="点击删除" />
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
       <div class="noList" v-if="tableDate.length == 0">暂无数据</div>
       <pagination :pageList="pageList" :total="totalCount" @uplist="uplist"></pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, toast } from '@/ui/modal'
import { dataList, delList, popCancel, popPayment, popPartners } from '@/api/popFilm'
import { formatTimes, formatYell, formatNumber} from '@/util/validateRules'
// import updataVideo from '@/components/videoDlg.vue'
import pagination from '@/components/page.vue'

import customerList from '@/components/selectList/customerList.vue'
import brandList from '@/components/selectList/brandList.vue'
import productList from '@/components/selectList/productList.vue'
@Component({
  components: {
    // updataVideo,
    pagination,
    customerList,
    brandList,
    productList
  }
})
export default class Main extends ViewBase {
  form: any = {}
  pageList = {
    pageIndex: 1,
    pageSize: 20
  }
  totalCount = 0

  statusList: any = []
  selectIds: any[] = []
  checkboxAll = false

  tableDate = []

  get defaultImg() {
    return 'this.src="' + require('../assets/error.png') + '"'
  }

  mounted() {
    this.tableList()
  }
  async tableList() {
    try {
      const {
        data: { items, statusList, totalCount }
      } = await dataList({
        ...this.form,
        ...this.pageList
      })
      this.tableDate = items || []
      this.statusList = statusList || []
      this.totalCount = totalCount || 0

    } catch (ex) {
      this.handleError(ex)
    }
  }

  transformSpecif(val: any) {
    const num = val % 60 == 0 ? '00' : val % 60
    return val < 60 ? `00:${val}` : `${Math.floor(val / 60)} : ${num}`
  }

  checkall() {
    this.selectIds = this.checkboxAll ? this.tableDate : []
  }

  searchList() {
    this.pageList.pageIndex = 1
    this.tableList()
  }

  async deleteList(id?: number) {
    let ids: any[] = []
    if (id) {
      ids.push(id)
      await confirm('您确定要删除当前信息吗？')
      await delList({ ids })
      this.tableList()
    } else {
      if (this.selectIds.length) {
        ids = this.selectIds.map((item: any) => item.id) || []
        await confirm('您确定要删除当前信息吗？')
        await delList({ ids })
        this.tableList()
      } else {
        this.showWaring('请选择你要删除的元素')
      }
    }
  }
  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
}
</script>

<style lang="less" scoped>
@import '~@/views/kol/less/common.less';
.noList {
  text-align: center;
  padding: 30px 0 40px;
  font-size: 14px;
}
.film-page {
  padding: 20px 40px 40px;
}
.page-title {
  display: flex;
  justify-content: space-between;
  color: #fff;
  span {
    font-size: 24px;
  }
  .btn-new {
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    background: rgba(0, 32, 45, 1);
    border-radius: 20px;
    font-size: 14px;
    text-align: center;
    border: none;
  }
}
.bth-search {
  position: relative;
  left: -4px;
}
.ul-list {
  padding: 0 38px 40px;
  margin-left: -15px;
  margin-right: -15px;
  display: flex;
  flex-wrap: wrap;
  li {
    width: 33.3%;
    padding: 0 15px;
    margin-top: 30px;
    .inner {
      background: rgba(0, 32, 45, .5);
      border-radius: 5px;
      padding: 20px 20px 15px;
      cursor: pointer;
      position: relative;
      .left-item {
        .img {
          width: 120px;
          height: 120px;
        }
      }
      .right-item {
        padding-left: 15px;
        font-size: 14px;
        width: 100%;
        .name {
          font-size: 18px;
          color: #a3d5e6;
          height: 76px;
        }
        .img-wid {
          width: 17px;
          margin-left: 10px;
        }
        .brand-name {
          // word-break: break-all;
          padding-bottom: 7px;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-icon {
          width: 100%;
          .icon-img {
            position: absolute;
            right: 10px;
            bottom: 12px;
            width: 100px;
            text-align: right;
          }
        }
      }
    }
  }
}
.film-search {
  width: 280px;
}
.check-title {
  font-size: 14px;
  padding-left: 10px;
  .checkbox-all {
    margin-left: 10px;
    margin-right: 10px;
    border-right: solid 1px #fff;
    font-size: 14px;
  }
  .del-btn {
    cursor: pointer;
    display: inline-block;
    width: 60px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background: rgba(208, 233, 246, .9);
    border-radius: 5px;
    color: #222;
  }
  /deep/ .ivu-checkbox-wrapper {
    font-size: 14px;
  }
}
.jydate-form {
  padding: 40px 0 44px;
  .select-wid {
    width: 160px;
    margin-right: 20px;
  }
}
</style>
