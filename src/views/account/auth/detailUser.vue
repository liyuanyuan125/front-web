<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">权限管理 > 查看权限管理</h2>
    <div class="text-rows auth-col">
      <Row>
        <Col :span="12">
          <p>
            <label>权限角色</label>33333
          </p>
        </Col>
      </Row>
    </div>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p class="flex-box">
            <label>相关权限</label>
            <Tree :data="data1"></Tree>
          </p>
        </Col>
      </Row>
    </div>
    <div class="btnCenter">
      <button class="button-ok">编辑</button>
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

.auth-col {
  padding-bottom: 0;
}
</style>


