<template>
  <div>
    <span @click="exportData">下载列表</span>
    <Table height="320" style="display: none" ref="table"  stripe :columns="columns" :data="tableDate1">
      <template slot-scope="{ row }" slot="citys">
          {{row.provinceName}} {{row.cityName}} {{row.countyName}}
        </template>

        <template slot-scope="{ row }" slot="estimateShowCount">
          {{formatNums(row.estimateShowCount)}}
        </template>

        <template slot-scope="{ row }" slot="estimatePersonCount">
          {{formatNums(row.estimatePersonCount)}}
        </template>
    </Table>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatCurrency } from '@/fn/string.ts'
import { exportId } from '@/api/popPlan.ts'
@Component
export default class Export extends ViewBase {
  @Prop() value!: any

  tableDate1: any = []

  get columns() {
    return [
      {
        title: '影院名称',
        key: 'cinemaName',
        align: 'center'
      },
      {
        title: '所属院线',
        key: 'chainName',
        align: 'center'
      },
      {
        title: '所在地',
        slot: 'citys',
        align: 'center'
      },
      {
        title: '预估投放场次',
        slot: 'estimateShowCount',
        align: 'center'
      },
      {
        title: '预估曝光人次',
        slot: 'estimatePersonCount',
        align: 'center'
      }
    ]
  }

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
    (this.$refs.table as any).exportCsv({
      filename: '影院列表',
      original: false,
      data: [{
        name: '小明'
      }]
    })
  }
}
</script>

<style lang="less" scoped>

</style>
