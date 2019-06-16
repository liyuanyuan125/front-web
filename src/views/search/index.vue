<template>
  <div class="page">
    <header class="search-header">
      <h2 class="search-title">搜索 “{{query.keyword}}” 共找到 {{totalCount}} 个资源</h2>

      <p class="search-suggest" v-if="suggest">
        系统猜测您想找
        <router-link
          :to="{
            name: 'search',
            params: {
              keyword: suggest,
              type: typeOn
            }
          }"
        >{{suggest}}</router-link>
      </p>

      <Tabs v-model="typeOn" class="search-type">
        <TabPane v-for="it in typeList" :key="it.name" :name="it.name" :label="it.label"></TabPane>
      </Tabs>
    </header>

    <main class="search-body"></main>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

// 搜索类型，分别为：影人、影片、kol
type Type = 'figure' | 'film' | 'kol'

@Component({
  components: {}
})
export default class SearchPage extends ViewBase {
  @Prop({ type: String, default: '' }) keyword!: string

  @Prop({ type: String, default: 'figure' }) type!: Type

  typeOn = this.type

  typeList = [
    { name: 'figure', label: '影人' },
    { name: 'film', label: '影片' },
    { name: 'kol', label: 'KOL' }
  ]

  query = {
    keyword: this.keyword,
    pageIndex: 1,
    pageSize: 10
  }

  oldQuery: any = {}

  totalCount = 0

  loading = true

  list: any[] = []

  suggest = '影视剧《阿拉丁》'

  async fetch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.loading = true

    try {
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  @Watch('keyword')
  watchKeyword() {
    this.query.keyword = this.keyword
  }

  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.fetch()
  }
}
</script>

<style lang="less" scoped>
.page {
  margin: 40px 40px 90px;
}

.search-header {
  color: #fff;
  padding: 22px 40px 0;
  user-select: none;
  border-radius: 5px 5px 0 0;
  background-color: fade(#00202d, 80);
}

.search-title {
  font-size: 28px;
  font-weight: normal;
}

.search-suggest {
  font-size: 16px;
  color: rgba(255, 255, 255, .7);
  margin-top: 8px;
}

.search-type {
  margin-top: 12px;

  /deep/ .ivu-tabs-bar {
    border-bottom: 0;
    margin-bottom: 2px;
  }

  /deep/ .ivu-tabs-tab {
    font-size: 18px;
    color: rgba(255, 255, 255, .7);
    padding: 8px 23px;
  }

  /deep/ .ivu-tabs-tab-active {
    color: #fff;
  }

  /deep/ .ivu-tabs-ink-bar {
    background-color: transparent;
    &::before {
      content: '';
      position: absolute;
      left: 23px;
      right: 23px;
      height: 100%;
      background-color: #fff;
    }
  }
}

.search-body {
  min-height: 388px;
  background-color: rgba(255, 255, 255, .8);
  border-radius: 0 0 7px 7px;
}
</style>
