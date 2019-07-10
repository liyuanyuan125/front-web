<template>
  <div class="page">
    <div class='all'>
    	<span class='left'  @click='back'><i></i> &nbsp;返回列表</span>
    	<span class='right'>全部标为已读</span>
    </div>
    <div class='list' style='padding: 28px;cursor: pointer;'>
    	<img style='width: 100%;height: 100%;' src="./assets/info.png" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class MessagePage extends ViewBase {
  back() {
    this.$router.go(-1)
  }
}
</script>

<style lang="less" scoped>
.page {
  position: relative;
}
.all {
  height: 30px;
  padding: 28px;
  .left {
    float: left;
    color: #fff;
    font-size: 18px;
    font-weight: 400;
    line-height: 30px;
    cursor: pointer;
    i {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-left: 2px solid #fff;
      border-top: 2px solid #fff;
      transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);     /* IE 9 */
      -moz-transform: rotate(-45deg);    /* Firefox */
      -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
      -o-transform: rotate(-45deg);  /* Opera */
    }
  }
  .right {
    display: block;
    width: 138px;
    height: 30px;
    background: rgba(0, 32, 45, 1);
    border-radius: 15px;
    color: #fff;
    text-align: center;
    line-height: 30px;
    float: right;
    cursor: pointer;
  }
}
</style>
