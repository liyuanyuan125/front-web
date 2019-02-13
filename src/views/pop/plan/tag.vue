<template>
  <div class="page">
      <div @click="active(item.label)" :class="['tag', invalue == item.label ? 'activeClass' : '']" v-for="item in tagMess" :key="item.label">
        {{value}}{{item.name}}
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
    width: 120px;
    height: 30px;
    line-height: 30px;
    color: #222;
    font-size: 14px;
    border-radius: 2px;
    border: 1px solid rgba(210, 210, 210, 1);
    cursor: pointer;
  }
  .activeClass {
    color: #fff;
    background: rgba(254, 129, 53, 1);
    border: 1px solid rgba(254, 129, 53, 1);
  }
}
</style>
