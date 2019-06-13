<template>
  <div class="area-modeal" v-if="showDlg">
    <h3>
      粉丝占比top10省份
    </h3>
    <ul class="area-box">
      <li v-for="(it, index) in data" :key="index"><span>{{data.id}} {{data.name}}:</span><span>{{data.percent}}%</span></li>
      
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fansList } from '@/api/popPlan'

@Component
export default class DlgEditCinema extends ViewBase {
  @Prop() id!: number
  showDlg = true
  data: any = []

  created() {
    this.init()
  }

  async init() {
    try {
      const data = await fansList({
        channelCode: 'weibo',
        channelDataId: 12314
      })
      this.data = data.data.items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  cancel() {
    this.showDlg = false
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.area-modeal {
  border: 1px solid #dcdee2;
  background: #fff;
  border-radius: 5px;
  padding: 0 20px;
  box-shadow: 0 0 10px rgba(51, 51, 51, .25);
  width: 400px;
  height: 240px;
  h3 {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    border-bottom: 1px solid #dcdee2;
  }
  .area-box {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    height: 200px;
    li {
      width: 50%;
      padding-left: 10px;
      line-height: 40px;
      font-size: 14px;
    }
  }
}
</style>
