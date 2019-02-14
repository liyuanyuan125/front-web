<template>
  <div class="area-pane">
    <section v-if="type == 0">
      <div class="pane-content map-box">
        <StatsPane :value="statsMap[0]" class="stats-pane"/>
      </div>
    </section>

    <section v-if="type == 1">
      <div class="pane-content region-box">
        <CheckboxPane v-model="model[1]" :list="regionList" value-key="code"
          class="checkbox-pane">
          <span slot="item" slot-scope="{ item: { name, count } }" class="name-sub">
            <em>{{name}}</em>
            <sub>{{count}}家影院</sub>
          </span>
        </CheckboxPane>

        <StatsPane :value="statsMap[1]" class="stats-pane"/>
      </div>
    </section>

    <section v-if="type == 2">
      <div class="pane-content province-box">
        <CheckboxPane v-model="model[2]" :list="provinceList" value-key="id"
          class="checkbox-pane">
          <span slot="item" slot-scope="{ item: { name, count } }" class="name-sub">
            <em>{{name}}</em>
            <sub>{{count}}家影院</sub>
          </span>
        </CheckboxPane>

        <StatsPane :value="statsMap[2]" class="stats-pane"/>
      </div>
    </section>

    <section v-if="type == 3">
      <div class="pane-content city-box">
        <form class="filter-form" @submit.prevent>
          <Select v-model="cityLevel" placeholder="请选择城市级别" class="select-level"
            @on-change="cityKeyword = ''">
            <Option v-for="item in cityLevelList" :key="item.code"
              :value="item.code">{{item.name}}</Option>
          </Select>
          <Input v-model="cityKeyword" placeholder="搜索城市名称"
            class="input-search" clearable/>
          <Button type="primary" class="button-search"/>

          <Button class="button-all" :disabled="citySearchList.length == 0"
            @click="onCitySelectAll">{{cityAllText}}</Button>
        </form>

        <CheckboxPane v-model="model[3]" :list="cityShowList" value-key="id"
          class="checkbox-pane" no-all>
          <span slot="item" slot-scope="{ item: { name, count, cityGradeName } }" class="name-sub">
            <em>{{name}}</em>
            <sub>{{cityGradeName}}</sub>
            <sub>{{count}}家影院</sub>
          </span>
        </CheckboxPane>

        <Page :current.sync="cityPage" :total="citySearchList.length" size="small"
          show-total class="pane-page"/>

        <StatsPane :value="statsMap[3]" class="stats-pane"/>
      </div>
    </section>

    <section v-if="type == 4">
      <div class="pane-content cinema-box">
        <form class="filter-form" @submit.prevent>
          <Select v-model="boxLevel" placeholder="请选择票房级别" class="select-level"
            @on-change="cinemaKeyword = ''">
            <Option v-for="item in boxLevelListValid" :key="item.key"
              :value="item.key">{{item.text}}</Option>
          </Select>
          <Input v-model="cinemaKeyword" placeholder="搜索影院名称"
            class="input-search" clearable/>
          <Button type="primary" class="button-search"/>

          <Button class="button-all" @click="onCinemaSelectAll"
            :disabled="cinemaList.length == 0 || cinemaAllLoading">{{cinemaAllText}}</Button>
        </form>

        <TinyLoading v-if="cinemaLoading" class="cinema-loading"/>

        <CheckboxPane v-model="model[4]" :list="cinemaList" value-key="id"
          class="checkbox-pane" no-all v-if="!cinemaLoading">
          <span slot="item" slot-scope="{ item: { boxLevelCode, boxLevelName,
            shortName, provinceName, cityName } }" class="name-sub">
            <i v-if="boxLevelCode" class="box-level-flag"
              :class="`box-level-flag-${boxLevelCode.toLowerCase()}`">{{boxLevelName}}</i>
            <em>{{shortName}}</em>
            <sub>{{provinceName}}</sub>
            <sub>{{cityName}}</sub>
          </span>
        </CheckboxPane>

        <Page :current.sync="cinemaPage" :total="cinemaTotal" size="small"
          show-total class="pane-page" v-if="!cinemaLoading"/>

        <StatsPane :value="statsMap[4]" class="stats-pane"/>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import StatsPane from './StatsPane.vue'
