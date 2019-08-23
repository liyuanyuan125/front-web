<template>
  <div :class="{
    'oss-uploader': true,
    [`oss-uploader-${status}`]: true,
    'oss-uploader-readonly': readonly,
  }">
    <label class="handle" v-if="status == 'none' && !readonly">
      <slot name="text">
        <span>上传</span>
      </slot>
      <input type="file" :accept="accept" @change="onChange">
    </label>

    <slot name="progress" v-if="status != 'none'">
      <div class="progress">
        <CircleProgress :percent="percent" :fail="error != ''"/>
        <TinyLoading class="loading" v-if="status == 'loading'"/>
        <div class="error" v-if="error">{{error}}</div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import OssUploader, { Options } from '@/util/OssUploader'
import TinyLoading from '@/components/TinyLoading.vue'
import CircleProgress from '@/components/circleProgress'
import { slice } from '@/fn/object'
import { isEqual } from 'lodash'
import { FileItem } from './types'

// 状态，loading 表示加载（文件上传之前要计算分片等），uploading 正在上传，done 完成
type Status = 'none' | 'loading' | 'uploading' | 'done' | 'fail'

const defaultItem: FileItem = {
  url: '',
  fileId: '',
  clientName: '',
  clientSize: 0,
  clientType: ''
}

const toFileItem = (item: any) => slice(item, Object.keys(defaultItem)) as FileItem

const hasChange = (aitem: any, bitem: any) => {
  const pureAItem = toFileItem(aitem)
  const pureBItem = toFileItem(bitem)
  return !isEqual(pureAItem, pureBItem)
}

@Component({
  components: {
    TinyLoading,
    CircleProgress
  }
})
export default class OssUpload extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: [Object, String], default: () => ({}) }) value!: FileItem | string

  /**
   * 接受的文件类型，默认为 *
   */
  @Prop({ type: String, default: '*' }) accept!: string

  /**
   * 是否为只读，默认为 false
   */
  @Prop({ type: Boolean, default: false }) readonly!: boolean

  /**
   * 选项
   */
  @Prop({ type: Object, default: () => ({}) }) options!: Options

  model: FileItem | null = null

  status: Status = 'none'

  percent = 0

  error = ''

  @Watch('value', { deep: true, immediate: true })
  async watchValue(value: FileItem | string) {
    const item = typeof value === 'string' ? { url: value } : value
    if (hasChange(item, this.model)) {
      this.model = {
        ...defaultItem,
        ...item
      } as FileItem
    }
  }

  @Watch('model', { deep: true })
  watchModel(value: FileItem) {
    if (hasChange(value, this.value)) {
      const nude = toFileItem(value)
      this.$emit('input', nude)
    }
  }

  onChange(ev: Event) {
    const input = ev.target as HTMLInputElement
    const [file = null] = input.files || []
    if (file == null) {
      return
    }

    // 清空以便下次可以再次触发 onChange
    setTimeout(() => {
      input.value = ''
    })

    this.model = {
      ...defaultItem,
      clientName: file.name,
      clientSize: file.size,
      clientType: file.type
    }

    this.status = 'loading'
    this.percent = 0
    this.error = ''

    const uploader = new OssUploader(this.options)
    uploader.on({
    })
  }

  // onUploadThumb(uqid: string, { thumb }: any) {
  //   // TODO: 暂时不用 thumb，chrome 预览图报错
  // }

  // onUploadBegin(uqid: string) {
  //   const item = this.model.find(it => it.uqid === uqid)!
  //   item.status = 'uploading'
  // }

  // onUploadProgress(uqid: string, ev: ProgressEvent) {
  //   const { loaded, total } = ev
  //   const percent = Math.floor((loaded * 100) / total)
  //   const item = this.model.find(it => it.uqid === uqid)!
  //   item.percent = percent
  // }

  // onUploadDone(uqid: string, { url, fileId }: any) {
  //   const item = this.model.find(it => it.uqid === uqid)!
  //   item.url = url
  //   item.fileId = fileId
  //   item.status = 'done'
  // }

  // onUploadFail(uqid: string, ex: any) {
  //   const error = this.formatError(ex)
  //   const item = this.model.find(it => it.uqid === uqid)!
  //   item.error = error
  //   item.status = 'fail'
  // }

  // onUploadEnd(uqid: string) {
  // }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
</style>
