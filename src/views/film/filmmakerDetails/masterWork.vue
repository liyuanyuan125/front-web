<template>
  <div>
    <div class="flex-box">
      <div class="left-list">
        <h3 class="flex-box header-title">
          <em>以上映作品（45）</em>
          <span><i v-for="item in selList" :class="{'active-pro': item.key == timeSort}" :key="item.key" @click="handlePro(item.key)">{{item.text}}</i></span>
        </h3>
        <div class="production-list">
          <span>职业筛选：</span>
          <em v-for="(item, index) in productionList" :key="index">{{item.text}}({{item.num}})</em>
        </div>
        <div class="per_rele_list">
          <dl>
            <dd v-for="list in tableList">
              <i class="year-tag" v-if="list.year">{{list.year}}</i>
              <i class="year-tag" v-if="list.grade">+{{list.grade}}</i>
              <div class="pic-item flex-box" v-for="it in list.items">
                <a :href="it.videoUrl" class="img" >
                  <i class="nowing" v-if="it.nowing">正在热映</i>
                  <img :src="it.img" />
                </a>
                <div class="text-right">
                  <h3 class="title-grade"><span>{{it.title}}</span><em>{{it.grade}}</em></h3>
                  <h4><span v-for="(item, index) in it.tag" :key="index">{{item}}</span></h4>
                  <h3>导演：{{it.direct}}</h3>
                  <h4>主演： <em v-for="(item, index) in it.star" :key="index">{{item}}</em></h4>
                </div>
              </div>
            </dd>
          </dl>
        </div>
      </div>

      <div class="right-list">
        <h3><em>未上映作品（1）</em></h3>
         <dl class="great-list">
            <dd v-for="it in greatList" class="flex-box">
               <a :href="it.videoUrl" class="img" >
                  <i class="nowing" v-if="it.nowing">正在热映</i>
                  <img :src="it.img" />
                </a>
                <div class="text-right">
                  <h3 class="title-grade"><span>{{it.title}}</span><em>{{it.grade}}</em></h3>
                  <h4><span v-for="(item, index) in it.tag" :key="index">{{item}}</span></h4>
                  <h3>导演：{{it.direct}}</h3>
                  <h4>主演： <em v-for="(item, index) in it.star" :key="index">{{item}}</em></h4>
                </div>
            </dd>
          </dl>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Master extends ViewBase {
  // 时间排序0，评分排序1
  timeSort = 0
  tableList: any = []
  productionList = [
    {text: '全部', num: 10},
    {text: '演员', num: 10},
    {text: '全部', num: 10},
    {text: '全部', num: 10},
  ]
  selList = [
    {key: 0, text: '按时间排序'},
    {key: 1, text: '按评分排序'}
  ]
  // 上映时间
  filmList = [
    {
      year: 2019,
      items: [
        {
          img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
          videoUrl: 'http://movie.mtime.com/218707/',
          nowing: 1,
          title: '流浪地球',
          grade: 7.8,
          tag: ['演员', '导演', '歌手'],
          direct: '武警',
          star: ['小李', '小王']
        },
        {
          img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
          videoUrl: 'http://movie.mtime.com/218707/',
          nowing: 1,
          title: '流浪地球',
          grade: 7.8,
          tag: ['演员', '导演', '歌手'],
          direct: '武警',
          star: ['小李', '小王']
        },
      ]
    },
    {
      year: 2018,
      items: [
        {
          img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
          videoUrl: 'http://movie.mtime.com/218707/',
          nowing: 1,
          title: '流浪地球',
          grade: 7.8,
          tag: ['演员', '导演', '歌手'],
          direct: '武警',
          star: ['小李', '小王']
        },
        {
          img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
          videoUrl: 'http://movie.mtime.com/218707/',
          nowing: 1,
          title: '流浪地球',
          grade: 7.8,
          tag: ['演员', '导演', '歌手'],
          direct: '武警',
          star: ['小李', '小王']
        },
      ]
    },
    {
      year: 2017,
      items: [
        {
          img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
          videoUrl: 'http://movie.mtime.com/218707/',
          nowing: 1,
          title: '流浪地球',
          grade: 7.8,
          tag: ['演员', '导演', '歌手'],
          direct: '武警',
          star: ['小李', '小王']
        },
        {
          img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
          videoUrl: 'http://movie.mtime.com/218707/',
          nowing: 1,
          title: '流浪地球',
          grade: 7.8,
          tag: ['演员', '导演', '歌手'],
          direct: '武警',
          star: ['小李', '小王']
        },
      ]
    },
  ]
  // 未上映
  greatList = [
    {
      img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
      videoUrl: 'http://movie.mtime.com/218707/',
      title: '流浪地球',
      grade: 8.8,
      tag: ['演员', '导演', '歌手'],
      direct: '武警',
      star: ['小李', '小王']
    },
    {
      img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
      videoUrl: 'http://movie.mtime.com/218707/',
      title: '流浪地球',
      grade: 8.2,
      tag: ['演员', '导演', '歌手'],
      direct: '武警',
      star: ['小李', '小王']
    },
  ]
  // 上映评分
  gradeList = [
    {
      grade: 8,
      items: [
        {
          img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
          videoUrl: 'http://movie.mtime.com/218707/',
          nowing: 1,
          title: '流浪地球',
          grade: 8.8,
          tag: ['演员', '导演', '歌手'],
          direct: '武警',
          star: ['小李', '小王']
        },
        {
          img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
          videoUrl: 'http://movie.mtime.com/218707/',
          nowing: 1,
          title: '流浪地球',
          grade: 8.2,
          tag: ['演员', '导演', '歌手'],
          direct: '武警',
          star: ['小李', '小王']
        },
      ]
    },
    {
      grade: 5,
      items: [
        {
          img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
          videoUrl: 'http://movie.mtime.com/218707/',
          nowing: 1,
          title: '流浪地球',
          grade: 5.8,
          tag: ['演员', '导演', '歌手'],
          direct: '武警',
          star: ['小李', '小王']
        },
        {
          img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
          videoUrl: 'http://movie.mtime.com/218707/',
          nowing: 1,
          title: '流浪地球',
          grade: 5,
          tag: ['演员', '导演', '歌手'],
          direct: '武警',
          star: ['小李', '小王']
        },
      ]
    },
  ]

  mounted() {
    this.tableList = this.filmList
  }
  handlePro(id: any) {
    this.timeSort = id
    this.tableList = this.timeSort == 0 ? this.filmList : this.gradeList
  }
}

