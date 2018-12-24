<template>
    <div class='secondNext'>
        <Form ref='form' :model='form' :rules='rules' label-position='left' :label-width='120'>
            <FormItem label='公司名称' prop='companyName'>
                <Input v-model='form.companyName' placeholder='请输入公司名称，并与营业执照保持一致'></Input>
            </FormItem>
            <FormItem label='公司所在地' prop='city'>
               <Select v-model="form.city" >
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="form.area" >
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
             <FormItem label='联系人姓名' prop='personName'>
                <Input v-model='form.personName' placeholder='请输入您的姓名'></Input>
            </FormItem>
             <FormItem label='手机号码' prop='mobile'>
                <Input v-model='form.mobile' placeholder='请输入您的手机号码'></Input>
            </FormItem>
             <FormItem label='个人邮箱' prop='personEmail'>
                <Input v-model='form.personEmail' placeholder='请输入您的个人邮箱'></Input>
            </FormItem>
        </Form> 
    </div>
</template>
<script lang="ts">
import { Component} from 'vue-property-decorator'
import View from '@/util/View'
@Component
export default class Main extends View {
    form = {
        companyName: '',
        city: '',
        area: '',
        personName: '',
        mobile: '',
        personEmail: ''
    }
    rules = {
        companyName: [ { required: true, message: '请输入您的公司名称', trigger: 'blur' }],
        city: [ { required: true, message: '请输入您的城市', trigger: 'blur' }],
        area: [ { required: true, message: '请输入您的区', trigger: 'blur' }],
        personName: [ { required: true, message: '请输入您的姓名', trigger: 'blur' }],
        mobile: [ { required: true, message: '请输入您的手机号', trigger: 'blur' }],
        personEmail: [
             { required: true, message: '请输入个人邮箱', trigger: 'blur' },
             { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
        ]
    }
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
<style lang="less" scoped>
@import '../../site/login.less';
.secondNext{
    width: 600px;
  margin: 80px auto 40px;
  & > form {
       border-bottom: 1px solid rgba(239,239,239,1);
    margin-top: 40px;
  }
  .ivu-form-item {
       margin-bottom: 40px;
    /deep/ label {
      .form-label;
    }
  }
  /deep/ .ivu-select-selection{
    height: 50px;
  }
  /deep/ .ivu-select-placeholder{
      height: 50px;
      line-height: 50px;
      font-size:15px;
  }
  .ivu-select{ 
      width:230px;
      &:last-child{
          position:absolute;
          right:0;
          top:0;
      }
  }
  .ivu-input-wrapper {
    /deep/ input {
      .form-input;
    }
  }
}
</style>

