<template>
  <section class="similar-pane" v-if="list && list.length > 0">
    <h3 class="pane-title">{{title}}</h3>
    <ul class="list">
      <li v-for="(it, i) in list" :key="i" class="item">
        <router-link
          :to="{ name: routeName, params: { id: it.id } }"
          class="item-in"
        >
          <img
            :src="it.avatar"
            :width="itemSize.width"
            :height="itemSize.height"
            class="item-img"
          >
          <h4 class="item-name">{{it.name}}</h4>
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

  @Prop({ type: Object, default: () => ({ width: 80, height: 80 }) })
  itemSize!: { width: number, height: number }

  @Prop({ type: String }) routeName!: string
}
</script>

<style lang="less" scoped>
</style>
