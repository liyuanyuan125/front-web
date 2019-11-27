<template>
<loginLayout >
  <div class="main-wrap">
    <div class="tablist">
      <p class="systerm">
          <span>激活邮箱</span>
      </p>
    </div>
    <Form :model="form" ref="form" :rules="rules" label-position="top">
      <FormItem label="密码" prop="firstPass" class="item-top">
        <Input
          v-model="form.firstPass"
          type="password"
          :maxlength="16"
          placeholder="请输入包含大小写的英文字母与数字的组合，6-16 位"
        ></Input>
      </FormItem>
      <FormItem label="重置密码" prop="secondPass">
        <Input
          v-model="form.secondPass"
          type="password"
          :maxlength="16"
          placeholder="请输入包含大小写的英文字母与数字的组合，6-16 位"
        ></Input>
      </FormItem>
    </Form>
    <div class="btn-center-footer">
      <Button type="primary" long class="submit" @click="handleInforma">激活邮箱</Button>
    </div>
  </div>
  </loginLayout>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { activeEmailSumbit } from '@/api/user'
import { confirm, toast } from '@/ui/modal'
import { validatePassword } from '@/util/validateRules'
import loginLayout from './login/loginLayout.vue'

@Component({
  components: {
    loginLayout
  }
})
export default class Main extends ViewBase {
  ticket = ''

  form = {
    firstPass: '',
    secondPass: ''
  }

  get rules() {
    return {
      firstPass: [
        {
          required: true,
          trigger: 'blur',
          validator(rule: any, value: string, callback: any) {
            const msg = validatePassword(value)
            msg ? callback(new Error(msg)) : callback()
          }
        }
      ],
      secondPass: [
        {
          required: true,
          trigger: 'blur',
          validator: (rule: any, value: string, callback: any) => {
            value != this.form.firstPass
              ? callback(new Error('两次密码不一致，请重新输入'))
              : callback()
          }
        }
      ]
    }
  }

  mounted() {
    const url = this.$route.path
    const lastNum = url.lastIndexOf('/') + 1
    this.ticket = url.substr(lastNum)
  }

  toLogin() {
    this.$router.push({ name: 'login' })
  }

  async handleInforma() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) {
      return
    }
    try {
      await activeEmailSumbit({
        password: this.form.firstPass,
        ticket: this.ticket
      })
      toast('已激活成功')
      this.$router.push({ name: 'login' })
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import './login/common.less';
.item-top {
  padding-top: 20px;
}
.main-wrap {
  padding-top: 40px;
  padding-bottom: 60px;
}
.systerm {
  font-size: 31px;
  padding: 31px 0 5px;
  text-align: center;
}
/deep/ .ivu-form {
  .ivu-form-item-label {
    font-size: 16px;
    color: #fff;
  }
}
</style>