</script>
<style lang='less' scoped>
h2, h3, h4 {
  font-weight: normal;
}
.active-pro {
  color: green;
}
.left-list {
  flex: 1;
  background: #fff;
  min-height: 100%;
  padding: 30px 20px 40px;
  .header-title {
    padding-bottom: 10px;
    border-bottom: dashed 1px #ededed;
    em {
      display: inline-block;
      width: 30%;
    }
    span {
      display: inline-block;
      width: 70%;
      text-align: right;
      i {
        padding-left: 15px;
        cursor: pointer;
      }
    }
  }
  .production-list {
    margin: 10px 0 20px;
  }
  .per_rele_list {
    dl {
      border-left: solid 1px #e8e9ee;
      margin-left: 69px;
      padding-left: 30px;
      dd {
        position: relative;
        font-size: 14px;
        .year-tag {
          width: 70px;
          height: 28px;
          line-height: 28px;
          position: absolute;
          left: -90px;
          background: green;
          font-size: 20px;
          color: #fff;
          text-align: center;
          &::after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-width: 14px;
            border-style: solid;
            border-color: transparent transparent transparent green;
            position: absolute;
            right: -27px;
            top: 0;
          }
        }
        .pic-item {
          margin-bottom: 30px;
          margin-left: 20px;
          position: relative;
          min-height: 128px;
          .img {
            position: relative;
            width: 96px;
            .nowing {
              // background: url('//static1.mtime.cn/library/20190416135220/images/icon.gif') no-repeat 0 0;
              width: 48px;
              height: 48px;
              position: absolute;
              left: 0;
              top: 0;
            }
          }
          .text-right {
            padding-left: 15px;
            .title-grade {
              span {
                padding-right: 25px;
              }
              em {
                display: inline-block;
                width: 40px;
                height: 20px;
                line-height: 20px;
                background: green;
                color: #fff;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}
.right-list {
  flex: 1;
  .great-list {
    padding: 20px 30px 50px;
    dd {
      background: #fff;
    }
  }
}
</style>