<template>
  <div class="threeStep">
    <Form ref="form" :model="form" :rules="rules" label-position="left" :label-width="120">
      <FormItem label="资质类型" prop="type">
        <Select v-model="form.type">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="资质编号" prop="code">
        <Input v-model="form.code" placeholder="请输入资质编号"/>
      </FormItem>
      <FormItem label="资质图片" prop="code"></FormItem>
    </Form>
    <div class="regSubmit">
      <Button type="warning" @click="toLogin">稍后补充</Button>
      <Button type="warning" @click="submit">注册完成</Button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  form = {
    type: '',
    code: ''
  }
  rules = {}
  cityList = [
    {
      value: 'New York',
      label: 'New York'
    }
  ]
  submit() {
    this.$router.push({ name: 'regsucess' })
  }
  toLogin() {
    this.$router.push({ name: 'login' })
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/login.less';

.threeStep {
  width: 600px;
  margin: 80px auto 40px;
  & > form {
    border-bottom: 1px solid rgba(239, 239, 239, 1);
    margin-top: 40px;
    margin-bottom: 40px;
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
  .regSubmit {
    width: 600px;
    margin: 0 auto;
    position: relative;
    button {
      width: 280px;
      .form-btn;

      background: #fff;
      color: rgba(254, 129, 53, 1);
      &:last-child {
        background: rgba(254, 129, 53, 1);
        position: absolute;
        right: 0;
        top: 0;
        color: #fff;
      }
    }
  }
}

.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>


