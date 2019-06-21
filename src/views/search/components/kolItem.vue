<template>
  <router-link
    :to="{ name: 'kol-figure', params: { id: item.kolId } }"
    class="item-in"
  >{{item.kolId}}</router-link>
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
</style>
