<template>
  <div class="kol-box">
    <Header />
    <div>
      <Step v-model="$route.params.id"></Step>
    </div>
    <div v-if="tableDate.length > 0" class="section">
      <Table  :columns="columns" :data="tableDate" ref="selection"  @on-selection-change="singleSelect"  @on-select-all="selectAll" >
        <!-- <template ref='title' slot="header">
          <div>
            <div class="top">
              <p>
                <span v-if="filename">影片：《{{filename}}》</span>
              </p>
              <p @click="checkFilm">
                切换
                <Icon v-if="!checkSelcet" type="ios-arrow-forward" />
                <Icon v-else type="ios-arrow-down" />            </p>
            </div>
            <div class="check-button" v-if="checkSelcet">
              <div>
                  <RadioGroup v-model="filmCheck">
                    <Radio v-for="it in filmList" :key="it.key" :label="it.key">{{it.text}}</Radio>
                </RadioGroup>
              </div>
              <div class="check-btn">
                <Button @click="sure">确定</Button>
                <Button @click="checkFilm">取消</Button>
              </div>
            </div>
          </div>
        </template> -->
        <template style="marin-top: 100px" slot-scope="{ row }" slot="type">
          <div class="table-name">
            <img :src="row.accountImageUrl" alt=""> 
            <span>{{row.accountName}}</span>
          </div>
        </template>

        <template style="marin-top: 100px" slot-scope="{ row }" slot="pintai">
          <div class="table-name">
            <span v-if="accountCategoryList && accountCategoryList.length>0">
              {{accountCategoryList.filter((it) => it.key == row.accountTypeCode)[0].text}}
            </span>
          </div>
        </template>

        <template slot-scope="{ row }" slot="genre">
          <div>
            <p v-for="(it, index) in row.priceList" :key="index" style="margin-top: 5px">
                {{statusLists(it)}}
            </p>
          </div>
        </template>
    
        <template style="marin-top: 100px" slot-scope="{ row }" slot="action">
          <div class="table-action">
            <p v-if="!row.collected" @click="collects(row.id)">
              <img width="14px" src="./assets/collect.png" />
              收藏
            </p>
            <p v-else @click="cancelcollects(row.id)">
              <img width="14px" src="./assets/collectcheck.png" />
              取消收藏
            </p>
            <p @click="cancelShop(row.channelDataId)" style="margin-top: 7px">
              <img width="14px" src="./assets/cancel.png" />
              删除
            </p>
          </div>
        </template>
      </Table>
      <div class="check-box" v-if="tableDate.length > 0" style="padding-right: 0px">
        <span @click="handleSelectAll">
          <Checkbox v-model="checkboxAll"></Checkbox>全选
        </span>
        <span class="point" @click="alldel">删除</span>
        <span class="point" @click="allcollect">收藏</span>
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
      <div class="abandon" v-if="tableDate1.length > 0">
        <div class="top">
          以下KOL账号已下架，无法进行预订
          <Button class="default-btn" @click="reserve">全部清空</Button>
        </div>
        <Table :show-header="false" :columns="columnsNum" :data="tableDate1" >
          <template style="marin-top: 100px" slot-scope="{ row }" slot="type">
            <div class="table-name">
              <img :src="row.accountImageUrl" alt=""> 
              <span>{{row.accountName}}</span>
            </div>
          </template>
          <template style="marin-top: 100px" slot-scope="{ row }" slot="pintai">
            <div class="table-name">
              <span v-if="accountCategoryList && accountCategoryList.length>0">
                {{accountCategoryList.filter((it) => it.key == row.accountTypeCode)[0].text}}
              </span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="genre">
            <div>
              <p v-for="(it, index) in row.priceList" :key="index" style="margin-top: 5px">
                {{statusLists(it)}}
              </p>
            </div>
          </template>
          <template style="marin-top: 100px" slot-scope="{ row }" slot="action">
            <div class="table-action">
              <p v-if="!row.collected" @click="collects(row.id)">
                <img width="14px" src="./assets/collect.png" />
                收藏
              </p>
              <p v-else @click="cancelcollects(row.id)">
                <img width="14px" src="./assets/collectcheck.png" />
                取消收藏
              </p>
              <p @click="cancelShop(row.channelDataId)" style="margin-top: 7px">
                <img width="14px" src="./assets/cancel.png" />
                删除
              </p>
            </div>
          </template>
        </Table>
      </div>
    </div>
    <div v-else class="section-no">
      <img src="./assets/noshop.png" alt="">
      <h3>还没有添加KOL账号</h3>
      <Button class="default-btn" @click="checkKol">前往挑选</Button>
    </div>
    <Detail ref="detail" />
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { kolShoppingCar, delShopping } from '@/api/kolList.ts'
import Header from './header.vue'
import Detail from './detail.vue'
import { formatCurrency } from '@/fn/string'
import { uniqBy } from 'lodash'
import { toast, warning } from '@/ui/modal.ts'
import Step from './step.vue'

@Component({
  components: {
    Header,
    Detail,
    Step
  }
})
export default class DlgEditCinema extends ViewBase {
  @Prop() id!: number
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
  titles: any = ['weibo', 'wechat', 'douyin', 'kuaishou', 'xiaohonghsu']
  sumcount = '0.00'
  accountCategoryList: any = []
  statusList: any = []
  tableDate1: any = []

  get tableDates() {
    if (this.tableDate && this.tableDate.length > 0) {
      return this.tableDate.map((it: any) => {
        if (this.checkId.includes(it.id)) {
          return {
            ...it,
            _checked: true
          }
        } else {
          return {
            ...it,
          }
        }
      })
    } else {
      return []
    }
  }

