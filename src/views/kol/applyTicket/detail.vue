<template>
  <div class="pages">
     <Row>
       <Col class='box'>
         <Row>
           <Col class='fa-m' :span='5'>开票状态： <span v-for='(it , index) in statusList' :key='index' v-if='list.status == it.key'>{{it.text}}</span></Col>
           <Col v-if='list.status == 2' class='fa-m hui' :span='12'>拒绝原因： {{list.refuseReason}}</Col>
         </Row>
         <Row style='margin-top: 10px;'>
           <Col :span='12'>发票信息</Col>
           <Col :span='12' style='padding-left: 2%;'>申请信息</Col>
         </Row>
         <Row style='margin-top: 10px;'>
            <Row class='sbg'>
              <Col>发票内容：<span v-for='(it , index) in faList' :key='index' v-if='list.itemCode == it.key'>{{it.text}}</span></Col>
              <Col>发票总额：<span>￥{{list.totalTaxFee}}</span></Col>
              <Col>发票类型：<span v-for='(it , index) in faType' :key='index' v-if='list.invoiceType == it.key'>{{it.text}}</span></Col>
              <Col>发票抬头：<span>{{list.name}}</span></Col>
              <Col>税号：{{list.taxId}}</Col>
              <Col>地址：{{adsoen}}&nbsp;&nbsp; {{list.address}}</Col>
               
              <Col>电话：{{list.telphone}}</Col>
              <Col>开户行/账号：{{list.accountBank}} &nbsp;&nbsp;&nbsp; {{list.accountNumber}}</Col>
              <Col><Tooltip   max-width="200" transfer :content="list.memo">
                    <div class="film-time">备注：{{list.memo}}</div></Tooltip></Col>
            </Row>
            <Row class='sbg' style='margin-left: 4%;'>
              <Col>申请时间：{{applyTime}}</Col>
              <Col>邮寄地址：{{adstwo}}&nbsp;&nbsp; {{list.addressDetail}}</Col>
              <Col>联系人：{{list.contact == null ? '暂无联系人' : list.contact}}</Col>
              <Col>联系电话：{{list.contactTelphone}}</Col>
              <Col><Tooltip   max-width="200" transfer :content="list.comment">
                    <div class="film-time">留言：{{list.comment == '' || list.comment == null ? '暂无留言' : list.comment}}</div></Tooltip></Col>
            </Row>
         </Row>
         <Row style='margin-top: 20px;line-height: 35px;height: 35px;'>快递信息</Row>
         <Row class='fb' style='padding: 10px 20px;'>
           <Col :span='8'>开票日期：{{list.billingTime == null ? '暂无开票日期' : billingTime}}</Col>
           <Col :span='8'>快递公司：{{list.expressCompany == null ? '暂无快递公司' : list.expressCompany}}</Col>
           <Col :span='8'>快递单号：{{list.expressNo == null ? '暂无快递单号' : list.expressNo}}</Col>
         </Row>
         <Row style='margin-top: 20px;line-height: 35px;height: 35px;'>包含订单({{item.length}})</Row>
         <Row style='margin-top: 10px;'>
          <Row  class="list-li" v-for="(item , index) in item" :key = "index" :value="item.id" :label="item.id">
            <Row class="li-title flex-box">
              <Col :span='4'>订单号：{{item.orderNo}}</Col>
              <Col :span='14'>下单时间： {{item.createTime}}</Col>
            </Row>
            <Row class="li-col" style='padding-left: 24px;'>
              <Col :span="4">
                <div style='font-size: 16px;font-weight: 500;margin-bottom: 6px'>{{item.projectName}}</div>
                <div class='simg'>
                  <img :src="require('./assets/'+ item.channelCode + '.png')" alt="">
                </div>
                <p style='margin-left: 30px;' v-for='(it , index) in channelList' :key='index' v-if='item.channelCode == it.key'>{{it.text}}推广</p>
              </Col>
              <Col style='padding-top: 10px;' :span="8" class="flex-box">
                <img v-if='item.orderItemList.length <= 5' :src="it.accountPhotoFileUrl" v-for="(it, index) in item.orderItemList" :key = 'index' alt="" class="li-img"/>
                <img v-if='item.orderItemList.length > 5' :src="it.accountPhotoFileUrl" v-for="(it, index) in item.orderItemList.slice(0 , 5)" :key = 'index' alt="" class="li-img"/>
                <span class="img-num" v-if='item.orderItemList.length > 5'>...等{{item.orderItemList.length}}个账号</span>
              </Col>
              <Col :span="8">
                <p >实付金额：<span style='font-size: 20px;font-weight: 500'>¥{{item.totalFee}}</span></p>
                <p v-if='item.refundFee != 0'>有退款：<span style='font-size: 20px;font-weight: 500'>¥{{item.refundFee}}</span></p>
              </Col>
              <Col :span="3" class="status-btn" @click.prevent.native='view(item.id)'> 详情 </Col>
            </Row>
          </Row >
          <div v-if='items.length > 5' class='mores' @click='more'>展开全部<span></span></div>
        </Row >
       </Col>
     </Row>
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
  histories,
  viewcity
} from '@/api/ticket'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import AreaSelect from '@/components/areaSelect'
import number from '@/components/number.vue'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
import { uniq, uniqBy } from 'lodash'

