<template>
  <div class="home-bg personal-information">
    <h2>人物简介</h2>
    <div>
      　吴京，被誉为“功夫小子”，从1995年就开始接拍电视剧和电影，其引路人便是《少林寺》以及《少林武王》的导演张鑫炎，而吴京的武术教练也就是李连杰的教练吴彬。当年还在武术队里奋斗的吴京被张鑫炎看中，于是和师兄李连杰一样，顺利地加入了娱乐圈。两人的经历惊人地相似。
      2005年后吴京搬迁至香港，正式在香港发展，并取得了不俗的成绩
    </div>
    <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
      <swiper-slide v-for="(item, index) in imgUrl" :key="index">
        <img :src="item" alt="" class="item-img" />
      </swiper-slide>
      <!-- <div class="swiper-pagination"  slot="pagination"></div> -->
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

@Component({
  components: {
    swiper,
    swiperSlide
  }
})
export default class Information extends ViewBase {
  imgUrl = [
    'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
    'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
    'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
    'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
    'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
    'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
    'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
    'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
    'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
    'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
  ]
  swiperOption = {
    slidesPerView: 4,
    spaceBetween: 30,
    resistanceRatio: 0,
    // pagination: {
    //   el: '.swiper-pagination',
    //   clickable: true
    // },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }
  get swiper() {
    return (this.$refs.mySwiper as any).swiper
  }
  callback() {}
  mounted() {
    // this.swiper.slideTo(3, 1000, false)
  }
}

</script>
<style lang='less' scoped>
h2, h3, h4 {
  font-weight: normal;
}
.personal-information {
  .swiper-container {
    height: 280px;
    .item-img {
      width: 100%;
    }
  }
}
</style>