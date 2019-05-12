<template>
  <div class="page">
    <h2 class="layout-nav-title">广告单</h2>
    <div class="order-list-title">以下广告单已经过平台审核，接单后需要按照广告单中要求投放的影片在您的影院进行排播；结算方式[CPM（按曝光人次计费）]
您当前影院为 <span v-if="cinemaList.length == 1">{{cinemaList.text}}</span><span>您当前共有 {{cinemaList.length}} 家影院的广告代理权</span>
     </div>
    <div class="order-content">
      <Form :model="form" :label-width="90" class=" edit-input order-form">
        <Row>
          <Col :span="5">
            <FormItem label="广告单时间">
              <Select v-model='form.advTime'  clearable placeholder="请输入广告时间" 
               @on-clear=""  @on-change="" @on-query-change="">
                  <Option
                    v-for="item in adverListTime"
                    :key="item.key"
                    :value="item.key"
                  >{{item.text}}</Option>
                </Select>
            </FormItem>
          </Col>

          <Col :span="7">
            <FormItem label="投放日期">
              <DatePicker type="daterange"  v-model='putDate'  @on-change="handleChange"
               placeholder="开始日期和结束日期" ></DatePicker>
            </FormItem>
          </Col>

           <Col :span="6" v-if="cinemaList.length > 1">
            <FormItem label="影院名称">
              <Select v-model='form.cinema' filterable  clearable placeholder="影院名称" @on-change="">
                  <Option
                    v-for="item in cinemaList"
                    :key="item.key"
                    :value="item.key"
                  >{{item.text}}</Option>
                </Select>
            </FormItem>
          </Col>
          
          <Col :span="6">
            <FormItem label="广告片名称">
              <Select v-model='form.advFilmName' filterable  clearable placeholder="广告片名称" @on-change="">
                  <Option
                    v-for="item in advlistName"
                    :key="item.key"
                    :value="item.key"
                  >{{item.text}}</Option>
                </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Tabs @on-click="handleTabs">
        <TabPane v-for="tab in tabPane" :key="tab.key" :label="tab.text + '('+tab.key+')'"></TabPane>
      </Tabs>

      <ul class='itemul' v-auth="'adordermanage.order#view'">
        <li v-for='(it,index) in itemlist' :key='index'>
           <Row class='li-title'>
            <Col span='8'>投放排期:{{it.beginDate}} ~ {{it.endDate}}</Col>
            <Col span='10'>预估最大收益/(元) <span class='ora'>{{it.estimateRevenue}}</span></Col>
          </Row>

          <Row class='li-item'>
            <Col span='15'>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>广告片名称</Col>
                <Col span='9' class='row-list-huis'>{{it.videoName}}</Col>
                <Col span='3' class='row-list-hui'>目标影院</Col>
                <Col span='9' class='row-list-huis'>{{it.cinemaCount}}家   
                  <span class="query-status"  @click="edittarget(it.executeOrderId, 1)" >查看</span>
                </Col>
              </Row>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>广告片规格</Col>
                <Col span='9' class='row-list-huis'>{{it.specification}}s</Col>
                <Col span='3' class='row-list-hui'>目标影厅</Col>
                <Col span='9' class='row-list-huis'></Col>
              </Row>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>投放周期</Col>
                <Col span='9' class='row-list-huis'>{{it.cycle}}天</Col>
                <Col span='3' class='row-list-hui'>目标场次</Col>
                <Col span='9' class='row-list-huis'></Col>
              </Row>
              <Row class='row-list' >
                <Col span='3' class='row-list-hui'>目标影片</Col>
                <Col span='21' class='row-list-huis'><span  v-if='it.movieList.length > 0' v-for='item in it.movieList'>《{{item.name}}》   </span><span v-if='it.movieList.length == 0'>暂无    </span></Col>
              </Row>
            </Col>
            <Col span='9'>
              <Row>
                <Col span='12' class='img-order'><span v-for="item in tabPane" v-if="item.key == it.status">{{item.text}}</span></Col>
                <Col span='12' class='img-order'>
                 <div v-if="it.status == 1" class="btn-sure-cancel">
                   <p><Button type="primary" class="operation-btn button-ok ">确定接单</Button></p>
                   <p><Button type="primary" class="operation-btn button-ok ">拒绝接单</Button></p>
                 </div>
                 <div v-else class="btn-query-default">
                   <Button type="primary"  class="operation-btn button-ok ">查看详情</Button>
                 </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </li>
      </ul>
      <ul class='itemul no-order-list' v-if='itemlist.length == 0'> 暂无订单数据</ul>
      <Page
      :total="totalCount"
      v-if="totalCount>0"
      class="btnCenter plan-pages"
      :current="query.pageIndex"
      :page-size="query.pageSize"
      show-total
      show-elevator
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
    </div>
    <dlgRejec ref="reject" v-if="rejectShow" @rejReload="rejload"/>
    <targetDlg ref="target" v-if="targetShow" />
    <refuseDlg ref="refuse" v-if="refuseShow"  @refReload="refload" />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { nums , querylist } from '@/api/orderDis'
