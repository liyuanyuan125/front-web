<template>
    <Select v-model='inner' class="item-list-sel" style="width: 250px" 
        filterable clearable
        remote
        :loading="loading"
        :remote-method="remoteMethod"
        placeholder="请输入专资编码或影院名称" >
        <Option v-for="item in cinemaList" :key="item.id" :value="item.id" >{{item.codeCinemaName}}</Option>
    </Select>
</template>

<script lang='ts'>
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryOrderList, queryCinemaList } from '@/api/norderDis'

@Component
export default class Main extends ViewBase {
  // v-model 双向绑定
  @Prop({type: Number , default: null}) value?: any

  inner = this.value
  loading = false

  // 影院名称list
  cinemaList = []

  async remoteMethod(query?: any) {
    try {
      if (query) {
        this.loading = true
        const { data: {items, totalCount}} = await queryCinemaList({
          query
        })
        this.cinemaList = (items || []).map((it: any) => {
          return {
            ...it,
            codeCinemaName: `【${it.code}】${it.shortName}`
          }
        })
        this.loading = false
      }
    } catch (ex) {
      this.loading = false
      this.handleError(ex)
    }
  }

  public get getCinemalist() {
    return this.cinemaList
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
@import '~@/views/kol/less/common.less';
.item-list-sel {
  width: 288px;
  margin-right: 20px;
}
</style>





