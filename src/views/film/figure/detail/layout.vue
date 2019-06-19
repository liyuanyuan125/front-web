<template>
  <DetailLayout :routeList="routeList">
    <div slot="beforeSide">
      <router-link :to="{ name: 'film-figure', params: { id } }">
        <h2 class="figure-name">{{name}}</h2>
        <img :src="figure" class="figure-img">
      </router-link>
    </div>
  </DetailLayout>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import DetailLayout, { RouteItem } from '@/components/detailLayout'
import { getFigure } from './data'

@Component({
  components: {
    DetailLayout
  }
})
export default class Layout extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  routeList: RouteItem[] = [
    { title: '概况', route: 'film-figure' },
    { title: '作品列表', route: 'film-figure-detail-works' },
    { title: '合作品牌', route: 'film-figure-detail-brand' },
    { title: '更多资料', route: 'film-figure-detail-information' },
    { title: '粉丝画像', route: 'film-figure-detail-fans' },
    { title: '口碑评论', route: 'film-figure-detail-comment' },
    { title: '全网热度', route: 'film-figure-detail-hot' },
    { title: '平台运营', route: 'film-figure-detail-platform' },
  ]

  name = ''

  figure = ''

  async created() {
    const { name, figure } = await getFigure(this.id)
    this.name = name
    this.figure = figure
  }
}
</script>

<style lang="less">
@import '~@/site/lib.less';

.detail-layout {
  padding-top: 78px;
}

.detail-side-in {
  border-radius: 6px 6px 0 0;
}

.figure-name {
  position: absolute;
  top: 16px;
  color: #00202e;
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
