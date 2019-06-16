<template>
  <ReportPane :title="title">
    <div class="echarts-box">
      echarts
    </div>
  </ReportPane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import numAdd from './number.vue'
import ReportPane from './report-pane.vue'

@Component({
  components: {
    numAdd,
    ReportPane
  }
})
export default class TrendCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: any

  title: string = '数据趋势'
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.echarts-box {
  background: rgba(0, 32, 45, 0.8);
  border-radius: 5px;
  padding: 25px 0;
}
</style>
