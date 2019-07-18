<template>
  <div>
    <CitySelectPane class="citybox" @ok="onOk" v-model="cityIdsModel" :topCityIds="topCityIds" ref="citySelectPane"/>
  </div>
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

  onOk() {
    this.$emit('update:cityIds', this.cityIdsModel)
    this.model = false

    const pane = this.$refs.citySelectPane as CitySelectPane
    const fastList = pane.fastList
    this.$emit('ok', { fastList: JSON.parse(JSON.stringify(fastList)) })
  }

  @Watch('value')
  watchValue(value: boolean) {
    this.model = value
    value && (this.cityIdsModel = this.cityIds)
  }

  @Watch('cityIdsModel', { deep: true} )
  watchCityIdsModel(val: any) {
    this.$emit('update:cityIds', this.cityIdsModel)
  }

  @Watch('model')
  watchModel(value: boolean) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.citybox {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid #fff;
  padding: 20px;
}
</style>
