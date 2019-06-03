<template>
  <div>
    <ColBrand :fetch="fetch"></ColBrand>
  </div>
</template>

<script lang='ts'>
import {Component, Vue} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ColBrand from '@/components/detailBrand/index.vue'

import { itemlist  } from '@/api/lastissue'
@Component({
  components: {
    ColBrand
  }
})
export default class Brand extends ViewBase {
  // '后台接口函数'
  fetch = itemlist
}

</script>
<style lang='less' scoped>
</style>