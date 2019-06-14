<template>
  <div class="total-pane">
    <i :class="`arrow-up a${ index ? index : 0 }`"></i>
    <div class="wp">
      <div class="in">
        <div class="t">粉丝分布</div>
        <div class="l">
          <ul>
            <li>
              <span>Papi酱</span><em>3600.1万</em>
            </li>
            <li>
              <span>陈翔六点半</span><em>3600.1万</em>
            </li>
            <li>
              <span>办公室小野</span><em>3600.1万</em>
            </li>
            <li>
              <span>一禅小和尚</span><em>3600.1万</em>
            </li>
            <li>
              <span>李子柒</span><em>3600.1万</em>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component({
  components: {
  }
})
export default class Total extends ViewBase {
  @Prop({ type: Object, default: () => {} }) totalList!: any
  @Prop({ type: Number, default: null }) index!: number
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '../kolcompare.less';
</style>