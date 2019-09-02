<template>
  <OssUploader
    v-model="model"
    @begin="onBegin"
    @done="onDone"
    @statusChange="onStatusChange"
    v-bind="$attrs"
    v-on="$listeners"
    class="video-uploader"
  >
    <template slot="under">
      <video
        :key="videoKey"
        :src="videoUrl"
        autoplay
        controls
        class="video"
        v-if="showVideo"
      ></video>
    </template>
  </OssUploader>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import OssUploader, { FileItem } from '@/components/ossUploader'
import { random } from '@/fn/string'

@Component({
  components: {
    OssUploader
  }
})
export default class VideoUploader extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: [Object, String], default: () => ({}) }) value!: FileItem | string

  model: FileItem | string | null = null

  showVideo = false

  get videoUrl() {
    const model = this.model || ''
    const url = typeof model === 'string' ? model : model.url
    return url || ''
  }

  get videoKey() {
    const url = this.videoUrl
    return random(url)
  }

  onBegin() {
    this.showVideo = false
  }

  onDone() {
    this.showVideo = true
  }

  onStatusChange(status: string) {
    if (status == 'none') {
      this.showVideo = false
    }
  }

  @Watch('value', { deep: true, immediate: true })
  async watchValue(value: FileItem | string) {
    this.model = value
  }

  @Watch('model', { deep: true })
  watchModel(value: FileItem) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.video-uploader {
  &.oss-uploader-done {
    /deep/ .file-name,
    /deep/ .loading-wrap,
    /deep/ .circle-progress {
      display: none;
    }
    /deep/ .control {
      top: 5px;
      right: 5px;
      left: auto;
      width: 66px;
      height: 28px;
    }
    /deep/ .action-done {
      width: 28px;
      height: 28px;
    }
    /deep/ .action-all {
      top: 0;
      height: 28px;
      .action {
        vertical-align: top;
      }
    }
  }
}

.video {
  width: 100%;
  height: 100%;
}
</style>
