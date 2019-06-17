<template>
  <!-- 广告单列表 -->
  <Select v-model="id"
          placeholder="广告单"
          filterable
          remote
          clearable
          :remote-method="remoteHandle"
          :loading="loading">
    <Option v-for="(option, index) in dataList"
            :value="option.value"
            :key="index">{{option.label}}</Option>
  </Select>
</template>

<script lang='ts'>
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  @Prop({ type: Function, required: true }) fetch!: any

  id: string = ''

  loading = true

  dataList: any[] = []

  async remoteHandle(query: string) {
    if ( query !== '' ) {
      this.loading = true
      const mockObj = {
        videoName: query,
        pageIndex: 1,
        pageSize: 100
      }
      try {
        const {
          data: { items }
        } = await this.fetch({ ...mockObj })

        const list = items.filter((it: any) => {
          return it.status
          //  == 3 || it.status == 6 || it.status == 7
        })

        this.dataList = list.map((it: any) => {
          return {
            value: it.id,
            label: `${it.videoName} - (${it.beginDate}~${it.endDate})`
          }
        })

        this.loading = false
      } catch (ex) {
        this.handleError(ex)
      }
    } else {
      this.dataList = []
    }
  }

  @Watch('id')
  watchInner(value: number) {
    this.$emit('input', value)
  }
}
</script>