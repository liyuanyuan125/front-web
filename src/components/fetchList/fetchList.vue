<template>
  <section class="fetch-pane">
    <div class="fetch-loading" v-if="loading">加载中</div>
    <div class="fetch-empty" v-if="!loading && total === 0">空空如也</div>
    <ul class="fetch-list" v-if="!loading && list && list.length > 0">
      <li v-for="(item, index) in list" class="fetch-item">
        <slot name="item" :item="item" :index="index"></slot>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { MapType } from '@/util/types'
import { Fetch } from './types'

@Component
export default class FetchList extends ViewBase {
  /** 数据请求接口 */
  @Prop({ type: Function, required: true }) fetch!: Fetch

  /** 请求参数，pageIndex、pageSize 本组件自带，分别默认为 1、10 */
  @Prop({ type: Object, default: () => ({}) }) query!: MapType<any>

  queryData: any = {
    pageIndex: 1,
    pageSize: 10,
    ...this.query,
  }

  oldQuery: any = {}

  loading = false

  list: any[] = []

  total: number | null = null

  mounted() {
    this.fetchData()
  }

  async fetchData() {
    if (this.loading) {
      return
    }

    // 复制一份，预防被 fetch 改变
    const query = JSON.parse(JSON.stringify(this.queryData))
    this.oldQuery = { ...query }

    this.loading = true

    try {
      const { list, total } = await this.fetch(query)
      this.list = list
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  @Watch('query', { deep: true })
  watchKeyword(query: MapType<any>) {
    this.queryData = {
      ...this.queryData,
      ...query
    }
  }

  @Watch('queryData', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.fetchData()
  }
}
</script>

<style lang="less" scoped>
.fetch-loading,
.fetch-empty {
  color: #888;
  font-size: 16px;
  text-align: center;
  user-select: none;
}
</style>
