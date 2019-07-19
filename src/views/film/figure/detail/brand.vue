<template>
   <ComBrand  :fetch="fetch" :id="id" />
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {personBrands } from '@/api/filmPersonDetail'
import ComBrand from '@/components/detailBrand/index.vue'


@Component({
  components: {
    ComBrand
  }
})
export default class Brand extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  async fetch(id: any) {
    try {
      const { data: {items, trades}} = await personBrands(id)
      return {
        items,
        trades
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }
}

</script>
<style lang='less' scoped>
</style>