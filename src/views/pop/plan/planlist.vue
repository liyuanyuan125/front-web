<template>
  <div class>
    <h3 class="plan-title">
      <span class="adver-tiele">广告计划</span>
      <Button
        type="primary"
        :to="{name: 'pop-planlist-add'}"
        class="btn-new"
        v-auth="'promotion.ad-plan#create'"
      >
        <Icon type="ios-add" size="27"/>新建广告计划
      </Button>
    </h3>

    <Form :model="form" class="table-box">
      <Row :gutter="20">
        <Col class="flex-box" :span="6" :offset="3">
          <div class="flex-box search-border-left" style="width: 100%">
            <Input v-model="form.name" placeholder="请输入ID/名称进行搜索"/>
            <Button type="primary" class="bth-search" @click="searchList">
              <Icon type="ios-search" size="22"/>
            </Button>
          </div>
        </Col>

        <Col :span="5">
          <Select v-model="form.status" clearable placeholder="请选择广告计划状态">
            <Option
              v-for="item in data.statusList"
              v-if="item.key != 0"
              :key="item.key"
              :value="item.key"
            >{{item.text}}</Option>
          </Select>
        </Col>

        <Col :span="5">
          <Select v-model="form.settlementStatus" clearable placeholder="请选择结算状态">
            <Option
              v-for="item in data.settlementStatusList"
              v-if="item.key != 0"
              :key="item.key"
              :value="item.key"
            >{{item.text}}</Option>
          </Select>
        </Col>
      </Row>
    </Form>

    <div>
      <Table stripe :columns="columns" :data="tableDate" ref="selection">
        <template ref="title" slot="header">
          <div v-auth="'promotion.ad-plan#delete'">
            <div class="top">
              <div>
                <span @click="checkAll">
                  <Checkbox v-model="checkboxall">全选</Checkbox>
                </span>
                <span class="query-all" @click="deleteList">批量删除</span>
              </div>
              <span>当前共有广告计划{{totalCount}}条</span>
            </div>
          </div>
        </template>

        <template slot="msg" slot-scope="{row, index}">
          <div class="msg-box">
            <p>
              <Checkbox v-model="checks[row.id]" :key="index"></Checkbox>
              ID: {{row.id}}
            </p>
            <div>
              <img :src="row.videoLogo ? row.videoLogo : defaultImg" :onerror="defaultImg" width="90px" height="90px">
              <div>
                <h3>{{row.name}}</h3>
                <span>{{row.videoName}}&nbsp;&nbsp;{{row.customerName}}&nbsp;&nbsp;{{row.specification||0 }}s</span>
                <p v-if="!row.videoId" @click="relevanceAdv(row, 1)">关联广告片</p>
                <p v-if="row.videoId" @click="relevanceAdv(row, 2)">修改广告片</p>
              </div>
            </div>
          </div>
        </template>
        <template slot="date" slot-scope="{row}">
          <p>
            <span>{{formatDate(row.beginDate)}}</span>至
            <span>{{formatDate(row.endDate)}}</span>
          </p>
          <p style="margin-top: 10px">{{days(row.beginDate, row.endDate)}}天</p>
        </template>

        <template slot="settlementStatus" slot-scope="{row}">
          <div class="table-empty">
            <p v-if="row.freezeAmount">冻结金额：{{row.freezeAmount}}</p>
            <p v-if="row.settlementStatus">广告花费：{{row.settlementAmount}}</p>
            <p v-if="row.refundAmount">退款金额：{{row.refundAmount}}</p>
          </div>
        </template>

        <template slot="status" slot-scope="{row}">
          <p
            class="red"
            style="margin-top: 10px"
          >{{data.statusList.filter((it) => it.key == row.status)[0].text}}</p>
        </template>

        <template slot="operation" slot-scope="{row}">
          <div class="operation-btn">
            <div v-if="row.status == 1 || row.status == 2">
              <p @click="plandetail(row.id)">详情</p>
              <p @click="plandEdit(row.id)">编辑</p>
              <p @click="plandel(row.id)">删除</p>
            </div>
            <div v-if="row.status == 3 || row.status == 4">
              <span class="edit-btn" v-if="row.status == 3" @click="sure(row.id)">确认方案</span>
              <span class="edit-btn" v-if="row.status == 4" @click="pay(row.companyId, row.freezeAmount, row.id)">立即缴费</span>
              <div class="adver-edit">
                <p @click="plandetail(row.id)">详情</p>
                <p v-if="row.status == 3" @click="plandEdit(row.id)">编辑</p>
                <p @click="plandel(row.id)">删除</p>
              </div>
            </div>
            <div v-if="(row.status > 4 && row.status < 8) || row.status == 12 ">
              <div class="adver-edit">
                <p @click="plandetail(row.id)">详情</p>
              </div>
            </div>
            <div v-if="row.status >= 8 && row.status < 12 ">
              <span class="edit-btn" @click="findId(row.id)">查看效果报表</span>
              <div class="adver-edit">
                <p @click="plandetail(row.id)">详情</p>
              </div>
            </div>
          </div>
        </template>
      </Table>

      <pagination :pageList="pageList" :total="totalCount" @uplist="uplist"></pagination>
    </div>
    <Sure ref="Sure" @uplist="uplist"/>
    <Pay ref="Pay" @uplist="uplist"/>
    <relevanceDlg v-model="relevanVis" v-if="relevanVis.visible" @submitRelevance="submitRelevance"></relevanceDlg>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, toast } from '@/ui/modal'
