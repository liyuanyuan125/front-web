<template>
  <div>
    <Row class="circle-body" type="flex" justify="space-between">
      <Col :span="8" v-for="(item, index) in crirle" :key="index">
        <i-circle
          :size="200"
          :trail-width="8"
          :stroke-width="8"
          :percent="10"
          class="square"
          trail-color="#d2d2d2"
          stroke-linecap="square"
          :stroke-color="crirleColor[index]"
        >
          <div class="circle-custom">
            <div>{{crirle[index]}}</div>
            <number :addNum="value.advertAmount" v-if="index == 0">￥</number>
            <number :addNum="value.peopleDataList.totalCount" v-else-if="index == 1">人</number>
            <number :addNum="value.coverCinema || 0" v-else-if="index == 2">个</number>
          </div>
        </i-circle>
      </Col>
    </Row>
    <h3 class="layout-title">投放人群</h3>
    <div class="summary-map">
      <Row type="flex" justify="space-between">
        <Col :span="9" class="flex-box">
          <div class="sum-model">
            <h4>覆盖人次</h4>
            <p>{{value.peopleDataList.totalCount}}</p>
          </div>
          <div class="sum-model">
            <h4>投放天数</h4>
            <p>{{value.coverDay}}天</p>
          </div>
        </Col>
        <Col :span="15">
          <div id="summaryLint" ref="summaryLint" style="width: 100%; height: 400px"></div>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">投放影院</h3>
    <div class="summary-map">
      <Row type="flex" justify="space-between">
        <Col :span="10">
          <div class="flex-box">
            <div class="sum-model">
              <h4>影院数</h4>
              <p>{{value.peopleDataList.totalCount}}</p>
            </div>
            <div class="sum-model list-flot">
              <h4>影厅数</h4>
              <p>{{value.coverDay}}天</p>
            </div>
          </div>
          <div class="flex-box">
            <div class="sum-model">
              <h4>场次数</h4>
              <p>{{value.peopleDataList.totalCount}}</p>
            </div>
            <div class="sum-model">
              <h4>银屏数</h4>
              <p>{{value.coverDay}}天</p>
            </div>
          </div>
        </Col>
        <Col :span="14">
        <Table stripe :columns="columns" :data="tableDate"></Table>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">投放影片</h3>
    <h3 class="layout-title">投放地区</h3>
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
    number
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Object }) value: any
  crirle: any = ['广告花费', '覆盖人次', '覆盖影院']
  crirleColor: string[] = ['#fe5f5e', '#3b98ff', '#41d9c1']

  xaxisList: any = []
  yAxList: any = []

  columns = [
    { title: '专资编码', key: 'code' },
    { title: '影院名称', key: 'shortName' },
    { title: '总座位数', key: 'seatCount' },
  ]
  tableDate = []

  mounted() {
    this.tableDate = this.value.cinemaDataList.cinemas.items
    // 获取投放人群option数据
    const peopleData = this.value.peopleDataList.peopleData
    this.xaxisList = peopleData.map((item: any) => item.date)
    this.yAxList = peopleData.map((item: any) => item.data)

    this.$nextTick(() => {
      const myChart = echarts.init(this.$refs.summaryLint as any)
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
<style lang="less">
.circle-body {
  padding: 60px 50px;
  /deep/ .ivu-col {
    text-align: center;
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
.summary-map {
  padding: 40px 30px 50px;
}
.sum-model {
  width: 150px;
  height: 120px;
  background: rgba(255, 248, 242, 1);
  border-radius: 2px;
  color: #444;
  font-size: 22px;
  text-align: center;
  margin-right: 20px;
  margin-bottom: 20px;
  h4 {
    padding: 30px 0 17px;
    font-weight: 500;
  }
  p {
    color: #fe8135;
  }
}
</style>
