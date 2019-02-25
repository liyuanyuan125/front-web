<template>
  <div class="page">
    <Row class="circle-body">
      <Col :span="8" v-for="(item, index) in crirle" :key="index">
        <i-circle
          :size="200"
          :trail-width="8"
          :stroke-width="8"
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
      <Col :span="10"></Col>
      <Col :span="10">
        <CityMap />
      </Col>
    </Row>
    <Row>
      <Col :span="24">
        <h3 class="area-title mb30">成效概览</h3>
      </Col>
      <Col></Col>
    </Row>
    <Row>
      <Col :span="24">
        <h3 class="area-title">单部城市成效</h3>
      </Col>
      <Col></Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import number from '@/views/order/dispatch/number.vue'
import CityMap from '@/components/cityMap'

@Component({
  components: {
    number,
    CityMap
  }
})
export default class Main extends ViewBase {
  crirle: any = ['覆盖区域数', '覆盖城市', '覆盖影院']
  crirleColor: string[] = ['#fe5f5e', '#3b98ff', '#41d9c1']
  cricleNumber: any = []
}
</script>

<style lang="less" scoped>
@cicle-color: rgba(34, 34,34, 1);
.circle-body {
  text-align: center;
  .square {
    margin: 30px 0;
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
  background: url(/img/map.d8b2bd68.png) no-repeat;
  background-size: 100%;
}
.mb50 {
  margin-bottom: 50px;
}
.mb30 {
  margin-bottom: 30px;
}
</style>
