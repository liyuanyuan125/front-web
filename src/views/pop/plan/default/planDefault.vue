<template>
  <div class="home-bg">
    <div class="layout-nav-title">
       <router-link :to="{name: 'pop-planlist'}" >广告计划</router-link> > 
       <span>查看广告计划</span>
    </div>
    <StatusCode :statuCode="Number(status)" :refuseReason="refuseReason" v-if="status" ></StatusCode>
    <h3 class="layout-title">概览</h3>
    <div class="text-rows">
      <Row>
        <Col :span="12">
          <p> <label>投放类型</label> {{deliveryType(items.deliveryType)}} </p>
          <p> <label>广告计划名称</label> {{items.name || '暂无'}} </p>
          <p> <label>广告片规格</label> {{items.specification || 0}}s </p>
          <p>  <label>档期</label>  {{items.calendarName || '暂无'}} </p>
          <p v-if="status == 1 || status == 2 || status == 9 || status == 10">
            <label>预估冻结金额/￥</label>
            {{formatNumber(items.estimateCostAmount) || '暂无'}}
          </p>
          <p v-else> <label>冻结金额/￥</label> {{formatNumber(items.freezeAmount) || '暂无'}} </p>
        </Col>
        <Col :span="12">
          <p> <label>广告计划ID</label>   {{items.id || '暂无'}} </p>
          <p>  <label>客户名称</label>  {{items.customerName || '暂无'}} </p>
          <p>  <label>关联广告片</label>  {{items.videoName || '暂无'}} </p>
          <p>  <label>投放天数</label>  {{items.cycle || 0}} 天 </p>
          <p> <label>计费类型</label>  {{billingModeList(items.billingMode) || '暂无'}}</p>
          <p v-if="status == 3"> <label>订单折扣</label> {{items.discount || 0}}% </p>
        </Col>
      </Row>
    </div>
    <h3 class="layout-title" v-if="launchList">投放地区</h3>
    <div class="text-rows rows-list" v-if="launchList">
      <Row>
        <Col :span="24">
          <p v-if="launchList.categorizedByAreaCode" class="flex-box division-line">
            <label>投放区域（{{launchList.categorizedByAreaCode.length}}个）</label>
            <span v-for="item in launchList.categorizedByAreaCode" :key="item.code">
              {{item.name}}
              <i class="dividing-line">&nbsp;&nbsp;|&nbsp;&nbsp;</i>
            </span>
          </p>
          <p v-if="launchList.categorizedByProvinceId" class="division-line">
            <label>投放省份（{{launchList.categorizedByProvinceId.length || 0}}个）</label>
            <span v-for="item in launchList.categorizedByProvinceId" :key="item.id">
              {{item.name}}
              <i class="dividing-line">&nbsp;&nbsp;|&nbsp;&nbsp;</i>
            </span>
          </p>
          <p v-if="launchList.categorizedByCityId" class="flex-box">
            <label>投放城市（{{account}}个）</label>
            <em class="city-list division-line">
              <p v-for="(item, index) in launchList.categorizedByCityGradeCode" :key="index">
                <i>{{item.name}}（{{item.infos.length}}个）</i>
                <span v-for="(it, ind) in item.infos" :key="ind">
                  {{it.name}}
                   <b class="dividing-line">&nbsp;&nbsp;|&nbsp;&nbsp;</b>
                </span>
              </p>
            </em>
          </p>
          <p v-if="launchList.categorizedByBoxLevelCode" class="flex-box">
            <label> 投放影院（{{items.deliveryCinemas.length || 0}}个） <br>
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
        <p class="flex-box division-line">
          <label>地域偏好</label>
          <span v-if="areaList && areaList.length == 0">  不限 </span>
          <span v-else v-for="(item, index) in areaList" :key="index">
            {{item}}
            <i class="dividing-line">&nbsp;&nbsp;|&nbsp;&nbsp;</i>
          </span>
        </p>
      </div>
      <div class="flex-box" v-else-if="status != 9 && items.directionType != 2">
        <p> <label>观影人群画像</label> </p>
        <div
          v-if="sex"
          class="portrait"
          :class="{'woman-atv': sex == 'woman', 'man-atv': sex == 'man', 'unknow-atv': sex == 'ALL'}"
        >
          <div v-if="sex == 'man'">
            <i class="gender-text">男性</i>
            <i class="age-text">{{age}}</i>
            <img width="156" class="gender-img" src="../assets/man.png">
          </div>
          <div v-else-if="sex == 'woman'">
            <i class="gender-text">女性</i>
            <i class="age-text">{{age}}</i>
            <img width="156" class="gender-img" src="../assets/woman.png">
          </div>
          <div v-else-if="sex == 'ALL'">
            <i class="gender-text">性别不详</i>
            <i class="age-text">年龄不详</i>
            <img width="156" class="gender-img" src="../assets/unknow.png">
          </div>
          <div class="film-type flex-box">
            <i v-if="typeList.length == 0" class="notType">类型不详</i>
            <i v-for="(item, index) in typeList" :key="index">{{item}}</i>
          </div>
        </div>
      </div>
      <div class="flex-box film-list">
        <label>影片</label>
        <div class="flex-box flex-wrap" v-if="defaultData.movieList && defaultData.movieList.length > 0">
          <div class="item" v-for="(item, index) in defaultData.movieList" :key="index">
            <div class="film-img-item">
              <img :src="item.mainPicUrl" width="180" height="240">
              <div class="open-time">上映时间：{{subTimes(item.openTime)|| "暂无"}}</div>
            </div>
            <div class="film-name">《{{item.name}}》</div>
            <div class="film-type-items">
              <i v-for="(it, index) in item.types" :key="index" :class="{'flag-active': typeList.includes(queryFilmList(it))}">
                {{queryFilmList(it)}}
                <em>/</em>
              </i>
            </div>
          </div>
        </div>
        <div v-else>暂无</div>
      </div>
    </div>
    <div class="btn-center-footer btn-footer" v-if="status == 1">
      <Button v-if="status == 1" v-auth="'promotion.ad-plan#cancel'" class="button-cancel" @click="cancelPlan">取消计划</Button>
      <Button v-if="status == 1 || status == 10" v-auth="'promotion.ad-plan#edit'" type="primary"  class="button-ok edit-btn"  @click="toEdit" >编辑</Button>
      <Button v-if="status == 1" type="primary" class="button-ok" @click="submitExamine">提交审核</Button>
    </div>
    <CinemaList v-model="cinema" v-if="cinema.visible"/>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info } from '@/ui/modal'
