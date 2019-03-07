<template>
  <div>
    <div class="header wid-auto">
      <Row type="flex" justify="center" class="headLogo" align="middle" style="height:144px;">
        <Col span="5">
          <router-link to="/login">
            <img src="~@/assets/site/logo.png" height="44px">
          </router-link>
        </Col>
        <Col span="2" :offset="17" class="toLogin">
          <router-link to="/login">登录</router-link>
        </Col>
      </Row>
    </div>
    <div class="bgHei"></div>
  </div>
</template>
<style lang="less" scoped>
@import '../../site/login.less';
.header {
  .toLogin {
    text-align: right;
    font-size: 15px;
  }
}
</style>
