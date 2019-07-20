<template>
  <loginLayout>
    <div class="login-home">
        <content class="content">
          <div class="login-title">欢迎您的加入</div>
          <p class="login-text">营销顾问将在24小时内与您联系</p>
          <Button type="primary" :to="{name: 'tologin'}"  class="login-but">好的</Button>
        </content>
    </div>
  </loginLayout>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import loginLayout from './loginLayout.vue'

@Component({
    components: {
        loginLayout
    }
})
export default class Main extends ViewBase {
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
  .layout-log {
    z-index: 9999;
  }
  .content {
    width: 460px;
    position: absolute;
    left: 50%;
    top: 240px;
    transform: translate(-50%, 0);
    text-align: center;
    .login-title {
      font-size: 45px;
      color: #fff;
      margin-bottom: 50px;
    }
    .login-text {
      color: #fff;
      font-size: 32px;
      margin-bottom: 50px;
    }
  }
  /deep/ .ivu-btn {
    width: 366px;
    height: 46px;
    line-height: 37px;
    color: #fff;
    font-size: 18px;
    text-align: center;
    background: #2f6af9;
    border-radius: 23px;
    border: none;
  }
}
// media < 600 屏幕适配
@media screen and(max-height: 600px) {
  .login-home {
    .content {
      width: 460px;
      position: absolute;
      left: 50%;
      top: 100px;
      transform: translate(-50%, 0);
      text-align: center;
      .login-title {
        font-size: 27px;
        color: #fff;
        margin-bottom: 30px;
      }
    }
  }
}

</style>
