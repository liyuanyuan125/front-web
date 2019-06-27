<template>
  <Tooltip class="tooltip" v-bind="attrs">
    <slot><i class="tooltip-help">?</i></slot>
  </Tooltip>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { merge } from 'lodash'

@Component
export default class MyTooltip extends Vue {
  get attrs() {
    const result = merge({ 'max-width': 200 }, this.$attrs)
    return result
  }
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

.tooltip-help {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  color: #255771;
  border-radius: 100%;
  background-color: rgba(255, 255, 255, .6);
}
</style>
