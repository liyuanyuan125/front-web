<template>
  <Modal v-model='showDlg'
  title="方案确认单"
  :transfer='false'
  :width='750'
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
          <Col :span="9"><span>{{data.specification}}s</span></Col>
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
          <Col :span="9"><span>{{day}}天</span></Col>
        </Row>
        <Row class="mb5">
          <Col :span="4">预估冻结金额／¥</Col>
          <Col :span="7"><span class="money">{{money}}</span></Col>
          <Col :span="4">计费类型</Col>
          <Col :span="9"><span>CPM/30s</span></Col>
        </Row>
      </div>
      <div v-if='data.directionType == 2' style='background:rgba(249, 249, 249, 1);padding: 10px 20px 1px 20px; margin-top: 10px;'>
        <Row class="mb30">
          <Col :span="3">投放影片</Col>
          <Col :span="8" class='im'>
            <!-- <div> -->
              <div class='im-div'>
                <img :src='cinema.seacinemaList.mainPicUrl' alt=''>
                <div>上映日期：{{formatMoment(cinema.seacinemaList.openTime)}}</div>
              </div>
              <div class='ims-div'>
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
          <Col :span="4">投放区域 (3个)</Col>
          <Col :span="20">
            华北 | 华中 | 华南
          </Col>
        </Row>
        <Row class="mb10">
          <Col :span="4">投放省份 (5个)</Col>
          <Col :span="20">
            河北省 | 北京市 | 上海市 | 安徽省 | 广东省
          </Col>
        </Row>
        <Row class="mb10">
          <Col :span="4">投放城市 (6个)</Col>
          <Col :span="20">
            <Row class="mb10">
              <Col :span="4">1级城市(2个)</Col>
              <Col :span="20">北京市 | 上海市</Col>
            </Row>
            <Row class="mb10">
              <Col :span="4">2级城市(2个)</Col>
              <Col :span="20">广州市 | 佛山市</Col>
            </Row>
            <Row class="mb10">
              <Col :span="4">3级城市(2个)</Col>
              <Col :span="20">石家庄市 | 合肥市</Col>
            </Row>
            <Row class="mb10">
              <Col :span="4">4级城市(0个)</Col>
              <Col :span="20"></Col>
            </Row>
          </Col>
        </Row>
        <Row class="mb10">
          <Col :span="4">投放影院 (60个)</Col>
          <Col :span="20">
            <Row class="mb10">
              <Col :span="24">A级票房 (20个)</Col>
              <!-- <Col :span="20">北京市 | 上海市</Col> -->
            </Row>
            <Row class="mb10">
              <Col :span="24">B级票房 (20个)</Col>
              <!-- <Col :span="20">广州市 | 佛山市</Col> -->
            </Row>
            <Row class="mb10">
              <Col :span="24">C级票房 (20个)</Col>
              <!-- <Col :span="20">石家庄市 | 合肥市</Col> -->
            </Row>
            <Row class="mb10">
              <Col :span="24">D级票房 (0个)</Col>
              <!-- <Col :span="20"></Col> -->
            </Row>
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

const timeFormat = 'YYYY-MM-DD'
@Component
export default class Main extends ViewBase {
  showDlg = false
  forMat: any = {}
  data: any = {}
  money: any = ''
  cinema: any = {}

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

  init(forMat: any, cinema: any) {
    this.showDlg = true
    this.forMat = forMat
    this.cinema = cinema
    this.money = formatCurrency(this.forMat.estimateCostAmount * 10000)
  }

  created() {
    this.getData()
  }

  getData() {
    const id = this.$route.params.id
    this.data = JSON.parse(sessionStorage.getItem(`${id}`)!)
  }

  cancel() {
    this.showDlg = false
  }

  formatMoment(time: any) {
    return moment(time).format(timeFormat)
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

  open() {
  }
}
</script>

<style lang="less" scoped>
.foot-button-box(@color: #fe8135, @text-color: #fff) {
  width: 196px;
  height: 50px;
  color: @text-color;
  background-color: @color;
  margin-right: 20px;
}
.before(@content: '/', @color: #222) {
  content: @content;
  margin-left: 3px;
  margin-right: 3px;
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
.im {
  height: 300px;
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
      span:first-child {
        color: red;
      }
      span:not(:last-child)::after {
        .before;
      }
    }
  }
}
.cinema-area {
  span:not(:last-child)::after {
    .before;
  }
}
</style>
