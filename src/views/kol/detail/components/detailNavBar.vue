<template>
  <div class='wp'>
    <div class='title'>
      {{titleText}}
    </div>
    <slot name="item"></slot>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component({})
export default class Main extends ViewBase {
  @Prop({ type: String, default: '' }) titleText!: string
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
.wp {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
  .title {
    margin-right: 15px;
    font-size: 15px;
    color: #fff;
  }
  span { padding-left: 15px; }
}
</style>