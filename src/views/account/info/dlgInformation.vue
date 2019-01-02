<template>
  <div>
    <Modal v-model="value.visibleInforma" title="变更账号信息" width="800">
      <div class="digtext">
        说明：如有需要可对以下账号信息进行变更，账号变更申请提交后将由平台进行审核，
        账号变更期间不会影响账号的正常使用。
      </div>
      <Form :model="from" :label-width="173">
        <FormItem label="账号类型">
          <Input v-model="from.input"></Input>
        </FormItem>
        <FormItem label="公司名称">
          <Input v-model="from.input"></Input>
        </FormItem>
        <FormItem label="资质图片">
          <Input v-model="from.input"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer btnCenter">
        <Button type="error" class>取消</Button>
        <Button type="primary" class>变更数据</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any
  from = {
    input: 'xxxxxxx'
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';

/deep/ .ivu-modal-header {
  border-bottom: 0;
  padding: 10px 13px;
  background: #f9f9f9;
  /deep/ .ivu-modal-header-inner {
    font-weight: 0;
  }
}
/deep/ .ivu-modal-body {
  font-size: 14px;
  color: #444;
  .digtext {
    margin: 0 115px 25px;
    padding: 10px;
    color: rgba(68, 68, 68, 1);
    background: rgba(230, 247, 255, 1);
    border-radius: 2px;
    border: 1px solid rgba(145, 213, 255, 1);
    line-height: 23px;
  }
  .ivu-form-item {
    .ivu-form-item-label {
      padding: 14px 12px 14px 0;
    }
    /deep/ .ivu-form-item-content {
      .ivu-input-wrapper {
        width: 400px;
        input {
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
}
/deep/ .ivu-modal-footer {
  border-top: 0;
  padding-bottom: 30px;
  button {
    height: 50px;
    line-height: 50px;
    width: 160px;
    padding: 0;
    font-size: 16px;
    border: none;
    background: @c-button;
  }
  .ivu-btn-error {
    background: rgba(255, 248, 242, 1);
    color: @c-button;
    border: solid 1px @c-button;
    margin-right: 25px;
  }
}
</style>

