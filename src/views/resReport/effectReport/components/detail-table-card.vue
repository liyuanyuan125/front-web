<template>
  <ReportPane :title="title"
              :moreFn="moreFnHandle">
    <template slot="more">
      <a @click="moreFnHandle"
         class="more-link"
         href="javascript:;"><span class="downloadIcon"></span>下载表格</a>
    </template>
    <div class="table-box">
      <Table stripe
             :columns="columns"
             :data="tabledata"></Table>
    </div>
  </ReportPane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import numAdd from './number.vue'
import ReportPane from './report-pane.vue'

@Component({
  components: {
    numAdd,
    ReportPane
  }
})
export default class DetailTableCard extends Vue {
  @Prop({ type: Object, default: () => ({}) }) data!: any

  title: string = '数据明细'

  columns = [
    { title: '时间', key: 'time', align: 'center' },
    {
      title: '曝光人次',
      key: 'personTime',
      align: 'center'
    },
    {
      title: '曝光场次',
      key: 'filmTime',
      align: 'center'
    },
    {
      title: '支出金额',
      key: 'amount',
      align: 'center'
    }
  ]

  tabledata: any = [
    {
      time: '2019-05-08',
      personTime: '113,456',
      filmTime: '8,789',
      amount: '¥ 6,345.23'
    },
    {
      time: '2019-05-08',
      personTime: '113,456',
      filmTime: '8,789',
      amount: '¥ 6,345.23'
    },
    {
      time: '2019-05-08',
      personTime: '113,456',
      filmTime: '8,789',
      amount: '¥ 6,345.23'
    },
    {
      time: '2019-05-08',
      personTime: '113,456',
      filmTime: '8,789',
      amount: '¥ 6,345.23'
    },
    {
      time: '2019-05-08',
      personTime: '113,456',
      filmTime: '8,789',
      amount: '¥ 6,345.23'
    },
    {
      time: '2019-05-08',
      personTime: '113,456',
      filmTime: '8,789',
      amount: '¥ 6,345.23'
    },
    {
      time: '2019-05-08',
      personTime: '113,456',
      filmTime: '8,789',
      amount: '¥ 6,345.23'
    }
  ]

  moreFnHandle() {
    // console.log('下载表格！')
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.downloadIcon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url('../assets/icon-1.png') no-repeat center center;
  vertical-align: sub;
  background-size: 100% 100%;
  margin-right: 10px;
}
.table-box {
  margin-bottom: 20px;
  background: rgba(0, 32, 45, 0.8);
  border-radius: 5px;
  padding: 25px 0;
  /deep/ .ivu-table th,
  /deep/ .ivu-table-header {
    background: rgba(0, 32, 45, 0.8);
    height: 40px;
    line-height: 40px;
    color: rgba(179, 188, 192, 1);
    font-size: 15px;
    font-weight: 400;
  }
  /deep/ .ivu-table {
    background: none;
  }
  /deep/ .ivu-table td {
    background: none;
    transition: background-color 0.2s ease-in-out;
    font-size: 13px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #0e3240;
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
    background: rgba(32, 67, 80, 1);
  }
  /deep/ .ivu-table-body {
    background: none;
  }
  /deep/ .ivu-table-tip {
    overflow-x: auto;
    overflow-y: hidden;
    background: transparent;
  }
  /deep/ .ivu-table-wrapper {
    margin: 0;
    border: none;
  }
  /deep/.ivu-table-stripe .ivu-table-body tr:nth-child(2n) td,
  .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td {
    background: none;
  }
  /deep/.ivu-table-stripe .ivu-table-body tr:last-child td {
    border-bottom: 0;
  }
}
</style>
