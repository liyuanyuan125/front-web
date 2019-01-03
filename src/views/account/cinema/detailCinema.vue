<template>
  <div class="page">
    <h2 class="title">影院管理 > 查看影院</h2>
    <h3>影院信息</h3>
    <div class="rows">
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
    <h3>影厅信息</h3>
    <Table
      stripe
      class="tables"
      :columns="columns4"
      :data="data1"
    ></Table>
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
@import '~@/site/common.less';
.page {
  height: 100%;
  background: #fff;
  .title {
    height: 50px;
    padding: 14px 30px 33px;
    font-size: 14px;
    border-bottom: solid 10px #f2f2f2;
    color: @c-link;
  }
  h3 {
    .h3Bg;
  }
  .rows {
    padding: 20px 30px 35px;
    font-size: 14px;
    p {
      padding-bottom: 15px;
      color: #444;
      label {
        color: #888;
        display: inline-block;
        width: 90px;
      }
      &.btn {
        color: @c-button;
        padding-top: 10px;
        cursor: pointer;
      }
    }
  }
  .tables {
    margin: 30px;
  }
}
</style>


