<template>
  <div class="page">
    <Row class="circle-body">
      <Col :span="8" v-for="(item, index) in crirle" :key="index">
        <i-circle
          :size="200"
          :trail-width="8"
          :stroke-width="8"
          :percent="nums[index]"
          class="square"
          trail-color="#d2d2d2"
          stroke-linecap="square"
          :stroke-color="crirleColor[index]">
          <div class="circle-custom">
            <h3>{{crirle[index]}}</h3>
            <number :addNum="nums[index]">个</number>
          </div>
        </i-circle>
      </Col>
    </Row>
    <Row>
      <Col :span="24">
        <h3 class="area-title mb50">投放地区</h3>
      </Col>
      <Col :span="9">
        <Row class="put-body">
          <Col :span="10" v-for="(item, index) in statisArea" :key="index" class="area-put">
            <h3>{{statisArea[index].name}}</h3>
            <number :addNum="statisArea[index].num"></number>
          </Col>
        </Row>
      </Col>
      <Col :span="10" :offset="2">
        <CityMap :names="cityMapNames" />
      </Col>
    </Row>
    <Row>
      <Col :span="24">
        <h3 class="area-title mb30">成效概览</h3>
      </Col>
      <Col :span="24" class="pb40">
        <Table ref="selection" stripe class="tables" :columns="columns" :data="tableData"></Table>
        <Button  type="primary" class="findcinema" @click="viewCinema">查看全部城市</Button>
      </Col>
    </Row>
    <Row>
      <Col :span="24">
        <h3 class="area-title">单部城市成效</h3>
      </Col>
      <Col :span="24">
        <Select class="city-select" clearable v-model="cityId" style="width:300px">
          <Option v-for="(item, index) in items" :value="item.id" :key="index">
            {{ item.areaName }} - {{ item.provinceName }} - {{ item.cityName }}
          </Option>
        </Select>
      </Col>
      <Col :span="9">
        <Row class="put-body">
          <Col :span="10" v-for="(item, index) in cover" :key="index" class="area-put">
            <h3>{{cover[index].name}}</h3>
            <number :addNum="cover[index].num"></number>
          </Col>
        </Row>
      </Col>
      <Col :span="15">
        <div ref="container" style='height: 400px;'></div>
      </Col>
    </Row>
    <commonDlg ref="dlg" v-if="loadding" />
  </div>
</template>

<script lang="tsx">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import number from '@/views/order/dispatch/number.vue'
import CityMap from '@/components/cityMap'
import { cinemadata , querylist } from '@/api/cinemadata'
import echarts from 'echarts'
import { clean } from '@/fn/object'
import { getUser } from '@/store.ts'
import { formatCurrency } from '@/fn/string.ts'
import commonDlg from './dlg/commonDlg.vue'
import { Stats } from '@/views/pop/plan/components/areaPane'

@Component({
  components: {
    number,
    CityMap,
    commonDlg
  }
})
export default class Main extends ViewBase {
  @Prop() value: any
  loadding: any = false
  crirle: any = ['覆盖区域数', '覆盖城市', '覆盖影院']
  crirleColor: string[] = ['#fe5f5e', '#3b98ff', '#41d9c1']
  cricleNumber: any = []
  name: any = []
  reject: any = {
  }
  items: any = []
  cityId: any = ''
  effectTypeList: any = null
  dataList: any = null
  dom: any = null

  get tableData() {
    return this.items.slice(0, 8).map((item: any) => {
      return {
        ...item,
        coverPeople: formatCurrency(item.coverPeople).slice(0, -3),
        advertAmount: formatCurrency(item.advertAmount).slice(0, -3),
      }
    })
  }

  get echartmsg() {
    return {
      beginDate: this.value.mockObj.beginDate,
      endDate: this.value.mockObj.endDate,
      cityId: this.cityId
    }
  }

  get systemCode() {
    return getUser()!.systemCode
  }

  get columns() {
    return [
      { title: '区域', key: 'areaName', align: 'center'},
      { title: '省份', key: 'provinceName', align: 'center'},
      { title: '城市', key: 'cityName', align: 'center'},
      { title: '覆盖人次', key: 'coverPeople', align: 'center'},
      { title: '广告花费／¥', key: 'advertAmount', align: 'center'},
    ]
  }

  get nums() {
    const value = this.value.provinceDataList || 0
    if (value) {
      return [value.areaCount, value.cityCount, value.cinemaCount]
    } else {
      return [0, 0, 0]
    }
  }

  get statisArea() {
    const value = this.value.provinceDataList || {}
    return [{
      name: '区域数',
      num: value.areaCount ? value.areaCount : 0
    }, {
      name: '省份数',
      num: value.provinceCount ? value.provinceCount : 0
    }, {
      name: '城市数',
      num: value.cityCount ? value.cityCount : 0
    }, {
      name: '影院数',
      num: value.cinemaCount ? value.cinemaCount : 0
    }]
  }

