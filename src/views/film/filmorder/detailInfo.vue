<template>
  <div class='page'>
    <!-- 剧情简介 -->
   <Row class='de-info' >
      <Row class='title' >剧情简介</Row>
      <Row style='margin-top: 20px;line-height:30px; '>&nbsp;&nbsp;1960年，中国登山队向珠峰发起冲刺，完成了世界首次北坡登顶这一项不可能完成的任务，15年后，房屋周和去松林在气象学家徐寅的帮助下，带领李国良，阳光等年轻队员再次挑战世界之巅，迎接他们的将是更加残酷的现实，也是生于斯的挑战...<span v-if='info'>123...</span></Row>
      <div class='mores' style='text-align: right;margin-right: 30px;'@click='detailinfo' >展开全部<span></span></div>
   </Row>
   <!-- 更多资料 -->
   <div class="more">
     <Row class='title'>更多资料</Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>对白语言</Col>
       <Col span='20' class='fo-bo'>汉语普通话</Col>
     </Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>国家 / 地区</Col>
       <Col span='20' class='fo-bo'>中国&nbsp;China</Col>
     </Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>上映 / 发行日期</Col>
       <Col span='20' class='fo-bo'>2019年9月30日</Col>
     </Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>制作 / 发行</Col>
       <Col span='20' class='fo-bo'>上影股份影视发行公司 ()</Col>
     </Row>
   </div>
   <!-- 图片 -->
   <div style='padding: 20px;'>
     <Row class='title' style='margin-bottom: 20px;'>图片(共16张)</Row>
      <div class="demo-carousel">
        <div style='margin-left: 0%;'><img src="./assets/wait.jpg" alt=""></div>
        <div><img src="./assets/wait.jpg" alt=""></div>
        <div><img src="./assets/wait.jpg" alt=""></div>
        <div><img src="./assets/wait.jpg" alt=""></div>
        <div><img src="./assets/wait.jpg" alt=""></div>
      </div>
      <div class='mores'>展开全部<span></span></div>
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

  mounted() {
  }

  detailinfo() {
    this.info = true
  }

}

</script>
<style lang='less' scoped>
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
}
.fo-bo {
  font-weight: 400;
  font-size: 14px;
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
  color: rgba(0, 32, 46, 1);
  line-height: 50px;
  font-size: 24px;
}
.mores {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 32, 45, 1);
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
</style>