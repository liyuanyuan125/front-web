<template>
  <div class="page">
    <BubbleMin/>
    <slot></slot>
    <BubbleText :list="bubbleList"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import BubbleMin from './bubbleMin.vue'
import BubbleText from './bubbleText.vue'

@Component({
  components: {
    BubbleMin,
    BubbleText
  }
})
export default class MainPageLayout extends ViewBase {
  @Prop({ type: Array, default: () => [] }) bubbleList!: string[]
}
</script>

<style lang="less" scoped>
.page {
  position: relative;
  margin: -10px;
  height: 1600px;
}
</style>
