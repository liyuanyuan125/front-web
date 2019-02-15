<template>
  <Modal v-model='showDlg'
  title="是否拒绝该执行单"
  :transfer='false'
  :width='720'
  :styles="{top: '30px'}"
  @on-cancel="cancel()">
    <h3 class="refuse">是否拒绝该执行单?</h3>
    <Row class="refuse-body" style="margin-top: 20px">
      <Row>
        <Col :span="4">广告片名称</Col>
        <Col :span="7"><span>{{data.videoName}}</span></Col>
      </Row>
      <Row>
        <Col :span="4">广告片规格</Col>
        <Col :span="7"><span>{{data.specification}}</span></Col>
      </Row>
      <Row>
        <Col :span="4">投放时间</Col>
        <Col :span="7"><span>{{data.beginDate}} ~ {{data.endDate}}</span></Col>
      </Row>
      <Row>
        <Col :span="4">投放天数</Col>
        <Col :span="7"><span>{{data.cycle}}天</span></Col>
      </Row>
      <Row style="margin-top: 24px">
        <Col :span="4">目标影院</Col>
        <Col :span="7"><span>{{data.cinemaCount}}家</span></Col>
      </Row>
      <Row>
        <Col :span="4">目标影厅</Col>
        <Col :span="7"><span>所有影厅</span></Col>
      </Row>
      <Row>
        <Col :span="4">目标场次</Col>
        <Col :span="7"><span>所有场次</span></Col>
      </Row>
      <Row>
        <Col :span="4">投放影片</Col>
        <Col :span="7"><span>{{data.directionType == 1 ? '标准投放' : '单片投放'}}</span></Col>
      </Row>
      <Row style="margin-top: 24px">
        <Col :span="4">目标影片</Col>
        <Col :span="18"><span  v-if='data.movieList.length > 0' v-for='item in data.movieList'>《{{item.name}}》 </span><span v-if='data.movieList.length == 0'>暂无  </span></Col>
      </Row>
      <Row>
        <Col :span="4"><span style="padding-top: 10px">预估最大金额</span></Col>
        <Col :span="7"><span class="red">{{data.estimateRevenue}}</span></Col>
      </Row>
    </Row>
    <div slot="footer" class="foot">
      <Button class="foot-cancel-button" type="info" @click="cancel">取消</Button>
      <Button class="foot-button" type="primary" @click="open">拒绝执行</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList, leafletList, carryRefuse } from '@/api/leafletDlg'
import { formatCurrency } from '@/fn/string'

@Component
export default class DlgEditCinema extends ViewBase {
  showDlg = true
  data: any = null

  init(data: any) {
    this.data = data
    this.showDlg = true
  }

  seach() {

  }

  format(money: any) {
    formatCurrency(money)
  }

  cancel() {
    this.showDlg = false
  }

  async open() {
    try {
      await carryRefuse(this.data.id)
      this.cancel()
      this.$emit('refload')
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.search-input {
  margin-left: 30px;
  .name-input {
    width: 300px;
    /deep/ .ivu-input {
      height: 40px;
      line-height: 40px;
    }
  }
  span {
    display: block;
    height: 40px;
    width: 80px;
    color: #fff;
    text-align: center;
    padding-top: 8px;
    background: rgba(59, 152, 255, 1);
  }
}
/deep/ .ivu-col-span-7 span:empty {
  &::before {
    content: '暂无';
  }
}
@cancel-color: rgba(59, 152, 255, 1);
.foot-button-box {
  width: 196px;
  height: 50px;
  margin-right: 20px;
}
.refuse {
  font-size: 16px;
  text-align: center;
}
.refuse-body {
  background: #f2f2f2;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 30px;
  margin-left: 20px;
  margin-right: 20px;
  color: #272727;
  font-size: 14px;
  .ivu-col {
    margin-bottom: 8px;
  }
}
.red {
  font-size: 24px;
  color: red;
}
.foot {
  text-align: center;
  height: 70px;
  .foot-button {
    .foot-button-box;
  }
  .foot-cancel-button {
    .foot-button-box;
    background: rgba(236, 245, 255, 1);
    border-radius: 2px;
    color: @cancel-color;
    border: 1px solid @cancel-color;
  }
}
</style>
