<template>
  <div class="page-wrap">
    <Form v-model="form" :rules="rules" label-position="left" :label-width="120"
      class="form" @submit.native.prevent="submit" ref="form" v-if="!allDone">
      <FormItem label="资质类型" prop="qualificationType">
        <Select v-model="form.qualificationType" placeholder="请选择资质类型">
          <Option v-for="it in qualificationTypeList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
      </FormItem>
      <FormItem label="资质编号" prop="qualificationCode">
        <Input v-model="form.qualificationCode" placeholder="请输入资质编号"/>
      </FormItem>
      <FormItem label="资质图片" prop="images">
        <div class="upload-wrap">
          <Upload v-model="imageList" :max-count="3" multiple accept="images/*"
            confirm-on-del/>
          <div class="upload-tip">支持1或3张，格式为jpg/jpeg/png，大小不超过5M的图片</div>
        </div>
      </FormItem>

      <div class="submit-ln">
        <Button @click="toHome" class="btn-pass">稍后补充</Button>
        <Button type="primary" html-type="submit" class="btn-submit"
          :disabled="submitDisabled">注册完成</Button>
      </div>
    </Form>
    <div class="all-done" v-else>
      <h3 class="all-done-title">注册完成</h3>
      <p class="all-done-tip"><em>{{allDoneSecond}}秒</em>后将自动返回首页</p>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { scrollToError } from '@/util/form'
import { getQualificationTypeList, putAdditional } from '@/api/company'
import { KeyTextControlStatus } from '@/util/types'
import { filterByControlStatus } from '@/util/dealData'
import Upload, { FileItem } from '@/components/upload'
import { countDown } from '@/fn/timer'

@Component({
  components: {
    Upload
  }
})
export default class Main extends ViewBase {
  form = {
    qualificationType: '',
    qualificationCode: '',
    images: [] as string[],
  }

  imageList: FileItem[] = []

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
        validator: (rule: any, value: any, callback: any) => {
          const list = this.form.images
          list.length == 0
            ? callback(new Error('请上传资质图片'))
            : callback()
        }
      }
    ],
  }

  submitDisabled = false

  allDone = true
  allDoneSecond = 0

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

  async delayToHome() {
    await countDown(3, sec => this.allDoneSecond = sec)
    this.toHome()
  }

  async submit() {
    const form = this.$refs.form as any
    const valid = await form.validate()
    if (!valid) {
      return this.scrollToError()
    }

    this.submitDisabled = true

    try {
      const formData = { ...this.form }
      await putAdditional(formData)
      this.allDone = true
      this.delayToHome()
    } catch (ex) {
      ((this as any)[`onSubmit${ex.code}`] || this.handleError).call(this, ex)
    } finally {
      this.submitDisabled = false
    }
  }

  @Watch('imageList', { deep: true })
  watchImageList(value: FileItem[]) {
    this.form.images = value.map(it => it.fileId)
    ; (this.$refs.form as any).validateField('images')
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/site/login.less';
@import './common.less';

.page-wrap {
  width: 600px;
  margin: 80px auto 0;
}

.upload-wrap {
  position: relative;
  margin-top: 10px;
}
.upload-tip {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 14px;
  color: @c-sub-text;
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

.all-done {
  margin-top: 156px;
  text-align: center;
}
.all-done-title {
  color: @c-text;
  font-size: 24px;
  font-weight: normal;
}
</style>
