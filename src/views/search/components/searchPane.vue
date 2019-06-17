<template>
  <div class="search-pane">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component({
  components: {}
})
export default class FigurePane extends ViewBase {
  @Prop({ type: String, default: '' }) keyword!: string

  query = {
    keyword: this.keyword,
    pageIndex: 1,
    pageSize: 10
  }

  oldQuery: any = {}

  totalCount = 0

  loading = true

  list: any[] = []

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
