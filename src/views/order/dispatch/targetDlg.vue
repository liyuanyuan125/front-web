<template>
  <Modal 
  v-model='target'
  title="查看目标影院"
  :transfer='true'
  :styles="{top: '70px'}"
  :width='720'
  footer-hide
  :mask-closable='mask'
  @on-cancel="cancel()">
  <div  class="targer-cinema">
    <div class="detail">
      <p>当前共有目标影院 <span>{{total}}个</span></p>
    </div>
    <Table   stripe :columns="columns" :data="id == 0 ? countData : tableDate">
      <!-- <template slot-scope="{ row }" slot="citys">
        {{row.citys}}
      </template> -->

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
      show-total
      show-elevator
      @on-change="sizeChangeHandle"
      @on-page-size-change="currentChangeHandle"/>
  </div>

  </Modal>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { findcarry } from '@/api/leafletDlg'
import { queryDetail } from '@/api/norderDis'
// import targetDlg from './targetDlg.vue'

@Component
export default class DlgEditCinema extends ViewBase {
  target = false
  mask = false
  type: any = ''
  id = 0
  total = 0
  dataForm: any = {
    pageIndex: 1,
    pageSize: 20,
  }

  countData: any = []
  data: any = []

  tableDate: any = []
  columns: any = [
    // {
    //   title: '区/县/市',
    //   width: 190,
    //   slot: 'citys',
    //   align: 'center'
    // },
    {
      title: '专资编码',
      slot: 'code',
      align: 'center'
    },
    {
      title: '影院名称',
      slot: 'shortName',
      align: 'center'
    }
  ]


  init(id: any, type: any, data?: any) {
    this.id = id
    this.type = type
    this.target = true
    if (id == 0) {
      this.tableDate = data
      this.total = data.length
      this.forMat()
    } else {
      this.seach()
    }
  }

  async seach() {
    try {
      let res: any = null
      if (this.type == 1) { // id查看 暂时关闭
        res = await queryDetail(this.id, {...this.dataForm})
      } else {
       // res = await findcarry(this.id, {...this.dataForm})
      }
      this.total = res.data.totalCount
      if (res.data.items && res.data.items.length > 0) {
        this.tableDate = res.data.items.map((it: any) => {
          return {
            ...it,
            citys: `${it.areaName} / ${it.provinceName} / ${it.cityName}`,
          }
        })
      } else {
        this.tableDate = []
      }
    } catch (ex) {
      this.handleError(ex)
    }
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
    this.dataForm.pageIndex = 1
    this.dataForm.pageSize = 6
    this.target = false
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
/deep/ .ivu-table-wrapper {
  margin-top: 20px;
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
  margin: 40px 0 40px;
}
.targer-cinema {
  min-height: 300px;
}
</style>
