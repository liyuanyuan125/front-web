<template>
  <div class="page">
    <ul class="">
      <li @click="active(index, it.id)" :class="step == index ? 'liactive' : ''" v-for="(it, index) in name" :key='index'>
        <img width="34px" :src="it.url" alt="">
        {{it.name}}
      </li>
    </ul>
    <div :style="{transform: `translate3d(${106*step}px, 0px, 0px)`, width: step == 4 ? '88px' : '74px'}" class="active"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import weixin from './assets/weixin.png'
import douyin from './assets/touyin.png'
import kuaisou from './assets/kuaisou.png'
import xiaohongshu from './assets/xiaohongshu.png'
import xinlang from './assets/xinlang.png'
import { querySelectList } from '@/api/brandList'

@Component
export default class App extends ViewBase {
  @Prop() value!: any
  @Prop() invalue!: any
  name: any = [
    {name: '微博', id: 'weibo', url: xinlang},
    {name: '微信', id: 'weixin', url: weixin},
    {name: '抖音', id: 'douyin', url: douyin},
    {name: '快手', id: 'kuaishou', url: kuaisou},
    // {name: '小红书', id: 'xiaohonghsu', url: xiaohongshu},
  ]
  step = this.value

  created() {
    this.init()
  }

  async init() {
    try {
      await querySelectList()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  active(index: any, id: any) {
    this.step = index
    this.$emit('input', this.step)
  }

  @Watch('value')
  watchValue(val: any) {
    this.step = val
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
    img {
      vertical-align: middle;
    }
  }
  .liactive {
    color: #fff;
  }
}
.active {
  width: 70px;
  height: 2px;
  background: @color;
  margin-left: 40px;
  transition: transform 0.3s ease-in-out;
}
</style>

