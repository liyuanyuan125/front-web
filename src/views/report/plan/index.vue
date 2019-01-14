<template>
  <div class="page">
    <!-- <ul class='tab'>
      <li @click='tab(index)' v-for='(item,index) in tabObj' :key='item'>{{item}}</li>
    </ul> -->
    <div class='top-btn'>
      <div class='tops-btn'>
        <div class='code'>投放成效报告</div>
        <Button class='btn-dao' type="warning">报表导出</Button>
      </div>
    </div>
    <div class='top'>
      <div class='tops'>
        <div class='tops-img'>
          <img src="./assets/1-1.png" alt="">
        </div>
        <div class='tops-byte'>
          <row class='code-list'>
            <Col span='3' style='color:#888'>投放类型</Col>
            <Col span='12'>{{forMat.id}}</Col>
          </row>
          <row class='code-list'>
            <Col span='3' style='color:#888'>广告计划</Col>
            <Col span='12'>{{forMat.name}}</Col>
            <Col span='4' style='color:#888'>客户</Col>
            <Col span='3'>{{forMat.client}}</Col>
          </row>
          <row class='code-list'>
            <Col span='3' style='color:#888'>广告片</Col>
            <Col span='12'>{{forMat.detail}}</Col>
            <Col span='4' style='color:#888'>广告规格时长</Col>
            <Col span='2' style='color: #ff8237;'>30s</Col>
          </row>
          <row class='code-list' style='border: 0px;'>
            <Col span='3' style='color:#888'>投放排期</Col>
            <Col span='12'>{{forMat.time}}</Col>
            <Col span='4' style='color:#888'>投放周期</Col>
            <Col span='2' style='color: #ff8237;'>{{forMat.longTime}}天</Col>
          </row>
        </div>
      </div>
    </div>
    <i-col span="24" class="demo-tabs-style2">
      <Tabs type="card" :animated="false">
        <div class='one'></div>
        <div class='two'></div>
        <!-- <Tab-pane :label=item v-for='(item,index) in tabObj'  :key="index">
          {{item}}的内容
        </Tab-pane> -->
        <Tab-pane label="汇总" key="key1">
          <div class='imgs'>
            <img src="./assets/1-2.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>投放人群</div>
            <img src="./assets/1-3.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>投放影院</div>
            <img src="./assets/1-4.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>投放影片</div>
            <img src="./assets/1-5.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>投放地区</div>
            <img src="./assets/1-6.png" alt="">
          </div>
        </Tab-pane>
        <Tab-pane label="按人群" key="key2">
          <div class='imgs'>
            <img src="./assets/2-1.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>地域分布</div>
            <img src="./assets/2-2.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>人群画像</div>
            <img src="./assets/2-3.png" alt="">
          </div>
        </Tab-pane>
        <Tab-pane label="按影院" key="key3">
          <div class='imgs'>
            <img src="./assets/3-1.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>成效概览</div>
            <img src="./assets/3-2.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>单个影院成效</div>
            <img src="./assets/3-3.png" alt="">
          </div>
        </Tab-pane>
        <Tab-pane label="按影片" key="key4">
          <div class='imgs'>
            <img src="./assets/4-1.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>成效概览</div>
            <img src="./assets/4-2.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>单个影院成效</div>
            <img src="./assets/4-3.png" alt="">
          </div>
        </Tab-pane>
        <Tab-pane label="按地区" key="key5">
          <div class='imgs'>
            <img src="./assets/5-1.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>投放地区</div>
            <img src="./assets/5-2.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>成效概览</div>
            <img src="./assets/5-3.png" alt="">
          </div>
          <div class='imgs'>
            <div class='ze'>单个城市成效</div>
            <img src="./assets/5-4.png" alt="">
          </div>
        </Tab-pane>
      </Tabs>
    </i-col>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'


const mockMap = [
  {
    id: '映前广告－标准定向',
    name: '2019款全新奔驰G级影院广告－春节档',
    client: '奔驰',
    detail: '奔驰G级影院广告语：与时间争锋',
    time: '2019-2-4 ～2019-2-10',
    longTime : '7',
    data: '春节档',
    man : '400,000',
    ceil: '4000,000.00',
    sex: '男'
  },
  {
    id: '映前广告－标准定向',
    name: '2019款全新奔驰G级影院广告－春节档',
    client: '奔驰',
    detail: '奔驰G级影院广告语：与时间争锋',
    time: '2019-2-4 ～2019-2-10',
    longTime : '7',
    data: '春节档',
    man : '400,000',
    ceil: '4000,000.00',
    sex: '男'
  },
  {
    id: '映前广告－标准定向',
    name: '2019款全新奔驰G级影院广告－春节档',
    client: '奔驰',
    detail: '奔驰G级影院广告语：与时间争锋',
    time: '2019-2-4 ～2019-2-10',
    longTime : '7',
    data: '春节档',
    man : '400,000',
    ceil: '4000,000.00',
    sex: '男'
  },
]

