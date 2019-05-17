<template>
  <div class="shop-box">
    <h3>购物车</h3>
    <div class="time-wrap">
      <ul class="shop-type">
        <li class="active"></li>
        <li></li>
        <li></li>
      </ul>
      <ul class="shop-step">
        <li>提交预定</li>
        <li>上传物料</li>
        <li>支付订单</li>
      </ul>
    </div>
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
.shop-box {
  margin: 20px 0 0 30px;
  display: flex;
  justify-content: space-between;
  h3 {
    font-size: 24px;
  }
  .time-wrap {
    width: 600px;
    margin-right: 30px;
  }
  .shop-type {
    display: flex;
    height: 20px;
    li {
      width: 290px;
      display: flex;
      align-items: center;
      &::before {
        content: '';
        width: 20px;
        height: 20px;
        background: #ccc;
        border-radius: 50%;
      }
      &:not(:last-child)::after {
        content: '';
        width: 270px;
        height: 2px;
        background: #ccc;
      }
    }
    .active {
      &::before {
        content: '';
        width: 20px;
        height: 20px;
        background: red;
        border-radius: 50%;
      }
    }
    .step {
      &:not(:last-child)::after {
        content: '';
        width: 270px;
        height: 2px;
        background: red;
      }
    }
    li:last-child {
      width: 20px;
    }
  }
  .shop-step {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    li {
      color: #222;
    }
  }
}
</style>
