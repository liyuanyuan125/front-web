<template>
	<div class='page'>
		<div class='t-title'>
			<div class='te-l'>第三方监测</div>
			<div class='te-r' @click='add()'> + 新建第三方监测</div>
		</div>
		<Row class='tiptis'>
			该功能为您提供详细的曝光效果第三方监测报告，您可以将往期（线下）的映前广告投放计划按条件进行录入，在下方即可查看到专业的投放结果数据报告
		</Row>
		<Row>
			<Col :span='7'>
				 <Input v-model='query.name' search enter-button placeholder="标题" @on-change="seachs"/>
			</Col>
		</Row>
		<Table
	      ref="selection"
	      class="table"
	      :columns="columns"
	      :data="list"
	    >
      <template slot-scope="{ row }" slot="name">
            <div style="text-align:center;cursor: pointer;">
              <router-link
            :to="{path:'/reseport/effect-report-third/' + row.id }"
            tag="span"
          >{{row.name}}</router-link>&nbsp;&nbsp;&nbsp;
            </div>
          </template>
	      <template slot-scope="{ row }" slot="action">
            <div style="text-align:center;cursor: pointer;">
              <router-link
		        :to="{path:'/test/addtest/' + row.id }"
		        tag="span"
		      >编辑</router-link>&nbsp;&nbsp;&nbsp;
              <span @click='deletes(row.id)'>删除</span>
            </div>
          </template>
	    </Table>
		<Page
	      :total="totalCount"
	      v-if="totalCount>0"
	      class="btnCenter plan-pages"
	      :current="query.pageIndex"
	      :page-size="query.pageSize"
	      show-total
	      @on-change="handlepageChange"
	      @on-page-size-change="handlePageSize"/>
	</div>
</template>

<script lang="tsx">
import {Component, Watch} from 'vue-property-decorator'
import UploadButton, { SuccessEvent } from '@/views/order/components/UploadButton.vue'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { queryList , addlist , editlist , dels , uplist } from '@/api/testlist'
import { brandsList } from '@/api/shopping'
import { toMap } from '@/fn/array'
import jsxReactToVue from '@/util/jsxReactToVue'
import { formatTimestamp } from '@/util/validateRules'
import WeekDatePicker from '@/components/weekDatePicker'
import { confirm , toast } from '@/ui/modal'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'


@Component({
  components: {

  }
})
export default class Main extends ViewBase {
  query: any = {
    name: '',
    pageIndex: 1,
    pageSize: 20
  }

  totalCount = 0

  list: any = []

  columns = [
    { title: '名称', slot: 'name', align: 'center'},
    {
      title: '曝光人次',
      key: 'viewTotalCount',
      align: 'center'
    },
    {
      title: '包含影院数',
      key: 'deliveryCinemas',
      align: 'center',
      render: (hh: any, { row: { deliveryCinemas } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = deliveryCinemas.length
        return <span>{html}</span>
        /* tslint:enable */
      }
    },
    {
      title: '投放排期',
      key: 'beginDate',
      align: 'center',
      render: (hh: any, { row: { beginDate , endDate } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const a = String(beginDate)
        const b = String(endDate)
        const html = a.slice(0, 4) + '-' + a.slice(4, 6) + '-' +
        a.slice(6, 8) + '~' + b.slice(0, 4) + '-'
        + b.slice(4, 6) + '-' + b.slice(6, 8)
        return <span>{html}</span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      slot: 'action',
      align: 'center'
    }
  ]

  mounted() {
    this.seach()
  }

  seachs() {
    this.query.pageIndex = 1
    this.seach()
  }

  async seach() {
    try {
      const { data } = await queryList(this.query)
      this.list = data.items
      this.totalCount = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    } finally {

    }
  }

  add() {
    this.$router.push({ path : '/test/addtest/0'})
  }

  async deletes(id: any) {
    try {
      await confirm('您确定删除当前信息吗？')
      await dels(id)
      this.$Message.success({
        content: `删除成功`,
      })
      this.seachs()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handlepageChange(size: any) {
    this.query.pageIndex = size
    this.seach()
  }
  handlePageSize(size: any) {
    this.query.pageIndex = size
    this.seach()
  }

  @Watch('query', {deep: true})
  watchQuery() {
    this.seach()
  }
}
</script>
<style lang="less" scoped>
.page {
  padding: 15px;
}
.t-title {
  line-height: 60px;
  height: 60px;
  .te-l {
    width: 20%;
    float: left;
    font-size: 24px;
    color: #fff;
  }
  .te-r {
    float: right;
    width: 193px;
    height: 47px;
    background: rgba(249, 216, 94, 1);
    border-radius: 25px;
    text-align: center;
    line-height: 47px;
    margin-top: 6px;
    font-size: 20px;
    cursor: pointer;
  }
}
.tiptis {
  font-size: 17px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 36px;
  background: rgba(0, 32, 45, 1);
  border-radius: 5px 0 0 0;
  opacity: 0.9;
  padding: 15px;
  margin-top: 20px;
  margin-bottom: 30px;
}
.table {
  margin-top: 16px;
  /deep/ .status-2,
  /deep/ .aptitude-status-3 {
    color: #ed4014;
  }
  /deep/ .aptitude-status-2 {
    color: #19be6b;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
/deep/ .ivu-input {
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px 0 0 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  &::-webkit-input-placeholder {
    color: #00202d;
  }
}
/deep/ .ivu-input-search {
  cursor: pointer;
  padding: 0 10px !important;
  color: #fff !important;
  border-color: #000 !important;
  position: relative;
  z-index: 2;
  height: 40px;
  background: rgba(0, 32, 45, 1) !important;
  border-radius: 5px;
}
/deep/ .ivu-input-search i {
  font-size: 27px;
}
/deep/ .button-text {
  margin: 0 3px;
  display: inline-block;
  text-align: center;
  line-height: 24px;
  width: 100px;
  height: 24px;
  background: rgba(0, 32, 45, 1);
  border-radius: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
/deep/ .btnCenter {
  text-align: center;
  height: 100px;
  margin: 0 20px 0 20px;
  line-height: 100px;
  color: #fff;
}
/deep/ .ivu-page-prev {
  border: 0;
  background: rgba(255, 255, 255, 0);
}
/deep/ .ivu-page-next {
  border: 0;
  background: rgba(255, 255, 255, 0);
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
/deep/ .ivu-table th, /deep/ .ivu-table-header {
  background: rgba(0, 32, 45, 0.8);
  height: 60px;
  line-height: 60px;
  color: rgba(179, 188, 192, 1);
  font-size: 14px;
  font-weight: 400;
}
/deep/ .ivu-table td {
  background: rgba(32, 67, 80, 1);
  transition: background-color 0.2s ease-in-out;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  height: 50px;
  line-height: 50px;
}
/deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table-body {
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table-tip {
  overflow-x: auto;
  overflow-y: hidden;
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-form .ivu-form-item-label, /deep/ .ivu-icon-ios-arrow-forward::before, /deep/ .ivu-icon-ios-arrow-back::before {
  color: #00202d;
}
/deep/ .ivu-table-wrapper {
  margin: 30px 0 0;
  border: none;
}
/deep/ .ivu-page-total {
  color: #00202d;
}
</style>


