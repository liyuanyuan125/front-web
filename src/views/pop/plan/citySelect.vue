<template>
  <div class="city-select flex-box">
    <div class="side-pane" v-if="!readonly">
      <h3 class="side-title">已选<em>{{selectedList.length}}</em>个城市</h3>
      <ul class="selected-list">
        <li v-for="(it, i) in selectedList" :key="it.id" class="selected-item">
          <label>{{it.name}}</label>
          <Icon type="md-close" @click="onDel(i)" class="act-del"/>
        </li>
      </ul>
    </div>

    <div class="main-pane flex-1">
      <div class="filter-box flex-box" v-if="!readonly">
        <Select v-model="level" class="select-level">
          <Option v-for="it in levelList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
        <Select v-model="searchCityId" placeholder="输入城市名称" filterable
          on-change="onSelect" ref="search" class="select-city">
          <Option v-for="it in remainList" :key="it.id"
            :value="it.id">{{it.name}}</Option>
        </Select>
      </div>
      <div class="map-box">
        <div class="the-map">
          <Dot v-for="it in selectedList" :key="it.id" :class="'dot dot-' + it.pinyin"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cityList as allList, City } from './types'
import { toast } from '@/ui/modal'
import { toMap } from '@/fn/array'
import Dot from '@/components/Dot.vue'

@Component({
  components: {
    Dot
  }
})
export default class CitySelect extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: number[]

  @Prop({ type: Boolean, default: false }) readonly!: boolean

  allList = allList

  selectedList = [] as City[]

  get remainList() {
    const selMap = toMap(this.selectedList, 'id')
    const list = this.allList.filter(it => !(it.id in selMap))
    return list
  }

  level = 1

  levelList = [
    { key: 1, text: '一级城市' }
  ]

  searchCityId = 0

  filterList = [] as City[]

  created() {
    const map = toMap(this.value)
    this.selectedList = this.allList.filter(it => it.id in map)
  }

  onDel(i: number) {
    this.selectedList.splice(i, 1)
  }

  @Watch('searchCityId')
  watchSearchCityId(value: any) {
    if (value > 0) {
      const city = this.allList.find(it => it.id == value)
      if (city != null) {
        const found = this.selectedList.find(it => it.id == value)
        found == null
          ? this.selectedList.push(city)
          : toast('已存在，请不要重复添加')
      }
    }
    (this.$refs.search as any).clearSingleSelect()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.side-pane {
  width: 180px;
  min-width: 180px;
  background-color: #f9f9f9;
}
.side-title {
  height: 50px;
  line-height: 50px;
  text-indent: 15px;
  font-size: 14px;
  font-weight: normal;
  background-color: lighten(@c-button, 30%);
  em {
    margin: 0 4px;
    font-size: 18px;
    font-weight: 600;
  }
}

.selected-list {
  margin-top: 7px;
}
.selected-item {
  padding: 7px 0 7px 15px;
}
.act-del {
  position: relative;
  margin-left: 8px;
  cursor: pointer;
  padding: 3px;
  top: -1px;
  &:hover {
    color: @c-button;
  }
}

.main-pane {
  margin-left: 20px;
}

.select-level,
.select-city {
  /deep/ .ivu-select-selected-value {
    height: 40px;
    line-height: 40px;
  }
  // TODO: 主页面影响此处的样式？
  /deep/ .ivu-select-selection {
    width: 172px !important;
    margin-left: 0 !important;
    height: 40px;
    line-height: 40px;
  }
}

.select-level {
  width: 172px;
}

.select-city {
  width: 100%;
  margin-left: 20px;
  /deep/ .ivu-select-selection {
    width: 100% !important;
  }
}
.map-box {
  margin-top: 35px;
}

.the-map {
  position: relative;
  width: 650px;
  height: 537px;
  background: #fff url(./assets/map.png) no-repeat;
}
.dot {
  position: absolute;
}
.dot-beijing {
  top: 173px;
  left: 458px;
}
.dot-shanghai {
  top: 301px;
  left: 536px;
}
.dot-guangzhou {
  top: 423px;
  left: 442px;
}
.dot-shenzhen {
  top: 437px;
  left: 457px;
}
.dot-chengdu {
  top: 327px;
  left: 317px;
}
.dot-nanjing {
  top: 290px;
  left: 500px;
}
.dot-hangzhou {
  top: 319px;
  left: 517px;
}
</style>
