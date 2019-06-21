<template>
  <router-link
    :to="{ name: 'film-figure', params: { id: item.id } }"
    class="item-in"
  >{{item.id}}</router-link>
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

</style>
