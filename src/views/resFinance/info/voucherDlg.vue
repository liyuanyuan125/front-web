<template>
  <div>
    <Modal v-model="value.visible" title="查看凭证">
      <em class="flex-box">
        <ImagePreviewer
          v-for="(item, i) in list"
          :key="i"
          :url="item.url"
          class="qualification-image"
        />
      </em>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ImagePreviewer from '@/components/imagePreviewer/ImagePreviewer.vue'

@Component({
  components: {
    ImagePreviewer
  }
})
export default class Marn extends ViewBase {
  @Prop({ type: Object }) value!: any
  list = []
  mounted() {
    this.list = this.value.imglist
  }
}
</script>
<style lang="less" scoped>
.qualification-image {
  width: 150px;
  margin-right: 25px;
}
</style>

