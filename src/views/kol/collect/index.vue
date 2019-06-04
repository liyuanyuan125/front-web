<template>
  <div class="connect-box" ref="page">
    <div>
      <Step v-model="step">
      </Step>
    </div>
    <div>
      <keep-alive>
        <component v-bind:is="currentTab" v-model="step"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Step from './step.vue'
import Kol from './kol.vue'
import Imagined from './imagined.vue'
import Video from './video.vue'

@Component({
  components: {
    Step,
    Kol,
    Imagined,
    Video
  }
})
export default class App extends ViewBase {
  step = 0
  currentTab: any = Imagined

  @Watch('step')
  watchStep(val: number) {
    (this.$refs.page as HTMLDivElement).scrollTop = 0
    switch (this.step) {
      case 0: this.currentTab = Imagined
        break
      case 1: this.currentTab = Video
        break
      case 2: this.currentTab = Kol
        break
    }
  }
}
</script>

<style lang="less" scoped>
.connect-box {
  margin: 20px 40px;
}
</style>

