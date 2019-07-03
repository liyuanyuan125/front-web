<template>
  <Modal v-model='showDlg'
  :transfer='false'
  :width='560'
  :closable='false'
  :mask-closable='false'
  :styles="{top: '30px'}">
    <div class="title">
      <h3>修改档期</h3>
      <i @click="cancel"></i>
    </div>
    <div>
      <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="form">
        <FormItem label="投放排期:" class="timer" :labelWidth='100' prop="advertime">
          <DatePicker v-model="form.advertime"
            type="daterange" placement="bottom-end" placeholder="请选择日期" ></DatePicker>
          <!-- <weekDatePicker  style="margin-left: 4px" type="daterange" placeholder="请选择日期"></weekDatePicker> -->
        </FormItem>
      </Form>
    </div>
    <div slot="footer" class="foot">
      <Button class="foot-cancel-button default-btn" type="info" @click="cancel">取消</Button>
      <Button class="foot-button open-button" type="primary" @click="open">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { updatedates } from '@/api/popPlan'
import { clean } from '@/fn/object'
import { toast, warning } from '@/ui/modal.ts'
import moment from 'moment'

const timeFormat = 'YYYYMMDD'
@Component
export default class DlgEditCinema extends ViewBase {
  showDlg = false
  form: any = {
    advertime: [],
    beginDate: '',
    endDate: ''
  }

  get rule() {
    const msgtime = ( rules: any, value: any, callback: any) => {
      if (value[0] == '') {
        callback(new Error('请选择投放排期'))
      } else {
        const begin: any = (new Date(value[0]) as any).getTime()
        if ((begin - new Date().getTime()) <= 0 ) {
          callback(new Error('投放时间必须大于当前时间'))
        }
        if (new Date(value[0]).getDay() != 4) {
          callback(new Error('开始时间必须为周四'))
        }
        if (new Date(value[1]).getDay() != 3) {
          callback(new Error('结束时间必须为周3'))
        }
        const end: any = (new Date(value[1]) as any).getTime()
        const flag = (end - begin) / 86400000 % 7
        if (flag == 6) {
          callback()
        } else {
          callback(new Error('投放排期为7的倍数'))
        }
      }
    }
    return {
      advertime: [
        {
          validator: msgtime,
          trigger: 'change'
        }
      ]
    }
  }

  init(date: any) {
    this.form.advertime = [
      new Date(this.formatDate(date.begin)),
      new Date(this.formatDate(date.end))
    ]
    this.showDlg = true
  }

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  cancel() {
    this.showDlg = false
  }

  async open() {
    try {
      await updatedates({
        planId: this.$route.params.setid,
        beginDate: this.form.beginDate,
        endDate: this.form.endDate
      })
      const uplist = {
        begin: this.form.beginDate,
        end: this.form.endDate
      }
      this.$emit('done', uplist)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('form.advertime', {deep: true})
  watchformAdvertime(val: any) {
    if (val.length > 0) {
      this.form.beginDate = moment(val[0]).format(timeFormat)
      this.form.endDate = moment(val[1]).format(timeFormat)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
// /deep/ .ivu-modal-body {
// }
/deep/ .ivu-modal-body {
  min-height: 300px;
}
.title {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #00202d;
  margin-bottom: 60px;
  i {
    position: absolute;
    right: -20px;
    top: -20px;
    display: block;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(209, 216, 219, 1);
    &::before {
      content: "×";
      font-size: 34px;
      line-height: 40px;
      text-align: center;
    }
  }
}
.default-btn {
  width: 100px;
  vertical-align: middle;
  .button-style(#00202d, rgba(0, 0, 0, 0));
  border-radius: 25px;
  img {
    vertical-align: middle;
  }
}
.open-button {
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.foot {
  text-align: center;
}
</style>
