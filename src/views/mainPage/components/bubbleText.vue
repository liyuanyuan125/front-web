<template>
  <div class="bubble-text-list">
    <div v-for="(it, i) in sortList" :key="i" class="bubble-text">
      <div class="bubble-text-in">{{it}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

// 后端按照从上到下的排序，但前端按照球的大小排序
const bubbleSort = [ 3, 1, 4, 0, 5, 2 ]

@Component
export default class BubbleText extends Vue {
  @Prop({ type: Array, default: () => [] }) list!: string[]

  get sortList() {
    const textList = this.list || []
    return bubbleSort.map(i => textList[i]).filter(it => it != null)
  }
}
</script>

<style lang="less" scoped>
.bubble-text-list {
  // position: fixed;
  // top: 0;
  position: absolute;
  top: -55px;
  width: 685px;
  height: 100vw;
  z-index: 18;
  pointer-events: none;
  user-select: none;
  margin-left: -42px;
}

@keyframes niuniu {
  0%, 100%, 50% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-15px);
  }
  75% {
    transform: translateY(15px);
  }
}

.bubble-text {
  position: absolute;
  cursor: default;
  animation: niuniu 8s linear infinite both;
}

.bubble-text-in {
  display: flex;
  color: #fff;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 28px;
  transition: transform 100ms;
  padding: 0 20px;
  font-size: 18px;
  pointer-events: auto;
  &:hover {
    transform: scale(1.2);
  }
}

.bubble-text:nth-child(1) {
  top: 460px;
  left: 538px;
  animation-duration: 10s;
  .bubble-text-in {
    width: 124px;
    height: 124px;
    background-color: fade(#255184, 70);
  }
}

.bubble-text:nth-child(2) {
  top: 251px;
  left: 542px;
  animation-duration: 12s;
  .bubble-text-in {
    width: 118px;
    height: 118px;
    background-color: fade(#ca7273, 90);
  }
}

.bubble-text:nth-child(3) {
  top: 572px;
  left: 534px;
  .bubble-text-in {
    width: 100px;
    height: 100px;
    line-height: 24px;
    background-color: fade(#f0c749, 80);
    padding: 0 16px;
  }
}

.bubble-text:nth-child(4) {
  top: 158px;
  left: 519px;
  .bubble-text-in {
    width: 84px;
    height: 84px;
    line-height: 20px;
    background-color: fade(#00b0c6, 90);
    font-size: 16px;
    padding: 0 12px;
  }
  animation-duration: 10s;
}

.bubble-text:nth-child(5) {
  top: 700px;
  left: 427px;
  .bubble-text-in {
    width: 80px;
    height: 80px;
    line-height: 20px;
    background-color: fade(#57b4ca, 90);
    font-size: 16px;
    padding: 0 12px;
  }
  animation-duration: 12s;
}

.bubble-text:nth-child(6) {
  top: 362px;
  left: 620px;
  .bubble-text-in {
    width: 72px;
    height: 72px;
    line-height: 18px;
    background-color: fade(#4b87d0, 80);
    font-size: 14px;
    padding: 0 10px;
  }
}
</style>
