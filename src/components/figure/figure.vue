<template>
  <component
    :is="title ? 'tooltip' : 'span'"
    :content="title"
    class="figure-component"
  >
    <figure
      class="figure-img"
      :style="{ backgroundImage: `url(${src})` }"
    ></figure>
  </component>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Tooltip from '@/components/tooltip'

@Component({
  components: {
    tooltip: Tooltip
  }
})
export default class Figure extends Vue {
  @Prop({ type: String, default: '' }) src!: string

  @Prop({ type: String, default: '' }) title!: string
}
</script>

<style lang="less" scoped>
.figure-component {
  width: 100%;
  height: 100%;
  background-color: #fff;
  /deep/ .ivu-tooltip-rel {
    width: 100%;
    height: 100%;
  }
}

.figure-img {
  width: 100%;
  height: 100%;
  background: no-repeat center top;
  background-size: cover;
}
</style>
