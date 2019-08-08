<template>
  <div class='page'>
    <!-- 剧情简介 -->
   <Row class='de-info' >
      <Row class='title' >剧情简介</Row>
      <Row style='margin-top: 20px;line-height:30px; color: #B3BCC0;' :class="[ sumFlag == 0 ? 'activeClass' : '']">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{summary}}</Row>
      <!-- <div class='mores' style='text-align: right;margin-right: 30px;'@click='detailinfo' >展开全部<span></span></div> -->
      <div class="show-all" v-if="itemlist.summary.length > 200">
        <span @click="sumToggle" >{{sumTitle}}<Icon :class="{'sumDown': sumFlag == 1, 'sumUp': sumFlag == 0}" type="ios-arrow-down" size="25" /></span>
      </div>
   </Row>
   <!-- 更多资料 -->
   <div class="more">
     <Row class='title'>更多资料</Row>
     <Row class='row-bo' style='padding-bottom: 0px;'>
       <Col span='3' class='fo-bo'>对白语言</Col>
       <Col span='20' class='fo-bos'>
         <em v-if='itemlist.languages == null'>暂无对白语言</em>
       <div style='margin-bottom: 10px;' v-if='itemlist.languages != null' v-for='(items,index) in itemlist.languages'>{{items}}</div><br>
       </Col>
     </Row>
     <Row class='row-bo' style='padding-top: 0px;padding-bottom: 0px'>
       <Col span='3' class='fo-bo'>上映日期</Col>
       <Col span='20' class='fo-bos'>
         <em v-if='itemlist.releaseDates == null'>暂无</em>
       <div style='margin-bottom: 10px;height: 20px;line-height: 20px;' v-if='itemlist.releaseDates != null' v-for='(items,index) in dataitemlist'>
         <div class='nams' style='width: 21%;'>{{items.countryName}}&nbsp;&nbsp;{{items.countryNameEn}}</div>
         <div class='nams' style='margin-left: 2%;'>-------------------------</div>
         <div class='nams' style='margin-left: 4%;'>{{items.date}}</div>
       </div><br>
       <div class="show-alls" v-if="itemlist.releaseDates != null && itemlist.releaseDates.length > 5">
        <span @click="dataToggle">{{dataTitle}}<Icon :class="{'dataDown': dataFlag == 1, 'dataUp': dataFlag == 0}" type="ios-arrow-down" size="25" /></span>
      </div>
     </Col>
       </Col>
     </Row>
     <row class='row-bo' v-if='itemlist.releaseDates == null' style='height: 30px;'></row>
     <Row class='row-bo' style='padding-top: 0px;'>
       <Col span='3' class='fo-bo'>制作公司</Col>
       <Col span='20' class='fo-bos'>
       <em v-if='itemlist.companyMap.Production.length == 0'>暂无制作</em>
       <div style='margin-bottom: 10px;' v-if='itemlist.companyMap.Production.length > 0' v-for='(items,index) in itemlist.companyMap.Production'>{{items.name}}</div><br>
     </Col>
     </Row>
     <Row class='row-bo' style='padding-top: 20px;'>
       <Col span='3' class='fo-bo'>发行公司</Col>
       <Col span='20' class='fo-bos'>
       <em v-if='itemlist.companyMap.Distributor.length == 0'>暂无发行</em>
       <div style='margin-bottom: 10px;' v-if='itemlist.companyMap.Distributor.length > 0' v-for='(items,index) in faitemlist'>{{items.name}}</div><br>
        <div class="show-alls" v-if="itemlist.companyMap.Distributor.length > 5">
        <span @click="faToggle">{{faTitle}}<Icon :class="{'faDown': faFlag == 1, 'faUp': faFlag == 0}" type="ios-arrow-down" size="25" /></span>
      </div>
       </Col>
     </Row>
   </div>
   <!-- 图片 -->
   <div style='padding: 20px;'>
     <Row class='title' style='margin-bottom: 20px;'>图片(共{{imgUrl.length}}张)</Row>
      <transition-group name="list" tag="ul" class="loading-img">
        <!-- <li class='desimg' v-for="img in imgList" :key="img.key"><img :src="img.img"/></li> -->
        <li class='desimg'@click='onView(img.img)' v-for="img in imgList" :key="img.key" :style="{
          backgroundImage: `url(${img.img})`
        }"></li>
      </transition-group>
      <div class="show-all" v-if="imgUrl.length > 20">
        <span @click="handleToggle">{{tabShowTitle}}<Icon :class="{'arrowDown': arrowFlag == 1, 'arrowUp': arrowFlag == 0}" type="ios-arrow-down" size="25" /></span>
      </div>
   </div>
   <Modal v-model="viewerShow" title="查看图片" width="500" height="500">
      <img style="width: 100%;" :src="viewerImage">
    </Modal>
  </div>
