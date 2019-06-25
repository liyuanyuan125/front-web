<template>
  <div v-if="showDlg">
    <div class="detail-fix" @click="flags">
    </div>
    <div class="detail-modeal">
      <div class="table-action" @click.stop="flag">
        <a>清空购物车</a>
      </div>
      <Table v-if='tabledata.length > 0' height="300" :loading="loading" :columns="columns" :data="tabledata">
        <template slot-scope="{ row }" slot="name">
            <div class="table-name">
              <img :src="row.accountImageUrl" width="70px" height="70px" alt=""> 
              <span>{{row.accountName}}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="type">
            {{formatmap(row)}}
          </template>
          <template slot-scope="{ row }" slot="read">
            <div>
              <span v-if="row.avgReadCount">{{formatNum(row.avgReadCount)}}w+</span>
              <span v-else>-</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="flansNumber">
            <span v-if="row.fans">{{formatNum(row.fans)}}</span>
            <span v-else>-</span>
          </template>
          <template slot-scope="{ row }" slot="flansFace">
            <div>
              <p class="flans-box">
                <span>男性：</span>  <span>{{row.femalePercent}}%</span>
              </p>
              <p class="flans-box">
                <span>女性：</span>  <span>{{row.malePercent}}%</span>
              </p>
            </div>
          </template>
          <template slot-scope="{ row }" slot="discuss">
            <div>
              <span v-if="row.averageComment">{{formatNum(row.averageComment)}}</span>
              <span v-else>-</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="like">
            <div>
              <span v-if="row.averageLike">{{formatNum(row.averageLike)}}w+</span>
              <span v-else>-</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="transmit">
            <div>
              <span v-if="row.averageShare">{{formatNum(row.averageShare)}}w+</span>
              <span v-else>-</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="price">
            <div v-if="row.priceList">
              <p v-for="(it, index) in row.priceList" :key="index" style="margin-top: 5px">
                {{statusLists(it)}}
              </p>
            </div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="action">
              <p v-if="row.collected == 1" @click="collects(row.channelDataId)">
                <Icon type="md-heart" style="font-size: 17px; color: #CA7273" />
                收藏
              </p>
              <p v-else @click="cancelcollects(row.channelDataId)">
                <Icon type="md-heart" style="font-size: 17px; color: #001F2C; opacity: .3" />
                取消收藏
              </p>
              <p @click="cancelShop(row.channelDataId)">
                <Icon type="ios-close-circle-outline" style="font-size: 17px;  color: #001F2C; opacity: .3" />
                删除
              </p>
            </div>
          </template>
      </Table>

      <!-- <Page :total="total" v-if="total>0" class="btnCenter"
        :current="form.pageIndex"
        :page-size="form.pageSize"
        :page-size-opts="[6, 20, 50, 100]"
        show-total
        show-sizer
        show-elevator
        @on-change="sizeChangeHandle"
        @on-page-size-change="currentChangeHandle"/> -->
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { addcollet, cancelcollect, delShopping,
  allcollect, addShopIng, kolShoppingCar, delall } from '@/api/kolList.ts'
import { clean } from '@/fn/object'
import { isEqual } from 'lodash'
import { formatCurrency } from '@/fn/string'
import { toast, warning } from '@/ui/modal.ts'
import moment from 'moment'
import { queryList } from '@/api/kolList.ts'
import jsxReactToVue from '@/util/jsxReactToVue'
import { getpersons, delcollect } from '@/api/mycollect.ts'

const timeFormat = 'YYYY-MM-DD'
@Component
export default class DlgEditCinema extends ViewBase {
  @Prop() value!: number
  showDlg = false
  type = this.value
  loading = false
  tabledata = []
  title = ['微博账号', '公众号/微信号', '抖音账号', '快手账号', '小红书账号']
  accountCategoryList: any = []
  titles: any = ['weibo', 'wechat', 'douyin', 'xiaohonghsu']
  statusList = []

