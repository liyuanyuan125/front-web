<template>
<Modal v-model='showDlg'
  title="查看已选影院"
  :transfer='false'
  :width='750'
  @on-cancel="cancel()">
  <!-- <div class="page home-bg">
    <Table ref="selection" stripe class="tables" :loading="tableLoading" :columns="columns4" :data="tableData"></Table>
      <Page
      :total="total"
      v-if="total>0"
      class="btnCenter"
      :current="dataForm.pageIndex"
      :page-size="dataForm.pageSize"
      show-total
      show-elevator
      @on-change="sizeChangeHandle"
      @on-page-size-change="currentChangeHandle"
    /> -->
  </div>
  </Modal>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
// import { queryList } from '@/api/financeinfo'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'

// 获取当前登录用户信息
// const user: any = getUser()!

// const makeMap = (list: any[]) => toMap(list, 'id', 'name')
// const timeFormat = 'YYYY-MM-DD'

@Component
export default class Main extends ViewBase {
//   user : any = getUser()

//   showDlg = false
//   forMat: any = {}
//   init(forMat: any) {
//     this.showDlg = true
//     this.forMat = forMat
//   }
//   cancel() {
//     this.showDlg = false
//   }


//   dataForm = {
//     companyId: user.companyId,
//     status: null,
//     pageIndex: 1,
//     pageSize: 10,
//   }
//   total = 0
//   items: any = []
//   loading = false
//   tableLoading = false
//   options: any = []
//   userList: any = {}
//   // 状态列表
//   approvalStatusList: any = []


//   currentsize = 1

//   columns4 = [
//     { title: '区/省/市', key: 'areaName', align: 'center' ,
//       render: (hh: any, { row: { areaName , provinceName , cityName } }: any) => {
//         /* tslint:disable */
//         const h = jsxReactToVue(hh)
//         const html = areaName + '/' + provinceName + '/' + cityName
//         return <span class='datetime' v-html={html}></span>
//         /* tslint:enable */
//       }
//     },
//     {
//       title: '城市级别',
//       key: 'pricingLevelName',
//       align: 'center'
//     },
//     {
//       title: '专资编码',
//       key: 'code',
//       align: 'center'
//     },
//     {
//       title: '影院名称',
//       key: 'officialName',
//       align: 'center'
//     },
//     {
//       title: '影厅数',
//       key: 'hallCount',
//       align: 'center'
//     },
//     {
//       title: '总座位数',
//       key: 'seatCount',
//       align: 'center'
//     },
//     {
//       title: '票房级别',
//       key: 'boxLevelName',
//       align: 'center',
//     },
//   ]

//   created() {
//     this.userList = user
//     this.seach()
//   }


//   // 每页数
//   sizeChangeHandle(val: any) {
//     this.dataForm.pageIndex = val
//     // this.currentsize = val
//     this.seach()
//   }

//   // 当前页
//   currentChangeHandle(val: any) {
//     this.dataForm.pageSize = val
//     this.seach()
//   }
//   search() {
//     // console.log(123)
//     this.dataForm.pageIndex = 1
//   }

//   get cachedMap() {
//     return {
//       approvalStatus: this.approvalStatusList,
//     }
//   }

//   get tableData() {
//     const cachedMap = this.cachedMap
//     const list = (this.items || []).map((it: any) => {
//       return {
//         ...it,
//         statusText: it.approvalStatus,
//       }
//     })
//     return list
//   }


//   async seach() {
//     this.tableLoading = true
//     try {
//     //   const {
//     //     data: {
//     //       items,
//     //       totalCount,
//     //       approvalStatusList
//     //     }
//     //   } = await queryList()
//         // this.items = items
//     //   this.total = totalCount
//     //   this.approvalStatusList = approvalStatusList
//     } catch (ex) {
//       this.handleError(ex)
//     } finally {
//       this.tableLoading = false
//     }
//   }

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.page {
  background: #fff;
  height: 100%;
  font-size: 14px;
  .ivu-select {
    width: auto;
    margin-left: 25px;
    /deep/ .ivu-select-placeholder {
      line-height: 37px;
    }
    /deep/ .ivu-select-selected-value {
      line-height: 37px;
    }
    /deep/ .ivu-select-selection {
      height: 40px;
      width: 300px;
      margin-right: 30px;
      /deep/ .ivu-select-input {
        height: 40px;
        width: 400px;
        margin-bottom: 30px;
      }
    }
    /deep/ .ivu-select-dropdown {
      /deep/ li, /deep/ .ivu-select-loading {
        line-height: 35px;
        height: 35px;
      }
      /deep/ .ivu-select-item {
        line-height: 25px;
        height: 35px;
      }
    }
  }
  /deep/ .ivu-btn-default {
    border: 0;
    color: #222;
  }
  .flex-box {
    span {
      display: block;
      height: 40px;
      width: 60px;
      color: #fff;
      text-align: center;
      padding-top: 8px;
      background: @c-button;
    }
  }
  .total {
    padding-left: 2%;
    padding-top: 2%;
    margin-bottom: -1.5%;
  }
  /deep/ .item-top {
    padding-left: 20px;
  }
  .table-box {
    div {
      display: inline-block;
    }
    background: rgba(249, 249, 249, 1);
    border-radius: 2px 2px 0  0;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
  }
  .table-left-title {
    float: left;
    padding-left: 1.2%;
    color: #222;
  }
  .table-right-title {
    float: right;
    padding-right: 1.2%;
    color: #2481d7;
    cursor: pointer;
  }
  .tableTotal {
    padding: 0 30px 20px;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  .tables {
    margin: 20px;
    /deep/ .status-3 {
      color: red;
    }
    /deep/ .status-1 {
      color: #19be6b;
    }
    /deep/ .aptitude-status-2 {
      color: #000;
    }
    /deep/ .aptitude-status-4 {
      color: #ed4014;
    }
    /deep/ .ivu-table-cell > span:only-child:empty {
      &::before {
        content: '-';
      }
    }
  }
  /deep/ .ivu-btn {
    font-size: 14px;
    height: 40px;
  }
}
</style>
