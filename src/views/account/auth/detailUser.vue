<template>
  <div class="page">
    <h2 class="title">权限管理 > 查看权限管理</h2>
    <div class="rows">
      <Row>
        <Col :span="12">
        <p>
          <label>权限角色</label>33333
        </p>
        </Col>
      </Row>
    </div>
    <div class="rows">
      <Row>
        <Col :span="12">
        <p class="flex-box">
          <label>相关权限</label>
          <Tree :data="data1"></Tree>
        </p>
        </Col>
      </Row>
    </div>
    <div class="tableSubmit btnCenter">
      <button class="submitBtn">编辑</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

export default class Main extends ViewBase {
  data1 = [
    {
      title: '首页',
      expand: true,
      children: [
        {
          title: '推广管理1',
          expand: true,
          children: [
            {
              title: '推广管理1-1'
            },
            {
              title: '推广管理1-2'
            }
          ]
        },
        {
          title: '推广管理2',
          expand: true,
          children: [
            {
              title: '推广管理2-1'
            },
            {
              title: '推广管理2-2'
            }
          ]
        }
      ]
    }
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
  .ivu-tree ul {
    font-size: 14px;
  }
}
</style>


