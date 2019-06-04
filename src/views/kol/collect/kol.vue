<template>
  <div class="app">
    <Stopshort v-model="step" />
    <div>
      <keep-alive>
        <component v-bind:is="currentTab" v-model="stepType"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Stopshort from './stopshort.vue'
import All from './koltype/all.vue'
import Type from './koltype/type.vue'

@Component({
  components: {
    Stopshort,
    All,
    Type
  }
})
export default class App extends ViewBase {
  stepType = 0
  currentTab: any = All

  @Watch('stepType')
  watchStopType(val: number) {
    if (val) {
      this.currentTab = Type
    } else {
      this.currentTab = All
    }
  }
}
</script>

<style lang="less" scoped>
.app {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style>
