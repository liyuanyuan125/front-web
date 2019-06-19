<template>
  <Pane :title="title" :more="more" class="opus-pane">
    <ul class="opus-list">
      <li v-for="(it, i) in data" :key="i" class="opus-item">
        <a :href="it.url" target="_blank" class="opus-item-in">
          <figure class="opus-figure">
            <img :src="it.cover" class="opus-img">
          </figure>
          <h4 class="opus-title">{{it.title}}</h4>
          <div class="opus-ext">
            <em class="opus-praise">{{it.praise}}</em>
            <em class="opus-comment">{{it.comment}}</em>
          </div>
        </a>
      </li>
    </ul>
  </Pane>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RawLocation } from 'vue-router'
import Pane from './pane.vue'

export interface DataItem {
  id: number
  cover: string
  title: string
  praise: string
  comment: string
}

@Component({
  components: {
    Pane
  }
})
export default class OpusPane extends Vue {
  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: Array, default: () => [] }) data!: DataItem[]

  @Prop({ type: [ Object, String ], default: null }) more!: RawLocation
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.opus-pane {
  min-height: 228px;
}

.opus-list {
  display: flex;
  padding-left: 30px;
  margin-top: -6px;
}

.opus-item {
  width: 118px;
  margin-right: 16px;
}

.opus-item-in {
  display: inline-block;
  width: 100%;
  &:hover {
    opacity: .88;
  }
}

.opus-figure {
  position: relative;
  width: 100%;
  height: 68px;
  &::after {
    content: '';
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 26px;
    height: 25px;
    background: url(../assets/play.png) no-repeat;
  }
}

.opus-img {
  width: 100%;
  height: 100%;
}

.opus-title {
  margin-top: 6px;
  height: 36px;
  line-height: 18px;
  overflow: hidden;
  font-size: 12px;
  font-weight: normal;
  color: rgba(252, 252, 252, .8);
}

.opus-ext {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.opus-praise,
.opus-comment {
  padding-left: 18px;
  color: rgba(252, 252, 252, 1);
  background: url(../assets/thumb.png) no-repeat left 1px;
}

.opus-comment {
  padding-left: 20px;
  background-image: url(../assets/comment.png);
  background-position: left 3px;
}
</style>
