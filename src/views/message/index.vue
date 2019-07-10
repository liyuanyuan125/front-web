<template>
  <div class="page">
    <div class='all'>
    	<span>全部标为已读</span>
    </div>
    <div  class='list' style='cursor: pointer;' @click='jump()'>
    	<!-- <img @click='jump()' style='width: 100%;height: 100%;' src="./assets/list.png" alt=""> -->
        <Col :span='2' class='respan'><span></span></Col>
        <Col :span='1' class='imgs'><img src="./assets/bac.png" alt=""></Col>
        <Col :span='3' class='over'>紧急下刊</Col>
        <Col :span='16' class='leg'>广告片【 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》</Col>
        <Col :span='2' class='time'>13:41</Col>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class MessagePage extends ViewBase {
  jump() {
    this.$router.push({ name: 'message-info' })
  }
}
</script>

<style lang="less" scoped>
.page {
  position: relative;
}
.all {
  height: 30px;
  margin-bottom: 20px;
  span {
    display: block;
    width: 138px;
    height: 30px;
    background: rgba(0, 32, 45, 1);
    border-radius: 15px;
    color: #fff;
    text-align: center;
    line-height: 30px;
    float: right;
    margin-right: 15px;
    cursor: pointer;
  }
}
.list {
  height: 100px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 5px;
  .respan {
    span {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: #da6c70;
      margin-top: 43px;
      border-radius: 50%;
      margin-left: 53%;
    }
  }
  .imgs {
    width: 30px;
    margin-top: 35px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .over {
    height: 16px;
    font-size: 16px;
    font-weight: 500;
    color: #00202d;
    line-height: 100px;
    text-align: left;
    margin-left: 1.5%;
    width: 10.5%;
  }
  .leg {
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 32, 45, 1);
    line-height: 100px;
    text-align: left;
  }
  .time {
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 32, 45, 0.5);
    line-height: 100px;
    text-align: center;
  }
}
</style>
