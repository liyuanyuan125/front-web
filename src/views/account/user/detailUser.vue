<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">用户管理 > 查看子用户</h2>
    <h3 class="layout-title">账号信息</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>账号管理</label>33333
          </p>
          <p>
            <label>账号ID</label> xxxxxx
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>邮箱账号</label> 33333
          </p>
          <p>
            <label>登录密码</label> xxxxxx
          </p>
          <p>
            <label>联系人</label>33333
          </p>
          <p>
            <label>手机号码</label> xxxxxx
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">关联影院</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>覆盖区域</label>33333个
          </p>
          <p>
            <label>覆盖省份</label> xxxxxx
          </p>
          <p class="query-cinema">查看已关联影院列表</p>
        </Col>
        <Col :span="12">
          <p>
            <label>覆盖</label> 33333 个
          </p>
          <p>
            <label>关联影院</label> xxx个
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">账号权限</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>权限角色</label>33333
          </p>
          <p class="flex-box">
            <label>相关权限</label>
            <Tree :data="data1"></Tree>
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>授权影院</label> 33333
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">操作日志</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>20111-22-22 提交账户充值，充值ID：10000，金额（元）：100000；33333</p>
        </Col>
        <Col :span="12">
          <p>20111-22-22 登录广告平台</p>
        </Col>
      </Row>
    </div>
    <div class="btnCenter">
      <button class="button-ok submitBtn">编辑</button>
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
.page {
  .submitBtn {
    margin-bottom: 30px;
  }
}
</style>


