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
    { title: '首页', route: 'brand-item' },
    { title: '用户画像', route: 'brand-detailpro-fans' },
    { title: '口碑评论', route: 'brand-detailpro-comment' },
    { title: '全网热度', route: 'brand-detailpro-trend' },
  ]

  name = 'Papi酱'

  figure = 'https://picsum.photos/id/435/154/154'
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
