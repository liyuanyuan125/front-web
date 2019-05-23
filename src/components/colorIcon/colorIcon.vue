<template>
  <span class="color-icon" :style="style">
    <i class="color-icon-in" :style="inStyle"></i>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ColorIcon extends Vue {
  @Prop({ type: String, default: '', required: true }) url!: number

  @Prop({ type: Number, default: 20 }) size!: number

  @Prop({ type: String, default: '#f0f' }) color!: number

  get style() {
    const size = this.size
    return {
      width: `${size}px`,
      height: `${size}px`
    }
  }

  get inStyle() {
    const size = this.size
    const color = this.color
    const url = this.url
    return {
      filter: `drop-shadow(${color} ${size}px 0)`,
      transform: `translateX(-${size}px)`,
      backgroundImage: `url(${url})`
    }
  }
}
</script>

<style lang="less" scoped>
.color-icon {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.color-icon-in {
  display: inline-block;
  width: 100%;
  height: 100%;
  background: no-repeat center;
  background-size: contain;
  border-right: solid transparent;
}
</style>
