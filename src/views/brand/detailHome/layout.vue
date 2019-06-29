<template>
  <DetailLayout :routeList="routeList">
    <div slot="beforeSide">
      <router-link :to="{ name: 'brand-home', params: { id } }">
        <h2 class="figure-name">{{name}}</h2>
        <img :src="figure" class="figure-img" v-if="figure">
      </router-link>
    </div>
  </DetailLayout>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import DetailLayout, { RouteItem } from '@/components/detailLayout'

import { getBrand } from './data'

@Component({
  components: {
    DetailLayout
  }
})
export default class Layout extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  routeList: RouteItem[] = [
    { title: '首页', route: 'brand-home' },
    { title: '用户画像', route: 'brand-homedetail-fans' },
    { title: '口碑评论', route: 'brand-homedetail-comment' },
    { title: '全网热度', route: 'brand-homedetail-trend' },
  ]

  name = ''

  figure = ''

  async created() {
    const { name, figure } = await getBrand(this.id)
    this.name = name
    this.figure = figure
  }
}
</script>

<style lang="less" scoped>
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
