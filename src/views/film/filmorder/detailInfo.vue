<template>
  <div class='page'>
    <!-- 剧情简介 -->
   <Row class='de-info' >
      <Row class='title' >剧情简介</Row>
      <Row style='margin-top: 20px;line-height:30px; color: #B3BCC0;'>&nbsp;&nbsp;1960年，中国登山队向珠峰发起冲刺，完成了世界首次北坡登顶这一项不可能完成的任务，15年后，房屋周和去松林在气象学家徐寅的帮助下，带领李国良，阳光等年轻队员再次挑战世界之巅，迎接他们的将是更加残酷的现实，也是生于斯的挑战...<span v-if='info'>123...</span></Row>
      <div class='mores' style='text-align: right;margin-right: 30px;'@click='detailinfo' >展开全部<span></span></div>
   </Row>
   <!-- 更多资料 -->
   <div class="more">
     <Row class='title'>更多资料</Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>对白语言</Col>
       <Col span='20' class='fo-bos'>汉语普通话</Col>
     </Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>国家 / 地区</Col>
       <Col span='20' class='fo-bos'>中国&nbsp;China</Col>
     </Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>上映 / 发行日期</Col>
       <Col span='20' class='fo-bos'>2019年9月30日</Col>
     </Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>制作 / 发行</Col>
       <Col span='20' class='fo-bos'>上影股份影视发行公司 ()</Col>
     </Row>
   </div>
   <!-- 图片 -->
   <div style='padding: 20px;'>
     <Row class='title' style='margin-bottom: 20px;'>图片(共16张)</Row>
      <!-- <div class="demo-carousel">
        <div style='margin-left: 0%;'><img src="./assets/wait.jpg" alt=""></div>
        <div><img src="./assets/wait.jpg" alt=""></div>
        <div><img src="./assets/wait.jpg" alt=""></div>
        <div><img src="./assets/wait.jpg" alt=""></div>
        <div><img src="./assets/wait.jpg" alt=""></div>
      </div>
      <div class='mores'>展开全部<span></span></div> -->
      <transition-group name="list" tag="ul" class="loading-img">
        <li v-for="img in imgList" :key="img.key"><img :src="img.img"/></li>
      </transition-group>
      <div class="show-all" v-if="imgUrl.length > 5">
        <span @click="handleToggle">{{tabShowTitle}}<Icon :class="{'arrowDown': arrowFlag == 0, 'arrowUp': arrowFlag == 1}" type="ios-arrow-down" size="25" /></span>
      </div>
   </div>
  </div>
</template>

<script lang='ts'>
import { Component , Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
@Component
export default class Main extends ViewBase {
  value1 = 0
  info = false
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

  mounted() {
    this.imgList = this.imgUrl.slice(0, 5)
  }

  detailinfo() {
    this.info = true
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
.page {
  background: rgba(0, 32, 45, 0.8);
  border-radius: 5px;
}
.de-info {
  padding: 20px;
  font-size: 15px;
  border-bottom: 2px solid rgba(79, 166, 187, 0.56);
}
.more {
  padding: 20px;
  border-bottom: 2px solid rgba(79, 166, 187, 0.56);
}
.row-bo {
  padding: 10px;
  color: #b3bcc0;
}
.fo-bo {
  font-weight: 400;
  font-size: 14px;
}
.fo-bos {
  font-weight: 400;
  font-size: 14px;
  color: #fff;
}
.demo-carousel {
  width: 100%;
  height: 200px;
  div {
    width: 19%;
    height: 100%;
    float: left;
    margin-left: 1%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.title {
  font-weight: 500;
  color: #fff;
  line-height: 50px;
  font-size: 24px;
}
.mores {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  line-height: 70px;
  position: relative;
  span {
    position: absolute;
    top: 27px;
    display: inline-block;
    width: 11px;
    height: 11px;
    margin-left: 10px;
    border-left: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    transform-origin: 50% 50%;
    transform: rotate(-45deg);
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