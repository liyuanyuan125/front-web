<template>
  <div>
    <Modal
      v-model="value.editVis"
      width="700"
      :transfer='true'
      :closable='false'
      :mask-closable='false'
      >
      <div class="title">
        <i @click="handleCancel"></i>
        <p>编辑关联用户</p>
      </div>
      <div class="flex-box">
        <Input v-model="search" placeholder="请输入客户ID或名称"/>
        <span @click="searchList">
          <Icon type="ios-search" size="22"/>
        </span>
      </div>
      <Table
        stripe
        :columns="columns"
        :data="data"
        @on-selection-change="selectChange"
      ></Table>
      <Page
        :total="value.totalCount"
        v-if="value.totalCount>0"
        class="btnCenter"
        :current="current"
        :page-size="pageSize"
        show-total
        show-elevator
        @on-change="handlepageChange"
        @on-page-size-change="handlePageSize"
      />
      <div slot="footer" class="btnCenter footer-bottom">
        <Button class="button-cancel" @click="handleCancel">取消</Button>
        <Button type="primary" class="button-ok" @click="handleOk">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { addEditCustomer } from '@/api/user'

@Component
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any
  total = 10
  current = 1
  pageSize = 10
  search = null

  data: any = []
  selectList = []
  columns = [
    { type: 'selection', width: 60, align: 'center' },
    { title: 'id', key: 'id', align: 'center' },
    { title: '客户名称', key: 'name', align: 'center' }
  ]

  async mounted() {
    this.getList()
  }
  searchList() {
    this.current = 1
    this.getList()
  }
  async getList() {
    const obj = {
      pageIndex: this.current,
      pageSize: this.pageSize,
      searchKey: this.search
    }
    try {
      const { data } = await addEditCustomer(obj)
      // 在渲染之前添加选中的key
      if (this.value.check) {
        data.items.map((item: any) => {
          this.value.check.map((check: any) => {
            if (item.id == check.id) {
              item._checked = true
            }
          })
        })
      }
      this.data = data.items
      this.value.totalCount = data.totalCount
    } catch (ex) {
      this.showError(ex)
    }
  }
  handlepageChange(size: any) {
    this.current = size
    this.getList()
  }
  handlePageSize(size: any) {
    this.current = size
    this.getList()
  }

  selectChange(select: any) {
    this.selectList = select
  }

  handleCancel() {
    this.selectList = []
    this.value.editVis = false
  }
  handleOk() {
    this.$emit('save', this.selectList)
    this.value.editVis = false
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
/deep/ .ivu-modal-body {
  padding: 0;
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
.btnCenter {
  margin-top: 40px;
}
.flex-box {
  padding-left: 25px;
  .ivu-input-wrapper {
    width: auto;
  }
  /deep/ .ivu-input {
    width: 400px;
    height: 40px;
  }
  span {
    display: block;
    height: 40px;
    width: 80px;
    color: #fff;
    text-align: center;
    padding-top: 8px;
    cursor: pointer;
    position: relative;
    left: -1px;
    background: @c-button;
  }
}
/deep/ .ivu-table {
  min-height: 200px;
  overflow-y: auto;
}
.footer-bottom {
  margin: 0 0 10px;
}
/deep/ .ivu-input-wrapper,
/deep/ .ivu-form-item-content,
/deep/ .ivu-input,
/deep/ .ivu-select-input {
  color: #00202d;
  border-radius: 5px;
  font-size: 16px;
  width: 400px;
  &::placeholder {
    font-size: 16px;
    color: #b3bcc0;
  }
}
.button-ok {
  width: 200px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.button-cancel {
  width: 200px;
  .button-style(#00202d, rgba(0, 0, 0, 0));
  border-radius: 25px;
}
/deep/ .ivu-page {
  margin-top: 25px;
}
</style>

