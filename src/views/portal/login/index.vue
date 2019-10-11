<template>
  <div class="login-home">
    <content class="content">
      <img
        src="//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkcpcgljqctg008ubl7g.png"
        class="login-logo"
      />
      <p class="login-title">全网精准娱乐营销平台</p>
      <Button type="primary" :to="toLoginUrl" class="login-but">登 录 / 注 册</Button>
    </content>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {subBytes } from '@/fn/string'

@Component
export default class Login extends ViewBase {
  get toLoginUrl() {
    const query = this.$route.query || {}
    return  {
      name: 'tologin',
      query
    }
  }

  mounted() {
    // 同源策略是一种约定，它是浏览器最核心也是最基本的安全功能，如果缺少了同源策略浏览器很容易受到XSS, CSRF等攻击
    // 所谓同源策略是指协议+域名+端口号相同
    // http://www.aiads-dev.com/login  http 协议， www：子域名，aiads-dev.com主域名
    // XSS 跨域脚本攻击, 恶意攻击者往js脚本里面插入script代码，当浏览器执行网页的浏览的时候，scrpt代码自动执行；
    // CSRF :跨域伪造攻击，伪造受信任用户请求，
    //
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/assets/iconFont/iconfont.css';
.login-home {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background: url('//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkcpcd5jqctg008ubl6g.jpg') no-repeat center;
  background-size: cover;
  .login-whale {
    position: absolute;
    width: 100%;
    bottom: 0;
    text-align: center;
    img {
      width: 560px;
    }
  }
  .content {
    width: 350px;
    position: absolute;
    left: 50%;
    top: 115px;
    transform: translate(-50%, 0);
    text-align: center;
    .login-logo {
      width: 350px;
    }
    .login-title {
      font-size: 34px;
      color: #fff;
      margin-bottom: 40px;
    }
  }
  /deep/ .ivu-btn {
    width: 250px;
    height: 38px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    background: #2f6af9;
    border-radius: 17px;
    border: none;
  }
}
@media screen and(max-height: 600px) {
  .login-home {
    .login-whale {
      position: absolute;
      width: 100%;
      bottom: 0;
      text-align: center;
      img {
        width: 350px;
      }
    }
    .content {
      width: 350px;
      position: absolute;
      left: 50%;
      top: 25px;
      transform: translate(-50%, 0);
      text-align: center;
      .login-logo {
        width: 300px;
      }
      .login-title {
        font-size: 27px;
        color: #fff;
        margin-bottom: 30px;
      }
    }
  }
}
</style>
