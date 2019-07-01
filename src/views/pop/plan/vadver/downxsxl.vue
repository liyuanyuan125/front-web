<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { xlsl } from './excl'
import { exportId } from '@/api/popPlan.ts'
import { chunk, flatten, uniqBy, findLastIndex } from 'lodash'

@Component
export default class Dates extends ViewBase {
  @Prop () id?: any

  download: any = ''
  href: any = ''
  tableDate1: any = []

  created() {
    this.exportData()
  }

  down() {
    const tHeader = ['序号', '省份', '地区', '影院名称',
      '院线归属', '预估投放场次', '预估曝光人次', '详细地址']
    const merges: any = []
     xlsl({
      title: [],
      header: tHeader,
      data: this.tableDate1,
      merges,
      filename: '影片列表',
      autoWidth: true,
      bookType: 'xlsx'
    })
  }

  async exportData() {
    try {
      const { data } = await exportId(this.id)
      let indexs = 0
      this.tableDate1 = (data.planCinemas.map((it: any, index: number) => {
        if (it.num != -1) {
          indexs += 1
        }
        return [
          it.num == -1 ? '小计' : indexs,
          it.provinceNname || '',
          it.cityName  || '',
          it.cinemaName  || '',
          it.chainName  || '',
          it.showCount  || 0,
          it.personCount  || 0,
          it.address  || ''
        ]
      }))
    } catch (ex) {
      this.handleError(ex)
    }
  }

  formatJson(filterVal: any, jsonData: any) {
    return jsonData.map((v: any) => filterVal.map((j: any) => v[j]))
  }
}
</script>

<style lang="less" scoped>
.setp-wrap {
  height: 104px;
  padding: 33px 30px 33px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: solid 10px #f2f2f2;
  color: #2481d7;
}
</style>