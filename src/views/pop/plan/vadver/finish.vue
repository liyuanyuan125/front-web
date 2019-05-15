<template>
  <div class="page home-bg">
    <h3 class="title">恭喜，广告计划创建成功</h3>
    <div class="audit">
      平台审核中，请注意查收最终的投放方案
    </div>
    <div class="audit-btn">您还可以： 【导出推广方案】或【联系商务：（QQ：123456789）（电话：13146015795）（邮箱：zhiping.zhao@aiads.com）】</div>
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
.title {
  text-align: center;
  font-size: 26px;
  margin-top: 40px;
}
.audit {
  text-align: center;
  height: 300px;
  line-height: 300px;
}
.audit-btn {
  text-align: center;
}
</style>

