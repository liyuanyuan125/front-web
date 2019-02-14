<template>
  <div class="page home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">广告片</span>
      <em class="addUser" @click="$router.push({name: 'pop-film-edit'})">
        <Icon type="ios-add" size="27"/>新增广告片
      </em>
    </h3>
    <Form :model="form" class="formInline edit-input">
      <div class="flex-box">
         <FormItem label="广告片状态" :label-width="100" class="film-status">
            <Select v-model="form.status" clearable placeholder="广告片状态" >
               <Option v-for="item in statusList" :key="item.key" :value="item.key">{{item.text}}</Option>
            </Select>
         </FormItem>
        <div class="flex-box film-search">
            <Input v-model="form.query" placeholder="请输入广告ID/名称进行搜索"/>
            <span class="btn-search-list" @click="searchList">
              <Icon type="ios-search" size="22"/>
            </span>
        </div>
      </div>
    </Form>

    <Table
      stripe
      :columns="columns"
      :data="tableDate"
      ref="selection"
      @on-selection-change="singleSelect"
      @on-select-all="selectAll"
    >
    <template slot="name" slot-scope="{row, index}">
      <span @click="queryFileUrl(row.srcFileUrl)" class="video-name-link">{{row.name}}</span>
      <!-- <video  autoplay controls :src="row.srcFileUrl" width="100" /> -->
    </template>
    <template slot="specification" slot-scope="{row, index}">
      <span>{{row.specification}}s</span>
    </template>
    <template slot="length" slot-scope="{row, index}">
      <span>{{row.length}}s</span>
    </template>
    <template slot="status" slot-scope="{row, index}">
      <span v-if="row.status == 2" class="status-over">{{queryStatus(row.status)}}</span>
      <span v-else>{{queryStatus(row.status)}}</span>
    </template>
    <template slot="applyTime" slot-scope="{row, index}">
      <span>{{formatTimes(row.applyTime)}}</span>
    </template>
    <template slot="operation" slot-scope="{row, index}">
      <!-- 待审核 -->
      <span v-if="row.status == 1">
        <p>
          <a class="table-action-btn">查看</a>
          <a class="table-action-btn" @click="popEdit(row.id)">编辑</a>
          <a class="table-action-btn" @click="planCancel(row.name, row.id)">取消</a>
        </p>
      </span>
      <span v-else-if="row.status == 2">
        <p>
          <a class="table-action-btn">查看</a>
          <a class="table-action-btn" @click="handlePayment(row)">支付</a>
          <a class="table-action-btn" @click="planCancel(row.name, row.id)">取消</a>
        </p>
      </span>
      <span v-else-if="row.status == 3 || row.status == 6 || row.status == 4">
        <p>
          <a class="table-action-btn">查看</a>
        </p>
      </span>
      <span v-else-if="row.status == 5">
        <p>
          <a class="table-action-btn">查看</a>
          <a class="table-action-btn" @click="popEdit(row.id)">编辑</a>
        </p>
      </span>
    </template>
    </Table>
    <h4 class="checkAll">
      <span @click="handleSelectAll">
        <Checkbox v-model="checkboxAll"></Checkbox>全选
      </span>
      <span @click="deleteList">批量删除广告片</span>
    </h4>

    <Page
      :total="totalCount"
      class="btnCenter plan-pages"
      :current="pageList.pageIndex"
      :page-size="pageList.pageSize"
      show-total
      show-elevator
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
    <updataVideo v-model="updataVideo" v-if="updataVideo.visible"></updataVideo>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, toast } from '@/ui/modal'
import { dataList, delList, popCancel, popPayment } from '@/api/popFilm'
import { formatTimes, formatYell, formatNumber} from '@/util/validateRules'
import updataVideo from '@/components/videoDlg.vue'

@Component({
  components: {
    updataVideo
  }
})
export default class Main extends ViewBase {
  form: any = {
    status: null,
    query: null
  }
  pageList = {
    pageIndex: 1,
    pageSize: 10
  }
  totalCount = 0

  statusList: any = []
  selectIds = []
  checkboxAll = false

  updataVideo = {
    visible: false,
    url: ''
  }

  columns = [
    { type: 'selection', width: 50, align: 'center' },
    { title: '广告片ID', key: 'id' },
    { title: '广告片名称', slot: 'name', width: 140 },
    { title: '广告片规格', slot: 'specification' },
    { title: '广告片时长', slot: 'length' },
    { title: '数字转制费用(元）', key: 'transFee', width: 150 },
    { title: '广告片状态', slot: 'status' },
    { title: '创建时间', slot: 'applyTime', width: 200 },
    { title: '操作', slot: 'operation', width: 150},
  ]
  tableDate = []
  get formatTimes() {
    return formatTimes
  }
  mounted() {
    this.tableList()
  }
  async tableList() {
    try {
      const {
        data: { items, statusList, totalCount }
      } = await dataList({
        ...this.form,
        ...this.pageList
      })
      this.tableDate = items || []
      this.statusList = statusList
      this.totalCount = totalCount || 0

    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
  async planCancel(val: any, id: any) {
    await confirm(`是否取消广告片：${val}`, {title: '取消广告片'})
    try {
      await popCancel(id)
      this.tableList()
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
  async handlePayment(item: any) {
    await confirm(`是否要支付数字转制费用 ${item.transFee} 元`, {
      title: '支付广告片'
    })
    try {
      const id = item.id
      await popPayment(id)
       this.tableList()
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
  queryStatus(id: any) {
     const items = this.statusList ? this.statusList.filter( (item: any) => item.key == id) : []
     if (items.length > 0) {
       return items[0].text
     }
  }
  searchList() {
    this.pageList.pageIndex = 1
    this.tableList()
  }
   // 单选
  singleSelect(select: any) {
    this.checkboxAll = select.length == this.tableDate.length ? true : false
    this.selectIds = select
  }
  // 全选
  selectAll(select: any) {
    this.checkboxAll = true
    this.selectIds = select
  }
  handleSelectAll() {
    const selection = this.$refs.selection as any
    selection.selectAll(!this.checkboxAll)
  }
  async deleteList() {
    if (this.selectIds.length) {
      const ids = this.selectIds.map((item: any) => item.id) || []
      await confirm('您确定要删除当前信息吗？')
      try {
        await delList({ ids })
        this.tableList()
      } catch (ex) {
        this.handleError(ex.msg)
      }
    } else {
      this.showWaring('请选择你要删除的元素')
    }
  }

  handlepageChange(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
  handlePageSize(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
  popEdit(id: any) {
    this.$router.push({name: 'pop-film-edit', params: { id }})
  }
  queryFileUrl(url: any) {
    this.updataVideo = {
      visible: true,
      url
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/common.less';
.video-name-link {
  color: #2481d7;
  cursor: pointer;
}
.status-over {
  color: @c-fail;
}
.film-status {
  /deep/ .ivu-select-selection {
    width: 300px;
    margin-right: 40px;
  }
}
.film-search {
  width: 417px;
  .ivu-input-wrapper input {
    width: 350px;
  }
}

</style>
