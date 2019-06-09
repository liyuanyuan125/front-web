<template>
  <Pane :title="title" class="offer-pane">
    <div class="offer-in flex-mid">
      <em class="offer-price">{{price}}</em>
      <Button type="primary" class="offer-button">加入投放</Button>
    </div>
  </Pane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Pane from './pane.vue'

@Component({
  components: {
    Pane
  }
})
export default class OfferPane extends Vue {
  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: String, default: '' }) price!: string
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.offer-pane {
  min-height: 118px;
}

.offer-in {
  margin-top: -27px;
  font-size: 22px;
}

.offer-button {
  margin-left: 46px;
  padding: 0 30px;
  height: 34px;
  line-height: 1;
  border-radius: 88px;
  font-size: 14px;
  .button-style(#001f2c, #f9d669);
  /deep/ & > span {
    vertical-align: top;
  }
}
</style>
