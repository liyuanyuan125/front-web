<template>
  <div class="page">
    <ul class="">
      <li @click="active(index)" :class="step == index? 'liactive' : ''" v-for="(it, index) in name" :key='index'>
        {{it.name}}
      </li>
    </ul>
    <div :style="{transform: `translate3d(${66*step}px, 0px, 0px)`, width: step == 4 ? '54px' : '36px'}" class="active"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class App extends ViewBase {
  @Prop() value!: number
  name: any = [
    {name: '微博', id: 1},
    {name: '微信', id: 2},
    {name: '抖音', id: 3},
    {name: '快手', id: 4},
    {name: '小红书', id: 5},
  ]
  step = this.value

  active(index: number) {
    this.step = index
    this.$emit('input', this.step)
  }
}
</script>

<style lang="less" scoped>
@color: #3b98ff;
.page {
  background: rgba(0, 31, 44, .8);
}
.page ul {
  height: 69px;
  display: flex;
  li {
    font-size: 18px;
    line-height: 69px;
    margin-left: 30px;
    text-align: center;
    color: rgba(255, 255, 255, .6);
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }
  .liactive {
    color: #fff;
  }
}
.active {
  width: 36px;
  height: 2px;
  background: @color;
  margin-left: 30px;
  transition: transform 0.3s ease-in-out;
}
</style>

