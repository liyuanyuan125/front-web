<template>
  <BaseDialog v-model="model" :width="810">
    <CitySelectPane v-model="cityIdsModel" :topCityIds="topCityIds"/>
  </BaseDialog>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import BaseDialog from '@/components/baseDialog'
import CitySelectPane from './citySelectPane.vue'
import { isEqual } from 'lodash'

@Component({
  components: {
    BaseDialog,
    CitySelectPane
  }
})
export default class CitySelectDialog extends ViewBase {
  /**
   * model，支持双向绑定
   */
  @Prop({ type: Boolean, default: false }) value!: boolean

  /** 城市 ids */
  @Prop({ type: Array, default: () => [] }) cityIds!: number[]

  /** 票仓城市 Top20 城市 ids */
  @Prop({ type: Array, default: () => [] }) topCityIds!: number[]

  model = this.value

  cityIdsModel: number[] = this.cityIds

  @Watch('value')
  watchValue(value: boolean) {
    this.model = value
  }

  @Watch('model')
  watchModel(value: boolean) {
    this.$emit('input', value)
  }

  toplist(val: any) {

  }

  @Watch('cityIdsModel')
  watchCityIdsModel(value: number[]) {
    this.$emit('update:cityIds', value)
  }
}
</script>

<style lang="less" scoped>
</style>
