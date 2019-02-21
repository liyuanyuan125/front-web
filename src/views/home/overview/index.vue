<template>
  <div class="page">
    <div class='t-title'>账户概览</div>
    <Row class='ov-list'>
        <Col class='ov-list-img'></Col>
        <Col class='ov-list-img'></Col>
        <Col class='ov-list-img'></Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
}
</script>

<style lang="less" scoped>
.t-title {
  width: 100%;
  height: 50px;
  background: rgba(249, 249, 249, 1);
  border-radius: 2px 2px 0 0;
  line-height: 50px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(36, 129, 215, 1);
  padding-left: 30px;
}
.ov-list {
  background: #fff;
  padding-top: 20px;
  .ov-list-img {
    width: 32%;
    display: inline-block;
    height: 140px;
    border-radius: 2px;
    margin-left: 1%;
    margin-bottom: 12px;
    border: 1px solid #ccc;
  }
}
</style>
