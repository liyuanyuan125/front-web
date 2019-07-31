<template>
  <div>
    <Modal v-model="value.visible"
      title="编辑关联影院"
      width="800"
      :transfer='false'
      :closable='false'
      :mask-closable='false'
      >
      <div class="title">
        <i class="cancel" @click="handleCancel"></i>
        <p>编辑关联影院</p>
      </div>
        <Row type="flex" justify="space-between">
          <Col :span="6">
            <Select v-model="form.areaCode" clearable>
              <Option :value="item.key" :key="item.key" v-for="item in areaList">{{item.text}}</Option>
            </Select>
          </Col>
          <Col :span="6">
            <AreaSelect v-model="area" :max-level="2" no-self/>
          </Col>
          <Col :span="11" class="search-btn flex-box">
            <Input v-model="form.searchKey" @click="getList" placeholder="请输入影院专资编码或名称"/>
            <span @click="searchList">
              <Icon type="ios-search" size="22"/>
            </span>
          </Col>
        </Row>
        <KeepSelectTable
          stripe
          :data="data"
          :columns="columns"
          :selectedIds.sync="selectedIds"
        >
        </KeepSelectTable>

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
<script lang="tsx">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import AreaSelect from '@/components/areaSelect'
import { resEditCustomer } from '@/api/user'
import KeepSelectTable from '@/components/keepSelectTable'

@Component({
  components: {
    AreaSelect,
    KeepSelectTable
  }
})
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any
  total = 10
  current = 1
  pageSize = 10

  selectedIds = this.value.check

  form: any = {
    searchKey: null,
    areaCode: ''
  }
  areaList = []
  area = []
  data: any = []

  columns = [
    {
      title: '区省市',
      key: 'areaCode',
      align: 'center',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return (
          <div>
            {row.areaName} / {row.provinceName} / {row.cityName}
          </div>
        )
        /* tslint:disable */
      }
    },
    { title: '专资编码', key: 'code', align: 'center' },
    { title: '影院名称', key: 'name', align: 'center' }
  ]

  async mounted() {
    this.getList()
  }
  async getList() {
    const obj = {
      pageIndex: this.current,
      pageSize: this.pageSize,
      provinceId: this.area[0],
      cityId: this.area[1]
    }

    try {
      const { data } = await resEditCustomer({
        ...obj,
        ...this.form
      })
      // 过滤掉禁用状态2
      this.areaList = data.areaCodes.filter( (item: any) => item.controlStatus == 1)

      this.data = data.items || []
      this.value.totalCount = data.totalCount || 0
    } catch (ex) {
      this.handleError(ex)
    }
  }
  searchList() {
    this.current = 1
    this.getList()
  }
  handlepageChange(size: any) {
    this.current = size
    this.getList()
  }
  handlePageSize(size: any) {
    this.current = size
    this.getList()
  }

  handleCancel() {
    // this.selectedIds = []
    this.value.visible = false
  }
  handleOk() {
    this.$emit('save', this.selectedIds)
    this.value.visible = false
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
/deep/ .ivu-modal-header {
  border-bottom: 0;
  display: none;
  background: #f9f9f9;
}
.title {
  border-radius: 5px 5px 0 0;
  text-align: center;
  margin-bottom: 10px;
  font-size: 30px;
  font-weight: 500;
  background: #fff;
  padding: 20px;
  color: #00202d;
  .cancel {
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
.search-btn {
  /deep/ .ivu-input {
    width: 200px;
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
  height: 500px;
  overflow-y: auto;
}
.footer-bottom {
  margin: 0 0 10px;
}
/deep/ .ivu-page {
  margin-top: 25px;
}

/deep/ .ivu-select-selection {
  width: auto;
  height: 40px;
  /deep/ .ivu-select-selected-value {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
  .ivu-select-placeholder {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
}
.ivu-input-wrapper {
  width: auto;
}
/deep/ .ivu-cascader .ivu-input {
  height: 40px;
  line-height: 40px;
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
</style>

