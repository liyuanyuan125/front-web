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
      <FormItem label="资质图片" prop="code">
        <div class="demo-upload-list" v-for="item in uploadList" :key="item">
          <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
        <Upload
          ref="upload"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          type="drag"
          action="//jsonplaceholder.typicode.com/posts/"
          style="display: inline-block;width:58px;"
        >
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
        <Modal title="View Image" v-model="visible">
          <img
            :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'"
            v-if="visible"
            style="width: 100%"
          >
        </Modal>
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
  imgName = ''
  visible = false
  uploadList = []
  mounted() {
    this.uploadList = (this.$refs.upload as any).fileList
  }
  handleView(name: any) {
    this.imgName = name
    this.visible = true
  }
  handleRemove(file: any) {
    // const fileList = (this.$refs.upload as any).fileList
    // (this.$refs.upload as any).fileList.splice(fileList.indexOf(file), 1)
  }
  handleSuccess(res: any, file: any) {
    file.url =
      'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
    file.name = '7eb99afb9d5f317c912f08b5212fd69a'
  }
  handleFormatError(file: any) {
    this.$Notice.warning({
      title: 'The file format is incorrect',
      desc:
        'File format of ' +
        file.name +
        ' is incorrect, please select jpg or png.'
    })
  }
  handleMaxSize(file: any) {
    this.$Notice.warning({
      title: 'Exceeding file size limit',
      desc: 'File  ' + file.name + ' is too large, no more than 2M.'
    })
  }
  handleBeforeUpload() {
    const check = this.uploadList.length < 5
    if (!check) {
      this.$Notice.warning({
        title: 'Up to five pictures can be uploaded.'
      })
    }
    return check
  }
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
.demo-upload-list{
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
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>


