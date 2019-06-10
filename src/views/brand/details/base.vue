<template>
  <div class="base-home">
      <h2 class="model-table-title list-title">
         <span class="count">品牌基础信息</span>
         <Button type="primary"  class="btn-edit" @click="toEdit">编辑基础信息</Button>
      </h2>
      <Form ref="form" :model="form" :rules="rule" :label-width="110" class="edit-input base-form">
        <FormItem label="简体中文名称" prop="name">
          <span v-if="readonly" class="item-only">{{form.name}}</span>
          <Input v-else v-model="form.name"  />
        </FormItem>
        <FormItem label="英文名" >
          <span v-if="readonly" class="item-only">{{form.enName}}</span>
          <Input v-else v-model="form.enName"  />
        </FormItem>
        <FormItem label="创立时间" prop="createTime">
          <span v-if="readonly" class="item-only">{{form.createTime}}年</span>
          <Input v-else v-model="form.createTime" >年</Input>
        </FormItem>
        <FormItem label="国别" prop="nationality">
          <span v-if="readonly" class="item-only">{{form.nationality}}</span>
          <Select v-else v-model="form.nationality" filterable >
              <Option value="1">1</Option>
          </Select>
        </FormItem>
        <FormItem label="所属行业" prop="type">
          <span v-if="readonly" class="item-only">{{form.type}}</span>
          <Select v-else v-model="form.type" filterable >
              <Option value="1">1</Option>
          </Select>
        </FormItem>
        <FormItem label="创始人" prop="author">
          <span v-if="readonly" class="item-only">{{form.author}}</span>
          <Input v-else v-model="form.author" />
        </FormItem>
        <FormItem label="公司口号" prop="slogan">
          <span v-if="readonly" class="item-only">{{form.slogan}}</span>
          <Input v-else v-model="form.slogan" style="width: 100%" />
        </FormItem>
        <FormItem label="公司简介" prop="introdution">
          <span v-if="readonly" class="item-only">{{form.introdution}}</span>
          <Input v-else v-model="form.introdution" type="textarea" style="width: 100%" :rows="4"  />
        </FormItem>
      </Form>
      <div class="footer-btn" v-if="!readonly">
          <Button class="btn-cancel" @click="handleCancel">取消</Button>
          <Button type="primary" class="btn-add" @click="baseSubmit">提交审核</Button>
      </div>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import eventDate from '../eventBus'


@Component
export default class Main extends ViewBase {
  form = {}

  readonly = true
  baseList = {
    name: '园园',
    enName: 'yuanyuan.li',
    createTime: '8---00',
    nationality: 'china',
    type: 'qiche',
    author: 'yuanyuan',
    slogan: '心所想',
    introdution: '奔驰，德国百年汽车品牌，汽车文明的先驱者与引领者，'
  }

  get rule() {
    return {
      name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
      createTime: [{ required: true, message: '请输入创立时间', trigger: 'change' }],
      nationality: [{ required: true, message: '请输入国别', trigger: 'change' }],
      type: [{ required: true, message: '请输入所属行业', trigger: 'change' }],
      author: [{ required: true, message: '请输入创始人', trigger: 'change' }],
      slogan: [{ required: true, message: '请输入公司口号', trigger: 'change' }],
      introdution: [{ required: true, message: '请输入公司简介', trigger: 'change' }],
    }
  }

  mounted() {
    const {name, enName, createTime, nationality, type, author, slogan, introdution} = this.baseList
    this.form = {
      name,
      enName,
      createTime,
      nationality,
      type,
      author,
      slogan,
      introdution
    }
  }

  async baseSubmit() {
    const volid = await (this.$refs.form as any).validate()
    if (!volid) { return }
  }

  toEdit() {
    this.readonly = false
    eventDate.$emit('uploadImg', this.readonly)
  }
  handleCancel() {
    this.readonly = true
    eventDate.$emit('uploadImg', this.readonly)
  }

  destroyed() {
    eventDate.$emit('uploadImg', true)
  }
}
</script>
<style lang='less' scoped>
@import '~@/views/brand/less/common.less';
.base-form {
  padding: 30px 30px 10px 20px;
  .item-only {
    display: block;
    font-size: 14px;
    color: #fff;
    padding-top: 3px;
  }
}
.footer-btn {
  text-align: center;
  position: absolute;
  bottom: 30px;
  left: 50%;
}
/deep/ .ivu-form {
  .ivu-form-item-label {
    color: #b3bcc0;
  }
  .ivu-form-item-content {
    padding-left: 24px;
  }
  .ivu-form-item-error-tip {
    left: 24px;
  }
}
/deep/ .ivu-select {
  width: 400px;
  .ivu-select-dropdown {
    width: auto;
  }
}
</style>