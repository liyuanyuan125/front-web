<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">权限管理</span>
      <router-link class="addUser" tag="span" :to="{name:'account-auth-add', params: {id: 0}}">
        <Icon type="ios-add" size="27"/>新建权限角色
      </router-link>
    </h3>
    <div class="flex-box">
      <Select
        v-model="dataForm.searchKey"
        filterable
        remote
        @on-query-change = "querySet"
        clearable
        placeholder="请输入权限角色ID或名称"
        :remote-method="authIdList"
        :loading="loading">
        <Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
      </Select>
      <span @click="seach">
        <Icon type="ios-search" size="22"/>
      </span>
    </div>
    <Table ref="selection" stripe :loading="tableLoading"  :columns="columns4" :data="authDate"></Table>
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
import { getUser } from '@/store.ts'
import { authUserList, customerDel } from '@/api/authUser'
import { clean } from '@/fn/object'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'
import { confirm, toast } from '@/ui/modal'

const timeFormatDate = 'YYYY-MM-DD HH:mm:ss'

@Component
export default class Main extends ViewBase {

  dataForm: any = {
    searchKey: '',
    pageIndex: 1,
    pageSize: 10,
  }
  query = ''
  loading = false
  tableLoading = false
  options: any = []
  list: any = []
  total = 0

  get systemCode() {
    return getUser()!.systemCode
  }

  columns4 = [
    { title: 'ID', key: 'id', align: 'center' },
    {
      title: '权限角色名称',
      key: 'name',
      align: 'center'
    },
    {
      title: '上次编辑时间',
      key: 'mobile',
      align: 'center',
      render: (hh: any, { row: { modifyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = modifyTime ? moment(modifyTime).format(timeFormatDate) : ''
        return <span v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      align: 'center',
      render: (hh: any, { row: { id } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div>
          <a on-click={this.toDetail.bind(this, id)} class="operation" >查看</a>
          <a on-click={this.toEdit.bind(this, id)} class="operation" >编辑</a>
          <a on-click={this.toDel.bind(this, id)} class="operation" >删除</a>
        </div>
        /* tslint:enable */
      }
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

  async seach() {
    this.tableLoading = true
    try {
      const query = { ...this.dataForm, searchKey: this.query }
      const {
        data: {
          items,
          totalCount
        }
      } = await authUserList(clean({...query, systemCode: this.systemCode}))
      this.list = items
      this.total = totalCount
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
  }

  async authIdList(query: any) {
    this.query = query
    if (query !== '') {
      this.loading = true
      try {
        const {
          data: {
            items
          }
        } = await authUserList({
          searchKey: query,
          systemCode: this.systemCode,
          pageIndex: 1,
          pageSize: 20
        })
        const ids: any = []
        const datas = items
        const name: any = []
        datas.forEach((it: any) => {
          if (it.name.includes(query)) {
            name.push({
              value: it.name,
              label: it.name
            })
          }
          const id = it.id + ''
          if (id.includes(query)) {
            ids.push({
              value: it.id,
              label: it.id
            })
          }
        })
        this.options = [...ids, ...name]
        this.loading = false
      } catch (ex) {
        this.options = []
      }
    } else {
      this.options = []
    }
  }
  async mounted() {}

  toDetail(id: any) {
    this.$router.push({ name: 'account-auth-detail', params: {id} })
  }

  toEdit(id: any) {
    this.$router.push({name: 'account-auth-add', params: {id}})
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
</style>
