<template>
  <Modal v-model='showDlg'
  :transfer='false'
  :width='460'
  :closable='false'
  :mask-closable='false'>
    <div class="title">
      <i @click="cancel"></i>
      <img width="115px" height="115px" src="../assets/fanan.png" />
      <p v-if="showmongy == 0">余额不足，前去缴费</p>
      <p v-else-if='showmongy == 1'>确认缴费</p>
      <p v-else>定金大于应结金额，有退款</p>
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
import { cinemaList, financeMsg, payEndMoney, getmoney } from '@/api/popPlan'
import { clean } from '@/fn/object'
import { isEqual } from 'lodash'
import { toast, warning } from '@/ui/modal.ts'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD'
@Component
export default class DlgEditCinema extends ViewBase {

  showDlg = false
  showmongy = 1
  id = 0

  async money(id: any) {
    try {
      await getmoney(id)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async init(id: any, freezeAmount: any, ids: any) {
    this.id = ids
    try {
       const { data } = await this.money(this.id)
      // const { data } = await financeMsg(id)
      if (data.availableAmount - (data.depositAmount || 0) > 0) {
        this.showmongy = 1
      }
      if ((data.depositAmount || 0) >  (data.needPayAmount || 0)) {
        this.showmongy = 2
      }
      this.showDlg = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async open() {
    try {
      if (this.showmongy) {
        await payEndMoney(this.id)
        this.cancel()
        this.$emit('uplist')
      } else {
        this.$router.push({
          name: 'finance-info'
        })
      }
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
/deep/ .ivu-modal-body {
  padding: 0;
}
.title {
  border-radius: 5px 5px 0 0;
  text-align: center;
  margin-bottom: 10px;
  font-size: 30px;
  font-weight: 500;
  background: #eee;
  padding: 20px;
  color: #00202d;
  i {
    position: absolute;
    right: -12px;
    top: -12px;
    display: block;
    width: 27px;
    height: 27px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(209, 216, 219, 1);
    &::before {
      display: block;
      content: "×";
      font-size: 26px;
      line-height: 24px;
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
    border-radius: 19px;
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
