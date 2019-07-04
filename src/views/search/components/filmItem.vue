<template>
  <router-link
    :to="{ name: 'film-movie', params: { id: item.movie_id } }"
    class="item-in"
  >
    <img :src="item.main_pic" class="item-img">
    <main class="item-main">
      <h4 class="line line-name">{{item.name_cn}}</h4>
      <div class="line line-sub">{{item.name_en}}</div>
      <div class="line-info">
        <p v-if="item.directorName">导演：{{item.directorName}}</p>
        <p v-if="item.actorName">主演：{{item.actorName}}</p>
        <p v-if="item.pubDate">上映时间：{{item.pubDate}}</p>
        <p v-if="item.typeName">主演：{{item.typeName}}</p>
      </div>
      <div class="line-box">累计票房：{{item.totalBoxOffice}}</div>
    </main>
    <aside class="side1">
      <div class="line year"><em>{{item.year_box}}</em></div>
      <div class="line year-box">年度票房榜：<em>{{item.yearBoxOfficeRank}}</em></div>
    </aside>
    <aside class="side2">
      <div class="line jy-index">鲸鱼指数：<em>{{item.jy_index / 100}}</em></div>
    </aside>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class FilmItem extends ViewBase {
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
  width: 140px;
  height: 186px;
}

.item-main {
  width: 300px;
  margin-left: 20px;
  line-height: 1.6;
}

.side1 {
  width: 226px;
  padding-top: 62px;
}

.side2 {
  padding-top: 95px;
}

.line {
  display: flex;
  align-items: center;
}

.line-name,
.line-sub,
.line em {
  font-size: 22px;
  font-weight: 500;
}

.line-box {
  margin-top: 24px;
  font-size: 16px;
  font-weight: 500;
}
</style>
