<template>
  <div>
    <Modal
      v-model="value.visible"
      title="查看已关联影院列表"
      width="800px"
      class-name="vertical-center-modal"
    >
      <div class="tableTotal">
        <span>当前共有用户 xxx 人</span>
        <span>当前结果共xxxx项</span>
      </div>
      <Table
        ref="selection"
        stripe
        class="tables"
        :columns="columns"
        :data="data1"
      ></Table>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any
  columns = [{ title: 'id', key: 'code' }, { title: '客户名称', key: 'name' }]
  data1 = [
    { code: '33333333333', name: 'xxxxxxxxxxxxxxxxx' },
    { code: '33333333333', name: 'xxxxxxxxxxxxxxxxx' },
    { code: '33333333333', name: 'xxxxxxxxxxxxxxxxx' },
    { code: '33333333333', name: 'xxxxxxxxxxxxxxxxx' }
  ]
  mounted() {
    // this.list = Object.assign(this.value.changelist)
  }
  closeDlg() {
    this.value.visible = false
  }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-header {
  border-bottom: 0;
  padding: 10px 13px;
  background: #f9f9f9;
  /deep/ .ivu-modal-header-inner {
    font-weight: 0;
  }
}
.ivu-modal-body {
  .tableTotal {
    padding: 0 30px 20px;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
}
/deep/ .ivu-modal-footer {
  border-top: 0;
  display: none;
}
</style>

