<template>
  <Modal 
  v-model='target'
  title="查看目标影院"
  :transfer='false'
  :styles="{top: '70px'}"
  :width='720'
  footer-hide
  :mask-closable='mask'
  @on-cancel="cancel()">
  <div  class="targer-cinema">
    <div class="detail">
      <p>查看全部已关联影院 <span>{{tableDate.length}}个</span></p>
    </div>
    <Table   stripe :columns="columns" :data=" countData ">
      <template slot-scope="{ row }" slot="citys">
        {{row.citys}}
      </template>

      <template slot-scope="{ row }" slot="code">
        {{row.code}}
      </template>

      <template slot-scope="{ row }" slot="shortName">
        {{row.shortName}}
      </template>
    </Table>

    <Page :total="total" v-if="total>0" class="btnCenter"
      :current="dataForm.pageIndex"
      :page-size="dataForm.pageSize"
      :page-size-opts="[6, 12, 18, 24]"
      show-total
      show-sizer
      show-elevator
      @on-change="sizeChangeHandle"
      @on-page-size-change="currentChangeHandle"/>
  </div>

  </Modal>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList, leafletList, sureLeaflet } from '@/api/leafletDlg'

@Component
export default class DlgEditCinema extends ViewBase {
  target = false
  mask = false
  id = 0
  total = 0
  dataForm: any = {
    pageIndex: 1,
    pageSize: 6,
  }

  countData: any = []
  data: any = []

  tableDate: any = []
  columns: any = [
    {
      title: '区/县/市',
      width: 180,
      slot: 'citys',
      align: 'center'
    },
    {
      title: '转资编码',
      slot: 'code',
      width: 160,
      align: 'center'
    },
    {
      title: '影院名称',
      slot: 'shortName',
      align: 'center'
    }
  ]

  created() {
    // this.init(31)
  }

  async init(id: any, data?: any) {
    this.id = id
    if (id == 0) {
      this.tableDate = data
      this.total = data.length
      this.forMat()
    }
    this.target = true
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
    if (this.id != 0) {
      this.seach()
    }
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.dataForm.pageSize = val
    if (this.id != 0) {
      this.seach()
    }
  }

  cancel() {
    this.target = false
  }

  open() {

  }

  forMat() {
    const index = this.dataForm.pageIndex - 1
    this.countData = this.tableDate.slice(index * this.dataForm.pageSize, (index + 1) * this.dataForm.pageSize)
  }

  @Watch('dataForm', {deep: true})
  watchdataForm(val: any) {
    if (this.id == 0) {
      this.forMat()
    }
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
.detail {
  margin-top: 16px;
  margin-left: 30px;
  color: rgba(152, 152, 152, 1);
}
.btnCenter {
  margin-bottom: 30px;
}
.targer-cinema {
  min-height: 300px;
}
</style>
