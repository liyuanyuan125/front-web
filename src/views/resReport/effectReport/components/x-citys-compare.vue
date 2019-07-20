<template>
  <div class="citys-compare-wp">
    <ul>
      <li v-for="(item, index) in data"
          :key="index">
        <span>{{item.cityName}}</span>
        <Progress :percent="item.percent"
                  class="percent"
                  stroke-color="#36D2E5"
                  hide-info />
        <span>{{item.percent}}%</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component({})
export default class CitysCompare extends ViewBase {
  @Prop({ type: Array, default: () => [] }) data!: any[]
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
.citys-compare-wp {
  padding: 25px;
  ul {
    display: flex;
    flex-flow: column;
    align-items: center;
    height: 555px;
    justify-content: space-between;
    li {
      width: 100%;
      text-align: center;
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255);
        line-height: 14px;
        min-width: 60px;
        text-align: left;
      }
      span:last-child {
        padding-left: 10px;
      }
    }
  }
}
.percent {
  .ivu-progress {
    max-width: 120px;
  }
  /deep/ .ivu-progress-inner {
    background-color: #d8d8d8;
    border-radius: 0;
    .ivu-progress-bg {
      border-radius: 0;
    }
  }
}
</style>