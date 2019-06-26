<template>
  <div>
    <span @click="exportData">下载列表</span>
    <Table height="320" style="display: none" ref="table" stripe :columns="columns" :data="tableDate1">
      <template v-if="tag == 1" slot-scope="{ row }" slot="citys">
        {{row.provinceNname}} {{row.cityName}}
      </template>

      <template slot-scope="{ row }" slot="estimateShowCount">
        {{formatNums(row.showCount)}}
      </template>

      <template slot-scope="{ row }" slot="estimatePersonCount">
        {{formatNums(row.personCount)}}
      </template>
    </Table>
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

  tag = 1

  get columns() {
    const tag = ['影院名称', '影院名称', '城市名称', '省份名称']
    const key = ['cinemaName', 'chainName', 'cityName', 'provinceName' ]
    const one = [{
      title: tag[this.tag - 1],
      key: key[this.tag - 1],
      align: 'center'
    }]
    const two = [
      {
        title: '包含城市',
        slot: 'citys',
        align: 'center'
      }
    ]
    const therr = [
      {
        title: '包含影院',
        key: 'containCinemas',
        align: 'center'
      }
    ]
    const four = [
      {
        title: '所在地',
        slot: 'citys',
        align: 'center'
      }
    ]
    const five = [
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
    return [
      ...one,
      {
        title: '所属院线',
        key: 'chainName',
        align: 'center'
      },
      ...four,
      ...five
    ]
  }

  tableDate1: any = []

  formatNums(data: any) {
    return data ? formatCurrency(data) : '暂无'
  }

  async exportData() {
    try {
      const { data } = await exportId(this.value)
      this.tableDate1 = data.planCinemas || []
      this.down()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  down() {
   (this.$refs.table as any).exportCsv({
      filename: '影院列表',
    })
  }
}
</script>

<style lang="less" scoped>

</style>
