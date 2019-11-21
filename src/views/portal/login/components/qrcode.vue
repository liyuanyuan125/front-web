<template>
  <div>
    <img src="../assets/QR.png" class="qr-code" width="200" />
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
}

</script>

<style lang='less' scoped>
.qr-code {
  position: fixed;
  bottom: 40px;
  right: 50px;
}
</style>
