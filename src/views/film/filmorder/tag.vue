<template>
  <div class="pages">
      <div @click="active(item.key)" :class="['tag', invalue == item.key ? 'activeClass' : '']" v-for="item in tagMess" :key="item.key">
        {{item.text}}
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
    @Prop({type: Number, default: () => 1}) nus!: any[]
    invalue = this.nus
    content = ''
    mounted() {
      this.active(this.nus)
    }
    active(id: any) {
      this.invalue = id
      this.$emit('input', this.invalue)
    }

    @Watch('value')
    watchvalue(val: any) {
      this.invalue = this.nus
    }
}
</script>

<style lang="less" scoped>
.pages {
  margin-bottom: 10px;
  .tag {
    width: 100px;
    margin-bottom: 18px;
    display: block;
    text-align: center;
    margin-right: 30px;
    height: 40px;
    line-height: 40px;
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
      content: '\2713';
      color: #fff;
      position: absolute;
      right: -8px;
      top: -8px;
      border: 1px solid #00202d;
      background: #00202d;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
      z-index: 999;
    }
  }
}
</style>
