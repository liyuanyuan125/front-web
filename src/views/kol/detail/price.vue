<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Price extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
}
</script>

<style lang="less">
@import '~@/site/lib.less';

</style>
