<template>
  <section class="report-pane-wp">
    <h4 class="pane-head flex-box">
      <em>
        {{title}}
      </em>
      <slot name="more"></slot>
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

@Component({
  components: {}
})
export default class ReportPane extends Vue {
  @Prop({ type: String, default: '' }) title!: string
  @Prop({ type: String, default: '' }) moretext?: string
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.report-pane-wp {
  min-width: 287px;
  color: #fff;
  font-size: 14px;
  user-select: none;
  margin-bottom: 20px;
  .pane-head {
    padding: 24px 30px;
    justify-content: space-between;
    font-weight: 400;
    background: rgba(0, 32, 45, 1);
    border-radius: 5px 5px 0 0;
  }
  .more-link {
    color: #fff;
    opacity: 0.6;
    &:hover {
      color: #f3d872;
    }
  }
  .pane-body {
    position: relative;
    background: rgba(0, 32, 45, 0.6);
    border-radius: 0 0 5px 5px;
  }
}
</style>
