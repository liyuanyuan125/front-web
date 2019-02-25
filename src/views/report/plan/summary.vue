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
            <number :addNum="123"></number>
          </div>
        </i-circle>
      </Col>
    </Row>
    <h3 class="layout-title">投放人群</h3>
    <h3 class="layout-title">投放影院</h3>
    <h3 class="layout-title">投放影片</h3>
    <h3 class="layout-title">投放地区</h3>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import number from '@/views/order/dispatch/number.vue'
import CityMap from '@/components/cityMap'

@Component({
  components: {
    number
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Object }) value: any
  crirle: any = ['广告花费', '覆盖人次', '覆盖影院']
  crirleColor: string[] = ['#fe5f5e', '#3b98ff', '#41d9c1']

  mounted() {}
}
</script>
<style lang="less">
.circle-body {
  padding: 60px 50px;
}
</style>
