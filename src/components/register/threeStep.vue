<template>
  <div class="threeStep">
    <Form ref="form" :model="form" :rules="rules" label-position="left" :label-width="120">
      <FormItem label="资质类型" prop="type">
        <Select v-model="form.type">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="资质编号" prop="code">
        <Input v-model="form.code" placeholder="请输入资质编号"></Input>
      </FormItem>
      <FormItem label="资质图片" prop="code">
        <Input v-model="form.code" placeholder="请输入公司名称，并与营业执照保持一致"></Input>
      </FormItem>
    </Form>
  </div>
</template>
<script lang='ts'>
import { Component } from 'vue-property-decorator'
import View from '@/util/View'

@Component
export default class Main extends View {
  form = {
    type: '',
    code: ''
  }
  rules = {}
  cityList = [
    {
      value: 'New York',
      label: 'New York'
    },
    {
      value: 'London',
      label: 'London'
    },
    {
      value: 'Sydney',
      label: 'Sydney'
    }
  ]
}
</script>
<style lang='less' scoped>
@import '../../site/login.less';
.threeStep {
  width: 600px;
  margin: 80px auto 40px;
  & > form {
    border-bottom: 1px solid rgba(239, 239, 239, 1);
    margin-top: 40px;
  }
  .ivu-input-wrapper {
    /deep/ input {
      .form-input;
    }
  }
  .ivu-form-item {
    margin-bottom: 40px;
    /deep/ label {
      .form-label;
    }
  }
  /deep/ .ivu-select-selection {
    height: 50px;
  }
  /deep/ .ivu-select-placeholder {
    height: 50px;
    line-height: 50px;
    font-size: 15px;
  }
}
</style>


