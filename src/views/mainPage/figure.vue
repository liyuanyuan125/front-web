<template>
  <Layout :bubbleList="bubbleList">
    <section class="basic-box">
    </section>
  </Layout>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Layout from './components/layout.vue'

@Component({
  components: {
    Layout
  }
})
export default class FigurePage extends ViewBase {
  bubbleList = [
    '师兄李连杰',
    '流浪地球',
    '教练吴彬',
    '功夫小子',
    '导演',
    '少林寺',
  ]
}
</script>

<style lang="less" scoped>
.basic-box {
  position: relative;
  margin: 62px 0 0 100px;
  width: 295px;
  height: 628px;
  clip-path: inset(0);
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 1600px;
    background: url(~@/assets/site/bg.jpg) no-repeat center top fixed;
    background-size: cover;
    filter: blur(20px);
    opacity: .88;
    z-index: -1;
    @media (min-width: 1600px) {
      & {
        left: calc((100vw - 1600px) / 2);
      }
    }
  }
}
</style>
