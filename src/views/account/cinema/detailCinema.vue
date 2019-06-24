<template>
  <div class="page home-bg">
    <h3 class="layout-title">影院信息</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>影院信息</label>{{items.shortName}}
          </p>
          <p>
            <label>影厅数量</label> {{items.hallCount}}
          </p>
          <p>
            <label>影院地址</label> {{items.address}}
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>专资编码</label> {{items.code}}
          </p>
          <p>
            <label>总座数量</label> {{items.seatCount}}
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">影厅信息</h3>
    <Table stripe class="tables" :columns="columns4" :data="tableData"></Table>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinmeaId } from '@/api/cinema'
import { toMap } from '@/fn/array'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

@Component
export default class Main extends ViewBase {
  items = {}
  list: any = []
  loadding = false
  typeList = []
  columns4 = [
    {
      title: '影厅编号',
      key: 'name',
      align: 'center'
    },
    {
      title: '座位数量',
      key: 'seats',
      align: 'center'
    },
    {
      title: '影厅类型',
      key: 'typeListText',
      align: 'center'
    }
  ]

  get cachedMap() {
    return {
      typeList: makeMap(this.typeList)
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
       ...it,
       typeListText : cachedMap.typeList[it.typeCode]
      }
    })
    return list
  }

  created() {
    this.seach()
  }

  async seach() {
    try {
      const {
        data: {
          item,
          totalCount,
          typeList
        }
      } = await cinmeaId(this.$route.params.id)
      this.items = item
      this.list = item.halls
      this.typeList = typeList
      this.loadding = true
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

</style>


