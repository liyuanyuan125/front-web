<template>
  <span :class="['perm-tree-item', 'perm-tree-item-level-' + inner.level]">
    <label class="title">{{inner.name}}</label>
    <CheckboxGroup v-model="perms" class="perm-list" v-if="inner.isLeaf">
      <Checkbox v-for="it in inner.actions" :key="it.code" :disabled="readonly"
        :label="it.code" class="perm-item">{{it.name}}</Checkbox>
    </CheckboxGroup>
  </span>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { Action, Page, ExtraData } from './types'
import { uniq, isEqual } from 'lodash'

@Component
export default class PermTreeItem extends ViewBase {
  @Prop({ type: Object, default: () => {}, required: true }) value!: ExtraData

  @Prop({ type: Boolean, default: false }) readonly!: boolean

  inner = {} as ExtraData

  perms: string[] = []

  get selfPerms() {
    return this.filterPerms(true)
  }

  get extraPerms() {
    return this.filterPerms(false)
  }

  filterPerms(isEq: boolean) {
    const key = this.inner.key
    const allPerms = this.inner.allPerms
    const list = allPerms.filter(perm => {
      const eq = perm.split(':')[0] == key
      return isEq ? eq : !eq
    })
    return list
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: ExtraData) {
    this.inner = { ...value }
    this.perms = this.selfPerms
  }

  @Watch('perms')
  watchPerms(value: string[]) {
    const oldPerms = this.inner.allPerms
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