import { Region, Province, City, Stats, CityLevel } from './types'
import { areaTypeList } from '../../types'
import CheckboxPane from '@/components/checkboxPane'
import cachedStore from '@/fn/cachedStore'
import { queryStats, queryAll } from '@/api/cinema'
import { hash } from '@/fn/object'
import { isNullOrEmpty } from '@/fn/string'
import { groupBy, uniq, debounce, cloneDeep, isEqual } from 'lodash'
import { KeyTextControlStatus } from '@/util/types'
import TinyLoading from '@/components/TinyLoading.vue'
import { slice } from '@/fn/object'

// 对查询进行适当缓存
const store = cachedStore({ timeout: 1888 })
const cachedQueryStats = (query: any = {}) => {
  const key = hash(query, 'queryStats')
  const res = store(key, () => queryStats(query))
  return res
}

const filterByName = (it: any) => !isNullOrEmpty(it.name)

interface ListMap {
  [name: number]: number[] | string[]
}

interface StatsMap {
  [name: number]: Stats
}

interface Cinema {
  id: number
  shortName: string
  officialName: string
  areaCode: string
  areaName: string
  provinceId: number
  provinceName: string
  cityId: number
  cityName: string
  boxLevelCode: number
  boxLevelName: string
}

// 后端接口设计为，不同的 type 传不同的 ids
const idsNameMap: any = {
  1: 'areaCodes',
  2: 'provinceIds',
  3: 'cityIds',
  4: 'ids',
}

// 将一组数据转换为 int 数组
const toInt = (list: any[]) => {
  const intList = list.map(it => parseInt(it, 10))
  // 一定要在绝对相等时，返回 list 本身，否则会造成 vue 死循环
  return isEqual(intList, list) ? list : intList
}

// 不做任何转换
const noCast = (list: any[]) => list

// 不同 type，对传入的 value 值进行类型转换，其中：
// type = 0 为空数组，不需要转换
// type = 1 为字符串数组，不需要转换
// type = 2、3、4 为纯数字数组，但传入的值可能为字符串，需要进行转换
const typeCastMap: any = {
  0: noCast,
  1: noCast,
  2: toInt,
  3: toInt,
  4: toInt,
}

const defaultStats: Stats = {
  region: 0,
  province: 0,
  city: 0,
  cinema: 0,

  regionList: [],
  provinceList: [],
  cityLevelList: [],
  boxLevelList: [],

  type: 0,
  ids: [],
}

/**
 * 地区选择面板，分别含有：不限、按区域、按省份、按城市、按影院选择项
 * 该组件是创建广告计划的一部分，很多数据依赖于主页面传入，样式「穿透」复用
 * 主页面样式，所以组件复用性不是很强，仅仅是为了分割代码
 */
@Component({
  components: {
    StatsPane,
    CheckboxPane,
    TinyLoading,
  }
})
export default class AreaPane extends ViewBase {
  /** 投放地区类型 */
  @Prop({ type: Number, default: 0, required: true }) type!: number

  /** model 属性 */
  @Prop({ type: Array, default: () => [], required: true }) value!: number[]

  /** 票房级别 */
  @Prop({ type: Array, default: () => [], required: true }) boxLevelList!: KeyTextControlStatus[]

  model = areaTypeList.reduce<ListMap>((map, { key }) => {
    map[key as number] = []
    return map
  }, {})

  statsMap = areaTypeList.reduce<StatsMap>((map, { key }) => {
    const value = cloneDeep(defaultStats)
    map[key as number] = { ...value, type: key as number }
    return map
  }, {})

  regionList: Region[] = []
  provinceList: Province[] = []
  cityList: City[] = []

  cityLevel = ''
  cityPage = 1
  cityKeyword = ''

  get cityGroup() {
    const group = groupBy(this.cityList, 'cityGradeCode')
    return group
  }

  get cityLevelList() {
    const group = this.cityGroup
    const list = Object.entries(group).map(([ code, ls ]) => ({
      code,
      name: ls[0].cityGradeName
    }))
    return list
  }

  get citySearchList() {
    const keyword = (this.cityKeyword || '').trim()
    const list = keyword
      ? this.cityList.filter(it => it.name.includes(keyword))
      : this.cityGroup[this.cityLevel]
    return list || []
  }

  get cityShowList() {
    const page = this.cityPage || 1
    const list = this.citySearchList
    const result = list.slice((page - 1) * 10, page * 10)
    return result
  }

