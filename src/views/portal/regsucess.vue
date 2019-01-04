<template>
  <div>
    <div class="flex">
      <p>
        <Icon type="ios-checkmark-circle-outline" size="48"/>&nbsp;注册完成
      </p>
      <p>
        <font class="FF1000">{{time}}s</font> 后将自动返回首页
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { countDown } from '@/fn/timer'

@Component
export default class Main extends ViewBase {
  time = 3
  mounted() {
      this.downtime()
  }
  async downtime() {
      await countDown(3, sec => {
          this.time = sec
      })
      this.$router.push({name: 'login'})
  }
}
</script>

<style lang="less" scoped>
.flex {
  color: #222;
  font-size: 24px;
  text-align: center;
  width: 100%;
  position: absolute;
  top: 40%;
  & > p:last-child {
    font-size: 14px;
    margin-top: 40px;
  }
}
</style>


