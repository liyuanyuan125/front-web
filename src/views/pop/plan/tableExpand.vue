<template>
  <div class="expands">
    <Row class="expand-row">
      <Col span="8" class="flex-box content-text row-pad">
        <p>
          <img src="./assets/default-img.png" width="80px" alt>
        </p>
        <p>待关联</p>
      </Col>
      <Col span="5" class="border-right row2 row-pad">
        <p>规格：{{row.specification}}</p>
        <p>投放排期：{{row.beginDate}}</p>
        <p>投放结束：{{row.endDate}}</p>
        <p>投放天数：{{row.cycle}}</p>
      </Col>
      <Col span="5" class="border-right row3 row-pad">
        <p>冻结金额：{{row.freezeAmoun || '-'}}</p>
        <p>广告花费：{{row.settlementAmount || '-'}}</p>
        <p>结算状态：{{row.settlementStatus || '-'}}</p>
      </Col>
      <Col span="3" class="row4 border-right row-pad">
        <p>{{row.stauts}}</p>
      </Col>
      <Col span="3" class="opear-btn row5 border-right row-pad">
        <p>查看</p>
        <p>编辑</p>
        <p>取消</p>
        <p>关联广告片</p>
      </Col>
    </Row>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Expand extends ViewBase {
  @Prop({ type: Object }) row: any
}
</script>
<style lang="less" scoped>
.expands {
  height: 100%;
  .ivu-row {
    height: 100%;
    .ivu-col {
      height: 100%;
    }
  }
}
.row-pad {
  padding: 17px 20px 10px;
  p {
    line-height: 23px;
  }
}
.content-text {
  padding: 20px 20px 10px;
  img {
    margin-right: 10px;
  }
}

.opear-btn {
  text-align: center;
  span {
    display: inline-block;
  }
}
.border-right {
  border-left: solid 1px #d3e7f8;
}
</style>


