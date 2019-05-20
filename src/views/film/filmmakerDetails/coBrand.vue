<template>
  <div class="home-bg">
     <ColBrand v-model="list"></ColBrand>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ColBrand from '@/components/detailBrand/index.vue'

@Component({
  components: {
    ColBrand
  }
})
export default class Brand extends ViewBase {
  list = {
      title: '合作品牌',
      tab: [{ text: '运动', num: 5}, { text: '奢侈品', num: 5}],
      items: [
        {
          id: 1,
          imgUrl: 'https://mihui-web-static.ymcdn.cn/mihui_data/online/1.0.0/static/img/1@1x.2b316fb.png',
          tag: '运动',
          title: 'xxxxxx',
          description: 'papi酱演绎积家手表新广告，袒露内心的另一面,袒露内心的另一面',
          videoUrl: 'http://www.365yg.com/i6690490835806617611/#mid=1610946690248711'
        },
        {
          id: 2,
          imgUrl: 'https://mihui-web-static.ymcdn.cn/mihui_data/online/1.0.0/static/img/1@1x.2b316fb.png',
          tag: '运动',
          title: 'xxxxxx',
          description: 'papi酱演绎积家手表新广告，',
          videoUrl: 'https://www.baidu.com'
        },
        {
          id: 3,
          imgUrl: 'https://mihui-web-static.ymcdn.cn/mihui_data/online/1.0.0/static/img/1@1x.2b316fb.png',
          tag: '运动',
          title: 'xxxxxx',
          description: 'papi酱演绎积家手表新广告，袒露内心的另一面,袒露内心的另一面',
          videoUrl: 'https://www.baidu.com'
        },
        {
          id: 4,
          imgUrl: 'https://mihui-web-static.ymcdn.cn/mihui_data/online/1.0.0/static/img/1@1x.2b316fb.png',
          tag: '运动',
          title: 'xxxxxx',
          description: 'papi酱演绎积家手表新广告，袒露内心的另一面,袒露内心的另一面',
          videoUrl: 'https://www.baidu.com'
        },
      ],
      total: 10
  }
}

</script>
<style lang='less' scoped>
</style>