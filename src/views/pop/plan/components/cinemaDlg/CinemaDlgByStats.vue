<template>
  <CinemaDlg v-model="inner" :loading="loading" :total="total"
    :list="list" @change="cinemaChange"/>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { Stats } from '../areaPane'
import CinemaDlg from './CinemaDlg.vue'
import { CinemaDlgItem } from './types'
import { queryCinema } from '@/api/plan'
import { debounce } from 'lodash'

/**
 * 使用统计数据查看影院对话框
 */
@Component({
  components: {
    CinemaDlg
  }
})
export default class CinemaDlgByStats extends ViewBase {
  @Prop({ type: Boolean, default: false }) value!: boolean

  @Prop({ type: Object, required: true }) stats!: Stats

  inner = false

  loading = false
  total = 0
  list: CinemaDlgItem[] = []

  addQuerySalt0(qdata: any) {
    // do nothing
  }

  addQuerySalt1(qdata: any) {
    const ids = this.stats && this.stats.ids || []
    ids && (qdata.areaCodes = ids)
  }

  addQuerySalt2(qdata: any) {
    const ids = this.stats && this.stats.ids || []
    ids && (qdata.provinceIds = ids)
  }

  addQuerySalt3(qdata: any) {
    const ids = this.stats && this.stats.ids || []
    ids && (qdata.cityIds = ids)
  }

  addQuerySalt4(qdata: any) {
    const ids = this.stats && this.stats.ids || []
    ids && (qdata.ids = ids)
  }

  async fetch(query: any = {}, immediateLoading = false) {
    const qdata = {
      pageIndex: 1,
      pageSize: 10,
      ...query
    }

    const type = this.stats && this.stats.type || 0

    ; (this as any)[`addQuerySalt${type}`](qdata)

    immediateLoading && (this.loading = true)

    const delayLoading = debounce(() => this.loading = true, 500)
    delayLoading()
    try {
      const { data } = await queryCinema(qdata)
      this.total = data.totalCount || 0
      this.list = data.items || []
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
      delayLoading.cancel()
    }
  }

  cinemaChange(query: any) {
    this.fetch(query)
  }

  @Watch('value')
  watchValue(value: boolean) {
    this.inner = value

    // 每次显示，立马查询
    value && this.fetch({}, true)
  }

  @Watch('inner')
  watchInner(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
