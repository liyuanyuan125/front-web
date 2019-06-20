<template>
  <div class="sex-wp">
    <div class="row">
      <div class="cell">
        <div>{{data.malePercent}}%</div>
        <Icon size="30" color="#00b6cc" type="ios-man" />
      </div>
      <div class="cell">
        <div>{{data.femalePercent}}%</div>
        <Icon size="30" color="#da6c70" type="ios-woman" />
      </div>
    </div>
    <div>
      <Progress :percent="data.malePercent"
                class="sex-percent"
                stroke-color="#00b6cc"
                hide-info />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component({})
export default class SexCompare extends ViewBase {
  @Prop({ type: Object, default: () => ({}) }) data!: any
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
.sex-wp {
  .row {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 50px;
    .cell {
      max-width: 90px;
      text-align: center;
    }
  }
}
.sex-percent {
  width: 100%;
  /deep/ .ivu-progress-inner {
    background-color: #da6c70;
    border-radius: 0;
    .ivu-progress-bg {
      border-radius: 0;
      height: 50px !important;
    }
  }
}
</style>