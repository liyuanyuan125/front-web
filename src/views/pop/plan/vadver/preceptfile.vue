<template>
  <div>
    <div>
      <p>线级分布</p>
      <div style="height: 200px" ref="container1"></div>
    </div>
    <div>
      <p>院线分布</p>
      <div style="height: 200px" ref="container2"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import echarts from 'echarts'
import { canvasFilm } from './filmeacharts'

@Component
export default class App extends ViewBase {
  @Prop() value!: any

  mounted() {
    this.init(this.$refs.container1 as HTMLDivElement)
    this.init(this.$refs.container2 as HTMLDivElement)
  }

  init(dom: HTMLDivElement) {
    const myChart = echarts.init(dom)
    const data: any = canvasFilm()
    myChart.setOption(data)
  }
}
</script>

<style lang="less" scoped>

</style>
