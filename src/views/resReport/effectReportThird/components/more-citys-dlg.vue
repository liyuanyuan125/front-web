<template>
  <Modal v-model='showDlg'
         :transfer='false'
         :width='770'
         :closable='false'
         :mask-closable='false'
         :styles="{top: '10%'}">
    <div class="title">
      <h3>城市数据</h3>
      <i @click="cancel"></i>
    </div>
    <div class="box-inner">
      <div style="text-align: right; padding: 15px 0;">
        <a @click="exportData"
         class="download-link"
         href="javascript:;"><span class="downloadIcon"></span>下载表格</a>
      </div>
      <Table stripe
             ref="table"
             :columns="columns"
             :data="data"></Table>
      <Page :total="totalCount"
            class="info-page"
            :current="form.pageIndex"
            :page-size="form.pageSize"
            :page-size-opts="[4, 8, 16, 24]"
            show-total
            show-sizer
            show-elevator
            @on-change="sizeChangeHandle"
            @on-page-size-change="currentChangeHandle" />
    </div>
    <div slot="footer" style="display: none"></div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { citiesReport } from '@/api/effectReportThird'

@Component({
  components: {}
})
export default class MoreCinemasDlg extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  showDlg = false

  totalCount = 0

  form: any = {
    pageIndex: 1,
    pageSize: 10
  }

  columns: any[] = [
    { title: '城市', key: 'name', align: 'center' },
    {
      title: '曝光人次',
      key: 'viewCount',
      align: 'center'
    },
    {
      title: '曝光场次',
      key: 'scheduleCount',
      align: 'center'
    },
    // {
    //   title: '支出金额',
    //   key: 'cost',
    //   align: 'center'
    // }
  ]

  data: any[] = []

  loading = false

  async init(type: any) {
    (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: hidden'
    this.loading = true
    this.search()
  }

  async search() {
    const id = (this.id).toString() || ''
    try {
      const {
        data
      } = await citiesReport(id, {...this.form})
      const items = data.items || null
      const totalCount = data.totalCount || null

      if (items && items.length > 0 && totalCount && totalCount > 0) {
        this.data = items.map((it: any) => {
          return {
            name: it.name,
            viewCount: it.viewCount,
            scheduleCount: it.scheduleCount,
            cost: it.cost
          }
        })
      }
      this.totalCount = totalCount
      this.showDlg = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  exportData() {
    (this.$refs.table as any).exportCsv({
        filename: '城市数据',
        // nxd todo
        // original: false,
        // data: [{
        // }]
    })
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.form.pageIndex = val
    this.search()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.form.pageSize = val
    this.search()
  }

  cancel() {
    (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: auto'
    this.showDlg = false
  }

  async open() {
    try {
      this.cancel()
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.title {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #00202d;
  i {
    position: absolute;
    box-sizing: content-box;
    right: -20px;
    top: -20px;
    display: inline-block;
    vertical-align: middle;
    width: 40px;
    height: 40px;
    line-height: 40px;
    background: #fff;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
    border: 2px solid rgba(209, 216, 219, 1);
    &::before {
      content: '×';
      font-size: 35px;
      line-height: 100%;
      text-align: center;
    }
  }
}
/deep/ .ivu-table-wrapper {
  margin-top: 10px;
}
.box-inner {
  /deep/ .ivu-table-wrapper {
    padding: 0;
    margin: 0;
  }
  .download-link {
    color: #00202d;
    .downloadIcon {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url('../assets/download.png') no-repeat center center;
      vertical-align: sub;
      background-size: 100% 100%;
      margin-right: 10px;
    }
  }
  .info-page {
    margin: 25px 0;
  }
}
//底部页码
.info-page {
  text-align: center;
  /deep/ .ivu-page-prev,
  /deep/ .ivu-page-next,
  /deep/ .ivu-page-item,
  /deep/ .ivu-page-item-jump-prev,
  /deep/ .ivu-page-item-jump-next {
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 20px;
    background: none;
    border: none;
    color: #00b6cc;
  }
  /deep/ .ivu-page-item-active a,
  /deep/ .ivu-page-item-active:hover a {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    line-height: 20px;
    text-align: center;
    background: #00b6cc;
    color: #fff;
  }
}
</style>
