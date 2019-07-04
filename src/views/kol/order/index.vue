<template>
  <div class="page">
      <div class="kol-order">
        <Tabs class="tab-order" v-model="orderTab" @on-click="(id) => orderTab = id">
            <TabPane label="订单" name="0"></TabPane>
            <TabPane label="草稿箱" name="1"></TabPane>
        </Tabs>

        <!-- 订单 -->
        <div v-if="orderTab == 0" class="tab-order-pane">
          <div class="flex-box select-order">
              <Select v-model='form.channelCode'  clearable placeholder="全部推广平台">
                <Option
                  v-for="item in channelCodeList"
                  :key="item.key"
                  :value="item.key"
                >{{item.text}}</Option>
              </Select>
              <Input v-model='projectName' placeholder="输入项目名称模糊查询"  @on-enter="searchList" />
              <Select v-model='form.brandId' filterable clearable placeholder="全部品牌">
                <Option
                  v-for="item in allBrandSelect"
                  :key="item.brandId"
                  :value="item.brandId"
                >{{item.brandName}}</Option>
              </Select>
              <Button type="primary" class="search" @click="searchList">查询</Button>
          </div>
            <div class="flex-box status-content">
                <Tabs v-model="form.orderStatus" class="order-status-tab">
                  <TabPane label="全部订单" key="" name="" ></TabPane>
                  <TabPane :label="countData.approvalSize ? `待审核(${countData.approvalSize})` : '待审核'" key="2" name="2,3" ></TabPane>
                  <TabPane :label="countData.waitPaySize ? `待支付(${countData.waitPaySize})` : '待支付'" key="4" name="4,8"></TabPane>
                  <TabPane :label="countData.distributorSize ? `派单中(${countData.distributorSize})` : '派单中' " key="5" name="5" ></TabPane>
                  <TabPane :label="countData.waitExecuteSize ? `待执行(${countData.waitExecuteSize})` : '待执行' " key="6" name="6" ></TabPane>
                  <TabPane :label="countData.execuTingSize ? `执行中(${countData.execuTingSize})` : '执行中'" key="7" name="7" ></TabPane>
                </Tabs>
                <Dropdown class="drop-down" @on-click="(id) => form.orderStatus=id">
                    <span href="javascript:void(0)">其他<Icon type="ios-arrow-down"></Icon></span>
                    <DropdownMenu slot="list">
                        <DropdownItem name="9" >{{countData.finishSize ? `已完成(${countData.finishSize})` : '已完成'}}</i></DropdownItem>
                        <DropdownItem name="10" >{{countData.cancelSize ? `已取消(${countData.cancelSize})` : '已取消'}}</i></DropdownItem>
                        <DropdownItem name="11" >{{countData.failSize ? `派单失败(${countData.failSize})` : '派单失败'}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button type="primary" @click="$router.push({name: 'kol-applyTicket'})" class="apply-btn">申请发票</Button>
            </div>
            <div class="table-list">
              <div class="demo-spin-article">
                <ul>
                  <li class="list-li" v-for="item in list" v-if="item.status != 1" :key = "item.id">
                    <Row>
                      <Col :span="5"><span>订单号 {{item.orderNo}}</span></Col>
                      <Col :span="7"><span>下单时间 {{item.createTime}}</span></Col>
                    </Row>
                    <Row class="li-col" type="flex" justify="center" align="middle">
                      <Col :span="5">
                        <div class="order-title">
                          <Tooltip max-width="200" transfer v-if='item.projectName != null' :content="item.projectName">
                          <span>{{item.projectName}}</span>
                          </Tooltip>
                        </div>
                        <p class="brand-mark col_00202d flex-box" v-for="it in channelCodeList" v-if="it.key == item.channelCode">
                          <img src="~@/views/brand/assets/microblog.png" v-if="item.channelCode == 'weibo'" width="20" height="20" alt="alias" />
                          <img src="~@/views/brand/assets/quick.png" v-if="item.channelCode == 'kuaishou'" width="20" height="20" alt="alias" />
                          <img src="~@/views/brand/assets/vibrato.png" v-if="item.channelCode == 'douyin'" width="20" height="20" alt="alias" />
                          <img src="~@/views/brand/assets/wechat.png" v-if="item.channelCode == 'wechat'" width="20" height="20" alt="alias" />
                          <em>{{it.text}}</em>
                        </p>
                      </Col>
                      <Col :span="7" class="flex-box">
                           <img v-for="(it, index) in item.orderItemList" 
                           :src="it.accountPhotoUrl == null || it.accountPhotoUrl == '' ? $store.state.defaultAvatar : it.accountPhotoUrl" v-if="index < 5" :key="index" alt="" class="li-img"/>
                           <span class="img-num" v-if="(item.orderItemList || []).length > 4">等{{(item.orderItemList || []).length}}个账号</span>
                      </Col>
                      <Col :span="6">
                        <p class="col_00202d">订单金额
                          <em class="order-monery" v-if="[2,3].includes(item.status)">￥{{formatNumber(item.totalFee)}}</em>
                           <em class="order-monery" v-else-if="item.status == 9">￥{{formatNumber(item.advanceFee+item.restFee)}}</em>
                          <em v-else class="order-monery">￥{{formatNumber(item.confirmFee)}}</em>
                          </p>
                        <p v-if="[5,6,7,8].includes(item.status)" class="col_00202d rest-order">部分支付 {{item.advanceFee}}</p>
                      </Col>
                      <Col :span="2" class="li-item-status">
                        <span v-for="it in intStatusList" :key ="it.key" v-if="it.key == item.status">
                          <i v-if="[2,3].includes(item.status)">待审核</i>
                          <i v-else>{{it.text}}</i>
                        </span>
                      </Col>
                      <Col :span="4" class="status-btn">
                      <!-- 状态 -->
                        <p v-if="[2,3,4].includes(item.status)"><span @click="handleCancel(item.id)">取消订单</span></p>
                        <p v-if="[4, 8].includes(item.status)"><span @click="handlePayment(item)" class="operate-btn-add">立即支付</span></p>
                        <p v-if="[7, 8, 9].includes(item.status)"><span @click="$router.push({name: 'order-order-taskDetection', params: {id: item.id}})">任务监测</span></p>
                        <p v-if="[7].includes(item.status)"><span @click="taskFulfiling(item.id)" class="operate-btn-add">确定完成任务</span></p>
                        <p v-if="[1].includes(item.status)"><span @click="handleDel(item.id)">删除</span></p>
                        <p v-if="[1].includes(item.status)"><span @click="$router.push({name: 'order-orderfill', params: {id: item.id, code: item.channelCode}})">编辑</span></p>
                        <p v-if="item.status != 1"><span @click="$router.push({name: 'kol-order-detail', params: {id: item.id}})">详情</span></p>
                      </Col>
                    </Row>
                  </li>
                </ul>
                <ul v-if ="list.length == 0" class="no-list-data">{{list.length == 0 ? '暂无数据' : null}}</ul>
                <Spin fix v-if="spinShow"></Spin>
              </div>
                <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>
            </div>
        </div>

        <!-- 草稿 -->
        <div class="table-list" v-else>
          <div class="demo-spin-article">
            <ul>
              <li class="list-li" v-for="item in list" :key = "item.id">
                <Row>
                  <Col :span="5"><span>订单号 {{item.orderNo}}</span></Col>
                  <Col :span="7"><span>创建时间 {{item.createTime}}</span></Col>
                </Row>
                <Row class="li-col" type="flex" justify="center" align="middle">
                  <Col :span="5">
                    <div class="order-title"><Tooltip max-width="200" transfer v-if='item.projectName != null' :content="item.projectName">
                          <span>{{item.projectName}}</span>
                          </Tooltip></div>
                    <p class="brand-mark col_00202d flex-box" v-for="it in channelCodeList" v-if="it.key == item.channelCode">
                      <img src="~@/views/brand/assets/microblog.png" v-if="item.channelCode == 'weibo'" width="20" height="20" alt="alias" />
                      <img src="~@/views/brand/assets/quick.png" v-if="item.channelCode == 'kuaishou'" width="20" height="20" alt="alias" />
                      <img src="~@/views/brand/assets/vibrato.png" v-if="item.channelCode == 'douyin'" width="20" height="20" alt="alias" />
                      <img src="~@/views/brand/assets/wechat.png" v-if="item.channelCode == 'wechat'" width="20" height="20" alt="alias" />
                      <em>{{it.text}}</em>
                    </p>
                  </Col>
                  <Col :span="7" class="flex-box">
                     <img v-for="(it, index) in item.orderItemList" :src="it.accountPhotoUrl" v-if="index < 5" :key="index" alt="" class="li-img"/>
                     <span class="img-num" v-if="(item.orderItemList || []).length > 4">等{{(item.orderItemList || []).length}}个账号</span>
                  </Col>
                  <Col :span="8">
                    <p class="col_00202d">订单金额 <em class="order-monery">￥{{formatNumber(item.confirmFee)}}</em></p>
                    <!-- <p v-if="[5,6,7,8].includes(item.status)" class="col_00202d rest-order">部分支付 {{item.advanceFee}}</p> -->
                  </Col>
                  <!-- <Col :span="2" class="li-item-status">
                    <span v-for="it in intStatusList" :key ="it.key" v-if="it.key == item.status">{{it.text}}</span>
                  </Col> -->
                  <Col :span="4" class="status-btn">
                  <!-- 状态 -->
                    <p v-if="[1].includes(item.status)"><span @click="handleDel(item.id)">删除</span></p>
                    <p v-if="[1].includes(item.status)"><span @click="$router.push({name: 'order-orderfill', params: {id: item.id, code: item.channelCode}})">编辑</span></p>   
                  </Col>
                </Row>
              </li>
            </ul>
            <Spin fix v-if="spinShow"></Spin>
            <ul v-if ="list.length == 0" class="no-list-data">暂无数据</ul>
          </div>
        </div>

      </div>
  </div>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info } from '@/ui/modal'
