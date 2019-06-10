<template>
  <DetailLayout :routeList="routeList">

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
    { title: '概览', route: 'kol-figure' },
    { title: '运营情况', route: 'kol-detail-platform' },
    { title: '热度趋势', route: 'kol-detail-trend' },
    { title: '投放价格', route: 'kol-detail-price' },
    { title: '粉丝画像', route: 'kol-detail-fans' },
    { title: '口碑评论', route: 'kol-detail-comment' },
    { title: '主要作品', route: 'kol-detail-opus' },
    { title: '合作过的品牌', route: 'kol-detail-brand' },
  ]

  name = 'Papi酱'

  figure = 'https://picsum.photos/id/435/154/154'
}
</script>

<style lang="less">
@import '~@/site/lib.less';

.layout {
  position: relative;
  display: flex;
  margin-right: 20px;
  padding-top: 88px;
}

.side {
  flex: 1;
  min-width: 128px;
  display: flex;
  justify-content: center;
}

.side-in {
  width: 122px;
  height: 100%;
  background-color: rgba(0, 32, 45, .45);
}

.figure-name {
  position: absolute;
  top: 20px;
  color: #00202e;
  font-size: 24px;
  font-weight: normal;
}

.main {
  width: 1080px;
}
</style>
