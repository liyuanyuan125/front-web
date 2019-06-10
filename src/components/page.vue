<template>
  <div>
    <Page v-if="total > 0" show-total  :total="total" :current="pageList.pageIndex" :page-size="pageList.pageSize"
      @on-change="handlepageChange"  prev-text="上一页" next-text="下一页" class="page-list" />
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  @Prop({ type: Object}) pageList: any
  @Prop({type: Number}) total: any

  // 点击页码
  handlepageChange(current: any) {
      this.$emit('uplist', current)
  }

  // 跳转页码
  // handlePageSize(size: any) {
  //     // this.value.current = size
  //     this.$emit('uplist', size)
  // }
}
</script>
<style lang="less" scoped>
@import '~@/views/brand/less/common.less';
</style>