import { formatNumber } from '@/util/validateRules.ts'
import { querySelectList } from '@/api/brandList'
import { getUser } from '@/store'
import pagination from '@/components/page.vue'
import moment from 'moment'
import { toMap } from '@/fn/array'
import { uniq, uniqBy } from 'lodash'
import Decimal from 'decimal.js'
import {
  orderList,
  orderBrand,
  cancelOrder,
  firstPaymentList,
  restPaymentList,
  delOrderList,
  confirmFinish,
  orderDetail
} from '@/api/kolOrderList'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
    pagination
  }
})
export default class Main extends ViewBase {
  total = 0
  pageList = {
    pageIndex: 1,
    pageSize: 20
  }
  projectName = null
  form: any = {
    orderStatus: null
  }
  spinShow = false
  // 订单和草稿 默认0订单 1草稿
  orderTab = 0
  // 订单状态
  // status: any = ''
  cloneStatus: any = null
  // 全部推广平台
  channelCodeList = []
  // 全部品牌
  allBrandSelect = []
  // 保留初始数据
  intStatusList = []
  // 变更后数据
  statusList = []
  // 其他
  // statusRest = []

  list = []
  countData: any = {}

  // 定义数字格式
  formatNumber = formatNumber

  mounted() {
    this.tableList()
    this.querySelectList()
    this.orderBrand()
  }
  async tableList() {
    this.spinShow = true
    try {
      if (this.form.orderStatus == 1) { // 草稿
        this.pageList.pageSize = 300
      } else {
        this.pageList.pageSize = 20
      }
      let projectName: any = this.projectName
      projectName = projectName && projectName.startsWith('*') ? `\\${projectName}` : projectName
      const { data } = await orderList({
        ...this.pageList,
        ...this.form,
        projectName,
        orderStatus: this.form.orderStatus == 0 ? null : this.form.orderStatus
      })
      this.spinShow = false
      this.countData = data || []
      this.list = (data.items || []).map((it: any) => {
        return {
          ...it,
          orderItemList: uniqBy(it.orderItemList, 'kolId'), // 去重一个kol有两个任务
          createTime: moment(it.createTime).format(timeFormat)
        }
      })
      this.total = data.totalCount || 0
      this.intStatusList = data.statusList
    } catch (ex) {
      this.spinShow = false
      this.list = []
      this.total = 0
      // this.handleError(ex)
    }
  }


