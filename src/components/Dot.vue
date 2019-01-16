<template>
  <div class="dot-wrap">
    <div class="dot-node"></div>
    <div class="pulse-in"></div>
    <div class="pulse-out"></div>
    <div class="pulse-out-out"></div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Dot extends ViewBase {
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@keyframes wave-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }

  25% {
    transform: scale(0.3);
    opacity: 1;
  }

  50% {
    transform: scale(0.3);
    opacity: 0.8;
  }

  75% {
    transform: scale(0.5);
    opacity: 0.4;
  }

  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}

@keyframes wave-out {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }

  25% {
    transform: scale(0.3);
    opacity: 1;
  }

  50% {
    transform: scale(0.4);
    opacity: 0.5;
  }

  75% {
    transform: scale(0.7);
    opacity: 0.3;
  }

  100% {
    transform: scale(0.9);
    opacity: 0;
  }
}

@keyframes wave-out-out {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }

  25% {
    transform: scale(0.3);
    opacity: 1;
  }

  50% {
    transform: scale(0.5);
    opacity: 0.4;
  }

  75% {
    transform: scale(0.8);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.dot-wrap {
  position: relative;
  left: 0;
  top: 0;
  width: 60px;
  height: 60px;
}

.dot-node {
  position: absolute;
  top: (60 - 16) / 2px;
  left: (60 - 16) / 2px;
  width: 16px;
  height: 16px;
  border: 1px solid @c-button;
  border-radius: 50%;
  background-color: @c-button;
  z-index: 2;
}

.pulse-in,
.pulse-out,
.pulse-out-out, {
  position: absolute;
  top: (60 - 48) / 2px;
  left: (60 - 48) / 2px;
  width: 48px;
  height: 48px;
  border: 6px solid @c-button;
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  animation: wave-in 2s ease-out;
  animation-iteration-count: infinite;
}

.pulse-out {
  animation-name: wave-out;
}
.pulse-out-out {
  animation-name: wave-out-out;
}
</style>
