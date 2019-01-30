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
    <section v-if="type == 3">3</section>
    <section v-if="type == 4">4</section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import StatsPane from './StatsPane.vue'
import { Stats } from './types'
import { areaTypeList } from '../../types'
import CheckboxPane from '@/components/checkboxPane'
import cachedStore from '@/fn/cachedStore'
import { queryStats } from '@/api/cinema'
import { hash } from '@/fn/object'
import { isNullOrEmpty } from '@/fn/string'

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

interface Region {
  code: string
  name: string
  count: number
}

interface Province {
  id: number
  name: string
  count: number
}

interface City {
  id: number
  name: string
  count: number
  cityGradeCode: string
  cityGradeName: string
}

// 后端接口设计为，不同的 type 传不同的 ids
const idsNameMap: any = {
  1: 'areaCodes',
  2: 'provinceIds',
  3: 'cityIds',
  4: 'ids',
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
  }
})
export default class AreaPane extends ViewBase {
  /** 投放地区类型 */
  @Prop({ type: Number, default: 0, required: true }) type!: number

  /** model 属性 */
  @Prop({ type: Array, default: () => [], required: true }) value!: number[]

  model = areaTypeList.reduce<ListMap>((map, { key }) => {
    map[key as number] = []
    return map
  }, {})

  statsMap = areaTypeList.reduce<StatsMap>((map, { key }) => {
    map[key as number] = {
      region: 0,
      province: 0,
      city: 0,
      cinema: 0,
    }
    return map
  }, {})

  regionList: Region[] = []
  provinceList: Province[] = []
  cityList: City[] = []

  async created() {
    const data = await this.fetch()
    this.regionList = data && data.regionList || []
    this.provinceList = data && data.provinceList || []
    this.cityList = data && data.cityList || []

    this.updateStats(data, 0)

    // TODO: 假数据
    for (let i = 0; i < 100; i++) {
      this.regionList.push({ code: `xxx${i}`, name: `华南(假数据)${i}`, count: 88 + i })
    }
  }

  async fetch(query: any = {}) {
    try {
      const { data } = await cachedQueryStats(query)
      const {
        categorizedByAreaCode = [],
        categorizedByProvinceId = [],
        categorizedByCityId = [],
        cinemaCount = 0,
      } = data && data.statisticsResult || {}
      return {
        regionList: categorizedByAreaCode.filter(filterByName),
        provinceList: categorizedByProvinceId.filter(filterByName),
        cityList: categorizedByCityId.filter(filterByName),
        cinemaCount
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async fetchAndUpdate() {
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
    this.statsMap[type] = {
      region: (data && data.regionList || []).length,
      province: (data && data.provinceList || []).length,
      city: (data && data.cityList || []).length,
      cinema: data.cinemaCount || 0,
    }
  }

  resetStats(type: number) {
    this.statsMap[type] = {
      region: 0,
      province: 0,
      city: 0,
      cinema: 0,
    }
  }

  @Watch('value')
  watchValue(value: number[]) {
    this.model[this.type] = value
  }

  @Watch('model', { deep: true })
  @Watch('type')
  watchModel() {
    const list = this.model[this.type]
    this.$emit('input', list)
    this.fetchAndUpdate()
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
}

.checkbox-pane {
  width: 500px;
  height: 400px;
  margin: 20px 0 0 20px;
  background-color: #fff;
}
</style>
