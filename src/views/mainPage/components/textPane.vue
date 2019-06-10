<template>
  <Pane :title="title" :more="more" class="text-pane">
    <div class="text-pane-in">
      <h4 class="main-text" v-if="main">{{main}}</h4>
      <h5 class="sub-text" v-if="sub">{{sub}}</h5>
    </div>
  </Pane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'
import Pane from './pane.vue'

@Component({
  components: {
    Pane
  }
})
export default class TextPane extends Vue {
  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: [ Object, String ], default: null }) more!: RawLocation

  @Prop({ type: String, default: '' }) main!: string

  @Prop({ type: String, default: '' }) sub!: string
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.text-pane {
  min-height: 118px;
}

.text-pane-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #53c5df;
  margin-top: -20px;
  padding-bottom: 20px;
}

.main-text {
  font-size: 28px;
  font-weight: normal;
}

.sub-text {
  font-size: 14px;
  font-weight: normal;
}
</style>
