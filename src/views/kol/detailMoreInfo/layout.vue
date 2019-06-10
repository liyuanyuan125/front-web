<template>
  <div class="layout">
    <aside class="side">
      <div class="side-in">
        <h2 class="figure-name">{{name}}</h2>
        <ul class="route-list">
          <li class="route-item">
            <router-link :to="{ name: 'kol-figure' }">概览</router-link>
          </li>
          <li class="route-item">
            <router-link :to="{ name: 'kol-figure' }">运营情况</router-link>
          </li>
        </ul>
      </div>
    </aside>
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class DetailLayout extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

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
