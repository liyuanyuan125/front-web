<template>
  <div class="page">
    <BubbleMin/>
    <slot></slot>
    <BubbleText
      :list="bubbleList"
      :link="bubbleLink"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import BubbleMin from './bubbleMin.vue'
import BubbleText from './bubbleText.vue'
import { RawLocation } from 'vue-router'

@Component({
  components: {
    BubbleMin,
    BubbleText
  }
})
export default class MainPageLayout extends ViewBase {
  @Prop({ type: Array, default: () => [] }) bubbleList!: string[]

  @Prop({ type: [ Object, String ], default: null }) bubbleLink!: RawLocation
}
</script>

<style lang="less" scoped>
.page {
  position: relative;
  margin: -10px;
  padding-bottom: 60px;
}
</style>
