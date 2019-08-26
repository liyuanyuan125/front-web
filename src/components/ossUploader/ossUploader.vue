<template>
  <div :class="{
    'oss-uploader': true,
    [`oss-uploader-${status}`]: true,
    'oss-uploader-readonly': readonly,
  }">
    <label class="handle" v-if="status == 'none' && !readonly">
      <input type="file" :accept="accept" class="handle-file" @change="onChange">
      <slot name="handle">
        <div class="handle-in flex-mid">
          <Icon type="ios-cloud-upload" size="38" class="handle-icon"/>
          <div class="handle-text">上传</div>
        </div>
      </slot>
    </label>

    <slot
      name="control"
      :status="status"
      :percent="percent"
      :error="error"
      :isPaused="isPaused"
      v-if="status != 'none'"
    >
      <div class="control flex-mid">
        <slot name="loading" :status="status">
          <div class="loading-wrap flex-mid">
            <TinyLoading :size="28" v-if="status == 'loading'"/>
          </div>
        </slot>

        <slot
          name="progress"
          :percent="percent"
          :error="error"
        >
          <CircleProgress :percent="percent" :fail="error != ''" hideZero/>
          <div class="error" v-if="error">{{error}}</div>
        </slot>

        <div class="action flex-mid" v-if="status == 'uploading'">
          <Tooltip content="继续" v-if="isPaused">
            <Icon type="ios-play" @click="onResume"/>
          </Tooltip>
          <Tooltip content="暂停" v-else>
            <Icon type="ios-pause" @click="onPause"/>
          </Tooltip>
        </div>

        <Tooltip :content="fileName" placement="top" class="file-name-tip">
          <div class="file-name">{{shortName}}</div>
        </Tooltip>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import OssUploader, {
  Options,
  UseCache,
  ProgressEvent,
  DoneEvent,
  FailEvent,
} from '@/util/OssUploader'
import TinyLoading from '@/components/TinyLoading.vue'
import CircleProgress from '@/components/circleProgress'
import { slice } from '@/fn/object'
import { isEqual } from 'lodash'
import { FileItem } from './types'
import { wideTruncate } from '@/fn/string'

// 状态，loading 表示加载（文件上传之前要计算分片等），uploading 正在上传，done 完成
type Status = 'none' | 'loading' | 'uploading' | 'done' | 'fail'

const defaultItem: FileItem = {
  url: '',
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

  uploader: OssUploader | null = null

  isPaused = false

  get fileName() {
    const name = this.model && this.model.clientName || ''
    return name
  }

  get shortName() {
    const name = this.fileName
    // 取扩展名，一般的扩展名是 3 位，再加上 . 是 4 位，如果太长，最多允许 6 位
    const ext = name ? name.replace(/^[^.]+/, '') : ''
    const backCount = Math.max(6, ext.length) / 2
    const short = wideTruncate(name, 5, backCount)
    return short
  }

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

    this.percent = 0
    this.status = 'none'

    const uploader = this.uploader = new OssUploader(this.options)
    uploader.on({
      begin: () => {
        this.status = 'loading'
        this.error = ''
      },
      progress: ({ percent }: ProgressEvent) => {
        this.status = 'uploading'
        this.percent = percent
      },
      done: ({ url }: DoneEvent) => {
        this.status = 'done'
        this.model!.url = url
      },
      fail: ({ exception }: FailEvent) => {
        this.status = 'fail'
        this.error = String(exception)
      },
      isPausedChanged: (value: boolean) => {
        this.isPaused = value
      }
    })
    uploader.upload(file)
  }

  onResume() {
    this.uploader!.resume()
  }

  onPause() {
    this.uploader!.pause()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.oss-uploader {
  position: relative;
  width: 168px;
  height: 168px;
  border: 1px dashed #ccc;
  border-radius: 5px;
}

.oss-uploader-none {
  &:hover {
    border-color: @c-button;
  }
}

.handle,
.handle-in,
.control,
.loading-wrap,
.action {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.handle {
  overflow: hidden;
}

.handle-file {
  opacity: 0;
}

.handle-in {
  flex-direction: column;
  cursor: pointer;
  &:hover {
    color: @c-button;
  }
}

.control {
  flex-direction: column;
  /deep/ .circle-progress {
    width: 88% !important;
    height: 88% !important;
  }
  /deep/ .percent-text {
    position: relative;
    top: 28px;
    color: #888;
    font-size: 12px;
  }
}

.action {
  font-size: 28px;
  color: #38b8f2;
}

.file-name-tip {
  position: absolute;
  margin-top: -22px;
}
</style>
