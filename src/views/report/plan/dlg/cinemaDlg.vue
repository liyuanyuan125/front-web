<template>
  <div>
    <Modal v-model="value.visible" title="查看影院数据" width="800">
      <Table stripe :columns="columns1" :data="data" v-if="value.type == 1"></Table>
      <Table stripe :columns="columns2" :data="data" v-if="value.type == 2"></Table>
      <Page
        :total="total"
        v-if="total>0"
        class="btn-center-footer"
        :current="pageIndex"
        :page-size="pageSize"
        show-total
        show-elevator
        @on-change="handlepageChange"
        @on-page-size-change="handlePageSize"
      />
      <div slot="footer" class="btn-center-footer footer-bottom">
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
  columns1 = [
    // { title: '区域', key: 'areaName', align: 'center', width: 100 },
    // { title: '省份', key: 'provinceName', align: 'center',  width: 100 },
    // { title: '城市', key: 'cityName', align: 'center',  width: 100 },
    // { title: '城市级别', key: 'cityLevel', align: 'center',  width: 100 },
    { title: '专资编码', key: 'code', align: 'center'},
    { title: '影院名称', key: 'shortName', align: 'center'},
    // { title: '影厅数', key: 'hallCount', align: 'center',  width: 100 },
    { title: '总座位数', key: 'seatCount', align: 'center'},
    // { title: '票房级别', key: 'boxLevelName', align: 'center',  width: 100},
  ]
  columns2 = [
    { title: '区域', key: 'areaName', align: 'center'},
    { title: '省份', key: 'provinceName', align: 'center'},
    { title: '城市', key: 'cityName', align: 'center' },
    { title: '影院数', key: 'cinema', align: 'center'},
    // { title: '城市级别', key: 'cityLevel', align: 'center',  width: 100 },
    // { title: '专资编码', key: 'code', align: 'center', width: 100 },
    // { title: '影院名称', key: 'shortName', align: 'center', width: 100 },
    // { title: '影厅数', key: 'hallCount', align: 'center',  width: 100 },
    // { title: '总座位数', key: 'seatCount', align: 'center', width: 100 },
    // { title: '票房级别', key: 'boxLevelName', align: 'center',  width: 100},
  ]
  async mounted() {
    this.list()
  }
  async list() {
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
@import '~@/views/account/less/common.less';

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

