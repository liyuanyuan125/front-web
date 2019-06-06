<template>
     <!-- 品牌列表-->
     <Select v-model="inner" clearable filterable placeholder="品牌名称" @on-change="handleBrand"  class="select-wid">
        <Option v-for="item in brandsList" :key="item.brandId" :value="item.brandId">{{item.brandName}}</Option>
    </Select>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { brandList } from '@/api/popFilm'
@Component
export default class Main extends ViewBase {
  // v-model 双向绑定
  @Prop({type: Number, default: 0}) value?: number

  inner = this.value
  brandsList = []

  mounted() {
    this.brandList()
  }

  async brandList() {
    try {
      const { data: {items}} = await brandList({
        pageIndex: 1,
        pageSize: 5555
      })
      this.brandsList = items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  queryBrandName() {
    const ary: any = this.brandsList.filter( (item: any) => item.brandId == this.inner) || []
    const brandname = ary.length > 0 ? ary[0].brandName : ''
    return brandname
  }

  handleBrand(val: any) {
    if (val) {
      localStorage.setItem('brandId', val)
    }
  }

  @Watch('value')
  watchValue(value: number) {
    this.inner = value
  }
  @Watch('inner')
  watchInner(value: number) {
    this.$emit('input', value)
  }
}

</script>
<style lang='less' scoped>
</style>