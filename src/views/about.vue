<template>
  <div class="page">
    <WeekDatePicker v-model="weekDate"/>
    <CitySelectPane/>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import WeekDatePicker from '@/components/weekDatePicker'
import CitySelectPane from '@/components/citySelectPane'

@Component({
  components: {
    WeekDatePicker,
    CitySelectPane
  }
})
export default class Main extends ViewBase {
  // weekDate = [null, null]
  weekDate = [new Date(2019, 4, 9), new Date(2019, 4, 15)]

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
