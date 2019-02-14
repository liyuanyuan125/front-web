<template>
  <div class="home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">广告计划</span>
      <em class="addUser" @click="$router.push({name: 'pop-planlist-add'})">
        <Icon type="ios-add" size="27"/>新建广告计划
      </em>
    </h3>

    <Form :model="form" class="formInline">
      <Row type="flex" justify="space-between">
        <Col span="5">
          <Select v-model="form.status" clearable placeholder="请选择广告计划状态">
            <Option v-for="item in data.statusList" :key="item.key" :value="item.key">{{item.text}}</Option>
          </Select>
        </Col>
        <Col span="5">
          <Select v-model="form.settlementStatus" clearable placeholder="请选择结算状态">
            <Option
              v-for="item in data.settlementStatusList"
              :key="item.key"
              :value="item.key"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col span="5">
          <Select v-model="form.level" clearable placeholder="请选择广告层级">
            <Option
              v-for="item in data.levelTypeList"
              :key="item.key"
              :value="item.key"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col span="7">
          <div class="flex-box">
            <Input v-model="form.query" placeholder="请输入ID/名称进行搜索"/>
            <span class="btn-search-list" @click="searchList">
              <Icon type="ios-search" size="22"/>
            </span>
          </div>
        </Col>
      </Row>
    </Form>

    <Table
      stripe
      :columns="columns"
      :data="tableDate"
      ref="selection"
      @on-selection-change="singleSelect"
      @on-select-all="selectAll"
    >
      <template slot="status" slot-scope="{row, index}">
        <span v-if="row.status == 4 || row.status == 3" class="status-over">{{queryStatus(row.status)}}</span>
        <span v-else-if="row.status == 6 || row.status == 7" class="status-wating">{{queryStatus(row.status)}}</span>
        <span v-else>{{queryStatus(row.status)}}</span>
      </template>
      <template slot="specification" slot-scope="{row, index}">
        <span>{{row.specification}}s</span>
      </template>
      <template slot="operation" slot-scope="{row, index}">
        <!-- 草稿 待审核 -->
        <div v-if="row.status == 1 || row.status == 2" class="operation-btn">
          <p>
            <a class="table-action-btn" @click="planDefault(row.id, row.status)">查看</a>
            <a class="table-action-btn" @click="planEdit(row.id)">编辑</a>
            <a class="table-action-btn" @click="planCancel(row.name, row.id)">取消</a>
          </p>
          <p><a @click="relevanceAdv(row)">关联广告片</a></p>
        </div>
        <div v-else-if="row.status ==  4 " class="operation-btn">
           <p>
            <a class="table-action-btn" @click="planDefault(row.id, row.status)">查看</a>
            <a class="table-action-btn" @click="handlePayment(row)">支付</a>
            <a class="table-action-btn" @click="planCancel(row.name, row.id)">取消</a>
          </p>
          <p><a @click="relevanceAdv(row)">关联广告片</a></p>
        </div>
        <div v-else-if="row.status ==  5 " class="operation-btn">
          <p><a @click="planDefault(row.id, row.status)">查看</a></p>
          <p><a @click="relevanceAdv(row)">关联广告片</a></p>
        </div>
        <div v-else-if="row.status == 3 || row.status == 6 || row.status == 7 || row.status == 8 || row.status == 9 " class="operation-btn">
          <p><a @click="planDefault(row.id, row.status)">查看</a></p>
        </div>
        <div v-else-if="row.status == 10" class="operation-btn">
          <p>
            <a @click="planDefault(row.id, row.status)">查看</a>
            <a @click="planEdit(row.id)">编辑</a>
          </p>
        </div>
      </template>
    </Table>
    <h4 class="checkAll">
      <span @click="handleSelectAll">
        <Checkbox v-model="checkboxAll"></Checkbox>全选
      </span>
      <span @click="deleteList">批量删除广告计划</span>
    </h4>
    <Page
      :total="totalCount"
      v-if="totalCount>0"
      class="btnCenter plan-pages"
      :current="pageList.pageIndex"
      :page-size="pageList.pageSize"
      show-total
      show-elevator
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
     <relevanceDlg v-model="relevanVis" v-if="relevanVis.visible" @submitRelevance="submitRelevance"></relevanceDlg>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, toast } from '@/ui/modal'
import { formatTimes, formatYell, formatNumber} from '@/util/validateRules'
import { planList, delCheckPlanList, planCancel, planPayment } from '@/api/plan'
import relevanceDlg from '../plan/default/relevanceAdVDlg.vue'

