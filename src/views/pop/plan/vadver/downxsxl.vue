<template>
  <div>
    <span @click="down">aaaaaaaaaa</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { xlsl } from './excl'

@Component
export default class Dates extends ViewBase {
  download: any = ''
  href: any = ''

  down() {
    const tHeader = ['序号', '省份', '地区'] // 表头
    const title = ['锚地船舶', '', '']  // 标题
    const filterVal = ['NAME', 'VESSEL_LENGTH', 'RECOMMEND_BERTH']
    const list = [{
      NAME: '陈'
    }]
    const data = this.formatJson(filterVal, list)
    // data.map(item => {
    //         // console.log(item)
    //   item.map((i, index) => {
    //     if (!i) {
    //       item[index] = ''
    //     }
    //   })
    // })
    const merges = ['A1:C1']
     xlsl({
      title,
      header: tHeader,
      data,
      merges,
      filename: '影片列表',
      autoWidth: true,
      bookType: 'xlsx'
    })
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