<template>
  <div>
    <Tree
      :data="value.list"
      show-checkbox
      @on-check-change="checkChange"
    ></Tree>
  </div>
</template>
<script>
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class TreeList extends ViewBase {
  @Prop({ type: Object }) value
  checkChange(list) {
  }
}
</script>
