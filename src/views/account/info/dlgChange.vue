<template>
  <div>
    <Modal v-model="value.visibleMess" title="变更前信息" width="360">
      <p>555555555</p>

      <div slot="footer" class="dialog-footer">
        <Button type="error">取消</Button>
        <Button type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any

//   mounted() {
//     console.log(this.value)
//   }
}
</script>
<style lang="less" scoped>
</style>

