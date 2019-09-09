<template>
  <div class="page order-home">
    <h2 class="order-nav">广告单</h2>
    <div class="order-list-title">
      <p>以下广告单已经过平台审核，接单后需要按照广告单中要求投放的影片在您的影院进行排播</p>
      <p  v-if="cinemaList.length == 1">您当前影院为 {{cinemaList[0].shortName}}</p>
      <p  v-else>您当前共有 {{cinemaTotalCount}} 家影院的广告代理权</p>
    </div>
    <div class="order-content">
      <div class="order-form jyd-form flex-box">
         <DatePicker type="daterange" class="item-list-sel" style="width: 250px"  v-model='putDate'  @on-change="handleChange"  placeholder="开始日期和结束日期" ></DatePicker>
         <Select v-model='form.cinemaId' class="item-list-sel" style="width: 250px" 
          filterable clearable
          remote
          :loading="loading"
          :remote-method="remoteMethod"
          placeholder="影院名称" >
            <Option v-for="item in cinemaList" :key="item.id" :value="item.id" >{{item.shortName}}</Option>
         </Select>
         <Input v-model="videoName" placeholder="广告片名称" style="width: 250px" />
         <Button type="primary" @click="searchList" class="select-btn">搜索广告单</Button>
      </div>

      <Tabs v-model="form.status" > 
        <TabPane :label="orderCount.waiting ? `待接单(${orderCount.waiting})` : '待接单'"  name="1" ></TabPane>
        <TabPane :label="orderCount.unexecute ? `待执行(${orderCount.unexecute})` : '待执行'"  name="2"></TabPane>
        <TabPane :label="orderCount.beexecute ? `执行中(${orderCount.beexecute})` : '执行中'"  name="3"></TabPane>
        <!-- <TabPane :label="orderCount.besettlement ? `待结算(${orderCount.besettlement})` : '待结算' "  name="6" ></TabPane> -->
        <TabPane label="已拒绝"  name="4" ></TabPane>
        <TabPane label="已失效"  name="5" ></TabPane>
        <TabPane label="已完成"  name="7" ></TabPane>
        <TabPane label="已关闭"  name="8" ></TabPane>
      </Tabs>
      <!-- v-auth="'adordermanage.order#view'" -->
      <div class="spin-show-parent">
        <div class="demo-spin-article">
          <ul class='itemul' >
            <li v-for='(it,index) in itemlist' :key='index' :class="{advert: it.advertType == 'TRAILER'}">
              <div class="table-header-title  flex-box">
                <p><label>投放排期</label><em>{{formatConversion(it.beginDate)}} ~ {{formatConversion(it.endDate)}}</em></p>
                <p>
                  <Tooltip placement="bottom" max-width="200" class="text-cursor"
                   content="根据影院近60天票房情况预算得出；最终收益以实际投放期间产生的曝光数据计算为准；为保证您的收益，请在投放结束后48小时内向国家电影专资办上报您的影院票房数据">
                    <label>预估广告收益(元)</label>
                    <em class="max-earning">{{formatNumber(it.estimateRevenue)}}</em><Icon type="md-help" />
                  </Tooltip> 
                </p>
              </div>
              <Row class="table-content-list" type="flex" justify="center" align="middle">
                <Col span="14">
                  <div class="flex-box col-order">
                    <p ><label>广告片名称</label><em>{{it.videoName}}</em></p>
                    <p  v-if="it.targetCinemas.length">
                      <label>目标影院</label>
                      <em>{{it.targetCinemas.length}}家</em> 
                      <span class="query-status"  @click="edittarget(it.id, 1)" >查看</span></p>
                    <p v-else><label>目标影院</label><em>{{it.cinemaName}}</em></p>
                  </div>
                  <div class="flex-box col-order">
                    <p><label>广告片规格</label><em>{{it.specification || 0}}s</em></p>
                    <p><label>目标人次</label><em>{{it.estimatePersonCount || 0}}人</em></p>
                  </div>
                  <div class="flex-box col-order">
                    <p ><label>广告位置</label><em>[{{it.deliveryPositionNames}}]</em></p>
                    
                  </div>
                  <div class="target-cinema">
                    <label>目标影片</label>
                    <!-- 当用户的投放模式为通投时，此项数据显示为【所有影片 （?）】 -->
                    <div>
                      <p v-if="it.movieCustom == 1" ><span v-for='item in (it.targetMovies || [])'>《{{item.movieName}}》</span></p>
                      <p v-else>
                        <Tooltip placement="bottom" max-width="200" class="text-cursor" content="“影片不限，请在投放周期内所有影片前安排上刊">
                          所有影片<Icon type="md-help" />
                         </Tooltip>
                      </p>
                    </div>
                  </div>

                </col>
                <Col span="5">
                    <div v-for="item in statusList" :key="item.key" v-if="item.key == it.status" class="statu-col" 
                    :class="{'statu-col-error': item.key == 4 || item.key == 5}">{{item.text}}</div>
                </col>
                <Col span="5" class="text-center">
                <!-- 待审核状态展示 -->
                    <div class="btn-sure-cancel" v-if="it.status == 1">
                      <p><Button type="primary" @click="editReject(it.id)" class="operation-btn">确定接单</Button></p>
                      <p><Button  @click="editRefuse(it)" class="operation-btn result-btn">拒绝接单</Button></p>
                    </div>
                    <div >
                      <Button class="operation-btn  query-detail-btn " :to="{ name: 'order-dispatch-details', params: { id: it.id } }" >查看详情</Button>
                    </div>
                </col>
              </Row>
            </li>
          </ul>
          <Spin fix v-if="spinShow"></Spin>
          <Page :total="totalCount"  v-if="totalCount>0" class="order-page-list" :current="pageIndex"
          :page-size="pageSize"  show-total  show-elevator 
          @on-change="handlepageChange"  @on-page-size-change="handlepageChange" />
        </div>
      </div>
      <ul class='no-order-list' v-if='itemlist.length == 0'> 暂无订单数据</ul>
    </div>

     
    <dlgRejec ref="reject" v-model="rejectVisible" v-if="rejectVisible.visible" @rejReload="orderList"/>
    <targetDlg ref="target" v-if="targetShow" />
    <refuseDlg ref="refuse" v-if="refuseShow"  @refReload="refReload" />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryOrderList, queryCinemaList } from '@/api/norderDis'
