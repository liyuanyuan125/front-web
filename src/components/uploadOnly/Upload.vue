<template>
  <div :class="['upload-box',
    readonly ? 'upload-box-readonly' : '',
    canAdd ? '' : 'upload-box-cannot-add']">
    <form  ref="form" v-if="isEdit">
      <!-- v-if="canAdd" -->
      <label class="upload-add-in">
        <img src='./assets/add-icon.png' width="20" class="edit-btn" />
        <input type="file" :accept="accept" @change="onChange" />
      </label>
    </form>
    <ul name="list" tag="ul" class="upload-list">
      <li v-for="(it, i) in inValue" :key="it.uqid" class="upload-item">
        <img :src="it.url" v-if="it.url">
        <!-- <div class="action-cover" v-if="it.status == 'done'">
        </div> -->
        <div class="loading-cover" v-if="it.status == 'loading'">
          <TinyLoading/>
        </div>
        <div class="progress-cover" v-else-if="it.status == 'uploading'">
          <Progress :percent="it.percent" status="success" hide-info/>
        </div>
      </li>
    </ul>
    <Modal v-model="viewerShow" title="查看图片" width="888">
      <img :src="viewerImage" class="viewer-image">
    </Modal>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import Uploader from '@/util/Uploader'
import { alert, confirm } from '@/ui/modal'
import { random } from '@/fn/string'
import { slice } from '@/fn/object'
import { isEqual } from 'lodash'
import { FileItem } from './types'

const genUqid = () => random('upload')

// 状态，loading 表示正在生成预览（针对图片），uploading 正在上传，done 完成
type Status = '' | 'loading' | 'uploading' | 'done' | 'fail'

/** 上传项 */
interface UploadItem extends FileItem {
  /** 状态 */
  status: Status
  /** 百分比 */
  percent: number
  /** 错误消息，内部使用 */
  error: string
}

const defItem: UploadItem = {
  url: '',
  fileId: '',
  clientName: '',
  clientSize: 0,
  clientType: '',
  status: 'done',
  percent: 0,
  uqid: '',
  error: '',
}

const allDone = (item: FileItem | UploadItem) =>
  !('status' in item) || item.status == 'done'

const toFileItem = (item: FileItem | UploadItem) =>
  slice(item, 'uqid,url,fileId,clientName,clientSize,clientType') as FileItem

const hasChange = (alist: FileItem[], blist: FileItem[]) => {
  const alistDone = alist.filter(allDone).map(toFileItem)
  const blistDone = blist.filter(allDone).map(toFileItem)
  return !isEqual(alistDone, blistDone)
}

