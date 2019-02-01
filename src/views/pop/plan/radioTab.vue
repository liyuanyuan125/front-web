<template>
  <div class="page">
    <div @click="active(item.key)" :style="{width: width + 'px'}" :class="['tag', invalue == item.key ? 'activeClass' : '']" v-for="item in msg" :key="item.key">
      {{item.text}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
    @Prop({default: 1}) value!: number
    @Prop() typeName!: any
    @Prop({type: Array, default: () => []}) tagMess!: any[]
    @Prop({default: () => 80}) width: any
    invalue = this.value
    get msg() {
      let msg = [...this.tagMess]
      if (this.typeName != '1') {
        msg = msg.filter((item: any) => item.text != '未知')
        const flag = this.tagMess.map((it: any) => it.text).includes('不限')
        if (!flag) {
          msg.unshift({
            text: '不限',
            key: 0
          })
        }
      }
      return msg
    }
    active(id: any) {
      this.invalue = id
      this.$emit('input', this.invalue)
    }
}
</script>

<style lang="less" scoped>
.page {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
  width: 1000px;
  .tag {
    box-sizing: content-box;
    text-align: center;
    margin-right: 30px;
    min-width: 80px;
    height: 26px;
    line-height: 26px;
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
.form-cell .tag:first-child {
  margin-bottom: 20px;
}
</style>
