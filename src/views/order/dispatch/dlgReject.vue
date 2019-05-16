<template>
  <Modal v-model='value.visible'
  title='确认接单影院'
  :transfer='false'
  :width='700'
  :mask-closable='false'
  :styles="{top: '10px'}"
  @on-cancel="cancel()">
    <div class="reject-cinema">
      <div class="flex-box search-input">
        <AreaSelect class="name-input" show-region :max-level="2" v-model="name" />
        <Input class="name-input" style="margin-right: 0px" v-model="dataForm.query"  placeholder="请输入影院专资编码／影院名称进行搜索" />
        <span @click="seach">
          <Icon type="ios-search" size="22"/>
        </span>
      </div>
      <Table  stripe @on-selection-change="check" :columns="columns" :data="tableDate">
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
        show-total
        show-elevator
        @on-change="sizeChangeHandle"
        @on-page-size-change="currentChangeHandle"/>
    </div>
    <div slot="footer" class="foot">
      <div>
        <Button class="foot-cancel-button" type="info" @click="cancel">取消</Button>
        <Button class="foot-button" type="primary" @click="handleSubmit">确定</Button>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryDetail, reciveOrder} from '@/api/norderDis'
// import { clean } from '@/fn/object'
import { isEqual } from 'lodash'
// import targetDlg from './targetDlg.vue'
import { toast, warning } from '@/ui/modal.ts'
import AreaSelect from '@/components/areaSelect'
import { isNullOrEmpty } from '@/fn/string'

@Component({
  components: {
    // targetDlg,
    AreaSelect
  }
})
export default class DlgEditCinema extends ViewBase {
  @Prop({ type: Object }) value!: any
  total = 0
  dataForm: any = {
    query: null,
    pageIndex: 1,
    pageSize: 20,
  }

  // page: any = []
  reject: any = {}
  name: any = []
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

  get tableDate() {
    if (this.data && this.data.length > 0) {
      return this.data.map((it: any) => {
        if (this.checkId .includes(it.id)) {
          return {
            ...it,
            citys: `${it.areaName} / ${it.provinceName} / ${it.cityName}`,
            _checked: true
          }
        } else {
          return {
            ...it,
            citys: `${it.areaName} / ${it.provinceName} / ${it.cityName}`
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

  mounted() {
    this.seach()
  }

  async seach() {
    try {
      const {
        data: {
          items,
          totalCount
        }
      } = await queryDetail(this.value.id, {
        ...this.dataForm,
        ...this.reject
      })

      this.total = totalCount
      this.data = items || []
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

  cancel() {
    this.value.visible = false
    // this.page = []
    this.checkId = []
    this.checkObj = []
  }

  async handleSubmit() {
    if (this.checkId.length == 0) {
      warning('请选择目标影院')
      return
    }
    try {
      const data = await reciveOrder({
        id: this.value.id,
        receiveCinemas: this.checkId
      })
      this.$emit('rejReload')
      this.cancel()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('name', { deep: true })
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
</style>
