<template>
  <div class="page">
    <ul class="" ref="uls">
      <li @click="active(index)" :class="step == index? 'liactive' : ''" v-for="(it, index) in name" :key='index'>
        {{it.name}}
      </li>
    </ul>
    <div :style="{transform: `translate3d(${width/3 * (step )}px, -2px, 0px)`}" class="active"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class App extends ViewBase {
  @Prop({ default: 1}) value!: number
  name: any = [
    {name: '影片', id: 1},
    {name: '影人', id: 2},
    {name: 'KOL', id: 3}
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
    border-bottom: 2px solid rgba(255, 255, 255, .6);
    &:hover {
      color: #fff;
    }
  }
  .liactive {
    color: #fff;
  }
}
.active {
  width: 33.3%;
  height: 2px;
  background: #fff;
  transition: transform 0.3s ease-in-out;
}
</style>
