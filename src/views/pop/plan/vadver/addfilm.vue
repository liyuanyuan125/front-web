<template>
  <Modal v-model='showDlg'
  :transfer='false'
  :width='770'
  :closable='false'
  :mask-closable='false'
  :styles="{top: '30px'}">
    <div class="title">
      <h3>选择影片</h3>
      <i @click="cancel"></i>
    </div>
    <div class="reject-cinema">
      <div class="flex-box search-input">
        <Input class="name-input" style="width: 100%; margin-right: 0px" v-model="dataForm.name"  placeholder="请输入影片名称">
          <Icon type="ios-search" slot="suffix" />
        </Input>
      </div>
      <div class="detail">
      <p>已选择影片 <span>{{checkObj.length}}个</span></p>
      </div>
      <Table :loading="loading"  stripe @on-selection-change="check" :columns="columns" :data="tableDate">
        <template slot-scope="{ row }" slot="citys">
          {{row.name}}
        </template>

        <template slot-scope="{ row }" slot="code">
          {{row.code}}
        </template>
      </Table>

      <Page :total="total" v-if="total>0" class="btnCenter"
        :current="dataForm.pageIndex"
        :page-size="dataForm.pageSize"
        :page-size-opts="[6, 20, 50, 100]"
        show-total
        show-sizer
        show-elevator
        @on-change="sizeChangeHandle"
        @on-page-size-change="currentChangeHandle"/>
    </div>
    <div slot="footer" class="foot">
        <Button class="foot-cancel-button" type="info" @click="cancel">取消</Button>
        <Button class="foot-button" type="primary" @click="open">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinemaList } from '@/api/popPlan'
import { clean } from '@/fn/object'
import { isEqual } from 'lodash'
import { toast, warning } from '@/ui/modal.ts'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD'
@Component
export default class DlgEditCinema extends ViewBase {
  showDlg = false
  total = 0
  dataForm: any = {
    name: '',
    pageIndex: 1,
    pageSize: 6,
  }
  page: any = []
  name: any = []
  loading = false
  data: any = []
  checkId: any = []
  checkObj: any = []
  columns: any = [
    {
      type: 'selection',
      width: 60,
      align: 'right'
    },
    {
      title: '影片',
      slot: 'citys',
      align: 'center'
    },
    {
      title: '上映日期',
      slot: 'code',
      align: 'center'
    }
  ]

  get tableDate() {
    if (this.data && this.data.length > 0) {
      return this.data.map((it: any) => {
        if (this.checkId.includes(it.id)) {
          return {
            ...it,
            _checked: true
          }
        } else {
          return {
            ...it,
          }
        }
      })
    } else {
      return []
    }
  }

  check(data: any) {
    const ids = this.data.map((it: any) => it.id)
    const dataId = data.map((it: any) => it.id)
    data.forEach((item: any) => {
      if (!this.checkId.includes(item.id)) {
        this.checkId.push(item.id)
        this.checkObj.push(item)
      }
    })
    const filterId = ids.filter((it: any) => !dataId.includes(it))
    this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
    this.checkObj = this.checkObj.filter((it: any) => !filterId.includes(it.id))
  }

  async init(type: any) {
    this.loading = true
    this.showDlg = true
    this.checkObj = [...type]
    this.checkId = this.checkObj.map((it: any) => it.id)
    this.seach()
  }

  async seach() {
    try {
      const { data: {
        data: { items, totalCount}
      } } = await cinemaList(this.dataForm)
      this.data = items
      this.total = totalCount
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
    }
  }

   // 每页数
  sizeChangeHandle(val: any) {
    this.dataForm.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.dataForm.pageSize = val
    this.seach()
  }

  cancel() {
    this.showDlg = false
  }

  async open() {
    try {
      this.$emit('done', [...this.checkObj])
      toast('操作成功')
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
      content: "×";
      font-size: 34px;
      line-height: 36px;
      text-align: center;
    }
  }
}
.search-input {
  margin-left: 20px;
  .name-input {
    /deep/ .ivu-input {
      padding-left: 20px;
      border-radius: 20px;
      height: 40px;
      line-height: 40px;
      &::placeholder {
        color: #00202d;
      }
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
  margin-top: 16px;
  margin-left: 20px;
  color: rgba(152, 152, 152, 1);
  cursor: pointer;
}
.foot-button-box {
  width: 196px;
  height: 50px;
  margin-right: 20px;
}
.foot {
  text-align: center;
  height: 60px;
  .foot-button {
    .foot-button-box;
  }
  .foot-cancel-button {
    .foot-button-box;
    background: rgba(236, 245, 255, 1);
    border-radius: 2px;
    color: @cancel-color;
    border: 1px solid @cancel-color;
  }
}
/deep/ .ivu-table-wrapper {
  margin-top: 10px;
}
.reject-cinema {
  min-height: 400px;
}
</style>