import { formatConversion, formatNumber } from '@/util/validateRules.ts'
import { getUser } from '@/store'
import { slice, clean, except } from '@/fn/object'
import { getEnumText } from '@/util/dealData'
import dlgRejec from './dlgReject.vue'
import targetDlg from './targetDlg.vue'
import refuseDlg from './refuseDlg.vue'

@Component({
  components: {
    dlgRejec,
    targetDlg,
    refuseDlg
  }
})
export default class Main extends ViewBase {
  totalCount = 0
  pageIndex = 1 // 页码
  pageSize = 20 // 页数
  putDate = []

  loading = false
  spinShow = false

  form: any = {
    beginDate: null,
    endDate: null,
    cinemaId: null,
    // videoName: null,
    status: '1',
  }
  videoName = null
  // 广告片名称模糊查询
  searchLoading = false

  // 影院名称list
  cinemaList = []
  cinemaTotalCount = null

  // 订单统计
  orderCount: any = {}

  // 状态列表
  statusList: any = []
  planTypeList: any = []
  typeList: any = []
  itemlist: any = []

  targetShow = false
  refuseShow = false

  rejectVisible: any = {
    visible: false
  }

  // 通投
  movieCustomList: any[] = []

  get formatConversion() {
    return formatConversion
  }

  get formatNumber() {
    return formatNumber
  }

  mounted() {
    this.remoteMethod()
    this.orderList()
  }

  async remoteMethod(query?: any) {
    try {
      if (query) {
        this.loading = true
        const { data: {items, totalCount}} = await queryCinemaList({
           pageIndex: 1,
           pageSize: 400,
           query
        })
        this.cinemaList = items || []
      } else {
        this.loading = true
        const { data: {items, totalCount}} = await queryCinemaList({
           pageIndex: 1,
           pageSize: 400,
           query
        })
        this.cinemaTotalCount = totalCount
      }
      this.loading = false
    } catch (ex) {
       this.loading = false
      this.handleError(ex)
    }
  }


  refReload() {
    this.refuseShow = false
    this.orderList()
  }

  async orderList() {
    this.spinShow = true
    try {
      const {
        data: {
          totalCount,
          statusList,
          orderCount,
          items,
          movieCustomList,
          deliveryPositionCodeList
        }
      } = await queryOrderList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.form,
        videoName: this.videoName
      })
      this.spinShow = false
      this.totalCount = totalCount
      // 处理空数组null转化为[]
      this.itemlist = (items || []).map( (item: any) => {
        return {
          ...item,
          targetCinemas: item.targetCinemas || [],
          targetMovies: item.targetMovies || [],
          deliveryPositionNames: getEnumText(deliveryPositionCodeList, item.deliveryPositionCode) || '---'
        }
      })
      // 处理订单统计
      this.orderCount = orderCount || {}
      this.statusList = statusList
      this.movieCustomList = movieCustomList || []
    } catch (ex) {
      this.spinShow = false
      this.handleError(ex)
    }
  }

  // 确定接单
  editReject(id: any) {
    this.rejectVisible = {
      visible: true,
      id
    }
  }
  // 拒绝接单
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
     this.pageIndex = 1
     this.form.beginDate = !!data[0] ? formatConversion(data[0], 2) : null
     this.form.endDate = !!data[1] ?  formatConversion(data[1], 2) : null
   }

  handlepageChange(size: any) {
    this.pageIndex = size
    this.orderList()
  }

  searchList() {
    this.pageIndex = 1
    this.orderList()
  }

  @Watch('form', {deep: true})
  watchQuery() {
    this.pageIndex = 1
    this.orderList()
  }
}
</script>

