<template>
  <div class="page">
    <div class="top-five">
      <h2 class="nav-title">票房TOP5作品</h2>
      <ul>
        <li v-for="item in topList" :key="item.id">
          <img v-if="item.hot" src="../assets/hotShow.png" class="hot"/>
          <p><img :src="item.img" class="img-top" /><span></span></p>
          <p class="title-year">{{item.title}}({{item.year}})</p>
          <p><span v-for="(it, index) in item.type">{{it}}<em v-if="item.type.length-1 != index">/</em></span></p>
          <p class="top-money"><span>{{item.monery}}亿</span></p>
        </li>
      </ul>
    </div>
    <div class="flex-box">
      <div class="left-list">
        <h3 class="header-title">
          <em>以上映作品</em>
          <span class="flex-box">
            <i v-for="item in selList" :class="{'active-pro': item.key == timeSort}" :key="item.key" @click="handlePro(item.key)">{{item.text}}</i>
          </span>
        </h3>
        <div class="production-list">
          <span>职业筛选：</span>
          <a v-for="(item, index) in productionList" @click="filmTyle = index" :key="index" :class="{'col_222': filmTyle == index}">{{item.text}}({{item.num}})</a>
        </div>
        <div class="production-list">
          <span>影片类型：</span>
          <a v-for="(item, index) in filmListSelect" @click="filmTyle2 = index" :key="index" :class="{'col_222': filmType2 == index}">{{item.name}}({{item.num}})</a>
        </div>
        <div class="per_rele_list">
          <dl>
            <dd v-for="list in tableList">
              <i class="year-tag" v-if="list.year">{{list.year}}</i>
              <i class="year-tag" v-if="list.grade">+{{list.grade}}</i>
              <div class="pic-item flex-box" v-for="it in list.items">
                <a :href="it.videoUrl" class="img" >
                  <i class="nowing" v-if="it.nowing"><img src="../assets/hotShow.png" /></i>
                  <img :src="it.img" />
                </a>
                <div class="text-right">
                  <h3 class="title-grade"><span>{{it.title}}</span><em>{{it.grade}}</em></h3>
                  <h4 class="person-identity"><span v-for="(item, index) in it.tag" :key="index"> {{item}} </span></h4>
                  <p class="com-col">导演：<em>{{it.direct}}</em></p>
                  <p class="com-col">主演：<em v-for="(item, index) in it.star" :key="index">{{item}}</em></p>
                </div>
              </div>
            </dd>
          </dl>
        </div>
      </div>

      <div class="right-list">
         <h3 class="nav-title">未上映作品</h3>
         <div class="production-list">作品（9）</div>
         <div class="pic-item flex-box" v-for="it in greatList">
            <a :href="it.videoUrl" class="img" >
              <img :src="it.img" />
            </a>
            <div class="text-right">
              <h3 class="title-grade"><span>{{it.title}}</span></h3>
              <h4 class="person-identity"><span v-for="(item, index) in it.tag" :key="index"> {{item}} </span></h4>
              <p class="com-col">导演：<em>{{it.direct}}</em></p>
              <p class="com-col">主演：<em v-for="(item, index) in it.star" :key="index">{{item}}</em></p>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {personMovies, topList } from '@/api/filmPersonDetail'


