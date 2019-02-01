<template>
  <div>
    <Modal v-model="value.visible" title="查看已选影院" width="800">
      <Table stripe :columns="columns" :data="data"></Table>
      <Page
        :total="total"
        v-if="total>0"
        class="btnCenter"
        :current="pageIndex"
        :page-size="pageSize"
        show-total
        show-elevator
        @on-change="handlepageChange"
        @on-page-size-change="handlePageSize"
      />
      <div slot="footer" class="btnCenter footer-bottom">
        <Button type="primary" class="button-cancel" @click="value.visible = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinemaList } from '@/api/plan'

@Component
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any
  total = 0
  pageIndex = 1
  pageSize = 10

  data = []
  columns = [
    { title: '区域', key: 'areaName', align: 'center', width: 100 },
    { title: '省份', key: 'provinceName', align: 'center',  width: 100},
    { title: '城市', key: 'cityName', align: 'center',  width: 100 },
    { title: '城市级别', key: 'cityLevel', align: 'center',  width: 100 },
    { title: '专资编码', key: 'code', align: 'center',  width: 100 },
    { title: '影院名称', key: 'officialName', align: 'center', minWidth: 200 },
    { title: '影厅数', key: 'hallCount', align: 'center',  width: 100 },
    { title: '总座位数', key: 'seatCount', align: 'center',  width: 100 },
    { title: '票房级别', key: 'boxLevelName', align: 'center',  width: 100},
  ]
  async mounted() {
      const id = (this.value.id).toString()
    try {
      const { data } = await cinemaList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        id
      })
      this.data = data.items
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
  handlepageChange(size: any) { this.pageIndex = size}
  handlePageSize(size: any) { this.pageIndex = size}
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
  height: 550px;
  overflow-y: auto;
}
.footer-bottom {
  margin: 10px 0 10px;
}
</style>

