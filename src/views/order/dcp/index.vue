<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">DCP包</span>
    </h3>
    <div class="flex-box search-input">
      <h4 class="info-title">搜索查询</h4>
      <Input  v-model="dataForm.videoName" placeholder="请输入执行单ID／广告片名称进行搜索"  />
      <span @click="seach" class="bth-search">
        <Icon type="ios-search" size="22"/>
      </span>
    </div>
    <div v-auth="'adordermanage.dcp#view'">
      <Table ref="selection" stripe :loading="tableLoading"  :columns="columns4" :data="authDate">
        <template slot-scope="{row , index}" slot="action">
          <div v-auth="'adordermanage.dcp#download'" class="edit" @click="toDetail(row.id)">
            <img style="width: 18px" src="./assets/down.png"/>
            <a class="operation" >下载DCP包</a>
          </div>
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
  </div>
</template>

<script lang="tsx">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store.ts'
import { authUserList, customerDel } from '@/api/authUser'
import { clean } from '@/fn/object'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'
import { confirm, toast } from '@/ui/modal'
import { querylist } from '@/api/orderExe'

const timeFormatDate = 'YYYY/MM/DD'

@Component
export default class Main extends ViewBase {

  dataForm: any = {
    videoName: '',
    pageIndex: 1,
    pageSize: 10,
  }
  query = ''
  loading = false
  tableLoading = false
  options: any = []
  list: any = []
  total = 0

  columns4 = [
    { title: '执行单ID', key: 'id', align: 'center' },
    {
      title: '广告片名称',
      key: 'videoName',
      align: 'center'
    },
    {
      title: '规格',
      key: 'mobile',
      align: 'center',
      render: (hh: any, { row: { specification } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = specification ? specification + 's' : ''
        return <span v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '下发时间',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = createTime ? moment(createTime).format(timeFormatDate) : ''
        return <span v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      align: 'center',
      slot: 'action'
    }
  ]

  get authDate() {
    const list = (this.list || []).map((it: any) => {
      return {
       ...it,
      }
    })
    return list
  }

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
      } = await querylist({...this.dataForm})
      this.list = items
      this.total = totalCount
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
  }

  toDetail(id: any) {
    this.$router.push({ name: 'order-dcp-detail', params: {id} })
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

  async toDel(id: any) {
    await confirm('确定删除该权限角色')
    try {
      await customerDel(id)
      toast('删除成功')
      this.seach()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  querySet() {
    this.query = ''
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.bth-search {
  cursor: pointer;
}
.search-input {
  margin-left: 30px;
}
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
    .info-title {
      line-height: 40px;
      margin-right: 20px;
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
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
    padding: 0 30px 0;
    display: flex;
    justify-content: space-between;
    color: #989898;
  }
  /deep/ .operation {
    margin-right: 6px;
  }
}
/deep/ .ivu-input-wrapper {
  width: 400px;
  .ivu-input {
    width: 400px;
    line-height: 40px;
    height: 40px;
  }
}
/deep/ .edit {
  img {
    vertical-align: middle;
    margin-right: 3px;
  }
}
/deep/ .ivu-table-cell > span:only-child:empty {
  &::before {
    content: '-';
  }
}
</style>
