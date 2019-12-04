<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { xlsl } from './excl'
import { exportId } from '@/api/popPlan.ts'

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
    const tHeader = ['影片名称', '上映日期', '影片类型', '投放开始日期',
      '投放结束日期', '投放周期', '', '']
    const merges: any = []
     xlsl({
      title: [],
      header: tHeader,
      data: this.tableDate1,
      merges,
      filename: '投放方案',
      autoWidth: true,
      bookType: 'xlsx',
      type: 1
    })
  }

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  days(begin: any, end: any) {
    const time = new Date(this.formatDate(end)).getTime() - new Date(this.formatDate(begin)).getTime()
    return time / (3600 * 24 * 1000) + 1
  }

  async exportData() {
    try {
      const { data } = await exportId(this.id)
      this.tableDate1 = (data.planMovies.map((it: any, index: number) => {
        const nums = it.movieType.split('|')
        const msg = data.movieTypeList.filter((item: any) => nums.includes(item.key))
        return [
          it.movieName,
          it.publishStartDate ? this.formatDate(it.publishStartDate) : '',
          msg ? msg.map((its: any) => its.text).join('/') : '',
          it.beginDate ? this.formatDate(it.beginDate) : '',
          it.endDate ? this.formatDate(it.endDate) : '',
          it.endDate ? this.days(it.beginDate, it.endDate) : '',
          '',
          ''
        ]
      }))
      this.tableDate1.push([
        '合计',
        data.planMovies.length + '部',
        '',
        '',
        '',
        '',
        '',
        ''
      ], ['', '', '', '', '', '', '', ''])
      this.tableDate1.push(['序号', '省份', '地区', '影院名称',
      '院线归属', '预估投放场次', '预估曝光人次', '详细地址'])
      let indexs = 0
      this.tableDate1.push(...((data.planCinemas || []).map((it: any, index: number) => {
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
      })))
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