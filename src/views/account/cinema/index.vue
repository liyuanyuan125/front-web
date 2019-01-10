<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">影院管理</span>
    </h3>
    <div class="flex-box">
      {{query}}
      <Select
        v-model="dataForm.query"
        filterable
        remote
        clearable
        placeholder="请输入转资编码或影院名称"
        @on-query-change = "querySet"
        :remote-method="queryCode"
        :loading="loading">
        <Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
      </Select>
      <span @click="seach">
        <Icon type="ios-search" size="22"/>
      </span>
    </div>
    <Table ref="selection" stripe class="tables" :loading="tableLoading" :columns="columns4" :data="cinemaData"></Table>
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
    query: '',
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
      key: 'countyName',
      align: 'center'
    },
    {
      title: '专资编码',
      key: 'code',
      align: 'center'
    },
    {
      title: '影院名称',
      key: 'shortName',
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
      render: (hh: any, { row: { id } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <a on-click={this.toDetail.bind(this, id)} class="operation" >详情</a>
        /* tslint:enable */
      }
    }
  ]

  created() {
    this.seach()
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

  async queryCode(query: any) {
    this.query = query
    if (query !== '') {
      this.loading = true
      try {
        const {
          data: {
            items
          }
        } = await cinmeaList({
          query
        })
        const code: any = []
        const shortName: any = []
        items.forEach((it: any) => {
          if ( it.code.includes(query) ) {
            code.push({
              value: it.code,
              label: it.code
            })
          }
        })
        items.forEach((it: any) => {
          if ( it.shortName.includes(query) ) {
            shortName.push({
              value: it.shortName,
              label: it.shortName
            })
          }
        })
        this.options = [...code, ...shortName]
        this.loading = false
      } catch (ex) {
        this.options = []
      }
    } else {
      this.options = []
    }
  }

  async seach() {
    this.tableLoading = true
    try {
      const query = { ...this.dataForm, query: this.query }
      const {
        data: {
          items,
          totalCount
        }
      } = await cinmeaList(clean({...query}))
      this.cinemaData = items
      this.total = totalCount
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
  }

  toDetail(id: any) {
    this.$router.push({ name: 'account-cinema-detail', params: {id} })
  }

  querySet(query: any) {
    this.query = ''
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.colBg {
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: @c-head-bg;
}
.page {
  background: #fff;
  height: 100%;
  font-size: 14px;
  .ivu-select {
    width: auto;
    margin-left: 25px;
    /deep/ .ivu-select-selection {
      height: 40px;
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
  .userTitle {
    .colBg;
    .addUser {
      width: 140px;
      height: 40px;
      line-height: 40px;
      display: block;
      text-align: center;
      color: #fff;
      cursor: pointer;
      background: @c-button;
    }
  }
  .tableTotal {
    padding: 0 30px 20px;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  .tables {
    margin: 20px;
  }
}
</style>
