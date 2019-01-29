<template>
  <div class="page">about</div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import event from '@/fn/event'

import { alert, confirm, info, success, warning, toast, loading } from '@/ui/modal'

@Component
export default class Main extends ViewBase {
  async mounted() {
    await alert('alert1')
    alert('alert2')
    await confirm('confirm1')
    await confirm('confirm2')
  }
}
</script>

<style lang="less" scoped>
</style>
