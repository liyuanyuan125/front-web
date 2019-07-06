<template>
  <Pane
    :title="title"
    :more="more"
    :class="{'fans-pane-has-tip': tip != ''}"
  >
    <div class="fans-content flex-box">
      <div class="fans-man">
        <div class="fans-type">男</div>
        <div class="fans-rate">{{man > 0 ? `${man}%` : '-'}}</div>
      </div>
      <div class="fans-woman">
        <div class="fans-type">女</div>
        <div class="fans-rate">{{woman > 0 ? `${woman}%` : '-'}}</div>
      </div>
    </div>
    <template slot="footer">
      <div class="fans-tip" v-if="tip">{{tip}}</div>
    </template>
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
export default class FansPane extends Vue {
  @Prop({ type: String, default: '' }) title!: string

  @Prop({ type: Number, default: 0 }) man!: number

  @Prop({ type: Number, default: 0 }) woman!: number

  @Prop({ type: [ Object, String ], default: null }) more!: RawLocation

  @Prop({ type: String, default: '' }) tip!: string
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.fans-content {
  position: relative;
  padding: 22px 6px 0;
  &::before {
    content: 'VS';
    position: absolute;
    top: 40px;
    left: 50%;
    font-size: 16px;
    transform: translateX(-50%);
  }
}

.fans-man,
.fans-woman {
  flex: 1;
  text-align: center;
  background: no-repeat center top;
  display: flex;
  height: 128px;
  flex-direction: column;
  padding-top: 50px;
}

.fans-man {
  color: #57b4c9;
  background-image: url(../assets/man.png);
}

.fans-woman {
  color: #ca7273;
  background-image: url(../assets/woman.png);
}

.fans-type {
  font-size: 12px;
}

.fans-rate {
  font-size: 22px;
  margin-top: 26px;
}

.fans-tip {
  text-align: center;
}

.fans-pane-has-tip {
  .fans-content {
    padding: 0 6px;
  }
  .fans-rate {
    margin-top: 10px;
  }
}
</style>
