<template>
  <Cascader
    v-model="inner"
    :data="data"
    :load-data="loadData"
    :clearable="clearable"
    :placeholder="placeholder"
    class="area-select"
    :render-format="format"
    ref="ui"
  />
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getSubList, isValidArea, getRegionList, Region } from '@/api/area'
import { toast } from '@/ui/modal'
import { groupBy } from 'lodash'
import { AreaValue } from './types'

const isAllEmpty = (list: AreaValue | null) =>
  ((list || []) as any[]).every(it => it === '' || it === 0)

@Component
export default class AreaSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Array, default: () => [] }) value!: AreaValue

  /**
   * 最大级别，取值范围：1 ~ 3，分别对应：省、市、区县
   * 注意：由于历史原因，这里的级别不算大区
   */
  @Prop({ type: Number, default: 3 }) maxLevel!: number

  /**
   * 是否可清除值，默认可以
   */
  @Prop({ type: Boolean, default: true }) clearable!: boolean

  /**
   * 是否去掉本区域，默认不去掉（即显示本区域）
   */
  @Prop({ type: Boolean, default: false }) noSelf!: boolean

  /**
   * 是否显示大区，例如：华北地区，默认不显示
   */
  @Prop({ type: Boolean, default: false }) showRegion!: boolean

  /**
   * placeholder 默认值为请选择
   */
  @Prop({ type: String, default: '请选择'}) placeholder!: string

  inner: AreaValue = []

  data: any[] = []

  // 纯数组 ids，大区用字符串表示，当显示大区时，去掉大区部分，就是纯数字 ids
  get numberIds() {
    const ids = this.value
    const result = (this.showRegion ? ids.slice(1) : ids) as number[]
    return result
  }

  // 数据的总个数
  get maxCount() {
    const maxCount = this.showRegion ? this.maxLevel + 1 : this.maxLevel
    return maxCount
  }

  async getSubList(pid = 0) {
    let list: any[]
    try {
      list = await getSubList(pid)
    } catch (ex) {
      list = []
      this.handleError(ex)
    }
    return list
  }

  listToData(list: any, level: number) {
    const subLevel = level + 1

    const tlist = (list || []).map((it: any) => {
      const item: any = {
        value: it.id,
        label: it.nameCn,
        level: subLevel,
      }
      if (subLevel < this.maxLevel) {
        item.loading = false
        item.children = []
      }
      return item
    })

    const result = (level > 0 || this.showRegion) && !this.noSelf
      ? [{ value: 0, label: '本区域', isFake: true }].concat(tlist)
      : tlist

    return result
  }

  async getLevelList(pid = 0, level = 0) {
    const list = await this.getSubList(pid)
    return this.listToData(list, level)
  }

  async getRegionList() {
    let list: Region[]
    try {
      list = await getRegionList()
    } catch (ex) {
      list = []
      this.handleError(ex)
    }
    return list
  }

  async getRegionData() {
    const list = await this.getRegionList()

    const provinceList = await this.getSubList()
    const provinceMap = groupBy(provinceList, 'areaCode')

    const result = list.map(it => {
      const tlist = (provinceMap[it.code] || [])
      const children = this.listToData(tlist, 0)
      const item = {
        value: it.code,
        label: it.name,
        children,
      }
      return item
    })
    .filter(it => it.children.length > 0)

    return result
  }

  async mounted() {
    this.data = this.showRegion
      ? await this.getRegionData()
      : await this.getLevelList()
  }

  async checkValid(ids: AreaValue) {
    if (isAllEmpty(ids)) {
      return true
    }
    // TODO: 暂不验证 region 部分
    const numberIds = this.numberIds
    const isValid = await isValidArea(numberIds)
    return isValid
  }

  async loadData(item: any, callback: any) {
    item.loading = true
    const list = await this.getLevelList(item.value, item.level)
    item.children = list
    item.loading = false
    callback()
  }

  format(labels: any[], selectedData: any[]) {
    const list = selectedData.filter(it => !it.isFake).map(it => it.label)
    const result = list.length > 0 ? list.join(' / ') : ''

    const allEmpty = isAllEmpty(this.value)
    // fix 选择清除不干净的 bug
    if (allEmpty && result !== '') {
      const ui = this.$refs.ui as any
      typeof ui.clearSelect === 'function' && ui.clearSelect()
    }

    return allEmpty ? '' : result
  }

  fillList(list: AreaValue) {
    const tlist = new Array(this.maxCount).fill(0)
    const emptyList = tlist.map((it, i) => i in list ? list[i] : it)
    this.showRegion && (emptyList[0] = '')
    return emptyList as AreaValue
  }

  @Watch('value', {immediate: true})
  async watchValue(val: AreaValue) {
    // 检查传入的 value 值，是否合法，不合法直接清空
    const isValid = await this.checkValid(val)
    const value = isValid ? val : []
    this.inner = value
    // 触发 form item 验证
    isValid && (this.$refs.ui as any).dispatch('FormItem', 'on-form-change', value)
  }

  @Watch('inner')
  watchInner(val: AreaValue) {
    const value = val.length < this.maxCount ? this.fillList(val) : val
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.area-select {
  display: inline-block;
  width: 100%;
}
</style>
