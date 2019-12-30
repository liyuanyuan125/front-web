<template>
  <Modal v-model='value.visible'
  :title='title'
  :transfer='false'
  :width='700'
  :mask-closable='false'
  >
    <div class="reject-cinema">
      <div class="flex-box search-input">
        <AreaSelect class="name-input" show-region :max-level="2" v-model="areaSelect" />
        <Input class="name-input" style="margin-right: 0px" v-model="dataForm.query"  placeholder="请输入影院专资编码／影院名称进行搜索" />
        <span @click="seach">
          <Icon type="ios-search" size="22"/>
        </span>
      </div>

      <KeepSelectTable
          stripe
          :data="tableDate"
          :columns="columns"
          :selectedIds.sync="checkId"
        >
          <template slot-scope="{ row }" slot="citys">
            {{row.citys}}
          </template>

          <template slot-scope="{ row }" slot="code">
            {{row.code}}
          </template>

          <template slot-scope="{ row }" slot="shortName">
            {{row.shortName}}
          </template>

          <template slot-scope="{ row }" slot="titleRemark">
            <!-- remark不为空 则表示有权限 -->
            <div v-if="row.remark">
              <span v-if="row.status == 1">{{row.remark}}</span>
              <span v-if="row.status == 2">已接单</span>
              <span v-if=" row.status == 3">已拒单</span>
            </div>
            <div v-else>
              <span v-for="item in statusList" :key="item.id" v-if="item.key == row.status">{{item.text}}</span>
            </div>
            
          </template>
        </KeepSelectTable>

      <Page :total="total" v-if="total>0" class="btn-center-footer"
        :current="dataForm.pageIndex"
        :page-size="dataForm.pageSize"
        show-total
        show-elevator
        @on-change="sizeChangeHandle"
        @on-page-size-change="currentChangeHandle"/>
    </div>
    <div slot="footer" class="foot">
        <Button class="foot-cancel-button" type="info" @click="value.visible = false">取消</Button>
        <Button v-if="value.mark == 1" class="foot-button" type="primary" :loading="sureLoading" @click="handleSubmit('receiv')">确认接单</Button>
        <Button v-if="value.mark == 2" class="foot-button" type="primary" @click="handleSubmit('refuse')" >拒绝接单</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryDetail, reciveOrder, refuseOrder} from '@/api/norderDis'
import { isEqual, difference } from 'lodash'
import { toast, warning } from '@/ui/modal.ts'
import AreaSelect from '@/components/areaSelect'
import { isNullOrEmpty } from '@/fn/string'
import KeepSelectTable from '@/components/keepSelectTable'

@Component({
  components: {
    AreaSelect,
    KeepSelectTable
  }
})
export default class DlgEditCinema extends ViewBase {
  @Prop({ type: Object }) value!: any

  total = 0
  statusList = []

  dataForm: any = {
    query: null,
    pageIndex: 1,
    pageSize: 20,
  }

  sureLoading = false

  // 区/县/市
  reject: any = {}
  areaSelect: any = []
  itemsList: any = []
  checkId: any = []
  // checkObj: any = []

  columns: any = [
    {
      title: '区/县/市',
      width: 180,
      slot: 'citys',
      align: 'center'
    },
    {
      title: '专资编码',
      slot: 'code',
      width: 160,
      align: 'center'
    },
    {
      title: '影院名称',
      slot: 'shortName',
      align: 'center'
    },
    {
      title: ' ',
      slot: 'titleRemark',
      align: 'center',
    }
  ]

  get tableDate() {
    // 该账号无该影城权限的，首列的复选框置灰，不可选
    // 该账号有该影城的权限，待接单的情况，复选框可以选中，其他状态复选框置灰不可选
    if (this.itemsList && this.itemsList.length > 0) {
      return this.itemsList.map((it: any) => {
        let checked = null
        checked = it.remark ? {_disabled: true} : (it.status == 1 ? {_checked: true} : {_disabled: true})
        return {
          ...it,
          ...checked,
          citys: `${it.areaName} / ${it.provinceName} / ${it.cityName}`,
        }
      })
    } else {
      return []
    }
  }

  get title() {
    return this.value.mark == 1 ? '确认接单影院' : '拒绝接单影院'
  }

  mounted() {
    this.listall()
  }

  async listall() {
    try {
      const {
        data: {
          items,
          totalCount
        }
      } = await queryDetail(this.value.id, {
        ...this.reject,
        pageIndex: 1,
        pageSize: 200000,
      })
      // 该账号有该影城的权限，待接单的情况，复选框可以选中(返回相应的id)
      this.checkId = (items || []).map((it: any) => {
        if (!it.remark && it.status == 1) {
          return it.id
        }
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async seach() {
    try {
      const {
        data: {
          items,
          totalCount,
          statusList
        }
      } = await queryDetail(this.value.id, {
        ...this.dataForm,
        ...this.reject
      })
      this.total = totalCount
      this.statusList = statusList
      this.itemsList = items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async handleSubmit(types: string) {
    // 排除null, undefined, ''
    const checkIds = difference(this.checkId, [null, undefined, ''])
    if (checkIds.length == 0) {
      warning('请选择影院')
      return
    }
    this.sureLoading = true
    const datas = {
      id: this.value.id,
      cinemaIds: checkIds
    }
    try {
      if (types == 'receiv') {
        await reciveOrder(datas)
      } else if (types == 'refuse') {
        await refuseOrder(datas)
      }

      this.$emit('rejReload')
      this.value.visible = false
      this.sureLoading = false
    } catch (ex) {
      this.sureLoading = false
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

  // cancel() {
  //   this.value.visible = false
  //   this.checkId = []
  // }

  @Watch('areaSelect', { deep: true })
  watchArea(val: number[]) {
    this.reject.areaCode = val[0] == 0 ? '' : val[0]
    this.reject.provinceId = val[1] == 0 ? '' : val[1]
    this.reject.cityId = val[2] == 0 ? '' : val[2]
    this.seach()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.search-input {
  margin-left: 20px;
  .name-input {
    width: 300px;
    margin-right: 20px;
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
/deep/.ivu-table-body {
  min-height: 400px;
  max-height: 550px;
  overflow: auto;
}
</style>
