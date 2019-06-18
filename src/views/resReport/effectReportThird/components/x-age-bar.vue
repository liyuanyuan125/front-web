<template>
  <div class="progress-wp">
    <div class="value">10.2%</div>
    <Progress :percent="value"
              v-if="isMax"
              class="percent"
              stroke-color="#00B6CC"
              hide-info />
    <Progress :percent="value"
              v-else
              class="percent"
              stroke-color="#BCE2F0"
              hide-info />
    <div class="name">
      0～20岁
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component({})
export default class AgeBar extends ViewBase {
  @Prop({ type: Number, default: () => 0 }) value!: number
  @Prop({ type: Boolean, default: false }) isMax!: boolean
  // isMax: boolean = false
  // value: number = 50
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
.progress-wp {
  height: 147px;
  text-align: center;
  width: 45px;
  position: relative;
  .value {
    position: absolute;
    font-size: 12px;
    width: 100%;
    top: 0;
    text-align: center;
  }
  .name {
    position: absolute;
    width: 100%;
    bottom: 0;
    text-align: center;
    font-size: 10px;
    font-weight: 400;
    color: rgba(179, 188, 192);
  }
}
.percent {
  width: 100px;
  transform: rotate(-90deg);
  left: -27px;
  position: absolute;
  top: 62px;
  /deep/ .ivu-progress-inner {
    background-color: #666;
    border-radius: 0;
    .ivu-progress-bg {
      height: 20px !important;
      border-radius: 0;
    }
  }
}
</style>