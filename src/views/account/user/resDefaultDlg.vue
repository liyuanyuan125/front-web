<template>
  <div>
    <Modal v-model="value.visible"
      :transfer='true'
      :closable='false'
      :mask-closable='false'
      width="700">
      <div class="title">
        <i @click="value.visible = false"></i>
        <div v-if="visible">当前没有关联的客户</div>
        <Table v-else stripe :columns="columns" :data="data">
          <template slot-scope="{row, index}" slot="areaName">
            <span>{{row.areaName}}/{{row.provinceName}}/{{row.cityName}}</span>
          </template>
        </Table>
      </div>
      <div slot="footer" class="btn-center-footer footer-bottom">
        <Button type="primary" class="button-ok ok" @click="value.visible = false">关闭</Button>
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
@import '~@/site/lib.less';

/deep/ .ivu-modal-header {
  border-bottom: 0;
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
/deep/ .ivu-modal-body {
  padding: 0;
}
.ok {
  width: 200px;
  height: 50px;
  background: rgba(0, 32, 45, 1);
  border-radius: 25px;
}
.title {
  border-radius: 5px 5px 0 0;
  text-align: center;
  margin-bottom: 10px;
  font-size: 30px;
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

/deep/ .theme-resource .ivu-btn-primary:hover {
  color: #fff;
  background-color: rgba(0, 32, 45, 1);
  border-color: rgba(0, 32, 45, 1);
}
.button-ok {
  width: 200px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
</style>