import CinemaList from './cinemaDlg.vue'
import StatusCode from './status.vue'
import { planDefault, subExamine, planCancel } from '@/api/plan'
import { formatNumber } from '@/util/validateRules'

@Component({
  components: {
    CinemaList,
    StatusCode
  }
})
export default class PlanDefault extends ViewBase {
  // 拒绝原因
  refuseReason = ''

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

  get formatNumber() {
    return formatNumber
  }

  async mounted() {
    this.list()
  }

  async list() {
    try {
      const id = this.$route.params.id
      const { data } = await planDefault(id)
      this.defaultData = data
      this.items = data.item || {}
      this.status = this.items.status
      this.launchList = data.statisticsResults
      this.refuseReason = data.item.refuseReason || ''

      // MOVIE_TYPE=电影类型  PLAN_GROUP_AGE = 年龄  PLAN_GROUP_SEX = 性别 DISTRICT_AREA = 区域
      this.tags = data.tags
      const sex = data.item.deliveryGroups.filter((item: any) => {
        if (item.tagTypeCode && item.tagTypeCode == 'PLAN_GROUP_SEX') {
          return item
        }
      })
      this.sex = sex && sex.length != 0 ? sex[0].text : 'ALL'
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
          if (item.code == 'new-first-tier') {
            item.accountNum = 0
          } else if (item.code == 'first-tier') {
             item.accountNum = 1
          } else if (item.code == 'second-tier') {
            item.accountNum = 2
          } else if (item.code == 'third-tier') {
            item.accountNum = 3
          } else if (item.code == 'four-tier') {
            item.accountNum = 4
          } else if (item.code == 'five-tier') {
            item.accountNum = 5
          }
          account += item.infos.length
        })
        this.account = account
        // 重新定义投放城市排序
        let sort: any = []
         sort = this.launchList.categorizedByCityGradeCode.sort((a: any, b: any) => {
          return a.accountNum - b.accountNum
        })
        this.launchList.categorizedByCityGradeCode = sort
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  subTimes(tim: any) {
    if (!tim) { return ''}
    tim = tim.toString()
    return `${tim.substring(0, 4)}-${tim.substring(4, 6)}-${tim.substring(6)}`
  }

  async submitExamine() {
    await confirm('是否确定将广告计划提交审核', { title: '提交审核' })
    try {
      const id = this.items.id
      await subExamine(id)
      this.$router.push({ name: 'pop-planlist' })
    } catch (ex) {
      this.handleError(ex)
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

  toEdit() {
    this.$router.push({name: 'pop-planlist-add', params: {id: this.items.id}})
  }

  async cancelPlan() {
    const id = this.$route.params.id
    await confirm(`是否取消广告计划：${this.items.name}`, {title: '取消广告计划'})
    try {
      const { data } = await planCancel(id)
      this.$router.push({name: 'pop-planlist'})
    } catch (ex) {
      this.handleError(ex)
    }
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
@import '~@/views/account/less/common.less';

.flex-wrap {
  flex-wrap: wrap;
}
.dividing-line {
  color: #d8d8d8;
}
.division-line span {
  &:last-child i {
    display: none;
  }
  &:last-child b {
    display: none;
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
    left: 0;
  }
  .film-type {
    position: absolute;
    top: 84px;
    left: 237px;
    i {
      margin-right: 5px;
      margin-bottom: 16px;
    }
  }
  .age-text {
    position: absolute;
    top: 140px;
    left: 0;
  }
  .gender-img {
    margin: 30px 0 30px 80px;
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
    width: 108px;
  }
  .item {
    width: 180px;
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
      width: 180px;
      word-wrap: break-word;
      word-break: normal;
    }
    .film-type-items {
      margin-bottom: 10px;
      padding: 0 10px;
      i {
        &.flag-active {
          color: #ff1000;
        }
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
  width: 136px;
}
.cinema-list {
  cursor: pointer;
  margin-top: 14px;
  position: relative;
  top: 14px;
  color: @c-button;
}
</style>


