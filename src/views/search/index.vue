<template>
  <div class="page">
    <header class="search-header">
      <h2 class="search-title">搜索 “{{keyword}}” 共找到 {{total}} 个资源</h2>

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

    <section class="search-body">
      <main class="search-main">
        <div class="figure-pane" v-if="typeOn == 'figure'">
          <FetchList
            key="figure"
            :fetch="fetchFigure"
            :query="{ keyword }"
            @totalChange="t => total = t"
          >
            <FigureItem slot="item" slot-scope="{ item }" :item="item"/>
          </FetchList>
        </div>

        <div class="film-pane" v-if="typeOn == 'film'">
          <FetchList
            key="film"
            :fetch="fetchFilm"
            :query="{ keyword }"
            @totalChange="t => total = t"
          >
            <FilmItem slot="item" slot-scope="{ item }" :item="item"/>
          </FetchList>
        </div>

        <div class="kol-pane" v-if="typeOn == 'kol'">
          <FetchList
            key="kol"
            :fetch="fetchKol"
            :query="{ keyword }"
            @totalChange="t => total = t"
          >
            <KolItem slot="item" slot-scope="{ item }" :item="item"/>
          </FetchList>
        </div>
      </main>

      <aside class="search-side">
        <template v-if="typeOn == 'figure'">
          <SimilarPane title="相似影人" :list="figureData.similarList" routeName="film-figure"/>

          <HotPane title="全网影人热度榜" :list="figureData.hotList" routeName="film-figure"/>
        </template>

        <template v-if="typeOn == 'film'">
          <SimilarPane
            title="相似影片"
            :list="filmData.similarList"
            :size="{ width: 80, height: 110 }"
            routeName="film-movie"
          />

          <HotPane title="全网影人热度榜" :list="filmData.hotList" routeName="film-movie"/>
        </template>

        <template v-if="typeOn == 'kol'">
          <SimilarPane title="相似影人" :list="kolData.similarList" routeName="film-figure"/>

          <HotPane title="全网影人热度榜" :list="kolData.hotList" routeName="film-figure"/>
        </template>
      </aside>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import FetchList from '@/components/fetchList'
import FigureItem from './components/figureItem.vue'
import FilmItem from './components/filmItem.vue'
import KolItem from './components/kolItem.vue'
import SimilarPane from './components/similarPane.vue'
import HotPane from './components/hotPane.vue'
import { searchFigure, searchFilm, searchKol } from './data'
import { setPageTitle } from '@/util/browser'

// 搜索类型，分别为：影人、影片、kol
type Type = 'figure' | 'film' | 'kol'

@Component({
  components: {
    FetchList,
    FigureItem,
    FilmItem,
    KolItem,
    SimilarPane,
    HotPane
  }
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

  total = 0

  suggest = ''

  figureData: any = {
    similarList: [],
    hotList: []
  }

  filmData: any = {
    similarList: [],
    hotList: []
  }

  kolData: any = {
    similarList: [],
    hotList: []
  }

  get pageTitle() {
    const { label } = this.typeList.find(it => it.name == this.typeOn)!
    return `搜索：${this.keyword} ${label} -鲸鱼数据`
  }

  async fetchFigure(query: any) {
    const data = await searchFigure(query)

    this.figureData.similarList = data.similarList
    this.figureData.hotList = data.hotList

    return data
  }

  async fetchFilm(query: any) {
    const data = await searchFilm(query)

    this.filmData.similarList = data.similarList
    this.filmData.hotList = data.hotList

    return data
  }

  async fetchKol(query: any) {
    const data = await searchKol(query)

    this.kolData.similarList = data.similarList
    this.kolData.hotList = data.hotList

    return data
  }

  @Watch('typeOn')
  watchTypeOn(type: string) {
    const route =
      type == 'figure' ? { name: 'search' } : { name: 'search', params: { type } }
    this.$router.push(route)
  }

  @Watch('pageTitle', { immediate: true })
  watchPageTitle() {
    setPageTitle(this.pageTitle)
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
  color: rgba(255, 255, 255, 0.7);
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
    color: rgba(255, 255, 255, 0.7);
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
  display: flex;
  justify-content: space-between;
  min-height: 388px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0 0 7px 7px;
  padding: 40px 45px 60px;
}

.search-main {
  flex: 1;
  /deep/ .fetch-list {
    margin-top: -25px;
  }
  /deep/ .fetch-item {
    border-top: 1px solid rgba(0, 32, 45, 0.1);
    &:first-child {
      border-top: 0;
    }
  }
}

.search-side {
  width: 270px;
  margin-left: 30px;

  /deep/ .similar-pane ~ .hot-pane {
    margin-top: 26px;
  }
}
</style>
