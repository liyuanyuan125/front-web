<template>
  <DetailLayout :routeList="routeList">
    <div slot="beforeSide">
      <h2 class="figure-name">{{name}}</h2>
      <img :src="figure" class="figure-img">
    </div>
  </DetailLayout>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import DetailLayout, { RouteItem } from '@/components/detailLayout'

@Component({
  components: {
    DetailLayout
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

  name = 'Papi酱'

  figure = 'https://picsum.photos/id/435/154/154'
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
