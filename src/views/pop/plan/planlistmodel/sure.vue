<template>
  <Modal v-model='showDlg'
  :transfer='false'
  :width='500'
  :closable='false'
  :mask-closable='false'>
    <div class="title">
      <h3>确认方案</h3>
      <i @click="cancel"></i>
      <p>确认后您只需缴纳您的预算【500,000.00】为保证金即可开始投放，
        投放结束后保证金剩余余额将退还到您的账户；
      （如果实际花费超出您的保证金，您无需补交任何款项），如对方案有任何疑问，请“联系商务”</p>
      <p>是否确认方案？</p>
    </div>
    <div slot="footer" class="foot">
        <Button class="foot-cancel-button" type="info" @click="cancel">取消</Button>
        <Button class="foot-button" type="primary" @click="open">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinemaList } from '@/api/popPlan'
import { clean } from '@/fn/object'
import { isEqual } from 'lodash'
import { toast, warning } from '@/ui/modal.ts'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD'
@Component
export default class DlgEditCinema extends ViewBase {
  showDlg = false

  async init(type: any) {
    this.showDlg = true
  }

  async open() {
    try {
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async seach() {
    try {
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
.title {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #00202d;
  i {
    position: absolute;
    right: -20px;
    top: -20px;
    display: block;
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(209, 216, 219, 1);
    &::before {
      content: "×";
      font-size: 34px;
      line-height: 36px;
      text-align: center;
    }
  }
}

@cancel-color: rgba(59, 152, 255, 1);

.foot-button-box {
  width: 196px;
  height: 50px;
  margin-right: 20px;
}
.foot {
  text-align: center;
  height: 60px;
  .foot-button {
    width: 103px;
    height: 38px;
    border-radius: 5px;
    line-height: 34px;
    font-size: 14px;
    padding: 0;
    .button-style(#fff, #00202d);
  }
  .foot-cancel-button {
    width: 103px;
    height: 38px;
    border-radius: 5px;
    line-height: 34px;
    font-size: 14px;
    padding: 0;
    margin-right: 20px;
    .button-style(#00202d, rgba(255, 255, 255, 0.6));
  }
}
</style>
