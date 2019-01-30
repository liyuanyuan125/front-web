<template>
  <div class="checkbox-pane">
    <span class="checkbox-all" v-if="!noAll">
      <Checkbox :value="allHasChecked" :indeterminate="indeterminate"
        @click.prevent.native="onCheckAll">全选</Checkbox>
    </span>
    <CheckboxGroup v-model="model" class="checkbox-group">
      <Checkbox v-for="it in list" :key="it[valueKey]"
        :label="it[valueKey]">
        <slot name="item" :item="it">{{it[textKey]}}</slot>
      </Checkbox>
    </CheckboxGroup>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

/**
 * 带全选功能的 checkbox 面板
 */
@Component
export default class CheckboxPane extends ViewBase {
  // model 属性
  @Prop({ type: Array, default: () => [], required: true }) value!: number[] | string[]

  // 选项列表
  @Prop({ type: Array, default: () => [], required: true }) list!: any[]

  // 值键，默认为 key，与常用后端枚举一致
  @Prop({ type: String, default: 'key' }) valueKey!: string

  // 文本键，默认为 text，与常用后端枚举一致
  @Prop({ type: String, default: 'text' }) textKey!: string

  // 去掉全选
  @Prop({ type: Boolean, default: false }) noAll!: boolean

  model: number[] | string[] = []

  get allKeyList() {
    return this.list.map(it => it[this.valueKey]).sort()
  }

  get allHasChecked() {
    return this.model.length > 0
  }

  get allIsAllChecked() {
    const allKeys = this.allKeyList.join('')
    const selKeys = [ ...this.model ].sort().join('')
    return allKeys === selKeys
  }

  get indeterminate() {
    return this.allHasChecked && !this.allIsAllChecked
  }

  onCheckAll() {
    this.model = this.allHasChecked ? [] : this.allKeyList
  }

  @Watch('value')
  watchValue(value: number[] | string[]) {
    this.model = value
  }

  @Watch('model')
  watchModel(value: number[] | string[]) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.checkbox-pane {
  padding: 14px 18px;
  line-height: 2;
  font-size: 14px;
  overflow: auto;
  /deep/ .ivu-checkbox-wrapper {
    display: block;
    font-size: 14px;
  }
}
</style>
