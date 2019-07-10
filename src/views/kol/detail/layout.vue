<template>
  <DetailLayout :routeList="routeList">
    <div slot="beforeSide">
      <router-link :to="{ name: 'kol-figure', params: { id } }">
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
import { getKol } from './data'
import { Route } from 'vue-router'
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
    { title: '概览', route: 'kol-figure' },
    { title: '运营情况', route: 'kol-detail-platform' },
    { title: '热度趋势', route: 'kol-detail-trend' },
    // { title: '投放价格', route: 'kol-detail-price' },
    { title: '粉丝画像', route: 'kol-detail-fans' },
    { title: '口碑评论', route: 'kol-detail-comment' },
    { title: '主要作品', route: 'kol-detail-opus' },
    { title: '合作过的品牌', route: 'kol-detail-brand' },
  ]

  name = ''

  figure = ''

  get pageTitle() {
    const meta = this.$route.meta as RouteMetaBase
    const title = meta && meta.pageTitle || meta.title || ''
    return `${this.name}${title}-鲸娱数据`
  }

  async created() {
    const { name, figure } = await getKol({ id: this.id, channel: 'weibo' })
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
  height: 122px;
  border: 1px solid #53c5df;
  border-radius: 6px;
}
</style>