import { formatTimes, formatYell, formatNumber } from '@/util/validateRules'
import {
  planList,
  delCheckPlanList,
  planCancel,
  planPayment,
  orienteering
} from '@/api/plan'
import pagination from '@/components/page.vue'
import Sure from './planlistmodel/sure.vue'
import Pay from './planlistmodel/pay.vue'
import moment from 'moment'
import relevanceDlg from './planlistmodel/relevance.vue'
import { clean } from '@/fn/object'

const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    Sure,
    Pay,
    pagination,
    relevanceDlg,
  }
})
export default class Plan extends ViewBase {
  form: any = {
    status: '',
    settlementStatus: '',
    name: ''
  }
  checkId: any = []
  pageList = {
    pageIndex: 1,
    pageSize: 10
  }
  relevanVis: any = {
    visible: false,
    title: '',
    item: ''
  }
  checks: any = {}
  totalCount = 0
  data: any = []
  selectIds = []
  checkboxall = false

  columns = [
    { title: '广告', key: 'id', minWidth: 170, slot: 'msg' },
    { title: '投放周期', slot: 'date' },
    { title: '款项清算', slot: 'settlementStatus', align: 'center' },
    { title: '计划状态', slot: 'status' },
    { title: '操作', slot: 'operation', width: 150, align: 'left' }
  ]
  tableDate = []
  single = false

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

  get defaultImg() {
    return 'this.src="' + require('./assets/error.png') + '"'
  }

  async tableList() {
    const { data } = await planList(
      clean({
        ...this.form,
        ...this.pageList
      })
    )
    this.data = data
    // for (const item of data.items) {
    //   if (item.status == 1 || item.status == 9 || item.status == 10) {
    //     item._checked = false
    //   } else {
    //     item._disabled = true
    //   }
    // }
    this.tableDate = data.items
    this.totalCount = data.totalCount
  }

  submitRelevance() {
    this.tableList()
  }

  days(begin: any, end: any) {
    const time =
      new Date(this.formatDate(end)).getTime() -
      new Date(this.formatDate(begin)).getTime()
    return time / (3600 * 24 * 1000) + 1
  }

  findId(id: any) {
    this.$router.push({ name: 'effect-report', params: {
      id
    }})
  }

