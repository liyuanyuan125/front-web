<template>
  <div class="page">
      <div @click="active(item.label)" :class="['tag', invalue == item.label ? 'activeClass' : '']" v-for="item in tagMess" :key="item.label">
        {{item.name}}
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
    @Prop({default: 1}) value!: number
    @Prop({type: Array, default: () => []}) tagMess!: any[]
    invalue = this.value

    active(id: any) {
      this.invalue = id
      this.$emit('input', this.invalue)
    }

    @Watch('value')
    watchvalue(val: any) {
      this.invalue = val
    }
}
</script>

<style lang="less" scoped>
.page {
  display: flex;
  margin-top: 5px;
  .tag {
    box-sizing: content-box;
    text-align: center;
    margin-right: 30px;
    width: 180px;
    height: 38px;
    line-height: 38px;
    color: #00202d;
    font-size: 14px;
    border: 1px solid #fff;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    cursor: pointer;
  }
  .activeClass {
    color: #fff;
    background: #00202d;
    border-radius: 4px;
    border: 1px solid #00202d;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      right: -16px;
      top: -16px;
      background: url(./vadver/assets/sure.png);
      width: 36px;
      height: 36px;
      background-size: 36px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
    }
  }
}
</style>
