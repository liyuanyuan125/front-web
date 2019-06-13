<template>
  <ul class="sex-group-list">
    <li class="sex-group-item"
        v-for=" (item,index) in sexData "
        :key="index">
      <Progress :percent="item.femalePercent"
                class="sex-bar-percent left"
                stroke-color="#DA6C70"
                hide-info />
      <span class="nick-name">{{item.name}}</span>
      <Progress :percent="item.malePercent"
                class="sex-bar-percent"
                stroke-color="#00B6CC"
                hide-info />
    </li>
  </ul>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component({
  components: {}
})
export default class SexPane extends ViewBase {
  @Prop({ type: Array, default: () => [] }) sexData!: any[]
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '../kolcompare.less';
.sex-bar-percent {
  width: 35%;
  /deep/ .ivu-progress-inner {
    top: -1px;
    background-color: transparent;
    .ivu-progress-bg {
      border-radius: 0 100px 100px 0;
    }
  }
}
.sex-bar-percent.left {
  /deep/ .ivu-progress-inner {
    transform: rotate(-180deg);
  }
}
// .sex-bar-percent {
//   /deep/ .ivu-progress-inner {
//     .ivu-progress-bg {
//       border-radius: 0 100px 100px 0;
//     }
//   }
// }
.total-pane {
  ul {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
}
.sex-group-list {
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  align-items: flex-start;
  flex: 1;
  width: 100%;
}
.sex-group-item {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  .nick-name {
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    min-width: 20%;
    display: inline-block;
    .cut-text;
  }
}
</style>