<template>
  <div>
    <Page
      :total="total"
      :current="value.current"
      :page-size="value.pageSize"
      class="btnCenter"
      show-total
      show-elevator
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  @Prop({ type: Object }) value: any
  @Prop({type: Number}) total: any

  mounted() {
  }
  // 点击页码
  handlepageChange(current: any) {
      this.value.current = current
  }

  // 跳转页码
  handlePageSize(size: any) {
      this.value.current = size
  }
}
</script>
<style lang="less" scoped>
</style>

