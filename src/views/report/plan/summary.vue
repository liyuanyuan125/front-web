<template>
  <div>
    <Row class="circle-body" type="flex" justify="space-between">
      <Col :span="8" v-for="(item, index) in crirle" :key="index">
        <i-circle
          :size="200"
          :trail-width="8"
          :stroke-width="8"
          :percent="percenAry[index]"
          class="square"
          trail-color="#d2d2d2"
          stroke-linecap="square"
          :stroke-color="crirleColor[index]"
        >
          <div class="circle-custom">
            <div>{{crirle[index]}}</div>
            <p class="advert-amount" v-if="index == 0">
              <em>￥</em>
              <number :addNum="percenAry[index]"></number>
            </p>
            <number :addNum="percenAry[index]" v-else-if="index == 1">人</number>
            <number :addNum="percenAry[index] || 0" v-else-if="index == 2">个</number>
          </div>
        </i-circle>
      </Col>
    </Row>
    <h3 class="layout-title">投放人群</h3>
    <div class="summary-map sum-flex">
      <Row type="flex" justify="space-between">
        <Col :span="9" class="flex-box left-circel">
          <div class="sum-model">
            <h4>覆盖人次</h4>
            <p>{{value.peopleDataList.totalCount}}</p>
          </div>
          <div class="sum-model">
            <h4>投放天数</h4>
            <p>{{value.coverDay}}天</p>
          </div>
        </Col>
        <Col :span="15" class="line-col-peopel">
          <div class="peopel-title"><em></em><span>曝光分布图（人次）</span></div>
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
              <p>{{value.coverCinema}}家</p>
            </div>
            <div class="sum-model list-flot">
              <h4>影厅数</h4>
              <p>{{value.cinemaDataList.hall || 0}}</p>
            </div>
          </div>
          <div class="flex-box">
            <div class="sum-model">
              <h4>场次数</h4>
              <p>{{value.cinemaDataList.scene || 0}}</p>
            </div>
            <div class="sum-model">
              <h4>银屏数</h4>
              <p>{{value.cinemaDataList.screen || 0}}</p>
            </div>
          </div>
        </Col>
        <Col :span="14">
          <Table stripe :columns="columns" :data="tableDate"></Table>
          <div class="btn-query-all">
            <Button type="primary" class="button-ok" @click="btnQueryAll(1)">查看全部</Button>
          </div>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">投放影片</h3>
    <div class="summary-map">
      <Row type="flex" justify="space-between">
        <Col :span="10" class="flex-box">
          <div class="sum-model">
            <h4>影片数</h4>
            <p>{{value.movieDataList.totalCount}}</p>
          </div>
          <div class="sum-model">
            <h4>类型</h4>
            <p class="model-type">{{value.movieDataList.type}}</p>
          </div>
        </Col>
        <Col :span="14">
          <Table stripe :columns="columnsMovie" :data="tableDateMovie">
            <template slot="openTime" slot-scope="{row, index}">
              <span>{{getOpentime(row.openTime)}}</span>
            </template>
            <template slot="types" slot-scope="{row, index}">
              <span>{{queryMovieList(row.types)}}</span>
              <em></em>
            </template>
          </Table>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">投放地区</h3>
    <div class="summary-map">
      <Row type="flex" justify="space-between">
        <Col :span="10">
          <div class="flex-box">
            <div class="sum-model">
              <h4>地域数</h4>
              <p>{{value.provinceDataList.areaCount}}</p>
            </div>
            <div class="sum-model list-flot">
              <h4>省份数</h4>
              <p>{{value.provinceDataList.provinceCount}}</p>
            </div>
          </div>
          <div class="flex-box">
            <div class="sum-model">
              <h4>城市数</h4>
              <p>{{value.provinceDataList.cityCount}}</p>
            </div>
            <div class="sum-model">
              <h4>影院数</h4>
              <p>{{value.provinceDataList.cinemaCount}}</p>
            </div>
          </div>
        </Col>
        <Col :span="14">
          <Table stripe :columns="columnsProvince" :data="provinceDataList"></Table>
          <div class="btn-query-all">
            <Button type="primary" class="button-ok" @click="btnQueryAll(2)">查看全部</Button>
          </div>
        </Col>
      </Row>
    </div>
    <cinemaDlg v-model="cinemaVisible" v-if="cinemaVisible.visible"></cinemaDlg>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import number from '@/views/order/dispatch/number.vue'
import CityMap from '@/components/cityMap'
import echarts from 'echarts'
import cinemaDlg from './dlg/cinemaDlg.vue'

@Component({
  components: {
    number,
    cinemaDlg
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
    { title: '总座位数', key: 'seatCount' }
  ]
  tableDate = []

  columnsMovie = [
    { title: '影片名称', key: 'name' },
    { title: '上映时间', slot: 'openTime' },
    { title: '类型', slot: 'types' }
  ]
  tableDateMovie = []

  columnsProvince = [
    { title: '区域', key: 'areaName' },
    { title: '省份', key: 'provinceName' },
    { title: '城市', key: 'cityName' },
    { title: '影院数', key: 'cinema' }
  ]
  provinceDataList = []

  cinemaVisible: any = {
    visible: false,
    id: ''
  }
  get percenAry() {
    const val = this.value
    return [val.advertAmount, val.peopleDataList.totalCount, val.coverCinema]
  }
  movieType: any = []

  getOpentime(val: any) {
    val = val.toString()
    val =
      val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6)
    return val
  }

  mounted() {
    this.tableDate = this.value.cinemaDataList.cinemas.items.slice(0, 6)
    this.tableDateMovie = this.value.movieDataList.movies
    this.provinceDataList = this.value.provinceDataList.provinceData

    const movieType = this.value.tagsObjList
    this.movieType = movieType
      ? movieType.filter((item: any) => item.code == 'MOVIE_TYPE')
      : []
    this.movieType = this.movieType[0].values
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

  queryMovieList(val: any) {
    const arry: any = []
    val.map((item: any) => {
      this.movieType.map((it: any) => {
        if (it.key == item) {
          arry.push(it.text + '/')
        }
      })
    })
    const len = arry.join('')
    return len.substring(0, len.length - 1)
  }

  btnQueryAll(val: number) {
    this.cinemaVisible = {
      visible: true,
      id: this.value.mockObj.id,
      type: val
    }
  }
}
</script>
<style lang="less" scoped>
.left-circel {
  padding-top: 57px;
}
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
  &.sum-flex {
    padding-top: 20px;
  }
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
    &.model-type {
      font-size: 14px;
    }
  }
}
.btn-query-all {
  text-align: right;
  margin: 30px 0 10px 0;
}
.ivu-table-wrapper {
  margin: 0;
}
.advert-amount {
  padding-top: 16px;
  color: #222;
  em {
    font-size: 26px;
  }
  span {
    display: inline;
  }
}
</style>