@Component
export default class Main extends ViewBase {

  tabObj: any = ['汇总', '按人群' , '按影院' , '按影片' , '按地区']

  get forMat() {
    const id: any = (this.$route.params as any).id - 1 || 0
    return mockMap[id]
  }

}
</script>

<style lang="less" scoped>
.page {
  background: #fff;
}
.imgs {
  // background: red;
  width: 100%;
  // height: 100px;
  margin-top: 10px;
  position: relative;
  img {
    width: 1009px;
    height: 100%;
    margin-left: 10%;
  }
  .ze {
    width: 100%;
    height: 50px;
    background: #f9f9f9;
    top: 0;
    left: 0;
    line-height: 50px;
    font-size: 14px;
    padding-left: 27px;
  }
}
.top-btn {
  width: 100%;
  margin-bottom: 20px;
  font-size: 17px;
  font-size: '宋体';
  background: #eee;
  .tops-btn {
    width: 100%;
    height: 50px;
    .code {
      width: 10%;
      float: left;
      color: #2481d7;
      margin-left: 15px;
      line-height: 50px;
    }
    .btn-dao {
      margin-top: 5px;
      width: 10%;
      height: 40px;
      float: right;
      color: #fff;
    }
  }
}
.top {
  width: 100%;
  padding-bottom: 40px;
  background: #fff;
}
.tops {
  width: 100%;
  height: 250px;
  .tops-img {
    float: left;
    width: 40%;
    height: 100%;
    img {
      width: 70%;
      height: 95%;
      margin-top: 3%;
      margin-left: 10%;
    }
  }
  .tops-byte {
    float: left;
    width: 57%;
    height: 100%;
    margin-left: 3%;
    font-size: 14px;
    .code-list {
      display: flex;
      color: #222;
      width: 100%;
      line-height: 62.5px;
      font-size: 16px;
      // border-bottom: 1px dashed #ccc;
      col {
        display: inline-block;
        font-size: 16px;
      }
    }
    // .code-list span:nth-child(1){
    //   width: 8%;
    //   text-align: left;
    // }
    // .code-list span:nth-child(2){
    //   width: 30%;
    //   text-align: left;
    // }
    // .code-list col:nth-child(3){
    //   width: 16%;
    //   text-align: left;
    //   em {
    //     color: #ff8237;
    //     margin-left: 15px;
    //   }
    // }
  }
}
// .tab {
//   width: 100%;
//   height: 50px;
//   font-size: 17px;
//   color: #6b6b6b;
// }
// .tab li {
//   display: inline-block;
//   width: 20%;
//   height: 100%;
//   text-align: center;
//   line-height: 50px;
// }
.one {
  position: absolute;
  top: 68px;
  left: 0;
  width: 2%;
  height: 2px;
  background: #ff8237;
}
.two {
  position: absolute;
  top: 68px;
  right: 0;
  width: 2%;
  height: 2px;
  background: #ff8237;
}
///deep/ .ivu-tabs-nav-container {
//  overflow: visible;
//}
/deep/ .ivu-col-span-24 {
  background: #fff;
  font-size: 16px;
}
/deep/ .ivu-tabs-bar {
  border-bottom: 0 !important;
}
/deep/ .ivu-tabs-bar .ivu-tabs-nav-container {
  height: 70px !important;
}
/deep/ .ivu-tabs-nav-scroll {
  border-bottom: 2px solid #ff8237 !important;
}
/deep/ .nav-text {
  width: 96%;
  margin-left: 2%;
}
/deep/ .ivu-tabs-tab {
  border-radius: 0 !important;
  background: #fff !important;
  color: #222;
  width: 20%;
  height: 70px !important;
  margin-right: 0 !important;
  text-align: center;
  line-height: 60px;
  font-size: 16px;
  border: 2px solid #fff !important;
  border-left: 0 !important;
  border-bottom: 2px solid #ff8237 !important;
}

/deep/ .ivu-tabs-bar .ivu-tabs-tab-active {
  color: #ff8237 !important;
  // border: 1px solid #ff8237;
  // border-color: #fff !important;
  border-bottom: 2px solid #fff !important;
  border-top: 2px solid #ff8237 !important;
  border-left: 2px solid #ff8237 !important;
  border-right: 2px solid #ff8237 !important;
}

/deep/ .ivu-tabs-tab-focused {
  // border-top:  #ff8237 !important;
  // border-left:  #ff8237 !important;
  // border-top:  #ff8237 !important;
}
/deep/ .ivu-tabs-bar .ivu-tabs-tab {
  // border-color: #ff8237;
  // border-top: 2px solid #fff !important;
  transition: all 0s !important;
}
///deep/ .ivu-tabs-bar div:nth-child(2) {
 // border-left:2px solid #ff8237;
//}
</style>
