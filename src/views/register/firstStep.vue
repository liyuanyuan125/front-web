<template>
  <div class="firstNext">
    <Row type="flex" justify="space-between" class="row">
      <label class="adver" :class="{active:model1}">
        <Checkbox class="display" v-model="model1"></Checkbox>
      </label>
      <label class="resource" :class="{active:model2}">
        <Checkbox class="display" v-model="model2"/>
      </label>
    </Row>
    <Form ref="form" :model="form" :rules="rulesfrom" label-position="left" :label-width="120">
      <FormItem label="登录邮箱" prop="email">
        <Input v-model="form.email" placeholder="请输入登录邮箱"/>
      </FormItem>
      <FormItem label="邮箱验证码" prop="emailCode">
        <Input v-model="form.emailCode" :maxlength="6" style="width:260px;" placeholder="请输入邮箱验证码"/>
        <span @click="getCode" class="codemess">{{codeMess}}</span>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="form.password" :maxlength="16" placeholder="请设置包含大小写的英文字母与数字的组合，8-16 位"/>
      </FormItem>
      <FormItem label="重复密码" prop="confirm">
        <Input v-model="form.confirm" :maxlength="16" placeholder="请再次输入密码"/>
      </FormItem>
      <FormItem label="公司名称" prop="companyName">
        <Input v-model="form.companyName" placeholder="请输入公司名称，并与营业执照保持一致"/>
      </FormItem>
      <FormItem label="公司所在地" prop="city">
        <Select v-model="form.city">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="联系人姓名" prop="personName">
        <Input v-model="form.personName" placeholder="请输入您的姓名"/>
      </FormItem>
      <FormItem label="手机号码" prop="mobile">
        <Input v-model="form.mobile" :maxlength="11" placeholder="请输入您的手机号码"/>
      </FormItem>
      <FormItem label="个人邮箱" prop="personEmail">
        <Input v-model="form.personEmail" placeholder="请输入您的个人邮箱"/>
      </FormItem>
      <FormItem>
        <p>
          <Checkbox v-model="single">我同意并遵守
            <router-link to>《平台运营条款》</router-link>
          </Checkbox>
        </p>
      </FormItem>
    </Form>
    <Button type="warning" @click="next" long class="submit">下一步</Button>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { countDown } from '@/fn/timer'
import { email } from '@/util/common.ts'
import { validatePassword, validataTel } from '@/util/validateRules'

@Component
export default class Main extends ViewBase {
  single = true
  isRun = false
  codeMess = '获取邮箱验证码'

  model1 = false
  model2 = false

  form = {
    email: '',
    emailCode: '',
    password: '',
    confirm: '',
    companyName: '',
    city: '',
    area: '',
    personName: '',
    mobile: '',
    personEmail: ''
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
  rulesfrom = {
    email: [
      { required: true, message: '请输入登录邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
    ],
    emailCode: [
      { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
    ],
    password: [
      {
        required: true,
        message: '请输入你的密码',
        trigger: 'blur'
      },
      {
        trigger: 'blur',
        validator(rule: any, value: string, callback: any) {
          const msg = validatePassword(value)
          msg ? callback(new Error(msg)) : callback()
        }
      }
    ],
    confirm: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        trigger: 'blur',
        validator: (rule: any, value: string, callback: any) => {
          const msg = '两次密码不一致,请重新输入'
          value != this.form.password ? callback(new Error(msg)) : callback()
        }
      }
    ],
    companyName: [
      { required: true, message: '请输入您的公司名称', trigger: 'blur' }
    ],
    city: [{ required: true, message: '请输入您的城市', trigger: 'blur' }],
    personName: [
      { required: true, message: '请输入您的姓名', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入您的手机号', trigger: 'blur' },
      {
        trigger: 'blur',
        validator(rule: any, value: string, callback: any) {
          const msg = validataTel(value)
          msg ? callback(new Error(msg)) : callback()
        }
      }
      ],
    personEmail: [
      { required: true, message: '请输入个人邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
    ]
  }

  async downTime() {
    this.isRun = true
    await countDown(10, sec => {
      this.codeMess = sec + 's'
    })

    this.codeMess = '重新获取验证码'
    this.isRun = false
  }

  getCode() {
    if (email(this.form.email)) {
      if (!this.isRun) {
        this.downTime()
      }
    } else {
      this.showWaring('用户邮箱格式有误')
    }
  }

  async next() {
    const valid = await (this.$refs.form as any).validate()
    if (valid) {
      this.$emit('iscurrent', 1)
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../site/login.less';
.imgstyle {
  display: inline-block;
  width: 275px;
  height: 120px;
  border: solid 1px #fff;
  background-size: contain;
}
.imghover {
  border: solid 1px #ff1000;
  cursor: pointer;
}

.steps {
  border-bottom: solid 1px #efefef;
  padding-bottom: 20px;
  .wid-auto;
  /deep/ .ivu-steps .ivu-steps-tail > i {
    position: relative;
    top: -2px;
  }
  /deep/ .ivu-steps {
    width: 500px;
    margin: 0 auto;
  }
  /deep/ .ivu-steps .ivu-steps-title {
    font-weight: none;
  }
  /deep/ .ivu-steps .ivu-steps-head-inner {
    width: 16px;
    height: 16px;
    line-height: 14px;
    font-size: 12px;
    margin: 2px 5px 0 0;
  }
  /deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
    border-color: @theme-color;
    background-color: @theme-color;
  }
  /deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-title {
    color: @text-color;
  }
}
.firstNext {
  width: 600px;
  margin: 80px auto 40px;
  & > form {
    margin-top: 40px;
    border-bottom: 1px solid rgba(239, 239, 239, 1);
    .ivu-form-item {
      margin-bottom: 40px;
      /deep/ .ivu-form-item-label {
        .form-label;
      }
      /deep/ .ivu-form-item-content {
        /deep/ .ivu-select-selection {
          height: 50px;
          line-height: 50px;
          .ivu-select-placeholder {
            height: 50px;
            line-height: 50px;
            font-size: 15px;
          }
        }
        input {
          .form-input;
        }
        span.codemess {
          width: 200px;
          display: block;
          .form-input;

          cursor: pointer;
          line-height: 50px;
          border: solid 1px #dcdee2;
          text-align: center;
          background: #fff;
          position: absolute;
          right: 0;
          top: 0;
          color: @theme-color;
        }
      }
    }
  }
  .row {
    label.active {
      .imghover;
    }
  }
  .display {
    display: none;
  }
  .adver {
    .imgstyle;

    background: url('../../assets/login/advertising.png') no-repeat;
    &:hover {
      .imghover;
    }
  }
  .resource {
    .imgstyle;

    background: url('../../assets/login/resource.png') no-repeat;
    &:hover {
      .imghover;
    }
  }
}
</style>
