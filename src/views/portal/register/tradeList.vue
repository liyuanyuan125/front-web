<template>
  <Cascader 
    v-model="inner" 
    :data="tradeListData"
    :load-data="loadData"
    :render-format="format"
    :placeholder="placeholder"
  />
</template>

<script lang='ts'>
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {tradeList} from '@/api/register'

@Component
export default class Main extends ViewBase {
  // v-modle 双向绑定
  @Prop({ type: Array, default: () => [] }) value!: any
  @Prop({ type: String, default: '请选择所属行业'}) placeholder!: string

  inner = this.value
  tradeListData = []

  async mounted() {
    const { data } = await tradeList({categoryId: 2720})
    this.tradeListData = (data.list || []).map((item: any) => {
      return {
        ...item,
        value: item.code,
        label: item.name,
        children: [],
        loading: false
      }
    })
  }

  async loadData(item: any, callback: any) {
    item.loading = true
    const { data } = await tradeList({categoryCode: item.code})
    item.children = (data.list || []).map((it: any) => {
      return {
        ...it,
        value: it.code,
        label: it.name
      }
    })
    item.loading = false
    callback()
  }

  format(labels: any[], selectedData: any[]) {
    const list = selectedData.filter(it => !it.isFake).map(it => it.label)
    const result = list.length > 0 ? list.join(' / ') : ''

    return result
  }

  @Watch('inner')
  watchInner(val: any) {
    const value = val
    this.$emit('input', value)
  }
}

</script>

<style lang='less' scoped>

</style>
