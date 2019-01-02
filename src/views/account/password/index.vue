<template>
  <div class="page">
    <Form :model="from" class="form" :label-width="100">
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
      <!-- <Button type="error" class="">取消</Button> -->
      <Button type="primary" class>确定修改</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  from = {
    input: 'xxxxxxx'
  }
  async mounted() {}
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.page {
  background: #fff;
  height: 100%;
  .form {
    padding-top: 30px;
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

  /deep/ .dialog-footer {
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
      margin-top: 50px;
    }
  }
}
</style>
