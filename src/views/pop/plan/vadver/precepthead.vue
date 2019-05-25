<template>
  <div class="precept-box">
    <Row class="precept" :gutter="16">
      <Col span="5" class="item">
        <div>
          <p class="title">曝光人次预估</p>
          <p class="number">
            <Number :addNum="1234" />
          </p>
        </div>
      </Col>
      <Col span="5" class="item">
        <div>
          <p class="title">投放场次数预估</p>
          <p class="number">
            <Number :addNum="1234" />
          </p>
        </div>
      </Col>
      <Col span="5" class="item">
        <div>
          <p class="title">预估花费</p>
          <p class="number">
            <Number :addNum="1234" />
          </p>
        </div>
      </Col>
      <Col span="5" class="item item-dl">
        <dl>
          <dd>计划名称</dd>
          <dt>猎鹰计划</dt>
        </dl>
        <dl>
          <dd>广告片</dd>
          <dt>还有谁</dt>
        </dl>
        <dl>
          <dd>投放排期</dd>
          <dt>7天</dt>
        </dl>
      </Col>
      <Col span="4" class="item item-dl">
        <dl>
          <dd>客户</dd>
          <dt>万达营业</dt>
        </dl>
        <dl>
          <dd>广告规格</dd>
          <dt>6s</dt>
        </dl>
        <dl>
          <dd>投放周期</dd>
          <dt>14天</dt>
        </dl>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Number from '@/components/number.vue'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    Number
  }
})
export default class App extends ViewBase {

  formatDate(data: any) {
    return data ? moment(data).format(timeFormat) : '暂无'
  }
}
</script>

<style lang="less" scoped>
.precept-box {
  margin-left: 30px;
  margin-right: 10px;
  .precept {
    padding: 0 30px;
    height: 136px;
    background: rgba(0, 32, 45, 1);
    border-radius: 5px;
    opacity: 0.9;
  }
  .item {
    color: #26344b;
    font-size: 14px;
    .title {
      margin-top: 30px;
      font-weight: 400;
      color: #fff;
      opacity: .8;
    }
  }
  .number {
    font-size: 30px;
    margin-top: 20px;
    color: #fff;
    /deep/ span::after {
      content: "万";
    }
    /deep/ span::before {
      content: "≈";
    }
  }
  .item-dl {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    height: 100%;
  }
  dl {
    display: flex;
    height: 30px;
    line-height: 30px;
    width: 100%;
    dd {
      width: 60px;
      color: #fff;
      opacity: .8;
    }
    dt {
      margin-left: 10px;
      color: #fff;
    }
  }
}
</style>
