<template>
  <div class="page home-bg">
      <h3 class="userTitle"><span class="nav-top-title">kol推广订单</span></h3>

      <div class="kol-order">
        <Tabs v-model="orderTab" @on-click=" (id) => orderTab = id">
            <TabPane label="订单" name="0"></TabPane>
            <TabPane label="草稿箱" name="1"></TabPane>
        </Tabs>

        <!-- 订单 -->
        <div v-if="orderTab == 0" class="tab-order-pane">
            <Form :model="form" :label-width="90" class="formInline">
              <Row>
                <Col :span="5">
                  <Select v-model='form.platform' style="width: 170px" clearable placeholder="全部推广平台">
                    <Option
                      v-for="item in allPlatform"
                      :key="item.key"
                      :value="item.key"
                    >{{item.text}}</Option>
                  </Select>
                </Col>
                <Col :span="5">
                  <Select v-model='form.project' filterable style="width: 170px" clearable placeholder="全部项目">
                    <Option
                      v-for="item in allProjectSelect"
                      :key="item.key"
                      :value="item.key"
                    >{{item.text}}</Option>
                  </Select>
                </Col>
                <Col :span="5">
                  <Select v-model='form.brand' filterable style="width: 170px" clearable placeholder="全部品牌">
                    <Option
                      v-for="item in allBrandSelect"
                      :key="item.key"
                      :value="item.key"
                    >{{item.text}}</Option>
                  </Select>
                </Col>
                <Col :span="3"><Button type="primary" class="search">查询</Button></Col>
              </Row>
            </Form>

            <div class="flex-box status-content">
                <Tabs v-model="statusTab" @on-click="handleStatusList" class="order-status-tab">
                  <TabPane :label="item.text" v-for="item in statusList" v-if="item.key < 6" :key="item.key"></TabPane>
                </Tabs>
                <Dropdown class="drop-down">
                    <span href="javascript:void(0)">其他<Icon type="ios-arrow-down"></Icon></span>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="item in statusRest" :key="item.key">{{item.text}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button type="primary" class="apply-btn">申请发票</Button>
            </div>

            <ul class="table-list">
              <li class="list-li" v-for="item in list" :key = "item.id">
                <div class="li-title flex-box">
                  <div class="title-order"><span>订单号：{{item.order}}</span><span>下单时间： {{item.times}}</span></div>
                  <div class="title-status">
                    <span v-for="it in statusList" :key ="it.key" v-if="it.key == item.status">{{it.text}}</span>
                  </div>
                </div>
                <Row class="li-col" type="flex" justify="center" align="middle">
                  <Col :span="4">
                    <div>{{item.title}}</div>
                    <p>{{item.brand}}</p>
                  </Col>
                  <Col :span="8" class="flex-box">
                    <img :src="item" v-for="(item, index) in item.imgList" :key = 'index' alt="" class="li-img"/>
                    <span class="img-num">等10个账号</span>
                  </Col>
                  <Col :span="7">
                    <p>¥299,000</p>
                    <p>订单金额: xxxx</p>
                    <p>部分支付：¥50,000</p>
                  </Col>
                  <Col :span="5" class="status-btn">
                  <!-- 待审核 -->
                    <p v-if="item.status == 1 || item.status == 9  "><span @click="handleCancel(item.id)">取消</span></p>
                    <p v-if="item.status == 9 || item.status == 10 "><span @click="handlePayment(item)">支付</span></p>
                    <p v-if="item.status == 5 || item.status == 10 || item.status == 6"><span>任务监测</span></p>
                    <p v-if="item.status == 5"><span @click="taskFulfiling">确定完成任务</span></p>
                    <p><span>详情</span></p>
                  </Col>
                </Row>
              </li>
            </ul>
            <Page :total="totalCount"  v-if="totalCount>0" class="btnCenter" :current="page.pageIndex"
          :page-size="page.pageSize"  show-total  show-elevator 
          @on-change="(ind) => page.pageIndex = ind "  @on-page-size-change="(ind) => page.pageIndex = ind" />
        </div>

        <!-- 草稿 -->
        <div v-else>
          <ul class="table-list">
              <li class="list-li" v-for="item in list" :key = "item.id">
                <div class="li-title flex-box">
                  <div class="title-order"><span>订单号：{{item.order}}</span><span>下单时间： {{item.times}}</span></div>
                </div>
                <Row class="li-col" type="flex" justify="center" align="middle">
                  <Col :span="4">
                    <div>{{item.title}}</div>
                    <p>{{item.brand}}</p>
                  </Col>
                  <Col :span="8" class="flex-box">
                    <img :src="item" v-for="(item, index) in item.imgList" :key = 'index' alt="" class="li-img"/>
                    <span class="img-num">等10个账号</span>
                  </Col>
                  <Col :span="7">
                    <p>¥299,000</p>
                    <p>订单金额: xxxx</p>
                    <p>部分支付：¥50,000</p>
                  </Col>
                  <Col :span="5" class="status-btn">
                  <!-- 编辑 -->
                    <p><span @click="handleDel(item.id)">删除</span></p>
                    <p><span >编辑</span></p>
                  </Col>
                </Row>
              </li>
            </ul>
        </div>

      </div>
  </div>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info } from '@/ui/modal'

