<template>
  <div class="city-select-pane" :class="[ !arrowloding ? 'film-max' : '']">
    <div class="city-fast-row" v-if="fastList.length > 0">
      <div class="city-fast-list">
        <Checkbox
          v-for="it in fastList"
          :key="it.key"
          v-model="it.checked"
          v-if='it.text!= "新一线城市"'
          :indeterminate="it.indeterminate"
          class="city-fast-item check-item"
          @on-change="fastChange(it, $event)"
        >
          <span v-if="it.key == 'top'" > {{it.text}}
            <Poptip @on-popper-show="init('top')" trigger="hover" title="票仓城市top20" content="content">
              <img v-if="!it.key == 'top' && it.check == true" width="20px" style="vertical-align:middle" src="./assets/question.png" />
              <img v-else width="20px" style="vertical-align:middle" src="./assets/questioncheck.png" />
              <div class="api" slot="content">
                <div v-if="cirys['top']" class="city-show">
                  <p class='city-space'>{{allcity['top'].city.join(',   ')}}</p>
                  <div style='text-align: left; margin-top: 10px;'>共{{allcity['top'].city.length}}个城市</div>
                </div>
                <div v-else class="city-show" style='height: 60px'>
                  <Icon type="ios-loading" />
                </div>
              </div>
            </Poptip>
          </span>
          <span v-else-if="it.key == 'all'">{{it.text}}</span>
          <span v-else > {{it.text}}
            <Poptip @on-popper-show='init(it.text)' trigger="hover" :title="it.text" content="content">
              <img v-if="!it.key == it.text && it.check == true" width="20px" style="vertical-align:middle" src="./assets/question.png" />
              <img v-else width="20px" style="vertical-align:middle" src="./assets/questioncheck.png" />
              <div  class="api" slot="content">
                <div v-if='cirys[it.text]'>
                  <div class="city-show">
                    <p class='city-space'>{{allcity[it.text].city.join(',   ')}}</p>
                  </div>
                  <div class='city-num'
                  style='text-align: left; margin-top: 10px;'>共{{allcity[it.text].city.length}}个城市</div>
                </div>
                <div v-else class="city-show" style='height: 60px'>
                  <Icon type="ios-loading" />
                </div>
              </div>
            </Poptip>
          </span>
        </Checkbox>
      </div>
    </div>

    <div v-show="arrowloding" class="city-filter-row" v-if="cellData">
      <Select v-model="city" filterable clearable class="city-filter">
        <Option
          v-for="item in cityList"
          :key="item.id"
          :value="item.id"
        >{{item.name}}</Option>
      </Select>
    </div>

    <table v-show="arrowloding"  class="city-table" v-if="cellData">
      <tr v-for="(row, i) in cellData" :key="i">
        <component
          v-for="cell in row"
          :key="cell.uqid"
          :is="cell.type == 'region' ? 'th' : 'td'"
          :rowspan="cell.rowspan"
          :colspan="cell.colspan"
        >
          <component
            :is="cell.type == 'province' ? 'dropdown' : 'span'"
            class="cell-inner"
            trigger="custom"
            transfer
            transfer-class-name="city-select-pane-transfer"
            :visible="cell.dropdownOpen"
            @on-clickoutside="dropdownClickOutside(cell, $event)"
            v-if="cell.type != 'empty'"
          >
            <span
              class="cell-label"
              :class="{
                'cell-label-hl': cell.type == 'city'
                  && cell.data.id == hightlightCityId
              }"
            >
              <Checkbox
                v-model="cell.checked"
                :indeterminate="cell.indeterminate"
                @on-change="cellCheckChange(cell)"
                class="city-check check-item">
                <span class="city-name">{{cell.label}}</span>
                <em
                  class="city-count"
                  :class="{
                    'city-count-show': cell.selectedCityIds.length > 0
                      && cell.type == 'province'
                  }"
                >({{cell.selectedCityIds.length}})</em>
                <div
                  class="cell-pull-handle"
                  @click.prevent="cell.dropdownOpen = !cell.dropdownOpen"
                  v-if="cell.type == 'province'"
                >
                  <Icon
                    type="ios-arrow-down"
                    class="cell-pull-icon"
                    v-if="cell.type == 'province'"
                  />
                </div>
              </Checkbox>
            </span>

            <DropdownMenu
              slot="list"
              :data-cell-uqid="cell.uqid"
              v-if="cell.type == 'province'"
            >
              <div class="city-dropdown-in">
                <h4 class="city-dropdown-name">
                  <span>{{cell.label}}</span>
                  <em v-if="cell.selectedCityIds.length > 0">({{cell.selectedCityIds.length}})</em>
                </h4>
                <CheckboxGroup
                  v-model="cell.selectedCityIds"
                  @on-change="dropdownCityChange(cell)"
                >
                  <table class="city-dropdown-table">
                    <tr v-for="(cityList, ii) in cell.cityChunk" :key="ii">
                      <td
                        v-for="city in cityList"
                        :key="city.id"
                        class="city-dropdown-item"
                        :class="{
                          'city-dropdown-item-hl': city.id == hightlightCityId
                        }"
                      >
                        <Checkbox :label="city.id">{{city.name}}</Checkbox>
                      </td>
                    </tr>
                  </table>
                </CheckboxGroup>
              </div>
            </DropdownMenu>
          </component>
        </component>
      </tr>
    </table>
    <div style='display: flex; margin-top: 6px'>
      <p v-show="model.length > 0" >
        已选： {{model.length}}
      </p>
      <div class="arrow-box">
        <div @click="arrowloding = true" v-if="!arrowloding" class="arrow">展开城市列表<Icon type="ios-arrow-forward" ></Icon></div>
        <div @click="arrowloding = false" v-if="arrowloding" class="arrow">收起城市列表<Icon type="ios-arrow-up" /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getGegionProvinceCity, getSubList, RegionSubList, AreaItem, AreaItemSubList, tip } from '@/api/area'
