<template>
    <!-- 计划列表 -->
    <Select v-model="inner"  clearable filterable placeholder="广告计划名称"  class="select-wid" >
        <Option v-for="item in data" :key="item.id" :value="item.id">{{item.name || item.nameShort}}</Option>
    </Select>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { popPlans } from '@/api/effectReport'
@Component
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0 }) value!: number

  data = []
  inner: number = this.value

  mounted() {
    this.popPlansHandle()
  }

  async popPlansHandle() {
    try {
      const { data: {items} } = await popPlans({
        pageSize: 99999,
        pageIndex: 1
      })
      this.customerList = items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('value')
  watchValue(value: number) {
    this.inner = value
  }

  @Watch('inner')
  watchInner(value: number) {
    this.$emit('input', value)
  }
}

</script>
<style lang='less' scoped>
</style>