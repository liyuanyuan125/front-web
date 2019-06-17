<template>
  <div class="page">
    <ul class="" ref="uls">
      <li @click="active(index)" :class="step == index? 'liactive' : ''" v-for="(it, index) in name" :key='index'>
        <span>{{it.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class App extends ViewBase {
  @Prop({ default: 1}) value!: number
  name: any = [
    {name: '全渠道', id: 1},
    {name: '微博', id: 2},
    {name: '微信', id: 3},
    {name: '抖音', id: 4},
    {name: '快手', id: 5},
  ]
  width: any = ''
  step = this.value

  mounted() {
    this.width = (this.$refs.uls as any).clientWidth
  }
  active(index: number) {
    this.step = index
    this.$emit('input', this.step)
  }
}
</script>

<style lang="less" scoped>
@color: #3b98ff;
.page {
  background: rgba(0, 31, 44, 0);
  margin: 0 10%;
}
.page ul {
  height: 69px;
  display: flex;
  li {
    flex: 1;
    font-size: 18px;
    line-height: 69px;
    text-align: center;
    color: rgba(255, 255, 255, .6);
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }
  .liactive {
    color: #fff;
    span {
      padding-bottom: 10px;
      border-bottom: 2px solid #fff;
    }
  }
}
</style>
