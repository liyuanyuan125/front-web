<template>
  <div :class="`price-item price-item-${type}`">
    <h3 class="price-title">{{name}}</h3>
    <ul class="price-row-list">
      <li class="price-row price-row-head">
        <div class="price-name">投放方式</div>
        <div class="price-value">单条价格</div>
      </li>
      <li
        v-for="(it, i) in list"
        :key="i"
        class="price-row"
      >
        <div class="price-name">{{it.name}}</div>
        <div class="price-value">{{it.value}}</div>
        <div class="price-action" v-if="it.enable">
          <a class="price-add">+加入投放</a>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

export interface Price {
  name: string
  value: string
  enable?: true
}

@Component
export default class PriceItem extends ViewBase {
  @Prop({ type: String, default: '' }) type!: string

  @Prop({ type: String, default: '' }) name!: string

  @Prop({ type: Array, default: () => [] }) list!: Price[]
}
</script>

<style lang="less">
@import '~@/site/lib.less';

.price-item {
  min-height: 300px;
  border-radius: 4px;
  color: #fff;
  background-color: rgba(0, 32, 45, .85);
  font-size: 14px;
}

.price-item-weibo .price-title::before {
  background-image: url(./assets/weibo.png);
}

.price-item-kuaishou .price-title::before {
  background-image: url(./assets/kuaishou.png);
}

.price-item-xiaohongshu .price-title::before {
  background-image: url(./assets/xiaohongshu.png);
}

.price-item-douyin .price-title::before {
  background-image: url(./assets/douyin.png);
}

.price-title {
  position: relative;
  line-height: 70px;
  background-color: rgba(0, 32, 45, .6);
  font-size: 16px;
  text-align: center;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &::before {
    content: '';
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url(./assets/wechat.png) no-repeat;
    background-size: 30px 30px;
    margin-right: 10px;
  }
}

.price-row-list {
  padding: 0 25px 0 20px;
}

.price-row {
  display: flex;
  border-bottom: 1px solid rgba(99, 145, 177, .25);
  line-height: 66px;
}

.price-row-head {
  color: #a3d5e6;
}

.price-name {
  text-indent: 20px;
}

.price-name,
.price-value {
  width: 41%;
}

.price-add {
  display: inline-block;
  min-width: 80px;
  line-height: 24px;
  font-size: 12px;
  color: #fff;
  background-color: #4fa6bb;
  border-radius: 12px;
  text-align: center;
  user-select: none;
  &:hover {
    color: #fff;
    opacity: .88;
  }
}
</style>
