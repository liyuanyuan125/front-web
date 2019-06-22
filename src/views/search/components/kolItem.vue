<template>
  <router-link
    :to="{ name: 'kol-figure', params: { id: item.id } }"
    class="item-in"
  >
    <figure class="item-img" :style="{ backgroundImage: `url(${item.image})` }"></figure>
    <main class="item-main">
      <h4 class="line line-name">{{item.name}}</h4>
      <div class="line line-sub">
        <span class="col1 name-en">{{item.nameEn}}</span>
        <span class="col2 fans">粉丝 {{item.fansCount}}</span>
      </div>
      <div class="line line-foot">
        <span class="col1 icons"><i class="platform-icon-weibo"></i></span>
        <span class="col2 ranking">微博红人榜：<em>{{item.fansRanking}}</em></span>
        <span class="col3 jy-index">鲸鱼指数：<em>{{item.jyIndex / 100}}</em></span>
      </div>
    </main>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class KolItem extends ViewBase {
  @Prop({ type: Object }) item!: any
}
</script>

<style lang="less" scoped>
@import '~@/style/platform/index.less';

.item-in {
  display: flex;
  padding: 30px 0;
  color: #00202d;
  font-size: 14px;
}

.item-img {
  width: 100px;
  height: 100px;
  background: no-repeat center top;
  background-size: cover;
  border-radius: 50%;
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

.icons {
  /deep/ .platform-icon-weibo {
    background-image: url(~@/assets/icon/weibo.png);
  }
}
</style>
