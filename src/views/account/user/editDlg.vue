<template>
  <div>
    <Modal v-model="value.editVis" class-name="vertical-center-modal" title="查看关联客户" width="800">
      <div class="flex-box">
        <Input v-model="search" @click="getList" placeholder="请输入客户ID或名称"/>
        <span @click="getList">
          <Icon type="ios-search" size="22"/>
        </span>
      </div>
      <!-- <div class="tableTotal">
        <span>当前共有用户 xxx 人</span>
        <span>当前结果共xxxx项</span>
      </div>-->
      <Table
        stripe
        :columns="columns"
        :data="data"
        @on-select="singleSelect"
        @on-select-all="selectAll"
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
        <button class="button-cancel" @click="handleCancel">取消</button>
        <button class="button-ok" @click="handleOk">保存</button>
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
    if (this.value.check) {
      this.data.map((item: any) => {
        // 全部list
        this.value.check.map((check: any) => {
          if (item.id == check.id) {
            item._checked = true
          }
        })
      })
    }
  }
  async getList() {
    const obj = {
      pageIndex: this.current,
      pageSize: this.pageSize,
      searchKey: this.search
    }
    const { data } = await addEditCustomer(obj)
    this.data = data.items
    this.value.totalCount = data.totalCount
  }
  handlepageChange(size: any) {
    this.current = size
    this.getList()
  }
  handlePageSize(size: any) {
    this.current = size
    this.getList()
  }

  singleSelect(select: any) {
    this.selectList = select
  }
  selectAll(select: any) {
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
  padding: 10px 13px;
  background: #f9f9f9;
  font-weight: none;
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
  height: 550px;
  max-height: 550px;
  overflow: auto;
}
.footer-bottom {
  margin: 10px 0 30px;
}
/deep/ .ivu-page {
  margin-top: 25px;
}
</style>

