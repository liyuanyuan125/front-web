<template>
  <div class="pages">
      <div>
        <Row>
           <Col :span="7">
              <Col span="23">
                <Select 
                 v-model='query.year'  
                 clearable
                 filterable
                 placeholder="全部年份"
                 remote
                 @on-change="seachs">
                  <Option
                    v-for="item in years"
                    :key="item.key"
                    :value="item.key"
                  >{{item.text}}</Option>
                </Select>
              </Col>
            </Col>
            <Col :span="7">
              <Col style='margin-left: 8px;' span="23">
                <Select
                v-model="query.month"
                placeholder="选择月份"
                @on-change="seach">
                  <Option v-for="it in mountes" :key="it.key" :value="it.key"
                    :label="it.text">{{it.text}}</Option>
                </Select>

              </Col>
            </Col>
            <Col :span="7">
              <Col style='margin-left: 8px;' span="23">
                <Select 
                 v-model='query.cinemaId'  
                 clearable
                 filterable
                 placeholder="影院名称"
                 remote
                 :loading="loading"
                 :remote-method="remoteMethod"
                 @on-clear="movieList = []"
                 @on-change="seachs">
                  <Option
                    v-for="item in movieList"
                    :key="item.id"
                    :value="item.id"
                  >{{item.shortName}}</Option>
                </Select>
              </Col>
            </Col>
         </Row>
         <span class='addbutton' v-if='this.list.length != 0' style='margin-right: 20px;' @click='all(0)'>批量审核通过</span>
         <!-- <span class='addbutton'>开票</span> -->
        <CheckboxGroup v-model='orderids' class='chacks' v-if='this.list.length != 0'>
          <Checkbox  class="list-li" v-for="(item , index) in list" :key = "item.id" :value="item.id"
           :label="item.id" :disabled='item.billStatus != 2' >
            <Row class='nav-title'>
              <img v-if="item.advertType == 'TRAILER'" class='advertTypeImg' src="~@/assets/icon/prevue.png" alt="">
              <Col span='5'>
                <Tooltip  transfer placement="bottom-start" :content="item.cinemaName">
                  <em class='tips'>{{item.cinemaName}}</em>
                </Tooltip>
                </Col>
              <Col span='13'>{{item.year}}-{{item.month < 10 ? '0' + item.month : item.month }}</Col>
              <Col span='5' style='color: #DA6C70;float: right;text-align: center;'>
                <span v-if='item.billStatus == 1'>待平台确认</span>
                <span v-if='item.billStatus == 2'>待审核</span>
                <span v-if='item.billStatus == 3'>审核失败</span>
                <span v-if='item.billStatus == 4 && item.invoiceStatus == 1 && item.payStatus == 1'>待结算</span>
                <span v-if='item.billStatus == 4 && item.invoiceStatus == 1 && item.payStatus == 2'>已结算</span>
                <span v-if='item.billStatus == 4 && item.invoiceStatus == 2 && item.payStatus == 1'>待登记发票</span>
                <span v-if='item.billStatus == 4 && item.invoiceStatus == 2 && item.payStatus == 2'>已结算,待登记发票</span>
                <span v-if='item.billStatus == 4 && item.invoiceStatus == 3 && item.payStatus == 1'>待结算</span>
                <span v-if='item.billStatus == 4 && item.invoiceStatus == 3 && item.payStatus == 2'>已结算</span>
              </Col>
            </Row>
            <Row class="li-col">
              <Col :span="7" style='border-right: 1px solid #fff;'>
                <p class='order_money'>{{formatNumber(item.amount)}}</p>
                <p class='order_sma'>结算金额 / 元</p>
              </Col>
              <Col :span="6">
                <p class='order_num'>{{formatNumber(item.videoCount , 2)}}</p>
                <p class='order_sma'>广告片数量 / 个</p>
              </Col>
              <Col :span="7">
                <p class='order_num'>{{formatNumber(item.personCount , 2)}}</p>
                <p class='order_sma'>曝光人次 / 人次</p>
              </Col>
              <Col :span="4">
                <router-link
                    v-if='item.billStatus != 2'
                    class="status-btn"
                    style='line-height: 65px;'
                    :to="{name:'resFinance-bill-detail' , params: { id: item.id  } }"
                    tag="span"
                  >查看详情</router-link>
                <router-link
                  v-if='item.billStatus == 2'
                  class="status-btn"
                  style='line-height: 41px;'
                  :to="{name:'resFinance-bill-detail' , params: { id: item.id  } }"
                  tag="span"
                >查看详情</router-link>
                <router-link
                  v-if='item.billStatus == 2'
                  class="status-btn"
                  :to="{name:'resFinance-bill-detail' , params: { id: item.id, audit: 1  } }"
                  tag="p"
                >审核账单</router-link>
              </Col>
            </Row>
          </Checkbox >
        </CheckboxGroup >
        <div class='lis' v-if='this.list.length == 0'>暂无信息</div>
      </div>
      <Page
      :total="totalCount"
      v-if="totalCount>0"
      class="btn-center-footer plan-pages"
      :current="query.pageIndex"
      :page-size="query.pageSize"
      show-total
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
    <chgDlg  ref="re"   v-if="reVisible" @done="dlgEditDone"/>
  </div>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info } from '@/ui/modal'
