<template>
  <div>
    <div class="payment-step">
      <div class="step-line-bg"></div>
      <div class="step-solid-bg" :style="{width: solidWidth}"></div>
      <div class="step-text flex-box">
        <div class="step-item">
          <em
            class="default-circle"
            :class="{'active-circle': status == 1, 'solid-circle': 1 < status}"
          ></em>
          <p class="step-tip" v-if="status == 1">您上传的广告片正在审核中</p>
          <span :class="{'text-col': status == 1}">待审核</span>
        </div>

        <div class="step-item">
          <em
            class="default-circle"
            :class="{'active-circle': status == 2, 'solid-circle': 2 < status}"
          ></em>
          <p class="step-tip" v-if="status == 2">广告片上传成功，支付后即可开始转码。</p>
          <span :class="{'text-col': status == 2}">待支付</span>
        </div>

        <div class="step-item">
          <em
            class="default-circle"
            :class="{'active-circle': status == 3, 'solid-circle': 3 < status}"
          ></em>
          <p class="step-tip" v-if="status == 3">正在为您转码中</p>
          <span :class="{'text-col': status == 3}">转码中</span>
        </div>

        <div class="step-item-end">
          <em class="default-circle" :class="{'end-active-circle': status == 4}"></em>
          <p class="step-tip-over" v-if="status == 4">转码已完成</p>
          <span :class="{'text-col': status == 4}">转码完成</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  @Prop({ type: Number }) status: any
  solidWidth: any = '0'
  mounted() {
    this.lineWidth(this.status) // 状态
  }

  lineWidth(status: any) {
    switch (Number(status)) {
      case 1:
        this.solidWidth == '0'
        break
      case 2:
        this.solidWidth = '33%'
        break
      case 3:
        this.solidWidth = '66%'
        break
      case 4:
        this.solidWidth = '100%'
        break
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
.step-tip {
  padding: 13px;
  background: @c-button;
  color: #fff;
  position: absolute;
  border-radius: 2px;
  top: -104px;
  left: -5px;
  white-space: nowrap;
  &::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top: 10px solid @c-button;
    position: absolute;
    left: 8px;
    top: 40px;
  }
}
.step-tip-over {
  padding: 13px;
  background: @c-button;
  color: #fff;
  position: absolute;
  border-radius: 2px;
  top: -104px;
  right: 5px;
  white-space: nowrap;
  &::after {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top: 10px solid @c-button;
    position: absolute;
    right: 8px;
    top: 40px;
  }
}
.default-circle {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 10px;
  border: solid 2px #efefef;
  background: #fff;
  position: absolute;
  top: -37px;
  left: 0;
  z-index: 8;
  &.solid-circle {
    border: solid 2px @c-button;
    background: @c-button;
  }
}
.active-circle {
  position: absolute;
  top: -52px;
  left: -7px;
  width: 36px;
  height: 36px;
  background: @c-button url('../plan/assets/circle.png') no-repeat center center;
  background-size: 14px auto;
  border-radius: 100%;
  display: inline-block;
  z-index: 10;
  border: solid 2px @c-button;
}
.end-active-circle {
  position: absolute;
  top: -52px;
  left: -7px;
  width: 36px;
  height: 36px;
  background: @c-button url('../plan/assets/end-active-circle.png') no-repeat center center;
  background-size: 14px auto;
  border-radius: 100%;
  display: inline-block;
  z-index: 10;
  border: solid 2px @c-button;
}
.payment-step {
  padding: 85px 80px 30px;
  .step-line-bg {
    width: 100%;
    background: #efefef;
    height: 4px;
    border-radius: 5px;
  }
  .step-solid-bg {
    background: @c-button;
    height: 4px;
    border-radius: 5px;
    position: relative;
    top: -4px;
  }
  .step-text {
    margin-top: 25px;
    position: relative;
    .step-item {
      width: 50%;
      text-align: left;
      position: relative;
      .step-tip-over {
        padding: 13px;
        background: @c-button;
        color: #fff;
        position: absolute;
        border-radius: 2px;
        top: -100px;
        right: -6px;
        &::after {
          content: '';
          display: inline-block;
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-top: 10px solid @c-button;
          position: absolute;
          right: 10px;
          top: 40px;
        }
      }
      span {
        margin-left: -8px;
      }
    }
    .step-item-end {
      position: absolute;
      right: -37px;
    }
  }
}
</style>
