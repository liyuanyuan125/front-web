<template>
  <div class="page">
    <div class='t-title'>执行单</div>
    <Row class="body">
      <Row>
        <Col :span="24">
          <div class="fince-list">
            <div class='fince-list-big'>
              <!-- <div class="fince-list-acc"><img src="./assets/待执行单.png" alt="" >&nbsp;&nbsp;<span class='accs-big'><numAdd :addNum=nums.unExecuteCount></numAdd></span></div> -->
              <div class="fince-list-acc"><img style='width: 6%;' src="./assets/待执行单.png" alt="" >&nbsp;&nbsp;<span class='accs-big'>{{nums.unExecuteCount}}</span></div>
              <p class="fince-list-sm">待执行单</p>
            </div>
            <div class='fince-list-big'>
              <!-- <div class="fince-list-acc"><img src="./assets/执行中.png" alt="" >&nbsp;&nbsp;<span class='accs-big'><numAdd :addNum=nums.beExecuteCount></numAdd></span></div> -->
              <div class="fince-list-acc"><img style='width: 6%;' src="./assets/执行中.png" alt="" >&nbsp;&nbsp;<span class='accs-big'>{{nums.beExecuteCount}}</span></div>
              <p class="fince-list-sm">执行中</p>
            </div>
            <div class='fince-list-big'>
              <!-- <div class="fince-list-acc"><img src="./assets/已完成单.png" alt="" >&nbsp;&nbsp;<span class='accs-big'><numAdd :addNum=nums.outExecuteCount></numAdd></span></div> -->
              <div class="fince-list-acc"><img style='width: 6%;' src="./assets/已完成单.png" alt="" >&nbsp;&nbsp;<span class='accs-big'>{{nums.outExecuteCount}}</span></div>
              <p class="fince-list-sm">已完成单</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row class='row-ul'>
        <Col :span="12">
          <div class='guanggao'>执行单状态</div>
          <RadioGroup v-model="query.status" type="button" @on-change='seachs'>
            <Radio v-for='it in statusList' :key='it.key' :value='it.key' v-if='it.key!=0 && it.key!=4' :label='it.key'>{{it.text}}</Radio>
          </RadioGroup>
        </Col>
        <Col :span="12">
          <div class='guanggao'>广告单类型</div>
          <Col style='margin-left: 12px;' span="7">
            <Select v-model='query.planType'  clearable placeholder="广告单类型" @on-change="seachs">
              <Option
                v-for="item in planTypeList"
                :key="item.key"
                :value="item.key"
                v-if='item.key!=0'
              >{{item.text}}</Option>
            </Select>
          </Col>
        </Col>
      </Row>

      <Row class='row-ul'>
        <Col :span="12">
          <div class='guanggao'>执行时间&nbsp;&nbsp;</div>
          <Col style='margin-left: 12px;' span="5">
            <Select v-model='query.queryType'  clearable placeholder="广告单时间" @on-change="nulldata">
              <Option
                v-for="item in executeQueryTypeList"
                :key="item.key"
                :value="item.key"
                v-if='item.key!=0'
              >{{item.text}}</Option>
            </Select>
          </Col>
          <Col style='margin-left: 26px;' span="10">
            <DatePicker type="daterange" style="width: 250px" v-model='showTime' @on-change="handleChange"
        placement="bottom-start" placeholder="请选择开始日期和结束日期" ></DatePicker>
          </Col>
        </Col>
        <Col :span="8">
          <!-- <div class='guanggao'>广告单类型</div> -->
          <Col style='margin-left: 12px;' span="20">
            <Input v-model='query.videoName' search enter-button placeholder="请输入执行单ID/广告片名称进行搜索" @on-change="seachs"/>
          </Col>
        </Col>
      </Row>
      <!-- {{itemlist}} -->
      <ul class='itemul' v-auth="'adordermanage.execute#view'">
        <li v-for='(it,index) in itemlist' :key='index'>
          <Row class='li-title'>
            <Col span='8'>下单时间      {{it.createTime}}</Col>
            <Col span='10'>预估最大收益/￥ <span class='ora'>{{it.estimateRevenue}}</span></Col>
            <Col span='6'>
            <router-link
              v-if='it.status == 1 || it.status == 2'
              :to="{ name: 'order-dcp-detail', params: { id: it.id } }"
              v-auth="'adordermanage.execute#download'"
              tag="span"
              class='button'
              style='background: #3B98FF; color: #fff;cursor: pointer;'
            >下载DCP包</router-link>
              <!-- <span class='button' v-if='it.status == 1 || it.status == 2' style='background: #3B98FF; color: #fff;cursor: pointer;'>下载DCP包</span> -->
              <span v-auth="'adordermanage.execute#edit'" class='button' @click="editReject(it.id, it.id, it.cinemas.length)" v-if='it.status == 1' style='background: #3B98FF; color: #fff;cursor: pointer;'>修改执行影院</span>
            </Col>
          </Row>
          <Row class='li-item'>
            <Col span='18'>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>广告片名称</Col>
                <Col span='9' class='row-list-huis'>{{it.videoName}}</Col>
                <Col span='3' class='row-list-hui'>执行影院</Col>
                <Col span='9' class='row-list-huis'>{{it.cinemas.length}}家   <span @click="edittarget(it.id)" style='color: rgba(59,152,255,1); cursor: pointer;'>查看</span></Col>
              </Row>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>广告片规格</Col>
                <Col span='9' class='row-list-huis'>{{it.specification}}s</Col>
                <Col span='3' class='row-list-hui'>执行影厅</Col>
                <Col span='9' class='row-list-huis'>所有影厅</Col>
              </Row>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>执行时间</Col>
                <Col span='9' class='row-list-huis'>{{it.beginDate}} ~ {{it.endDate}}</Col>
                <Col span='3' class='row-list-hui'>执行场次</Col>
                <Col span='9' class='row-list-huis'>{{it.sceneCount}}</Col>
              </Row>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>执行周期</Col>
                <Col span='9' class='row-list-huis'>{{it.cycle}}天</Col>
                <Col span='3' class='row-list-hui'>投放类型</Col>
                <Col span='9' class='row-list-huis'>{{it.directionType == 1 ? '标准投放' : '单片投放'}}</Col>
              </Row>
              <Row class='row-list' style='margin-top:15px;'>
                <Col span='3' class='row-list-hui'>目标影片</Col>
                <Col span='21' class='row-list-huis'><span  v-if='it.movieList.length > 0' v-for='item in it.movieList'>《{{item.name}}》   </span><span v-if='it.movieList.length == 0'>暂无    </span></Col>
              </Row>
            </Col>
            <Col span='6'>
              <Row>
                <Col v-if='it.status == 1' span='12' class='img-order'><img src="./assets/待执行.png" alt=""><span>待执行</span></Col>
                <Col v-if='it.status == 2' span='12' class='img-order'><img src="./assets/执行中-小.png" alt=""><span>执行中</span></Col>
                <Col v-if='it.status == 3' span='12' class='img-order'><img src="./assets/已完成.png" alt=""><span>已完成</span></Col>
                <Col v-if='it.planType == 1' span='12' class='img-order'><img src="./assets/标准单.png" alt=""><span>标准单</span></Col>
                <Col v-if='it.planType == 2' span='12' class='img-order'><img src="./assets/加速单.png" alt=""><span>加速单</span></Col>
                <Col v-if='it.planType == 3' span='12' class='img-order'><img src="./assets/优享单.png" alt=""><span>优享单</span></Col>
              </Row>
              <Row>
                <Progress v-if='it.status == 2' :percent="it.bili" status="active" />
              </Row>
            </Col>
          </Row>
        </li>
      </ul>
      <ul class='itemul' style='padding-left: 28px;text-align: center;' v-if='itemlist.length == 0'> 暂无订单</ul>
      <Page
      :total="totalCount"
      v-if="totalCount>0"
      class="btn-center-footer plan-pages"
      :current="query.pageIndex"
      :page-size="query.pageSize"
      show-total
      show-elevator
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
    </Row>
    <dlgRejec ref="reject" v-if="rejectShow" @rejReload="rejload"/>
    <targetDlg ref="target" v-if="targetShow" />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { nums , querylist  } from '@/api/orderExe'
