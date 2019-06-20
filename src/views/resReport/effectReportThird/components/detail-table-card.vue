<template>
  <ReportPane :title="title">
    <template slot="more">
      <a @click="exportData"
         class="more-link"
         href="javascript:;"><span class="downloadIcon"></span>下载表格</a>
    </template>
    <div class="table-box">
      <Table stripe
              ref="table"
             :columns="data.columns"
             :data="data.data"></Table>
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

  exportData() {
    (this.$refs.table as any).exportCsv({
        filename: 'filename'
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.downloadIcon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url('../assets/download.png') no-repeat center center;
  vertical-align: sub;
  background-size: 100% 100%;
  margin-right: 10px;
}
.table-box {
  border-radius: 5px;
  padding: 25px 0;
  min-height: 445px;
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
