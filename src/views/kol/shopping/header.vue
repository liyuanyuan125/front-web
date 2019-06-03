<template>
  <div class="app">
    <Row>
      <Col :sapn="14" :offset="5">
        <ul class="step">
          <li v-for="(item, index) in step" :key="item.id" :class="(value) >= item.id ? 'active' : ''">
            <span :class="(value) > item.id ? 'actve-span' : ''" v-if="index!=2"></span>
          </li>
        </ul>
        <ul class="step-text">
          <li v-for="(item) in step" :key="item.id" :class="(value) >= item.id ? 'active' : ''">
            {{item.key}}
          </li>
        </ul>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class App extends ViewBase {
  @Prop({default: 1}) value!: number
  step = [{
    key: '提交预定',
    id: 1
  }, {
    key: '上传物料',
    id: 2
  }, {
    key: '支付订单',
    id: 3
  }]
}
</script>

<style lang="less" scoped>
@keyframes animatedBackground {
  from { background-size: 0; }
  to { background-size: 100%; }
}
.app {
  .step {
    display: flex;
    cursor: default;
    height: 50px;
    line-height: 50px;
    li {
      flex: 1;
      position: relative;
      transition: all .4s ease-in-out;
      &::before {
        content: "";
        display: block;
        width: 40px;
        height: 40px;
        align-self: center;
        margin-left: 4px;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        font-size: 24px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 5px 9px 1px rgba(0, 0, 0, 0.33);
      }
      span {
        position: absolute;
        left: 44px;
        top: 19px;
        width: calc(100% - 44px);
        height: 2px;
        background: rgba(255, 255, 255, 0.5);
      }
      .actve-span {
        width: 100%;
        background: #fff no-repeat;
        transition: all .4s ease-in-out;
      }
    }
    .active {
      &::before {
        content: "●";
        color: #00202d;
        background: #fff;
        border: 2px solid rgb(255, 255, 255);
        box-shadow: 0 5px 9px 1px rgba(0, 0, 0, 0.33);
      }
    }
  }
  .step-text {
    display: flex;
    li {
      flex: 1;
      margin-bottom: 30px;
      color: #fff;
    }
    .active {
      color: rgba(0, 32, 45, 1);
    }
  }
}
</style>