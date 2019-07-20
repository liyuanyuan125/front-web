<template>
  <Pane :title="title" :more="more" class="text-pane">
    <div class="text-pane-in">
      <h4 class="main-text" v-if="main != null">{{main}}</h4>
      <h5 class="sub-text" v-if="sub != null">{{sub}}</h5>
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

  @Prop({ type: [ String, Number ], default: '' }) main!: string | number

  @Prop({ type: [ String, Number ], default: '' }) sub!: string | number
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.text-pane {
  // 加 import 是为了解决串样式问题
  min-height: 124px !important;
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
