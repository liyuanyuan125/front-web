<template>
  <Modal v-model='showDlg'
  title="方案确认单"
  :transfer='false'
  :width='770'
  @on-cancel="cancel()">
    <div style=" text-align: center">
      <div class="mb30">
        <span class="header-title">方案确认单</span>
      </div>
      <div class="mb20" style='background:rgba(249, 249, 249, 1);padding: 10px 20px 1px 20px;'>
        <Row class="mb10">
          <Col :span="4">投放类型</Col>
          <Col :span="7">
            <span>映前广告</span>
          </Col>
          <Col :span="4">广告计划名称</Col>
          <Col :span="9"><span>{{data.name}}</span></Col>
        </Row>
        <Row class="mb10">
          <Col :span="4">客户名称</Col>
          <Col :span="7"><span>{{data.customerName}}</span></Col>
          <Col :span="4">广告片规格</Col>
          <Col :span="7"><span v-if="data.specification">{{data.specification}}s</span>
            <span v-else></span>
          </Col>
        </Row>
        <Row class="mb10">
          <Col :span="4">关联广告片</Col>
          <Col :span="7"><span>{{data.advertisingName}}</span></Col>
          <Col :span="4">投放排期</Col>
          <Col :span="9"><span>{{begin}}~{{end}}</span></Col>
        </Row>
        <Row class="mb10">
          <Col :span="4">档期</Col>
          <Col :span="7"><span>{{data.calendarName}}</span></Col>
          <Col :span="4">投放天数</Col>
          <Col :span="9"><span>{{day + 1}}天</span></Col>
        </Row>
        <Row class="mb5">
          <Col :span="4">预估冻结金额／¥</Col>
          <Col :span="7"><span class="money">{{money}}</span></Col>
          <Col :span="4">计费类型</Col>
          <Col :span="9"><span>CPM/{{data.specification}}s</span></Col>
        </Row>
      </div>

      <div v-if='data && data.directionType == 2' style='background:rgba(249, 249, 249, 1);padding: 10px 20px 1px 20px; margin-top: 10px;'>
        <Row class="mb30">
          <Col :span="3">投放影片</Col>
          <Col :span="8" class='im'>
            <!-- <div> -->
              <div class='im-div' v-if="cinema.seacinemaList">
                <img :src='cinema.seacinemaList.mainPicUrl || cover' alt=''>
                <div>上映日期：{{formatMoment(cinema.seacinemaList.openTime)}}</div>
              </div>
              <div class='ims-div' v-if="cinema.seacinemaList">
                <p>{{cinema.seacinemaList.name}}</p>
                <p class="cinema-type"><span v-for="it in cinemaType" :key="it">{{it}}</span></p>
              </div>
            <!-- </div> -->
          </Col>
        </Row>
        <Row class="mb10">
          <Col :span="3">地域偏好</Col>
          <Col :span="21">
           <div class="cinema-area">
             <span v-if="data.tagTypeCode && data.tagTypeCode.length == 0">不限</span>
             <p v-else>
               <span v-for="it in tagTypeCodeName" :key="it.key">
                 {{it.text}}
               </span>
             </p>
           </div>
          </Col>
        </Row>
      </div>
      <div style='background:rgba(249, 249, 249, 1);padding: 10px 20px 0 20px; margin-top: 10px;'>
        <Row class="mb10">
          <Col :span="4">投放区域 ({{data.throwInStats.region}}个)</Col>
          <Col :span="20">
            <span class="cityCount offset" v-for="it in data.throwInStats.regionList" :key="it.key">{{it.name}}</span>
          </Col>
        </Row>
        <Row class="mb10">
          <Col :span="4">投放省份 ({{data.throwInStats.province}}个)</Col>
          <Col :span="20">
            <span class="cityCount offset" v-for="it in data.throwInStats.provinceList" :key="it.key">{{it.name}}</span>
          </Col>
        </Row>
        <Row class="mb10">
          <Col :span="4">投放城市 ({{data.throwInStats.city}}个)</Col>
          <Col :span="20">
            <Row class="mb10" v-for="it in data.throwInStats.cityLevelList" :key="it.key">
              <Col :span="6">{{it.name}}({{it.count}}个)</Col>
              <Col :span="18"><span v-for="item in it.cityList" :key="item.id" class="cityCount">{{item.name}}</span></Col>
            </Row>
          </Col>
        </Row>
        <Row class="mb10">
          <Col :span="4">投放影院 ({{data.throwInStats.cinema}}个)</Col>
          <Col :span="20">
            <Row class="mb10" v-for="it in data.throwInStats.boxLevelList" :key="it.key">
              <Col :span="24"><span class="cityCount">{{it.name}} ({{it.count}}个)</span></Col>
              <!-- <Col :span="20">北京市 | 上海市</Col> -->
            </Row>
          </Col>
        </Row>
      </div>
      <div v-if='data.directionType == 1' style='background:rgba(249, 249, 249, 1);padding: 10px 20px 0 20px; margin-top: 10px;'>
        <Row class="mb10">
          <Col :span="4">观影人群画像</Col>
          <Col :span="20" class="cinema-flex" v-if="cinema">
           <div
              :class="['portrait', {'woman-atv': cinema.tagsex[2].text[0] == 'woman', 'man-atv': cinema.tagsex[2].text[0] == 'man', 'unknow-atv': cinema.tagsex[2].text.length == 0}]"
            >
              <div v-if="cinema.tagsex[2].text[0] == 'man'">
                <i class="gender-text">男性</i>
                <img width="145" class="gender-img" src="../plan/assets/man.png">
              </div>
              <div v-else-if="cinema.tagsex[2].text[0] == 'woman'">
                <i class="gender-text">女性</i>
                <img width="145" class="gender-img" src="../plan/assets/woman.png">
              </div>
              <div v-else>
                <i class="gender-text">性别不详</i>
                <img width="145" class="gender-img" src="../plan/assets/unknow.png">
              </div>
              <div class="film-type" v-if="cinema.tagsex[1].text.length > 0">
                <i>{{ageName(cinema.tagsex[1].text[0])}}</i>
              </div>
              <div class="film-type" v-else>
                <i>年龄不详</i>
              </div>
              <div v-if="cinema.tagsex[0].text.length > 0">
                <i :class="`cinemapos${index}`" v-for="(it , index) in cinema.tagsex[0].text" :key="index">{{cinemaTypes(it)}}</i>
              </div>
              <div v-else>
                <i :class="`cinemapos0`">类型不详</i>
              </div>
            </div>
          </Col>
        </Row>
        <Row class="mb10">
          <Col :span="4">影片</Col>
          <Col :span="20" class="cinema-flex" v-if="cinema">
            <div class='im' style="float-left" v-for="item in cinema.cinemaIdArray" :key="item.id">
              <div class='im-div'>
                <img :src='item.mainPicUrl || cover' alt=''>
                <div>上映日期：{{formatMoment(item.openTime)}}</div>
              </div>
              <div class='ims-div'>
                <p>{{item.name}}</p>
                <p class="cinema-type"><span :class="{red: autos(it)}" v-for="it in item.type" :key="it">{{it}}</span></p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div slot="footer" class="foot">
      <Button class="foot-cancel-button" type="primary" @click="cancel">取消计划</Button>
      <Button class="foot-button" type="primary" @click="open">开启投放</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatCurrency } from '@/fn/string'
