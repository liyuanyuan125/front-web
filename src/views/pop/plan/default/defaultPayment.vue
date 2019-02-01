<template>
  <div class="home-bg">
    <h2 class="layout-nav-title">广告计划2 > 查看广告计划</h2>
    <div class="payment-step">
      <div class="step-line-bg"></div>
      <div class="step-solid-bg" :style="{width: solidWidth}"></div>
      <div class="step-text flex-box">
        <div class="step-item">
          <em
            class="default-circle"
            :class="{'active-circle': status == 2, 'solid-circle': 2 < status}"
          ></em>
          <p class="step-tip" v-if="status == 2">您的广告计划正在审核中</p>
          <span :class="{'text-col': status == 2}">待审核</span>
        </div>
        <div class="step-item">
          <em
            class="default-circle"
            :class="{'active-circle': status == 4, 'solid-circle': 4 < status}"
          ></em>
          <p class="step-tip" v-if="status == 4">请您尽快支付冻结金额{{formatNumber(items.freezeAmount)}}元</p>
          <span :class="{'text-col': status == 4}">待支付</span>
        </div>
        <div class="step-item">
          <em
            class="default-circle"
            :class="{'active-circle': status == 5, 'solid-circle': 5 < status}"
          ></em>
          <p class="step-tip" v-if="status == 5">请您尽快关联广告片，否则计划将被强制暂停</p>
          <span :class="{'text-col': status == 5}">已支付</span>
        </div>
        <div class="step-item">
          <em
            class="default-circle"
            :class="{'active-circle': status == 6, 'solid-circle': 6 < status }"
          ></em>
          <p class="step-tip" v-if="status == 6">您的广告计划即将开始投放</p>
          <span :class="{'text-col': status == 6}">待执行</span>
        </div>
        <div class="step-item">
          <em
            class="default-circle"
            :class="{'active-circle': status == 7, 'solid-circle': 7 < status}"
          ></em>
          <p class="step-tip" v-if="status == 7">您的广告计划正在执行中</p>
          <span :class="{'text-col': status == 7}">执行中</span>
        </div>
        <div class="step-item-end">
          <em class="default-circle" :class="{'active-circle': status == 8}"></em>
          <p class="step-tip-over" v-if="status == 8">您的广告计划已执行结束</p>
          <span :class="{'text-col': status == 8}">已结束</span>
        </div>
      </div>
    </div>
    <h3 class="layout-title">概览</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p>
            <label>投放类型</label>
            {{deliveryType(items.deliveryType)}}
          </p>
          <p>
            <label>广告计划名称</label>
            {{items.name}}
          </p>
          <p>
            <label>广告片规格</label>
            {{items.specification}}s
          </p>
          <p>
            <label>投放排期</label>
            {{formatYell(items.beginDate)}} ~ {{formatYell(items.endDate)}}
          </p>
          <p>
            <label>档期</label>
            {{items.calendarName}}
          </p>
          <p>
            <label>冻结金额/￥</label>
            {{formatNumber(items.freezeAmount)}}
          </p>
        </Col>
        <Col :span="12">
          <p>
            <label>广告计划ID</label>
            {{items.id}}
          </p>
          <p>
            <label>客户名称</label>
            {{items.customerName}}
          </p>
          <p>
            <label>关联广告片</label>
            {{items.videoName}}
          </p>
          <p>
            <label>投放天数</label>
            {{items.cycle}} 天
          </p>
          <p>
            <label>创建时间</label>
            {{formatTimes(items.approvalTime)}}
          </p>
          <p>
            <label>计费类型</label>
            {{billingModeList(items.billingMode)}}
          </p>
          <p v-if="status == 7 || status == 8">
            <label>订单折扣</label>
            {{items.discount}}
          </p>
        </Col>
      </Row>
    </div>
    <div v-if="status == 7 || status == 8">
      <h3 class="layout-title">
        投放成效
        <em>查看数据报表</em>
      </h3>
      <div class="text-rows">
        <Row>
          <Col :span="12">
            <p>
              <label>覆盖人次／人</label> 0
            </p>
            <p>
              <label>覆盖影院／个</label>
              0
            </p>
            <p>
              <label>覆盖场次／场</label>
              0
            </p>
            <p>
              <label>覆盖省份／个</label>
              0
            </p>
          </Col>
          <Col :span="12">
            <p>
              <label>广告花费／¥</label>0
            </p>
            <p>
              <label>覆盖影厅／个</label>0
            </p>
            <p>
              <label>覆盖区域／个</label>0
            </p>
            <p>
              <label>覆盖城市／个</label>0
            </p>
          </Col>
        </Row>
      </div>
    </div>

    <h3 class="layout-title" v-if="launchList">投放地区</h3>
    <div class="text-rows rows-list" v-if="launchList">
      <Row>
        <Col :span="24">
          <p v-if="launchList.categorizedByAreaCode" class="flex-box division-line">
            <label>投放区域（{{launchList.categorizedByAreaCode.length}}个）</label>
            <span v-for="item in launchList.categorizedByAreaCode" :key="item.code">
              {{item.name}}
              <i>/</i>
            </span>
          </p>
          <p v-if="launchList.categorizedByProvinceId" class="division-line">
            <label>投放省份（{{launchList.categorizedByProvinceId.length || 0}}个）</label>
            <span v-for="item in launchList.categorizedByProvinceId" :key="item.id">
              {{item.name}}
              <i>/</i>
            </span>
          </p>
          <p v-if="launchList.categorizedByCityId" class="flex-box">
            <label>投放城市（{{account}}个）</label>
            <em class="city-list division-line">
              <p v-for="(item, ind) in launchList.categorizedByCityGradeCode" :key="ind">
                <i>{{item.name}}（{{item.infos.length}}个）</i>
                <span v-for="(it, index) in item.infos" :key="index">
                  {{it.name}}
                  <i>/</i>
                </span>
              </p>
            </em>
          </p>
          <p v-if="launchList.categorizedByBoxLevelCode">
            <label>
              投放影院（{{launchList.categorizedByBoxLevelCode.length || 0}}个）
              <br>
              <em class="cinema-list" @click="queryCinemaList">查看影院列表</em>
            </label>
            <em class="city-list">
              <p v-for="item in launchList.categorizedByBoxLevelCode" :key="item.code">
                <span>{{item.name || '未知'}}票房（{{item.count}}个）</span>
              </p>
            </em>
          </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title">投放影片</h3>
    <div class="text-rows">
      <div v-if="status == 9">
        <p class="flex-box">
          <label>地域偏好</label>
          <em>
            <i v-for="(item, index) in areaList" :key="index">{{item}}</i>
          </em>
        </p>
      </div>
      <div v-else>
        <p>
          <label>观影人群画像</label>
        </p>
        <div
          class="portrait"
          :class="{'woman-atv': sex == 'woman', 'man-atv': sex == 'man', 'unknow-atv': sex == 'unknow'}"
        >
          <div v-if="sex == 'man'">
            <i class="gender-text">男性</i>
            <i class="age-text">{{age}}</i>
            <img width="145" class="gender-img" src="../assets/man.png">
          </div>
          <div v-if="sex == 'woman'">
            <i class="gender-text">女性</i>
            <i class="age-text">{{age}}</i>
            <img width="145" class="gender-img" src="../assets/woman.png">
          </div>
          <div v-if="sex == 'unknow'">
            <i class="gender-text">性别不详</i>
            <i class="age-text">年龄不详</i>
            <img width="145" class="gender-img" src="../assets/unknow.png">
          </div>

          <div class="film-type">
            <i class v-for="(item, index) in typeList" :key="index">{{item}}</i>
          </div>
        </div>
      </div>
      <div class="flex-box film-list">
        <label>影片</label>
        <div class="flex-box">
          <div class="item" v-for="(item, index) in defaultData.movieList" :key="index">
            <div class="film-img-item">
              <img :src="item.mainPicUrl" width="180" height="240">
              <div class="open-time">上映时间：{{formatYell(item.openTime)}}</div>
            </div>
            <div class="film-name">《{{item.name}}》</div>
            <div class="film-type-items">
              <i v-for="(it, index) in item.types" :key="index">
                {{queryFilmList(it)}}
                <em>/</em>
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btnCenter btn-footer" v-if="status == 2">
      <Button class="button-cancel" @click="$router.push({name: 'pop-planlist'})">取消计划</Button>
      <Button
        type="primary"
        class="button-ok edit-btn"
        @click="$router.push({name: 'pop-plan-edit'})"
      >编辑</Button>
    </div>
    <div class="btnCenter btn-footer" v-if="status == 4">
      <Button class="button-cancel" @click="$router.push({name: 'pop-planlist'})">取消计划</Button>
      <Button type="primary" class="button-ok" @click="handlePayment">支付</Button>
    </div>
    <div class="btnCenter btn-footer" v-if="status == 5">
      <Button type="primary" class="button-ok" @click="relevanceAdv">关联广告片</Button>
    </div>
    <CinemaList v-model="cinema" v-if="cinema.visible"/>
    <relevanceDlg v-model="relevanVis" v-if="relevanVis.visible"></relevanceDlg>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info } from '@/ui/modal'
