<template>
  <div class="page">
    账号信息<br><br>
    <router-link :to="{ name: 'account-info-edit' }">编辑账号信息</router-link>
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
