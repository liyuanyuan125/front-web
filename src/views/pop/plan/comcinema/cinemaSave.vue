<template>
  <div class="page">
    <div>
      123456789
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  @Prop({default: () => 0}) type!: number
}
</script>

<style lang="less" scoped>

</style>
