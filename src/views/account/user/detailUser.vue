<template>
  <div class="page">
    <h2 class="title">用户管理 > 查看子用户</h2>
    <h3>账号信息</h3>
    <div class="rows">
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
    <div class="tableSubmit btnCenter">
      <button class="submitBtn">编辑</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

export default class Main extends ViewBase {}
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
}
</style>