  get cityAllText() {
    const keyword = (this.cityKeyword || '').trim()
    const item = this.cityLevelList.find(it => it.code == this.cityLevel)
    const name = item && item.name || ''
    const text = keyword ? '全选所有搜索结果' : `全选所有${name}`
    return text
  }

  boxLevel = ''
  cinemaPage = 1
  cinemaTotal = 0
  cinemaKeyword = ''
  cinemaLoading = false
  cinemaList = [] as Cinema[]

  // 当选择全部的时候，加 loading
  cinemaAllLoading = false

  get boxLevelListValid() {
    const list = this.boxLevelList
    return list.filter(it => it.controlStatus == 1)
  }

  get cinemaAllText() {
    const keyword = (this.cinemaKeyword || '').trim()
    const item = this.boxLevelList.find(it => it.key == this.boxLevel)
    const name = item && item.text || ''
    const text = keyword ? '全选所有搜索结果' : `全选所有${name}影院`
    return text
  }

  async created() {
    const data = await this.fetch()
    this.regionList = data && data.regionList || []
    this.provinceList = data && data.provinceList || []
    this.cityList = data && data.cityList || []

    this.updateStats(data, 0)

    // 默认选择第一个级别
    this.cityLevel = ((this.cityLevelList || [])[0] || {}).code || ''
  }

  fetchCinema(flush = true) {
    const handler = debounce(async () => {
      const delayLoading = debounce(() => this.cinemaLoading = true, 500)
      delayLoading()
      try {
        const data = await this.doFetchCinema()
        this.cinemaList = data.items || []
        this.cinemaTotal = data.totalCount || 0
      } catch (ex) {
        this.handleError(ex)
      } finally {
        this.cinemaLoading = false
        delayLoading.cancel()
      }
    }, 588)
    handler()
    flush && handler.flush()
  }

  // 根据当前条件，获取全部数据，以便选中全部
  async fetchCinemaAll() {
    this.cinemaAllLoading = true
    try {
      const data = await this.doFetchCinema({
        pageIndex: 1,
        pageSize: 88888888,
      })
      return data
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.cinemaAllLoading = false
    }
  }

  async doFetchCinema(query: any = {}) {
    const qdata: any = {
      // status: 1,
      pageIndex: this.cinemaPage,
      pageSize: 10,
      ...query,
    }
    const keyword = (this.cinemaKeyword || '').trim()
    keyword
      ? (qdata.query = keyword)
      : (qdata.boxLevelCode = this.boxLevel)

    const { data } = await queryAll(qdata)
    return data
  }

