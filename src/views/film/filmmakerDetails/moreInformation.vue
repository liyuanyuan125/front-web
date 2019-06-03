<template>
  <div class="personal-information">
    <h2 class="nav-title">人物简介</h2>
    <ul class="personal-mes">
      <li><span>出生日期：</span><span>90-90-90</span></li>
      <li> <span>身高: 1766cm</span> </li>
      <li><span>出生地：</span><span>中国，北京</span></li>
      <li><span>体重: 65kg</span></li>
    </ul>
    <div class="personal-text">
      吴京，被誉为“功夫小子”，从1995年就开始接拍电视剧和电影，其引路人便是《少林寺》以及《少林武王》的导演张鑫炎，而吴京的武术教练也就是李连杰的教练吴彬。当年还在武术队里奋斗的吴京被张鑫炎看中，
      于是和师兄李连杰一样，顺利地加入了娱乐圈。两人的经历惊人地相似。2005年后吴京搬
    </div>
    <h2 class="nav-title">人物关系</h2>
    <ul class="personal-relation">
      <li v-for="item in personalList" :key="item.id">
        <p class="per-title font_16">{{item.title}}</p>
        <p class="head-img"><img :src="item.headImg" /></p>
        <p class="per-name font_18">{{item.name}}</p>
        <p class="per-englist font_18">{{item.englist}}</p>
        <p><span v-for="(it, index) in item.idtentity" :key="index">{{it}}<em v-if="item.idtentity.length-1 != index"> / </em></span></p>
        <p>代表作品</p>
        <p><span v-for="(na, index) in item.production" :key="index"><a href="" target="_blank">《{{na.text}}》</a></span></p>
      </li>
    </ul>
    <h2 class="nav-title">图片（{{imgUrl.length}}）</h2>
    <transition-group name="list" tag="ul" class="loading-img">
      <li v-for="img in imgList" :key="img.key"><img :src="img.img"/></li>
    </transition-group>
    <div class="show-all" v-if="imgUrl.length > 5">
      <span @click="handleToggle">{{tabShowTitle}}<Icon :class="{'arrowDown': arrowFlag == 0, 'arrowUp': arrowFlag == 1}" type="ios-arrow-down" size="25" /></span>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'

@Component
export default class Information extends ViewBase {
  tabShowTitle = '展示全部'
  arrowFlag = 0

  imgUrl = [
    { key: 1, img: 'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg'},
    { key: 2, img: 'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg'},
    { key: 3, img: 'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg'},
    { key: 4, img: 'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg'},
    { key: 5, img: 'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg'},
    { key: 6, img: 'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg'},
  ]
  imgList: any = []
  personalList = [
    {
      title: '合作最多的导演',
      id: 1,
      headImg: 'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
      name: '选和平',
      englist: 'yuanyuan.li',
      idtentity: ['导演'],
      production: [
        { key: 1, text: '舞动1', url: ''},
        { key: 2, text: '舞动2', url: ''},
        { key: 3, text: '舞动3', url: ''},
        { key: 4, text: '舞动4', url: ''},
        { key: 5, text: '舞动5', url: ''},
        { key: 6, text: '舞动3xxxxxx', url: ''},
        { key: 7, text: '舞动4xxxx', url: ''},
        { key: 8, text: '舞动5', url: ''},
      ]
    },
    {
      title: '合作最多的导演',
      id: 2,
      headImg: 'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
      name: '选和平',
      englist: 'yuanyuan.li',
      idtentity: ['导演', '制作人'],
      production: [
        { key: 1, text: '舞动1', url: ''},
        { key: 2, text: '舞动2', url: ''},
        { key: 3, text: '舞动3', url: ''},
        { key: 4, text: '舞动4', url: ''},
        { key: 5, text: '舞动5', url: ''},
      ]
    },
    {
      title: '合作最多的导演',
      id: 3,
      headImg: 'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
      name: '选和平',
      englist: 'yuanyuan.li',
      idtentity: ['导演', '制作人'],
      production: [
        { key: 1, text: '舞动1', url: ''},
        { key: 2, text: '舞动2', url: ''},
        { key: 3, text: '舞动3', url: ''},
        { key: 4, text: '舞动4', url: ''},
        { key: 5, text: '舞动5', url: ''},
      ]
    },
    {
      title: '合作最多的导演',
      id: 4,
      headImg: 'http://img31.mtime.cn/pi/2015/02/21/170436.12695801_220X220.jpg',
      name: '选和平',
      englist: 'yuanyuan.li',
      idtentity: ['导演', '制作人'],
      production: [
        { key: 1, text: '舞动1', url: ''},
        { key: 2, text: '舞动2', url: ''},
        { key: 3, text: '舞动3', url: ''},
        { key: 4, text: '舞动4', url: ''},
        { key: 5, text: '舞动5', url: ''},
      ]
    },
  ]
  mounted() {
    this.imgList = this.imgUrl.slice(0, 5)
  }
  handleToggle() {
    if (!this.arrowFlag) {
      this.arrowFlag = 1
      this.tabShowTitle = '向上隐藏'
      this.imgList = this.imgUrl
    } else {
      this.arrowFlag = 0
      this.tabShowTitle = '展示全部'
      this.imgList = this.imgUrl.slice(0, 5)
    }
  }
}

