<template>
  <div>
      平台运营
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

}

</script>
<style lang='less' scoped>
</style>