import { chunk, flatMap, flatten, intersection, difference, isEqual, uniq } from 'lodash'
import { random } from '@/fn/string'
import { devWarn } from '@/util/dev'
import { toMap } from '@/fn/array'
import { MapType, KeyText } from '@/util/types'
import { getRelation, SetRelation } from '@/fn/set'

interface RegionChunk extends RegionSubList {
  subChunk: AreaItemSubList[][]
}

interface FastItem extends KeyText {
  cityIds: number[]
  checked: boolean
  indeterminate: boolean
}

// const keepExclusion = <T>(
//   value: T[],
//   oldValue: T[],
//   aloneValue: any,
//   setter: (newValue: T[]) => any
// ) => {
//   const allKey = value.filter((it: any) => it.checked)
//   if (allKey.length > 1) {
//     const newValue = value.filter((it: any) => it.checked).map((item: any) => item.key)
//     const oldkey = (oldValue || []).filter((it: any) => it.checked).map((item: any) => item.key)
//     const newHas = newValue.includes(aloneValue)
//     const oldHas = oldkey.includes(aloneValue)
//     // console.log(oldkey, oldHas, newHas)
//     // newHas && setter((value || []).map((it: any) => {
//     //   return {
//     //     ...it,
//     //     checked: it.key == aloneValue  ? true : false
//     //   }
//     // }))
//     newHas && oldHas && setter((value || []).map((it: any) => {
//       return {
//         ...it,
//         checked: it.key == aloneValue  ? false : it.key
//       }
//     }))
//   }
// }
// 过滤掉脏数据
const filterDirty = (list: RegionSubList[]) => {
  const regionList = list
    // 没有任何省份的大区，被认为是脏数据
    .filter(region => (region.subList || []).length > 0)
    .map(region => {
      region.subList = region.subList
        // 没有任何城市的省份，也被认为是脏数据
        .filter(province => (province.subList || []).length > 0)
      return region
    })
  return regionList
}

const chunkData = (list: RegionSubList[], chunkSize = 4) => {
  const result = list.map(it => {
    const subChunk = chunk(it.subList, chunkSize)
    return { ...it, subChunk } as RegionChunk
  })
  return result
}