import { queryList , approval } from '@/api/bill'
import { movielist } from '@/api/lastissue'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import { uniq, uniqBy } from 'lodash'
import Decimal from 'decimal.js'
import { formatNumber } from '@/util/validateRules'
// 审核弹窗页面
import chgDlg from './chgDlg.vue'


const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
    chgDlg
  }
})
export default class Main extends ViewBase {
  reVisible: any = false
  totalCount = 0
  query: any = {
    year: null,
    month: null,
    cinemaId: null,
    pageIndex: 1,
    pageSize: 4,
  }

  loading: any = false
  // 影院列表
  movieList: any = []


  list: any = []
  data: any = {}

  billStatusList: any = [] // 账单状态
  invoiceStatusList: any = [] // 发票状态
  payStatusList: any = [] // 付款状态
  // 选中的id列表
  orderids: any = []
  // 年份
  years: any = [
    {
      key: 2019,
      text: '2019'
    }
  ]
  getDefaultYear: any = [2019]
  // 月份
  mountes: any = [
    {
      key: 1,
      text: '一月'
    },
    {
      key: 2,
      text: '二月'
    },
    {
      key: 3,
      text: '三月'
    },
    {
      key: 4,
      text: '四月'
    },
    {
      key: 5,
      text: '五月'
    },
    {
      key: 6,
      text: '六月'
    },
    {
      key: 7,
      text: '七月'
    },
    {
      key: 8,
      text: '八月'
    },
    {
      key: 9,
      text: '九月'
    },
    {
      key: 10,
      text: '十月'
    },
    {
      key: 11,
      text: '十一月'
    },
    {
      key: 12,
      text: '十二月'
    }
  ]


  mounted() {
     const getDayYear = new Date().getFullYear()
     if ( getDayYear == this.getDefaultYear[0] ) {
       this.years = this.years
     } else {
       this.num(getDayYear , 2019)
     }
    this.query.year = new Date().getFullYear()
    this.seach()
  }

  get formatNumber() {
    return formatNumber
  }

