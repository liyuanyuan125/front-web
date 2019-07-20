<template>
  <component
    :is="title ? 'tooltip' : 'span'"
    :content="title"
    class="figure-component"
  >
    <img :src="src" class="figure-img">
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
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;

  /deep/ .ivu-tooltip-rel {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}

.figure-img {
  width: 100%;
  min-height: 100%;
  line-height: 1;
  vertical-align: top;
}
</style>
