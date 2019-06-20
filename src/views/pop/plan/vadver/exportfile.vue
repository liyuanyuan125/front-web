<template>
  <div>
    <span @click="exportData">下载列表</span>
  
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatCurrency } from '@/fn/string.ts'
import { exportId } from '@/api/popPlan.ts'
// import XLSX from 'xlsx'
// import 'xlsx-style'
// import { saveAs } from './excl.ts'

@Component
export default class Export extends ViewBase {
  @Prop() value!: any

  tableDate1: any = []

  formatNums(data: any) {
    return data ? formatCurrency(data) : '暂无'
  }

  async exportData() {
    try {
      await exportId(this.value)
      this.down()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  down() {
    // saveAs()
  }
}
</script>

<style lang="less" scoped>

</style>
