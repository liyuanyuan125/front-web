<template>
  <Modal v-model="inner" title="查看已选影院" width="900">
    <div class="total">查看全部已关联影院 <em>{{total}}</em> 个</div>

    <Table stripe :columns="columns" :data="list" :loading="loading" size="small"
      class="table">
      <template slot="area" slot-scope="{ row }">
        {{row.areaName}}
        <i>/</i>
        {{row.provinceName}}
        <i>/</i>
        {{row.cityName}}
      </template>
    </Table>

    <Page :current.sync="query.pageIndex" :page-size="query.pageSize"
      :total="total" show-elevator class="page" v-if="total > 0"/>
  <div slot="footer"></div>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { CinemaDlgItem } from './types'

@Component
export default class CinemaDlg extends ViewBase {
  @Prop({ type: Boolean, default: false }) value!: boolean

  @Prop({ type: Boolean, default: false }) loading!: boolean

  @Prop({ type: Number, default: 0, required: true }) total!: number

  @Prop({ type: Array, default: () => [], required: true }) list!: CinemaDlgItem[]

  inner = false

  query = {
    pageIndex: 1,
    pageSize: 10,
  }

  get columns() {
    return [
      { title: '区/省/市', slot: 'area', width: 180 },
      { title: '城市级别', key: 'cityGradeName', width: 100 },
      { title: '专资编码', key: 'code', width: 100 },
      { title: '影院名称', key: 'shortName' },
      { title: '影厅数', key: 'hallCount', width: 100 },
      { title: '总座位数', key: 'seatCount', width: 100 },
      { title: '票房级别', key: 'boxLevelName', width: 100 },
    ]
    .map(it => ({ align: 'center', ...it }))
  }

  @Watch('value')
  watchValue(value: boolean) {
    this.inner = value

    // 每次显示就重置一下 pageIndex
    if (value) {
      this.query.pageIndex = 1
    }
  }

  @Watch('inner')
  watchInner(value: boolean) {
    this.$emit('input', value)
  }

  @Watch('query', { deep: true })
  watchQuery() {
    const data = { ...this.query }
    this.$emit('change', data)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.total {
  text-indent: 34px;
  font-size: 12px;
  color: @c-sub-text;
  margin-top: 14px;
  em {
    color: @c-text;
  }
}
.table {
  width: 800px;
  margin: 20px auto 0;
}
.page {
  width: 800px;
  text-align: right;
  margin: 25px auto 0;
}
</style>

