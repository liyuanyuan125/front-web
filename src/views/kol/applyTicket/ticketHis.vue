<template>
  <div class="pages">
      <div>
        <ul class='big' v-if='this.list.length != 0'>
          <li class="list-li" v-for="item in list" :key = "item.id">
            <Row class="li-title flex-box">
              <Col :span='20'>下单时间： {{item.applyTime}}</Col>
              <Col :span='3' style='text-align: center;'><span class='hui' v-for='(it , index) in statusList' :key='index' v-if='item.status == it.key'>{{it.text}}</span></Col>
            </Row>
            <Row class="li-col">
              <Col :span="8"><span class='hui'>发票内容：</span><span v-for='(it , index) in itemList' :key='index' v-if='item.invoiceContent == it.key'>{{it.text}}</span></Col>
              <Col :span="8"><span class='hui'>发票总额：</span><span class='red'>¥{{item.totalTaxFee}}</span></Col>
              <Col :span="5" style=' height: 100px; line-height: 20px; padding-top: 22px;'>
                <Row v-if='item.status == 2'>
                  <Row class='hui' style='height: 20px;margin-top: 10px;'>拒绝原因：</Row>
                  <Row style='height: 20px;'>{{item.refuseReason}}</Row>
                </Row>
                <Row v-if='item.status == 4'>
                  <Row class='hui' style='height: 20px;'>快递信息：</Row>
                  <Row style='height: 20px;'>{{item.expressCompany}}</Row>
                  <Row style='height: 20px;'>{{item.expressNo}}</Row>
               </Row>
               <Row v-if='item.status == 3 || item.status == 1'>&nbsp;</Row>
              </Col>
              <Col :span="3" style='height: 100px; line-height: 20px; padding-top: 30px; text-align: center;cursor:pointer;'>
                <div v-if='item.status == 2' @click='edit(item.id)'>修改</div>
                <div @click='viewdetail(item.id)'>开票详情</div> 
              </Col>
            </Row>
          </li>
        </ul>
        <div class='lis' v-if='this.list.length == 0'>暂无开票历史</div>
      </div>
      <Page
      :total="totalCount"
      v-if="totalCount>0"
      class="btn-center-footer plan-pages"
      :current="query.pageIndex"
      :page-size="query.pageSize"
      show-total
      @on-change="handlepageChange"
      @on-page-size-change="handlePageSize"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info } from '@/ui/modal'
import {
  queryList,
  editticket,
  addticket,
  itemlist,
  histories
} from '@/api/ticket'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'


const timeFormat = 'YYYY-MM-DD HH:mm:ss'


@Component
export default class Main extends ViewBase {
  totalCount = 0
  query = {
    pageIndex: 1,
    pageSize: 10
  }


  list = []
  statusList: any = []
  itemList: any = []
  mounted() {
    this.seach()
  }

  seachs() {
    this.query.pageIndex = 1
    this.seach()
  }

  async seach() {
    try {
      const { data } = await histories(this.query)
      this.list = (data.items || []).map((it: any) => {
        return {
          ...it,
          applyTime: moment(it.applyTime).format(timeFormat)
        }
      })
      this.totalCount = data.totalCount
      this.statusList = data.statusList
      this.itemList = data.invoiceContentList
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  edit(id: any) {
    this.$router.push({ path : `/kol/applyTicket/addticket/` + id + `/0`})
  }

  viewdetail(id: any) {
    this.$router.push({ path : `/kol/applyTicket/detail/` + id})
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
<style lang='less' scoped>
@import '~@/site/common.less';
.pages {
  padding: 10px 40px 0 30px;
}
.big {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  padding: 40px;
}
.lis {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: #fff;
  text-align: center;
}
.list-li {
  font-size: 14px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid #fff;
  border-radius: 5px;
  margin-top: 20px;
  .li-title {
    height: 50px;
    line-height: 50px;
    padding-left: 50px;
    background: rgba(255, 255, 255, 0.3);
  }
  .li-col {
    padding: 0 40px 0 50px;
    height: 100px;
    line-height: 100px;
  }
}
.hui {
  color: rgba(0, 32, 45, 0.5);
}
.red {
  color: #da6c70;
  font-weight: 500;
  font-size: 20px;
}
/deep/ .btn-center-footer {
  text-align: center;
  height: 100px;
  // background: rgba(32, 67, 80, 1);
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