<template>
  <label class="upload-label" :class="{'has-error': !!item.error}">
    <input type="file" :accept="accept" @change="onChange"/>
    <span class="upload-has flex-mid" v-if="item.fileId || isUploading">
      <Progress :percent="item.percent" :status="item.progressStatus" class="progress"/>
      <div class="name" v-if="item.clientName">{{item.clientName}}</div>
      <div class="error" v-if="item.error">{{item.error}}</div>
      <slot name="suffix"></slot>
    </span>
    <span class="upload-empty" v-else>
      <slot>上传文件</slot>
    </span>
  </label>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Uploader from '@/util/Uploader'
import { slice } from '@/fn/object'
import { FileItem, StartEvent, SuccessEvent } from './types'
import { cloneDeep } from 'lodash'

// 状态，loading 表示正在生成预览（针对图片），uploading 正在上传，done 完成，fail 失败
type Status = '' | 'loading' | 'uploading' | 'done' | 'fail'

/** 上传项 */
interface UploadItem extends FileItem {
  /** 状态 */
  status: Status
  /** 百分比 */
  percent: number
  /** 进度条状态 */
  progressStatus: string
  /** 错误消息，内部使用 */
  error: string
  blob?: File,
}

const defItem: UploadItem = {
  url: '',
  fileId: '',
  clientName: '',
  clientSize: 0,
  clientType: '',
  status: 'done',
  percent: 0,
  progressStatus: 'active',
  error: '',
}

@Component
export default class UploadLabel extends ViewBase {
  /**
   * 接受的文件类型
   */
  @Prop({ type: String, default: '*' }) accept!: string

  item: UploadItem = cloneDeep(defItem)

  isUploading = false

  onChange(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (files == null || files.length === 0) {
      return
    }

    const file = files[0]

    this.item = {
      url: '',
      fileId: '',
      clientName: file.name,
      clientSize: file.size,
      clientType: file.type,
      status: 'loading',
      percent: 0,
      progressStatus: 'active',
      error: '',
      blob: file,
    }

    this.isUploading = true

    this.$emit('start', { blob: file } as StartEvent)

    const uploader = new Uploader()
    uploader.on(this.uploadHandlers()).upload(file)
  }

  uploadHandlers() {
    return {
      begin: this.onUploadBegin.bind(this),
      progress: this.onUploadProgress.bind(this),
      done: this.onUploadDone.bind(this),
      fail: this.onUploadFail.bind(this),
      end: this.onUploadEnd.bind(this),
    }
  }

  onUploadBegin() {
    this.item!.status = 'uploading'
  }

  onUploadProgress(ev: ProgressEvent) {
    const { loaded, total } = ev
    const percent = Math.floor(loaded * 100 / total)
    this.item!.percent = percent
  }

  onUploadDone({ url, fileId }: any) {
    const item = this.item!
    item.url = url
    item.fileId = fileId
    item.status = 'done'
    item.progressStatus = 'success'
  }

  onUploadFail(ex: any) {
    const error = this.formatError(ex)
    const item = this.item!
    item.error = '上传失败：' + error
    item.status = 'fail'
    item.percent = 100
    item.progressStatus = 'wrong'
  }

  onUploadEnd() {
    this.isUploading = false
    const file = slice(this.item, 'url,fileId,clientName,clientSize,clientType') as FileItem
    const blob = this.item.blob
    this.$emit('success', { file, blob } as SuccessEvent)
  }
}
</script>

<style lang="less" scoped>
.upload-label {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  input[type=file] {
    display: none;
  }
}
.upload-has {
  width: 100%;
  height: 100%;
  flex-direction: column;
  line-height: 2;
}
.progress {
  max-width: 80%;
  margin-left: 50px;
}
.name,
.error {
  position: relative;
  display: block;
  max-width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.has-error {
  .name,
  .error {
    color: #ed4014;
  }
}
</style>
