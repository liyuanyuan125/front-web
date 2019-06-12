<template>
  <div class="detail-brand com-modal" v-if="list">
      <div class="com-modal-title brand-list">
        <span>合作品牌</span>
      </div>
      <div class="video-list">
          <div class="list-col" v-for="item in list.items" :key ="item.id">
              <h3><em>{{item.tag}}</em><span>{{item.title}}</span></h3>
              <a :href="item.videoUrl" class="video-img" target="_blank"><img :src="item.imgUrl" class="top-img"/>
              <!-- <i class="video-long">2:01</i> -->
              </a>
              <h4 :title="item.description">{{item.description}}</h4> 
          </div>
      </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { AjaxResult } from './type'
import { brandList } from '@/api/kolDetails'

@Component
export default class Main extends ViewBase {
    // 请求接口 加载列表的请求函数
    @Prop({ type: Object }) value?: any

    list = {
      title: '合作品牌',
      tab: [{key: 0, text: '全部', num: 8}, {key: 1, text: '运动', num: 5}, { key: 2, text: '奢侈品', num: 5}],
      items: [
        {
          id: 1,
          imgUrl: 'http://img5.mtime.cn/pi/2017/12/26/112527.39995952_220X220.jpg',
          tag: '运动',
          title: 'New Balance 新百伦',
          description: 'papi酱演绎积家手表新广告，袒露内心的另一面,袒露内心的另一面',
          videoUrl: 'http://www.365yg.com/i6690490835806617611/#mid=1610946690248711'
        },
        {
          id: 2,
          imgUrl: 'http://img5.mtime.cn/pi/2017/12/26/112527.39995952_220X220.jpg',
          tag: '运动',
          title: 'New Balance 新百伦',
          description: 'papi酱演绎积家手表新广告，',
          videoUrl: 'https://www.baidu.com'
        },
        {
          id: 3,
          imgUrl: 'http://img5.mtime.cn/pi/2017/12/26/112527.39995952_220X220.jpg',
          tag: '运动',
          title: 'New Balance 新百伦',
          description: 'papi酱演绎积家手表新广告，袒露内心的另一面,袒露内心的另一面',
          videoUrl: 'https://www.baidu.com'
        },
        {
          id: 4,
          imgUrl: 'http://img5.mtime.cn/pi/2017/12/26/112448.37214612_220X220.jpg',
          tag: '运动',
          title: 'New Balance 新百伦',
          description: 'papi酱演绎积家手表新广告，袒露内心的另一面,袒露内心的另一面',
          videoUrl: 'https://www.baidu.com'
        },
      ],
      total: 10
    }

    async mounted() {
      const {items, brandCategoryList} = this.value
    }

    handleTab(item: any) {
      return item.num ? `${item.text} ${item.num}` : item.text
    }
}

</script>
<style lang='less' scoped>
@import '~@/views/kol/less/common.less';
.brand-list {
  padding-left: 30px;
}
.video-list {
  display: flex;
  flex-wrap: wrap;
  border-radius: 8px;
  margin-left: -30px;
  margin-right: -30px;
  padding: 50px 50px 100px;
  .list-col {
    width: 33.3%;
    padding: 0 30px;
    margin-bottom: 30px;
    color: #fff;
    h3 {
      padding-bottom: 20px;
      text-align: center;
      font-size: 18px;
      font-weight: 0;
    }
    h4 {
      padding: 0 10px;
      font-size: 17px;
      line-height: 28px;
      text-align: justify;
      text-justify: inter-word;
      font-weight: 0;
    }
    .video-img {
      position: relative;
    }
    .top-img {
      width: 100%;
      height: 190px;
      border-radius: 8px;
    }
    .video-long {
      position: absolute;
      right: 8px;
      bottom: 8px;
      width: 46px;
      text-align: center;
      height: 26px;
      line-height: 26px;
      background: rgba(0, 32, 45, .6);
      border-radius: 4px;
      border: 1px solid rgba(103, 137, 148, 1);
    }
  }
}
</style>