@Component
export default class Main extends ViewBase {
  totalCount = 10
  page = {
    pageIndex: 1,
    pageSize: 10
  }

  form = {
    platform: 0, // 推广平台
    project: 0, // 项目
    brand: 0 // 品牌
  }
  // 订单和草稿 默认0订单 1草稿
  orderTab = 0
  // 订单状态
  statusTab = 0
  // 全部推广平台
  allPlatform = [
    {key: 0, text: '全部推广平台'},
    {key: 1, text: '微博'},
    {key: 2, text: '微信'},
    {key: 3, text: '抖音'},
    {key: 4, text: '快手'},
    {key: 5, text: '小红书'},
  ]
  // 全部项目
  allProjectSelect = []
  // 全部品牌
  allBrandSelect = []
  statusList = [
    {key: 0, text: '全部订单'},
    {key: 1, text: '待审核', num: 2},
    {key: 2, text: '待支付', num: 2},
    {key: 3, text: '派单中', num: 2},
    {key: 4, text: '待执行', num: 2},
    {key: 5, text: '执行中', num: 2},
    {key: 6, text: '已完成'},
    {key: 7, text: '已取消'},
    {key: 8, text: '派单失败'},
    {key: 9, text: '待支付首款'},
    {key: 10, text: '待支付尾款'},
  ]

  statusRest = [
    {key: 7, text: '已完成'},
    {key: 8, text: '已取消'},
    {key: 9, text: '派单失败'},
  ]