@Component({
  components: {
    relevanceDlg
  }
})
export default class Plan extends ViewBase {
  form = {
    status: '',
    settlementStatus: '',
    level: '',
    query: ''
  }
  pageList = {
    pageIndex: 1,
    pageSize: 10
  }
  relevanVis: any = {
    visible: false,
    title: '',
    item: ''
  }

  totalCount = 2
  data: any = []
  selectIds = []
  checkboxAll = false

  columns = [
    { type: 'selection', width: 50, align: 'center' },
    { title: '广告计划ID', key: 'id', minWidth: 100 },
    {
      title: '广告计划名称',
      key: 'name',
      minWidth: 150,
      render: (h: any, params: any) => {
        const { row } = params
        if (row.name && row.name.length > 15) {
          const splitText = row.name.substr(0, 15) + '.......'
          return h(
            'Tooltip',
            {
              props: {
                placement: 'top',
                content: row.name,
                maxWidth: '200px'
              }
            },
            splitText
          )
        } else if (!row.name) {
          return h('span', {}, '/')
        } else {
          return h('span', {}, row.name)
        }
      }
    },
    { title: '广告计划状态', slot: 'status', minWidth: 120 },
    { title: '广告片规格', slot: 'specification', minWidth: 120 },
    { title: '广告片名称/ID', key: 'videoName', minWidth: 150 },
    // { title: '投放排期', slot: 'beginDate', minWidth: 210 },
    // { title: '投放周期', key: 'cycle', minWidth: 130 },
    // { title: '冻结金额(元）', slot: 'freezeAmount', width: 150 },
    // { title: '结算状态', key: 'settlementStatus', width: 150 },
    // { title: '广告花费(元）', key: 'settlementAmount', width: 150 },
    // { title: '创建时间', slot: 'createTime', width: 150 },
    { title: '操作', slot: 'operation', width: 150, align: 'center' }
  ]
  tableDate = []

  get formatTimes() {
    return formatTimes
  }
  get formatYell() {
    return formatYell
  }
  get formatNumber() {
    return formatNumber
  }
  async mounted() {
    this.tableList()
  }
  async tableList() {
    const { data } = await planList({ ...this.form, ...this.pageList })
    this.data = data
    this.tableDate = data.items
    this.totalCount = data.totalCount
  }
  submitRelevance() {
    this.tableList()
  }
  async handlePayment(item: any) {
    await confirm(`是否要支付冻结金额${item.freezeAmount}元`, {
      title: '支付广告计划'
    })
    try {
      const id = item.id
      await planPayment(id)
       this.tableList()
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
  planDefault(id: any, status: any) {
    if (status == '1' || status == '3' || status == '9' || status == '10') {
      this.$router.push({ name: 'pop-plan-default', params: {id}})
    } else {
      this.$router.push({ name: 'pop-plan-defaultpayment', params: {id}})
    }
  }
  planEdit(id: any) {
    this.$router.push({name: 'pop-planlist-add', params: {id}})
    // this.$router.push({name: 'pop-plan-edit', params: {id}})
  }
  async planCancel(val: any, id: any) {
    await confirm(`是否取消广告计划：${val}`, {title: '取消广告计划'})
    try {
      await planCancel(id)
      this.tableList()
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
  async relevanceAdv(val: any) {
     this.relevanVis = {
      visible: true,
      title: '关联广告片',
      item: val
    }
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
        await delCheckPlanList({ ids })
        this.tableList()
      } catch (ex) {
        this.handleError(ex.msg)
      }
    } else {
      this.showWaring('请选择你要删除的元素')
    }
  }
  queryStatus(id: any) {
     const items = this.data.statusList ? this.data.statusList.filter( (item: any) => item.key == id) : null
     if (items) {
       return items[0].text
     }
  }
  // 单选
  singleSelect(select: any) {
    this.checkboxAll = select.length == this.data.length ? true : false
    this.selectIds = select
  }
  // 全选
  selectAll(select: any) {
    this.checkboxAll = true
    this.selectIds = select
  }
  searchList() {
    this.pageList.pageIndex = 1
    this.tableList()
  }
  handlepageChange(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
  handlePageSize(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/common.less';
.status-wating {
  color: @c-done;
}
.status-over {
  color: @c-fail;
}
.operation-btn {
  text-align: center;
  span {
    cursor: pointer;
    display: inline-block;
    line-height: 22px;
  }
}
.checkAll {
  cursor: pointer;
  margin: 10px 20px 0;
  .colBg;
  padding: 0 30px 0 18px;
  span:last-child {
    color: @c-link;
  }
}
.plan-pages {
  margin: 30px 0 40px;
}
</style>



