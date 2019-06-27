<template>
  <div>
    <DatePicker
      ref="dates"
      :value="value"
      type="daterange"
      :options="opentios"
      placeholder="请选择日期"
      @on-change="handleChange"
      @on-clear="handleClear"
      @on-ok="handleOk"
    >
    </DatePicker>
    <!-- {{leftDatePanelLabel}} -->
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getcalendars } from '@/api/popPlan'

@Component
export default class Dates extends ViewBase {

  get years() {
    const labels = (this.$refs.dates as any).$refs.pickerPanel.rightDatePanelLabel.labels[0]
    return parseInt(labels.label, 10)
  }

  @Prop({ type: [Array, String], default: ''}) value: any

  @Prop({ type: Object }) options?: any

  open: any = false

  opentios = {
    shortcuts: []
  }

  mounted() {
    this.init()
  }

  async init() {
    try {
      await getcalendars({
        years: this.years + '',
        pageIndex: 1,
        pageSize: 500
      })
    } catch (ex) {

    }
  }

  handleClick() {
    this.open = !this.open
  }

  handleChange(date: any, numbers: any) {
    this.$emit('onChange', date)
  }

  handleClear(data: any, nums: any) {
    this.$emit('onClear', '')
  }

  handleOk() {
    this.open = false
    this.$emit('onOk', this.value)
  }
}
</script>

<style lang="less" scoped>
.setp-wrap {
  height: 104px;
  padding: 33px 30px 33px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: solid 10px #f2f2f2;
  color: #2481d7;
}
</style>