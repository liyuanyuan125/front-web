<template>
  <div class='page'>
    <!-- 剧情简介 -->
   <Row class='de-info' >
      <Row class='title' >剧情简介</Row>
      <Row style='margin-top: 20px;line-height:30px; color: #B3BCC0;'>&nbsp;&nbsp;{{summary}}<span v-if='info'>123...</span></Row>
      <!-- <div class='mores' style='text-align: right;margin-right: 30px;'@click='detailinfo' >展开全部<span></span></div> -->
      <div class="show-all" v-if="itemlist.summary.length > 200">
        <span @click="sumToggle">{{sumTitle}}<Icon :class="{'sumDown': sumFlag == 0, 'sumUp': sumFlag == 1}" type="ios-arrow-down" size="25" /></span>
      </div>
   </Row>
   <!-- 更多资料 -->
   <div class="more">
     <Row class='title'>更多资料</Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>对白语言</Col>
       <Col span='20' class='fo-bos'>{{itemlist.languages == null ? '暂无' : itemlist.languages}}</Col>
     </Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>国家 / 地区{{itemlist.companyMap.Production== [] ? '暂无制作' : itemlist.companyMap.Production}}</Col>
       <Col span='20' class='fo-bos'>{{itemlist.countries == null ? '暂无' : itemlist.countries}}
       <!-- <span v-for='(it,index) in itemlist.countryCodeList' :key='index'>
         <em v-fot='(its,index) in itemlist.countries' v-if='its == it.key'>{{it.text}}</em>
       </span> -->
     </Col>
     </Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>上映 / 发行日期</Col>
       <Col span='20' class='fo-bos'>{{itemlist.releaseDate == null ? '暂无' : releaseDate}}</Col>
     </Row>
     <Row class='row-bo'>
       <Col span='3' class='fo-bo'>制作hahah / 发行</Col>
       <Col span='20' class='fo-bos'><em v-if='itemlist.companyMap.Production.length == 0'>暂无制作</em> / <em v-if='itemlist.companyMap.Distributor.length == 0'>暂无发行</em>
       <em v-if='itemlist.companyMap.Production.length > 0' v-for='(items,index) in itemlist.companyMap.Production'>{{item.name}}</em> / <em v-if='itemlist.companyMap.Distributor.length > 0'>{{itemlist.companyMap.Distributor[0].name}}</em></Col>
     </Row>
   </div>
   <!-- 图片 -->
   <div style='padding: 20px;'>
     <Row class='title' style='margin-bottom: 20px;'>图片(共{{imgUrl.length}}张)</Row>
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
import {Component, Watch} from 'vue-property-decorator'
import UploadButton, { SuccessEvent } from '@/views/order/components/UploadButton.vue'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { queryList , mains } from '@/api/filmorder'
import { toMap } from '@/fn/array'
import { formatTimestamp } from '@/util/validateRules'
import WeekDatePicker from '@/components/weekDatePicker'
import { confirm , toast } from '@/ui/modal'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
@Component
export default class Main extends ViewBase {
  value1 = 0
  info = false
  tabShowTitle = '展示全部'
  arrowFlag = 0
  imgUrl = []
  imgList: any = []
  sumTitle = '展示全部'
  sumFlag = 0
  summary: any = ''



  itemlist: any = {}
  releaseDate: any = ''

  mounted() {
    this.search()
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
  sumToggle() {
    if (!this.sumFlag) {
      this.sumFlag = 1
      this.sumTitle = '向上隐藏'
      this.summary = this.itemlist.summary
    } else {
      this.sumFlag = 0
      this.sumTitle = '展示全部'
      this.summary = this.itemlist.summary.slice(0, 200)
    }
  }
  async search() {
    try {
      const { data } =  await mains(this.$route.params.id)
      this.itemlist = data
      this.releaseDate = data.releaseDate.slice(0, 4) + '-' +
      data.releaseDate.slice(4, 6) + '-' + data.releaseDate.slice(6, 8)
      this.imgUrl = (data.plotPics || []).map((it: any, index: any) => {
        return {
          key: index,
          img: it,
        }
      })
      this.imgList = this.imgUrl.slice(0, 5)
      this.summary = this.itemlist.summary.slice(0, 200)
    } catch {

    } finally {

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
.sumDown {
  animation: sumDown .5s both;
}
@keyframes sumDown {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(180deg);
  }
}
.sumUp {
  animation: sumUp .5s both;
}
@keyframes sumUp {
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