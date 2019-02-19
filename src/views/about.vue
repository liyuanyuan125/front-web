<template>
  <div class="page">
    <div class="player-wrap">
      <vue-plyr>
        <video src="http://www.runoob.com/try/demo_source/mov_bbb.mp4"></video>
      </vue-plyr>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { VuePlyr } from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

@Component({
  components: {
    VuePlyr
  }
})
export default class Main extends ViewBase {
  async mounted() {

  }
}
</script>

<style lang="less" scoped>
.player-wrap {
  width: 600px;
}
</style>
