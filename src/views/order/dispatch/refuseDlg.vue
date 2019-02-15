<template>
  <Modal v-model='showDlg'
  title="是否拒绝该执行单"
  :transfer='false'
  :width='770'
  @on-cancel="cancel()">
    <h3>是否拒绝该执行单</h3>

    <div slot="footer" class="foot">
      <Button class="foot-cancel-button" type="info" @click="cancel">取消</Button>
      <Button class="foot-button" type="primary" @click="open">拒绝执行</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList, leafletList, sureLeaflet } from '@/api/leafletDlg'

@Component
export default class DlgEditCinema extends ViewBase {
  showDlg = true

  async init(id: any) {
    try {
      await queryList()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  seach() {

  }

  cancel() {
    this.showDlg = false
  }

  open() {

  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.search-input {
  margin-left: 30px;
  .name-input {
    width: 300px;
    /deep/ .ivu-input {
      height: 40px;
      line-height: 40px;
    }
  }
  span {
    display: block;
    height: 40px;
    width: 80px;
    color: #fff;
    text-align: center;
    padding-top: 8px;
    background: rgba(59, 152, 255, 1);
  }
}
@cancel-color: rgba(59, 152, 255, 1);
.foot-button-box {
  width: 196px;
  height: 50px;
  margin-right: 20px;
}
.foot {
  text-align: center;
  height: 90px;
  .foot-button {
    .foot-button-box;
  }
  .foot-cancel-button {
    .foot-button-box;
    background: rgba(236, 245, 255, 1);
    border-radius: 2px;
    color: @cancel-color;
    border: 1px solid @cancel-color;
  }
}
</style>
