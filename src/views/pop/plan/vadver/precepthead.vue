<template>
  <div class="precept-box">
    <Row class="precept" :gutter="16">
      <Col span="5" class="item">
        <div>
          <p class="title">曝光人次预估</p>
          <p>
            <Number :addNum="1234" />
          </p>
        </div>
      </Col>
      <Col span="5" class="item">
        <div>
          <p class="title">投放场次数预估</p>
          <p>
            <Number :addNum="1234" />
          </p>
        </div>
      </Col>
      <Col span="5" class="item">
        <div>
          <p class="title">预估花费</p>
          <p>
            <Number :addNum="1234" />
          </p>
        </div>
      </Col>
      <Col span="5" class="item">
        <dl>
          <dd>计划名称</dd>
          <dt></dt>
        </dl>
        <dl>
          <dd>广告片</dd>
          <dt></dt>
        </dl>
        <dl>
          <dd>投放排期</dd>
          <dt></dt>
        </dl>
      </Col>
      <Col span="4" class="item">
        <dl>
          <dd>客户</dd>
          <dt></dt>
        </dl>
        <dl>
          <dd>广告规格</dd>
          <dt></dt>
        </dl>
        <dl>
          <dd>投放周期</dd>
          <dt></dt>
        </dl>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Number from '@/components/number.vue'
@Component({
  components: {
    Number
  }
})
export default class App extends ViewBase {
  step = 0
}
</script>

<style lang="less" scoped>
.precept-box {
  margin-left: 30px;
  .item {
    padding: 20px 10px;
    color: #26344b;
    font-size: 14px;
  }
}

</style>
