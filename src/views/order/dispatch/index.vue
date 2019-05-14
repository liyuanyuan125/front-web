<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">广告单</h2>
    <div class="order-list-title">以下广告单已经过平台审核，接单后需要按照广告单中要求投放的影片在您的影院进行排播；结算方式[CPM（按曝光人次计费）]
您当前影院为 <span v-if="cinemaList.length == 1">{{cinemaList.text}}</span><span>您当前共有 {{cinemaList.length}} 家影院的广告代理权</span>
     </div>
    <div class="order-content">
      <Form :model="form" :label-width="90" class=" edit-input order-form">
        <Row>
          <!-- <Col :span="5">
            <FormItem label="广告单时间">
              <Select v-model='form.advTime'  clearable placeholder="请输入广告时间" 
               @on-change="" >
                  <Option
                    v-for="item in adverListTime"
                    :key="item.key"
                    :value="item.key"
                  >{{item.text}}</Option>
                </Select>
            </FormItem>
          </Col> -->

          <Col :span="7">
            <FormItem label="投放日期">
              <DatePicker type="daterange"  v-model='putDate'  @on-change="handleChange" 
              placeholder="开始日期和结束日期" ></DatePicker>
            </FormItem>
          </Col>

           <Col :span="6" v-if="cinemaList.length > 1">
            <FormItem label="影院名称">
              <Select v-model='form.CinemaId' filterable  clearable placeholder="影院名称" @on-change="() => pageIndex = 1">
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
              <Select v-model='form.videoId' filterable  clearable placeholder="广告片名称" >
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
          <div class="table-header-title flex-box">
            <p><label>投放排期：</label><em>{{it.beginDate}} ~ {{it.endDate}}</em></p>
            <p><label>预估最大收益/(元)：</label><em>{{it.estimateRevenue}}</em></p>
          </div>
          <Row class="table-content-list" type="flex" justify="center" align="middle">
            <Col span="14">
              <div class="flex-box col-order">
                <p><label>广告片名称：</label><em>{{it.videoName}}</em></p>
                <p v-if="it.cinemaCount > 1"><label>目标影院：</label><em>{{it.cinemaCount}}</em> <span class="query-status"  @click="edittarget(it.executeOrderId, 1)" >查看</span></p>
                <p v-else><label>目标影院：</label><em>影厅名字</em></p>
              </div>
              <div class="flex-box col-order">
                <p><label>广告片规格：</label><em>{{it.specification}}s</em></p>
                <p><label>目标影院：</label><em>{{it.targetCinema || '暂无'}}</em></p>
              </div>
              <div class="flex-box col-order">
                <p><label>投放周期：</label><em>{{it.cycle}}天</em></p>
                <p><label>目标场次：</label><em>{{it.targetSession || '暂无'}}</em></p>
              </div>
              <div><p><label>目标影片：</label><span  v-if='it.movieList.length > 0' v-for='item in it.movieList'>《{{item.name}}》</span><span v-if='it.movieList.length == 0'>暂无    </span></p></div>
            </col>
            <Col span="5"><div v-for="item in tabPane" v-if="item.key == it.status">{{item.text}}</div></col>
            <Col span="5">
               <div v-if="it.status == 1" class="btn-sure-cancel">
                  <p><Button type="primary" @click="editReject(it.id, it.id, it.cinemaCount)" class="operation-btn button-ok ">确定接单</Button></p>
                  <p><Button type="primary" @click="editRefuse(it)" class="operation-btn button-ok ">拒绝接单</Button></p>
                </div>
                <div>
                   <Button  class="operation-btn button-ok " :to="{ name: 'order-dispatch-details', params: { id: 1 } }" >查看详情</Button>
                </div>
            </col>
          </Row>
        </li>
      </ul>
      <ul class='itemul no-order-list' v-if='itemlist.length == 0'> 暂无订单数据</ul>
    </div>

     <Page :total="totalCount"  v-if="totalCount>0" class="btnCenter" :current="pageIndex"
      :page-size="pageSize"  show-total  show-elevator 
       @on-change="handlepageChange"  @on-page-size-change="handlepageChange" />

    <dlgRejec ref="reject" v-if="rejectShow" @rejReload="seach"/>
    <targetDlg ref="target" v-if="targetShow" />
    <refuseDlg ref="refuse" v-if="refuseShow"  @refReload="seach" />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { nums , querylist, queryOrderList } from '@/api/orderDis'
import { formatTimestamp } from '@/util/validateRules'
// import numAdd from './number.vue'
import dlgRejec from './dlgReject.vue'
import targetDlg from './targetDlg.vue'
import refuseDlg from './refuseDlg.vue'

const timeFormat = 'YYYY-MM-DD'

@Component({
  components: {
    // numAdd,
    dlgRejec,
    targetDlg,
    refuseDlg
  }
})
export default class Main extends ViewBase {
  totalCount = 0
  pageIndex = 1 // 页码
  pageSize = 1 // 页数

  form: any = {
    beginDate: null,
    endDate: null,
    CinemaId: null,
    videoId: null, // 广告片id
    status: 1,
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
  // adverListTime = [
  //   { key: 0, text: '下单时间'},
  //   { key: 1, text: '投放开始时间'},
  //   { key: 2, text: '投放结束时间'},
  // ]

  // 广告片名称
  advlistName = [
    { key: 0, text: '广告1'},
    { key: 1, text: '广告2'},
    { key: 2, text: '广告3'},
  ]

  // tabs
  tabPane = [
    {key: 1, text: '待接单', total: null},
    {key: 2, text: '已接单', total: null},
    {key: 3, text: '已拒绝', total: null},
    {key: 4, text: '已失效', total: null},
    {key: 5, text: '待结算', total: null},
    {key: 6, text: '已完成', total: null},
  ]

  statusList: any = []
  planTypeList: any = []
  typeList: any = []
  itemlist: any = []
  // loading: false
  rejectShow = false
  targetShow = false
  refuseShow = false

  showTime = []

  mounted() {
    this.seach()
    // this.orderList()
  }

  async orderList() {
    try {
      const dataList = await queryOrderList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.form
      })
    } catch (ex) {
       this.handleError(ex)
    }
  }

  handleTabs(id: number) {
    this.form.status = id + 1
  }

  async seach() {
    try {

      const datalist = await querylist({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.form
      })
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
     this.pageIndex = 1
     const a = Number(formatTimestamp(data[0])) - 8 * 60 * 60 * 1000
     const b =  Number(formatTimestamp(data[1])) + 16 * 60 * 60 * 1000 - 1
     !!data[0] ? this.form.beginDate = a : this.form.beginDate = null
     !!data[0] ? this.form.endDate = b : this.form.endDate = null
   }

  handlepageChange(size: any) {
    this.pageIndex = size
    this.seach()
  }

  @Watch('form', {deep: true})
  watchQuery() {
    this.pageIndex = 1
    this.seach()
  }
}
</script>

<style lang="less" scoped>
.btnCenter {
  margin-bottom: 30px;
}
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
.itemul {
  li {
    border: 1px solid rgba(211, 231, 248, 1);
    margin-top: 15px;
    .table-header-title {
      padding: 16px 20px;
      background: #f2f2f2;
      p {
        margin-right: 50px;
      }
    }
    .table-content-list {
      padding: 20px 20px 30px;
      .col-order {
        margin-bottom: 15px;
        p {
          width: 49%;
        }
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
/deep/ .ivu-tabs-nav {
  width: 93%;
  padding: 0;
  .ivu-tabs-tab {
    margin-right: 16px;
    width: 16.66%;
    text-align: center;
    padding: 10px 0;
  }
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