/** 单元格项 */
interface CellItem {
  /** 唯一 id */
  uqid: string

  /**
   * 类型，分别为：region 大区、province 省、city 城市（仅当平坦时）、empty 用作空填充
   */
  type: 'region' | 'province' | 'city' | 'empty'

  /** 单元格显示的文字 */
  label?: string

  /** 占据的行数 */
  rowspan?: number

  /** 占据的列数 */
  colspan: number

  /** 包含的城市 id 列表 */
  cityIds?: number[]

  /** 选中的城市 id 列表，type 为 province、city 才有 */
  selectedCityIds?: number[]

  /**
   * 原有的数据，对于大区来说，是 RegionChunk
   * 对于省份来说，是 AreaItemSubList
   * 对于平坦市来说，是 AreaItem
   */
  data?: RegionChunk | AreaItemSubList | AreaItem

  /** 选中状态 */
  checked?: boolean

  /** indeterminate 状态 */
  indeterminate?: boolean

  /** 将 cityList 分组 */
  cityChunk?: AreaItem[][]

  /** dropdown 是否展开 */
  dropdownOpen?: boolean

  /** 子级 cell，type 为 region 才有 */
  subCells?: CellItem[]

  /** 区域 cell，type 为 province、city 才有 */
  regionCell?: CellItem
}

const getCityIds = (cityList: AreaItem[] | null) => {
  const ids = flatMap(cityList, 'id') as number[]
  return ids
}

const provinceCityIds = (provinceList: AreaItemSubList[]) => {
  const cityList = flatMap(provinceList, 'subList') as AreaItem[]
  const ids = getCityIds(cityList)
  return ids
}

const cellData = (list: RegionSubList[], {
  chunkSize = 5,
  cityChunkSize = 3
} = {}) => {
  const chunkList = chunkData(list, chunkSize)
  const result = chunkList.reduce((rowList, item) => {
    const subCells: CellItem[] = []

    // 本身就是一项
    const regionCell: CellItem = {
      uqid: random('cell'),
      type: 'region',
      label: item.name,
      rowspan: item.subChunk.length,
      colspan: 1,
      cityIds: provinceCityIds(item.subList),
      selectedCityIds: [],
      data: item,
      checked: false,
      indeterminate: false,
      subCells
    }

    // 重复循环 subChunk
    const rows = item.subChunk.map(subList => {
      const row = subList.map(sub => {
        // 平坦市指的是：省份名称与城市名称，且省下有且只有本市的市，例如北京市、天津市
        const isFlat = (sub.subList || []).length == 1
          && sub.name == sub.subList[0].name
        const cityIds = getCityIds(sub.subList)

        const subCell: CellItem = {
          uqid: random('cell'),
          type: isFlat ? 'city' : 'province',
          label: sub.name,
          rowspan: 1,
          colspan: 1,
          cityIds,
          selectedCityIds: [],
          data: isFlat ? sub.subList[0] : sub,
          checked: false,
          indeterminate: false,
          cityChunk: !isFlat ? chunk(sub.subList, cityChunkSize) : [],
          dropdownOpen: false,
          regionCell
        }

        subCells.push(subCell)

        return subCell
      })

      // 填充一个空 cell
      if (row.length < chunkSize) {
        row.push({
          uqid: random('cell'),
          type: 'empty',
          colspan: chunkSize - row.length
        })
      }

      return row
    })

    // 将本身这项加到最前面
    rows[0].unshift(regionCell)

    rowList = rowList.concat(rows)

    return rowList
  }, [] as CellItem[][])

  return result
}

const gradeSorts = [
  'A1',
  'A2',
  'A3',
  'A4',
  'A5',
]

const getGradeList = (list: RegionSubList[]) => {
  const provinceList = flatMap(list, 'subList')
  const cityList = flatMap(provinceList, 'subList') as AreaItem[]

  const gradeMap = cityList.reduce((map, item) => {
    const { id, bizGrade: key, bizGradeName: text } = item
    if (key && text) {
      const fast = map[key] || (map[key] = {
        key,
        text,
        cityIds: [],
        checked: false,
        indeterminate: false,
      })
      fast.cityIds.push(id)
    }
    return map
  }, {} as MapType<FastItem>)

  const result = Object.values(gradeMap)
    .sort((a, b) => gradeSorts.indexOf(a.key as string)
      - gradeSorts.indexOf(b.key as string))
  return result
}

