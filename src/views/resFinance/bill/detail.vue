<template>
  <div class="bill-detail">
    <div class="bill-modal-content">
      <div class="title bottom-40">基本信息</div>
      <ul class="flex-box row-items">
        <li class="flex-box"><label>影院名称</label><span>{{items.cinemaName}}</span></li>
        <li class="flex-box"><label>日期</label><span>{{items.year}}-{{items.month}}</span></li>
        <li class="flex-box"><label>曝光人次/人</label><span>{{items.personCount || '-'}}</span></li>
       
      </ul>
       <ul class="flex-box row-items">
        <li class="flex-box"><label>广告片数量</label><span>{{items.videoCount}}</span></li>
         <li class="flex-box"><label>状态</label>
           <span v-for="it in billStatusList" :key="it.key" v-if="it.key == items.billStatus">{{it.text}}</span>
        </li>
        <li class="flex-box"><label>预计结算金额</label><span>{{formatNumber(items.amount)}}</span></li>
      </ul>
    </div>

    <div class="bill-modal-content">
      <div class="title bottom-20">广告片列表</div>
      <Table :columns="column" :data="dataList" disabled-hover>
        <!-- 是否通投 0通投 1-未通投-->
        <template slot="playMonitorTexts" slot-scope="{row}">
          <span v-if="row.playMonitorStatus == 4" class="status-error">{{row.playMonitorTexts}}</span>
          <span v-else class="status-pass">{{row.playMonitorTexts}}</span>
        </template>
        <template slot="movieName" slot-scope="{row: {movieName, movieCustom}}">
          <span v-if="movieCustom == 0">通投</span>
          <span v-else>{{movieName}}</span>
        </template>

      </Table>

      <Page
      :total="total"
      v-if="total>0"
      class="page-cover"
      :current="pageIndex"
      :page-size="pageSize"
      show-total
      @on-change="handlepageChange"
      @on-page-size-change="handlepageChange"
    />
    </div>

    <div class="bill-modal-content">
      <div class="title bottom-20">操作日志</div>
      <Table :columns="columnLog" :data="dataLog" disabled-hover></Table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { confirm, toast, info } from '@/ui/modal'
import {intDate, readableThousands, textList} from '@/util/dealData'
import { formatNumber } from '@/util/validateRules'
import { itemList, itemListbill } from '@/api/bill'
const format = 'YYYY-MM-DD HH:mm:ss'

@Component
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0}) id!: number

  pageIndex = 1
  pageSize = 20
  total = 0

  items: any = {}
  billStatusList: any[] = []

  formatNumber = formatNumber

  column = [
    { title: '广告片名称', key: 'videoName', minWidth: 120 },
    { title: '影片名称', slot: 'movieName', minWidth: 150 },
    { title: '投放时长', key: 'specification', minWidth: 100 },
    { title: '执行开始时间', key: 'beginDate', minWidth: 160  },
    { title: '执行完成时间', key: 'endDate', minWidth: 160  },
    { title: '曝光人次', key: 'personCount', minWidth: 150  },
    { title: '金额(元)', key: 'amount', minWidth: 100  },
    { title: '监播文件', slot: 'playMonitorTexts', minWidth: 100 },
    { title: '是否结算', key: 'status', minWidth: 100  },
  ]
  dataList = []

  columnLog = [
    { title: '操作时间', key: 'createTime' },
    { title: '操作人', key: 'createName' },
    { title: '操作日志', key: 'describe' },
  ]
  dataLog = []

  mounted() {
    this.list()
    this.billDetail()
  }

  async list() {
    try {
      const { data: {
        item, billStatusList
      } } = await itemList(this.id)
      this.items = item || {}
      this.billStatusList = billStatusList || []
      this.dataLog = (item.resourceBillLogs || []).map( (it: any) => {
        return {
          ...it,
          createTime: moment().format(format)
        }
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async billDetail() {
    try {
      const { data: {
        totalCount, items, statusList, playMonitorStatusList} } = await itemListbill(this.id, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      this.dataList = (items || []).map((it: any) => {
        return {
          ...it,
          specification: it.specification ? it.specification + 's' : '0s',
          beginDate: intDate(it.beginDate),
          endDate: intDate(it.endDate),
          personCount: readableThousands(it.personCount),
          amount: formatNumber(it.amount),
          playMonitorTexts: textList(playMonitorStatusList, [it.playMonitorStatus])[0],
          status: textList(statusList, [it.status])[0]
        }
      })
      this.total = totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handlepageChange(size: any) {
    this.pageIndex = size
    this.list()
  }
}
</script>

<style lang="less" scoped>
.status-pass {
  color: #5f961f;
}
.status-error {
  color: #e86267;
}
.bottom-40 {
  padding-bottom: 40px;
}
.bottom-20 {
  padding-bottom: 20px;
}
.bill-detail {
  padding: 54px 56px 38px 38px;
}
.bill-modal-content {
  background: rgba(255, 255, 255, .6);
  border-radius: 5px;
  padding: 30px 40px 10px;
  margin-bottom: 30px;
  .title {
    font-size: 24px;
    color: #00202d;
  }
}
.row-items {
  font-size: 16px;
  color: #00202d;
  li {
    flex: 1;
    padding-bottom: 30px;
  }
  label {
    display: block;
    width: 116px;
    color: rgba(0, 32, 45, .7);
  }
}
/deep/ .ivu-table-wrapper {
  margin: 0;
}
/deep/ .ivu-table {
  background: none;
}
/deep/ .ivu-table th,
/deep/ .ivu-table-header {
  background: #fff;
  height: 40px;
  color: rgba(0, 32, 45, 1);
  font-size: 15px;
  font-weight: 400;
}

/deep/ .ivu-table td {
  background: none;
  transition: background-color 0.2s ease-in-out;
  font-size: 13px;
  font-weight: 400;
  color: rgba(0, 32, 45, 1);
  height: 60px;
}

// 分页样式
.page-cover {
  text-align: center;
  margin: 30px 0 40px;
}
/deep/ .ivu-page-prev {
  border: 0;
  background: none;
}
/deep/ .ivu-page-next {
  border: 0;
  background: none;
}
/deep/ .ivu-page-item-active {
  border-color: #eee;
  background: #00202d !important;
  border-radius: 50%;
  color: #fff;
  width: 30px;
  height: 30px;
}
/deep/ .ivu-page-item-active:hover a {
  color: #fff;
}
/deep/ .ivu-page-item-active a {
  color: #fff;
}
/deep/ .ivu-page-item {
  border: 0;
  display: inline-block;
  vertical-align: middle;
  background: rgba(255, 255, 255, 0);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-right: 4px;
  text-align: center;
  list-style: none;
  user-select: none;
  cursor: pointer;
  font-weight: 500;
  transition: border 0.2s ease-in-out, color 0.2s ease-in-out;
}
/deep/ .ivu-form .ivu-form-item-label, /deep/ .ivu-icon-ios-arrow-forward::before, /deep/ .ivu-icon-ios-arrow-back::before {
  color: #00202d;
}
/deep/ .ivu-page-total {
  color: #00202d;
}
</style>
