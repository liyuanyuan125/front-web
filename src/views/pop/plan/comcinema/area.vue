<template>
  <div class="page">
    
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  @Prop({type: Array, default: () => []}) data!: any
}
</script>

<style lang="less" scoped>
</style>
