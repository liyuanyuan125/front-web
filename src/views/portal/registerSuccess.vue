<template>
  <div class="register-home">
    <img
        src="//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkcpcgljqctg008ubl7g.png"
        class="register-logo"
      />
    <content class="content">
      <h2 class="register-title">欢迎您加入鲸鱼平台</h2>
      <p class="register-text">您的注册申请将在24小时内审核完毕，请耐心等待</p>
      <Button type="primary" :to="{name: 'login'}">我知道了</Button>
    </content>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Login extends ViewBase {
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/assets/iconFont/iconfont.css';
.register-home {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background: url('//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkcpcd5jqctg008ubl6g.jpg') no-repeat center;
  background-size: cover;
  .register-logo {
    width: 200px;
    margin: 31px 0 0 37px;
  }
  .content {
    width: 738px;
    position: absolute;
    left: 50%;
    top: 200px;
    transform: translate(-50%, 0);
    text-align: center;
    color: #fff;
    .register-title {
      font-size: 50px;
      margin-bottom: 40px;
    }
    .register-text {
      font-size: 32px;
      margin-bottom: 50px;
    }
  }
  /deep/ .ivu-btn {
    width: 366px;
    height: 46px;
    color: #fff;
    font-size: 16px;
    background: #2f6af9;
    border-radius: 23px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
}
// media < 600 屏幕适配
@media screen and(max-height: 600px) {
  .register-home {
    .content {
      width: 350px;
      position: absolute;
      left: 50%;
      top: 25px;
      transform: translate(-50%, 0);
      text-align: center;
      // .register-title {
      //   font-size: 27px;
      //   color: #fff;
      //   margin-bottom: 30px;
      // }
    }
  }
}
</style>
