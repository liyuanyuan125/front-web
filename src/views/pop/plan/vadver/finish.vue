<template>
  <div class="page home-bg">
    <p>恭喜，广告计划创建成功</p>
    <div>
      平台审核中，请注意查收最终的投放方案
    </div>
    <div>您还可以： 【导出推广方案】或【联系商务：（QQ：123456789）（电话：13146015795）（邮箱：zhiping.zhao@aiads.com）】</div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class App extends ViewBase {
  step = 0
}
</script>

<style lang="less" scoped>
.setp-wrap {
  height: 104px;
  padding: 33px 30px 33px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: solid 10px #f2f2f2;
  color: #2481d7;
}
</style>

