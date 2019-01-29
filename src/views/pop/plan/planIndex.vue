<template>
  <div class="home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">广告计划</span>
      <em class="addUser">
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
      <template slot="stauts" slot-scope="{row, index}">
        <span>{{queryStatus(row.stauts)}}</span>
      </template>
      <template slot="beginDate" slot-scope="{row, index}">
        <span>{{formatYell(row.beginDate)}} ~ {{formatYell(row.endDate)}}</span>
      </template>
      <template slot="createTime" slot-scope="{row, index}">
        <span>{{formatTimes(row.createTime)}}</span>
      </template>
      <template slot="operation" slot-scope="{row, index}">
        <!-- 草稿 待审核 -->
        <div v-if="row.stauts == 1 || row.stauts == 2" class="operation-btn">
          <p><span @click="planDefault(row.id, row.stauts)">查看</span></p>
          <p><span>编辑</span></p>
          <p><span>取消</span></p>
          <p><span @click="relevanceAdv(row.id)">关联广告片</span></p>
        </div>
        <div v-else-if="row.stauts ==  4 " class="operation-btn">
          <p><span @click="planDefault(row.id, row.stauts)">查看</span></p>
          <p><span>支付</span></p>
          <p><span>取消</span></p>
          <p><span>关联广告片</span></p>
        </div>
        <div v-else-if="row.stauts ==  5 " class="operation-btn">
          <p><span @click="planDefault(row.id, row.stauts)">查看</span></p>
          <p><span @click="relevanceAdv(row.id)">关联广告片</span></p>
        </div>
        <div v-else-if="row.stauts == 3 || row.stauts == 6 || row.stauts == 7 || row.stauts == 8 || row.stauts == 9 " class="operation-btn">
          <p><span @click="planDefault(row.id, row.stauts)">查看</span></p>
        </div>
        <div v-else-if="row.stauts == 10" class="operation-btn">
          <p><span @click="planDefault(row.id, row.stauts)">查看</span></p>
          <p><span>编辑</span></p>
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
      class="btnCenter"
      :current="pageList.pageIndex"
      :page-size="pageList.pageSize"
      show-total
      show-elevator
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
     <relevanceDlg v-model="relevanVis" v-if="relevanVis.visible"></relevanceDlg>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, toast } from '@/ui/modal'
import { formatTimes, formatYell} from '@/util/validateRules'
import { planList, delCheckPlanList } from '@/api/plan'
import relevanceDlg from '../plan/relevanceAdVDlg.vue'

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
  relevanVis = {
    visible: false,
    title: '关联广告片'
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
    { title: '广告计划状态', slot: 'stauts', width: 150 },
    { title: '广告片规格', key: 'specification', width: 150 },
    { title: '广告片名称/ID', key: 'videoName', width: 150 },
    { title: '投放排期', slot: 'beginDate', width: 150 },
    { title: '投放周期', key: 'cycle', width: 80 },
    { title: '冻结金额(元）', key: 'freezeAmount', width: 150 },
    { title: '结算状态', key: 'settlementStatus', width: 150 },
    { title: '广告花费(元）', key: 'settlementAmount', width: 150 },
    { title: '创建时间', slot: 'createTime', width: 150 },
    { title: '操作', slot: 'operation', width: 150, align: 'center' }
  ]
  tableDate = [
    {
      id: 2,
      name: '2019奔驰影院2019奔驰影院2019奔驰影院2019奔驰影院2019奔驰影院2019奔驰影院',
      stauts: 2,
      specification: '广告片规格',
      videoId: '广告片ID',
      videoName: '广告片名称/ID',
      cycle: '投放周期',
      freezeAmount: '冻结金额(元）',
      settlementStatus: '结算状态',
      settlementAmount: '广告花费(元）',
      createTime: 333333333,
      beginDate: 3333333333,
      endDate: 333333333333
    },
    {
      id: 1,
      name: '广告计划名称',
      stauts: 5,
      specification: '广告片规格',
      videoId: '广告片ID',
      videoName: '广告片名称/ID',
      cycle: '投放周期',
      freezeAmount: '冻结金额(元）',
      settlementStatus: '结算状态',
      settlementAmount: '广告花费(元）',
      createTime: 3333333333333,
      beginDate: 33333333333333,
      endDate: 333333333333
    },
    {
      id: 3,
      name: '2019奔驰影院2019奔驰影院2019奔驰影院2019奔驰影院2019奔驰影院2019奔驰影院',
      stauts: 2,
      specification: '广告片规格',
      videoId: '广告片ID',
      videoName: '广告片名称/ID',
      cycle: '投放周期',
      freezeAmount: '冻结金额(元）',
      settlementStatus: '结算状态',
      settlementAmount: '广告花费(元）',
      createTime: 333333333,
      beginDate: 3333333333,
      endDate: 333333333333
    },
  ]
  get formatTimes() {
    return formatTimes
  }
  get formatYell() {
    return formatYell
  }
  async mounted() {
    this.tableList()
  }

  async relevanceAdv(id: any) {
    this.relevanVis.visible = true
  }
  async tableList() {
    const { data } = await planList({ ...this.form, ...this.pageList })
    this.data = data
    this.totalCount = data.totalCount
  }
  planDefault(id: any, status: any) {
    this.$router.push({ name: 'pop-plan-default', params: {id, status}})
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
  span:last-child {
    color: @c-link;
  }
}
</style>



