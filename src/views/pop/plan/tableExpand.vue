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
        <p>投放排期：{{formatTimes(row.beginDate) || '-'}}</p>
        <p>投放结束：{{formatTimes(row.endDate) || '-'}}</p>
        <p>投放天数：{{row.cycle || '-'}}</p>
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
        <div v-if="getStauts == 1 || getStauts == 2">
          <p><span>查看</span></p>
          <p><span>编辑</span></p>
          <p><span>取消</span></p>
          <p><span @click="relevanceAdv">关联广告片</span></p>
        </div>
        <div v-else-if="getStauts ==  4 ">
          <p><span>查看</span></p>
          <p><span>支付</span></p>
          <p><span>取消</span></p>
          <p><span>关联广告片</span></p>
        </div>
        <div v-else-if="getStauts ==  5 ">
          <p><span>查看</span></p>
          <p><span @click="relevanceAdv">关联广告片</span></p>
        </div>
        <div v-else-if="getStauts == 3 || getStauts == 6 || getStauts == 7 || getStauts == 8 || getStauts == 9 ">
          <p><span>查看</span></p>
        </div>
        <div v-else-if="getStauts == 10">
          <p><span>查看</span></p>
          <p><span>编辑</span></p>
        </div>
      </Col>
    </Row>
    <relevanceDlg v-model="relevanVis" v-if="relevanVis.visible"></relevanceDlg>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatTimes } from '@/util/validateRules'
import { relevanceVideo, queryRelevanceList} from '@/api/plan'
import relevanceDlg from '../plan/relevanceAdVDlg.vue'

@Component({
  components: {
    relevanceDlg
  }
})
export default class Expand extends ViewBase {
  @Prop({ type: Object }) row: any

  relevanVis = {
    visible: false,
    title: '关联广告片'
  }

  get getStauts() {
    return this.row.stauts
  }
  get formatTimes() {
    return formatTimes
  }
  async relevanceAdv() {
    this.relevanVis.visible = true
  }
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
    cursor: pointer;
    display: inline-block;
  }
}
.border-right {
  border-left: solid 1px #d3e7f8;
}
</style>


