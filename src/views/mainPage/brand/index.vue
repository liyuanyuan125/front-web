<template>
  <BrandLayout :id="id"></BrandLayout>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import BrandLayout from './components/brandLayout.vue'

@Component({
  components: {
    BrandLayout
  }
})
export default class BrandHomeIndex extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
}
</script>

<style lang="less" scoped>
</style>