import moment from 'moment'
import { addplan } from '@/api/planput'
import { warning , success, toast , info } from '@/ui/modal'

const timeFormat = 'YYYY-MM-DD'
@Component
export default class Main extends ViewBase {
  showDlg = false
  forMat: any = {}
  data: any = {}
  money: any = ''
  cinema: any = null

  get begin() {
    return this.formatTime(this.data.beginDate)
  }

  get end() {
    return this.formatTime(this.data.endDate)
  }

  get day() {
    const day = (new Date(this.end).getTime() - new Date(this.begin).getTime()) / (24 * 3600000)
    return day
  }

  get cinemaType() {
    return this.cinema.seacinemaList.type || []
  }

  get tagTypeCodeName() {
    if (this.data.tagTypeCode && this.data.tagTypeCode.length > 0) {
      return this.cinema.diqutype.values.filter((it: any) => this.data.tagTypeCode.includes(it.key))
    }
    return []
  }

  get cover() {
    const cover = require('./assets/wu.png')
    return cover
  }

  init(forMat: any, cinema: any) {
    this.showDlg = true
    this.forMat = forMat
    this.cinema = cinema
    this.money = formatCurrency(this.forMat.estimateCostAmount)
  }

  created() {
    this.getData()
  }

  getData() {
    const id = this.$route.params.key
    this.data = JSON.parse(sessionStorage.getItem(`${id}`)!)
  }

