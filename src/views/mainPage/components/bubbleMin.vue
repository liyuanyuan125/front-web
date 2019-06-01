<template>
  <div class="bubble-min-list">
    <div class="bubble-min"></div>
    <div class="bubble-min"></div>
    <div class="bubble-min"></div>
    <div class="bubble-min"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BubbleMin extends Vue {
}
</script>

<style lang="less" scoped>
.bubble-min-list {
  position: fixed;
  top: 0;
  width: 685px;
  height: 100vh;
  pointer-events: none;
}

@keyframes gulu {
  from {
    transform: translateY(calc(100vh - 348px + 10px));
  }

  to {
    transform: translateY(-806 - 82 - 10px);
  }
}

.bubble-min {
  position: absolute;
  background-color: fade(#fff, 30);
  border-radius: 100%;
  animation: gulu 10s linear infinite both;
}

.bubble-min:nth-child(1) {
  top: 635px;
  left: 33px;
  width: 96px;
  height: 96px;
  animation-duration: 12s;
}

.bubble-min:nth-child(2) {
  top: 806px;
  left: 369px;
  width: 82px;
  height: 82px;
}

.bubble-min:nth-child(3) {
  top: 348px;
  left: 531px;
  width: 62px;
  height: 62px;
  animation-duration: 8s;
}

.bubble-min:nth-child(4) {
  top: 750px;
  left: 555px;
  width: 58px;
  height: 58px;
}
</style>
