<template>
  <div class="stats-pane">
    <ul class="stats-list">
      <li class="stats-item">
        <label>覆盖区域</label>
        <em>{{value.region}}个</em>
      </li>
      <li class="stats-item">
        <label>覆盖省份</label>
        <em>{{value.province}}个</em>
      </li>
      <li class="stats-item">
        <label>覆盖城市</label>
        <em>{{value.city}}个</em>
      </li>
      <li class="stats-item">
        <label>覆盖影院</label>
        <em>{{value.cinema}}家</em>
      </li>
    </ul>
    <Button type="primary" :disabled="noCinema" class="btn-view"
      @click="viewCinema">查看已选影院</Button>

    <CinemaDlgByStats v-model="cinemaShow" :stats="value"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { Stats } from './types'
import { CinemaDlgByStats } from '../cinemaDlg'

/**
 * 统计面板
 */
@Component({
  components: {
    CinemaDlgByStats
  }
})
export default class StatsPane extends ViewBase {
  /** model 属性 */
  @Prop({ type: Object, default: () => {}, required: true }) value!: Stats

  get noCinema() {
    return Object.values(this.value).every(it => it == 0)
  }

  cinemaShow = false

  viewCinema() {
    this.cinemaShow = true
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.stats-pane {
  background-color: #fff;
}
.stats-list {
  line-height: 2.4;
  color: @c-sub-text;
  font-size: 14px;
  margin: 24px 0 0 30px;
}
.stats-item {
  padding-left: 24px;
  background: url(./assets/checked.png) no-repeat left center;
  em {
    color: @c-text;
    margin-left: 20px;
  }
}
.btn-view {
  position: absolute;
  left: 50%;
  bottom: 20px;
  width: 120px;
  height: 30px;
  padding: 0;
  margin-left: -60px;
  font-size: 12px;
}
</style>
