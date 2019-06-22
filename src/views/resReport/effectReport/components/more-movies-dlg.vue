<template>
  <Modal v-model='showDlg'
         :transfer='false'
         :width='770'
         :closable='false'
         :mask-closable='false'
         :styles="{top: '10%'}">
    <div class="title">
      <h3>影片数据</h3>
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
      <!-- <Page :total="totalCount"
            class="info-page"
            :current="form.pageIndex"
            :page-size="form.pageSize"
            :page-size-opts="[4, 8, 16, 24]"
            show-total
            show-sizer
            show-elevator
            @on-change="sizeChangeHandle"
            @on-page-size-change="currentChangeHandle" /> -->
    </div>
    <div slot="footer" style="display: none"></div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinemasReport } from '@/api/effectReport'

@Component({
  components: {}
})
export default class MoreMoviesDlg extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Number, default: 0 }) moviesTotal!: number
  @Prop({ type: Array, default: () => ([]) }) data!: any[]

  showDlg = false

  form: any = {
    pageIndex: 1,
    pageSize: 10
  }

  totalCount: number = 0

  columns: any[] = [
    { title: '影片', key: 'name', align: 'center' },
    {
      title: '曝光人次',
      key: 'viewCount', // 曝光人次
      align: 'center'
    },
    {
      title: '曝光人次占比',
      key: 'viewRate', // 曝光人次占比
      align: 'center'
    },
    {
      title: '曝光场次',
      key: 'scheduleCount', // 曝光场次
      align: 'center'
    }
  ]

  // data: any[] = [{
  //   name: '2019-05-08',
  //   viewCount: '113,456',
  //   viewRate: '8,789',
  //   scheduleCount: '¥ 6,345.23'
  // }]

  loading = false

  async init(type: any) {
    (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: hidden'
    // this.loading = true
    // this.search()
    this.initFn()
  }

  initFn() {
    this.showDlg = true
  }

  async search() {
    // const id = (this.id).toString() || ''
    // try {
    //   const {
    //     data: { items, totalCount }
    //   } = await cinemasReport(id, {...this.form})
    //   this.data = items.map((it: any) => {
    //     return {
    //       name: it.name,
    //       viewCount: it.viewCount,
    //       scheduleCount: it.scheduleCount,
    //       cost: it.cost
    //     }
    //   })
    //   this.showDlg = true
    // } catch (ex) {
    //   this.handleError(ex)
    // }
  }

  exportData() {
    (this.$refs.table as any).exportCsv({
        filename: '影片数据',
        // nxd todo
        // original: false,
        // data: [{
        // }]
    })
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.form.pageIndex = val
    // this.search()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.form.pageSize = val
    // this.search()
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
    right: -20px;
    top: -20px;
    display: block;
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(209, 216, 219, 1);
    &::before {
      content: '×';
      font-size: 34px;
      line-height: 36px;
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
