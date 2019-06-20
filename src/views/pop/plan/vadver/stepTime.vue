<template>
  <div class="app">
    <ul class="step">
      <li v-for="(item, index) in step" :key="item.id"
        :class="[(value.id) >= item.id ? 'active' : '', (value.id * 1 + 1) < item.id  ? 'default' : '']"
      >
        <span :class="[(value.id) >= item.id ? 'actve-span' : '', (value.id)  < item.id ? 'default-span' : '']" v-if="index!=3"></span>
      </li>
    </ul>
    <ul class="step-text">
      <li v-for="(item) in step" :key="item.id" :class="[(value.id) >= item.id ? 'active' : '',
        (value.id * 1 + 1) < item.id  ? 'default' : '']">
        {{item.key}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class App extends ViewBase {
  @Prop() value!: any
  step = [{
    key: '推广设置',
    id: 1
  }, {
    key: '定向设置',
    id: 2
  }, {
    key: '推广方案',
    id: 3
  }, {
    key: '创建完成',
    id: 4
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
        content: "●";
        display: block;
        color: #00202d;
        width: 40px;
        height: 40px;
        align-self: center;
        margin-left: 4px;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        font-size: 24px;
        background: #fff;
        box-shadow: 0 5px 9px 1px rgba(0, 0, 0, 0.33);
      }
      span {
        position: absolute;
        left: 44px;
        top: 19px;
        width: calc(100% - 44px);
        height: 2px;
        background: #fff;
      }
      .actve-span {
        width: 100%;
        background: #00202d no-repeat;
        transition: all .4s ease-in-out;
      }
    }
    .default {
      &::before {
        content: "";
        display: block;
        width: 40px;
        height: 40px;
        align-self: center;
        margin-left: 4px;
        border-radius: 50%;
        text-align: center;
        border: 2px solid #fff;
        opacity: .4;
        line-height: 40px;
        font-size: 24px;
        background: rgba(0, 0, 0, 0);
        box-shadow: 0 5px 9px 1px rgba(0, 0, 0, 0);
      }
    }
    .default-span {
      opacity: .4;
    }
    .active {
      &::before {
        content: '\2713';
        color: #fff;
        background: rgba(0, 32, 45, 1);
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
    .default {
      opacity: .4;
    }
    .active {
      color: rgba(0, 32, 45, 1);
    }
  }
}
</style>

