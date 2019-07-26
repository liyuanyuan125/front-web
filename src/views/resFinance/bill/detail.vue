<template>
  <div class="bill-detail">
    <div class="bill-modal-content">
      <div class="title bottom-40">基本信息</div>
      <ul class="flex-box row-items">
        <li class="flex-box"><label>影院名称</label><span>xxxxxxx</span></li>
        <li class="flex-box"><label>日期</label><span>xxxxxxx</span></li>
        <li class="flex-box"><label>状态</label><span>xxxxxxx</span></li>
      </ul>
       <ul class="flex-box row-items">
        <li class="flex-box"><label>广告片数量</label><span>xxxxxxx</span></li>
        <li class="flex-box"><label>曝光人次</label><span>xxxxxxx</span></li>
        <li class="flex-box"><label>预计结算金额</label><span>xxxxxxx</span></li>
      </ul>
    </div>

    <div class="bill-modal-content">
      <div class="title bottom-20">广告片列表</div>
      <Table :columns="column" :data="dataList" disabled-hover></Table>
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
import { itemList } from '@/api/bill'

@Component
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0}) id!: number

  column = [
    { title: '广告片名称', key: 'name' },
    { title: '影片名称', key: 'movieName' },
    { title: '投放时长', key: 'len' },
    { title: '执行开始时间', key: 'startTime' },
    { title: '执行完成时间', key: 'endTime' },
    { title: '曝光人次/人次', key: 'person' },
    { title: '金额', key: 'monery' },
    { title: '监播文件', key: 'file' },
    { title: '是否结算', key: 'isSetime' },
  ]
  dataList = [
    {
      name: 'xxx',
      movieName: 'xxx',
      len: 14,
      startTime: moment(1547864079326).format('YYYY-MM-DD'),
      endTime: moment(1547864079326).format('YYYY-MM-DD'),
      person: 100,
      monery: 8999999,
      file: 'xxx',
      isSetime: 'xxx',
    }
  ]

  columnLog = [
    { title: '操作时间', key: 'name' },
    { title: '操作人', key: 'movieName' },
    { title: '操作日志', key: 'len' },
  ]
  dataLog = []

  mounted() {
    // this.list()
  }

  async list() {
    try {
      const { data } = await itemList(this.id)
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
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
  line-height: 40px;
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
  height: 50px;
  line-height: 50px;
}

// /deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
//   background: none;
// }

// /deep/ .ivu-table-body {
//   background: none;
// }
</style>
