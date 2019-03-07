<template>
  <div class="home-bg">
    <h3 class="userTitle">
      <span class="nav-top-title">广告计划</span>

      <Button type="primary" :to="{name: 'pop-planlist-add'}" class="btn-new"
        v-auth="'promotion.ad-plan#create'">
        <Icon type="ios-add" size="27"/>新建广告计划
      </Button>
    </h3>

    <Form :model="form" class="formInline">
      <Row type="flex" justify="space-between">

        <Col span="5">
          <Select v-model="form.status" style="width: 200px" clearable placeholder="请选择广告计划状态">
            <Option v-for="item in data.statusList" v-if="item.key != 0" :key="item.key" :value="item.key">{{item.text}}</Option>
          </Select>
        </Col>

        <Col span="4">
          <Select v-model="form.settlementStatus" style="width: 150px" clearable placeholder="请选择结算状态">
            <Option v-for="item in data.settlementStatusList"  v-if="item.key != 0"   :key="item.key"  :value="item.key" >{{item.text}}</Option>
          </Select>
        </Col>
        
        <Col span="12" class="flex-box">
          <Select v-model="form.level" style="width: 200px" clearable placeholder="请选择广告层级">
            <Option v-for="item in data.levelTypeList"  v-if="item.key != 0"
              :key="item.key" :value="item.key" >{{item.text}}</Option>
          </Select>
          <div class="flex-box search-border-left">
            <Input v-model="form.query"  placeholder="请输入ID/名称进行搜索"/>
            <Button type="primary" class="bth-search" @click="searchList">
              <Icon type="ios-search" size="22"/>
            </Button>
          </div>
        </Col>
      </Row>
    </Form>

    <Table stripe :columns="columns" :data="tableDate" ref="selection"  @on-selection-change="singleSelect"  @on-select-all="selectAll" >
      <template slot="status" slot-scope="{row, index}">
        <span v-if="row.status == 4 || row.status == 3" class="status-over">{{queryStatus(row.status)}}</span>
        <span v-else-if="row.status == 6 || row.status == 7" class="status-wating">{{queryStatus(row.status)}}</span>
        <span v-else>{{queryStatus(row.status)}}</span>
      </template>

      <template slot="videoName" slot-scope="{row, index}">
        <span>{{row.videoName || '待关联'}}</span>
      </template>

      <template slot="beginDate" slot-scope="{row, index}">
        <span>{{formatYell(row.beginDate)}}-{{formatYell(row.endDate)}}</span>
      </template>

      <template slot="specification" slot-scope="{row, index}">
        <span v-if="row.specification">{{row.specification}}s</span>
        <span v-else>/</span>
      </template>

      <template slot="settlementStatus" slot-scope="{row, index}">
        <!-- <span>{{querySettlementList(row.settlementStatus)}}</span> -->
        <span v-for="item in data.settlementStatusList" v-if="item.key == row.settlementStatus">{{item.text}}</span>
      </template>

      <template slot="operation" slot-scope="{row, index}">
        <div  class="operation-btn">
          <p>
            <a class="table-action-btn" @click="planDefault(row.id, row.status)"
              v-auth="'promotion.ad-plan#view'">查看</a>
            <a v-if="row.status == 1 || row.status == 2 || row.status == 10" class="table-action-btn" @click="planEdit(row.id)"
              v-auth="'promotion.ad-plan#edit'">编辑</a>
            <a v-if="row.status == 1 || row.status == 2 || row.status ==  4" class="table-action-btn" @click="planCancel(row.name, row.id)"
              v-auth="'promotion.ad-plan#cancel'">取消</a>
            <a v-if="row.status ==  4" class="table-action-btn" @click="handlePayment(row)"
              v-auth="'promotion.ad-plan#pay'">支付</a>
          </p>
          <p v-if="row.status == 1 || row.status == 2 || row.status ==  4 || row.status ==  5">
            <a v-if="!row.videoId" @click="relevanceAdv(row, 1)"
              v-auth="'promotion.ad-plan#relation'">关联广告片</a>
            <a v-else @click="relevanceAdv(row, 2)"
              v-auth="'promotion.ad-plan#relation'">修改广告片</a>
          </p>
        </div>
      </template>
    </Table>

    <div class="checkAll" v-auth="'promotion.ad-plan#delete'">
      <span @click="handleSelectAll">
        <Checkbox v-model="checkboxAll"></Checkbox>全选
      </span>
      <span @click="deleteList">批量删除广告计划</span>
    </div>

     <pagination v-model="pageList" :total="totalCount" @uplist="uplist"></pagination>
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
import pagination from '@/components/page.vue'

