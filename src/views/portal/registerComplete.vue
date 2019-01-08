<template>
  <div class="page-wrap">
    <Form v-model="form" :rules="rules" label-position="left" :label-width="120"
      class="form" @submit.native.prevent="submit" ref="form">
      <FormItem label="资质类型" prop="qualificationType">
        <Select v-model="form.qualificationType" placeholder="请选择资质类型">
          <Option v-for="it in qualificationTypeList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
      </FormItem>
      <FormItem label="资质编号" prop="qualificationCode">
        <Input v-model="form.qualificationCode" placeholder="请输入资质编号"/>
      </FormItem>
      <FormItem label="资质图片" prop="images"></FormItem>
    </Form>

    <div class="submit-ln">
      <Button @click="toHome" class="btn-pass">稍后补充</Button>
      <Button type="primary" html-type="submit" class="btn-submit"
        :disabled="submitDisabled">注册完成</Button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { scrollToError } from '@/util/form'
import { getQualificationTypeList } from '@/api/company'
import { KeyTextControlStatus } from '@/util/types'
import { filterByControlStatus } from '@/util/dealData'

@Component
export default class Main extends ViewBase {
  form = {
    qualificationType: '',
    qualificationCode: '',
    images: [],
  }

  rules = {
    qualificationType: [
      { required: true, message: '请选择资质类型', trigger: 'blur' }
    ],
    qualificationCode: [
      { required: true, message: '请输入资质编号', trigger: 'blur' }
    ],
    images: [
      {
        required: true,
        trigger: 'change',
        validator(rule: any, value: string[], callback: any) {
          value.length == 0
            ? callback(new Error('请上传资质图片'))
            : callback()
        }
      }
    ],
  }

  submitDisabled = false

  qualificationTypeList: KeyTextControlStatus[] = []

  async created() {
    try {
      const list = await getQualificationTypeList()
      const typeList = filterByControlStatus(list)
      this.qualificationTypeList = typeList
      // 优化选择，若只有一项，默认选中
      if (typeList.length == 1) {
        this.form.qualificationType = String(typeList[0].key)
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  toHome() {
    this.$router.push({ name: 'home' })
  }

  scrollToError() {
    const form = this.$refs.form as any
    this.$nextTick(() => scrollToError(form))
  }

  async submit() {
    const form = this.$refs.form as any
    const valid = await form.validate()
    if (!valid) {
      return this.scrollToError()
    }
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/login.less';
@import './common.less';

.page-wrap {
  width: 600px;
  margin: 80px auto 40px;
}

.submit-ln {
  width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.btn-pass,
.btn-submit {
  width: 280px;
}
</style>


