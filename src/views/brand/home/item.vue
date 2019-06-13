<template>
  <Layout type="item" :id="id"></Layout>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Layout from './components/layout.vue'

@Component({
  components: {
    Layout
  }
})
export default class BrandHomeItem extends ViewBase {
  @Prop({ type: Number, default: 0 }) brandId!: number

  @Prop({ type: Number, default: 0 }) id!: number
}
</script>

<style lang="less" scoped>
</style>