import { formatTimestamp } from '@/util/validateRules'
import numAdd from '../dispatch/number.vue'
import dlgRejec from '../dispatch/dlgReject.vue'
import targetDlg from '../dispatch/targetDlg.vue'

const timeFormat = 'YYYY-MM-DD'

@Component({
  components: {
    numAdd,
    dlgRejec,
    targetDlg
  }
})
export default class Main extends ViewBase {
  query: any = {
    planType: null,
    videoName: '',
    beginDate: null,
    endDate: null,
    status: 1,
    queryType: 1,
    pageIndex: 1,
    pageSize: 4,
  }
  rejectShow = false
  targetShow = false
  // 统计数据
  nums: any = []
  // 数据列表
  statusList: any = []
  planTypeList: any = []
  executeQueryTypeList: any = []
  itemlist: any = []
  // loading: false

  totalCount = 0

  showTime = []

  rejload() {
    this.seach()
  }

  refload() {
    this.seach()
  }

  mounted() {
    this.seach()
  }

  async seach() {
    // this.loading = true
    try {
      // 数据统计
      const data = await nums()
      this.nums = data.data
      // 数据列表
      if (this.$route.params.id) {
        const datalist1 = await querylist({videoName: this.$route.params.id})
        this.statusList = datalist1.data.statusList
        this.planTypeList = datalist1.data.planTypeList
        this.executeQueryTypeList = datalist1.data.executeQueryTypeList
        this.totalCount = datalist1.data.totalCount
        this.itemlist = (datalist1.data.items || []).map((it: any) => {
          return {
            ...it,
            createTime: moment(it.createTime).format(timeFormat),
            beginDate: moment(it.beginDate).format(timeFormat),
            endDate: moment(it.endDate).format(timeFormat),
            bili: Math.floor(((new Date().getTime() - it.beginDate) /
            ((it.endDate + (24 * 60 * 60 * 1000 - 1)) - it.beginDate)) * 100)
          }
        })
      } else {
        const datalist = await querylist(this.query)
        this.statusList = datalist.data.statusList
        this.planTypeList = datalist.data.planTypeList
        this.executeQueryTypeList = datalist.data.executeQueryTypeList
        this.totalCount = datalist.data.totalCount
        this.itemlist = (datalist.data.items || []).map((it: any) => {
          return {
            ...it,
            createTime: moment(it.createTime).format(timeFormat),
            beginDate: moment(it.beginDate).format(timeFormat),
            endDate: moment(it.endDate).format(timeFormat),
            bili: Math.floor(((new Date().getTime() - it.beginDate) /
            ((it.endDate + (24 * 60 * 60 * 1000 - 1)) - it.beginDate)) * 100)
          }
        })
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
      // this.loading = false
    }
  }

  editReject(id: any, planId: any, length: any) {
    this.rejectShow = true
    this.$nextTick(() => {
      (this.$refs.reject as any).init(id, planId, length, 2)
    })
  }

  seachs() {
    this.query.pageIndex = 1
    this.seach()
  }

  edittarget(id: any) {
    this.targetShow = true
    this.$nextTick(() => {
      (this.$refs.target as any).init(id, 2)
    })
  }

  nulldata() {
    this.showTime = []
  }

  handleChange(data: any) {
     this.showTime = data
     this.query.beginDate = Number(formatTimestamp(this.showTime[0])) - 8 * 60 * 60 * 1000
     this.query.endDate = Number(formatTimestamp(this.showTime[1])) + 16 * 60 * 60 * 1000 - 1
     this.seach()
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
.t-title {
  width: 100%;
  height: 50px;
  background: rgba(249, 249, 249, 1);
  border-radius: 2px 2px 0 0;
  line-height: 50px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(36, 129, 215, 1);
  padding-left: 30px;
}
.body {
  background: #fff;
  padding: 16px 0 40px;
}
.fince-list {
  .fince-list-big {
    width: 32%;
    display: inline-block;
    height: 130px;
    background: rgba(242, 242, 242, 1);
    border-radius: 2px;
    margin-left: 1%;
    margin-bottom: 12px;
    border-top: 10px solid #f2f2f2;
    .fince-list-acc {
      width: 100%;
      font-size: 22px;
      font-weight: 400;
      color: #222;
      line-height: 22px;
      text-align: center;
      padding-top: 37px;
      .accs-big {
        font-size: 36px;
      }
    }
    .fince-list-sm {
      width: 100%;
      height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(136, 136, 136, 1);
      line-height: 14px;
      text-align: center;
      margin-top: 20px;
    }
    .fin-bigs {
      height: 49%;
      background: rgba(242, 242, 242, 1);
      border-radius: 2px;
      text-align: center;
      line-height: 60px;
      .accs-sma {
        font-size: 30px;
      }
      .smas2 {
        height: 12px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        line-height: 14px;
        margin-left: 5px;
      }
    }
  }
}
.row-ul {
  padding: 16px 16px 0 16px;
  .guanggao {
    width: 15%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    float: left;
  }
  .uls {
    width: 85%;
    float: left;
    li {
      width: 12%;
      height: 30px;
      border: 1px solid #ccc;
      text-align: center;
      float: left;
      line-height: 30px;
      margin-left: 12px;
    }
  }
}
.itemul {
  padding: 16px;
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
    .img-order {
      img {
        width: 10%;
      }
      line-height: 110px;
      span {
        margin-left: 10px;
        font-size: 14px;
      }
    }
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
