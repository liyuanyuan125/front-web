<template>
  <div>
      <quillEditor />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fileList, queryList } from '@/api/shopping'
import { quillEditor } from 'vue-quill-editor'
@Component({
  components: {
    quillEditor
  }
})
export default class DlgEditCinema extends ViewBase {

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.detail-box {
  font-size: 14px;
  padding: 0 30px;
  /deep/ .ivu-col {
    margin-top: 30px;
  }
}
</style>
