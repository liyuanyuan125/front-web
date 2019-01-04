<template>
  <div class="site-wrap">
    <header class="site-header">
      <div class="header">
        <Row type="flex" justify="center" class="headLogo" align="middle" style="height:144px;">
          <Col span="5">
          <router-link to="/login">
            <img src="~@/assets/login/logo.png" height="44px">
          </router-link>
          </Col>
          <Col span="2" :offset="17" class="toLogin">
            <router-link :to="{name: 'login'}">登录</router-link>
          </Col>
        </Row>
      </div>
      <div class="bgHei"></div>
    </header>

    <main class="site-main">
      <router-view/>
    </main>

    <footer class="footer">
        <span>copyright&copy;2018 aiad.com　　北京智能广宣科技有限公司　　北京朝阳区亿利生态广场17层</span>
    </footer>
  </div>
</template>

<script lang="ts">
 import { Component } from 'vue-property-decorator'
 import ViewBase from '@/util/ViewBase'

 @Component
 export default class PortalLayout extends ViewBase {
 }
</script>

<style lang="less" scoped>
@import '~@/site/login.less';

.bgHei {
  height: 20px;
  background: #f6f7fd;
}
.header {
  .wid-auto;
  .toLogin {
    text-align: right;
    font-size: 15px;
  }
}
.footer {
  color: #989898;
  margin: 120px 0 60px;
  width: 100%;
  font-size: 14px;
  text-align: center;
  span {
    border-top: solid 1px #efefef;
    padding-top: 20px;
  }
}
</style>

