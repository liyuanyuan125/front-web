<template>
  <div class="page">
    <IndexPart/>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import IndexPart from './indexPart.vue'

@Component({
  components: {
    IndexPart
  }
})
export default class Main extends ViewBase {
}
</script>

<style lang="less" scoped>
</style>
