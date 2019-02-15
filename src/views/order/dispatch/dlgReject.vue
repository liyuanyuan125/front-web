<template>
  <Modal v-model='showDlg'
  :title="type == 1 ? '确认接单影院' : '编辑接单影院'"
  :transfer='false'
  :width='770'
  :mask-closable='false'
  :styles="{top: '10px'}"
  @on-cancel="cancel()">
    <div class="reject-cinema">
      <div class="flex-box search-input">
        <Input class="name-input" v-model="dataForm.name"  placeholder="请输入影院专资编码／影院名称进行搜索" />
        <span @click="seach">
          <Icon type="ios-search" size="22"/>
        </span>
      </div>
      <div class="detail" @click="edit">
      <p>查看全部已关联影院 <span>{{checkId.length}}个</span></p>
      </div>
      <Table :loading="loading"  stripe @on-selection-change="check" :columns="columns" :data="tableDate">
        <template slot-scope="{ row }" slot="citys">
          {{row.citys}}
        </template>

        <template slot-scope="{ row }" slot="code">
          {{row.code}}
        </template>

        <template slot-scope="{ row }" slot="shortName">
          {{row.shortName}}
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
      <div v-if="type == 1">
        <Button class="foot-cancel-button" type="info" @click="cancel">取消计划</Button>
        <Button class="foot-button" type="primary" @click="open">开启投放</Button>
      </div>
      <div v-else>
        <Button class="foot-cancel-button" type="info" @click="cancel">取消</Button>
        <Button class="foot-button" type="primary" @click="open">确定</Button>
      </div>
    </div>
    <targetDlg ref="target" />
  </Modal>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList, carryList, leafletList, sureLeaflet, carrySet } from '@/api/leafletDlg'
import { clean } from '@/fn/object'
import { isEqual } from 'lodash'
import targetDlg from './targetDlg.vue'
import { toast, warning } from '@/ui/modal.ts'

@Component({
  components: {
    targetDlg
  }
})
export default class DlgEditCinema extends ViewBase {
  showDlg = false
  type = 1
  total = 0
  dataForm: any = {
    name: '',
    pageIndex: 1,
    pageSize: 6,
  }
  loading = false
  id: any = ''
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
      title: '区/县/市',
      width: 180,
      slot: 'citys',
      align: 'center'
    },
    {
      title: '转资编码',
      slot: 'code',
      width: 160,
      align: 'center'
    },
    {
      title: '影院名称',
      slot: 'shortName',
      align: 'center'
    }
  ]

  // created() {
  //   this.init(32)
  // }

  get tableDate() {
    if (this.data && this.data.length > 0) {
      return this.data.map((it: any) => {
        if (this.checkId .includes(it.id)) {
          return {
            ...it,
            citys: `${it.areaName}${it.provinceName}${it.cityName}`,
            _checked: true
          }
        } else {
          return {
            ...it,
            citys: `${it.areaName}${it.provinceName}${it.cityName}`
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

  init(id: any, type: any) {
    this.id = id
    this.type = type
    this.loading = true
    this.showDlg = true
    this.seach()
  }

  async seach() {
    try {
      const {
        data: {
          items,
          totalCount
        }
      } = this.type == 1 ? await leafletList(this.id, clean({
        ...this.dataForm
      })) : await carryList(this.id, clean({
        ...this.dataForm
      }))
      this.total = totalCount
      this.data = items || []
      this.loading = false
      this.$emit('ref')
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

  edit() {
    this.$nextTick(() => {
      (this.$refs.target as any).init(0, this.checkObj)
    })
  }

  cancel() {
    this.showDlg = false
    this.checkId = []
    this.checkObj = []
  }

  async open() {
    if (this.checkId.length == 0 && this.type == 1) {
      warning('请选择目标影院')
      return
    }
    try {
      this.type == 1 ? await sureLeaflet({
        id: this.id,
        cinemas: this.checkId
      }) : await carrySet(this.id, {
        cinemas: this.checkId
      })
      this.$emit('rejReload')
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
.search-input {
  margin-left: 30px;
  .name-input {
    width: 300px;
    /deep/ .ivu-input {
      height: 40px;
      line-height: 40px;
    }
  }
  span {
    display: block;
    height: 40px;
    width: 80px;
    color: #fff;
    text-align: center;
    padding-top: 8px;
    background: rgba(59, 152, 255, 1);
  }
}
@cancel-color: rgba(59, 152, 255, 1);
.detail {
  margin-top: 16px;
  margin-left: 30px;
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