  list = [
    { id: 1, order: 'xxxxxx', times: 'xxxxxxxx',  title: '奔驰新款2019推广', brand: '抖音推广', orderAmount: '99999', status: 1,
      imgList: [ require('./asset/timg.jpg'), require('./asset/timg.jpg'), require('./asset/timg.jpg')],
    },
    { id: 2, order: 'xxxxxx', times: 'xxxxxxxx',  title: '奔驰新款2019推广', brand: '抖音推广', orderAmount: '99999', status: 2,
      imgList: [ require('./asset/timg.jpg'), require('./asset/timg.jpg'), require('./asset/timg.jpg')],
    },
    { id: 3, order: 'xxxxxx', times: 'xxxxxxxx',  title: '奔驰新款2019推广', brand: '抖音推广', orderAmount: '99999', status: 3,
      imgList: [ require('./asset/timg.jpg'), require('./asset/timg.jpg'), require('./asset/timg.jpg')],
    },
    { id: 4, order: 'xxxxxx', times: 'xxxxxxxx',  title: '奔驰新款2019推广', brand: '抖音推广', orderAmount: '99999', status: 4,
      imgList: [ require('./asset/timg.jpg'), require('./asset/timg.jpg'), require('./asset/timg.jpg')],
    },
    { id: 5, order: 'xxxxxx', times: 'xxxxxxxx',  title: '奔驰新款2019推广', brand: '抖音推广', orderAmount: '99999', status: 5,
      imgList: [ require('./asset/timg.jpg'), require('./asset/timg.jpg'), require('./asset/timg.jpg')],
    },
    { id: 6, order: 'xxxxxx', times: 'xxxxxxxx',  title: '奔驰新款2019推广', brand: '抖音推广', orderAmount: '99999', status: 6,
      imgList: [ require('./asset/timg.jpg'), require('./asset/timg.jpg'), require('./asset/timg.jpg')],
    },
    { id: 7, order: 'xxxxxx', times: 'xxxxxxxx',  title: '奔驰新款2019推广', brand: '抖音推广', orderAmount: '99999', status: 7,
      imgList: [ require('./asset/timg.jpg'), require('./asset/timg.jpg'), require('./asset/timg.jpg')],
    },
    { id: 8, order: 'xxxxxx', times: 'xxxxxxxx',  title: '奔驰新款2019推广', brand: '抖音推广', orderAmount: '99999', status: 8,
      imgList: [ require('./asset/timg.jpg'), require('./asset/timg.jpg'), require('./asset/timg.jpg')],
    },
    { id: 9, order: 'xxxxxx', times: 'xxxxxxxx',  title: '奔驰新款2019推广', brand: '抖音推广', orderAmount: '99999', status: 9,
      imgList: [ require('./asset/timg.jpg'), require('./asset/timg.jpg'), require('./asset/timg.jpg')],
    },
    { id: 10, order: 'xxxxxx', times: 'xxxxxxxx',  title: '奔驰新款2019推广', brand: '抖音推广', orderAmount: '99999', status: 10,
      imgList: [ require('./asset/timg.jpg'), require('./asset/timg.jpg'), require('./asset/timg.jpg')],
    },

  ]

  handleStatusList() {}
  search() {}

  // 删除
  async handleDel(id: any) {
    await confirm('删除后将无法恢复，是否确定删除', {
      title: '删除',
      okText: '确定删除',
      cancelText: '不, 谢谢'
    })
  }
  // 取消
  async handleCancel(id: number) {
    await confirm('取消后将无法恢复，是否确认取消', {
      title: '取消',
      okText: '确定取消',
      cancelText: '不，谢谢'
    })
  }

  // 支付
  async handlePayment(it: any) {
    // 若余额不足则提示”账号余额不足XXXX元“，请充值后再支付
    true ? await info('若余额不足则提示”账号余额不足XXXX元“，请充值后再支付') :
     await confirm(`整单金额分为两次支付<br />①首付款：订单金额的30%，支付后派单 ②尾款：待任务完成后支付剩余金额, <br />是否支付冻结金额2500元`, {
       title: '支付KOL推广费用'
    })
  }
  // 确定完成
  async taskFulfiling() {
    confirm('是否确认任务全部完成', {
      title: '确定完成'
    })
  }

  @Watch('form', {deep: true})
  watchForm() {
    this.page.pageIndex = 1
    this.search()
  }

  @Watch('page', {deep: true})
  watchPage() {
    this.search()
  }
}

</script>
<style lang='less' scoped>
@import '~@/site/common.less';
.list-li {
  font-size: 14px;
  border: solid 1px #dcdee2;
  margin-bottom: 20px;
  .li-title {
    background: #ededed;
    padding: 15px 25px;
    .title-order {
      flex: 2;
      span {
        margin-right: 15px;
      }
    }
    .title-status {
      flex: 1;
      text-align: right;
      font-size: 16px;
    }
  }
  .li-col {
    padding: 20px 25px;
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
      text-align: right;
      p {
        span {
          cursor: pointer;
          padding: 5px;
        }
      }
    }
  }
}
.formInline {
  padding: 0;
}
.kol-order {
  padding: 0 15px 15px;
}
.status-content {
  position: relative;
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
</style>