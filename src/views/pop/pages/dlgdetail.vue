<template>
  <Modal v-model='showDlg'
  title="方案确认单"
  :transfer='false'
  :width='750'
  @on-cancel="cancel()">
    <div style=" text-align: center">
      <div class="mb50">
        <span class="header-title">方案确认单</span>
      </div>
      <div style='background:rgba(249, 249, 249, 1);padding: 10px 20px 0px 20px;'>
        <Row class="mb20">
          <Col :span="3">投放类型</Col>
          <Col :span="7">
            <span>映前广告</span>
          </Col>
          <Col :span="4">广告计划名称</Col>
          <Col :span="10"><span>{{data.name}}</span></Col>
        </Row>
        <Row class="mb20">
          <Col :span="3">客户名称</Col>
          <Col :span="7"><span>{{data.customerName}}</span></Col>
          <Col :span="4">广告片规格</Col>
          <Col :span="10"><span>{{data.specification}}s</span></Col>
        </Row>
        <Row class="mb20">
          <Col :span="3">关联广告片</Col>
          <Col :span="7"><span>{{data.advertisingName}}</span></Col>
          <Col :span="4">投放排期</Col>
          <Col :span="10"><span>{{begin}}~{{end}}</span></Col>
        </Row>
        <Row class="mb20">
          <Col :span="3">档期</Col>
          <Col :span="7"><span>春节档</span></Col>
          <Col :span="4">投放天数</Col>
          <Col :span="10"><span>{{day}}天</span></Col>
        </Row>
        <Row class="mb20">
          <Col :span="3">冻结金额/￥</Col>
          <Col :span="7"><span class="money">789</span></Col>
          <Col :span="4">计费类型</Col>
          <Col :span="10"><span>CPM/30s</span></Col>
        </Row>
      </div>
      <div v-if='data.directionType == 2' style='background:rgba(249, 249, 249, 1);padding: 10px 20px 1px 20px; margin-top: 10px;'>
        <Row class="mb20">
          <Col :span="3">投放影片</Col>
          <Col :span="5" class='im'>
            <!-- <div> -->
              <div class='im-div'>
                <img src='./assets/cinem5.png' alt=''>
                <div>上映日期：2019-10-10</div>
              </div>
              <div class='ims-div'>
                <p>《大人物》</p>
                <p>动作/犯罪</p>
              </div>
            <!-- </div> -->
          </Col>
        </Row>
        <Row class="mb20">
          <Col :span="3">地域偏好</Col>
          <Col :span="21">
            河北省 | 北京市 | 上海市 | 安徽省 | 广东省
          </Col>
        </Row>
      </div>
      <div style='background:rgba(249, 249, 249, 1);padding: 10px 20px 0 20px; margin-top: 10px;'>
        <Row class="mb20">
          <Col :span="4">投放区域 (3个)</Col>
          <Col :span="20">
            华北 | 华中 | 华南
          </Col>
        </Row>
        <Row class="mb20">
          <Col :span="4">投放省份 (5个)</Col>
          <Col :span="20">
            河北省 | 北京市 | 上海市 | 安徽省 | 广东省
          </Col>
        </Row>
        <Row class="mb20">
          <Col :span="4">投放城市 (6个)</Col>
          <Col :span="20">
            <Row class="mb20">
              <Col :span="4">1级城市(2个)</Col>
              <Col :span="20">北京市 | 上海市</Col>
            </Row>
            <Row class="mb20">
              <Col :span="4">2级城市(2个)</Col>
              <Col :span="20">广州市 | 佛山市</Col>
            </Row>
            <Row class="mb20">
              <Col :span="4">3级城市(2个)</Col>
              <Col :span="20">石家庄市 | 合肥市</Col>
            </Row>
            <Row class="mb20">
              <Col :span="4">4级城市(0个)</Col>
              <Col :span="20"></Col>
            </Row>
          </Col>
        </Row>
        <Row class="mb20">
          <Col :span="4">投放影院 (60个)</Col>
          <Col :span="20">
            <Row class="mb20">
              <Col :span="24">A级票房 (20个)</Col>
              <!-- <Col :span="20">北京市 | 上海市</Col> -->
            </Row>
            <Row class="mb20">
              <Col :span="24">B级票房 (20个)</Col>
              <!-- <Col :span="20">广州市 | 佛山市</Col> -->
            </Row>
            <Row class="mb20">
              <Col :span="24">C级票房 (20个)</Col>
              <!-- <Col :span="20">石家庄市 | 合肥市</Col> -->
            </Row>
            <Row class="mb20">
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

@Component
export default class Main extends ViewBase {
  showDlg = false
  forMat: any = {}
  data: any = {}

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

  init(forMat: any) {
    this.showDlg = true
    this.forMat = forMat
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
  color: #fe8135;
  padding: 5px 15px 8px 15px;
  border-bottom: 2px solid #fe8135;
}
/deep/ .ivu-modal-content {
  margin-top: -40px;
}
.ivu-row .money {
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
.pd5 {
  padding-top: 5px;
}
.mb50 {
  margin-bottom: 50px;
}
.mb10 {
  margin-bottom: 10px;
}
.mb20 {
  margin-bottom: 10px;
}
.im {
  height: 260px;
  .im-div {
    width: 100%;
    height: 200px;
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
    width: 100%;
    line-height: 23px;
    text-align: center;
    background: #fff;
  }
}
</style>
