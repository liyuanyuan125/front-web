<template>
  <div>
    <Modal v-model="value.visible" title="查看关联影院" width="800">
      <div v-if="visible">当前没有关联的客户</div>
      <Table v-else stripe :columns="columns" :data="data">
        <template slot-scope="{row, index}" slot="areaName">
          <span>{{row.areaName}}/{{row.provinceName}}/{{row.cityName}}</span>
        </template>
      </Table>
      <div slot="footer" class="btnCenter footer-bottom">
        <Button type="primary" class="button-cancel" @click="value.visible = false">关闭</Button>
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
  visible = true
  data = []
  columns = [
    { title: '省市区', slot: 'areaName' },
    { title: '专资编码', key: 'code', align: 'center' },
    { title: '影院名称', key: 'name', align: 'center' }
  ]
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
/deep/ .ivu-table {
  height: 550px;
  overflow-y: auto;
}
.footer-bottom {
  margin: 10px 0 10px;
}
</style>