  async fetch(query: any = {}) {
    try {
      const { data } = await cachedQueryStats(query)
      const {
        categorizedByAreaCode: regionList = [],
        categorizedByProvinceId: provinceList = [],
        categorizedByCityId: cityList = [],
        categorizedByCityGradeCode: cityLevelList = [],
        categorizedByBoxLevelCode: boxLevelList = [],
        cinemaCount = 0,
      } = data && data.statisticsResult || {}
      return {
        regionList: (regionList || []).filter(filterByName),
        provinceList: (provinceList || []).filter(filterByName),
        cityList: (cityList || []).filter(filterByName),
        cityLevelList: (cityLevelList || []).filter(filterByName),
        boxLevelList: (boxLevelList || []).filter(filterByName),
        cinemaCount: cinemaCount || 0
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async fetchAndUpdate() {
    if (this.type == 0) {
      return
    }

    const ids = [ ...this.model[this.type] ]
    if (ids.length > 0) {
      const name = idsNameMap[this.type]
      const query = name ? { [name]: ids } : {}
      const data = await this.fetch(query)
      this.updateStats(data, this.type)
    } else {
      this.resetStats(this.type)
    }
  }

  updateStats(data: any, type: number) {
    const regionList: Region[] = data && data.regionList || []
    const provinceList: Province[] = data && data.provinceList || []
    const cityList: City[] = data && data.cityList || []
    const levelList: any[] = data && data.cityLevelList || []
    const boxLevelList: any[] = data && data.boxLevelList || []
    const result = {
      region: regionList.length,
      province: provinceList.length,
      city: cityList.length,
      cinema: data.cinemaCount || 0,
      regionList,
      provinceList,
      cityLevelList: levelList.map((it: any) => ({
        ...slice(it, 'code,name,count'),
        cityList: it.infos || [],
      })),
      boxLevelList,
      type,
      ids: this.model[type],
    }
    this.statsMap[type] = result as Stats
  }

  resetStats(type: number) {
    const value = cloneDeep(defaultStats)
    this.statsMap[type] = { ...value, type }
  }

  onCitySelectAll() {
    const oldIds = this.model[3] as number[]
    const newIds = this.citySearchList.map(it => it.id)
    const ids = uniq(oldIds.concat(newIds))
    this.model[3] = ids
  }

  async onCinemaSelectAll() {
    const oldIds = this.model[4] as number[]
    let list = this.cinemaList
    // 若当前列表个数大于 10，说明还有，调用接口，将所有影院提取过来
    if (this.cinemaTotal > 10) {
      const { items } = await this.fetchCinemaAll()
      list = items as Cinema[]
    }
    const newIds = list.map(it => it.id)
    const ids = uniq(oldIds.concat(newIds))
    this.model[4] = ids
  }

  @Watch('value', { immediate: true })
  watchValue(value: number[]) {
    const castList = typeCastMap[this.type](value)
    this.model[this.type] = castList
  }

  @Watch('model', { deep: true })
  @Watch('type')
  watchModel() {
    const list = this.model[this.type]
    this.$emit('input', list)
    this.fetchAndUpdate()
  }

  @Watch('cityLevel')
  @Watch('cityKeyword')
  watchCityLevelKeyword() {
    this.cityPage = 1
  }

  @Watch('type', { immediate: true })
  watchType(value: number) {
    if (value == 4) {
      if (!this.boxLevel) {
        this.boxLevel = ((this.boxLevelList || [])[0] || {}).key as string || ''
      }

      this.cinemaPage = 1
      this.fetchCinema()
    }
  }

  @Watch('boxLevel')
  watchBoxLevel() {
    this.cinemaPage = 1
    this.cinemaKeyword = ''
    this.fetchCinema()
  }

  @Watch('cinemaPage')
  @Watch('cinemaKeyword')
  watchCinemaPage() {
    this.fetchCinema()
  }

  @Watch('statsMap', { deep: true, immediate: true })
  watchStatsMap(value: StatsMap) {
    const stats = value[this.type]
    const result = cloneDeep(stats)
    this.$emit('statsChange', result)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.pane-content {
  position: relative;
  width: 860px;
  height: 440px;
  background: @c-head-bg no-repeat;
  padding-top: 1px;
}

.map-box {
  background-image: url(../../assets/map.png);
  background-position: 20px 13px;
  background-size: 500px 413px;
}

.stats-pane {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  height: 400px;
}

.name-sub {
  sub {
    position: relative;
    top: 0;
    left: 8px;
    color: @c-sub-text;
  }
  sub ~ sub {
    margin-left: 8px;
  }
}

.checkbox-pane {
  width: 500px;
  height: 400px;
  margin: 20px 0 0 20px;
  background-color: #fff;
}

.filter-form {
  padding: 20px 20px 0;
}

.select-level {
  width: 110px;
  /deep/ .ivu-select-selection {
    border-radius: 2px 0 0 2px;
  }
}
.input-search {
  width: 180px;
  /deep/ .ivu-input {
    border-radius: 0;
    border-width: 1px 0;
  }
}
.button-search {
  width: 60px;
  height: 32px;
  border-radius: 0 2px 2px 0;
  background-image: url(./assets/search.png);
  background-repeat: no-repeat;
  background-position: center;
}

.button-all {
  width: 130px;
  height: 32px;
  font-size: 12px;
  padding: 0;
  margin-left: 20px;
}

.pane-page {
  margin: 16px 0 0 20px;
  /deep/ .ivu-page-total {
    position: relative;
    top: 1px;
    font-size: 12px;
    color: @c-sub-text;
  }
}

.city-box,
.cinema-box {
  .checkbox-pane {
    height: 306px;
    overflow: hidden;
  }
}

.cinema-loading {
  margin: 16px 0 0 20px;
}
.box-level-flag {
  padding: 1px 8px;
  color: #fff;
  border-radius: 2px;
  font-size: 12px;
  margin: 0 5px 0 3px;
  position: relative;
  top: -1px;
  background-color: @c-button;
}
.box-level-flag-b {
  background-color: #19be6b;
}
.box-level-flag-c {
  background-color: #2d8cf0;
}
</style>
