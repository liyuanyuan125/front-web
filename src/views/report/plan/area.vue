<template>
  <div class="page">
    <Row class="circle-body">
      <Col :span="8" v-for="(item, index) in crirle" :key="index">
        <i-circle
          :size="200"
          :trail-width="10"
          :stroke-width="10"
          :percent="10"
          class="square"
          trail-color="#d2d2d2"
          stroke-linecap="square"
          :stroke-color="crirleColor[index]">
          <div class="circle-custom">
            <h3>{{crirle[index]}}</h3>
            <number :addNum="123">个</number>
          </div>
        </i-circle>
      </Col>
    </Row>
    <Row>
      <Col :span="24">
        <h3 class="area-title mb50">投放地区</h3>
      </Col>
      <Col :span="10">
        <Row class="put-body">
          <Col :span="8" class="area-put">
            <h3>区域</h3>
          </Col>
        </Row>
      </Col>
      <Col :span="10" :offset="3">
        <CityMap />
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
      <Col :span="24"><AreaSelect class="name-input" show-region v-model="name" /></Col>
      <Col :span="10">
        <Row class="put-body">
          <Col :span="8" class="area-put">
            <h3>覆盖人次</h3>
          </Col>
        </Row>
      </Col>
      <Col :span="14">
      </Col>
    </Row>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import number from '@/views/order/dispatch/number.vue'
import CityMap from '@/components/cityMap'
import AreaSelect from '@/components/areaSelect'

@Component({
  components: {
    number,
    CityMap,
    AreaSelect
  }
})
export default class Main extends ViewBase {
  crirle: any = ['覆盖区域数', '覆盖城市', '覆盖影院']
  crirleColor: string[] = ['#fe5f5e', '#3b98ff', '#41d9c1']
  cricleNumber: any = []
  name: any = []
  reject: any = {
  }
  get tableData() {
    return []
  }
  get columns() {
    return [
      { title: '区域', key: 'code', align: 'center'},
      { title: '省份', key: 'shortName', align: 'center'},
      { title: '城市', key: 'seatCount', align: 'center'},
      { title: '覆盖人次', key: 'seatCount', align: 'center'},
      { title: '广告花费／¥', key: 'seatCount', align: 'center'},
    ]
  }
  viewCinema() {

  }

  @Watch('name', { deep: true })
  watchArea(val: number[]) {
    this.reject.areaCode = val[0] == 0 ? '' : val[0]
    this.reject.provinceId = val[1] == 0 ? '' : val[1]
    this.reject.cityId = val[2] == 0 ? '' : val[2]
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
      height: 120px;
      text-align: center;
      background: rgba(255, 248, 242, 1);
      h3 {
        margin-top: 15px;
        font-size: 24px;
        color: rgba(68, 68, 68, 1);
      }
    }
  }
}
.circle-body {
  text-align: center;
  .square {
    margin: 70px 0 90px;
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
  width: 100%;
  height: 420px;
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
</style>
