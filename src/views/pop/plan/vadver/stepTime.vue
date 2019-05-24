<template>
  <div class="app">
    <dl v-for="item in step" :key="item.id">
      <dd :class="(value + 1) >= item.id ? 'active' : ''">{{item.id}}</dd>
      <dt>{{item.key}}</dt>
    </dl>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class App extends ViewBase {
  @Prop() value!: number
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
.app {
  display: flex;
  background: rgba(0, 32, 45, 0.3);
  height: 50px;
  border-radius: 25px;
  dl {
    cursor: default;
    flex: 1;
    line-height: 50px;
    display: flex;
    dd {
      width: 40px;
      height: 40px;
      align-self: center;
      margin-left: 4px;
      border-radius: 50%;
      background: rgba(0, 32, 45, 0.6);
      text-align: center;
      line-height: 40px;
      font-size: 24px;
      color: rgba(0, 32, 45, 1);
    }
    dt {
      margin-left: 10px;
      font-size: 16px;
      color: #f9d85e;
    }
    .active {
      background: rgba(249, 216, 94, 1);
    }
  }
}
</style>

