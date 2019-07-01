<template>
    <!-- 客户列表 -->
    <Select v-model="inner"
        placeholder="客户名称"
        filterable
        remote
        clearable
        :remote-method="remoteMethod"
        :loading="loading"
        @on-clear="data = []"
        class="select-wid" >
        <Option v-for="(item, index) in data" :key="index" :value="item.id" >{{item.name}}</Option>        
    </Select>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { searchPartners } from '@/api/effectReport'
@Component
export default class SelectPartner extends ViewBase {
  // 双向绑定 v-model
  @Prop({ type: Number, default: '' }) value!: number

  loading: boolean = false

  data = []

  inner: number = this.value

  mounted() {}

  async remoteMethod(query: any) {
    try {
      if (query) {
        this.loading = true
        const {
          data: { items }
        } = await searchPartners({
          pageSize: 99,
          pageIndex: 1,
          searchKey: query.trim(),
        })
        if ( items && items.length > 0 ) {
          this.data = items
        }
      }
      this.loading = false
    } catch (ex) {
      this.loading = false
      this.handleError(ex)
    }
  }

  @Watch('value')
  watchValue(value: number) {
    this.inner = value
  }

  @Watch('inner')
  watchInner(value: number) {
    if ( value ) {
      this.$emit('input', value)
    } else {
      this.$emit('input', null)
    }
  }
}

</script>