  get columns() {
    const title = ['微博账号', '公众号/微信号', '抖音账号', '快手账号', '小红书账号']
    return [
      {
        title: title[this.type],
        align: 'left',
        width: 160,
        slot: 'name'
      },
      {
        title: '账号分类',
        minWidth: 40,
        align: 'left',
        slot: 'type'
      },
      {
        title: '粉丝数',
        align: 'left',
        minWidth: 40,
        slot: 'flansNumber'
      },
      {
        title: '粉丝画像',
        align: 'left',
        minWidth: 40,
        slot: 'flansFace'
      },
      {
        title: '平均阅读数',
        minWidth: 51,
        align: 'left',
        slot: 'read'
      },
      {
        title: '平均评论数',
        minWidth: 51,
        align: 'left',
        slot: 'discuss',
      },
      {
        title: '平均点赞数',
        minWidth: 51,
        align: 'left',
        slot: 'like',
      },
      {
        title: '平均转发数',
        align: 'left',
        minWidth: 51,
        slot: 'transmit',
      },
      {
        title: '投放价格',
        align: 'left',
        minWidth: 40,
        slot: 'price',
      },
      {
        title: '',
        minWidth: 60,
        align: 'left',
        slot: 'action',
        renderHeader: (hh: any, { row }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class='row-acts'>
            <div></div>
          </div>
          /* tslint:enable */
        }
      }
    ]
  }

  async cancelShop(id: any) {
    try {
      await delShopping({
        channelCode: this.titles[this.type],
        channelDataId: id
      })
      this.search()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 加入收藏
  async collects(id: any) {
    try {
      await addcollet({
        channelType: this.type + 4,
        dataId: id
      })
      this.search()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 删除我的收藏
  async cancelcollects(id: any) {
    try {
       await delcollect({
        channelType: this.value + 4,
        dataIdList: [id]
      })
      this.search()
    } catch (ex) {

    }
  }

  formatmap(val: any) {
    const msg = this.accountCategoryList.filter(it => it.key == val.accountTypeCode)
    if (msg.length > 0) {
      return msg[0].text
    }
    return '-'
  }

  formatNum(data: any) {
    return data ? formatCurrency(data, 0) : 0
  }

  statusLists(it: any) {
    const msg = (this.statusList.filter((its: any) => its.key == it.categoryCode)[0] as any).text
    return `${msg}: ${it.salePrice}w+`
  }

  async flag() {
    try {
      await delall(this.titles[this.type])
      this.$emit('done', [])
      this.flags()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  flags() {
    (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: auto'
    this.showDlg = false
  }

  init(data: any) {
    (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: hidden'
    this.showDlg = true
    this.search()
  }

  async search() {
    try {
      const { data } = await kolShoppingCar()
      switch (this.type) {
        case 0: this.tabledata = data.weiboList
                this.statusList = data.weiboPublishCategoryList
          break
        case 1: this.tabledata = data.weixinList
                this.statusList = data.weixinPublishCategoryList
          break
        case 2: this.tabledata = data.douyinList
                this.statusList = data.douyinPublishCategoryList
          break
        case 3: this.tabledata = data.kuaishouList
                this.statusList = data.kuaishouPublishCategoryList
          break
        case 4: this.tabledata = data.xiaohongshuList
                this.statusList = data.xiaohongshuPublishCategoryList
          break
      }
      this.accountCategoryList = data.accountCategoryList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  cancel() {
    this.showDlg = false
  }

  @Watch('tabledata', {deep: true})
  watchTabledata(val: any) {
    if (val.length == 0) {
      this.$emit('done', val)
    }
    this.$emit('done', val)
  }

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.detail-modeal {
  position: fixed;
  left: 120px;
  right: 0;
  bottom: 0;
  height: 300px;
  background: #fff;
  z-index: 998;
  .table-action {
    position: absolute;
    z-index: 999;
    bottom: 260px;
    right: 30px;
    background: #000;
    a {
      font-size: 16px;
      font-weight: bold;
    }
  }
  /deep/ .ivu-table-wrapper {
    margin: 0;
    /deep/ .ivu-table-header th {
      height: 60px;
      background: #000;
      color: #fff;
      line-height: 60px;
      span {
        font-size: 14px;
      }
    }
    /deep/ .ivu-table-cell {
      padding-right: 10px;
      padding-left: 10px;
    }
    .table-name {
      display: flex;
      padding: 20px 0;
      align-items: center;
      img {
        height: 60px;
        width: 60px;
        border-radius: 50%;
      }
      span {
        margin-left: 10px;
      }
    }
    .active {
      p {
        cursor: pointer;
      }
    }
    .flans-modeal {
      position: absolute;
      margin-left: 60px;
      z-index: 999;
      margin-top: -130px;
    }
  }
}
.detail-fix {
  position: fixed;
  top: 0;
  left: 120px;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 991;
}
.action {
  p {
    cursor: pointer;
    line-height: 24px;
  }
}
</style>
