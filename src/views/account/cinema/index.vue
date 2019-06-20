<template>
  <div class="page">
    <h3 class="plan-title">
      <span class="adver-tiele">影院管理</span>
    </h3>
    <div class="search-input">
      <Input v-model="dataForm.searchKey"  placeholder="请输入专资编码或影院名称" />
      <Button  type="primary" class="bth-search" @click="seachList">
        <Icon type="ios-search" size="22"/>
      </Button>
    </div>
    <Table ref="selection" stripe class="tables" :loading="tableLoading" :columns="columns4" :data="cinemaData">
      <template slot-scope="{row}" slot="action">
        <a v-auth="'account-manage.managecinema#view'" @click="toDetail( row.id)" class="operation" >详情</a>
      </template>
    </Table>
    <Page :total="total" v-if="total>0" class="btnCenter"
      :current="dataForm.pageIndex"
      :page-size="dataForm.pageSize"
      :page-size-opts="[10, 20, 50, 100]"
      show-total
      show-sizer
      show-elevator
      @on-change="sizeChangeHandle"
      @on-page-size-change="currentChangeHandle"/>
  </div>
</template>

<script lang="tsx">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinmeaList } from '@/api/cinema'
import { clean } from '@/fn/object'
import jsxReactToVue from '@/util/jsxReactToVue'

@Component
export default class Main extends ViewBase {
  dataForm = {
    searchKey: '',
    pageIndex: 1,
    pageSize: 10,
  }
  query = ''
  total = 0
  cinemaData: any = []
  loading = false
  tableLoading = false
  options: any = []
  columns4 = [
    { title: '省份', key: 'provinceName', align: 'center' },
    {
      title: '城市',
      key: 'cityName',
      align: 'center'
    },
    {
      title: '专资编码',
      key: 'code',
      align: 'center'
    },
    {
      title: '影院名称',
      key: 'name',
      align: 'center'
    },
    {
      title: '影厅数',
      key: 'hallCount',
      align: 'center'
    },
    {
      title: '总座位数',
      key: 'seatCount',
      align: 'center'
    },
    {
      title: '操作',
      align: 'center',
      slot: 'action'
    }
  ]

  mounted() {
    this.seach()
  }

  async seach() {
    this.tableLoading = true
    try {
      const {
        data: {
          items,
          totalCount
        }
      } = await cinmeaList({...this.dataForm})
      this.cinemaData = items
      this.total = totalCount
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
  }
  seachList() {
    this.dataForm.pageIndex = 1
    this.seach()
  }
  toDetail(id: any) {
    this.$router.push({ name: 'account-cinema-detail', params: {id} })
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

  // querySet(query: any) {
  //   this.query = ''
  // }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/site/common.less';
.page {
  padding: 30px 0 0 20px;
}
.search-input {
  margin-left: 30px;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}
.plan-title {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #fff;
  .adver-tiele {
    color: #fff;
    font-size: 24px;
    font-weight: normal;
  }
}
/deep/ .ivu-input-wrapper {
  width: 400px;
  .ivu-input {
    width: 400px;
    line-height: 40px;
    font-size: 14px;
    height: 40px;
  }
}
.bth-search {
  border-radius: 0 5px 5px 0;
  .button-style(#fff, #00202d);
}
/deep/ .ivu-table-wrapper > .ivu-spin-fix {
  background: rgba(0, 0, 0, 0);
  border: none;
}
/deep/ .ivu-input-wrapper,
/deep/ .ivu-input {
  background: rgba(255, 255, 255, 0.4);
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-radius: 5px 0 0 5px;
  &::placeholder {
    font-size: 14px;
    color: #00202d;
  }
}
.list-box {
  background: rgba(0, 32, 45, .8);
  margin: 0 20px;
  border-radius: 5px;
  padding-bottom: 40px;
}
.list-table {
  position: relative;
  background: rgba(0, 0, 0, 0);
  border-radius: 5px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 61px;
    border-radius: 5px 5px 0 0;
    background: rgba(0, 32, 45, 0.3);
  }
  /deep/ .ivu-table-header {
    position: relative;
  }
  /deep/ .ivu-table-row {
    border-bottom: 1px solid #00202d;
  }
}
/deep/ .ivu-table-wrapper {
  border-radius: 5px;
  min-height: 280px;
  position: relative;
  /deep/ .ivu-table-header th {
    height: 60px;
    background: rgba(0, 32, 45, 0.3);
    color: #fff;
    line-height: 60px;
    span {
      font-size: 14px;
    }
  }
  /deep/ .ivu-table-column-center, /deep/ .ivu-table-column-left {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-row {
    background: rgba(255, 255, 255, 0);
    /deep/ td {
      color: #fff;
      background: rgba(0, 0, 0, 0);
      a {
        color: #4fa6bb;
      }
    }
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr:nth-child(2n - 1) td {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-body .ivu-table-column-center, /deep/ .ivu-table-body .ivu-table-column-left {
    span {
      color: #fff;
      font-size: 14px;
    }
  }

  /deep/ .ivu-table-tip {
    line-height: 200px;
    /deep/ td {
      color: #fff;
      background: rgba(255, 255, 255, 0);
    }
  }
}
</style>
