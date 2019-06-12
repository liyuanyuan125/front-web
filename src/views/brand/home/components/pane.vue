<template>
  <section class="pane-item">
    <h4 class="pane-head flex-box">
      <em>{{title}}</em>
      <router-link :to="more" class="more-link" v-if="more">更多 &gt;</router-link>
    </h4>

    <div class="pane-body">
      <slot></slot>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'

@Component
export default class Pane extends Vue {
  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: [ Object, String ], default: null }) more!: RawLocation
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.pane-item {
  color: #fff;
  font-size: 14px;
  user-select: none;
  border: 1px solid rgba(68, 216, 254, .5);
  background-color: rgba(0, 20, 33, .5);
}

.pane-head {
  padding: 24px 30px;
  justify-content: space-between;
  font-weight: 400;
}

.more-link {
  color: #fff;
  opacity: 0.6;
  font-size: 12px;
  &:hover {
    color: #f3d872;
  }
}

.pane-body {
  position: relative;
}
</style>
