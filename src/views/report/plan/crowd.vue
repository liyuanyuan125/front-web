<template>
  <div>
    <div class="summary-map">
      <Row type="flex" justify="space-between">
        <Col :span="9" class="flex-mid">
          <i-circle
            :size="200"
            :trail-width="8"
            :stroke-width="8"
            :percent="peopleDate"
            class="square"
            trail-color="#d2d2d2"
            stroke-linecap="square"
            stroke-color="#3b98ff"
          >
            <div class="circle-custom">
              <div>覆盖人次</div>
              <number :addNum="peopleDate || 0">人</number>
            </div>
          </i-circle>
        </Col>
        <Col :span="15" class="line-col-peopel">
          <div class="peopel-title"><em></em><span>曝光分布图（人次）</span></div>
          <div id="crowd" ref="crowd" style="width: 100%; height: 400px"></div>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">地域分布</h3>
    <Row type="flex" justify="space-between">
      <Col :span="10">
        <Table stripe :columns="columns" :data="tableDate"></Table>
      </Col>
      <Col :span="12" :offset="2">
        <CityMap/>
      </Col>
    </Row>
    <h3 class="layout-title">人群画像</h3>
    <div class="portrait" 
    :class="{'woman-atv': sex == 'woman', 'man-atv': sex == 'man', 'unknow-atv': sex == 'ALL'}" >
      <div>
        <i class="gender-text">性别不详</i>
        <i class="age-text">年龄不详</i>
        <img width="156" class="gender-img" src="./assets/unknow.png">
      </div>
      <div class="film-type flex-box">
        <i  class="notType">类型不详</i>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import number from '@/views/order/dispatch/number.vue'
import CityMap from '@/components/cityMap'
import echarts from 'echarts'

@Component({
  components: {
    number,
    CityMap
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Object }) value: any

  xaxisList: any = []
  yAxList: any = []

  sex: any = ''
  columns = [
    { title: '城市级别', key: 'citylevel', align: 'center' },
    { title: '城市数量', key: 'cityCount', align: 'center' },
    { title: '人次占比', key: 'peopleAccount', align: 'center' }
  ]
  tableDate = []

  get peopleDate() {
      if (this.value.peopleDataList) {
          return this.value.peopleDataList.totalCount
      } else {
          return 0
      }
  }
  mounted() {
    const dateList = this.value.provinceDataList
    this.tableDate = dateList ? dateList.provinceData : []
    this.sex = 'ALL'
    // 获取投放人群option数据
    const peolist = this.value.peopleDataList
    this.xaxisList = peolist.peopleData ? peolist.peopleData.map((item: any) => item.date) : []
    this.yAxList = peolist.peopleData ? peolist.peopleData.map((item: any) => item.data) : []

    this.$nextTick(() => {
      const myChart = echarts.init(this.$refs.crowd as any)
      const option: any = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#FE8135'
            }
          }
        },
        legend: {
          data: ['曝光分布0']
        },
        color: ['#FE8135'],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.xaxisList
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '曝光分布',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: this.yAxList
          }
        ]
      }
      myChart.setOption(option)
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/common.less';

.line-col-peopel {
  .peopel-title {
    position: absolute;
    top: 15px;
    right: 50px;
    em {
      display: inline-block;
      width: 10px;
      height: 10px;
      background: #fe8135;
      margin-right: 10px;
    }
  }
}
.circle-custom {
  font-size: 14px;
  span {
    display: block;
    text-align: center;
    padding-top: 15px;
    font-size: 26px;
    color: #222;
  }
}
.city-map {
  height: 440px;
  background-size: 437px auto;
  margin-top: 30px;
}

.portrait {
  position: relative;
  i {
    width: 80px;
    height: 36px;
    line-height: 36px;
    border-radius: 2px;
    text-align: center;
    display: inline-block;
  }
  &.woman-atv i {
    background: #ffeded;
    color: #ff7d7d;
  }
  &.man-atv i {
    background: #ecf5ff;
    color: #3b98ff;
  }
  &.unknow-atv i {
    background: #fff8f2;
    color: @c-button;
  }
  .gender-text {
    position: absolute;
    top: 26px;
    left: 40px;
  }
  .film-type {
    position: absolute;
    top: 84px;
    left: 277px;
    i {
      margin-right: 5px;
      margin-bottom: 16px;
    }
  }
  .age-text {
    position: absolute;
    top: 140px;
    left: 40px;
  }
  .gender-img {
    margin: 30px 0 30px 120px;
  }
}
</style>