  formatDate(data: any) {
    return data
      ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(
          data + ''
        ).substr(6, 2)}`
      : '暂无'
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
      this.$router.push({ name: 'pop-planlist-default', params: { id } })
    } else {
      this.$router.push({ name: 'pop-planlist-defaultpayment', params: { id } })
    }
  }

  planEdit(id: any) {
    this.$router.push({ name: 'pop-planlist-add', params: { id } })
  }

  checkAll() {
    this.$nextTick(() => {
      const id = this.tableDate.map((it: any) => it.id)
      const idO: any = {}
      if (this.checkboxall) {
        id.forEach((it: any) => {
          idO[it] = false
        })
      } else {
        id.forEach((it: any) => {
          idO[it] = true
        })
      }
      this.checks = {
        ...this.checks,
        ...idO
      }
    })
  }

  async planCancel(val: any, id: any) {
    await confirm(`是否取消广告计划：${val}`, { title: '取消广告计划' })
    try {
      await planCancel(id)
      this.tableList()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  plandetail(id: any) {
    this.$router.push({
      name: 'pop-planlist-default',
      params: { id }
    })
  }

  plandEdit(id: any) {
    this.$router.push({
      name: 'pop-planlist-edit',
      params: { id: '0', setid: id }
    })
  }

  async plandel(id: any) {
    try {
      await delCheckPlanList(id)
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
        item: {
          videoId: ''
        },
        id: val.id
      }
    } else {
      this.relevanVis = {
        visible: true,
        title: '修改广告片',
        item: val,
        id: val.id
      }
    }
  }

  async deleteList() {
    if (this.checkId.length) {
      const ids: any = this.selectIds.map((item: any) => item.id) || []
      await confirm('您确定要删除当前信息吗？')
      try {
        await delCheckPlanList(this.checkId.join(','))
        this.tableList()
      } catch (ex) {
        this.handleError(ex)
      }
    } else {
      this.showWaring('请选择你要删除的信息?')
    }
  }

  queryStatus(id: any) {
    const items = this.data.statusList
      ? this.data.statusList.filter((item: any) => item.key == id)
      : null
    if (items) {
      return items[0].text
    }
  }

  pay(id: any, freezeAmount: any, ids: any) {
    this.$nextTick(() => {
      (this.$refs as any).Pay.init(id, freezeAmount, ids)
    })
  }

  sure(id: any) {
    this.$nextTick(() => {
      (this.$refs as any).Sure.init(id)
    })
  }

  searchList() {
    this.pageList.pageIndex = 1
    this.tableList()
  }

  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }

  @Watch('form', { deep: true })
  watchForm(val: any) {
    this.tableList()
  }

  @Watch('checks', { deep: true })
  watchChecks(val: any) {
    this.checkId = []
    let id = this.tableDate.map((it: any) => it.id)
    for (const i in val) {
      if (val[i]) {
        this.checkId.push(i)
      }
    }
    this.checkId.forEach((it: any) => {
      id = id.filter((item: any) => item != it)
    })
    this.checkboxall = id.length > 0 ? false : true
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/common.less';

.btn-new {
  width: 193px;
  height: 48px;
  border-radius: 24px;
  line-height: 44px;
  font-size: 18px;
  padding: 0;
  float: right;
  .button-style(#00202d, #f9d85e);
}
.red {
  color: #5f961f;
}
.table-box {
  .bth-search {
    border-radius: 0 5px 5px 0;
    .button-style(#fff, #00202d);
  }
  /deep/ .ivu-select-selection,
  /deep/ .ivu-input-wrapper,
  /deep/ .ivu-select,
  /deep/ .ivu-input,
  /deep/ .ivu-select-input {
    background: rgba(255, 255, 255, 0.4);
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-radius: 5px;
    &::placeholder {
      font-size: 14px;
      color: #00202d;
    }
  }
  /deep/ .ivu-input,
  /deep/ .ivu-input-wrapper {
    border-radius: 5px 0 0 5px;
  }
  /deep/ .ivu-select-selection {
    /deep/ .ivu-icon {
      padding-right: 5px;
    }
  }
  /deep/ .ivu-select-placeholder,
  /deep/ .ivu-select-selected-value {
    font-size: 14px;
    color: #00202d;
    line-height: 40px;
  }
  /deep/ .ivu-input,
  /deep/ .ivu-select-input {
    color: #00202d;
    line-height: 40px;
    height: 40px;
  }
  /deep/ .ivu-select-arrow {
    right: 0;
    color: #00202d;
  }
}
.msg-box {
  > p {
    margin-bottom: 20px;
    color: #00202d;
    font-size: 14px;
  }
  > div {
    display: flex;
    > div {
      margin-left: 20px;
      h3 {
        font-size: 16px;
        width: 150px;
        overflow: hidden;
        font-weight: 500;
        color: rgba(0, 32, 45, 1);
        line-height: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 10px;
      }
      p {
        display: block;
        width: 105px;
        height: 28px;
        margin-top: 10px;
        text-align: center;
        line-height: 28px;
        background: rgba(0, 32, 45, 1);
        border-radius: 14px;
        cursor: pointer;
        .button-style(#fff, #00202d);
      }
    }
  }
}
.plan-title {
  margin: 0 20px 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #fff;
  .adver-tiele {
    color: #fff;
    font-size: 24px;
    font-weight: normal;
  }
}
/deep/ .ivu-table-wrapper {
  border-radius: 5px;
  min-height: 280px;
  position: relative;
  /deep/ .ivu-table-header th {
    height: 60px;
    background: #000;
    color: #fff;
    line-height: 60px;
    span {
      font-size: 14px;
    }
  }
  /deep/ .ivu-table-column-center,
  /deep/ .ivu-table-column-left {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-row {
    background: rgba(255, 255, 255, 0.8);
    /deep/ td {
      height: 200px;
      color: #00202d;
      background: rgba(0, 0, 0, 0);
    }
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr:nth-child(2n - 1) td {
    background: rgba(255, 255, 255, 0.5);
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-body .ivu-table-column-center,
  /deep/ .ivu-table-body .ivu-table-column-left {
    span {
      color: #444;
      font-size: 14px;
    }
    .edit-btn {
      border-radius: 5px;
      padding: 6px 12px;
      .button-style(#fff, #00202d);
    }
  }
  .ivu-table-title {
    position: absolute;
    top: 60px;
    height: 80px;
    left: 0;
    right: 1px;
    border: none;
    background: rgba(255, 255, 255, 0.7);
    .top {
      display: flex;
      justify-content: space-between;
      margin-left: 18px;
      margin-right: 50px;
      line-height: 80px;
      font-size: 14px;
      .query-all {
        margin-left: 20px;
        padding: 7px 14px;
        border-radius: 4px;
        cursor: pointer;
        .button-style(rgba(0, 32, 45, 1), #fff);
      }
      p {
        cursor: pointer;
      }
    }
    .check-button {
      position: relative;
      height: 130px;
      overflow: auto;
      background: #f8f8f9;
      padding: 10px 50px 20px 50px;
      .check-btn {
        position: absolute;
        bottom: 20px;
        right: 20px;
        /deep/ .ivu-btn {
          height: 30px;
          margin-left: 20px;
          font-size: 12px;
        }
      }
    }
  }

  /deep/ .ivu-table-tip {
    margin-top: 79px;
    line-height: 200px;
    /deep/ td {
      background: rgba(255, 255, 255, 0.8);
    }
  }
  .ivu-table-body {
    margin-top: 79px;
  }
  .table-name {
    display: flex;
    padding: 20px 0;
    align-items: center;
    img {
      height: 60px;
      width: 60px;
      border-radius: 50%;
    }
    span {
      margin-left: 10px;
    }
  }
}
.table-empty {
  &:empty::before {
    content: '';
    display: block;
    height: 1px;
    width: 16px;
    margin-left: 44%;
    background: #00202d;
  }
}
.status-wating {
  color: @c-done;
}
.status-over {
  color: @c-fail;
}
/deep/ .search-border-left {
  input {
    border-right: none;
  }
}
.operation-btn {
  text-align: center;
  color: #00202d;
  span {
    cursor: pointer;
    display: inline-block;
    line-height: 22px;
  }
  p {
    cursor: pointer;
    line-height: 24px;
  }
  .adver-edit {
    p {
      display: inline-block;
      margin-left: 5px;
      margin-right: 5px;
      cursor: pointer;
      margin-top: 10px;
    }
  }
}
</style>



