<template>
  <div class="brand-list com-modal">
    <div class="select-brand com-modal-title ">
      <span>90日热门内容</span>
      <Select v-model="plat" size="small" style="width:100px">
        <Option v-for="item in platformList" :value="item.key" :key="item.key" @click="platSelect">{{ item.text }}</Option>
      </Select>
    </div>

    <div class="query-select">
      <Tabs class="" v-model="tabKey" @on-click="handleChangeTab">
        <TabPane v-for="item in selectOption" :key="item.key" :label="item.text"></TabPane>
      </Tabs>
    </div>

    <div class="list-items">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="item-inner flex-box">
          <a :href="item.videoUrl" target="_blank" class="video-url" >
            <i></i>
            <img :src="item.imgUrl" alt="" class="img" />
          </a>
          <div class="inner-right">
            <p class="title" :title="item.title">{{handleSlice(item.title)}}</p>
            <p class="icon-num">
              <span><i class="iconfont icon-shipin" size="20" />{{item.videoNum}}万</span>
              <span><i class="iconfont icon-dianzan1" size="20" />{{item.likesNum}}万</span>
              <span><i class="iconfont icon-dianping" size="20" />{{item.remarkNum}}万</span>
            </p>
            <p class="times">{{item.time}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Opus extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  // 选择平台
  plat = 0

  platformList = [
    {key: 0, text: '微博'},
    {key: 1, text: '微信'},
    {key: 2, text: '抖音'},
    {key: 3, text: '快手'},
    {key: 4, text: '小红书'},
  ]

  tabKey = ''

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
      title: '我家的马桶香香的~（最后的马桶香香的~（最后马桶香香的~（最后',
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

  handleChangeTab() {}

  handleSlice(text: string) {
    return text.length > 15 ? text.substring(0, 15) + '.....' : text
  }

  platSelect(id: any) {
    this.plat = id
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/views/kol/less/common.less';

.iconfont {
  font-size: 20px;
  color: #a3d5e6;
  padding-right: 8px;
}
/deep/ .ivu-tabs {
  color: #fff;
  .ivu-tabs-tab {
    line-height: 45px;
  }
  .ivu-tabs-tab-active {
    color: #fff;
    font-size: 14px;
  }
}
.brand-list {
  margin: 30px 36px 50px;
  font-size: 14px;
  .select-brand {
    padding-left: 30px;
    span {
      padding-right: 20px;
    }
  }
  .query-select {
    color: #fff;
    font-size: 14px;
    margin: 15px 0;
    span {
      margin-right: 15px;
      cursor: pointer;
    }
  }
  .list-items {
    padding: 0 30px 40px;
    margin-left: -15px;
    margin-right: -15px;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 50%;
      padding: 0 15px;
      margin-bottom: 30px;
      .item-inner {
        overflow: hidden;
        position: relative;
        background: rgba(0, 32, 45, .5);
        border-radius: 8px;
        height: 200px;
        .video-url {
          position: relative;
          i {
            display: block;
            width: 50px;
            height: 50px;
            background: url('../assets/play.png') no-repeat;
            background-size: 100%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .inner-right {
          padding: 29px 20px 27px;
          .icon-num {
            font-size: 14px;
            span {
              padding-right: 20px;
            }
          }
          .times {
            font-size: 20px;
            padding-top: 12px;
          }
        }
        .title {
          font-size: 18px;
          overflow: hidden;
          height: 80px;
          line-height: 25px;
          color: #a3d5e6;
        }
        .img {
          width: 240px;
          height: 200px;
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