  cancel() {
    this.showDlg = false
  }

  formatMoment(time: any) {
    return time ? moment(time).format(timeFormat) : '暂无'
  }

  ageName(age: any) {
    if (this.cinema.tagsyear) {
      return this.cinema.tagsyear[0].values.filter((it: any) => it.key == age)[0].text
    }
  }

  cinemaTypes(type: any) {
    if (this.cinema.tagstype) {
      return this.cinema.tagstype[0].values.filter((it: any) => it.key == type)[0].text
    }
  }

  // 格式化档期时间
  formatTime(num: any) {
    num = num + ''
    if (!num) {
      return ''
    }
    const year = num.slice(0, 4)
    const month = num.slice(4, 6)
    const day = num.slice(6)
    return `${year}-${month}-${day}`
  }

  autos(it: any) {
    const data = this.data.typeName.map((item: any) => item.text)
    return data.includes(it)
  }

  async open() {
    this.forMat.deliveryGroups = []
    if (this.data.directionType == 1) {
      this.forMat.deliveryMovies = this.forMat.deliveryMovies.map((it: any) => it.id)
      this.forMat.throwInAreaType = this.data.throwInAreaType[0].key
      if (this.data.deliveryGroups[0].text.length != 0) {
        const one = (this.data.deliveryGroups[0].text || []).map((it: any) => {
          this.forMat.deliveryGroups.push( {
            tagTypeCode: this.data.deliveryGroups[0].tagTypeCode,
            text: it
          })
        })
      }
      if (this.data.deliveryGroups[0].text.length != 0) {
        const two = (this.data.deliveryGroups[1].text || []).map((it: any) => {
          this.forMat.deliveryGroups.push ({
            tagTypeCode: this.data.deliveryGroups[1].tagTypeCode,
            text: it
          })
        })
      }
      if (this.data.deliveryGroups[0].text.length != 0) {
        const three = (this.data.deliveryGroups[2].text || []).map((it: any) => {
          this.forMat.deliveryGroups.push ({
            tagTypeCode: this.data.deliveryGroups[2].tagTypeCode,
            text: it
          })
        })
      }
      if (
        this.data.deliveryGroups[0].text.length == 0 &&
        this.data.deliveryGroups[0].text.length == 0 &&
        this.data.deliveryGroups[0].text.length == 0) {
        this.forMat.deliveryGroups = (this.data.deliveryGroups || []).map((it: any) => {
          return {
            tagTypeCode: it.tagTypeCode,
            text: 'ALL'
          }
        })
      }
    }
    if (this.data.directionType == 2) {
      // console.log(this.cinema.seacinemaList.id)
      this.forMat.deliveryMovies = []
      this.forMat.deliveryMovies = [this.cinema.seacinemaList.id]
      // console.log(this.data.tagTypeCode)
      const one = (this.data.tagTypeCode || []).map((it: any) => {
        this.forMat.deliveryGroups.push( {
          tagTypeCode: 'DISTRICT_AREA',
          text: it
        })
      })
      this.forMat.deliveryMovies = this.data.deliveryMovies
      if (
        this.data.tagTypeCode.length == 0) {
        // this.forMat.deliveryGroups = (this.list.deliveryGroups || []).map((it: any) => {
          this.forMat.deliveryGroups.push ({
            tagTypeCode: 'DISTRICT_AREA',
            text: 'ALL'
          })
        // })
      }
      // console.log(this.forMat.deliveryGroups)
    }
    try {
      const res = await addplan({
        ...this.forMat,
        status: 2
      })
      toast('添加成功')
      const id = this.$route.params.key
      sessionStorage.removeItem(`${id}`)
      this.$router.push({name: 'pop-planlist'})

    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@bag: rgba(255, 237, 237, 1);
.foot-button-box(@color: #fe8135, @text-color: #fff) {
  width: 196px;
  height: 50px;
  color: @text-color;
  background-color: @color;
  margin-right: 20px;
}
.before(@content: '/', @color: #222) {
  content: @content;
  margin-left: 6px;
  margin-right: 6px;
  color: @color;
}
.mb-cyc(8);
.mb-cyc(@n, @i: 1) when (@i =< @n) {
  @b: (@i * 5);
  .mb@{b} {
    margin-bottom: (@i * 5px);
  }
  .pd@{b} {
    padding-top: (@i * 5px);
  }
  .mb-cyc(@n, (@i + 1));
}

.foot {
  text-align: center;
  height: 90px;
  .foot-button {
    .foot-button-box;
  }
  .foot-cancel-button {
    .foot-button-box(#FFF8F2, #fe8135);
  }
}
.header-title {
  font-weight: 500;
  font-style: normal;
  font-size: 20px;
  color: #000;
  padding: 5px 15px 0 15px;
}
/deep/ .ivu-modal-content {
  margin-top: -40px;
}
/deep/ .ivu-col-span-7 span:empty {
  &::before {
    content: '暂无';
  }
}
.ivu-row .money {
  display: inline-block;
  margin-top: -8px;
  font-weight: bold;
  font-size: 20px;
  // color: #f90;
}
.ivu-row {
  font-size: 14px;
  color: #888;
  text-align: left;
  span {
    color: #333;
  }
}
.offset {
  margin-right: 5px;
}
.cinema-flex {
  display: flex;
  flex-wrap: wrap;
}
.im {
  height: 300px;
  margin-right: 10px;
  margin-bottom: 10px;
  .im-div {
    width: 180px;
    height: 250px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    div {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      background: #000;
      color: #fff;
      line-height: 24px;
      text-align: center;
      font-size: 13px;
    }
  }
  .ims-div {
    width: 180px;
    .pd5;
    text-align: center;
    background: #fff;
    p {
      color: #222;
    }
    .cinema-type {
      padding-bottom: 4px;
      .red {
        color: red;
      }
      span:not(:last-child)::after {
        .before;
      }
    }
  }
}
.portrait {
  position: relative;
  i {
    width: 80px;
    height: 36px;
    line-height: 36px;
    border-radius: 2px;
    text-align: center;
    display: inline-block;
  }
  &.woman-atv i {
    background: @bag;
    color: #ff7d7d;
  }
  &.man-atv i {
    background: @bag;
    color: #3b98ff;
  }
  &.unknow-atv i {
    background: @bag;
    color: @c-button;
  }
  .gender-text {
    position: absolute;
    top: 36px;
    left: -30px;
  }
  .film-type {
    position: absolute;
    top: 140px;
    left: -25px;
    i {
      display: block;
      margin-bottom: 16px;
    }
  }
  .gender-img {
    margin: 40px 0 30px 50px;
  }
  .cinemapos1 {
    position: absolute;
    right: -170px;
    top: 90px;
  }
  .cinemapos2 {
    position: absolute;
    right: -260px;
    top: 90px;
  }
  .cinemapos0 {
    position: absolute;
    right: -80px;
    top: 90px;
  }
}
.cinema-area {
  span:not(:last-child)::after {
    .before;
  }
}
.cityCount:not(:last-child)::after {
  .before('|');
}
</style>
