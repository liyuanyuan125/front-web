<template>
  <div>
    <Modal
      v-model="showDlg"
      :title="title"
      width="800"
      @on-cancel="cancel()"
    >
      <Table stripe :columns="columns" :data="data"></Table>
      <!-- <Page
        :total="total"
        v-if="total>0"
        class="btnCenter"
        :current="pageIndex"
        :page-size="pageSize"
        show-total
        show-elevator
        @on-change="handlepageChange"
        @on-page-size-change="handlePageSize"
      /> -->
      <div slot="footer" class="foot">
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinemaList } from '@/api/plan'
import { clean } from '@/fn/object'
import { formatCurrency } from '@/fn/string.ts'
import { cinemadata } from '@/api/cinemadata'

@Component
export default class Change extends ViewBase {
  total = 0
  showDlg = false
  data = []
  value: any = null
  pageIndex = 1
  pageSize = 10
  title = ''
  type: any = ['', '', '查看全部影院', '查看全部影片', '查看全部地区']

  get columns() {

    if ( this.value && this.value.planDataType == 4 ) {
      return [
        { title: '区域', key: 'areaName', align: 'center'},
        { title: '省份', key: 'provinceName', align: 'center'},
        { title: '城市', key: 'cityName', align: 'center'},
        { title: '覆盖人次', key: 'coverPeople', align: 'center'},
        { title: '广告花费／¥', key: 'advertAmount', align: 'center'},
      ]
    } else if (  this.value && this.value.planDataType == 2) {
      return  [
        { title: '影院名称', key: 'cinema', align: 'center'},
        { title: '排播场次数', key: 'scheduleScene', align: 'center'},
        { title: '总排播时长', key: 'scheduleTime', align: 'center'},
        { title: '覆盖人次', key: 'coverPeople', align: 'center'},
        { title: '广告花费／¥', key: 'advertAmount', align: 'center'}
      ]
    } else {
      return  [
        { title: '影片名称', key: 'cinema', align: 'center'},
        { title: '上映时间', key: 'scheduleScene', align: 'center'},
        { title: '覆盖人次', key: 'coverPeople', align: 'center'},
        { title: '广告花费／¥', key: 'advertAmount', align: 'center'}
      ]
    }
  }

  init(value: any) {
    this.showDlg = true
    this.value = value
    this.title = this.type[this.value.planDataType]
    this.list()
  }

  async list() {
    const id = (this.value.id).toString()
    try {
      const { data: {
        items: {
          provinceDataList
        }
      } } = await cinemadata(clean({
        ...this.value
      }))
      const datas = provinceDataList ? provinceDataList.provinceData : []
      this.data = datas.map((it: any) => {
        return {
          ...it,
          coverPeople: formatCurrency(it.coverPeople).slice(0, -3),
          advertAmount: formatCurrency(it.advertAmount).slice(0, -3),
        }
      })
      this.total = datas.length
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }

  cancel() {
    this.showDlg = false
  }

  handlepageChange(size: any) {
    this.pageIndex = size
    this.list()
  }

  handlePageSize(size: any) {
    this.pageIndex = size
    this.list()
  }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-header {
  border-bottom: 0;
  padding: 10px 13px;
  background: #f9f9f9;
  font-weight: none;
}
/deep/ .ivu-table {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}
.footer-bottom {
  margin: 10px 0 10px;
}
</style>