</script>
<style lang='less' scoped>
.font_16 {
  font-size: 16px;
}
.font_17 {
  font-size: 17px;
}
.font_18 {
  font-size: 18px;
}
.nav-title {
  font-size: 24px;
  font-weight: normal;
  margin-bottom: 30px;
  color: #fff;
}
.personal-information {
  background: rgba(0, 32, 45, .9);
  border-radius: 0 0 5px 5px;
  padding: 35px 40px;
  color: #fff;
  .personal-mes {
    display: flex;
    margin-left: -15px;
    margin-right: -15px;
    font-size: 18px;
    li {
      height: 140px;
      width: 25%;
      border-radius: 5px;
      margin: 0 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 20px;
      &:nth-child(1) {
        background: #00202d url('../assets/age.png') no-repeat right center;
        background-size: 80px;
      }
      &:nth-child(2) {
        background: #00202d url('../assets/height.png') no-repeat right center;
        background-size: 80px;
      }
      &:nth-child(3) {
        background: #00202d url('../assets/adress.png') no-repeat right center;
        background-size: 80px;
      }
      &:nth-child(4) {
        background: #00202d url('../assets/weight.png') no-repeat right center;
        background-size: 80px;
      }
    }
  }
  .personal-text {
    text-indent: 2rem;
    font-size: 14px;
    line-height: 26px;
    text-align: justify;
    padding: 15px 0 25px;
    border-bottom: solid 1px rgba(79, 166, 187, .5);
    margin-bottom: 30px;
  }
  .personal-relation {
    display: flex;
    flex-wrap: wrap;
    border-bottom: solid 1px rgba(79, 166, 187, .5);
    margin-bottom: 30px;
    li {
      width: 33.3%;
      text-align: center;
      padding-bottom: 20px;
      .head-img {
        img {
          width: 140px;
          height: 140px;
          border-radius: 100%;
          margin: 18px 0 18px;
        }
      }
      .per-englist {
        text-transform: capitalize;
        padding-bottom: 18px;
      }
    }
  }
  .loading-img {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;
    transition: all 2s;
    li {
      width: 20%;
      height: 180px;
      margin-bottom: 25px;
      padding: 0 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .show-all {
    text-align: center;
    font-size: 14px;
    color: #b3bcc0;
    span {
      cursor: pointer;
    }
  }
}
.arrowDown {
  animation: arrowDown .5s both;
}
@keyframes arrowDown {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(180deg);
  }
}
.arrowUp {
  animation: arrowUp .5s both;
}
@keyframes arrowUp {
  0% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(0);
  }
}
// 进入过度transition
.list-enter-active {
  transition: all 1s;
}

.list-enter, .list-leave-to {
  opacity: 0;
}
</style>