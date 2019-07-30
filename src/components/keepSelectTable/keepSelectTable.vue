<template>
  <Table
    v-bind="$attrs"
    v-on="$listeners"
    :data="tableData"
    :columns="tableColumns"
    class="keep-select-table"
    @on-selection-change="selectionChange"
    ref="table"
  />
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { toMap } from '@/fn/array'
import { uniq, difference, union, isEqual } from 'lodash'

@Component
export default class KeepSelectTable extends ViewBase {
  /**
   * 已选择的项的 ids（不限于当前页，所有页），支持通过 .sync 双向绑定
   */
  @Prop({ type: Array, default: () => [] }) selectedIds!: Array<number | string>

  /**
   * 数据，代理 data
   */
  @Prop({ type: Array, default: () => [] }) data!: any[]

  /**
   * 列配置，代理 columns
   */
  @Prop({ type: Array, default: () => [] }) columns!: any[]

  /**
   * 每一项的 id 字段的名称，默认为 id
   */
  @Prop({ type: String, default: 'id' }) idKey!: string

  /**
   * 是否禁用列选择
   */
  @Prop({ type: Boolean, default: false }) disableSelectable!: boolean

  selectIdsInner = this.selectedIds

  get tableData() {
    const idKey = this.idKey
    const list = this.data
    const selectable = !this.disableSelectable
    const selectedMap = toMap(this.selectedIds)
    const data = list.map(it => {
      return {
        ...it,
        _checked: selectable ? it[idKey] in selectedMap : false
      }
    })
    return data
  }

  // 根据列配置 columns，规范化后，生成真正的，传给 iview Table 组件的 columns
  get tableColumns() {
    const columns = this.columns
    const selectable = !this.disableSelectable

    const result = selectable ? [{
      type: 'selection',
      width: 50,
      align: 'center'
    }].concat(columns) : columns

    return result
  }

  selectionChange(selectedList: any[]) {
    const idKey = this.idKey
    const pageIds = (this.data || []).map(it => it[idKey])
    const ids = (selectedList || []).map(it => it[idKey])
    const diffIds = difference(this.selectIdsInner, pageIds)
    const selectIdsInner = union(diffIds, ids)
    this.selectIdsInner = selectIdsInner
  }

  /**
   * 全选表格内的当前页的所有行
   * @param enable 是否选中
   */
  public selectAll(enable = true) {
    const table = this.$refs.table as any
    table && table.selectAll(enable)
  }

  @Watch('selectedIds')
  watchSelectedIds(value: Array<number | string>) {
    const ids = value || []
    if (!isEqual(ids, this.selectIdsInner)) {
      this.selectIdsInner = ids
    }
  }

  @Watch('selectIdsInner')
  watchSelectIdsInner(value: Array<number | string>) {
    const uniqIds = uniq(value)
    // 当 uniqIds 的长度与 value 相同时，说明没有重复元素，
    // 那么应该直接使用传入的 value，否则会导致无限循环
    const ids = uniqIds.length == value.length ? value : uniqIds
    this.$emit('update:selectedIds', ids)
  }
}
</script>

<style lang="less" scoped>
@import '../../site/lib.less';

.list-page {
  min-height: 288px;
  margin-bottom: 88px;
}

.act-bar ~ .act-bar {
  margin-top: 15px;
}

.ui-filter,
.btn-search,
.btn-reset {
  margin-left: 8px;
}
.ui-filter:first-child {
  margin-left: 0;
}

.table {
  margin-top: 17px;
  /deep/ .ivu-table-cell {
    padding-left: 4px;
    padding-right: 4px;
    & > span,
    & > div {
      &:empty::before {
        content: '-';
      }
    }
  }
  /deep/ .row-acts > a {
    margin: 0 4px;
  }
}

.page-wrap {
  margin: 20px 0;
  text-align: center;
}
</style>
