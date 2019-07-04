<template>
  <div class="pages">
      <h3 class="title">申请开票</h3>
      <div>
        <CheckboxGroup v-model='orderids' class='chacks'>
          <Row class='nav-title'>
            <Col span='5'>已完成订单数量： {{data.finishedCount}}</Col>
            <Col span='14'>合计支付金额：<span>￥{{data.payTotalFee}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;有退款：<span>￥{{data.refundTotalFee}}</span></Col>
            <div span='5' style='text-align: right;' @click='his()'>查看开票历史</div>
          </Row>
          <Checkbox  class="list-li" v-for="(item , index) in list" :key = "index" :value="item.id" :label="item.id">
            <Row class="li-title flex-box">
              <Col :span='4'>订单号：{{item.orderNo}}</Col>
              <Col :span='14'>下单时间： {{item.createTime}}</Col>
            </Row>
            <Row class="li-col" style='padding-left: 24px;'>
              <Col :span="4">
                <div  class="order-title" style='font-size: 16px;font-weight: 500;margin-bottom: 6px'>
                <!-- {{item.projectName}} -->
                <Tooltip max-width="200" transfer v-if='item.projectName != null' :content="item.projectName">
                          <span>{{item.projectName}}</span>
                          </Tooltip>
                </div>
                <div class='simg'>
                  <img :src="require('./assets/'+ item.channelCode + '.png')" alt="">
                </div>
                <p style='margin-left: 30px;' v-for='(it , index) in codeList' :key='index' v-if='item.channelCode == it.key'>{{it.text}}推广</p>
              </Col>
              <Col style='padding-top: 10px;' :span="8" class="flex-box">
                <span v-if='item.orderItemList == null'>暂无账号</span>
                <img v-if='item.orderItemList != null && item.orderItemList.length <= 5' :src="it.accountPhotoFileUrl" v-for="(it, index) in item.orderItemList" :key = 'index' alt="" class="li-img"/>
                <img v-if='item.orderItemList != null && item.orderItemList.length > 5' :src="it.accountPhotoFileUrl" v-for="(it, index) in item.orderItemList.slice(0, 5)" :key = 'index' alt="" class="li-img"/>
                <span class="img-num" v-if='item.orderItemList != null && item.orderItemList.length > 5'>...等{{item.orderItemList.length}}个账号</span>
              </Col>
              <Col :span="8">
                <p >实付金额：<span style='font-size: 20px;font-weight: 500'>¥{{item.totalFee}}</span></p>
                <p v-if='item.refundFee != 0'>有退款：<span style='font-size: 20px;font-weight: 500'>¥{{item.refundFee}}</span></p>
              </Col>
              <Col :span="3" class="status-btn" @click.prevent.native='view(item.id)'> 详情 </Col>
            </Row>
          </Checkbox >
        </CheckboxGroup >
        <div class='lis' v-if='this.list.length == 0'>暂无开票申请</div>
        <div class='bot-sha'>
          <Col :span="8">
            <Checkbox  :indeterminate="indeterminate" :value="checkAll"  @click.prevent.native="handleCheckAll">全选</Checkbox>
          </Col>
          <Col :span="3">
            已选择 {{orderids.length}} 个订单
          </Col>
          <Col :span="7">
            发票总额：<span>¥{{sum}}</span>
          </Col>
          <Col :span="3"> <p class='down' @click='down()'>下一步</p> </Col>
        </div>
      </div>
    <div class='di'></div>
  </div>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info } from '@/ui/modal'
import {
  queryList,
  editticket,
  addticket,
  itemlist,
  histories
} from '@/api/ticket'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import { uniq, uniqBy } from 'lodash'
import Decimal from 'decimal.js'


const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component
export default class Main extends ViewBase {
  totalCount = 0
  query = {

  }


  list: any = []
  data: any = {}
  checkAll: any = false
  indeterminate: any = false
  // 总金额
  sum: any = 0
  // 选中的退款金额总和
  refundsum: any = 0
  codeList: any = []
  // 金额数组
  moneyList: any = []
  // 选中的金额数组
  refundmoney: any = []
  orderids: any = []
  orderno: any = []

  mounted() {
    this.seach()
  }

  seachs() {
    this.seach()
  }

