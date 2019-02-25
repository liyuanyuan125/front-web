<template>
  <div class="page">
    <h1>Aiads 广告投放</h1>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'

const routeMap = {
  ads: 'home-overview',
  resource: 'home-resoverview'
}

@Component
export default class Main extends ViewBase {
  created() {
    const user = getUser()
    if (user != null) {
      const systemCode = user.systemCode
      const name = routeMap[systemCode]
      name && this.$router.replace({ name })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