import { formatTimestamp } from '@/util/validateRules'
import numAdd from './number.vue'
import dlgRejec from './dlgReject.vue'
import targetDlg from './targetDlg.vue'
import refuseDlg from './refuseDlg.vue'

const timeFormat = 'YYYY-MM-DD'

@Component({
  components: {
    numAdd,
    dlgRejec,
    targetDlg,
    refuseDlg
  }
})
export default class Main extends ViewBase {

  form: any = {
    advTime: 0,
    beginDate: null,
    endDate: null,
    cinemaName: null,
    advFilmName: null
  }
  putDate = []

  // 影院名称
  cinemaList = [
    { key: 0, text: '影院1'},
    { key: 1, text: 'ad2'},
    { key: 2, text: 'mxmx3'},
    { key: 3, text: 'addd4'},
  ]

  // 广告单时间
  adverListTime = [
    { key: 0, text: '下单时间'},
    { key: 1, text: '投放开始时间'},
    { key: 2, text: '投放结束时间'},
  ]

  // 广告片名称
  advlistName = [
    { key: 0, text: '广告1'},
    { key: 1, text: '广告2'},
    { key: 2, text: '广告3'},
  ]

  // tabs
  tabPane = [
    {key: 1, text: '待接单'},
    {key: 2, text: '已接单'},
    {key: 3, text: '已拒绝'},
    {key: 4, text: '已失效'},
    {key: 5, text: '待结算'},
    {key: 6, text: '已完成'},
  ]

  query: any = {
    planType: null,
    videoName: '',
    beginDate: null,
    endDate: null,
    status: 1,
    type: 1,
    pageIndex: 1,
    pageSize: 4,
  }
  // 统计数据
  nums: any = []
  // 数据列表
  statusList: any = []
  planTypeList: any = []
  typeList: any = []
  itemlist: any = []
  // loading: false
  rejectShow = false
  targetShow = false
  refuseShow = false
  totalCount = 0

  showTime = []


  mounted() {
    this.seach()
  }

  handleTabs(name: number) {
  }

  rejload() {
    this.seach()
  }

  refload() {
    this.seach()
  }

  seachs() {
    this.query.pageIndex = 1
    this.seach()
  }

  async seach() {
    // this.loading = true
    try {
      // 数据统计
      const data = await nums()
      this.nums = data.data
      // 数据列表
      const datalist = await querylist(this.query)
      this.statusList = datalist.data.statusList
      this.planTypeList = datalist.data.planTypeList
      this.typeList = datalist.data.typeList
      this.totalCount = datalist.data.totalCount
      this.itemlist = (datalist.data.items || []).map((it: any) => {
        return {
          ...it,
          createTime: moment(it.createTime).format(timeFormat),
          beginDate: moment(it.beginDate).format(timeFormat),
          endDate: moment(it.endDate).format(timeFormat)
        }
      })
    } catch (ex) {
      this.handleError(ex)
    } finally {
      // this.loading = false
    }
  }

  editReject(id: any, planId: any, length: any) {
    this.rejectShow = true
    this.$nextTick(() => {
      (this.$refs.reject as any).init(id, planId, length, 1)
    })
  }

  editRefuse(id: any) {
    this.refuseShow = true
    this.$nextTick(() => {
      (this.$refs.refuse as any).init(id)
    })
  }

  edittarget(id: any, type: any) {
    this.targetShow = true
    this.$nextTick(() => {
      (this.$refs.target as any).init(id, type)
    })
  }

  handleChange(data: any) {
     this.putDate = data
     this.form.beginDate = Number(formatTimestamp(this.showTime[0])) - 8 * 60 * 60 * 1000
     this.form.endDate = Number(formatTimestamp(this.showTime[1])) + 16 * 60 * 60 * 1000 - 1
     this.seachs()
   }

