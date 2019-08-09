<template>
  <div class="video-previewer">
    <a class="video-previewer-node" @click="onView">
      <slot>查看视频</slot>
    </a>
    <Modal
      v-model="viewerShow"
      :width="width"
      class="video-viewer"
      @click.native.self="viewerShow = false"
    >
      <p class="viewer-tip" @click="viewerShow = false">轻点关闭</p>
      <div class="flex-mid" @contextmenu.prevent="">
        <video
          :key="viewerKey"
          :src="url"
          autoplay
          controls
          class="preview-video"
          ref="video"
          v-if="viewerShow"
        ></video>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { random } from '@/fn/string'

@Component
export default class ImagePreviewer extends ViewBase {
  /**
   * 视频地址
   */
  @Prop({ type: String, default: '', required: true }) url!: string

  /**
   * 查看器宽度，默认为 888
   */
  @Prop({ type: Number, default: 888 }) width!: number

  viewerShow = false
  viewerKey = random()

  async onView() {
    this.viewerShow = true
    this.viewerKey = random()
  }

  @Watch('viewerShow')
  watchViewerShow(value: boolean) {
    !value && (this.$refs.video as HTMLVideoElement).pause()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.video-viewer {
  /deep/ .ivu-modal-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /deep/ .ivu-modal {
    top: 0;
  }

  /deep/ .ivu-modal-content {
    background-color: transparent;
    box-shadow: none;
  }

  /deep/ .ivu-modal-close {
    display: none;
  }

  /deep/ .ivu-modal-body,
  /deep/ .ivu-modal-footer {
    padding: 0;
  }
}

.preview-video {
  max-width: 100%;
  min-width: 400px;
  max-height: 88vh;
  cursor: pointer;
}

.viewer-tip {
  text-align: center;
  color: #ddd;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
