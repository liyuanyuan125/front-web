
<template>
  <PortalLayout>
    <slot name="steps">
      <div class="steps">
        <Steps :current="current">
          <Step title="创建帐号" style="width:135px"></Step>
          <Step title="补充资质" style="width:135px"></Step>
        </Steps>
      </div>
    </slot>

    <div class="reg-body">
      <slot></slot>
    </div>
  </PortalLayout>
</template>

<script lang="ts">
import { Component, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import PortalLayout from './portalLayout.vue'

const stepMap: any = {
  register: 0,
  'register-complete': 1,
}

@Component({
  components: {
    PortalLayout
  }
})
export default class RegisterLayout extends ViewBase {
  get current() {
    const name = this.$route.name
    return stepMap[name!] || 0
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';

.steps {
  border-bottom: solid 1px #efefef;
  padding: 50px 0 20px 48px;
  max-width: 1100px;
  margin: 0 auto;
  /deep/ .ivu-steps {
    width: 270px;
    margin: 0 auto;
    user-select: none;
    .ivu-steps-title {
      color: @c-text;
      font-size: 16px;
      font-weight: normal;
      vertical-align: top;
    }
    .ivu-steps-head-inner {
      position: relative;
      top: 5px;
      width: 16px;
      height: 16px;
      font-size: 12px;
      border: 0;
      margin-right: 2px;
      span {
        position: relative;
        top: -4px;
        color: @c-text;
        font-size: 18px;
      }
    }
    // 正在进行中的 step
    .ivu-steps-status-process,
    .ivu-steps-status-finish {
      .ivu-steps-head-inner {
        border-color: @c-button;
        background-color: @c-button;
        margin-right: 5px;
        span {
          color: #fff;
        }
      }
      .ivu-steps-title {
        color: @c-button;
      }
    }
    .ivu-steps-status-finish {
      .ivu-steps-tail > i::after {
        background: @c-button;
      }
    }
  }
}
</style>
