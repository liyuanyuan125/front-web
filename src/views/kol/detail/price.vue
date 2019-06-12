<template>
  <div class="page">
    <div class="price-list">
      <PriceItem
        v-for="(it, i) in list"
        :key="i"
        :type="it.type"
        :name="it.name"
        :list="it.list"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import PriceItem from './components/priceItem.vue'

@Component({
  components: {
    PriceItem
  }
})
export default class Price extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  list = [
    {
      type: 'wechat',
      name: '微信',
      list: [
        { name: '单图文', value: '不接单' },
        { name: '多图文第一条', value: '￥ 333,520', enable: true },
        { name: '多图文第二条', value: '￥ 333,520', enable: true },
        { name: '多图文第三条及以后', value: '不接单' },
      ]
    },

    {
      type: 'weibo',
      name: '微博',
      list: [
        { name: '直发', value: '￥ 299,000', enable: true },
        { name: '转发', value: '￥ 333,520', enable: true },
      ]
    },

    {
      type: 'kuaishou',
      name: '快手',
      list: [
        { name: '视频', value: '￥ 299,000', enable: true },
      ]
    },

    {
      type: 'xiaohongshu',
      name: '小红书',
      list: [
        { name: '视频', value: '￥ 299,000', enable: true },
        { name: '图片', value: '￥ 299,000', enable: true },
      ]
    },

    {
      type: 'douyin',
      name: '抖音',
      list: [
        { name: '视频', value: '￥ 299,000', enable: true },
      ]
    },
  ]
}
</script>

<style lang="less">
@import '~@/site/lib.less';

.price-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: -20px;
}

.price-item {
  width: 49.07%;
  max-width: 530px;
  margin: 0 0 20px 0;
}
</style>
