<template>
  <div class="page">
    用户管理
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'

@Component
export default class Main extends UrlManager {
  async mounted() {
  }
}
</script>

<style lang="less" scoped>
</style>