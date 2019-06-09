<template>
    <!-- 公司客户列表 -->
    <Select v-model="inner"  clearable filterable placeholder="客户名称"  class="select-wid" >
        <Option v-for="item in customerList" :key="item.id" :value="item.id">{{item.name || item.nameShort}}</Option>
    </Select>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { popPartners } from '@/api/popFilm'
@Component
export default class Main extends ViewBase {
  // 双向绑定 v-model
  @Prop({ type: Number, default: 0 }) value!: number

  customerList = []
  inner: number = this.value

  mounted() {
    this.popPartners()
  }

  async popPartners() {
    try {
      const { data: {items} } = await popPartners({
        pageSize: 99999,
        pageIndex: 1
      })
      this.customerList = items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  queryCustName() {
    const ary: any = this.customerList.filter( (item: any) => item.id == this.inner) || []
    const custname = ary.length > 0 ? ary[0].name : ''
    return custname
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