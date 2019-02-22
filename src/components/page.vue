<template>
  <div>
    <Page
      :total="total"
      v-if="total > 0"
      :current="value.pageIndex"
      :page-size="value.pageSize"
      class="btnCenter pages"
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
  @Prop({ type: Object, default: {pageIndex: 1, pageSize: 10} }) value: any
  @Prop({type: Number}) total: any

  // 点击页码
  handlepageChange(current: any) {
      // this.value.current = current
      this.$emit('uplist', current)
  }

  // 跳转页码
  handlePageSize(size: any) {
      // this.value.current = size
      this.$emit('uplist', size)
  }
}
</script>
<style lang="less" scoped>
.pages {
  margin: 40px 0 60px;
}
</style>

