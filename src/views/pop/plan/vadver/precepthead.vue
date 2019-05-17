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
      <Col span="5" class="item">
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
      <Col span="4" class="item">
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
  .item {
    padding: 20px 10px;
    color: #26344b;
    font-size: 14px;
  }
  .number {
    text-align: center;
    font-size: 26px;
    margin-top: 30px;
    /deep/ span::after {
      content: "万";
    }
  }
  dl {
    display: flex;
    height: 40px;
    line-height: 40px;
    dd {
      width: 60px;
    }
    dt {
      margin-left: 10px;
    }
  }
}

</style>
