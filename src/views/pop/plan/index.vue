<template>
  <div ref="page" class>
    <Row style="overflow:hidden">
      <Col span="22" offset="3">
        <StepTime v-model="step"/>
      </Col>
    </Row>
    <div>
      <component v-bind:is="currentTab" v-model="step"></component>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Promotion from './vadver/promotion.vue'
import Orienteering from './vadver/orienteering.vue'
import Precept from './vadver/precept.vue'
import Finish from './vadver/finish.vue'
import StepTime from './vadver/stepTime.vue'

@Component({
  components: {
    Promotion,
    Orienteering,
    Precept,
    Finish,
    StepTime
  }
})
export default class App extends ViewBase {
  step = {
    id: 0,
    setid: ''
  }
  currentTab: any = Promotion
  created() {
    this.init()
  }

  init() {
    const step: any = this.$route.params
    if (!step.id) {
      this.$router.push({
        name: 'pop-planlist-add',
        params: { id: '0' }
      })
    } else {
      this.step = step
    }
  }

  @Watch('step', { deep: true })
  watchStep(val: any) {
    (this.$refs.page as HTMLDivElement).scrollTop = 0
    const id = Number(this.step.id)
    switch (id) {
      case 0:
        // this.currentTab = Orienteering
        this.currentTab = Promotion
        break
      case 1:
        this.currentTab = Orienteering
        break
      case 2:
        this.currentTab = Precept
        break
      case 3:
        this.currentTab = Finish
        break
    }
  }

  @Watch('$route', { deep: true })
  watch$route(val: any) {
    this.step = val.params
  }
}
</script>

<style lang="less" scoped>
.setp-wrap {
  height: 104px;
  padding: 33px 30px 33px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: solid 10px #f2f2f2;
  color: #2481d7;
}
.pages {
  background: url(./vadver/assets/step1.jpg) no-repeat;
  position: fixed;
  left: 100px;
  right: 0;
  top: 0;
  bottom: -20px;
  background-size: cover;
}
</style>
