<template>
  <RegisterLayout>
    <div slot="steps"></div>
    <div class="page-wrap">
      <h3 class="done-title">注册完成</h3>
      <p class="done-tip"><em>{{second}}秒</em>后将自动返回首页</p>
    </div>
  </RegisterLayout>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import RegisterLayout from './registerLayout.vue'
import { countDown } from '@/fn/timer'

@Component({
  components: {
    RegisterLayout
  }
})
export default class Main extends ViewBase {
  second = 0

  async mounted() {
    await countDown(3, sec => this.second = sec)
    this.$router.push({ name: 'login' })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './common.less';

.page-wrap {
  width: 600px;
  margin: 0 auto;
  text-align: center;
  padding-top: 128px;
}

.done-title {
  color: @c-text;
  font-size: 24px;
  font-weight: normal;
  line-height: 48px;

  &::before {
    content: '';
    display: inline-block;
    width: 48px;
    height: 48px;
    margin-right: 18px;
    background: url(./assets/okFlag.png) no-repeat;
    background-size: contain;
    vertical-align: top;
  }
}

.done-tip {
  margin-top: 40px;
  text-indent: 8px;
  font-size: 14px;
  em {
    color: @c-button;
  }
}
</style>