  get cover() {
    const value = this.value.provinceDataList || {}
    return [{
      name: '覆盖人次',
      num: value.areaCount ? value.areaCount : 0
    }, {
      name: '覆盖场次',
      num: value.provinceCount ? value.provinceCount : 0
    }]
  }

  viewCinema() {
    this.loadding = true
    this.$nextTick(() => {
      (this.$refs.dlg as any).init({
        id: this.value.mockObj.id,
        beginDate: this.value.mockObj.beginDate,
        endDate: this.value.mockObj.endDate,
        planDataType: 4,
      })
    })
  }

  resize() {
  }

  created() {
    this.searchs()
    this.cityList()
  }

  get cityMapNames() {
    const provinceName = (this.items || []).map((it: any) => {
      return it.provinceName
    })
    const city = (this.items || []).map((it: any) => {
      return it.cityName
    })
    return [...provinceName, ...city]
  }

  async cityList() {
    try {
      const { data: {
        items: {
          provinceDataList: { provinceData }
        }
      } } = await cinemadata({
        id: this.value.mockObj.id,
        beginDate: this.value.mockObj.beginDate,
        endDate: this.value.mockObj.endDate,
        planDataType: 4,
      })
      this.items = provinceData || []
      this.cityId = this.items[0].id || ''
    } catch (ex) {
    }
  }

  async searchs() {
    try {
      const {
        data
      } = await querylist(clean({
        beginDate: this.value.mockObj.beginDate,
        endDate: this.value.mockObj.endDate,
        cityId: this.cityId
      }))
      const data1 = (data.dataList || []).map((it: any) => {
          return it.date
      })
      const data2 = (data.dataList || []).map((it: any) => {
          return it.data
      })
      const option: any = {
        tooltip: {
          trigger: 'axis',
          formatter: ' {c0}<br />{b0}',
          padding: [ 5, 10 ],
          backgroundColor: '#FE8135'
        },
        legend: {
          data: ['曝光分布']
        },
        color: ['#FE8135'],
        xAxis: [
          {
            type : 'category',
            boundaryGap : false,
            axisLabel: {
              color: '#444'
            },
            axisLine: {
              lineStyle: {
                color: '#EFEFEF'
              }
            },
            axisTick: {
              show: false
            },
            data: ['', ...data1]
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: ['#EFEFEF']
              }
            },
            axisLabel: {
              color: '#444',
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '曝光分布',
            type: 'line',
            stack: '总量',
            areaStyle: {
              color: '#FE8135',
              opacity: 0.2005,
            },
            data: [0, ...data2],
          }
        ]
      }
      this.dom  = echarts.init(this.$refs.container as any)
      this.dom.setOption(option)
    } catch (ex) {
    }
  }

  // mounted() {
  //   this.$nextTick(() => {
  //     window.addEventListener('resize', this.resize)
  //   })
  // }

  @Watch('echartmsg', { deep: true })
  watchArea(val: any) {
    this.searchs()
  }
}
</script>

<style lang="less" scoped>
@cicle-color: rgba(34, 34,34, 1);
.page {
  .findcinema {
    float: right;
    height: 40px;
    margin-right: 50px;
  }
  .tables {
    min-height: 150px;
  }
  /deep/ .ivu-table-wrapper {
    margin: 30px;
  }
  .name-input {
    margin-top: 30px;
    margin-left: 30px;
    margin-bottom: 30px;
    width: 300px;
    margin-right: 20px;
    /deep/ .ivu-input {
      height: 40px;
      line-height: 40px;
    }
  }
  .put-body {
    padding-left: 30px;
    padding-top: 40px;
    .area-put {
      &:nth-child(2n - 1) {
        margin-right: 20px;
      }
      height: 120px;
      margin-bottom: 20px;
      text-align: center;
      background: rgba(255, 248, 242, 1);
      h3 {
        margin-top: 20px;
        font-size: 24px;
        font-weight: 500;
        color: #444;
        margin-bottom: 14px;
      }
    }
    /deep/ span {
      font-size: 26px;
      font-weight: 500;
      color: rgba(254, 129, 53, 1);
    }
  }
}
.circle-body {
  text-align: center;
  padding: 60px 50px;
  .square {
    h3 {
      font-size: 14px;
      margin-bottom: 15px;
      font-weight: 400;
      color: @cicle-color;
    }
  }
}
.circle-custom {
  /deep/ span {
    font-size: 26px;
    font-weight: 500;
    color: @cicle-color;
  }
}
.area-title {
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding-left: 30px;
  background: rgba(249, 249, 249, 1);
  border-radius: 2px 2px 0 0;
  h3 {
    color: @cicle-color;
  }
  span {
    float: right;
  }
}
/deep/ .city-map {
  margin-top: -30px;
  transform: scale(0.72);
  background: url(/img/map.d8b2bd68.png) no-repeat;
  background-size: 100%;
}
.mb50 {
  margin-bottom: 50px;
}
.mb30 {
  margin-bottom: 30px;
}
.pb40 {
  padding-bottom: 40px;
}
.city-select {
  margin: 30px 0 20px 30px;
}
</style>
