<template>
  <div>
    <Modal v-model="value.visibleMess" title="变更前信息" width="460">
      <p>
        <label>公司信息</label>
        {{list.name}}
      </p>
      <p>
        <label>账号类型</label>
        {{list.type}}
      </p>
      <p>
        <label>资质类型</label>
        {{list.type2}}
      </p>
      <p>
        <label>资质编号</label>
        {{list.code}}
      </p>
      <p>
        <label>资质图片</label>
        <img :src="item" v-for=" item in list.img">
      </p>
      <div slot="footer" class="dialog-footer btnCenter">
        <Button type="primary" @click="closeDlg">关闭</Button>
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
  list = {}
  mounted() {
    this.list = Object.assign(this.value.changelist)
  }
  closeDlg() {
    this.value.visibleMess = false
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
  font-size: 14px;
  color: #444;
  p {
    padding-bottom: 25px;
    label {
      color: #989898;
      padding-right: 24px;
    }
  }
}
/deep/ .ivu-modal-footer {
  border-top: 0;
}
</style>

