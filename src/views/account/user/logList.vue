<template>
  <div>
    <div class="text-rows log-list">
      <p v-for="(item, index) in logList" :key="index">
        <span>{{formatTimes(item.createTime)}}</span>
        <em>{{item.operateDesc}}</em>
      </p>
    </div>

    <div class="btn-center">
      <Button type="primary" @click="goBack">返回</Button>
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
.btn-center {
  text-align: center;
}
// .go-back {
//   position: relative;
//   span {
//     width: 200px;
//     height: 50px;
//     background: rgba(249, 216, 94, 1);
//     border-radius: 25px;
//     display: block;
//     text-align: center;
//     line-height: 50px;
//     font-size: 18px;
//     font-weight: 500;
//     color: rgba(0, 32, 45, 1);
//   }
//   em {
//     position: absolute;
//     right: 20px;
//     top: 10px;
//     cursor: pointer;
//     width: 200px;
//     height: 50px;
//     background: rgba(249, 216, 94, 1);
//     border-radius: 25px;
//     display: block;
//     text-align: center;
//     line-height: 50px;
//     font-size: 18px;
//     font-weight: 500;
//     color: rgba(0, 32, 45, 1);
//   }
// }
.log-list {
  color: #444;
  span {
    margin-right: 30px;
  }
}
</style>

