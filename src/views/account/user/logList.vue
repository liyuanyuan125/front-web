<template>
  <div class="home-bg">
    <h2 class="layout-nav-title go-back">查看更多操作日志
      <em @click="goBack">返回上一级</em>
    </h2>
    <div class="text-rows log-list">
      <p v-for="(item, index) in logList" :key="index">
        <span>{{formatTimes(item.createTime)}}</span>
        <span>{{item.operatorName}}</span>
        <em>{{item.operateDesc}}</em>
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser } from '@/store'
import { formatTimes } from '@/util/validateRules'
import { operationLog } from '@/api/user'

@Component
export default class Log extends ViewBase {
  formatTimes: any = ''
  logList = []
  async mounted() {
    this.formatTimes = formatTimes
    // 操作日志
    const id = this.$route.params.id
    const obj = { pageIndex: 1, pageSize: 100000 }
    try {
      const { data } = await operationLog(obj, id)
      this.logList = data.items || []
    } catch (ex) {
      this.showError(ex)
    }
  }
  goBack() {
    this.$router.go(-1)
  }
}
</script>
<style lang="less" scoped>
.go-back {
  position: relative;
  em {
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
  }
}
.log-list {
  color: #444;
  span {
    margin-right: 30px;
  }
}
</style>

