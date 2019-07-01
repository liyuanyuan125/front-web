<template>
  <div class="swiper-box">
    <button
      type="button"
      class="swiper-prev"
      @click="slidePrev"
      :disabled="!showPrev"
    ></button>

    <swiper :options="finalOptions" class="swiper" @slideChange="slideChange">
      <slot></slot>
    </swiper>

    <button
      type="button"
      class="swiper-next"
      @click="slideNext"
      :disabled="!showNext"
    ></button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

import { swiper } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import { dot } from '@/util/dealData'
import { merge } from 'lodash'

@Component({
  components: {
    swiper
  }
})
export default class NavSwiper extends ViewBase {
  @Prop({ type: Object, default: () => ({}) }) options!: object

  instance: any = null

  showPrev = false

  showNext = false

  get finalOptions() {
    // 用 on.init 进行特殊处理
    const userInit = dot(this.options, 'on.init')

    const vm = this
    const options = merge({
      slidesPerView: 5,
      spaceBetween: 8,
    }, this.options, {
      on: {
        init() {
          vm.instance = this
          vm.updateUI()
          userInit && userInit.call(this)
        }
      }
    })

    return options
  }

  updateUI() {
    this.showPrev = !this.instance.isBeginning
    this.showNext = !this.instance.isEnd
  }

  slideChange() {
    this.updateUI()
  }

  slidePrev() {
    this.slideGroup(-1)
  }

  slideNext() {
    this.slideGroup(1)
  }

  slideGroup(by: number) {
    const { slidesPerView } = this.finalOptions
    const toIndex = this.instance.activeIndex + slidesPerView * by
    this.instance && this.instance.slideTo(toIndex)
  }
}
</script>

<style lang="less" scoped>
.swiper-box {
  position: relative;
}

.swiper-prev,
.swiper-next {
  position: absolute;
  top: 32px;
  width: 27px;
  height: 50px;
  border: 0;
  outline: 0;
  background: rgba(0, 0, 0, .3) url(./assets/left.png) no-repeat center;
  background-size: 9px 16px;
  z-index: 8;

  &:hover {
    background-color: rgba(0, 0, 0, 1);
  }

  &[disabled] {
    opacity: .5;
    background-color: rgba(0, 0, 0, .3);
    cursor: not-allowed;
  }
}

.swiper-prev {
  left: -18px;
}

.swiper-next {
  right: -18px;
  transform: rotate(180deg);
}

.swiper {
  left: 18px;
}
</style>
