<template>
  <div class="page home-bg">
      <h3 class="userTitle"><span class="nav-top-title">kol推广订单</span></h3>
      <div class="kol-order">
        <Tabs v-model="orderTab" @on-click="handleOrder">
            <TabPane label="订单" name="0"></TabPane>
            <TabPane label="草稿箱" name="1"></TabPane>
        </Tabs>

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
              <TabPane :label="item.text" v-for="item in statusList" :key="item.key"></TabPane>
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
          <li class="list-li">
            <div class="li-title flex-box">
              <div class="title-order"><span>订单号：xxxxxxxx</span><span>下单时间： xxxxxx</span></div>
              <div class="title-status">待审核</div>
            </div>
          </li>
        </ul>
      </div>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  form = {
    platform: 0, // 推广平台
    project: 0, // 项目
    brand: 0 // 品牌
  }
  // 订单和草稿tab
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
  ]
  statusRest = [
    {key: 7, text: '已完成'},
    {key: 8, text: '已取消'},
    {key: 9, text: '派单失败'},
  ]

  handleOrder(id: any) {}
  handleStatusList() {}
}

</script>
<style lang='less' scoped>
@import '~@/site/common.less';
.list-li {
  font-size: 14px;
  border: solid 1px #dcdee2;
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