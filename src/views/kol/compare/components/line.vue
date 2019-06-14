<template>
  <Row class="city-item" type="flex" justify="space-between" align="middle">
    <Col :span="3">{{itemName}}</Col>
    <Col :span="16"><div :style="{ backgroundColor: itemColor, width: itemWidth }" class="line"></div></Col>
    <Col :span="5">{{itemValueComputed}}</Col>
  </Row>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component({})
export default class XLine extends ViewBase {
  @Prop({ type: String, default: '' }) itemName!: string
  @Prop({ type: String, default: '' }) itemValue!: string
  @Prop({ type: String, default: 'red' }) itemColor?: string

  get hasUnit() {
    return (this.itemValue as string).split('万').length > 1
  }
  get itemWidth() {
    if ( this.itemValue === '' ) { return }
    if ( this.hasUnit ) {
      return this.itemValue.split('万')[0].trim() + '%'
    }
  }
  get itemValueComputed() {
    if ( this.itemValue === '' ) { return ''}
    if ( this.hasUnit ) {
      return this.itemValue
    }
    // need 单位转换
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '../kolcompare.less';
</style>