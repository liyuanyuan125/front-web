<template>
  <div :class="{
    'oss-uploader': true,
    [`oss-uploader-${status}`]: true,
    'oss-uploader-mini': mini,
    'oss-uploader-readonly': readonly,
  }">
    <slot name="under"></slot>

    <label class="handle" v-if="!readonly">
      <input
        type="file"
        :accept="accept"
        class="handle-file"
        @change="onChange"
        ref="file"
      >
      <slot name="handle">
        <div class="handle-in flex-mid">
          <Icon
            type="ios-cloud-upload"
            :size="mini ? 18 : 38"
            class="handle-icon"
            title="上传"
          />
          <div class="handle-text" v-if="!mini">上传</div>
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
            <TinyLoading :size="mini ? 12 : 28" v-if="status == 'loading'"/>
          </div>
        </slot>

        <slot
          name="progress"
          :percent="percent"
          :error="error"
        >
          <template v-if="!mini">
            <CircleProgress
              :percent="percent"
              :fail="error != ''"
              v-if="status != 'none' && status != 'filled'"
            />
            <MiddleEllipsis class="error" v-if="error">{{error}}</MiddleEllipsis>
          </template>
          <template v-else>
            <Tooltip class="mini-progress-tip">
              <Progress
                :percent="percent"
                :status="error ? 'wrong' : (percent < 100 ? 'active' : 'success')"
                hide-info
                class="mini-progress"
                v-if="!['none', 'filled', 'loading'].includes(status)"
              />
              <Icon
                type="ios-checkmark-circle"
                class="filled-icon"
                v-if="status == 'filled'"
              />
              <div slot="content" v-if="status != 'filled'">
                <div class="tip-error" v-if="error">{{error}}</div>
                <div class="tip-percent" v-else>
                  <em>{{fileName}}</em>
                  <i v-if="percent < 100"> [ {{percent.toFixed(1) + '%'}} ]</i>
                </div>
              </div>
              <div slot="content" v-else>
                <div class="tip-filled">{{model && model.url}}</div>
              </div>
            </Tooltip>
          </template>
        </slot>

        <div class="action-all">
          <Icon
            type="md-close-circle"
            :title="removeMap[status]"
            class="action"
            @click="onRemove"
          />
        </div>

        <div class="action-uploading flex-mid" v-if="status == 'uploading'">
          <Icon
            type="ios-play"
            title="继续"
            class="action"
            @click="onResume"
            v-if="isPaused"
          />
          <Icon
            type="ios-pause"
            title="暂停"
            class="action"
            @click="onPause"
            v-else
          />
        </div>

        <div class="action-done flex-mid" v-if="status == 'filled' || status == 'done'">
          <Icon
            type="md-sync"
            title="更换"
            class="action"
            @click="onEdit"
          />
        </div>

        <MiddleEllipsis :ratio="64" class="file-name" v-if="!mini">{{fileName}}</MiddleEllipsis>
        <MiddleEllipsis
          :ratio="64"
          class="filled-url"
          v-if="!mini && status == 'filled'"
        >{{model && model.url}}</MiddleEllipsis>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import OssUploaderClass, {
  Options,
  UseCache,
  ProgressEvent,
  DoneEvent,
  FailEvent,
  UploadParam
} from '@/util/OssUploader'
import TinyLoading from '@/components/TinyLoading.vue'
import CircleProgress from '@/components/circleProgress'
import MiddleEllipsis from '@/components/middleEllipsis'
import { slice } from '@/fn/object'
import { isEqual } from 'lodash'
import { FileItem } from './types'
import { confirm } from '@/ui/modal'
import { MapType } from '@/util/types'

// 状态
// loading 表示加载（文件上传之前要计算分片等），
// uploading 正在上传
// filled 表示已回填，说明当前有值，与 done 类似
// done 表示上传成功
// fail 表示上传失败
type Status = 'none' | 'filled' | 'loading' | 'uploading' | 'done' | 'fail'

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

const removeMap: MapType = {
  filled: '移除',
  loading: '取消',
  uploading: '取消',
  done: '移除',
  fail: '移除',
}

@Component({
  components: {
    TinyLoading,
    CircleProgress,
    MiddleEllipsis
  }
})
export default class OssUploader extends ViewBase {
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