@Component({
  components: {
    TinyLoading
  }
})
export default class Upload extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Array, default: () => [] }) value!: FileItem[]

  /**
   * 接受的文件类型，默认为 *
   */
  @Prop({ type: String, default: '*' }) accept!: string

  /**
   * 上传文件的最大个数，默认 1 个
   */
  @Prop({ type: Number, default: 1 }) maxCount!: number

  /**
   * 是否为只读，默认为 false
   */
  @Prop({ type: Boolean, default: false }) readonly!: boolean

  /**
   * 是否在删除前进行 confirm 提示，默认为 false
   */
  @Prop({ type: Boolean, default: false }) confirmOnDel!: boolean

  /**
   * 删除提示消息
   */
  @Prop({ type: String, default: '确定删除这张图片？' }) delConfirmMsg!: string

  /**
   * 是否可以编辑（显示编辑图标） 默认不可以编辑
   */
  @Prop({ type: Boolean, default: false}) isEdit?: boolean

  inValue: UploadItem[] = []

  viewerShow = false
  viewerImage = ''

  get canAdd() {
    return this.inValue.length < this.maxCount
  }

  get isUploading() {
    return !this.inValue.every(it => it.status == 'done' || it.status == 'fail')
  }

  @Watch('value', { deep: true, immediate: true })
  async watchValue(value: FileItem[]) {
    if (hasChange(value, this.inValue)) {
      this.inValue = (value || []).map(it => ({
        ...defItem,
        uqid: genUqid(),
        ...it
      } as UploadItem))
      // console.log(this.inValue)
    }
  }

  @Watch('inValue', { deep: true })
  watchInValue(value: UploadItem[]) {
    if (hasChange(value, this.value)) {
      const nude = value.map(toFileItem)
      this.$emit('input', nude)
    }
  }

  onChange(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (files == null || files.length === 0) {
      return
    }
    // const remain = this.maxCount - this.inValue.length
    // if (files.length > remain) {
    //   return alert(`最多添加 ${this.maxCount} 个，还剩 ${remain} 个`)
    // }

    [].slice.call(files).forEach((file: File) => {
      const uqid = genUqid()
      // 快速响应原则：只要选择，直接添加
      this.inValue = []
      this.inValue.push({
        url: '',
        fileId: '',
        clientName: file.name,
        clientSize: file.size,
        clientType: file.type,
        status: 'loading',
        percent: 0,
        uqid,
        error: '',
      })

      const uploader = new Uploader()
      uploader.on(this.uploadHandlers(uqid)).upload(file)
    })
  }

  uploadHandlers(uqid: string) {
    return {
      thumb: this.onUploadThumb.bind(this, uqid),
      begin: this.onUploadBegin.bind(this, uqid),
      progress: this.onUploadProgress.bind(this, uqid),
      done: this.onUploadDone.bind(this, uqid),
      fail: this.onUploadFail.bind(this, uqid),
      end: this.onUploadEnd.bind(this, uqid),
    }
  }

  onUploadThumb(uqid: string, { thumb }: any) {
    // TODO: 暂时不用 thumb，chrome 预览图报错
  }

  onUploadBegin(uqid: string) {
    const item = this.inValue.find(it => it.uqid === uqid)!
    item.status = 'uploading'
  }

  onUploadProgress(uqid: string, ev: ProgressEvent) {
    const { loaded, total } = ev
    const percent = Math.floor(loaded * 100 / total)
    const item = this.inValue.find(it => it.uqid === uqid)!
    item.percent = percent
  }

  onUploadDone(uqid: string, { url, fileId }: any) {
    const item = this.inValue.find(it => it.uqid === uqid)!
    item.url = url
    item.fileId = fileId
    item.status = 'done'

    const file = this.inValue[0].fileId
    localStorage.setItem('fileId', file)
  }

  onUploadFail(uqid: string, ex: any) {
    const error = this.formatError(ex)
    const item = this.inValue.find(it => it.uqid === uqid)!
    item.error = error
    item.status = 'fail'
  }

  onUploadEnd(uqid: string) {
    this.checkComplete()
  }

  checkComplete() {
    if (!this.isUploading) {
      // reset 表单，以便添加同一个文件时，仍然触发 onChange
      (this.$refs.form as HTMLFormElement).reset()
    }
  }

  onView(url: string) {
    this.viewerImage = url
    this.viewerShow = true
  }

  // async onDel(i: number) {
  //   this.confirmOnDel && await confirm(this.delConfirmMsg)
  //   this.inValue.splice(i, 1)
  // }

  doDel(i: number) {
    this.inValue.splice(i, 1)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.upload-box {
  position: relative;
}
.upload-list {
  list-style: inside none;
}
.upload-list:not(:empty) {
  margin-top: 20px;
}
.upload-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
  background-color: #fff;
  vertical-align: top;
  &:first-child {
    margin-left: 0;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  &:hover {
    .action-cover {
      display: inline-flex;
    }
  }
}
.progress-cover,
.action-cover {
  display: inline-flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.action-cover {
  display: none;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.upload-add-in {
  position: absolute;
  right: 19px;
  top: 120px;
  z-index: 3;
  cursor: pointer;
  input[type=file] {
    display: none;
  }
}
.viewer-image {
  width: 100%;
}
.upload-box-readonly {
  .action-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
