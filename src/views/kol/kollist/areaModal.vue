<template>
  <div class="area-modeal" v-if="showDlg">
    <h3>
      粉丝占比top10省份
    </h3>
    <ul class="area-box" v-if="data.length > 0">
      <li v-for="(it, index) in data" :key="index"><span>{{index + 1}} {{it.name}}:</span><span>{{it.rate / 100}}%</span></li>
    </ul>
    <ul v-else>
      <li class="no-data">暂无数据</li>
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
  @Prop() type!: any
  showDlg = true
  data: any = []

  created() {
    this.init()
  }

  async init() {
    try {
      const data = await fansList({
        channelCode: this.type,
        channelDataId: this.id
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
  height: 250px;
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
.no-data {
  text-align: center;
  margin-top: 60px;
  font-size: 14px;
}
</style>