<style lang="less" scoped>
@import '~@/views/kol/less/common.less';

/deep/ .ivu-icon-md-help::before {
  position: relative;
  top: -2px;
}
.text-cursor {
  cursor: pointer;
}
.spin-show-parent {
  position: relative;
}
.item-list-sel {
  width: 288px;
  margin-right: 20px;
}
.order-home {
  padding: 30px 50px 50px;
  .order-list-title {
    background: #00202d;
    padding: 35px 30px 25px;
    color: #fff;
    font-size: 15px;
    border-radius: 8px 8px 0 0;
    p {
      padding-bottom: 8px;
    }
  }
}
.order-content {
  .order-form {
    margin: 30px auto 30px;
  }
  .no-order-list {
    margin-top: 40px;
    text-align: center;
    font-size: 15px;
    color: #fff;
  }
  .operation-btn {
    width: 105px;
    height: 28px;
    line-height: 16px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    background: #00202d;
    border-radius: 14px;
    border: 0;
    margin-bottom: 20px;
  }
  .result-btn {
    background: #fff;
    border: solid 1px #00202d;
    color: #00202d;
  }
  .query-detail-btn {
    background: none;
    border: 0;
    font-size: 14px;
    color: #00202d;
  }
  /deep/ .ivu-tabs {
    height: 56px;
    line-height: 56px;
    background: rgba(0, 32, 45, .9);
    color: #fff;
    .ivu-tabs-bar {
      border-bottom: none;
    }
    .ivu-tabs-tab {
      padding: 18px 16px;
    }
    .ivu-tabs-tab-active {
      font-size: 14px;
      color: #4fa6bb;
    }
  }
}
.query-status {
  color: #4fa6bb;
  cursor: pointer;
  padding-left: 10px;
}
.itemul {
  font-size: 14px;
  background: rgba(255, 255, 255, .7);
  li {
    .table-header-title {
      padding: 25px 30px;
      p {
        margin-right: 30px;
        label {
          padding-right: 20px;
        }
      }
      .max-earning {
        color: #da6c70;
      }
    }
    .table-content-list {
      background: #fff;
      padding: 30px 0 40px 30px;
      .target-cinema {
        padding-top: 35px;
        display: flex;
        label {
          display: block;
          min-width: 86px;
        }
      }
      .col-order {
        margin-bottom: 12px;
        p {
          width: 49%;
          display: flex;
          label {
            display: inline-block;
            width: 80px;
            color: rgba(0, 32, 45, .7);
          }
        }
      }
      // .target-cinema {
      //   margin-bottom: 12px;
      //   p {
      //     display: flex;
      //     label {
      //       display: inline-block;
      //       width: 80px;
      //       color: rgba(0, 32, 45, .7);
      //     }
      //   }
      // }
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
    &.advert {
      background: url('~@/assets/icon/prevue.png') no-repeat left top;
      background-size: 35px auto;
    }
  }
}
.order-page-list {
  text-align: center;
  background: rgba(255, 255, 255, .7);
  padding: 35px 0 40px;
}
.select-btn {
  background: rgba(0, 32, 35, 1);
  font-size: 14px;
  border: 0;
  margin-left: 30px;
}
.statu-col {
  color: #5f961f;
}
.statu-col-error {
  color: #e86267;
}
// /deep/ .ivu-tabs-nav {
//   padding: 0;
//   .ivu-tabs-tab {
//     text-align: center;
//   }
// }
// /deep/ .ivu-radio-group-button .ivu-radio-wrapper {
//   margin-left: 12px;
//   transition: all 0s !important;
// }
// /deep/ .ivu-radio-group-button .ivu-radio-wrapper-checked {
//   color: #fff;
//   background: #3b98ff;
//   border-color: #3b98ff;
// }
// /deep/ .ivu-input-search {
//   background: #3b98ff !important;
//   border-color: #3b98ff !important;
// }
// /deep/ .ivu-radio-group-button .ivu-radio-wrapper:last-child {
//   border-radius: 0;
// }
// /deep/ .ivu-radio-group-button .ivu-radio-wrapper:first-child {
//   border-radius: 0;
// }
// /deep/ .ivu-radio-group-button .ivu-radio-wrapper:hover {
//   border-color: #dcdee2;
// }
// /deep/ .ivu-radio-group-button .ivu-radio-wrapper-checked::before {
//   background: #3b98ff;
//   opacity: 1;
// }
// /deep/ .ivu-radio-group-button .ivu-radio-wrapper::before, .ivu-radio-group-button .ivu-radio-wrapper::after {
//   transition: all 0s !important;
// }
</style>
