<template>
  <section class="pane-item">
    <h4 class="pane-head flex-box">
      <em>
        {{title}}
        <Tooltip class="tip" :content="tooltip" max-width="200" v-if="tooltip">?</Tooltip>
      </em>

      <router-link :to="more" class="more-link" v-if="more">更多 &gt;</router-link>
    </h4>
    <div class="pane-body">
      <slot></slot>
    </div>
    <slot name="footer"></slot>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'

@Component
export default class Pane extends Vue {
  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: [ Object, String ], default: null }) more!: RawLocation

  @Prop({ type: String, default: '' }) tooltip!: string
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.pane-item {
  min-width: 287px;
  min-height: 254px;
  color: #fff;
  background-color: rgba(0, 31, 44, .85);
  font-size: 14px;
  user-select: none;
}

.more-link {
  color: #fff;
  opacity: 0.6;
  &:hover {
    color: #f3d872;
  }
}

.pane-head {
  padding: 24px 30px;
  justify-content: space-between;
  font-weight: 400;
}

.pane-body {
  position: relative;
}

.tip {
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  color: #255771;
  border-radius: 100%;
  background-color: rgba(255, 255, 255, .6);

  /deep/ .ivu-tooltip-rel {
    padding: 0 3px 0 2px;
  }

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
