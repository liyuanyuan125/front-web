<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">权限管理</span>
      <Button type="primary" :to="{name: 'account-auth-add'}" class="btn-new"
        v-auth="'account-manage.roles#create'">
        <Icon type="ios-add" size="27"/>新建权限角色
      </Button>
    </h3>
    <div class="flex-box search-input">
      <Input  v-model="dataForm.searchKey" placeholder="请输入权限角色ID或名称"  />
       <Button type="primary" @click="seach" class="bth-search">
        <Icon type="ios-search" size="22"/>
      </Button>
    </div>
    <Table ref="selection" stripe :loading="tableLoading"  :columns="columns4" :data="authDate">
      <template slot="modifyTime" slot-scope="{row, index}">
        <span>{{formatTimes(row.modifyTime)}}</span>
      </template>
      <template slot="spaction" slot-scope="{row, index}" >
         <a v-auth="'account-manage.roles#view'"  @click="toDetail(row.id)" style="margin-right: 8px">查看</a>
         <a v-auth="'account-manage.roles#edit'"  @click="toEdit(row.id)" style="margin-right: 8px" class="operation" >编辑</a>
         <a v-auth="'account-manage.roles#delete'"  @click="toDel(row.id)" class="operation" >删除</a>
      </template>
    </Table>
    <Page :total="total" v-if="total>0" class="btnCenter page-bottom"
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

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store.ts'
import { authUserList, customerDel } from '@/api/authUser'
import { clean } from '@/fn/object'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'
import { confirm, toast } from '@/ui/modal'
import { formatTimes, formatYell, formatNumber} from '@/util/validateRules'
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
    { title: 'ID', key: 'id', },
    {
      title: '权限角色名称',
      key: 'name',
    },
    {
      title: '上次编辑时间',
      slot: 'modifyTime',
    },
    {
      title: '操作',
      slot: 'spaction',
    }
  ]
  get formatTimes() {
    return formatTimes
  }
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
      } = await authUserList({...this.dataForm, systemCode: this.systemCode})
      this.list = items
      this.total = totalCount
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.tableLoading = false
    }
  }

  // async authIdList(query: any) {
  //   this.query = query
  //   if (query !== '') {
  //     this.loading = true
  //     try {
  //       const {
  //         data: {
  //           items
  //         }
  //       } = await authUserList({
  //         searchKey: query,
  //         systemCode: this.systemCode,
  //         pageIndex: 1,
  //         pageSize: 20
  //       })
  //       const ids: any = []
  //       const datas = items
  //       const name: any = []
  //       datas.forEach((it: any) => {
  //         if (it.name.includes(query)) {
  //           name.push({
  //             value: it.name,
  //             label: it.name
  //           })
  //         }
  //         const id = it.id + ''
  //         if (id.includes(query)) {
  //           ids.push({
  //             value: it.id,
  //             label: it.id
  //           })
  //         }
  //       })
  //       this.options = [...ids, ...name]
  //       this.loading = false
  //     } catch (ex) {
  //       this.options = []
  //     }
  //   } else {
  //     this.options = []
  //   }
  // }

  toDetail(id: any) {
    this.$router.push({ name: 'account-auth-detail', params: {id} })
  }

  toEdit(id: any) {
    this.$router.push({name: 'account-auth-add', params: {id}})
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
@import '~@/site/common.less';
.operation {
  margin-right: 8px;
}
.page-bottom {
  padding: 40px 0 100px;
}

.search-input {
  margin-left: 30px;
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
</style>