import CinemaList from './cinemaDlg.vue'
import { planDefault, planPayment } from '@/api/plan'
import { formatTimes, formatYell, formatNumber } from '@/util/validateRules'
import relevanceDlg from './relevanceAdVDlg.vue'

@Component({
  components: {
    CinemaList,
    relevanceDlg
  }
})
export default class PlanDefault extends ViewBase {
  solidWidth: any = '0'

  items: any = []
  launchList: any = []
  defaultData: any = []
  tags = []
  status: any = 0

  sex = ''
  age = ''
  account = 0

  typeList: any = []
  areaList: any = []
  filmList = []

  cinema: any = {
    visible: false,
    id: ''
  }

  relevanVis: any = {
    visible: false,
    title: '关联广告片',
    item: ''
  }

  get formatYell() {
    return formatYell
  }
  get formatTimes() {
    return formatTimes
  }
  get formatNumber() {
    return formatNumber
  }
  async mounted() {
    this.list()
  }
  lineWidth(status: any) {
    switch (Number(status)) {
      case 2:
        this.solidWidth == '0'
        break
      case 4:
        this.solidWidth = '20%'
        break
      case 5:
        this.solidWidth = '40%'
        break
      case 6:
        this.solidWidth = '60%'
        break
      case 7:
        this.solidWidth = '80%'
        break
      case 8:
        this.solidWidth = '100%'
        break
    }
  }
  async list() {
    try {
      const id = this.$route.params.id
      const { data } = await planDefault(id)
      this.defaultData = data
      this.items = data.item || {}
      this.status = this.items.status
      this.lineWidth(this.status)
      this.launchList = data.statisticsResults

      // MOVIE_TYPE=电影类型  PLAN_GROUP_AGE = 年龄  PLAN_GROUP_SEX = 性别 DISTRICT_AREA = 区域
      this.tags = data.tags
      const sex = data.item.deliveryGroups.filter((item: any) => {
        if (item.tagTypeCode && item.tagTypeCode == 'PLAN_GROUP_SEX') {
          return item
        }
      })
      this.sex = sex && sex.length != 0 ? sex[0].text : ''
      const age = data.item.deliveryGroups.filter(
        (item: any) => item.tagTypeCode == 'PLAN_GROUP_AGE'
      )
      this.queryAgeList(age)
      const types = data.item.deliveryGroups.filter(
        (item: any) => item.tagTypeCode == 'MOVIE_TYPE'
      )
      this.queryTypeList(types)
      const areas = data.item.deliveryGroups.filter(
        (item: any) => item.tagTypeCode == 'DISTRICT_AREA'
      )
      this.queryAreas(areas)

      // 获取城市个数 categorizedByCityGradeCode
      if (this.launchList) {
        let account = 0
        this.launchList.categorizedByCityGradeCode.map((item: any) => {
          account += item.infos.length
        })
        this.account = account
      }
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
  async relevanceAdv(id: any) {
    this.relevanVis = {
      visible: true,
      item: this.items
    }
  }
  async handlePayment() {
    await confirm(`是否要支付冻结金额${this.items.freezeAmount}元`, {
      title: '支付广告计划'
    })
    try {
      const id = this.items.id
      await planPayment(id)
      this.$router.push({ name: 'pop-planlist' })
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
  queryAreas(ary: any[]) {
    if (ary.length > 0) {
      ary.map((item: any) => {
        this.tags.map((it: any) => {
          if (it.code == item.tagTypeCode) {
            it.values.map((val: any) => {
              if (val.key == item.text) {
                this.areaList.push(val.text)
              }
            })
          }
        })
      })
    }
  }
  queryFilmList(id: any) {
    let text: any = ''
    this.tags.map((item: any) => {
      if (item.code == 'MOVIE_TYPE') {
        text = item.values.filter((it: any) => it.key == id)
      }
    })
    return text[0].text
  }
  billingModeList(id: any) {
    const list = this.defaultData.billingModeList
    if (list) {
      for (const i of list) {
        if (i.key == id) {
          return i.text
        }
      }
    }
  }
  deliveryType(id: any) {
    const list = this.defaultData.deliveryTypeList
    if (list) {
      for (const i of list) {
        if (i.key == id) {
          return i.text
        }
      }
    }
  }
  queryAgeList(ary: any[]) {
    if (ary.length > 0) {
      this.tags.map((item: any) => {
        if (item.code == ary[0].tagTypeCode) {
          item.values.map((it: any) => {
            if (it.key == ary[0].text) {
              this.age = it.text
            }
          })
        }
      })
    }
  }
  queryTypeList(ary: any[]) {
    if (ary.length > 0) {
      ary.map((item: any) => {
        this.tags.map((it: any) => {
          if (it.code == item.tagTypeCode) {
            it.values.map((val: any) => {
              if (val.key == item.text) {
                this.typeList.push(val.text)
              }
            })
          }
        })
      })
    }
  }
  queryCinemaList() {
    this.cinema = {
      visible: true,
      id: this.items.id
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
.division-line span {
  &:last-child i {
    display: none;
  }
}
.text-col {
  color: @c-button;
}
.step-tip {
  padding: 13px;
  background: @c-button;
  color: #fff;
  position: absolute;
  border-radius: 2px;
  top: -104px;
  left: -5px;
  white-space: nowrap;
  &::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top: 10px solid @c-button;
    position: absolute;
    left: 8px;
    top: 40px;
  }
}
.step-tip-over {
  padding: 13px;
  background: @c-button;
  color: #fff;
  position: absolute;
  border-radius: 2px;
  top: -104px;
  right: 5px;
  white-space: nowrap;
  &::after {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top: 10px solid @c-button;
    position: absolute;
    right: 8px;
    top: 40px;
  }
}
.default-circle {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 10px;
  border: solid 2px #efefef;
  background: #fff;
  position: absolute;
  top: -37px;
  left: 0;
  z-index: 8;
  &.solid-circle {
    border: solid 2px @c-button;
    background: @c-button;
  }
}
.active-circle {
  position: absolute;
  top: -52px;
  left: -7px;
  width: 36px;
  height: 36px;
  background: @c-button url('../assets/circle.png') no-repeat center center;
  background-size: 14px auto;
  border-radius: 100%;
  display: inline-block;
  z-index: 10;
  border: solid 2px @c-button;
}
.payment-step {
  padding: 85px 80px 30px;
  .step-line-bg {
    width: 100%;
    background: #efefef;
    height: 4px;
    border-radius: 5px;
  }
  .step-solid-bg {
    background: @c-button;
    height: 4px;
    border-radius: 5px;
    position: relative;
    top: -4px;
  }
  .step-text {
    margin-top: 25px;
    position: relative;
    .step-item {
      width: 20%;
      text-align: left;
      position: relative;
      .step-tip-over {
        padding: 13px;
        background: @c-button;
        color: #fff;
        position: absolute;
        border-radius: 2px;
        top: -100px;
        right: -6px;
        &::after {
          content: '';
          display: inline-block;
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-top: 10px solid @c-button;
          position: absolute;
          right: 10px;
          top: 40px;
        }
      }
      span {
        margin-left: -8px;
      }
    }
    .step-item-end {
      position: absolute;
      right: -25px;
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
    background: #ffeded;
    color: #ff7d7d;
  }
  &.man-atv i {
    background: #ecf5ff;
    color: #3b98ff;
  }
  &.unknow-atv i {
    background: #fff8f2;
    color: @c-button;
  }
  .gender-text {
    position: absolute;
    top: 26px;
    left: 120px;
  }
  .film-type {
    position: absolute;
    top: 30px;
    left: 349px;
    i {
      display: block;
      margin-bottom: 16px;
    }
  }
  .age-text {
    position: absolute;
    top: 130px;
    left: 120px;
  }
  .gender-img {
    margin: 30px 0 30px 200px;
  }
}
.city-list {
  display: block;
  width: 100%;
  padding: 20px 0 0 20px;
  margin: 5px 30px 0 13px;
  background: #f9f9f9;
  p {
    margin-bottom: 17px;
    color: #888;
    i {
      display: inline-block;
      width: 130px;
    }
    span {
      color: #444;
    }
  }
}
.film-list {
  label {
    display: inline-block;
    color: #888;
    width: 120px;
  }
  .item {
    background: #f9f9f9;
    margin-right: 20px;
    text-align: center;
    position: relative;
    .film-img-item {
      position: relative;
      .open-time {
        background-color: fade(#000, 90%);
        height: 30px;
        line-height: 30px;
        color: #fff;
        font-size: 13px;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
      }
    }
    .film-name {
      padding: 10px 0 10px;
      font-size: 14px;
    }
    .film-type-items {
      margin-bottom: 10px;
      i {
        color: #ff1000;
        em {
          color: #888;
        }
        &:last-child em {
          display: none;
        }
      }
    }
  }
}
.btn-footer {
  margin: 100px 0 40px;
  .edit-btn {
    margin-right: 20px;
  }
}
.rows-list p label {
  width: 130px;
}
.cinema-list {
  cursor: pointer;
  margin-top: 14px;
  position: relative;
  top: 14px;
  color: @c-button;
}
</style>