  async seach() {
    try {
      const { data } = await queryList(this.query)
      this.data = data
      this.list = (data.items || []).map((it: any) => {
        return {
          ...it,
          orderItemList: uniqBy(it.orderItemList, 'kolId'), // 去重一个kol有两个任务
          createTime: moment(it.createTime).format(timeFormat)
        }
      })
      this.totalCount = data.totalCount
      this.codeList = data.channelList
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  his() {
    this.$router.push({ path : '/kol/applyTicket/ticketHis'})
  }

  view(id: any) {
    this.$router.push({ path : '/kol/order/detail/' + id})
  }

  down() {
    if (this.orderids.length == 0) {
      info('请选择订单')
    } else {
      // for (const i in this.list) {
      //   if ( 1 == 1 ) {
      //     for (const j in this.orderids) {
      //       if (this.list[i].id == this.orderids[j]) {
      //         // this.moneyList.push(this.list[i].totalFee)
      //         this.orderno.push(this.list[i].orderNo)
      //       }
      //     }
      //   }
      // }
      // this.sum = 0
      // this.moneyList.forEach((ele: any) => {
      //   this.sum += Number(ele)
      // })
      const index: any = 'tic' + Math.floor(Math.random() * 1000 + 1)
      sessionStorage.setItem(`${index}`, JSON.stringify({
        totalTaxFee: this.sum ,
        order_ids : this.orderids ,
        order_no : this.orderno
      }))

      this.$router.push({ path : `/kol/applyTicket/addticket/0/` + index })
    }
  }

  handleCheckAll() {
    if (this.indeterminate) {
        this.checkAll = false
    } else {
        this.checkAll = !this.checkAll
    }
    this.indeterminate = false

    if (this.checkAll) {
        this.orderids = (this.list || []).map((it: any ) => {
          return it.id
        })
    } else {
        this.orderids = []
    }
  }



  @Watch('orderids', {deep: true})
  watchMoneyList() {
    this.moneyList = []
    this.orderno = []
    this.refundmoney = []
    this.sum = 0
    this.refundsum = 0

    for (const i in this.list) {
        if ( 1 == 1 ) {
          for (const j in this.orderids) {
            if (this.list[i].id == this.orderids[j]) {
              this.moneyList.push(this.list[i].totalFee)
              this.refundmoney.push(this.list[i].refundFee)
              this.orderno.push(this.list[i].orderNo)
            }
          }
        }
      }
      // this.sum = 0
      this.moneyList.forEach((ele: any) => {
        // this.sum += (Number(ele) * 100)
        this.sum = new Decimal(this.sum).plus(ele)
      })
      // 总金额减去退款金额
      this.refundmoney.forEach((ele: any) => {
        // this.sum -= (Number(ele) * 100)
        this.sum = new Decimal(this.sum).minus(ele)
      })

    if (this.orderids.length != this.list.length) {
      // this.indeterminate = true
      this.checkAll = false
    }
    if (this.orderids.length == this.list.length) {
      // this.indeterminate = false
      this.checkAll = true
    }
  }
}

</script>
<style lang='less' scoped>
@import '~@/site/common.less';
.pages {
  padding: 10px 40px 0 30px;
}
.title {
  font-weight: 400;
  font-size: 24px;
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  margin-bottom: 30px;
}
.nav-title {
  color: #fff;
  height: 52px;
  background: rgba(0, 32, 45, 0.9);
  border-radius: 5px;
  line-height: 50px;
  padding: 0 30px 0 50px;
  font-size: 14px;
  cursor: pointer;
  span {
    color: rgba(218, 108, 112, 1);
    font-size: 20px;
  }
}
.lis {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: #fff;
  text-align: center;
}
.list-li {
  width: 100%;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.3);
  padding: 20px 30px 30px 50px;
  border-bottom: 1px solid #eee;
  position: relative;
  .li-title {
    height: 55px;
    line-height: 55px;
    padding-left: 24px;
  }
  .li-col {
    .li-img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .img-num {
      padding-top: 7px;
    }
    .status-btn {
      text-align: center;
      cursor: pointer;
    }
    .simg {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      position: absolute;
      left: 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.formInline {
  padding: 0;
}
.search {
  width: 100px;
  height: 40px;
  border-radius: 2px;
  color: #fff;
  background: @c-res-btn;
  border: none；;
}
.apply-btn {
  width: 140px;
  height: 40px;
  border-radius: 2px;
  color: #585858;
  background: #fff;
  border: solid 1px #ededed;
  font-size: 13px;
  position: absolute;
  right: 0;
  top: 40px;
}
.di {
  width: 100%;
  height: 91px;
}
.order-title {
  font-size: 15px;
  span {
    overflow: hidden;
    width: 150px;
    height: 45px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 22px;
  }
}
.bot-sha {
  height: 91px;
  background: rgba(0, 32, 45, 0.5);
  padding: 0 30px 0 50px;
  line-height: 91px;
  color: #fff;
  font-size: 14px;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 1480px;
  margin-left: -40px;
  z-index: 10;
  span {
    color: rgba(218, 108, 112, 1);
    font-size: 20px;
  }
  .down {
    width: 100%;
    height: 50px;
    background: rgba(0, 32, 45, 0.8);
    line-height: 50px;
    text-align: center;
    border-radius: 30px;
    font-size: 24px;
    margin-top: 12%;
    cursor: pointer;
  }
}
.order-status-tab {
  margin: 40px 0 30px;
  /deep/ .ivu-tabs-bar {
    border: none;
  }
}
.drop-down {
  /deep/ .ivu-dropdown-rel {
    cursor: pointer;
    font-size: 14px;
    color: #515a6e;
    margin-top: 48px;
  }
}
.chacks {
  /deep/ .ivu-checkbox {
    position: absolute;
    left: 2%;
    top: 48%;
  }
}
</style>