<template>
  <div class="area-modeal" v-if="showDlg">
    <h3>
      粉丝占比top10省份
    </h3>
    <ul class="area-box">
      <li><span>1 广东 :</span><span>8.08%</span></li>
      <li><span>1 广东 :</span><span>8.08%</span></li>
      <li><span>1 广东 :</span><span>8.08%</span></li>
      <li><span>1 广东 :</span><span>8.08%</span></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinemaList } from '@/api/popPlan'

@Component
export default class DlgEditCinema extends ViewBase {
  @Prop() id!: number
  showDlg = true

  created() {
    this.init()
  }

  init() {
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
  height: 230px;
  h3 {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    border-bottom: 1px solid #dcdee2;
  }
  .area-box {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 50%;
      padding-left: 10px;
      line-height: 40px;
      font-size: 14px;
    }
  }
}
</style>
