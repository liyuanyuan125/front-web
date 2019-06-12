<template>
  <div class="detail-fix" v-if="showDlg" @click="flags">
    <div class="table-action" @click.stop="flag">
      <a>清空购物车</a>
    </div>
    <div class="detail-modeal">
      <Table height="300" :loading="loading" :columns="columns" :data="tabledata">
        <template slot-scope="{ row }" slot="name">
            <div class="table-name">
              <img :src="row.accountImageUrl" width="70px" height="70px" alt=""> 
              <span>{{row.accountName}}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="type">
            {{accountCategoryList.filter((it) => it.key == row.accountTypeCode)[0].text}}
          </template>
          <template slot-scope="{ row }" slot="read">
            <div style="text-align:center">
              <span>{{formatNum(row.avgReadCount)}}w+</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="flansNumber">
            {{formatNum(row.fans)}}
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
            <div style="text-align:center">
              <span>{{formatNum(row.averageComment)}}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="like">
            <div style="text-align:center">
              <span>{{formatNum(row.averageLike)}}w+</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="transmit">
            <div style="text-align:center">
              <span>{{formatNum(row.averageShare)}}w+</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="price">
            <div v-if="row.prices">
              <p v-for="it in row.prices" :key="it" style="margin-top: 5px">
                {{it}}
              </p>
            </div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="action">
              <p v-if="!row.collected" @click="collects(row.id)">
                <Icon type="md-heart" style="font-size: 17px; color: #CA7273" />
                收藏
              </p>
              <p v-else @click="cancelcollects(row.id)">
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

  formatNum(data: any) {
    return data ? formatCurrency(data, 0) : 0
  }

  // 加入收藏
  async collects(id: any) {
    try {
      await addcollet({
        channelCode: this.titles[this.type],
        channelDataId: id
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 取消收藏
  async cancelcollects(id: any) {
    try {
      await cancelcollect({
        channelCode: this.titles[this.type],
        channelDataId: id
      })
    } catch (ex) {
      this.handleError(ex)
    }
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
          break
        case 1: this.tabledata = data.weixinList
          break
        case 2: this.tabledata = data.douyinList
          break
        case 3: this.tabledata = data.kuaishouList
          break
        case 4: this.tabledata = data.xiaohongshuList
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
.detail-fix {
  position: fixed;
  top: 0;
  left: 120px;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 991;
  .detail-modeal {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 300px;
    z-index: 998;
    background: #fff;
  }
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
.action {
  p {
    cursor: pointer;
    line-height: 24px;
  }
}
</style>
