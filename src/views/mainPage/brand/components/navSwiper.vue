<template>
  <div class="swiper-box">
    <button
      type="button"
      class="swiper-prev"
      @click="slidePrev"
      :disabled="!showPrev"
    ></button>

    <swiper :options="options" class="swiper" @slideChange="slideChange">
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

import { devLog } from '@/util/dev'

@Component({
  components: {
    swiper
  }
})
export default class NavSwiper extends ViewBase {
  instance: any = null

  showPrev = false

  showNext = false

  get options() {
    const vm = this
    return {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 8,
      on: {
        init() {
          vm.instance = this
          vm.updateUI()
        },

        touchStart(ev: any) {
          devLog('touchStart: ', ev.pageX)
        },

        touchEnd(ev: any) {
          devLog('touchEnd: ', ev.pageX)
        }
      }
    }
  }

  updateUI() {
    this.showPrev = !this.instance.isBeginning
    this.showNext = !this.instance.isEnd
  }

  slideChange() {
    this.updateUI()
  }

  slidePrev() {
    this.instance && this.instance.slidePrev()
  }

  slideNext() {
    this.instance && this.instance.slideNext()
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
