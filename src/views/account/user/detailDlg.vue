<template>
  <div>
    <Modal
      v-model="value.visibleDetail"
      class-name="vertical-center-modal"
      title="查看关联客户"
      width="800"
    >
      <div v-if="visible">当前没有关联的客户</div>
      <Table v-else stripe :columns="columns" :data="data"></Table>
      <div slot="footer" class="btnCenter footer-bottom">
        <button class="button-cancel" @click="value.visibleDetail = false">关闭</button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { mount } from '@vue/test-utils'

@Component
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any
  visible = true
  data = []
  columns = [{ title: 'id', key: 'id', align: 'center' }, { title: '客户名称', key: 'name', align: 'center' }]
  mounted() {
    if (this.value.customer == null) {
      this.visible = true
    } else {
      this.visible = false
      this.data = this.value.customer
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-header {
  border-bottom: 0;
  padding: 10px 13px;
  background: #f9f9f9;
  font-weight: none;
}
.footer-bottom {
  margin: 10px 0 30px;
}
</style>

