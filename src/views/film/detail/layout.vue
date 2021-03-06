<template>
  <DetailLayout :routeList="routeList">
    <div slot="beforeSide">
      <router-link :to="{ name: 'film-movie', params: { id } }">
        <h2 class="figure-name">{{name}}</h2>
        <Figure :src="figure" class="figure-img"/>
      </router-link>
    </div>
  </DetailLayout>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import DetailLayout, { RouteItem } from '@/components/detailLayout'
import Figure from '@/components/figure'
import { getMovie } from './data'
import { RouteMetaBase } from '@/routes'
import { setPageTitle } from '@/util/browser'

@Component({
  components: {
    DetailLayout,
    Figure
  }
})
export default class Layout extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  routeList: RouteItem[] = [
    { title: '首页', route: 'film-movie' },
    { title: '主创阵容', route: 'film-detail-creator' },
    { title: '详细资料', route: 'film-detail-information' },
    { title: '用户画像', route: 'film-detail-fans' },
    { title: '观影趋势', route: 'film-detail-trend' },
    { title: '全网热度', route: 'film-detail-hot' },
  ]

  name = ''

  figure = ''

  get pageTitle() {
    const meta = this.$route.meta as RouteMetaBase
    const title = meta && meta.pageTitle || meta.title || ''
    return `${this.name}${title}-鲸鱼数据`
  }

  async created() {
    const { name, figure } = await getMovie(this.id)
    this.name = name
    this.figure = figure
  }

  @Watch('pageTitle', { immediate: true })
  watchPageTitle() {
    setPageTitle(this.pageTitle)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.detail-layout {
  padding-top: 78px;
  /deep/ .detail-side-in {
    border-radius: 6px 6px 0 0;
  }
}

.figure-name {
  position: absolute;
  top: 16px;
  color: #fff;
  font-size: 24px;
  font-weight: normal;
}

.figure-img {
  width: 122px;
  height: auto;
  min-height: 122px;
  max-height: 220px;
  border: 1px solid #53c5df;
  border-radius: 6px;
}
</style>
