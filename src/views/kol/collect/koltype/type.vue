<template>
  <div class="kol-box">
    <div v-if="tableDates.length > 0" class="section">
      <Table :columns="columns" :data="tableDate" ref="selection"  @on-selection-change="singleSelect"  @on-select-all="selectAll" >
        <template style="marin-top: 100px" slot-scope="{ row }" slot="type">
          <div class="table-name">
            <img :src="row.headerUrl" alt>
            <span>{{row.name || '暂无'}}</span>
          </div>
        </template>

        <template style="marin-top: 100px" slot-scope="{ row }" slot="fansCount">
          <div class="table-name">
            <p>{{formatNumber(row.followersCount)}}w+</p>
          </div>
        </template>

        <template slot-scope="{ row }" slot="genre">
          <div class="table-price" v-if=" row.prices">
            <p v-for="(it, index) in row.prices" :key="index">
              <span>{{it}}</span>
            </p>
          </div>
        </template>

        <template style="marin-top: 100px" slot-scope="{ row }" slot="action">
          <div class="table-action">
            <p @click="collects(row)">
              <img width="14px" src="./assets/collect.png">
              预定
            </p>
            <p @click="cancelShop(row.accountDataId)" style="margin-top: 7px">
              <img width="14px" src="./assets/cancel.png">
              删除
            </p>
          </div>
        </template>
      </Table>

      <div class="check-box" style="padding-right: 0px">
        <span @click="handleSelectAll">
          <Checkbox v-model="checkboxAll"></Checkbox>全选
        </span>
        <span @click="del">删除</span>
        <span></span>
        <div class="check-span">
          <ul>
            <li>已选账号 <b class="">{{sum}}</b> 个  </li>
            <li>合计粉丝数<b class="red">￥{{sumcount}}</b></li>
          </ul>
          <div>
            <Button class="default-btn" v-if="sum > 0" @click="reserve">立即预定</Button>
          </div>
        </div>
      </div>
      <!-- <div class="abandon">
        <div class="top">
          以下KOL账号已下架，无法进行预订
          <Button class="default-btn" @click="reserve">全部清空</Button>
        </div>
        <Table :show-header="false" :columns="columnsNum" :data="tableDate" ref="selection"  @on-selection-change="singleSelect"  @on-select-all="selectAll" >
          <template style="marin-top: 100px" slot-scope="{ row }" slot="type">
            <div class="table-name">
              <img :src="row.mainPicUrl" alt=""> 
              <span>{{row.name}}</span>
            </div>
          </template>
          <template style="marin-top: 100px" slot-scope="{ row }" slot="action">
            <p>取消</p>
            <p>收藏</p>
          </template>
        </Table>
      </div> -->
    </div>
    <div v-else class="section-no">
      <img src="./assets/noshop.png" alt="">
      <h3>还没有添加KOL账号</h3>
      <Button class="default-btn" :to="{name: 'kol-kollist'}">前往挑选</Button>
    </div>
    <!-- <Detail ref="detail" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fileList, queryList, findkol } from '@/api/shopping'
import { kolList } from '@/api/collect.ts'
import { formatCurrency } from '@/fn/string'
import { uniqBy } from 'lodash'
import { toast, warning } from '@/ui/modal.ts'
import { getpersons, delcollect } from '@/api/mycollect.ts'
import { info } from '@/ui/modal'

@Component({
  components: {
  }
})
export default class DlgEditCinema extends ViewBase {
  @Prop() value!: number
  showDlg = true
  tableDate: any = []
  filmList: any = []
  filename: any = ''
  filmCheck = 0
  checkboxAll = false
  checkSelcet = false
  sumList: any = []
  checkId: any = []
  sum = 0
  sumcount = '0.00'
  titles: any = ['weibo', 'wechat', 'douyin', 'kuaishou', 'xiaohonghsu']

  get tableDates() {
    if (this.tableDate && this.tableDate.length > 0) {
      return this.tableDate
    } else {
      return []
    }
  }

