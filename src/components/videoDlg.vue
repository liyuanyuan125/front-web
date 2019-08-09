<template>
  <div>
    <Modal v-model="value.visible" width="600" class="viewer" >
      <p @click="value.visible = false" class="viewer-tip">轻点关闭</p>
      <div class="player-wrap">
        <vue-plyr>
          <video :src="value.url" width="500" ></video>
        </vue-plyr>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { VuePlyr } from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

@Component({
  components: {
    VuePlyr
  }
})
export default class Video extends ViewBase {
    @Prop({ type: Object}) value: any
}
</script>
<style lang="less" scoped>
.viewer {
  /deep/ .ivu-modal {
    top: 30%;
    margin-bottom: 38px;
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
.viewer-tip {
  text-align: center;
  color: #ddd;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
