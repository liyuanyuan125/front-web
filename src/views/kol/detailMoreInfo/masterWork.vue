<template>
  <div class="home-bg brand-list">
    <div class="select-brand">
      <span>90日热门内容</span>
      <Select v-model="plat" style="width:100px">
        <Option v-for="item in platformList" :value="item.key" :key="item.key" @click="platSelect">{{ item.text }}</Option>
    </Select>
    </div>

    <div class="query-select">
      <span :class="{'active-tab': flag == it.key}" v-for="(it, index) in selectOption" @click="handleQuery(index)"
       :key = 'index'>{{it.text}}</span>
    </div>

    <div class="list-items">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="item-inner">
          <a :href="item.videoUrl" target="_blank" ><img :src="item.imgUrl" alt="" class="img" /></a>
          <p class="title" :title="item.title">{{item.title}}</p>
          <p class="text-center">
            <span><i class="iconfont icon-shipinbofang-" size="15" />{{item.videoNum}}万</span> 
            <span><i class="iconfont icon-dianzan" size="15" />{{item.likesNum}}万</span> 
            <span><i class="iconfont icon-pinglun" size="13" />{{item.remarkNum}}万</span> 
          </p> 
          <p class="text-center">{{item.time}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Main extends ViewBase {
  // 选择平台
  plat = 0
  platformList = [
    {key: 0, text: '微博'},
    {key: 1, text: '微信'},
    {key: 2, text: '抖音'},
    {key: 3, text: '快手'},
    {key: 4, text: '小红书'},
  ]

  // 数据筛选
  flag = 0
  selectOption = [
    {key: 0, text: '点赞数'},
    {key: 1, text: '播放数'},
    {key: 2, text: '评论数'},
    {key: 3, text: '最新'},
  ]
  videoUrl = 'https://www.mihui.com/api/video/search/redirect/?real_url=https%3A//www.bilibili.com/video/av52387972/'
  list = [
    {
      id: 0,
      imgUrl: 'http://i2.hdslb.com/bfs/archive/2132cfef0cf5762ce191171bf24f287e000009e8.jpg',
      videoUrl: this.videoUrl,
      time: '20120-12-12 30:00',
      title: '我家的马桶香香的~（最后的',
      videoNum: 10,
      likesNum: 10,
      remarkNum: 3,
    },
    {
      id: 1,
      imgUrl: 'http://i2.hdslb.com/bfs/archive/2132cfef0cf5762ce191171bf24f287e000009e8.jpg',
      videoUrl: this.videoUrl,
      time: '20120-12-12 30:00',
      title: '我家的马桶香香的~（最后的',
      videoNum: 10,
      likesNum: 10,
      remarkNum: 3,
    },
    {
      id: 2,
      imgUrl: 'http://i2.hdslb.com/bfs/archive/2132cfef0cf5762ce191171bf24f287e000009e8.jpg',
      videoUrl: this.videoUrl,
      time: '20120-12-12 30:00',
      title: '我家的马桶香香的~（最后的',
      videoNum: 10,
      likesNum: 10,
      remarkNum: 3,
    },
    {
      id: 3,
      imgUrl: 'http://i2.hdslb.com/bfs/archive/2132cfef0cf5762ce191171bf24f287e000009e8.jpg',
      videoUrl: this.videoUrl,
      time: '20120-12-12 30:00',
      title: '我家的马桶香香的~（最后的',
      videoNum: 10,
      likesNum: 10,
      remarkNum: 3,
    },
    {
      id: 4,
      imgUrl: 'http://i2.hdslb.com/bfs/archive/2132cfef0cf5762ce191171bf24f287e000009e8.jpg',
      videoUrl: this.videoUrl,
      time: '20120-12-12 30:00',
      title: '我家的马桶香香的~（最后的',
      videoNum: 10,
      likesNum: 10,
      remarkNum: 3,
    },
    {
      id: 5,
      imgUrl: 'http://i2.hdslb.com/bfs/archive/2132cfef0cf5762ce191171bf24f287e000009e8.jpg',
      videoUrl: this.videoUrl,
      time: '20120-12-12 30:00',
      title: '我家的马桶香香的~（最后的',
      videoNum: 10,
      likesNum: 10,
      remarkNum: 3,
    },
  ]

  handleQuery(ind: number) {
    this.flag = ind
  }
  platSelect(id: any) {
    this.plat = id
  }
}

</script>
<style lang='less' scoped>
@import '~@/site/lib.less';
.text-center {
  text-align: center;
}
.brand-list {
  padding: 30px 20px 40px;
  .select-brand {
    font-size: 14px;
    border-bottom: solid 1px #ededed;
    padding-bottom: 15px;
    span {
      padding-right: 15px;
    }
  }
  .query-select {
    font-size: 14px;
    margin: 15px 0;
    span {
      margin-right: 15px;
      cursor: pointer;
    }
  }
  .list-items {
    margin-left: -5px;
    margin-right: -5px;
    .item {
      width: 25%;
      float: left;
      padding: 0 5px;
      margin-bottom: 15px;
      .item-inner {
        overflow: hidden;
        position: relative;
        .title {
          font-size: 15px;
          overflow: hidden;
          line-height: 25px;
        }
        .img {
          width: 100%;
          height: 170px;
          border-radius: 8px;
        }
      }
    }
  }
}
.active-tab {
  color: @c-res-btn;
}
</style>