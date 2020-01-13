<template>
  <Modal 
  v-model="value.visible"
  title="查看影城接单情况"
  :width='720'
  footer-hide
  :transfer='false'
  >
  <div  class="targer-cinema">
    <div class="detail">
      <span>目标影城{{statsuObj.totalCount}}家</span>
      <span>待接单影城{{statsuObj.waiting}}家</span>
      <span>已接单影城{{statsuObj.received}}家</span>
      <span>已拒绝影城{{statsuObj.refuse}}家</span>
      <span>已失效影城{{statsuObj.faliure}}家</span>
      <span>已取消影城{{statsuObj.cancel}}家</span>
      <span>执行中影城{{statsuObj.beexecute}}家</span>
      <span>已完成影城{{statsuObj.complete}}家</span>
    </div>
    <Table stripe :columns="columns" :data="tableDate">
      <template slot-scope="{ row }" slot="citys">
        {{row.citys}}
      </template>

      <template slot-scope="{ row }" slot="code">
        {{row.code}}
      </template>

      <template slot-scope="{ row }" slot="shortName">
        {{row.shortName}}
      </template>

      <template slot-scope="{ row }" slot="status">
       <span v-for="item in statusList" :key="item.key" v-if="item.key == row.status">{{item.text}}</span>
      </template>
    </Table>

    <Page :total="statsuObj.totalCount" v-if="statsuObj.totalCount>0" class="btn-center-footer"
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
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryDetail } from '@/api/norderDis'

@Component
export default class DlgEditCinema extends ViewBase {
  @Prop({ type: Object }) value!: any

  dataForm: any = {
    pageIndex: 1,
    pageSize: 20,
  }

  statsuObj = {}
  statusList = []

  tableDate: any = []
  columns: any = [
    {
      title: '区/县/市',
      width: 190,
      slot: 'citys',
      align: 'center'
    },
    {
      title: '专资编码',
      slot: 'code',
      align: 'center'
    },
    {
      title: '影院名称',
      slot: 'shortName',
      align: 'center'
    },
    {
      title: '接单状态',
      slot: 'status',
      align: 'center'
    }
  ]

  mounted() {
    this.seach()
  }

  async seach() {
    try {
      const { data } = await queryDetail(this.value.id, {...this.dataForm})

      this.statsuObj = {
        totalCount: data.totalCount,
        waiting: data.waiting,
        received: data.received,
        refuse: data.refuse,
        cancel: data.cancel,
        faliure: data.faliure,
        beexecute: data.beexecute,
        complete: data.complete
      }

      this.statusList = data.statusList || []
      this.tableDate = (data.items || []).map((it: any) => {
        return {
          ...it,
          citys: `${it.areaName} / ${it.provinceName} / ${it.cityName}`,
        }
      })
    } catch (ex) {
      this.handleError(ex)
    }
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
  span {
    font-size: 14px;
    padding-right: 20px;
  }
}
.btn-center-footer {
  margin: 40px 0 40px;
}
.targer-cinema {
  min-height: 300px;
}
</style>