@Component({
  components: {
    AreaSelect,
    number
  }
})
export default class Main extends ViewBase {
  totalCount = 0
  query: any = {
  }


  list: any = {}
  // 发票内容
  faList: any = []
  // 发票类型
  faType: any = []
  // 抬头类型
  taiType: any = []
  // 状态
  statusList: any = []
  // 渠道
  channelList: any = []
  // 订单
  item: any = []
  items: any = []
  billingTime: any = ''
  applyTime: any = ''
  proone: any = ''
  cityone: any = ''
  cunone: any = ''
  protwo: any = ''
  citytwo: any = ''
  cuntwo: any = ''
  adsoen: any = ''
  adstwo: any = ''


  mounted() {
    this.seach()
  }


  async seach() {
    try {
      const { data } = await itemlist(this.$route.params.id)
      this.list = data
      this.faList = data.itemList
      this.billingTime = moment(data.billingTime).format(timeFormat)
      this.applyTime = moment(data.applyTime).format(timeFormat)
      this.faType = data.invoiceTypeList
      this.taiType = data.customerTypeList
      this.statusList = data.invoiceStatusList
      this.channelList = data.channelList
      this.items = data.items
      if (data.items.length <= 5 ) {
        this.item = (data.items || []).map((it: any) => {
          return {
            ...it,
            orderItemList: uniqBy(it.orderItemList, 'kolId'), // 去重一个kol有两个任务
            createTime: moment(it.createTime).format(timeFormat)
          }
        })
      } else if (data.items.length > 5 ) {
        this.item = (data.items || []).map((it: any) => {
          return {
            ...it,
            orderItemList: uniqBy(it.orderItemList, 'kolId'), // 去重一个kol有两个任务
            createTime: moment(it.createTime).format(timeFormat)
          }
        }).slice(0 , 5)
      }
      const proone = await viewcity(data.provinceId)
      const cityone = await viewcity(data.cityId)
      const cunone = await viewcity(data.countyId)
      const protwo = await viewcity(data.contactProvinceId)
      const citytwo = await viewcity(data.contactCityId)
      const cuntwo = await viewcity(data.contactCountyId)
      this.proone = (proone.data || []).map((it: any) => {
        return it.nameCn
      })
      this.cityone = (cityone.data || []).map((it: any) => {
        return it.nameCn
      })
      this.cunone = (cunone.data || []).map((it: any) => {
        return it.nameCn
      })
      this.protwo = (protwo.data || []).map((it: any) => {
        return it.nameCn
      })
      this.citytwo = (citytwo.data || []).map((it: any) => {
        return it.nameCn
      })
      this.cuntwo = (cuntwo.data || []).map((it: any) => {
        return it.nameCn
      })

      this.adsoen = this.proone + '/' + this.cityone + '/' + this.cunone
      this.adstwo = this.protwo + '/' + this.citytwo + '/' + this.cuntwo

    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  view(id: any) {
    this.$router.push({ path : '/kol/order/detail/' + id})
  }

  more() {
    this.item = this.items
  }

}

</script>
<style lang='less' scoped>
@import '~@/site/common.less';
.pages {
  padding: 10px 30px 0 30px;
}
.box {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  padding: 20px 40px 20px 30px;
  font-size: 14px;
}
.fa-m {
  height: 40px;
  line-height: 40px;
  color: rgba(0, 32, 45, 0.5);
  span {
    color: #00202d;
    font-weight: bold;
  }
}
.hui {
  color: rgba(0, 32, 45, 0.5);
}
.sbg {
  width: 48%;
  height: 256px;
  float: left;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid #fff;
  border-radius: 5px;
  padding: 20px 20px 20px 20px;
  font-size: 14px;
  line-height: 24px;
}
.fb {
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid #fff;
  border-radius: 5px;
  font-size: 14px;
  line-height: 24px;
  margin-top: 10px;
}
.list-li {
  width: 100%;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.3);
  padding: 20px 30px 30px 20px;
  border: 1px solid #fff;
  border-radius: 5px;
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
.mores {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 32, 45, 1);
  line-height: 70px;
  position: relative;
  span {
    position: absolute;
    top: 27px;
    display: inline-block;
    width: 11px;
    height: 11px;
    margin-left: 10px;
    border-left: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    transform-origin: 50% 50%;
    transform: rotate(-45deg);
  }
}
/deep/ textarea.ivu-input {
  height: 180px;
  border-radius: 5px;
}
/deep/ .ivu-select-selection {
  height: 35px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-select-input {
  margin-top: 3px;
}
/deep/ .ivu-input {
  border-radius: 5px;
  height: 35px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-tooltip {
  width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 24px;
  line-height: 24px;
}
.film-time {
  height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>