  /**
   * 上传参数，参考 OssUploader.ts
   */
  @Prop({ type: Object, default: () => ({}) }) param!: UploadParam

  /**
   * mini 模式，默认 false
   */
  @Prop({ type: Boolean, default: false }) mini!: boolean

  model: FileItem = { ...defaultItem }

  status: Status = 'none'

  percent = 0

  error = ''

  uploader: OssUploaderClass | null = null

  isPaused = false

  removeMap = removeMap

  get fileName() {
    const name = this.model && this.model.clientName || ''
    return name
  }

  onChange(ev: Event) {
    const input = ev.target as HTMLInputElement
    const file = input.files && input.files[0]
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

    const uploader = this.uploader = new OssUploaderClass({
      ...this.options,
      monitor: (name, args) => {
        this.$emit(name, args)
      }
    })
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
    uploader.upload(file, this.param)
  }

  reset() {
    this.status = 'none'
    this.percent = 0
    this.error = ''
    this.uploader = null
    this.isPaused = false
    this.model = { ...defaultItem }
  }

  onResume() {
    this.uploader!.resume()
  }

  onPause() {
    this.uploader!.pause()
  }

  onEdit() {
    const file = this.$refs.file as HTMLInputElement
    file && file.click()
  }

  async onRemove() {
    const status = this.status
    const type = removeMap[status]
    if (status != 'fail') {
      await confirm(`确定${type}吗？`)
    }
    this.uploader && this.uploader.stop()
    this.reset()
  }

  @Watch('value', { deep: true, immediate: true })
  async watchValue(value: FileItem | string) {
    const item = typeof value === 'string' ? { url: value } : value
    if (hasChange(item, this.model)) {
      const newModel = {
        ...defaultItem,
        ...item
      } as FileItem
      this.model = newModel
      this.status = this.model.url ? 'filled' : 'none'
    }
  }

  @Watch('model', { deep: true, immediate: true })
  watchModel(value: FileItem) {
    if (hasChange(value, this.value)) {
      const nude = toFileItem(value)
      this.$emit('input', nude)
    }
  }

  @Watch('status')
  watchStatus(value: string) {
    this.$emit('statusChange', value)
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

.handle,
.handle-in,
.control,
.loading-wrap,
.action-uploading,
.action-done {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.handle {
  display: none;
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
    width: 88.88% !important;
    height: 88.88% !important;
  }
  /deep/ .percent-text {
    position: relative;
    top: 28px;
    color: #888;
    font-size: 12px;
  }
}

.action {
  cursor: pointer;
  opacity: .8;
  &:hover {
    opacity: 1;
  }
}

.action-all,
.action-uploading,
.action-done {
  font-size: 28px;
}

.action-all {
  position: absolute;
  top: -8px;
  right: 2px;
  color: #888;
  z-index: 8;
}

.action-uploading,
.action-done {
  color: #38b8f2;
}

.file-name,
.filled-url {
  position: absolute;
  max-width: 96px;
  margin-top: -26px;
}

.filled-url {
  max-width: 88%;
}

.oss-uploader-none {
  &:hover {
    border-color: @c-button;
  }
  .handle {
    display: block;
  }
}

.oss-uploader-done {
  /deep/ .ivu-chart-circle-inner {
    &::before {
      content: '上传完成';
      color: #5fb760;
      position: relative;
      top: 28px;
      font-weight: bold;
    }
    .icon-done {
      display: none;
    }
  }
}

.oss-uploader-mini {
  width: 68px;
  height: 20px;
  border: 0;
  border-radius: 0;
  // 仅用于调试
  // background-color: #eee;
  // margin: 18px 0;

  /deep/ .loading-box {
    position: relative;
    top: -1px;
    left: -10px;
  }

  .action-all,
  .action-uploading,
  .action-done {
    font-size: 16px;
  }

  .action-all {
    top: -4px;
    right: 0;
  }

  .action-uploading,
  .action-done {
    left: 35px;
    width: auto;
  }

  .mini-progress-tip {
    align-self: flex-start;
  }

  .mini-progress {
    top: -1px;
    width: 32px;
  }

  .filled-icon {
    font-size: 18px;
    color: #20b558;
  }

  .tip-filled {
    white-space: normal;
    word-break: break-all;
    min-width: 200px;
  }
}

.oss-uploader-filled {
  .mini-progress-tip {
    margin-left: 11px;
  }
}
</style>
