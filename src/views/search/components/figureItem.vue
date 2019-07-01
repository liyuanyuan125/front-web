<template>
  <router-link
    :to="{ name: 'film-figure', params: { id: item.id } }"
    class="item-in"
  >
    <img :src="item.avatar" class="item-img">
    <main class="item-main">
      <h4 class="line line-name">{{item.name}}</h4>
      <div class="line line-sub">
        <span class="col1 name-en">{{item.nameEn}}</span>
        <span class="col2 fans">粉丝 {{item.fansCount}}</span>
      </div>
      <div class="line line-foot">
        <span class="col1 title">{{(item.professions || []).join('、')}}</span>
        <span class="col2 ranking">影人粉丝榜：<em>{{item.fansRanking}}</em></span>
        <span class="col3 jy-index">鲸鱼指数：<em>{{item.jyIndex / 100}}</em></span>
      </div>
    </main>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class FigureItem extends ViewBase {
  @Prop({ type: Object }) item!: any
}
</script>

<style lang="less" scoped>
.item-in {
  display: flex;
  padding: 30px 0;
  color: #00202d;
  font-size: 14px;
}

.item-img {
  width: 100px;
  height: 132px;
  object-fit: contain;
  background-color: #fff;
}

.item-main {
  flex: 1;
  margin-left: 20px;
  line-height: 1.6;
}

.line {
  display: flex;
  align-items: center;
}

.col1 {
  width: 300px;
}

.col2 {
  width: 260px;
}

.col3 {
  flex: 1;
}

.line-name,
.name-en,
.line em {
  font-size: 22px;
  font-weight: 500;
}
</style>
