<template>
  <Modal v-model='showDlg'
  title="拒绝接单确认"
  :transfer='false'
  :width='770'
  @on-cancel="cancel()">
    <div class="flex-box search-input">
      <Input class="name-input" v-model="dataForm.searchKey"  placeholder="请输入影院专资编码／影院名称进行搜索" />
      <span @click="seach">
        <Icon type="ios-search" size="22"/>
      </span>
    </div>

    <div slot="footer" class="foot">
      <Button class="foot-cancel-button" type="info" @click="cancel">取消计划</Button>
      <Button class="foot-button" type="primary" @click="open">开启投放</Button>
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
  total = 0
  dataForm: any = {
    searchKey: '',
    pageIndex: 1,
    pageSize: 10,
  }

  data: any = []

  columns: any = [
    {
      type: 'selection',
      width: 60,
      align: 'right'
    },
    {
      title: '区/县/市',
      slot: 'name',
      width: 160,
      align: 'center'
    },
    {
      title: '转资编码',
      slot: 'name',
      width: 120,
      align: 'center'
    },
    {
      title: '影院名称',
      slot: 'name',
      align: 'center'
    }
  ]

  created() {
    this.init(31)
  }

  async init(id: any) {
    try {
      await queryList()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  seach() {

  }

   // 每页数
  sizeChangeHandle(val: any) {
    this.dataForm.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.dataForm.pageSize = val
    this.seach()
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