@Component
export default class CitySelectPane extends ViewBase {
  /** 城市 ids */
  @Prop({ type: Array, default: () => [] }) value!: number[]

  /** 票仓城市 Top20 城市 ids */
  @Prop({ type: Array, default: () => [] }) topCityIds!: number[]
  @Prop() time!: any
  @Prop() warehouseLisst!: any
  @Prop() specification!: any
  model: number[] = []

  allcityshow: any = false
  list: RegionSubList[] = []

  cellData: CellItem[][] | null = null
  allcity: any = {}
  city: AreaItem | null = null

  hightlightCityId: number | null = null

  fastList: FastItem[] = []

  arrowloding = false

  lastCheckedFastItem: FastItem | null = null

  lastUncheckedFastItem: FastItem | null = null

  get cityList() {
    const provinceList = flatMap(this.list, 'subList') as AreaItemSubList[]
    const cityList = flatMap(provinceList, 'subList') as AreaItem[]
    return cityList
  }

  get allCityIds() {
    return this.cityList.map(it => it.id)
  }

  get cirys() {
    return JSON.parse(JSON.stringify(this.allcity))
  }

  get cellList() {
    const list = flatten(this.cellData)
    return list
  }

  // 当数据结构比较复杂时，使用 get + watch，比单独的 watch 更方便
  get allSelectedCityIds() {
    const idsList = this.cellList
      .filter(it => it.selectedCityIds != null)
      .map(it => it.selectedCityIds!)
    const ids = flatten(idsList)
    return ids
  }

