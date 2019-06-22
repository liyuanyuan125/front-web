<template>
  <section class="hot-pane" v-if="list && list.length > 0">
    <h3 class="pane-title">{{title}}</h3>
    <ul class="list">
      <li class="item-head">
        <span class="col1">排名</span>
        <slot name="head">
          <span class="col2">鲸娱指数</span>
          <span class="col3">全网热度</span>
        </slot>
      </li>
      <li v-for="(it, i) in list" :key="i" class="item">
        <router-link
          :to="{ name: routeName, params: { id: it.id } }"
          class="item-in"
        >
          <span class="col1 text-omit">
            <i>{{i + 1}}</i>
            <em>{{it.name}}</em>
          </span>
          <slot name="content" :item="it">
            <span class="col2">{{it.jyIndex}}</span>
            <span class="col3">{{it.rank}}</span>
          </slot>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class FilmItem extends ViewBase {
  @Prop({ type: String }) title!: string

  @Prop({ type: Array, default: () => [] }) list!: any[]

  @Prop({ type: String }) routeName!: string
}
</script>

<style lang="less" scoped>
.hot-pane {
  font-size: 14px;
  user-select: none;
}

.pane-title {
  font-size: 16px;
}

.list {
  margin: 18px -18px 0 0;
}

.item {
  margin-top: 15px;
}

.item-in {
  display: flex;
  color: #00202d;
}

.item:nth-child(2) .item-in {
  color: #da6c70;
  .col1 i {
    color: #fff;
    background-color: #da6c70;
  }
}

.item:nth-child(3) .item-in {
  color: #f5a623;
  .col1 i {
    color: #fff;
    background-color: #f5a623;
  }
}

.item:nth-child(4) .item-in {
  color: #00b6cc;
  .col1 i {
    color: #fff;
    background-color: #00b6cc;
  }
}

.col1 {
  display: inline-block;
  width: 118px;
  i {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    margin-right: 8px;
    text-align: center;
  }
}

.col2 {
  display: inline-block;
  width: 90px;
}

.col3 {
  width: 60px;
  text-align: center;
}
</style>
