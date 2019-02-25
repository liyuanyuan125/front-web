<template>
  <div class="page home-bg">
    <div class="layout-nav-title"><span>广告计划</span></div>
      <div class="tops flex-box">
        <div class="tops-img">
          <img src="./assets/1-1.png" alt width="380" >
        </div>
        <div class="tops-byte">
          <Row class="text-rows">
            <Col :span="24">
              <p>
                <label>广告计划</label>
                <Select v-model="level" style="width: 400px" clearable @on-change="handleChangeName">
                  <Option v-for="item in dataList" :key="item.id" :value="item.id">{{item.name}}</Option>
                </Select>
              </p>
            </Col>
          </Row>
          <Row class="text-rows">
            <Col :span="12">
              <p><label>公司计划ID</label>{{queryList.id}}</p>
              <p><label>投放类型</label>{{deliveryType(queryList.deliveryType)}}</p>
              <p><label>投放周期</label>{{queryList.cycle}}天</p>
              <p><label>广告片规格</label>{{queryList.specification}}s</p>
            </Col>
            <Col :span="12">
              <p><label>广告片</label>{{queryList.videoName}}</p>
              <p><label>客户名称</label>{{queryList.customerName}}</p>
              <p><label>投放排期</label>{{formatYell(queryList.beginDate)}}~{{formatYell(queryList.endDate)}}</p>
            </Col>
          </Row>
        </div>
      </div>
    <i-col span="24" class="demo-tabs-style2">
      <Tabs type="card" :animated="false" @on-click="handleChange">
        <Tab-pane :label="item.name" v-for="(item,index) in tabObjList" :key="item.key"></Tab-pane>
      </Tabs>
      <div :is="comName" v-model="mockDate" v-if="mockDate.length > 0"></div>
    </i-col>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { planList, planDefault, dateMockList } from '@/api/plan'
import { formatYell } from '@/util/validateRules'
import summany from './summary.vue'
import crowd from './crowd.vue'
import cinema from './cinema.vue'
import film from './film.vue'
import areaCom from './area.vue'


@Component({
  components: {
    summany,
    crowd,
    cinema,
    film,
    areaCom
  }
})
export default class Main extends ViewBase {
  level: any = ''
  levelTypeList = []
  dataList: any = []
  queryList: any = []
  defaultData: any = []
  mockDate = []

  mockObj: any = {
    id: '',
    planDataType: '',
    beginDate: '',
    endDate: ''
  }

  tabObjList = [
    { key: 0, name: '汇总' },
    { key: 1, name: '按人群' },
    { key: 2, name: '按影院' },
    { key: 3, name: '按影片' },
    { key: 4, name: '按地区' }
  ]
  comName = 'summany'
  planDataType = 0

  get formatYell() {
    return formatYell
  }

  mounted() {
    this.advList()
  }
  async advList() {
    // 拿取 已结束状态（status：8）  结算完成（settlementStatus：2） 并且已关联广告片 （videoId是否有值）
    const { data } = await planList({
      status: 8,
      settlementStatus: 2
    })
    this.dataList = data.items.filter((item: any) => item.videoId != 0)
    this.level = this.dataList.length > 0 ? this.dataList[0].id : ''
    // 广告计划详情
    this.detailList(this.level)
  }
  async detailList(id: any) {
    const { data } = await planDefault(id)
    this.defaultData = data
    this.queryList = data.item
    // mock数据
    this.mockObj = {
      id: this.queryList.id, // 广告计划id
      planDataType: this.planDataType, // 数据类型
      beginDate: this.queryList.beginDate, // 投放排期
      endDate: this.queryList.endDate
    }
    this.mockList({...this.mockObj})
  }
  handleChangeName(id: any) {
    this.detailList(id)
  }

  async mockList(form: any) {
    const { data } = await dateMockList({...form})
    this.mockDate = data.items
  }

  deliveryType(id: any) {
    const list = this.defaultData.deliveryTypeList
    if (list) {
      for (const i of list) {
        if (i.key == id) {
          return i.text
        }
      }
    }
  }

  handleChange(val: any) {
    this.planDataType = val
    if (val == 0) {
      this.comName = 'summany'
    } else if (val == 1) {
      this.comName = 'crowd'
    } else if (val == 2) {
      this.comName = 'cinema'
    } else if (val == 3) {
      this.comName = 'film'
    } else if (val == 4) {
      this.comName = 'areaCom'
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.tops-byte {
  width: 100%;
}
.text-rows {
  padding: 0;
  padding-left: 30px;
}
.tops {
  width: 100%;
  padding: 20px 30px 37px 30px;
}
/deep/ .ivu-tabs-bar {
  border-bottom: 0 !important;
}
/deep/ .ivu-tabs-bar .ivu-tabs-nav-container {
  height: 70px !important;
}
/deep/ .ivu-tabs-nav-scroll {
  border-bottom: 2px solid #ff8237 !important;
}
/deep/ .nav-text {
  width: 96%;
  margin-left: 2%;
}
/deep/ .ivu-tabs-tab {
  border-radius: 0 !important;
  background: #fff !important;
  color: #222;
  width: 20%;
  height: 70px !important;
  margin-right: 0 !important;
  text-align: center;
  line-height: 60px;
  font-size: 16px;
  border: 2px solid #fff !important;
  border-left: 0 !important;
  border-bottom: 2px solid #ff8237 !important;
}

/deep/ .ivu-tabs-bar .ivu-tabs-tab-active {
  color: #ff8237 !important;
  // border: 1px solid #ff8237;
  // border-color: #fff !important;
  border-bottom: 2px solid #fff !important;
  border-top: 2px solid #ff8237 !important;
  border-left: 2px solid #ff8237 !important;
  border-right: 2px solid #ff8237 !important;
}

/deep/ .ivu-tabs-nav .ivu-tabs-tab:hover {
  color: @c-button;
}

/deep/ .ivu-tabs-tab-focused {
  // border-top:  #ff8237 !important;
  // border-left:  #ff8237 !important;
  // border-top:  #ff8237 !important;
}
/deep/ .ivu-tabs-bar .ivu-tabs-tab {
  // border-color: #ff8237;
  // border-top: 2px solid #fff !important;
  transition: all 0s !important;
}
///deep/ .ivu-tabs-bar div:nth-child(2) {
// border-left:2px solid #ff8237;
//}
</style>
