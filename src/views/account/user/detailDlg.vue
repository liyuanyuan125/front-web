<template>
  <div>
    <Modal
      v-model="value.visibleDetail"
      width="700"
      :transfer='true'
      :closable='false'
      :mask-closable='false'
    >
      <div class="title">
        <!-- <i @click="handleCancel"></i> -->
        <p>查看关联用户</p>
      </div>
      <div v-if="visible">当前没有关联的客户</div>
      <Table v-else stripe :columns="columns" :data="data"></Table>
      <div slot="footer" class="btn-center-footer footer-bottom">
        <Button type="primary" class="button-cancel" @click="value.visibleDetail = false">关闭</Button>
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
@import '~@/site/lib.less';
@import '~@/views/account/less/common.less';

/deep/ .ivu-modal-header {
  border-bottom: 0;
  background: #f9f9f9;
  font-weight: none;
}
/deep/ .ivu-table {
  height: 450px;
  overflow-y: auto;
}
.footer-bottom {
  margin: 10px 0 10px;
}
.title {
  border-radius: 5px 5px 0 0;
  text-align: center;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 500;
  padding: 20px;
  color: #00202d;
  i {
    position: absolute;
    right: -12px;
    top: -12px;
    display: block;
    width: 27px;
    height: 27px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(209, 216, 219, 1);
    &::before {
      display: block;
      content: "×";
      font-size: 26px;
      line-height: 24px;
      text-align: center;
    }
  }
}
.button-cancel {
  width: 200px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
</style>