@Component({
  components: {
    relevanceDlg,
    pagination
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

  totalCount = 0
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
          return h('span', {}, '-')
        } else {
          return h('span', {}, row.name)
        }
      }
    },
    { title: '广告计划状态', slot: 'status', minWidth: 120 },
    { title: '广告片规格', slot: 'specification', minWidth: 120 },
    { title: '广告片名称', slot: 'videoName', minWidth: 150 },
    { title: '投放排期', slot: 'beginDate', minWidth: 170 },
    // { title: '投放周期', key: 'cycle', minWidth: 130 },
    // { title: '冻结金额(元）', slot: 'freezeAmount', width: 150 },
    { title: '结算状态', slot: 'settlementStatus', width: 90 },
    // { title: '广告花费(元）', key: 'settlementAmount', width: 150 },
    // { title: '创建时间', slot: 'createTime', width: 150 },
    { title: '操作', slot: 'operation', width: 150, align: 'left' }
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
    for (const item of data.items) {
      if (item.status == 1 || item.status == 9 || item.status == 10) {
        item._checked = false
      } else {
        item._disabled = true
      }
    }
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
      this.handleError(ex)
    }
  }

  planDefault(id: any, status: any) {
    if (status == '1' || status == '3' || status == '9' || status == '10') {
      this.$router.push({ name: 'pop-planlist-default', params: {id}})
    } else {
      this.$router.push({ name: 'pop-planlist-defaultpayment', params: {id}})
    }
  }

  planEdit(id: any) {
    this.$router.push({name: 'pop-planlist-add', params: {id}})
  }

  async planCancel(val: any, id: any) {
    await confirm(`是否取消广告计划：${val}`, {title: '取消广告计划'})
    try {
      await planCancel(id)
      this.tableList()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async relevanceAdv(val: any, id: any) {
    if (id == 1) {
      this.relevanVis = {
        visible: true,
        title: '关联广告片',
        item: '',
        id: val.id
      }
    } else {
      this.relevanVis = {
        visible: true,
        title: '编辑广告片',
        item: val,
        id: val.id
      }
    }
  }

  handleSelectAll() {
    const selection = this.$refs.selection as any
    selection.selectAll(!this.checkboxAll)
  }

  async deleteList() {
    if (this.selectIds.length) {
      const ids: any = this.selectIds.map((item: any) => item.id) || []
      await confirm('您确定要删除当前信息吗？')
      try {
        await delCheckPlanList({ ids })
        this.tableList()
      } catch (ex) {
        this.handleError(ex)
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

  // querySettlementList(id: any) {
  //   const list = this.data.settlementStatusList
  //   const items = list ? list.filter( (item: any) => item.key == id) : null
  //   if (items) {
  //      return items[0].text
  //   }
  // }

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

  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/common.less';

.btn-new {
  width: 140px;
  height: 40px;
  line-height: 36px;
  font-size: 14px;
  padding: 0;
}

.status-wating {
  color: @c-done;
}
.status-over {
  color: @c-fail;
}
/deep/ .search-border-left {
  input {
    border-left: none;
  }
}
.operation-btn {
  span {
    cursor: pointer;
    display: inline-block;
    line-height: 22px;
  }
}
</style>



