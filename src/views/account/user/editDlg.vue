<template>
  <div>
    <Modal v-model="value.editVis" title="编辑关联影院" width="800px" class-name="vertical-center-modal">
      <div class="flex-box">
        <Input placeholder="请输入影院专资编码／影院名称进行搜索"/>
        <span>
          <Icon type="ios-search" size="22"/>
        </span>
      </div>
      <div class="tableTotal">
        <span>当前共有用户 xxx 人</span>
        <span>当前结果共xxxx项</span>
      </div>
      <Table ref="selection" stripe class="tables" :columns="columns" :data="data1"></Table>
      <Page :total="100" class="btnCenter" show-total show-elevator/>
      <div slot="footer" class="dialog-footer btnCenter">
        <Button  @click="closeDlg" class="button-cancel">取消</Button>
        <Button  @click="closeDlg" class="button-ok">保存</Button>
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
  columns = [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    { title: 'id', key: 'code' },
    { title: '客户名称', key: 'name' }
  ]
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
    this.value.editVis = false
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

/deep/ .ivu-modal-header {
  border-bottom: 0;
  padding: 10px 13px;
  background: #f9f9f9;
  /deep/ .ivu-modal-header-inner {
    font-weight: 0;
  }
}
.ivu-input-wrapper {
  width: auto;
  /deep/ .ivu-input {
    height: 40px;
    width: 400px;
    margin-bottom: 30px;
    margin-left: 25px;
  }
}
.flex-box {
  span {
    display: block;
    height: 40px;
    width: 80px;
    color: #fff;
    text-align: center;
    padding-top: 8px;
    background: @c-button;
  }
}
.ivu-modal-body {
  .tableTotal {
    padding: 0 30px 20px;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  .tables {
    margin: 0 20px 40px;
    border: none;
    /deep/.ivu-table {
      &::before {
        height: 0;
      }
      td {
        border-bottom: none;
      }
    }
  }
}
/deep/ .vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
/deep/ .ivu-modal-footer {
  border-top: 0;
  padding: 40px 0;
}
</style>