  // get columnsNum() {
  //   const columns: any = [
  //       {
  //         title: '全选',
  //         align: 'left',
  //         width: 190,
  //       },
  //       {
  //         title: '账号分类',
  //         align: 'left',
  //         slot: 'type'
  //       },
  //       {
  //         title: '平台',
  //         align: 'left',
  //         key: 'platform'
  //       },
  //       {
  //         title: '投放方式',
  //         align: 'left',
  //         key: 'type'
  //       },
  //       {
  //         title: '操作',
  //         align: 'center',
  //         width: 160,
  //         slot: 'action'
  //       }
  //     ]
  //   return columns
  // }
  get columns() {
    const columns: any = [
       { type: 'selection', width: 70, align: 'center' },
      {
        title: '全选',
        align: 'left',
        width: 80
      },
      {
        title: '账号名称',
        align: 'left',
        slot: 'type',
        width: 180
      },
      {
        title: '账号分类',
        align: 'left',
        key: 'categoryName',
      },
      {
        title: '粉丝数',
        align: 'left',
        slot: 'fansCount'
      },
      {
        title: '价格',
        align: 'left',
        width: '180',
        slot: 'genre'
      },
      {
        title: '操作',
        align: 'left',
        width: 140,
        slot: 'action'
      }
    ]
    return columns
  }


  created() {
    // this.filmFind()
    this.init()
  }

