<template>
  <div class="page">
    <div class='t-title'>广告单</div>
    <Row class="body">
      <Row>
        <Col :span="24">
          <div class="fince-list">
            <div class='fince-list-big'>
              <!-- <div class="fince-list-acc"><img src="./assets/待接单icon.png" alt="" >&nbsp;&nbsp;<span class='accs-big'><numAdd :addNum=nums.waiting></numAdd></span></div> -->
              <div class="fince-list-acc"><img style='width: 6%;' src="./assets/待接单icon.png" alt="" >&nbsp;&nbsp;<span class='accs-big'>{{nums.waiting}}</span></div>
              <p class="fince-list-sm">待接单数</p>
            </div>
            <div class='fince-list-big'>
              <!-- <div class="fince-list-acc"><img src="./assets/已接单icon.png" alt="" >&nbsp;&nbsp;<span class='accs-big'><numAdd :addNum=nums.received></numAdd></span></div> -->
              <div class="fince-list-acc"><img style='width: 7%;' src="./assets/已接单icon.png" alt="" >&nbsp;&nbsp;<span class='accs-big'>{{nums.received}}</span></div>
              <p class="fince-list-sm">已接单数</p>
            </div>
            <div class='fince-list-big' style='background: #fff; border-top: 10px solid #fff;'>
              <!-- <div class='fin-bigs'><img src="./assets/已拒绝单数.png" alt="" >&nbsp;&nbsp;<span class='accs-sma'><numAdd :addNum=nums.refuse></numAdd></span><span class='smas2'>已拒绝单数</span></div>
              <div class='fin-bigs' style='margin-top: 10px;'><img src="./assets/已失效单数.png" alt="" >&nbsp;&nbsp;<span class='accs-sma'><numAdd :addNum=nums.faliure></numAdd></span><span class='smas2'>已失效单数</span></div> -->
              <div class='fin-bigs'><img style='width: 7%;' src="./assets/已拒绝单数.png" alt="" >&nbsp;&nbsp;<span class='accs-sma'>{{nums.refuse}}</span><span class='smas2'>已拒绝单数</span></div>
              <div class='fin-bigs' style='margin-top: 10px;'><img style='width: 7%;' src="./assets/已失效单数.png" alt="" >&nbsp;&nbsp;<span class='accs-sma'>{{nums.faliure}}</span><span class='smas2'>已失效单数</span></div>
            </div>
          </div>
        </Col>
      </Row>
      <Row class='row-ul'>
        <Col :span="12">
          <div class='guanggao'>广告单状态</div>
          <RadioGroup v-model="query.status" type="button" @on-change='seachs'>
            <Radio v-for='it in statusList' :key='it.key' :value='it.key' v-if='it.key!=0' :label='it.key'>{{it.text}}</Radio>
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
          <div class='guanggao'>广告单时间</div>
          <Col style='margin-left: 12px;' span="5">
            <Select v-model='query.type'  clearable placeholder="广告单时间" @on-change="nulldata">
              <Option
                v-for="item in typeList"
                :key="item.key"
                :value="item.key"
                v-if='item.key!=0'
              >{{item.text}}</Option>
            </Select>
          </Col>
          <Col style='margin-left: 26px;' span="10">
            <DatePicker type="daterange" style="width: 300px" v-model='showTime' @on-change="handleChange"
        placement="bottom-start" placeholder="请选择开始日期和结束日期" ></DatePicker>
          </Col>
        </Col>
        <Col :span="8">
          <!-- <div class='guanggao'>广告单类型</div> -->
          <Col style='margin-left: 12px;' span="20">
            <Input v-model='query.videoName' search enter-button placeholder="请输入广告片名称进行搜索" @on-change="seachs"/>
          </Col>
        </Col>
      </Row>
      <ul class='itemul'>
        <li v-for='(it,index) in itemlist' :key='index'>
          <Row class='li-title'>
            <Col span='8'>下单时间      {{it.createTime}}</Col>
            <Col span='10'>预估最大收益/￥ <span class='ora'>{{it.estimateRevenue}}</span></Col>
            <Col span='6'>
              <span v-if='it.status == 1' @click="editReject(it.id, it.planId, it.cinemaCount)" class='button' style='background: #3B98FF; color: #fff;cursor: pointer;'>确认接单</span>
              <span v-if='it.status == 1' @click="editRefuse(it)" class='button' style='background: rgba(249,249,249,1); color: #3B98FF;cursor: pointer;'>拒绝接单</span>
              <!-- <span v-if='it.status == 2' class='button' style='background: #3B98FF; color: #fff;cursor: pointer;'>查看执行单</span> -->
              <router-link
              v-if='it.status == 2'
              :to="{ name: 'order-execute-xq', params: { id: it.id } }"
              tag="span"
              class='button'
              style='background: #3B98FF; color: #fff;cursor: pointer;'
            >查看执行单</router-link>
            </Col>
          </Row>
          <Row class='li-item'>
            <Col span='18'>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>广告片名称</Col>
                <Col span='9' class='row-list-huis'>{{it.videoName}}</Col>
                <Col span='3' class='row-list-hui'>目标影院</Col>
                <Col v-if='it.status == 2' span='3' class='row-list-hui'>接单影院</Col>
                <Col span='9' class='row-list-huis'>{{it.cinemaCount}}家   <span @click="edittarget(it.id)" style='color: rgba(59,152,255,1); cursor: pointer;'>查看</span></Col>
              </Row>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>广告片规格</Col>
                <Col span='9' class='row-list-huis'>{{it.specification}}s</Col>
                <Col span='3' class='row-list-hui'>目标影厅</Col>
                <Col v-if='it.status == 2' span='3' class='row-list-hui'>接单影厅</Col>
                <Col span='9' class='row-list-huis'>所有影厅</Col>
              </Row>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>投放时间</Col>
                <Col span='9' class='row-list-huis'>{{it.beginDate}} ~ {{it.endDate}}</Col>
                <Col span='3' class='row-list-hui'>目标场次</Col>
                <Col v-if='it.status == 2' span='3' class='row-list-hui'>接单场次</Col>
                <Col span='9' class='row-list-huis'>所有场次</Col>
              </Row>
              <Row class='row-list'>
                <Col span='3' class='row-list-hui'>投放周期</Col>
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
                <Col v-if='it.status == 1' span='12' class='img-order'><img src="./assets/待接单.png" alt=""><span>待接单</span></Col>
                <Col v-if='it.status == 2' span='12' class='img-order'><img src="./assets/已接单.png" alt=""><span>已接单</span></Col>
                <Col v-if='it.status == 3' span='12' class='img-order'><img src="./assets/已拒绝.png" alt=""><span>已拒绝</span></Col>
                <Col v-if='it.status == 4' span='12' class='img-order'><img src="./assets/已失效.png" alt=""><span>已失效</span></Col>
                <Col v-if='(it.status == 1 || it.status == 2) && it.planType == 1' span='12' class='img-order'><img src="./assets/标准单.png" alt=""><span>标准单</span></Col>
                <Col v-if='(it.status == 1 || it.status == 2) && it.planType == 2' span='12' class='img-order'><img src="./assets/加速单.png" alt=""><span>加速单</span></Col>
                <Col v-if='(it.status == 1 || it.status == 2) && it.planType == 3' span='12' class='img-order'><img src="./assets/优享单.png" alt=""><span>优享单</span></Col>
                <Col v-if='(it.status == 3 || it.status == 4) && it.planType == 1' span='12' class='img-order'><img src="./assets/标准单-灰.png" alt=""><span>标准单</span></Col>
                <Col v-if='(it.status == 3 || it.status == 4) && it.planType == 2' span='12' class='img-order'><img src="./assets/加速单-灰.png" alt=""><span>加速单</span></Col>
                <Col v-if='(it.status == 3 || it.status == 4) && it.planType == 3' span='12' class='img-order'><img src="./assets/优享单-灰.png" alt=""><span>优享单</span></Col>
              </Row>
            </Col>
          </Row>
        </li>
      </ul>
      <ul class='itemul' style='padding-left: 28px;text-align: center;' v-if='itemlist.length == 0'> 暂无订单</ul>
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
    </Row>
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
  query: any = {
    planType: null,
    videoName: '',
    beginDate: null,
    endDate: null,
    status: 2,
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

  edittarget(id: any) {
    this.targetShow = true
    this.$nextTick(() => {
      (this.$refs.target as any).init(id, 1)
    })
  }


  nulldata() {
    this.showTime = []
  }

  handleChange(data: any) {
     this.showTime = data
     this.query.beginDate = Number(formatTimestamp(this.showTime[0])) - 8 * 60 * 60 * 1000
     this.query.endDate = Number(formatTimestamp(this.showTime[1])) + 16 * 60 * 60 * 1000
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
      line-height: 77px;
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
      line-height: 150px;
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