  get columnsNum() {
    const columns: any = [
        {
          title: '全选',
          align: 'left',
          width: 190,
        },
        {
          title: '账号分类',
          align: 'left',
          slot: 'type'
        },
        {
          title: '平台',
          align: 'left',
          key: 'platform',
          slot: 'pintai'
        },
        {
          title: '投放方式',
          align: 'left',
          key: 'type',
          slot: 'genre'
        },
        {
          title: '操作',
          align: 'center',
          width: 160,
          slot: 'action'
        }
      ]
    return columns
  }
  get columns() {
    const columns: any = [
        { type: 'selection', width: 70, align: 'center' },
        {
          title: '全选',
          align: 'left',
          width: 120,
        },
        {
          title: '账号分类',
          align: 'left',
          slot: 'type'
        },
        {
          title: '平台',
          align: 'left',
          key: 'platform',
          slot: 'pintai'
        },
        {
          title: '投放方式',
          align: 'left',
          key: 'type',
          slot: 'genre'
        },
        {
          title: '操作',
          align: 'center',
          width: 160,
          slot: 'action'
        }
      ]
    return columns
  }

  // 删除购物车
  async cancelShop(id: any) {
    try {
      await delShopping({
        channelCode: this.titles[this.$route.params.id ? Number(this.$route.params.id) : 0],
        channelDataId: id
      })
      this.init()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async init() {
    try {
      const type: any = this.$route.params.id ? this.titles.findIndex((it: any) => it == this.$route.params.id) : 0
      const { data } = await kolShoppingCar()
      this.accountCategoryList = data.accountCategoryList
      switch (type) {
        case 0: this.tableDate = data.weiboList.filter((it: any) => it.controlStatus == 1)
                this.tableDate1 = data.weiboList.filter((it: any) => it.controlStatus == 2)
                this.statusList = data.weiboPublishCategoryList
          break
        case 1: this.tableDate = data.weixinList.filter((it: any) => it.controlStatus == 1)
                this.tableDate1 = data.weixinList.filter((it: any) => it.controlStatus == 2)
                this.statusList = data.weixinPublishCategoryList
          break
        case 2: this.tableDate = data.douyinList.filter((it: any) => it.controlStatus == 1)
                this.tableDate1 = data.douyinList.filter((it: any) => it.controlStatus == 2)
                this.statusList = data.douyinPublishCategoryList
          break
        case 3: this.tableDate = data.kuaishouList.filter((it: any) => it.controlStatus == 1)
                this.tableDate1 = data.kuaishouList.filter((it: any) => it.controlStatus == 2)
                this.statusList = data.kuaishouPublishCategoryList
          break
        case 4: this.tableDate = data.xiaohongshuList.filter((it: any) => it.controlStatus == 1)
                this.tableDate1 = data.xiaohongshuList.filter((it: any) => it.controlStatus == 2)
                this.statusList = data.xiaohongshuPublishCategoryList
          break
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  statusLists(it: any) {
    const msg = (this.statusList.filter((its: any) => its.key == it.categoryCode)[0] as any).text
    return `${msg}`
  }

  created() {
    // this.filmFind()
    this.init()
  }

  mounted() {
    // this.sumList = JSON.parse(sessionStorage.getItem('shopList') as any)
  }

  // async filmFind() {
  //   try {
  //     const { data } = await fileList({})
  //     this.filmList = data.items || []
  //     this.filename = this.filmList.filter((it: any) => it.key == this.filmCheck)[0].text
  //   } catch (ex) {
  //     this.handleError(ex)
  //   }
  // }

  reserve() {
    // this.$nextTick(() => {
    //   (this.$refs.detail as any).init(this.filmCheck)
    // })
    const sumList = this.sumList((it: any) => {
      it.priceList.map((item: any) => {
        const msg = (this.statusList.filter((its: any) => its.key == item.categoryCode)[0] as any).text
        return {
          text: msg,

        }
      })
    })
    sessionStorage.setItem('shopList', JSON.stringify(this.sumList))
    this.$router.push({
      name: 'order-orderfill',
      params: {
        code: this.$route.params.id || 'weibo'
      }
    })
  }

  handleSelectAll() {
    const selection = this.$refs.selection as any
    selection.selectAll(!this.checkboxAll)
  }

  singleSelect(select: any) {
    const ids = this.tableDate.map((it: any) => it.id)
    const dataId = select.map((it: any) => it.id)
    select.forEach((item: any) => {
      if (!this.checkId.includes(item.id)) {
        this.checkId.push(item.id)
        this.sumList.push(item)
      }
    })
    const filterId = ids.filter((it: any) => !dataId.includes(it))
    this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
    this.sumList = this.sumList.filter((it: any) => !filterId.includes(it.id))
    this.sum = this.checkId.length
    let sum = 0
    this.sumList.forEach((it: any) => {
      sum += (Number(it.fans))
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

  // async init() {
  //   try {
  //     const { data } = await queryList({})
  //     this.tableDate = data.items
  //   } catch (ex) {
  //     this.handleError(ex)
  //   }
  // }

  selectAll() {

  }

  async alldel() {
    try {

    } catch (ex) {
      this.handleError(ex)
    }
  }

  async allcollect() {
    try {

    } catch (ex) {
      this.handleError(ex)
    }
  }

  checkKol() {
    this.$router.push({
      name: 'kol-kollist'
    })
  }

  cancel() {
    this.showDlg = false
  }

  @Watch('$route.params', {deep: true})
  watch$routeParams(val: any) {
    this.init()
    this.checkboxAll = false
    this.checkId = []
    this.sumList = []
    this.sum = 0
    this.sumcount = '0.00'
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
.point {
  cursor: pointer;
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
    color: #00202d;
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
  .table-name {
    display: flex;
    padding: 20px 0;
    align-items: center;
    color: #00202d;
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
  }
}
.table-action {
  p {
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
