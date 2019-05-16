<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">广告单</h2>
    <div class="order-list-title">以下广告单已经过平台审核，接单后需要按照广告单中要求投放的影片在您的影院进行排播；结算方式[CPM（按曝光人次计费）]
<span v-if="cinemaList.length == 1">您当前影院为 {{cinemaList[0].shortName}}</span>
<span v-else>您当前共有 {{cinemaTotalCount}} 家影院的广告代理权</span>
     </div>
    <div class="order-content">
      <Form :model="form" :label-width="90" class=" edit-input order-form">
        <Row>
          <Col :span="7">
            <FormItem label="投放日期">
              <DatePicker type="daterange"  v-model='putDate'  @on-change="handleChange" 
              placeholder="开始日期和结束日期" ></DatePicker>
            </FormItem>
          </Col>

           <Col :span="7">
            <FormItem label="影院名称">
              <Select v-model='form.CinemaId' filterable clearable placeholder="影院名称">
                  <Option
                    v-for="item in cinemaList"
                    :key="item.id"
                    :value="item.id"
                  >{{item.shortName}}</Option>
                </Select>
            </FormItem>
          </Col>
          
          <Col :span="7">
            <FormItem label="广告片名称">
              <Select v-model='form.videoId' filterable  clearable placeholder="广告片名称" >
                  <Option
                    v-for="item in advlistName"
                    :key="item.videoId"
                    :value="item.videoId"
                  >{{item.videoName}}</Option>
                </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Tabs @on-click="handleTabs">
        <TabPane v-for="tab in statusList" :key="tab.key" v-if="tab.key != 0 && tab.key != 8" 
        :label="handleJoin(tab)"></TabPane>
      </Tabs>

      <ul class='itemul' v-auth="'adordermanage.order#view'">
        <li v-for='(it,index) in itemlist' :key='index'>
          <div class="table-header-title flex-box">
            <p><label>投放排期：</label><em>{{formatConversion(it.beginDate)}} ~ {{formatConversion(it.endDate)}}</em></p>
            <p><label>预估最大收益/(元)：</label><em>{{it.estimateRevenue}}</em></p>
          </div>
          <Row class="table-content-list" type="flex" justify="center" align="middle">
            <Col span="14">
              <div class="flex-box col-order">
                <p><label>广告片名称：</label><em>{{it.videoName}}</em></p>
                <p v-if="it.targetCinemas.length">
                  <label>目标影院：</label>
                  <em>{{it.targetCinemas.length}}家</em> 
                  <span class="query-status"  @click="edittarget(it.id, 1)" >查看</span></p>
                <p v-else><label>目标影院：</label><em>{{it.cinemaName}}</em></p>
              </div>
              <div class="flex-box col-order">
                <p><label>广告片规格：</label><em>{{it.specification || 0}}s</em></p>
                <p><label>目标影厅：</label><em>{{it.hallsCount || '暂无'}}</em></p>
              </div>
              <div class="flex-box col-order">
                <p><label>投放周期：</label><em>{{it.cycle || 0}}天</em></p>
                <p><label>目标场次：</label><em>{{it.targetSession || '暂无'}}</em></p>
              </div>
              <div><p><label>目标影片：</label><span  v-if='it.targetMovies.length > 0' 
                v-for='item in it.targetMovies'>《{{item.movieName}}》</span><span v-if='it.targetMovies.length == 0'>暂无    </span></p></div>
            </col>
            <Col span="5"><div v-for="item in statusList" v-if="item.key == it.status">{{item.text}}</div></col>
            <Col span="5">
               <div  class="btn-sure-cancel">
                  <p><Button type="primary" @click="editReject(it.id)" class="operation-btn button-ok ">确定接单</Button></p>
                  <p><Button type="primary" @click="editRefuse(it)" class="operation-btn button-ok ">拒绝接单</Button></p>
                </div>
                <div >
                   <Button type="primary" class="operation-btn button-ok " :to="{ name: 'order-dispatch-details', params: { id: it.id } }" >查看详情</Button>
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

    <dlgRejec ref="reject" v-model="rejectVisible" v-if="rejectVisible.visible" @rejReload="orderList"/>
    <targetDlg ref="target" v-if="targetShow" />
    <refuseDlg ref="refuse" v-if="refuseShow"  @refReload="orderList" />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryOrderList, queryCinemaList, queryVideoName } from '@/api/norderDis'
import { formatConversion } from '@/util/validateRules.ts'
import { getUser } from '@/store'
import dlgRejec from './dlgReject.vue'
import targetDlg from './targetDlg.vue'
import refuseDlg from './refuseDlg.vue'

// const timeFormat = 'YYYY-MM-DD'

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
  pageSize = 20 // 页数
  putDate = []

  form: any = {
    beginDate: null,
    endDate: null,
    CinemaId: null,
    videoId: null, // 广告片id
    status: 1,
  }

  // 影院名称list
  cinemaList = []
  cinemaTotalCount = null

  // 广告片名称
  advlistName = []

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

  get formatConversion() {
    return formatConversion
  }

  mounted() {
    this.queryCinemaList()
    // this.queryVideoName()
    this.orderList()
  }

  handleJoin(tab: any) {
    if ('num' in tab) {
      return `${tab.text}(${tab.num})`
    } else {
      return tab.text
    }
  }
  async queryCinemaList() {
    try {
      const companyId = getUser() && getUser()!.companyId
      const {
        data: {items, totalCount}
      } = await queryCinemaList({
        pageIndex: 1,
        pageSize: 5,
        companyId
      })
      this.cinemaList = items || []
      this.cinemaTotalCount = totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async queryVideoName() {
    try {
      const {
        data: {items} } = await queryVideoName({})
      this.advlistName = items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async orderList() {
    try {
      const dataList = await queryOrderList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.form
      })
      this.totalCount = dataList.data.totalCount
      // 处理空数组null转化为[]
      this.itemlist = (dataList.data.items || []).map( (item: any) => {
        return {
          ...item,
          targetCinemas: item.targetCinemas || [],
          targetMovies: item.targetMovies || []
        }
      })
      // 处理订单统计
      const orderCount = dataList.data.orderCount
      dataList.data.statusList.map( (item: any) => {
        if (item.text == '待接单') {
          item.num = orderCount.waiting
        } else if (item.text == '待执行') {
          item.num = orderCount.unexecute
        } else if (item.text == '执行中') {
          item.num = orderCount.beexecute
        } else if (item.text == '待结算') {
          item.num = orderCount.besettlement
        }
      })
      this.statusList = dataList.data.statusList
    } catch (ex) {
       this.handleError(ex)
    }
  }

  handleTabs(id: number) {
    this.form.status = id + 1
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

  @Watch('form', {deep: true})
  watchQuery() {
    this.pageIndex = 1
    this.orderList()
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
    margin-top: 40px;
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
    width: 14.2%;
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
