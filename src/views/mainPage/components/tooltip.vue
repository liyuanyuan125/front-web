<template>
  <Tooltip class="tooltip" v-bind="$attrs">
    <slot></slot>
  </Tooltip>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class MyTooltip extends Vue {
}
</script>

<style lang="less" scoped>
.tooltip {
  /deep/ .ivu-tooltip-inner {
    border: 1px solid fade(#57b4c9, 80);
    background-color: fade(#002734, 80);
    // filter: drop-shadow(0 0 1px fade(#57b4c9, 80));
  }

  /deep/ .ivu-tooltip-arrow {
    &::before {
      content: '';
      position: absolute;
      border: solid transparent;
    }
  }

  /deep/ .ivu-tooltip-popper[x-placement='top'] .ivu-tooltip-arrow {
    border-top-color: fade(#57b4c9, 80);
    &::before {
      top: -6px;
      left: -4px;
      border-width: 4px 4px 0;
      border-top-color: fade(#002734, 80);
    }
  }

  /deep/ .ivu-tooltip-popper[x-placement='bottom'] .ivu-tooltip-arrow {
    border-bottom-color: fade(#57b4c9, 80);
    &::before {
      top: 2px;
      left: -4px;
      border-width: 0 4px 4px;
      border-bottom-color: fade(#002734, 80);
    }
  }

  /deep/ .ivu-tooltip-popper[x-placement='left'] .ivu-tooltip-arrow {
    border-left-color: fade(#57b4c9, 80);
    &::before {
      top: -4px;
      left: -6px;
      border-width: 4px 0 4px 4px;
      border-left-color: fade(#002734, 80);
    }
  }

  /deep/ .ivu-tooltip-popper[x-placement='right'] .ivu-tooltip-arrow {
    border-right-color: fade(#57b4c9, 80);
    &::before {
      top: -4px;
      left: 2px;
      border-width: 4px 4px 4px 0;
      border-right-color: fade(#002734, 80);
    }
  }
}
</style>



