<template>
  <div class="page">
    <div class="form-line">
      <label class="form-label">定向类型</label>

    </div>

    <div class="form-line">
      <label class="form-label">投放地区</label>
      <RadioGroup v-model="area">
        <Radio v-for="it in areaList" :key="it.key" :label="it.key">{{it.text}}</Radio>
      </RadioGroup>
    </div>

    <div class="city-select-wrap">
      <CitySelect/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import CitySelect from './citySelect.vue'
import { cityList, City, sexList, ageStageList, filmHobbyList, areaTypeList } from './types'

@Component({
  components: {
    CitySelect
  }
})
export default class Main extends ViewBase {


  // 标准定向
  area = 3

  areaList = [
    { key: 0, text: '不限' },
    { key: 1, text: '按区域' },
    { key: 2, text: '按省份' },
    { key: 3, text: '按城市' },
    { key: 4, text: '按影院' },
  ]

  cityList = cityList

  citySelected = [] as City[]

  cityLevel = 1

  cityLevelList = [
    { key: 1, text: '一级城市' }
  ]

  cityName = ''



  age = 0

  ageStage = 1

  ageStageList = ageStageList

  filmHobby = 0

  filmHobbyList = filmHobbyList

  // 按单部影片
}
</script>

<style lang="less" scoped>
</style>