  async collects(row: any) {
    try {
      const { data } = await findkol(this.titles[this.value - 1], {channelDataIds: row.accountDataId})
      const msg = {
        accountImageUrl: data.item.headerUrl,
        accountName: data.item.name,
        accountTypeCode: data.item.accountCategoryCode,
        fans: data.item.customFans.totalCount,
        priceList: data.item.prices,
        channelDataId: data.item.channelDataId,
        kolId: data.item.kolId
      }
      sessionStorage.setItem('shopList', JSON.stringify([msg]))
      this.$router.push({
        name: 'order-orderfill',
        params: {
          code: this.titles[this.value - 1] || 'weibo'
        }
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  cancelcollects() {

  }

  formatNumber(num: any) {
    return num ? formatCurrency(num) : 0
  }

  async filmFind() {
    try {
      const { data } = await fileList({})
      this.filmList = data.items || []
      this.filename = this.filmList.filter((it: any) => it.key == this.filmCheck)[0].text
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 删除我的收藏
  async cancelShop(id: any) {
    try {
       await delcollect({
        channelType: this.value + 3,
        dataIdList: [id]
      })
      this.init()
      this.singleSelect([])
    } catch (ex) {

    }
  }

  async del() {
    try {
      if (this.checkId.length == 0) {
        info('至少选择一个影片')
      }
      await delcollect({
        channelType: this.value + 3,
        dataIdList: this.checkId
      })
      this.init()
      this.singleSelect([])
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async reserve() {
    try {
      const { data } = await findkol(this.titles[this.value - 1], {
        channelDataIds: this.checkId.join(',')
      })
      const msg = data.items.map((it: any) => {
        return {
          accountImageUrl: it.headerUrl,
          accountName: it.name,
          accountTypeCode: it.accountCategoryCode,
          fans: it.customFans.totalCount,
          priceList: it.prices,
          channelDataId: it.channelDataId,
          kolId: it.kolId
        }
      })
      sessionStorage.setItem('shopList', JSON.stringify(msg))
      this.$router.push({
        name: 'order-orderfill',
        params: {
          code: this.titles[this.value - 1] || 'weibo'
        }
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handleSelectAll() {
    const selection = this.$refs.selection as any
    selection.selectAll(!this.checkboxAll)
  }

  singleSelect(select: any) {
    const ids = this.tableDate.map((it: any) => it.accountDataId)
    const dataId = select.map((it: any) => it.accountDataId)
    select.forEach((item: any) => {
      if (!this.checkId.includes(item.accountDataId)) {
        this.checkId.push(item.accountDataId)
        this.sumList.push(item)
      }
    })
    const filterId = ids.filter((it: any) => !dataId.includes(it))
    this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
    this.sumList = this.sumList.filter((it: any) => !filterId.includes(it.accountDataId))
    this.sum = this.checkId.length
    let sum = 0
    this.sumList.forEach((it: any) => {
      sum += it.followersCount
    })
    this.sumcount = formatCurrency(sum)
    this.checkboxAll = select.length == this.tableDate.length ? true : false
  }

  sure() {
    this.filename = this.filmList.filter((it: any) => it.key == this.filmCheck)[0].text
    this.checkFilm()
    this.init()
  }

  checkFilm() {
    this.checkSelcet = !this.checkSelcet
    const names = this.tableDate.length > 0 ? 'ivu-table-body' : 'ivu-table-tip'
    const tip: any = document.getElementsByClassName(names)[0]
    if (this.checkSelcet) {
      tip.style.marginTop = '210px'
    } else {
      tip.style.marginTop = '80px'
    }
  }

  async init() {
    try {
      const { data } = await kolList({
        channelTypeCode: this.value + 3
      })
      this.tableDate = data.items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  selectAll() {

  }

  cancel() {
    this.showDlg = false
  }

  @Watch('value')
  watchValue(val: any) {
    this.init()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/common.less';
@import '~@/site/lib.less';

.kol-box {
  padding: 0 50px;
}
/deep/ .ivu-checkbox-inner {
  border-radius: 50%;
  width: 23px;
  height: 23px;
  color: #00202d;
  background: #fff;
  border: 1px solid #e6e6e6;
  &::after {
    left: 7px;
    top: 4px;
    width: 8px;
    height: 12px;
    border: 2px solid #00202d;
    border-top: 0;
    border-left: 0;
  }
}
/deep/ .ivu-table-wrapper {
  border-radius: 5px;
  /deep/ .ivu-table-header th {
    height: 60px;
    background: #000;
    color: #fff;
    line-height: 60px;
    span {
      font-size: 14px;
    }
  }
  /deep/ .ivu-table-column-center, /deep/ .ivu-table-column-left {
    background: #00202d;
  }
  /deep/ .ivu-table {
    background: rgba(255, 255, 255, .3);
  }
  /deep/ .ivu-table-body .ivu-table-column-center, /deep/ .ivu-table-body .ivu-table-column-left {
    background: rgba(0, 0, 0, 0);
    border-bottom: 1px solid rgba(255, 255, 255, .5);
    span {
      color: #444;
      font-size: 14px;
    }
  }
  // .ivu-table-title {
  //   position: absolute;
  //   top: 60px;
  //   height: 80px;
  //   width: 100%;
  //   border: none;
  //   background: #f9f9f9;
  //   .top {
  //     display: flex;
  //     justify-content: space-between;
  //     margin-left: 18px;
  //     margin-right: 50px;
  //     line-height: 80px;
  //     font-size: 14px;
  //     p {
  //       cursor: pointer;
  //     }
  //   }
  //   .check-button {
  //     position: relative;
  //     height: 130px;
  //     overflow: auto;
  //     background: #f8f8f9;
  //     padding: 10px 50px 20px 50px;
  //     .check-btn {
  //       position: absolute;
  //       bottom: 20px;
  //       right: 20px;
  //       /deep/ .ivu-btn {
  //         height: 30px;
  //         margin-left: 20px;
  //         font-size: 12px;
  //       }
  //     }
  //   }
  // }
  // .ivu-table-tip {
  //   margin-top: 80px;
  // }
  // .ivu-table-body {
  //   margin-top: 80px;
  // }
  .table-price {
    > p {
      display: flex;
    }
  }
  .table-action {
    p {
      cursor: pointer;
    }
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
}
.check-box {
  position: relative;
  margin: 0 20px;
  display: flex;
  background: #fff;
  align-items: center;
  height: 80px;
  border-radius: 5px;
  span {
    margin-left: 20px;
    font-size: 14px;
    cursor: pointer;
  }
}
.section {
  margin: 0 30px;
}
.check-span {
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
  ul {
    display: flex;
    color: #515a6e;
    font-size: 14px;
    align-items: center;
    li:last-child {
      margin-left: 30px;
      font-size: 14px;
      line-height: 16px;
      margin-right: 30px;
      .red {
        float: right;
        margin-left: 30px;
        color: #ff5353;
        font-weight: 600;
        font-size: 30px;
      }
    }
    margin-right: 20px;
  }
  .default-btn {
    width: 200px;
    vertical-align: middle;
    .button-style(#fff, #00202d);
    border-radius: 5px;
  }
}
.abandon {
  .top {
    margin-left: 20px;
    margin-top: 30px;
    .default-btn {
      margin-left: 40px;
      width: 200px;
      height: 30px;
      vertical-align: middle;
      .button-style(#fff, #00202d);
      border-radius: 15px;
      /deep/ span {
        font-size: 14px;
      }
      /deep/ &.ivu-btn {
        padding: 0;
      }
    }
  }
}
.section-no {
  height: 500px;
  margin: 50px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  text-align: center;
  img {
    margin-top: 60px;
    margin-bottom: 10px;
  }
  h3 {
    margin: 20px 0;
    font-size: 24px;
    font-weight: 400;
    color: rgba(0, 32, 45, 1);
    line-height: 33px;
  }
  .default-btn {
    width: 180px;
    height: 50px;
    vertical-align: middle;
    .button-style(#fff, #00202d);
    border-radius: 5px;
  }
}
</style>
