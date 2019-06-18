<template>
  <Modal v-model='showDlg'
         :transfer='false'
         :width='770'
         :closable='false'
         :mask-closable='false'
         :styles="{top: '30%'}">
    <div class="title">
      <h3>选择计划</h3>
      <i @click="cancel"></i>
    </div>
    <div class="reject-plan">
      <div class="search-input">
        <Row type="flex"
             justify="space-between"
             style="width: 100%;">
          <Col :span="11">
          <DatePicker type="daterange"
                      style="width: 100%;"
                      v-model="form.beginDate"
                      @on-change="handleChange"
                      placement="bottom-end"
                      placeholder="请选择开始日期和结束日期"></DatePicker>
          </Col>
          <Col :span="12">
          <CustomerList v-model="form.customerId"></CustomerList>
          </Col>
        </Row>
        <Row type="flex"
             justify="space-between"
             style="width: 100%; padding-top: 15px;">
          <Col :span="24">
          <PlanList v-model="form.planId"></PlanList>
          </Col>
        </Row>
      </div>
      <div class="detail">
        <ul class="plan-list">
          <li class="plan-item">
            <div class="plan-cover-box">
              <img class="plan-cover"
                   src="http://img0.imgtn.bdimg.com/it/u=2387750928,3991855324&fm=26&gp=0.jpg" />
              <div style="flex: 1">
                <div class="plan-title">2019款wey新车发布影院广告</div>
                <div class="plan-time">上映时间：1970-01-01</div>
                <div class="plan-time">投放周期 7天</div>
                <div class="plan-time">广告片 vv6年轻有wey</div>
                <div class="plan-time">广告规格 30s</div>
                <div class="plan-time">投放状态 投放中</div>
                <div class="plan-time">最后更新时间 2019-05－11 12</div>
              </div>
              <div class="button-box">
                <a href="javascript;:"
                   class="btn">查看</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <Page :total="total"
            v-if="total>0"
            class="btnCenter"
            :current="form.pageIndex"
            :page-size="form.pageSize"
            :page-size-opts="[4, 8, 16, 24]"
            show-total
            show-sizer
            show-elevator
            @on-change="sizeChangeHandle"
            @on-page-size-change="currentChangeHandle" />
    </div>
    <div slot="footer"
         style="display: none"></div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { searchcinema } from '@/api/popPlan'
import { thirdMonitors } from '@/api/effectReport'
import CustomerList from './x-select-customerlist.vue'
import PlanList from './x-select-planlist.vue'
import { clean } from '@/fn/object'
import { isEqual } from 'lodash'
import { toast, warning } from '@/ui/modal.ts'
import moment from 'moment'
import { uniq, uniqBy } from 'lodash'
const timeFormat = 'YYYY-MM-DD'
const keepExclusion = <T>(
  value: T[],
  oldValue: T[],
  aloneValue: any,
  setter: (newValue: T[]) => any
) => {
  if (value.length > 1) {
    const newHas = value.includes(aloneValue)
    const oldHas = oldValue.includes(aloneValue)
    newHas && setter([aloneValue])
    newHas && oldHas && setter(value.filter(it => it != aloneValue))
  }
}
@Component({
  components: {
    CustomerList,
    PlanList
  }
})
export default class DlgEditCinema extends ViewBase {
  showDlg = false

  total = 122

  form: any = {
    pageIndex: 1,
    pageSize: 4,
    beginDate: [new Date(2019, 3, 9), new Date(2019, 4, 11)],
    customerId: null,
    planId: null
  }

  loading = false

  data: any = []

  async init(type: any) {
    (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: hidden'
    this.loading = true
    this.showDlg = true
    this.search()
  }

  async search() {
    try {
      const {
        data: { items, totalCount }
      } = await thirdMonitors({ })
      this.data = items || []
      this.total = totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handleChange() {
    this.search()
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
// /deep/ .ivu-modal-body {
// }
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
.search-input {
  margin-left: 20px;
  /deep/ .ivu-input {
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
    &::placeholder {
      color: #00202d;
    }
  }
  /deep/ .ivu-select-selection,
  /deep/ .ivu-select-input {
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
    &::placeholder {
      color: #00202d;
    }
  }
  /deep/ .ivu-btn {
    height: 40px;
  }
  /deep/ .ivu-input-suffix i {
    font-size: 20px;
    line-height: 38px;
    margin-right: 20px;
    color: #00202d;
  }
}
@cancel-color: rgba(59, 152, 255, 1);
.detail {
  max-height: 500px;
  overflow: auto;
  margin-top: 16px;
  margin-left: 20px;
  color: rgba(152, 152, 152, 1);
  cursor: pointer;
}
/deep/ .ivu-table-wrapper {
  margin-top: 10px;
}
.reject-plan {
  min-height: 400px;
  padding: 15px 0;
}
.plan-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 20px;
  .plan-item {
    width: calc(100% - 20px);
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    border-bottom: 1px solid #ebf6fa;
    color: #00202d;
    padding-bottom: 20px;
    .plan-cover-box {
      display: flex;
      margin-top: 30px;
      flex-flow: row;
      justify-content: space-around;
      align-items: flex-start;
      .plan-title {
        height: 24px;
        margin-left: 20px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 32, 45, 1);
      }
      .plan-time {
        margin-left: 20px;
        height: 24px;
      }
      img {
        margin-left: 20px;
        width: 80px;
        height: 80px;
        border-radius: 5px;
      }
    }
    .button-box {
      text-align: center;
      .btn {
        width: 100px;
        height: 50px;
        line-height: 50px;
        background: rgba(249, 216, 94, 1);
        border-radius: 25px;
        font-size: 18px;
        font-weight: 500;
        color: rgba(0, 32, 45);
        text-align: center;
        display: inline-block;
      }
    }
  }
}
.default-btn {
  width: 100px;
  vertical-align: middle;
  .button-style(#00202d, rgba(0, 0, 0, 0));
  border-radius: 25px;
  img {
    vertical-align: middle;
  }
}
.open-button {
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
</style>
