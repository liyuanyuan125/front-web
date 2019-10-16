<template>
  <div class="film-page">
    <div class="page-title-btn">
      <!-- 用户公司类型包含片商 增加新建电影预告片按钮 -->
      <Button v-if="systemCode == 'film'" type="primary" :to="{name: 'pop-film-editprevue'}" class="btn-add-line"
        v-auth="'promotion.ad-video#create'">新建电影预告片
      </Button>
       <Button type="primary" :to="{name: 'pop-film-edit'}" class="btn-add-line"
        v-auth="'promotion.ad-video#create'">新建商业广告片
      </Button>
    </div>
    <Form :model="form" class="form flex-box-center jyd-form">
      <Select v-model="form.status" clearable placeholder="广告片状态" class="select-wid" >
          <Option v-for="item in statusList" v-if="item.key != 6" :key="item.key" :value="item.key">{{item.text}}</Option>
      </Select>
      <customerList v-model="form.customerId" />
      <brandList v-model="form.brandId" />
      <productList :brandld="form.brandId" v-model="form.productId" />
      <div class="flex-box film-search">
          <Input v-model="query" placeholder="请输入广告ID/名称进行搜索"/>
          <Button type="primary" class="bth-search" @click="searchList">
            <Icon type="ios-search" size="22"/>
          </Button>
      </div>
    </Form>

    <div class="com-modal">
      <div class="com-modal-title check-title">
        <span>全部文件（{{totalCount}}）</span>
        <span class="checkbox-all"><Checkbox @on-change="checkall" v-model="checkboxAll">全选</Checkbox></span>
        <span class="del-btn" @click="deleteList()">删除</span>
      </div>
      <div class="spin-show">
        <ul class="ul-list demo-spin-article">
          <!-- 当广告片列表类型为 电影预告片 展示active class -->
          <li v-for="item in tableDate " :key="item.id">
            <div class="flex-box inner"  :class="{active: item.videoType == 1}"> 
              <div class="left-item"  @click="$router.push({name: 'pop-film-detail', params: {id: item.id}})">
                <img v-if="item.logo" :src="item.logo" class="img" />
                <img v-else src="./assets/default-img.png"  class="img"/>
              </div>
              
              <div class="right-item">
                <p class="name" @click="$router.push({name: 'pop-film-detail', params: {id: item.id}})">{{item.name}}</p>
                <p class="brand-name" @click="$router.push({name: 'pop-film-detail', params: {id: item.id}})">{{item.brandName || item.productName}}</p>
                <div class="item-icon">
                  <span>{{transformSpecif(item.specification)}}</span>
                  <div class="icon-img">
                    <Tooltip content="审核中"> <img v-if="item.status == 1"  src="../assets/audit-icon.png" class="img-wid" /></Tooltip>
                    <Tooltip content="审核拒绝"><img v-if="item.status == 5" src="../assets/reject-icon.png" class="img-wid" /></Tooltip>
                    <Tooltip content="待支付"><img v-if="item.status == 2" src="../assets/pay-icon.png" class="img-wid" /></Tooltip>
                    <Tooltip content="转码中"><img v-if="item.status == 3"  src="../assets/transing-icon.png" class="img-wid" /></Tooltip>
                    
                    <!-- 判断广告片类型 跳到对应的预告片和商业片 -->
                    <Tooltip content="点击编辑" v-if="item.status == 1 || item.status == 5">
                      <img v-if="item.videoType == 1" src="../assets/edit-icon.png" @click="$router.push({name: 'pop-film-editprevue', params: {id: item.id}})" class="img-wid" />
                      <img v-else src="../assets/edit-icon.png" @click="$router.push({name: 'pop-film-edit', params: {id: item.id}})" class="img-wid" />
                    </Tooltip>

                    <Tooltip content="点击删除"><img src="../assets/del-icon.png" v-if="item.status != 3"  @click="deleteList(item.id)" class="img-wid" /></Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <Spin fix v-if="spinShow"></Spin>
        <div class="noList" v-if="tableDate.length == 0">暂无数据</div>
      </div>
       <pagination :pageList="pageList" :total="totalCount" @uplist="uplist"></pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, toast } from '@/ui/modal'
import { dataList, delList, popCancel, popPayment, popPartners } from '@/api/popFilm'
import { formatTimes, formatNumber} from '@/util/validateRules'
import pagination from '@/components/page.vue'
import { getUser } from '@/store'

import customerList from '@/components/selectList/customerList.vue'
import brandList from '@/components/selectList/brandList.vue'
import productList from '@/components/selectList/productList.vue'
@Component({
  components: {
    pagination,
    customerList,
    brandList,
    productList
  }
})
export default class Main extends ViewBase {
  form: any = {}
  query = null

  pageList = {
    pageIndex: 1,
    pageSize: 20
  }

  totalCount = 0
  spinShow = false
  statusList: any = []
  selectIds: any[] = []
  checkboxAll = false

  tableDate = []

  get systemCode() {
    return getUser()!.systemCode
  }

  async mounted() {
    this.tableList()
  }

  async tableList() {
    this.spinShow = true
    const query = this.query
    // 若切换身份为广告主，需过滤广告类型为 商业广告
    // 若切换身份为片商，不需过滤，获取全量广告片
    const videoType = this.systemCode == 'ads' ? 2 : null
    try {
      const {
        data: { items, statusList, totalCount }
      } = await dataList({
        ...this.form,
        query,
        videoType,
        ...this.pageList
      })
      this.spinShow = false
      this.statusList = statusList || []
      this.tableDate = items || []
      this.totalCount = totalCount

    } catch (ex) {
      this.spinShow = false
      this.handleError(ex)
    }
  }

  transformSpecif(val: any) {
    const num = val % 60 == 0 ? '00' : val % 60
    const strPadStart = (Math.floor(val / 60)).toString().padStart(2, '0')
    return val < 60 ? `00:${val}` : `${strPadStart} : ${num}`
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
    } else {
      if (this.selectIds.length) {
        ids = this.selectIds.map((item: any) => item.id) || []
        await confirm(`您确定要删除当前${this.selectIds.length}条信息吗？`)
      } else {
        this.showWaring('请选择你要删除的元素')
        return
      }
    }
    try {
      await delList({ ids })
      this.tableList()
    } catch (ex) {
      this.handleError(ex)
    }
  }
  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
  @Watch('form', {deep: true})
  watchForm(val: any) {
    this.pageList.pageIndex = 1
    this.tableList()
  }
}
</script>

<style lang="less" scoped>
@import '~@/views/kol/less/common.less';
@import '~@/views/brand/less/common.less';
.spin-show {
  position: relative;
}
.noList {
  text-align: center;
  padding: 30px 0 40px;
  font-size: 14px;
}
.film-page {
  padding: 20px 40px 40px;
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
      &.active {
        background: rgba(0, 32, 45, .5) url('./assets/prevue.png') no-repeat left top;
        background-size: 30px auto;
      }
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
          height: 22px;
          padding-bottom: 7px;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #fff;
        }
        .item-icon {
          width: 100%;
          span {
            color: #fff;
          }
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
  .bth-search {
    position: relative;
    left: -4px;
    border: none;
    background: #00202d;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
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
.form {
  padding: 40px 0 44px;
  .select-wid {
    width: 160px;
    margin-right: 20px;
  }
}
.btn-add-line {
  font-size: 18px;
  margin-left: 10px;
}
</style>
