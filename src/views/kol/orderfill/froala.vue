<template>
  <div class="file-box">
    <div v-show="false">
      <input ref="inputUpdate" id="upload" type="file" accept="image/*" @change="onChange">
    </div>
    <quillEditor v-model="content" ref="myQuillEditor" :options="editorOption"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fileList, queryList } from '@/api/shopping'
import { quillEditor, Quill } from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'
import Uploader from '@/util/Uploader'
import { random } from '@/fn/string'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const genUqid = () => random('upload')

Quill.register('modules/imageDrop', ImageResize)
// https://quilljs.com/docs/api/#content

@Component({
  components: {
    quillEditor
  }
})
export default class DlgEditCinema extends ViewBase {
  @Prop({ default: '' }) value!: any
  content = this.value

  editorOption: any = {
    modules: {
      imageResize: {
        displayStyles: {
          backgroundColor: 'black',
          border: 'none',
          color: 'white'
        },
        modules: ['Resize', 'DisplaySize', 'Toolbar']
      },
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ size: ['small', false, 'large', 'hug'] }],
          [{ color: [] }, { background: [] }],
          ['clean'],
          ['image', 'video']
        ],
        handlers: {
          image: (value: any) => {
            if (value) {
              // 触发input框选择图片文件
              (document.querySelector('#upload') as any)!.click()
            } else {
              // this.quill.format('image', false)
            }
          }
        }
      }
    }
  }

  onChange(ev: Event) {
    const inValue = []
    const files = (ev.target as HTMLInputElement).files
    if (files == null || files.length === 0) {
      return
    }
    [].slice.call(files).forEach((file: File) => {
      // 快速响应原则：只要选择，直接添加
      const uploader = new Uploader()
      uploader.on(this.uploadHandlers()).upload(file)
    })
  }

  uploadHandlers() {
    return {
      begin: this.onUploadBegin.bind(this),
      done: this.onUploadDone.bind(this),
      fail: this.onUploadFail.bind(this),
      end: this.onUploadEnd.bind(this)
    }
  }

  onUploadBegin() {}

  onUploadDone({ url, fileId }: any) {
    const quill = (this.$refs.myQuillEditor as any).quill
    const length = quill.getSelection().inde
    quill.insertEmbed(length, 'image', url)
    quill.setSelection(length + 1)
  }

  onUploadEnd(res: any) {
    (this.$refs.inputUpdate as any).value = ''
  }

  onUploadFail() {}

  @Watch('content', { deep: true })
  watchContent(val: any) {
    this.$emit('input', val)
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.file-box {
  min-height: 100px;
  /deep/ .ql-container {
    min-height: 150px;
  }
}
</style>