  async created() {
    try {
      const list = await getGegionProvinceCity()
      this.list = filterDirty(list)
      this.cellData = cellData(this.list)
      this.updateTable()
      const gradeList = getGradeList(this.list)
      const isBackFill = (this.value || []).length > 0
      this.fastList = [
        { key: 'all', text: '全国', cityIds: [], checked: !isBackFill, indeterminate: false },
        { key: 'top', text: '票仓城市Top20', cityIds: this.topCityIds, checked: false, indeterminate: false },
        ...gradeList
      ]
      this.arrowloding = isBackFill
      this.updateFast()
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  mounted() {
    ['top', ...gradeSorts].forEach((it: any) => {
      // this.init(it)
    })
  }
  async init(it: any) {
    if (this.allcity[it]) {
      return
    }

    try {
      const { data } = await tip({
        videoLength: this.specification,
        bizGrade: it,
        beginDate: this.time,
      })
      if (it == 'top') {
        this.$set(this.allcity, it, {
          city: (this.warehouseLisst || []).map((its: any) => its.cityName),
          cpm: data.cpm || '',
          key: it,
          videoLength: data.videoLength || '',
          title: `[ ${data.videoLength}] 刊例价：${data.cpm}元/千人次`
        })
      } else {
        this.$set(this.allcity, it, {
          city: data.cities || [],
          cpm: data.cpm || '',
          key: it,
          videoLength: data.videoLength || '',
          title: `[ ${data.videoLength}] 刊例价：${data.cpm}元/千人次`
        })
        // this.allcity[it] =
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  cellCheckChange(cell: CellItem) {
    const name = `${cell.type}Change`
    const action = (this as any)[name] as (cell: CellItem) => any
    action && action.call(this, cell)
  }

  regionChange(cell: CellItem) {
    const checked = cell.checked
    cell.subCells!.forEach(it => {
      it.selectedCityIds = checked ? it.cityIds!.slice() : []
      this.updateProvinceCell(it, false)
    })
    this.updateRegionCell(cell)
  }

  provinceChange(cell: CellItem) {
    cell.selectedCityIds = cell.checked ? cell.cityIds!.slice() : []
    this.updateProvinceCell(cell)
  }

  cityChange(cell: CellItem) {
    cell.selectedCityIds = cell.checked ? cell.cityIds!.slice() : []
    this.updateRegionCell(cell.regionCell!)
  }

  updateTable() {
    const cityIds = this.value
    this.cellList.map(cell => {
      if (cell.type == 'city') {
        const { id } = cell.data as AreaItem
        cell.checked = cityIds.includes(id)
      }
      if (cell.type == 'city' || cell.type == 'province') {
        cell.selectedCityIds = intersection(cityIds, cell.cityIds!)
      }
      return cell
    })
    .filter(cell => cell.type == 'province')
    .forEach(cell => {
      this.updateProvinceCell(cell)
    })
  }

  updateRegionCell(cell: CellItem) {
    const total = cell.cityIds!.length
    const selectedIds = intersection(cell.cityIds!, this.allSelectedCityIds)
    const selectedCount = selectedIds.length
    cell.checked = selectedCount == total
    cell.indeterminate = 0 < selectedCount && selectedCount < total
  }

  updateProvinceCell(cell: CellItem, updateRegion = true) {
    const total = cell.cityIds!.length
    const selectedCount = cell.selectedCityIds!.length
    cell.checked = selectedCount == total
    cell.indeterminate = 0 < selectedCount && selectedCount < total
    updateRegion && this.updateRegionCell(cell.regionCell!)
  }

  dropdownCityChange(cell: CellItem) {
    this.updateProvinceCell(cell)
  }

  dropdownClickOutside(cell: CellItem, ev: MouseEvent) {
    const target = ev.target as Element
    if (target != null) {
      const el = target.closest('[data-cell-uqid]') as HTMLElement
      if (el != null && el.dataset.cellUqid == cell.uqid) {
        return
      }
    }
    cell.dropdownOpen = false
  }

  updateFast() {
    // this.fastList.forEach((it, i) => {
    //   const selectedIds = this.allSelectedCityIds
    //   if (i == 0) {
    //     const allCount = this.allCityIds.length
    //     const selectedCount = selectedIds.length
    //     it.checked = selectedCount == allCount
    //     it.indeterminate = 0 < selectedCount && selectedCount < allCount
    //   } else {
    //     const rel = getRelation(it.cityIds, selectedIds)
    //     it.checked = rel == SetRelation.Equal || rel == SetRelation.AInB
    //     it.indeterminate = rel == SetRelation.Half
    //   }
    // })
  }

  fastChange(item: FastItem) {
    // 记录下最后选择的项、反选的项，以供 watchFastList 使用
    item.checked && (this.lastCheckedFastItem = item)
    item.checked || (this.lastUncheckedFastItem = item)
  }

  @Watch('value')
  watchValue(value: number[]) {
    this.model = value
    this.updateTable()
    this.updateFast()
  }

  @Watch('model')
  watchModel(value: number[]) {
    if (!isEqual(value, this.value)) {
      this.$emit('input', value)
    }
  }

  @Watch('city')
  watchCity(cityId: number | null) {
    this.hightlightCityId = cityId

    if (cityId == null) {
      return
    }

    const cell = this.cellList.find(it => {
      const ids = it.type == 'province' ? it.cityIds : []
      return (ids || []).includes(cityId)
    })

    cell && (cell.dropdownOpen = true)
  }

  @Watch('allSelectedCityIds')
  watchAllSelectedCityIds(ids: number[]) {
    this.model = ids
  }

  @Watch('fastList', { deep: true })
  watchFastList(list: FastItem[]) {
    const checkedItem = this.lastCheckedFastItem
    const uncheckedItem = this.lastUncheckedFastItem
    this.lastCheckedFastItem = null
    this.lastUncheckedFastItem = null

    // 若非全国被选择，取消全国的选择状态
    if (checkedItem != null
      && checkedItem.key != 'all'
      && checkedItem.checked) {
      this.fastList[0].checked = false
      this.fastList[0].indeterminate = this.model.length > 0
    }

    if (list[0].checked) {
    // 如果全国被选择，则排斥其他选项
      this.fastList.forEach((it, i) => i > 0 && (it.checked = false))
      this.model = []
    } else {
      // 从集合中，减去最后被取消选择的项
      const diffIds = uncheckedItem
        ? difference(this.model, uncheckedItem.cityIds)
        : this.model

      // 将所有被选中的（全国除外），添加到集合中
      const checkedList = list.slice(1).filter(it => it.checked)
      const checkedIds = flatMap(checkedList, 'cityIds') as number[]
      const unionIds = checkedIds.concat(diffIds)

      const uniqIds = uniq(unionIds)
      this.model = uniqIds
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.city-select-pane {
  user-select: none;
}

.city-filter {
  width: 188px;
}

.city-table {
  margin-top: 20px;
  border-collapse: collapse;
}

.cell-inner,
.cell-label {
  position: relative;
  display: inline-block;
  width: 100%;
}

.cell-label {
  display: flex;
}

.city-check {
  padding: 5px 8px;
  margin: 0;
  white-space: nowrap;
}

.city-count {
  display: inline-block;
  min-width: 2px;
  visibility: hidden;
}

.city-count-show {
  min-width: 2px;
  visibility: visible;
}

.cell-pull-handle {
  display: inline-block;
  min-width: 14px;
  cursor: pointer;
  margin-top: -20px;
  &:hover .cell-pull-icon {
    color: @c-button;
    .theme-resource & {
      color: @c-button-resource;
    }
  }
}

th[rowspan='2'] {
  position: relative;
  .cell-label {
    top: -30px;
    font-weight: 400;
  }
}
th {
  font-weight: 400;
}
.cell-pull-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.city-dropdown-in {
  padding: 1px 15px 11px;
}

.city-dropdown-name {
  border-bottom: 1px solid #e8e8e8;
  line-height: 30px;
  font-size: 14px;
}

.city-dropdown-table {
  margin-top: 8px;
  td {
    padding: 1px 0 1px 8px;
    border-radius: 4px;
  }
}

.city-dropdown-item {
  label {
    white-space: nowrap;
  }
}

.cell-label-hl,
.city-dropdown-item-hl {
  background-color: lighten(@c-button, 30%);
}

.city-fast-row,
.city-filter-row {
  display: flex;
  line-height: 32px;
  margin-top: 10px;
}

.city-row-label {
  min-width: 66px;
  text-align: right;
}

.city-fast-item {
  margin-right: 18px;
  &:last-child {
    margin-right: 0;
  }
}
.city-select-pane-transfer[data-transfer=true] {
  max-height: 666px;
  padding: 0;
  user-select: none;
}
.check-item {
  position: relative;
  min-width: 130px;
  top: 3px;
  flex: 1;
  height: 40px;
  line-height: 30px;
  border-radius: 4px;
  text-align: center;
  margin-right: 15px;
  font-size: 14px;
  color: #00202d;
  border: 1px solid #fff;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.3);
  user-select: none;
  .check-ra;
}
@media screen and (max-width: 1356px) {
  .check-item {
    min-width: 110px;
  }
}
.check-ra {
  /deep/ .ivu-checkbox {
    display: none;
  }
  /deep/ .ivu-radio {
    display: none;
  }
  /deep/&.ivu-checkbox-wrapper-checked {
    color: #fff;
    background-color: #00202d;
    border: 1px solid #00202d;
    &::after {
      content: '\2713';
      color: #fff;
      position: absolute;
      right: -8px;
      top: -8px;
      background: #00202d;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
    }
    .city-space {
      color: #00202d;
    }
    .city-num {
      color: #00202d;
    }
  }
}
.city-fast-list {
  .check-item {
    min-width: 110px;
    line-height: 40px;
  }
}
.film-max {
  max-height: 132px;
  height: 130px;
}
.arrow-box {
  margin-left: 40%;
  height: 17px;
}
/deep/ .ivu-select-input {
  line-height: 36px;
  height: 32px;
  &::placeholder {
    line-height: 36px;
  }
}
.city-show {
  display: flex;
  flex-wrap: wrap;
  width: 320px;
  span {
    width: 80px;
    color: #00202d;
    overflow: hidden;
  }
}
.city-space {
  max-height: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  white-space: pre-wrap;
  text-align: left;
}
</style>
