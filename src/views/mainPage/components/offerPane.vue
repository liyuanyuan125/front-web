<template>
  <Pane :title="title" class="offer-pane">
    <ul class="offer-list">
      <li v-for="(it, i) in priceList" :key="i" class="offer-item">
        <label class="offer-item-name">{{it.name}}：</label>
        <em class="offer-item-value">{{it.value}}</em>
      </li>
    </ul>
    <template slot="head-side">
      <Button type="primary" class="offer-button">加入投放</Button>
    </template>
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

  @Prop({ type: Array, default: () => [] }) priceList!: Array<{ name: string, value: string }>
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.offer-pane {
  position: relative;
  min-height: 118px;
}

.offer-list {
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  padding: 0 30px 30px;
  list-style: disc inside;
  line-height: 2;
}

.offer-item {
  width: 50%;
}

.offer-button {
  position: absolute;
  top: 17px;
  right: 18px;
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
