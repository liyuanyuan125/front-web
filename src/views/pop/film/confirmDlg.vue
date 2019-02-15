<template>
  <div>
    <Modal v-model="value.visible" title="确认新建广告片" width="800">
      <div></div>
      <div class="footer btnCenter">
        <Button type="primary" class="button-cancel" @click="value.visible = false">关闭</Button>
        <Button type="primary" class="button-ok" @click="value.visible = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {}
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-header {
  border-bottom: 0;
  padding: 10px 13px;
  background: #f9f9f9;
  font-weight: none;
}
/deep/ .ivu-modal-footer {
  display: none;
}
</style>
