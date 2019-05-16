<template>
  <div class="city-select-pane">
    <div class="city-filter-row" v-if="cellData">
      <Select v-model="city" filterable clearable class="city-filter">
        <Option
          v-for="item in cityList"
          :key="item.id"
          :value="item.id"
        >{{item.name}}</Option>
      </Select>
    </div>

    <table class="city-table" v-if="cellData">
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
            <span class="cell-label">
              <Checkbox
                v-model="cell.checked"
                :indeterminate="cell.indeterminate"
                @on-change="cell.type == 'province' ? provinceChange(cell) : cityChange(cell)"
                class="city-check">
                <span class="city-name">{{cell.label}}</span>
                <em class="city-count" v-if="cell.count > 0">({{cell.count}})</em>
              </Checkbox>

              <div
                class="cell-pull-handle"
                @click="cell.dropdownOpen = !cell.dropdownOpen"
                v-if="cell.type == 'province'"
              >
                <Icon
                  type="ios-arrow-down"
                  class="cell-pull-icon"
                  v-if="cell.type == 'province'"
                />
              </div>
            </span>

            <DropdownMenu
              slot="list"
              :data-cell-uqid="cell.uqid"
              v-if="cell.type == 'province'"
            >
              <div class="city-dropdown-in">
                <h4 class="city-dropdown-name">{{cell.label}}</h4>
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getGegionProvinceCity, getSubList, RegionSubList, AreaItem, AreaItemSubList } from '@/api/area'
import { chunk, flatMap } from 'lodash'
import { random } from '@/fn/string'

interface RegionChunk extends RegionSubList {
  subChunk: AreaItemSubList[][]
}

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

  /** 是否显示 label 后面的数字，大区、平坦市不显示 */
  showCount?: boolean

  /** 标记 label 后面的数字 */
  count?: number

  /** 占据的行数 */
  rowspan?: number

  /** 占据的列数 */
  colspan: number

  /** 包含的城市 id 列表 */
  cityIds?: number[]

  /** 选中的城市 id 列表 */
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

// 检查 list 中，有没有名字过长的项
const tooLong = (list: AreaItem[], maxCount = 6) =>
  list.some(it => it.name.length > maxCount)

const cellData = (list: RegionSubList[], chunkSize = 4, cityChunkSize = 3) => {
  const chunkList = chunkData(list, chunkSize)
  const result = chunkList.reduce((rowList, item) => {
    // 重复循环 subChunk
    const rows = item.subChunk.map(subList => {
      const row = subList.map(sub => {
        // 平坦市指的是：省份名称与城市名称，且省下有且只有本市的市，例如北京市、天津市
        const isFlat = (sub.subList || []).length == 1
          && sub.name == sub.subList[0].name
        const cityIds = getCityIds(sub.subList)

        // 如果城市名字过长，则减少一个 cityChunkSize
        const perfectChunkSize = cityChunkSize - (!isFlat && tooLong(sub.subList) ? 1 : 0)

        const subCell: CellItem = {
          uqid: random('cell'),
          type: isFlat ? 'city' : 'province',
          label: sub.name,
          showCount: !isFlat,
          count: 0,
          rowspan: 1,
          colspan: 1,
          cityIds,
          selectedCityIds: [],
          data: isFlat ? sub.subList[0] : sub,
          checked: false,
          indeterminate: false,
          cityChunk: !isFlat ? chunk(sub.subList, perfectChunkSize) : [],
          dropdownOpen: false
        }
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

    // 本身就是一项
    const cellItem: CellItem = {
      uqid: random('cell'),
      type: 'region',
      label: item.name,
      showCount: false,
      rowspan: item.subChunk.length,
      colspan: 1,
      cityIds: provinceCityIds(item.subList),
      selectedCityIds: [],
      data: item,
      checked: false,
      indeterminate: false
    }

    // 将本身这项加到最前面
    rows[0].unshift(cellItem)

    rowList = rowList.concat(rows)

    return rowList
  }, [] as CellItem[][])

  return result
}

@Component
export default class CitySelectPane extends ViewBase {
  /** 城市 ids */
  @Prop({ type: Array, default: () => [] }) value!: number[]

  model: number[] = []

  list: RegionSubList[] = []

  cellData: CellItem[][] | null = null

  city: AreaItem | null = null

  get cityList() {
    const provinceList = flatMap(this.list, 'subList') as AreaItemSubList[]
    const cityList = flatMap(provinceList, 'subList') as AreaItem[]
    return cityList
  }

  async created() {
    // try {
      const xx = getGegionProvinceCity
      const yy = getSubList
      debugger
      // const list = await getGegionProvinceCity()
      // this.list = filterDirty(list)
      // this.cellData = cellData(this.list)
    // } catch (ex) {
    //   const xx = ex
    //   debugger
    //   this.handleError(ex)
    // }
  }

  updateProvinceCell(cell: CellItem) {
    const total = cell.cityIds!.length
    const selectedCount = cell.selectedCityIds!.length
    cell.checked = selectedCount == total
    cell.indeterminate = selectedCount > 0 && !cell.checked
  }

  provinceChange(cell: CellItem) {
    cell.selectedCityIds = cell.checked ? cell.cityIds!.slice() : []
    this.updateProvinceCell(cell)
  }

  cityChange(cell: CellItem) {
    debugger
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

  @Watch('value')
  watchValue(value: number[]) {
    this.model = value
  }

  @Watch('model')
  watchModel(value: number[]) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.city-select-pane {
  user-select: none;
}

.city-filter-row {
  margin: 10px 0;
}

.city-filter {
  width: 188px;
}

.city-table {
  border-collapse: collapse;
  th, td {
    border: 1px solid #e8e8e8;
  }
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

.cell-pull-handle {
  position: relative;
  flex: 1;
  min-width: 28px;
  cursor: pointer;
  &:hover .cell-pull-icon {
    color: @c-button;

    .theme-resource & {
      color: @c-button-resource;
    }
  }
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
  padding: 2px 15px 11px;
}

.city-dropdown-name {
  border-bottom: 1px solid #e8e8e8;
  line-height: 28px;
  font-size: 14px;
}

.city-dropdown-table {
  margin-top: 8px;
}

.city-dropdown-item {
  label {
    white-space: nowrap;
  }
}
</style>

<style lang="less">
.city-select-pane-transfer[data-transfer=true] {
  max-height: 666px;
  padding: 0;
  user-select: none;
}
</style>