  async remoteMethod(query: any) {
    try {
      if (query) {
        this.loading = true
        const {
          data: { items }
        } = await movielist({
          query,
        })
        this.movieList = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }

  // 年份列表展示
  num(bignum: any , defaultyear: any) {
    const a: number = (defaultyear + 1) // 2020
    this.getDefaultYear.push(a) // [2019,2020]
    if (a == bignum) { // 2021
      this.years = (this.getDefaultYear || []).map((it: any) => {
        return {
          key: it,
          text: String(it)
        }
      })
    } else {
      this.num(new Date().getFullYear() , a)
    }
  }

  seachs() {
    this.seach()
  }

  dlgEditDone() {
    this.seach()
  }

  async seach() {
    try {
      const { data } = await queryList(this.query)
      this.data = data

      this.list = data.items
      this.totalCount = data.totalCount

      this.billStatusList = data.billStatusList // 账单状态
      this.invoiceStatusList = data.invoiceStatusList // 发票状态
      this.payStatusList = data.payStatusList // 付款状态
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  async all(id: any) {
    if (this.orderids.length == 0) {
      info('请先选择订单')
      return
    }
    try {
      await confirm('您确定要操作批量审核通过吗？')
      await approval ({ids: this.orderids})
      this.$Message.success({
        content: `审核成功`,
      })
      this.seach()
    } catch (ex) {
      this.handleError(ex)
    }
    // this.reVisible = true
    // this.$nextTick(() => {
    //   const myThis: any = this
    //   myThis.$refs.re.init(id , this.orderids)
    // })
  }


  handlepageChange(size: any) {
    this.list = [1]
    this.query.pageIndex = size
    this.seach()
  }
  handlePageSize(size: any) {
    this.list = [1]
    this.query.pageIndex = size
    this.seach()
  }
}

</script>
<style lang='less' scoped>
@import '~@/site/common.less';
.pages {
  padding: 10px 40px 0 30px;
}
.nav-title {
  height: 60px;
  background: rgba(1, 35, 49, 1);
  border-radius: 5px 5px 0 0;
  line-height: 60px;
  padding: 0 30px 0 50px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
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
.tips {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 200px;
  color: #fff;
  font-size: 14px;
  font-style: normal;
}
/deep/ .ivu-tooltip-rel {
  height: 45px;
}
.list-li {
  width: 100%;
  font-size: 14px;
  background: rgba(19, 61, 75, 1);
  height: 180px;
  margin-bottom: 20px;
  border-radius: 5px;
  position: relative;
  .li-col {
    padding: 30px 50px 30px 0;
    text-align: center;
    .order_num {
      color: #fff;
      font-size: 20px;
    }
    .order_sma {
      color: #b3bcc0;
      font-size: 14px;
      margin-top: 15px;
    }
    .order_money {
      color: #ff6e6e;
      font-size: 20px;
    }
    .status-btn {
      text-align: center;
      cursor: pointer;
      color: #4fa6bb;
      font-size: 14px;
    }
  }
}
.addbutton {
  margin-top: 20px;
  display: inline-block;
  width: 160px;
  height: 40px;
  background: rgba(79, 166, 187, 1);
  border-radius: 20px;
  color: #fff;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}
.search {
  width: 100px;
  height: 40px;
  border-radius: 2px;
  color: #fff;
  background: @c-res-btn;
  border: none；;
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
  margin-top: 20px;
  /deep/ .ivu-checkbox {
    position: absolute;
    left: 4%;
    top: 60%;
  }
}
.advertTypeImg {
  width: 60px;
  height: 60px;
  position: absolute;
  left: 0;
  top: 0;
}
/deep/ .ivu-select-selection {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
}
/deep/ .ivu-select-input {
  margin-top: 3px;
  color: #00202d;
  &::-webkit-input-placeholder {
    color: #00202d;
  }
}
/deep/ .ivu-input {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  &::-webkit-input-placeholder {
    color: #00202d;
  }
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  color: #00202d;
}
/deep/ .button-text {
  margin: 0 3px;
  display: inline-block;
  text-align: center;
  line-height: 24px;
  width: 100px;
  height: 24px;
  background: rgba(0, 32, 45, 1);
  border-radius: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
/deep/ .btn-center-footer {
  text-align: center;
  height: 100px;
  margin: 0 20px 0 20px;
  line-height: 100px;
  color: #fff;
}
/deep/ .ivu-page-prev {
  border: 0;
  background: rgba(255, 255, 255, 0);
}
/deep/ .ivu-page-next {
  border: 0;
  background: rgba(255, 255, 255, 0);
}
/deep/ .ivu-page-item-active {
  border-color: #eee;
  background: #00202d !important;
  border-radius: 50%;
  color: #fff;
  width: 30px;
  height: 30px;
}
/deep/ .ivu-page-item-active:hover a {
  color: #fff;
}
/deep/ .ivu-page-item-active a {
  color: #fff;
}
/deep/ .ivu-page-item {
  border: 0;
  display: inline-block;
  vertical-align: middle;
  background: rgba(255, 255, 255, 0);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-right: 4px;
  text-align: center;
  list-style: none;
  user-select: none;
  cursor: pointer;
  font-weight: 500;
  transition: border 0.2s ease-in-out, color 0.2s ease-in-out;
}
/deep/ .ivu-form .ivu-form-item-label, /deep/ .ivu-icon-ios-arrow-forward::before, /deep/ .ivu-icon-ios-arrow-back::before {
  color: #00202d;
}
/deep/ .ivu-page-total {
  color: #00202d;
}
</style>