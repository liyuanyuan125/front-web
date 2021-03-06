<template>
  <section class="fetch-pane">
    <div class="fetch-loading" v-if="loading">加载中</div>

    <div class="fetch-empty" v-if="!loading && !timeout && total === 0">暂无数据</div>

    <div class="fetch-timeout" v-if="timeout">
      请求超时，<a class="retry" @click="retry">点击重试</a>
    </div>

    <ul class="fetch-list" v-if="!loading && !timeout && total > 0">
      <li v-for="(item, index) in list" class="fetch-item">
        <slot name="item" :item="item" :index="index"></slot>
      </li>
    </ul>

    <Page
      :total="total"
      :current.sync="queryData.pageIndex"
      :page-size="queryData.pageSize"
      v-if="!loading && total > 10"
    />
  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { MapType } from '@/util/types'
import { Fetch } from './types'
import { isEqual } from 'lodash'

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

  timeout = false

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
    this.timeout = false

    try {
      const { list, total } = await this.fetch(query)
      this.list = list
      this.total = total
    } catch (ex) {
      const name = ex && ex.code && `handle${ex.code}`
      ; ((this as any)[name] || this.handleError).call(this, ex)
    } finally {
      this.loading = false
    }
  }

  // timeout
  handle880() {
    this.timeout = true
  }

  retry() {
    this.fetchData()
  }

  @Watch('query', { deep: true })
  watchQuery(query: MapType<any>) {
    this.queryData = {
      ...this.queryData,
      ...query
    }
  }

  @Watch('queryData', { deep: true })
  watchQueryData() {
    const noChange = isEqual(this.queryData, this.oldQuery)
    if (noChange) {
      return
    }
    if (this.queryData.pageIndex == this.oldQuery.pageIndex) {
      this.queryData.pageIndex = 1
    }
    this.fetchData()
  }

  @Watch('total')
  watchTotal(total: number) {
    this.$emit('totalChange', total)
  }
}
</script>

<style lang="less" scoped>
.fetch-loading,
.fetch-empty,
.fetch-timeout {
  color: #888;
  font-size: 16px;
  text-align: center;
  user-select: none;
}
</style>
