<template>
  <section class="pane-item">
    <h4 class="pane-head flex-box" v-if="title">
      <em>
        {{title}}
        <Tooltip :content="tooltip" v-if="tooltip"/>
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
import Tooltip from './tooltip.vue'

@Component({
  components: {
    Tooltip
  }
})
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
</style>
