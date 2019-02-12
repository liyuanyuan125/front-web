<template>
  <div class="city-map">
    <Dot v-for="(it, i) in cityList" :key="i" class="city-dot"
      :style="`top:${it.top}px;left:${it.left}px`"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Dot from '@/components/Dot.vue'
import { cityList } from './data'
import { cloneDeep } from 'lodash'

@Component({
  components: {
    Dot
  }
})
export default class CityMap extends ViewBase {
  @Prop({ type: Array, default: () => [] }) names!: string[]

  get cityList() {
    const nameJoin = (this.names || []).join('|')
    const list = cloneDeep(cityList).filter(it =>
      nameJoin.includes(it.name) || nameJoin.includes(it.province)
    )
    return list
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.city-map {
  position: relative;
  width: 650px;
  height: 537px;
  background: #fff url(./assets/map.png) no-repeat;
}

.city-dot {
  position: absolute;
}
</style>
