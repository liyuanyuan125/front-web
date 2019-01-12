<template>
  <Modal v-model='showDlg'
  title="方案确认"
  :transfer='false'
  :width='750'
  @on-cancel="cancel()">
    <div style="padding: 0 80px; text-align: center">
      <div class="mb50">
        <span class="header-title">{{forMat.name}}</span>
      </div>
      <Row class="mb20">
        <Col :span="4">投放类型</Col>
        <Col :span="18">
        <span v-if="$route.params.id == 1">映前广告&nbsp;&nbsp;(标准定向)</span>
        <span v-if="$route.params.id == 2">映前广告&nbsp;&nbsp; (按单部影片)</span>
        <span v-if="$route.params.id == 3">线下场馆</span>
      </Col>
      </Row>
      <Row class="mb20">
        <Col :span="4">广告计划</Col>
        <Col :span="11"><span>{{forMat.name}}</span></Col>
        <Col :span="4" style="text-indent: 2em">客户</Col>
        <Col :span="4"><span>{{forMat.client}}</span></Col>
      </Row>
      <Row class="mb20">
        <Col :span="4">投放排期</Col>
        <Col :span="11"><span>{{forMat.time}}</span></Col>
        <Col :span="4">投放周期</Col>
        <Col :span="3"><span>{{forMat.longTime}}天</span></Col>
      </Row>
      <Row class="mb50">
        <Col :span="4">投放影院</Col>
        <Col :span="11"><span>500家影院</span></Col>
        <Col :span="4">人群画像</Col>
        <Col :span="4"><span>{{forMat.sex}}性／30-34岁</span></Col>
      </Row>
      <Row class="mb20 pd5">
        <Col :span="5" class="pd5">冻结金额（元）</Col>
        <Col :span="9"><span class="money">¥ {{forMat.ceil}}</span></Col>
        <Col :span="4" class="pd5">预估覆盖人次</Col>
        <Col :span="3" offset="1"><span class="money">{{forMat.man}}</span></Col>
      </Row>
    </div>
    <div slot="footer" class="foot">
        <Button class="foot-button" type="primary" @click="open">开启投放</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  showDlg = false
  forMat: any = {}
  init(forMat: any) {
    this.showDlg = true
    this.forMat = forMat
  }

  cancel() {
    this.showDlg = false
  }

  open() {

  }
}
</script>

<style lang="less" scoped>
.foot {
  text-align: center;
  height: 90px;
  .foot-button {
    background-color: #fe8135;
    width: 196px;
    height: 50px;
  }
}
.header-title {
  font-weight: 500;
  font-style: normal;
  font-size: 20px;
  color: #fe8135;
  padding: 5px 15px 8px 15px;
  border-bottom: 2px solid #fe8135;
}
/deep/ .ivu-modal-content {
  margin-top: -40px;
}
.ivu-row .money {
  font-weight: 500;
  font-size: 20px;
  color: #f90;
}
.ivu-row {
  font-size: 14px;
  color: #888;
  text-align: left;
  span {
    color: #333;
  }
}
.pd5 {
  padding-top: 5px;
}
.mb50 {
  margin-bottom: 50px;
}
.mb10 {
  margin-bottom: 10px;
}
.mb20 {
  margin-bottom: 20px;
}
</style>
