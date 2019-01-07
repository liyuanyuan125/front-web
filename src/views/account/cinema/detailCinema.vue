<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">影院管理 > 查看影院</h2>
    <h3 class="layout-title">影院信息</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>影院信息</label>33333
          </p>
          <p>
            <label>影厅数量</label> xxxxxx
          </p>
          <p>
            <label>影院地址</label> xxxxxx
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>专资编码</label> 33333
          </p>
          <p>
            <label>总座数量</label> xxxxxx
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">影厅信息</h3>
    <Table stripe class="tables" :columns="columns4" :data="data1"></Table>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

export default class Main extends ViewBase {
  columns4 = [
    { title: '影厅编号', key: 'code' },
    { title: '座位数量', key: 'num' },
    { title: '影厅类型', key: 'type' }
  ]

  data1 = [
    { code: 'xxx', num: 'xxx', type: 'xxxx' },
    { code: 'xxx', num: 'xxx', type: 'xxxx' },
    { code: 'xxx', num: 'xxx', type: 'xxxx' },
    { code: 'xxx', num: 'xxx', type: 'xxxx' }
  ]
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

</style>


