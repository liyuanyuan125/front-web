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