  handlepageChange(size: any) {
    this.query.pageIndex = size
    this.seach()
  }
  handlePageSize(size: any) {
    this.query.pageIndex = size
    this.seach()
  }
}
</script>

<style lang="less" scoped>
.order-list-title {
  padding: 15px 20px;
  line-height: 23px;
  background: #fff;
  margin-bottom: 15px;
}
.order-form {
  .ivu-form-item {
    margin-right: 20px;
  }
  /deep/ .ivu-date-picker {
    width: 100%;
    .ivu-input-wrapper {
      width: 100%;
    }
  }
  /deep/ .ivu-select-selection {
    width: auto;
  }
}
.order-content {
  background: #fff;
  padding: 20px 20px 40px;
  .no-order-list {
    text-align: center;
  }
  .operation-btn {
    padding: 0;
    width: 80px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    margin-bottom: 10px;
  }
}
.query-status {
  color: #0f4d96;
  cursor: pointer;
  padding-left: 10px;
}

// .fince-list {
//   .fince-list-big {
//     width: 32%;
//     display: inline-block;
//     height: 130px;
//     background: rgba(242, 242, 242, 1);
//     border-radius: 2px;
//     margin-left: 1%;
//     margin-bottom: 12px;
//     border-top: 10px solid #f2f2f2;
//     .fince-list-acc {
//       width: 100%;
//       font-size: 22px;
//       font-weight: 400;
//       color: #222;
//       line-height: 22px;
//       text-align: center;
//       padding-top: 37px;
//       .accs-big {
//         font-size: 36px;
//       }
//     }
//     .fince-list-sm {
//       width: 100%;
//       height: 14px;
//       font-size: 14px;
//       font-weight: 400;
//       color: rgba(136, 136, 136, 1);
//       line-height: 14px;
//       text-align: center;
//       margin-top: 20px;
//     }
//     .fin-bigs {
//       height: 49%;
//       background: rgba(242, 242, 242, 1);
//       border-radius: 2px;
//       text-align: center;
//       line-height: 77px;
//       .accs-sma {
//         font-size: 30px;
//       }
//       .smas2 {
//         height: 12px;
//         font-size: 12px;
//         font-weight: 400;
//         color: rgba(136, 136, 136, 1);
//         line-height: 14px;
//         margin-left: 5px;
//       }
//     }
//   }
// }
// .row-ul {
//   padding: 16px 16px 0 16px;
//   .guanggao {
//     width: 15%;
//     height: 40px;
//     line-height: 30px;
//     font-size: 14px;
//     text-align: center;
//     float: left;
//   }
//   .uls {
//     width: 85%;
//     float: left;
//     li {
//       width: 12%;
//       height: 40px;
//       border: 1px solid #ccc;
//       text-align: center;
//       float: left;
//       line-height: 40px;
//       margin-left: 12px;
//     }
//   }
// }
.itemul {
  li {
    border: 1px solid rgba(211, 231, 248, 1);
    margin-top: 15px;
    .li-title {
      padding: 0 10px 0 10px;
      height: 50px;
      background: #f2f2f2;
      line-height: 50px;
      .ora {
        font-size: 20px;
        color: rgba(254, 129, 53, 1);
      }
      .button {
        display: block;
        float: right;
        border: 1px solid rgba(59, 152, 255, 1);
        width: 100px;
        height: 40px;
        margin-top: 5px;
        margin-left: 10px;
        text-align: center;
        line-height: 40px;
      }
    }
    .li-item {
      padding: 0 10px 0 10px;
      .row-list {
        line-height: 30px;
        .row-list-hui {
          color: rgba(136, 136, 136, 1);
        }
        .row-list-huis {
          color: rgba(68, 68, 68, 1);
        }
      }
    }
  }
}
/deep/ .ivu-tabs-nav .ivu-tabs-tab {
  padding: 9px 45px;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper {
  margin-left: 12px;
  transition: all 0s !important;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper-checked {
  color: #fff;
  background: #3b98ff;
  border-color: #3b98ff;
}
/deep/ .ivu-input-search {
  background: #3b98ff !important;
  border-color: #3b98ff !important;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper:last-child {
  border-radius: 0;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper:first-child {
  border-radius: 0;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper:hover {
  border-color: #dcdee2;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper-checked::before {
  background: #3b98ff;
  opacity: 1;
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper::before, .ivu-radio-group-button .ivu-radio-wrapper::after {
  transition: all 0s !important;
}
</style>
