<template>
  <span
    class="star-list"
    :class="{ 'star-list-readonly': readonly }"
    @mouseover="mouseOver"
    @mouseleave="mouseLeave"
  >
    <a
      v-for="i in max"
      :key="i"
      :data-index="i"
      class="star-item"
      :class="{ 'star-item-on': i < runtimeValue + 1 }"
      @click="onClick(i)"
    ></a>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class Star extends Vue {
  @Prop({ type: Number, default: 0 }) value!: number

  @Prop({ type: Number, default: 5 }) max!: number

  @Prop({ type: Boolean, default: false }) readonly!: boolean

  model = this.value

  overValue = -1

  get runtimeValue() {
    return this.overValue > -1 ? this.overValue : this.value
  }

  mouseOver(ev: MouseEvent) {
    if (this.readonly) {
      return
    }

    const target = ev.target as HTMLElement
    if (target.tagName == 'A') {
      this.overValue = parseInt(target.dataset.index!, 10) || 0
    }
  }

  mouseLeave() {
    if (this.readonly) {
      return
    }
    this.overValue = -1
  }

  onClick(i: number) {
    if (this.readonly) {
      return
    }
    this.model = i
  }

  @Watch('value')
  watchValue(value: number) {
    this.model = Math.min(this.max, Math.max(0, value))
  }

  @Watch('model')
  watchModel(value: number) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.star-list {
  display: inline-flex;
  cursor: pointer;
}

.star-list-readonly {
  cursor: default;
}

.star-item {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(./assets/star.png) no-repeat center;
  margin-left: 2px;
  cursor: inherit;
  &:first-child {
    margin-left: 0;
  }
}

.star-item-on {
  background-image: url(./assets/star-on.png);
}
</style>
