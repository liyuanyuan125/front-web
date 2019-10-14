<template>
  <span
    class="middle-ellipsis"
    :class="{ 'middle-ellipsis-overflow': overflow }"
    ref="box"
  >
    <span
      class="middle-ellipsis-left"
      :style="{ width: `${leftWidth}` }"
    >
      <slot></slot>
    </span>
    <span
      class="middle-ellipsis-right"
      :style="{ width: `${rightWidth}` }"
    >
      <slot></slot>
    </span>
    <span class="middle-ellipsis-full" ref="full"><slot></slot></span>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { devLog } from '@/util/dev'

@Component
export default class MiddleEllipsis extends ViewBase {
  /**
   * 左侧宽度占全长的比率，默认 50%
   */
  @Prop({ type: Number, default: 50 }) ratio!: number

  overflow = false

  oldText = ''

  get leftWidth() {
    return this.overflow ? `${this.ratio}%` : 'auto'
  }

  get rightWidth() {
    return this.overflow ? `${100 - this.ratio}%` : '1px'
  }

  updateUI() {
    const box = this.$refs.box as HTMLSpanElement
    const full = this.$refs.full as HTMLSpanElement
    const text = full.innerText
    // 预防 updated 时造成无限循环
    if (text != this.oldText) {
      this.oldText = text
      const boxWidth = box.clientWidth
      const width = full.clientWidth
      const overflow = width > boxWidth
      this.overflow = overflow
    }
  }

  mounted() {
    this.updateUI()
  }

  updated() {
    this.updateUI()
  }
}
</script>

<style lang="less" scoped>
@import '../../site/lib.less';

.middle-ellipsis {
  position: relative;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  &:hover {
    .middle-ellipsis-left {
      width: auto !important;
      z-index: 88;
    }
    .middle-ellipsis-right {
      visibility: hidden;
    }
  }
}

.middle-ellipsis-left,
.middle-ellipsis-right,
.middle-ellipsis-full {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
}

.middle-ellipsis-left {
  text-overflow: ellipsis;
}

.middle-ellipsis-right {
  direction: rtl;
  visibility: hidden;
}

// full 元素用来丈量文本宽度，需要隐藏
.middle-ellipsis-full {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.middle-ellipsis-overflow {
  .middle-ellipsis-right {
    visibility: visible;
  }
}
</style>
