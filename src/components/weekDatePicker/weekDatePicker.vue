<template>
  <div class="week-date-picker" ref="box">
    <DatePicker
      v-model="pickerModel"
      :open="pickerOpen"
      @on-clickoutside="pickerOpen = false">
      <a @click="pickerOpen = !pickerOpen" class="week-date-handle">
        <Icon type="ios-calendar-outline"/>
        <label>{{displayValue}}</label>
      </a>
    </DatePicker>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Vue from 'vue'
import WeekView from './weekView.vue'
import { toRange } from './util'

@Component
export default class WeekDatePicker extends ViewBase {
  /**
   * model，Date 数组
   */
  @Prop({ type: Array, default: [null, null] }) value!: Array<Date | null>

  /**
   * 星期开始，0 表示周日，1 ~ 6 表示周一 ~ 周六
   *
   * 默认周四：为电影行业优化
   */
  @Prop({ type: Number, default: 4 }) weekStart!: 0 | 1 | 2 | 3 | 4 | 5 | 6

  @Prop({ type: String, default: '请选择' }) placeholder!: string

  model: Array<Date | null> = [null, null]

  pickerModel = new Date

  weekView: WeekView | null = null

  pickerOpen = false

  get displayValue() {
    const [start, end] = this.value
    return toRange(start, end) || this.placeholder
  }

  mounted() {
    this.insertWeekView()
    this.watchDatePane()
  }

  // 硬插入 weekVue 实例
  // TODO: 黑魔法，注意升级 iview 后的影响
  insertWeekView() {
    const box = this.$refs.box as HTMLDivElement
    const cells = box.querySelector('.ivu-date-picker-cells') as HTMLDivElement
    const viewBox = document.createElement('div')
    cells.after ? cells.after(viewBox) : cells.parentElement!.appendChild(viewBox)

    this.weekView = new WeekView({
      propsData: {
        weekStart: this.weekStart
      }
    }).$mount(viewBox)
    this.updateWeekView()
    this.weekView.$on('change', ([start, end]: Array<Date | null>) => {
      this.model = [start, end]
      this.pickerOpen = false
    })
  }

  // 利用 vue 未文档化的 api，监听内部组件状态的改变
  // TODO: 黑魔法，注意升级 iview 后的影响
  watchDatePane() {
    const box = this.$refs.box as HTMLDivElement
    const panel = box.querySelector('.ivu-picker-panel-body-wrapper')
    const panelVue = (panel as any).__vue__ as Vue
    const watchHandler = () => {
      const view = (panelVue as any).pickerTable as string
      const date = (panelVue as any).panelDate as Date
      if (view == 'date-table') {
        this.weekView!.monthDate = date
      }
    }
    panelVue.$watch('pickerTable', watchHandler)
    panelVue.$watch('panelDate', watchHandler)
    // 手动调用一次，以便初始化
    watchHandler()
  }

  updateWeekView() {
    if (this.weekView) {
      const value = this.value
      this.weekView.selected = value && value[0]
    }
  }

  @Watch('value', { immediate: true })
  watchValue(value: Array<Date | null>) {
    this.model = value
    this.updateWeekView()
    this.pickerModel = value && value[0] || new Date
  }

  @Watch('model')
  watchModel(value: Array<Date | null>) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.week-date-picker {
  position: relative;
  display: inline-block;
  user-select: none;
  /deep/ .ivu-picker-panel-content {
    position: relative;
  }
  /deep/ .ivu-date-picker-cells {
    position: relative;
    visibility: hidden;
    z-index: 900;
    background-color: #fff;
  }
  /deep/ .ivu-date-picker-cells-month,
  /deep/ .ivu-date-picker-cells-year {
    visibility: visible;
    z-index: 980;
  }
}

.week-date-handle {
  display: inline-block;
  line-height: 28px;
  color: @c-button;

  &:hover {
    color: shade(@c-button, 10%);
  }

  i, label {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }
  label {
    margin-left: 4px;
  }

  .theme-resource & {
    color: @c-button-resource;

    &:hover {
      color: shade(@c-button-resource, 10%);
    }
  }
}
</style>
