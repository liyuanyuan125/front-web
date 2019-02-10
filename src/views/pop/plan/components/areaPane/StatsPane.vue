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
    <CinemaDlg v-model="cinemaShow" :loading="cinemaLoading" :total="cinemaTotal"
      :list="cinemaList" @change="cinemaChange"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { Stats } from './types'
import CinemaDlg, { CinemaDlgItem } from '../cinemaDlg'
import { queryCinemas } from '@/api/plan'
import { debounce, flatten, uniq } from 'lodash'

/**
 * 统计面板
 */
@Component({
  components: {
    CinemaDlg
  }
})
export default class StatsPane extends ViewBase {
  /** model 属性 */
  @Prop({ type: Object, default: () => {}, required: true }) value!: Stats

  /** 统计类型 */
  @Prop({ type: Number, required: true }) type!: number

  get noCinema() {
    return Object.values(this.value).every(it => it == 0)
  }

  cinemaShow = false
  cinemaLoading = false
  cinemaTotal = 0
  cinemaList: CinemaDlgItem[] = []

  addQuerySalt0(qdata: any) {
  }

  addQuerySalt1(qdata: any) {
    qdata.areaCodes = (this.value.regionList || []).map(it => it.code)
  }

  addQuerySalt2(qdata: any) {
    qdata.provinceIds = (this.value.provinceList || []).map(it => it.id)
  }

  addQuerySalt3(qdata: any) {
    const cityListList = this.value.cityLevelList.map(it => it.cityList)
    const cityList = flatten(cityListList)
    const ids = cityList.map(it => it.id)
    qdata.cityIds = uniq(ids)
  }

  addQuerySalt4(qdata: any) {
    // TODO
  }

  async queryCinema(query: any = {}, immediateLoading = false) {
    const qdata = {
      pageIndex: 1,
      pageSize: 10,
      ...query
    }

    ; (this as any)[`addQuerySalt${this.type}`](qdata)

    immediateLoading && (this.cinemaLoading = true)

    const delayLoading = debounce(() => this.cinemaLoading = true, 500)
    delayLoading()
    try {
      const { data } = await queryCinemas(qdata)
      this.cinemaTotal = data.totalCount || 0
      this.cinemaList = data.items
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.cinemaLoading = false
      delayLoading.cancel()
    }
  }

  viewCinema() {
    this.cinemaShow = true
    this.queryCinema({}, true)
  }

  cinemaChange(query: any) {
    this.queryCinema(query)
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
