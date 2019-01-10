<template>
  <div class="scene-wrap">
    <header class="header">
      <div class="header-in flex-box">
        <div class="logo-wrap flex-mid">
          <router-link :to="{ name: 'home' }">
            <img src="~@/assets/login/logo.png" class="logo">
          </router-link>
        </div>
        <div class="flex-1"></div>
        <div class="flex-mid">
          <router-link :to="{name: 'login'}" class="link-login">登录</router-link>
        </div>
      </div>
    </header>

    <main class="main">
      <router-view/>
    </main>

    <footer class="footer">
      <div class="footer-in">
        copyright&copy;2018 aiad.com　　北京智能广宣科技有限公司　　北京朝阳区亿利生态广场17层
      </div>
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
@import '~@/site/lib.less';

.scene-wrap {
  background-color: #f6f7fd;
}

.header,
.main,
.footer {
  background-color: #fff;
}

.header {
  height: 110px;
}
.header-in {
  max-width: 1100px;
  height: 100%;
  margin: 0 auto;
}

.logo {
  height: 44px;
}
.link-login {
  font-size: 16px;
  color: @c-head;
  &:hover {
    color: @c-link;
  }
}

.main {
  margin-top: 20px;
}

.footer {
  padding: 180px 0 60px;
  font-size: 14px;
}
.footer-in {
  width: 590px;
  margin: auto;
  text-align: center;
  border-top: 1px solid @c-divider;
  padding-top: 20px;
  color: @c-sub-text;
}
</style>