@Component
export default class Master extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
  // 时间排序0，评分排序1
  timeSort = 0
  tableList: any = []

  // top-5
  topList = [
    {
      id: 1,
      title: '战狼2',
      img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
      year: '2016',
      hot: 0,
      ranking: 1,
      type: ['动作', '战争'],
      monery: '122.33'
    },
    {
      id: 2,
      title: '战狼2',
      img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
      year: '2016',
      hot: 0,
      ranking: 1,
      type: ['动作', '战争'],
      monery: '122.33'
    },
    {
      id: 3,
      title: '战狼2',
      img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
      year: '2016',
      hot: 0,
      ranking: 1,
      type: ['动作', '战争'],
      monery: '122.33'
    },
    {
      id: 4,
      title: '战狼2',
      img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
      year: '2016',
      hot: 0,
      ranking: 1,
      type: ['动作', '战争'],
      monery: '122.33'
    },
    {
      id: 5,
      title: '战狼2',
      img: 'http://img5.mtime.cn/mt/2019/01/30/152305.14999287_96X128.jpg',
      year: '2016',
      hot: 1,
      ranking: 1,
      type: ['动作', '战争'],
      monery: '122.33'
    },
  ]
  productionList = [
    {text: '全部', num: 10},
    {text: '演员', num: 10},
    {text: '导演', num: 2},
    {text: '编剧', num: 5},
  ]
  // 职业筛选
  filmTyle = 0
  filmType2 = -1
  // 影片类型
  selList = [
    {key: 0, text: '按时间排序'},
    {key: 1, text: '按评分排序'}
  ]
  // 影片类型筛选
  filmListSelect = [
    {key: 1, name: '动作', num: 4},
    {key: 2, name: '冒险', num: 4},
    {key: 3, name: '战争', num: 4},
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
    this.topCountList()
    this.list()
  }

  async topCountList() {
    const id = 107028 // this.id
    try {
      const { data } = await topList(id, 5)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async list() {
    const id = 107028 // this.id
    try {
      const { data } = await personMovies(id)
    } catch (ex) {
      this.handleError(ex)
    }
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
.page {
  padding: 30px 20px 30px 40px;
}
.nav-title {
  font-size: 24px;
  margin-bottom: 30px;
  color: #fff;
}
.top-five {
  background: rgba(0, 32, 45, .9);
  border-radius: 5px;
  padding: 40px 30px 30px;
  margin-bottom: 20px;
  ul {
    display: flex;
    margin-left: -10px;
    margin-right: -10px;
    li {
      width: 25%;
      padding: 0 10px;
      text-align: center;
      color: #fff;
      position: relative;
      .hot {
        position: absolute;
        top: 0;
        left: 20px;
        width: 48px;
      }
      .img-top {
        width: 100%;
        height: 240px;
      }
      .title-year {
        font-size: 16px;
        padding: 10px 0;
      }
      .top-money {
        color: #4fa6bb;
        padding: 10px 0 5px;
      }
    }
  }
}
.active-pro {
  background: #4fa6bb;
}
.left-list {
  width: 53%;
  background: rgba(0, 32, 45, .9);
  padding: 30px 20px 40px 30px;
  border-radius: 5px;
  .header-title {
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    em {
      display: inline-block;
      font-size: 24px;
      color: #fff;
    }
    span {
      display: flex;
      border: solid 1px rgba(79, 166, 187, 1);
      border-radius: 5px;
      overflow: hidden;
      i {
        display: block;
        width: 110px;
        line-height: 32px;
        text-align: center;
        color: #fff;
        cursor: pointer;
      }
    }
  }
  .production-list {
    font-size: 14px;
    color: #fff;
    margin: 10px 0 20px;
    a {
      margin-right: 25px;
      color: #08c;
    }
    .col_222 {
      color: #fff;
    }
  }
  .per_rele_list {
    dl {
      border-left: solid 1px rgba(255, 255, 255, .5);
      margin-left: 40px;
      dd {
        position: relative;
        font-size: 14px;
        .year-tag {
          width: 56px;
          height: 26px;
          line-height: 26px;
          position: absolute;
          left: -30px;
          background: #da6c70;
          font-size: 20px;
          color: #fff;
          text-align: center;
        }
      }
    }
  }
}
.right-list {
  font-size: 14px;
  width: 47%;
  background: rgba(0, 32, 45, .9);
  margin-left: 20px;
  padding: 30px 30px 40px;
  border-radius: 5px;
}
.pic-item {
  margin-bottom: 40px;
  margin-left: 47px;
  position: relative;
  .img {
    position: relative;
    width: 140px;
    height: 160px;
    img {
      width: 100%;
      height: 100%;
    }
    .nowing {
      width: 48px;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .text-right {
    color: #fff;
    padding-left: 15px;
    .title-grade {
      padding-top: 10px;
      span {
        padding-right: 25px;
      }
      em {
        display: inline-block;
        width: 48px;
        height: 22px;
        line-height: 22px;
        background: #da6c70;
        color: #fff;
        text-align: center;
      }
    }
    .person-identity {
      padding-top: 37px;
      padding-bottom: 4px;
    }
    .com-col {
      padding: 4px 0;
      em {
        color: #4fa6bb;
      }
    }
  }
}
</style>