</template>

<script lang='ts'>
import {Component, Watch, Prop} from 'vue-property-decorator'
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
  @Prop({ type: Number, default: 0 }) id!: number
  value1 = 0
  info = false
  tabShowTitle = '展示全部'
  arrowFlag = 0

  dataTitle = '展示全部'
  dataFlag = 0
  datalist: any = []
  dataitemlist: any = []

  faTitle = '展示全部'
  faFlag = 0
  falist: any = []
  faitemlist: any = []

  imgUrl = []
  imgList: any = []
  sumTitle = '展示全部'
  sumFlag = 0
  summary: any = ''

  // 查看图片
  viewerShow = false
  viewerImage = ''



  itemlist: any = {}
  releaseDate: any = ''

  mounted() {
    this.search()
  }

  detailinfo() {
    this.info = true
  }

  // 查看图片
  onView(url: string) {
    this.viewerImage = url
    this.viewerShow = true
  }

  handleToggle() {
    if (!this.arrowFlag) {
      this.arrowFlag = 1
      this.tabShowTitle = '向上隐藏'
      this.imgList = this.imgUrl
    } else {
      this.arrowFlag = 0
      this.tabShowTitle = '展示全部'
      this.imgList = this.imgUrl.slice(0, 20)
    }
  }
  dataToggle() {
    if (!this.dataFlag) {
      this.dataFlag = 1
      this.dataTitle = '向上隐藏'
      this.dataitemlist = this.itemlist.releaseDates == null ? [] : this.itemlist.releaseDates
    } else {
      this.dataFlag = 0
      this.dataTitle = '展示全部'
      this.dataitemlist = this.itemlist.releaseDates == null ? [] : this.itemlist.releaseDates.slice(0, 5)
    }
  }
  faToggle() {
    if (!this.faFlag) {
      this.faFlag = 1
      this.faTitle = '向上隐藏'
      this.faitemlist = this.itemlist.companyMap.Distributor
    } else {
      this.faFlag = 0
      this.faTitle = '展示全部'
      this.faitemlist = this.itemlist.companyMap.Distributor.slice(0, 5)
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
      this.summary = this.itemlist.summary.slice(0, 211)
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
      this.imgList = this.imgUrl.slice(0, 20)
      this.dataitemlist = this.itemlist.releaseDates == null ? [] : this.itemlist.releaseDates.slice(0, 5)
      this.faitemlist = this.itemlist.companyMap.Distributor.slice(0, 5)
      this.summary = this.itemlist.summary.slice(0, 211)
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
.activeClass {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
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
  padding-left: 7px;
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
.desimg {
  background-size: cover;
  img {
    width: 100%;
    height: 100%;
  }
}
.loading-img {
  display: flex;
  flex-wrap: wrap;
  margin-left: -16px;
  margin-right: -10px;
  transition: all 2s;
  li {
    width: 17%;
    height: 180px;
    margin-bottom: 25px;
    padding: 0 4px;
    background-size: cover;
    margin-left: 2.7%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.show-all {
  margin-top: 5px;
  text-align: center;
  font-size: 14px;
  color: #b3bcc0;
  line-height: 30px;
  span {
    cursor: pointer;
  }
}
.show-alls {
  text-align: center;
  font-size: 14px;
  color: #b3bcc0;
  line-height: 30px;
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
.dataDown {
  animation: dataDown .5s both;
}
@keyframes dataDown {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(180deg);
  }
}
.dataUp {
  animation: dataUp .5s both;
}
@keyframes dataUp {
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
.nams {
  float: left;
}
</style>