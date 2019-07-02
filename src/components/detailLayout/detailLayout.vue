<template>
  <div class="detail-layout">
    <aside class="detail-side">
      <div class="detail-side-in">
        <slot name="beforeSide"></slot>
        <ul class="detail-route-list">
          <li
            v-for="(it, i) in routeList"
            :key="i"
            class="detail-route-item"
            :class="{
              'detail-route-item-on': it.route == nav
            }"
          >
            <router-link
              :to="{ name: it.route }"
              class="detail-route-item-in"
            >{{it.title}}</router-link>
          </li>
        </ul>
      </div>
    </aside>

    <main class="detail-main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { RouteItem } from './types'

@Component
export default class DetailLayout extends ViewBase {
  @Prop({ type: Array, default: () => [] }) routeList!: RouteItem[]

  get nav() {
    const nav = this.$route.meta.nav || this.$route.name
    return nav
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.detail-layout {
  position: relative;
  display: flex;
  margin-right: 20px;
  padding: 30px 0;
  font-size: 14px;
}

.detail-side {
  flex: 1;
  min-width: 128px;
  display: flex;
  justify-content: center;
}

.detail-side-in {
  width: 122px;
  height: 100%;
  background-color: rgba(0, 32, 45, .45);
}

.detail-route-list {
  padding: 15px 0;
}

.detail-route-item-on {
  .detail-route-item-in {
    color: #fff;
    background-color: rgba(0, 32, 45, .8);
  }
}

.detail-route-item-in {
  display: block;
  line-height: 44px;
  color: #afe6ff;
  padding-left: 20px;
}

.detail-main {
  // width: 1080px;
  margin-left: 10px;
  min-width: 980px;
  width: 100%;
}
</style>
