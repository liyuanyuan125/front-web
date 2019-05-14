<template>
  <div class="page">
    <WeekDatePicker v-model="weekDate"/>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import WeekDatePicker from '@/components/weekDatePicker'

@Component({
  components: {
    WeekDatePicker
  }
})
export default class Main extends ViewBase {
  // weekDate = [null, null]
  weekDate = [new Date(2019, 4, 9), new Date(2019, 4, 15)]

  async mounted() {

  }
}
</script>

<style lang="less" scoped>
</style>
