<template>
  <span :class="['perm-tree-item', 'perm-tree-item-level-' + level]">
    <label class="title">{{inValue.title}}</label>
    <CheckboxGroup v-model="perms" class="perm-list" v-if="isLeaf">
      <Checkbox v-for="it in permList" :key="it.code"
        :label="it.code" class="perm-item">{{it.name}}</Checkbox>
    </CheckboxGroup>
  </span>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { Action, Page, TreeItem } from './types'
import { uniq, isEqual } from 'lodash'

@Component
export default class PermTreeItem extends ViewBase {
  @Prop({ type: Object, default: () => {}, required: true }) value!: TreeItem

  inValue = {} as TreeItem

  perms: string[] = []

  get node() {
    return this.inValue.extraData.node
  }

  get permList() {
    const key = this.node.key
    const list = this.node.actions.map(it => ({ ...it, code: `${key}:${it.code}` }))
    return list
  }

  get level() {
    return this.inValue.extraData.level
  }

  get isLeaf() {
    return (this.node.children || []).length == 0
  }

  get selfPerms() {
    return this.filterPerms(true)
  }

  get extraPerms() {
    return this.filterPerms(false)
  }

  filterPerms(isEq: boolean) {
    const key = this.node.key
    const perms = this.inValue.extraData.perms
    const list = perms.filter(perm => {
      const eq = perm.split(':')[0] == key
      return isEq ? eq : !eq
    })
    return list
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: TreeItem) {
    this.inValue = { ...value }
    this.perms = this.selfPerms
  }

  @Watch('perms')
  watchPerms(value: string[]) {
    const oldPerms = this.inValue.extraData.perms
    const perms = uniq(this.extraPerms.concat(value)).sort()
    if (!isEqual(perms, oldPerms)) {
      this.$emit('change', perms)
    }
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
