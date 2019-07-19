<template>
    <ComBrand  :fetch="fetch" :id="id" />
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { brandList } from '@/api/kolDetails'
import ComBrand from '@/components/detailBrand/index.vue'
@Component({
  components: {
    ComBrand
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  async fetch(id: any) {
    try {
      const { data: { brandCategoryList, items} } = await brandList(id)

      // 统一字段名称
      const item = (items || []).map((ite: any) => {
        return {
          id: ite.brandId,
          logo: ite.brandLogo,
          name: ite.brandName,
          nameEn: ite.nameEn,
          tradeCode: ite.categoryCode
        }
      })

      return {
        trades: brandCategoryList,
        items: item,
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }
}

</script>
<style lang='less' scoped>
</style>