  // 获取订单品牌接口
  async orderBrand() {
    const user: any = getUser()
    try {
      const { data } = await orderBrand(user.id)
      this.allBrandSelect = data
    } catch (ex) {
      this.handleError(ex)
    }
  }
  // 获取推广平台
  async querySelectList() {
    try {
      const { data: {channelCodeList} } = await querySelectList()
      this.channelCodeList = channelCodeList
    } catch (ex) {
      this.handleError(ex)
    }
  }
  searchList() {
    this.pageList.pageIndex = 1
    this.tableList()
  }

  // 删除订单
  async handleDel(id: any) {
    await confirm('删除后将无法恢复，是否确定删除', {
      title: '删除',
      okText: '确定删除',
      cancelText: '不, 谢谢'
    })
    try {
      await delOrderList(id)
      this.tableList()
    } catch (ex) {
      this.handleError(ex)
    }
  }
  // 取消订单
  async handleCancel(id: number) {
    await confirm('取消后将无法恢复，是否确认取消', {
      title: '取消',
      okText: '确定取消',
      cancelText: '不，谢谢'
    })
    try {
      await cancelOrder(id)
      this.tableList()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 支付
  async handlePayment(item: any) {
    // item.status = 4 待支付首款8待支付尾款
    // 若余额不足则提示”账号余额不足XXXX元“，请充值后再支付
    // 待支付首款
    if (item.status == 4) {
    const firstPayment = (item.confirmFee * 0.5).toFixed(2)
      await confirm(`*整单金额分为两次支付*，<br />
      ①首付款：订单金额的50%，支付后派单    ②尾款：待任务完成后支付剩余金额。<br />
      是否支付首款金额${firstPayment}元?`, {
        title: '支付KOL推广费用',
        width: 540
      })
      try {
        const { data } = await firstPaymentList({
          advanceFee: firstPayment,
          orderId: item.id
        })
        this.tableList()
      } catch (ex) {
        this.handleError(ex)
      }
    } else if (item.status == 8) {
      // 尾款金额 = 订单金额 - 首付款（部分付款
      const restPayment = new Decimal(item.confirmFee).minus(item.advanceFee)
      // const restPayment = item.confirmFee - item.advanceFee
      await confirm(`是否支付尾款金额${restPayment}元, <br /> 尾款金额=订单金额${item.confirmFee} 减去 首付款${item.advanceFee}`, {
        title: '支付KOL推广费用'
      })
      try {
        await restPaymentList({
          restFee: restPayment,
          orderId: item.id
        })
        this.tableList()
      } catch (ex) {
        this.handleError(ex)
      }
    }
  }
  // 确定完成
  async taskFulfiling(id: any) {
    await confirm('是否确认任务全部完成', {
      title: '确定完成'
    })
    try {
      await confirmFinish(id)
      this.tableList()
    } catch (ex) {
      this.handleError(ex)
    }
  }
  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
  @Watch('form', {deep: true})
  watchStatus(val: number) {
    this.pageList.pageIndex = 1
    this.tableList()
  }
  @Watch('orderTab')
  watchOrderTab() {
    this.list = []
    this.form.orderStatus = this.orderTab == 0 ? null : 1
  }
}

</script>
<style lang='less' scoped>
@import './order.less';
.order-monery {
  font-size: 20px;
  color: #000;
}
.operate-btn-add {
  width: 105px;
  height: 28px;
  display: inline-block;
  line-height: 28px;
  text-align: center;
  color: #fff;
  background: rgba(0, 32, 45, 1);
  border-radius: 14px;
}
.rest-order {
  padding-left: 70px;
}
.col_00202d {
  color: rgba(0, 32, 45, .5);
}
.table-list {
  position: relative;
  background: rgba(255, 255, 255, .7);
  color: #222;
}
.list-li {
  font-size: 14px;
  padding: 30px 0 40px 22px;
  .li-col {
    padding-top: 28px;
    .brand-mark {
      font-size: 14px;
      padding-top: 7px;
      em {
        padding-left: 10px;
      }
    }
    .li-img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .img-num {
      padding-top: 7px;
    }
    .li-item-status {
      color: #5f961f;
    }
    .status-btn {
      text-align: center;
      p {
        margin-bottom: 12px;
        span {
          cursor: pointer;
        }
      }
    }
  }
  &:nth-child(2n) {
    background: rgba(255, 255, 255, .6);
  }
}
.kol-order {
  padding: 30px 37px 45px 45px;
  .tab-order {
    color: #fff;
    /deep/ .ivu-tabs-bar {
      border-bottom: solid .5px #fff;
    }
    /deep/ .ivu-tabs-nav {
      .ivu-tabs-ink-bar {
        background-color: #fff;
        height: 3px;
      }
      .ivu-tabs-tab {
        color: #fff;
        padding: 0 20px;
        text-align: center;
        line-height: 48px;
        &:hover {
          color: inherit;
        }
      }
    }
  }
}
.select-order {
  margin-top: 20px;
  margin-bottom: 25px;
}
.status-content {
  position: relative;
  background: rgba(0, 32, 45, .8);
  height: 50px;
  line-height: 50px;
  color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding-left: 24px;
  /deep/ .ivu-tabs-nav {
    .ivu-tabs-tab {
      padding: 0 16px;
      height: 51px;
      line-height: 51px;
      color: #fff;
    }
    .ivu-tabs-ink-bar {
      background-color: #fff;
    }
  }
}
.page-order {
  margin-top: 25px;
  text-align: center;
}
.search {
  width: 100px;
  height: 40px;
  color: #fff;
  background: rgba(0, 32, 45, 1);
  border-radius: 5px;
  border: 0;
  font-size: 14px;
}
.apply-btn {
  width: 120px;
  height: 40px;
  border-radius: 5px;
  color: #585858;
  background: #fff;
  border: solid 1px #ededed;
  font-size: 13px;
  position: absolute;
  right: 10px;
  top: 5px;
}
.order-status-tab {
  /deep/ .ivu-tabs-bar {
    border: none;
  }
}
.drop-down {
  /deep/ .ivu-dropdown-rel {
    cursor: pointer;
    font-size: 14px;
  }
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
/deep/ .ivu-select-input {
  height: 40px;
  line-height: 40px;
}
/deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  height: 40px;
  line-height: 40px;
}
/deep/ .ivu-select-selection, /deep/ .ivu-input {
  background: rgba(255, 255, 255, .8);
  border-radius: 5px;
  border: none;
}
</style>