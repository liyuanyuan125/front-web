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

import { getPrice } from './data'

@Component({
  components: {
    PriceItem
  }
})
export default class Price extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  list: any[] = []

  async created() {
    const list = await getPrice(this.id)
    this.list = list
  }
}
</script>

<style lang="less" scoped>
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
