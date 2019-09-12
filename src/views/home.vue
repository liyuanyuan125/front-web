<template>
  <div class="page">
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser, siderMenuActiveMap } from '@/store'
import { brandList } from '@/api/brandList'
import { MapType } from '@/util/types'

const routeMap: MapType = {
  ads: 'home-overview',
  resource: 'order-dispatch',
  film: 'home-overview'
}

@Component
export default class Home extends ViewBase {
  async beforeCreate() {
    const user = getUser()
    if (user != null) {
      const { systemCode, secondaryCode } = user

      // 产品逻辑，如果是直客登录，并且只有一个品牌时，跳转到品牌首页，并且隐藏首页
      if (systemCode == 'ads' && secondaryCode == 'zhike') {
        try {
          const {
            data: {
              items
            }
          } = await brandList({ pageIndex: 1, pageSize: 10 })

          // 只取已关联的
          const list = (items as any[] || []).filter(it => it.status == 15)

          if (list.length == 1) {
            const id = list[0].brandId
            this.$router.replace({ name: 'brand-home', params: { id } })
            // 将品牌首页，作为首页点亮
            siderMenuActiveMap({ 'brand-home': 'home' })
            return
          }
        } catch (ex) {
          // do nothing
        }
      }

      siderMenuActiveMap({ 'brand-home': null })

      const name = routeMap[systemCode]
      name && this.$router.replace({ name })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
