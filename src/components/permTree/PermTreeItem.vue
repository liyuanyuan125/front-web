<template>
  <span :class="['perm-tree-item', 'perm-tree-item-level-' + level]">
    <label class="title">{{inValue.title}}</label>
    <CheckboxGroup class="perm-list" v-if="isLeaf">
      <Checkbox v-for="it in node.actions" :key="it.code"
        :label="it.code" class="perm-item">{{it.name}}</Checkbox>
    </CheckboxGroup>
  </span>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { Action, Page, TreeItem } from './types'

@Component
export default class PermTreeItem extends ViewBase {
  @Prop({ type: Object, default: () => {}, required: true }) value!: TreeItem

  inValue = {} as TreeItem

  get node() {
    return this.inValue.extraData.node
  }

  get level() {
    return this.inValue.extraData.level
  }

  get isLeaf() {
    return (this.node.children || []).length == 0
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: TreeItem) {
    this.inValue = { ...value }
  }
}
</script>

<style lang="less" scoped>
.perm-tree-item {
  user-select: none;
}
.title {
  display: inline-block;
  min-width: 88px;
}
.perm-list {
  display: inline-block;
}
.perm-item {
  margin-left: 18px;
}
.perm-tree-item-level-1 .perm-list {
  margin-left: 18px;
}
</style>
