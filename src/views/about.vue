<template>
  <div class="page">
    <WeekDatePicker v-model="weekDate"/>

    <div>
      <a @click="visible = true">打开</a>
    </div>

    <CitySelectDialog
      v-model="visible"
      :cityIds.sync="cityIds"
      :topCityIds="topCityIds"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import WeekDatePicker from '@/components/weekDatePicker'
import CitySelectDialog from '@/components/citySelectDialog'

@Component({
  components: {
    WeekDatePicker,
    CitySelectDialog
  }
})
export default class AboutPage extends ViewBase {
  // weekDate = [null, null]
  weekDate = [new Date(2019, 4, 9), new Date(2019, 4, 15)]

  cityIds = [349, 170, 353]

  topCityIds = [349, 430, 170, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428]

  visible = false

  async mounted() {
    // const xx = list.filter(it => it.subList != null)
    // console.log(xx)
    // const one = xx.filter(it => it.subList.length == 1)
    // console.log(one)
  }
}
</script>

<style lang="less" scoped>
.page {
  background-color: #fff;
  padding: 15px;
}
</style>
