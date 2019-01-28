<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">创建广告计划</h2>

    <Form :model="form" label-position="left" :label-width="100" class="edit-input forms">
      <h3 class="layout-title">基本信息</h3>

      <!-- 投放类型 -->
      <FormItem label="投放类型" class="item-top select-adv-type">
        <span v-for="item in deliveryTypeList" :key="item.text">{{item.text}}</span>
      </FormItem>

      <div class="clear-f">
        <FormItem class="float-left" label="广告片名称">
          <Input v-model="form.name" placeholder="请输入广告片名称"></Input>
        </FormItem>
        <FormItem class="float-right pr30" label="关联广告片">
          <Select v-model="form.adverId" filterable clearable>
            <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </div>

      <div class="clear-f" v-if="form.adverId">
        <FormItem class="float-left pr30" label="广告片规格">
          <div class="xad"><span>{{length}}</span></div>
        </FormItem>
        <FormItem class="float-right pr30" label="选择客户">
          <div class="xad"><span>{{customerName}}</span></div>
        </FormItem>
      </div>

      <!-- 投放排期 -->
      <h3 @click="dateSet(1)" class="layout-title">投放排期</h3>
      <FormItem label="定向类型" class="form-item-type">
        <Tags v-model="dateType" :tagMess = 'dateObj' />
      </FormItem>

      <!-- 投放排期 自定义时间 -->
      <div class="clear-f" key="save" v-if="dateType == 1">
        <FormItem class="tag-date float-left" label="开始时间">
          <DatePicker type="date" v-model="form.beginDate" :options="startDate" placeholder="请选择开始时间"></DatePicker>
        </FormItem>
        <FormItem class="tag-date float-right pr130" label="结束时间">
          <DatePicker type="date" v-model="form.endDate" :options="endDate" placeholder="请选择结束时间"></DatePicker>
        </FormItem>
      </div>

      <!-- 投放排期 按热门档期 -->
      <div v-else key="edited" class="checkd">
        <div class="clear-f">
          <FormItem class="tag-date float-left" label="选择年份">
            <DatePicker type="year" v-model="form.year" @on-change="diaries()" placeholder="请选择年份"></DatePicker>
          </FormItem>
          <FormItem class="tag-date float-right pr130" label="选择档期">
            <Select style="width: 300px" :disabled="!form.year" v-model="form.calendarId" filterable clearable>
              <Option v-for="(item, index) in airiesList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="clear-f">
          <FormItem class="tag-date float-left" label="开始时间">
            <Input disabled v-model="beginDateId" placeholder="" />
          </FormItem>
          <FormItem class="tag-date float-right pr130" label="结束时间">
            <Input disabled v-model="endDateId" placeholder="" />
          </FormItem>
        </div>
      </div>

      <!-- 投放定向 -->
      <h3 class="layout-title">投放定向</h3>

      <FormItem label="投放类型" class="item-top select-adv-type">
        <span :class="['put', putType== item.key ? 'put-active' : '']" v-for="item in directionTypeList" @click="putActive(item.key)" :key="item.key">
          {{item.text}}
        </span>
      </FormItem>

      <transition name="fade" mode="out-in">
        <!-- 投放定向 标准定向 -->
        <div v-if="putType == 1">
          <FormItem label="投放地区" class="form-item-type">
            <radioTab v-model="form.areaType" :tagMess="areaTypeList" />
          </FormItem>

          <div class="city-wrap">
            <CinemaNum :data="statisticsResults" :type="form.areaType" />
          </div>
          <!-- <div class="city-wrap">
          </div> -->
          <FormItem v-for="(item, index) in tags" :key="index" :label="item.name" class="form-item-age">
            <CheckboxGroup v-model="form.age" class="item-radio-top">
              <Checkbox class="check-item" :label="0">不限</Checkbox>
              <Checkbox v-for="it in item.values" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </div>

        <!-- 投放定向 按单部影片 -->
        <div v-else class="single-wrap">
          <FormItem label="观影人群性别" class="form-item-sex">
            <RadioGroup v-model="form.sex">
              <Radio
                v-for="it in sexList"
                :key="it.key"
                :label="it.key"
                class="radio-item"
              >{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="观影人群年龄" class="form-item-age">
            <CheckboxGroup v-model="form.age" class="item-radio-top">
              <Checkbox v-for="it in ageStageList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Checkbox>
            </CheckboxGroup>
          </FormItem>

          <FormItem label="观影人群偏好" class="form-item-hobby">
            <CheckboxGroup v-model="form.filmHobby" class="float">
              <Checkbox
                v-for="it in filmHobbyList"
                :key="it.key"
                :label="it.key"
                class="check-item"
              >{{it.text}}</Checkbox>
            </CheckboxGroup>
          </FormItem>

          <FormItem label="选择影片" class="form-item-film-name">
            <Input
              v-model="form.filmName"
              class="input-film-name"
              placeholder="输入影片名字"
              search
              enter-button
            />
          </FormItem>

          <FormItem label="影片类型" class="form-item-film-type">
            <CheckboxGroup v-model="form.filmType" class="float">
              <Checkbox
                v-for="it in filmHobbyList"
                :key="it.key"
                :label="it.key"
                class="check-item"
              >{{it.text}}</Checkbox>
            </CheckboxGroup>
          </FormItem>

          <p class="single-result" v-if="foundFilmList.length > 0">已为您匹配以下{{foundFilmList.length}}部影片：</p>

          <ul class="single-film-list" v-if="foundFilmList.length > 0">
            <li v-for="it in foundFilmList" :key="it.id" @click="selectFilm(it)"
              :class="['single-film-item',
              form.filmIdSelected == it.id ? 'single-film-item-on' : '']">
              <div class="film-cover-box">
                <img :src="it.cover" class="film-cover">
                <div class="film-date">上映时间：{{it.date}}</div>
              </div>
              <h4 class="film-name">{{it.name}}</h4>
              <div class="film-tags">{{it.tags}}</div>
            </li>
          </ul>
        </div>

        <FormItem label="场馆类型" class="item-top" v-if="!isRefBefore">
          <span
            class="float check-type all-type"
            @click="handleAllType"
            :class="{checked: allType}"
          >不限</span>
          <CheckboxGroup v-model="form.venueType" @on-change="handleVenue" class="float">
            <Checkbox
              label="剧院"
              class="check-type"
              :class="{checked: form.venueType.includes('剧院') }"
            />
            <Checkbox
              label="剧场"
              class="check-type"
              :class="{checked: form.venueType.includes('剧场') }"
            />
            <Checkbox
              label="文化馆"
              class="check-type"
              :class="{checked: form.venueType.includes('文化馆') }"
            />
            <Checkbox
              label="体育馆"
              class="check-type"
              :class="{checked: form.venueType.includes('体育馆') }"
            />
            <Checkbox
              label="商场"
              class="check-type"
              :class="{checked: form.venueType.includes('商场') }"
            />
            <Checkbox
              label="写字楼"
              class="check-type"
              :class="{checked: form.venueType.includes('写字楼') }"
            />
          </CheckboxGroup>
        </FormItem>
      </transition>

      <!-- 预算与计费 -->
      <h3 class="layout-title">预算与计费</h3>

      <!-- <FormItem label="总预算/￥" class="item-top">
        <CheckboxGroup v-model="form.totalMonery" class="item-radio-top">
          <Checkbox :label="item.label" v-for="item in amountList" :key="item.key" class="radio-item"></Checkbox>
          <Checkbox label="指定金额" class="radio-item">
            指定金额
            <em v-if="form.totalMonery == '指定金额'" class="custom-monery">
              <Input v-model="form.custom" placeholder="请输入自定义金额"/>万
            </em>
          </Checkbox>
        </CheckboxGroup>
      </FormItem> -->

      <FormItem label="计算方式">
        <RadioGroup v-model="form.bill" class="item-radio-top">
          <Radio label="按人次计费"></Radio>
        </RadioGroup>
      </FormItem>
    </Form>

    <div class="btn-center">
      <Button type="primary" class="button-ok">生成投放方案</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cityList, City, sexList, ageStageList, filmHobbyList,
  areaTypeList, filmList as allFilmList, Film } from './types'
import CitySelect from './citySelect.vue'
import Tags from './tag.vue'
import CinemaNum from './comcinema/cinemaNum.vue'
import radioTab from './radioTab.vue'
import { drairesList, beforePlan, advertising, advertDetail } from '@/api/popPlan.ts'

// 保持互斥
const keepExclusion = <T>(
  value: T[],
  oldValue: T[],
  aloneValue: T,
  setter: (newValue: T[]) => any
) => {
  if (value.length > 1) {
    const newHas = value.includes(aloneValue)
    const oldHas = oldValue.includes(aloneValue)
    newHas && setter([aloneValue])
    newHas && oldHas && setter(value.filter(it => it != aloneValue))
  }
}

@Component({
  components: {
    CitySelect,
    Tags,
    radioTab,
    CinemaNum
  }
})
export default class Main extends ViewBase {
  tagColor = '#fe8135'
  tabs = 1
  ding = 0
  selectTab = 'tabs1'
  allType = true
  putType = 1
  dateObj: any = [
    {
      name: '自定义时间',
      label: 1
    },
    {
      name: '按热门档期',
      label: 2
    }
  ]

  // 选择档期的开始时间 结束时间
  airiesList: any = []
  beginDateId = ''
  endDateId = ''

  // 关联广告片
  adverList: any = []
  length: any = ''
  customerName: any = ''
  // 计费方式
  billingModeList: any = []

  // 投放类型
  deliveryTypeList: any = []

  // 投放定向 投放类型
  directionTypeList: any = []

  // 支付信息
  statusList: any = []

  // 电影信息
  tags: any = []

  // 邮箱加速
  typeList: any = []

  // 指定金额
  tagCodes: any = []

  // 统计
  statisticsResults: any = []

  // 时间格式
  dateType: number = 1
  startDate: any = {
    disabledDate: (date: any) => {
      return date && this.form.endDate && date.valueOf() > new Date(this.form.endDate).getTime()
    }
  }
  endDate: any = {
    disabledDate: (date: any) => {
      return date && this.form.beginDate && date.valueOf() < new Date(this.form.beginDate).getTime()
    }
  }

  form = {
    putType: 'refBefore',
    name: '',
    adverId: null,
    year: '',
    calendarId: '',
    beginDate: '',
    endDate: '',
    advType: '',
    date: '',
    vacation: '春节档',
    totalMonery: '50万以下',
    bill: '按人次计费',
    custom: '',
    venueType: [],

    // 定向类型
    type: 1,
    areaType: '',
    sex: 0,
    age: [0],
    filmHobby: [0],

    // 单个影片
    filmName: '',
    filmType: [0],
    filmIdSelected: 0,
  }

  citySel = false

  // 是否为映前广告
  get isRefBefore() {
    return this.form.putType == 'refBefore'
  }

  // 是否为「按单部影片模式」
  get isSingle() {
    return this.isRefBefore && this.form.type == 2
  }

  areaTypeList = areaTypeList

  sexList = sexList

  ageStageList = ageStageList

  filmHobbyList = filmHobbyList

  allFilmList = allFilmList

  get foundFilmList() {
    return this.allFilmList
  }

  created() {
    this.beforePlan()
    this.beginAdver()
  }

  // amountList = [
  //   { key: 1, label: '50万以下' },
  //   { key: 2, label: '50~100万以下' },
  //   { key: 4, label: '100~300万以下' },
  //   { key: 5, label: '300~500万以下' },
  //   { key: 6, label: '500~800万以下' },
  //   { key: 7, label: '800~1000万以下' },
  //   { key: 8, label: '1000万以上' }
  // ]

  async beforePlan() {
    try {
      const {
        data: {
          billingModeList,
          deliveryTypeList,
          directionTypeList,
          statusList,
          tags,
          typeList,
          tagCodes,
          statisticsResults
        }
      } = await beforePlan()
      this.billingModeList = this.filtertion(billingModeList)
      this.deliveryTypeList = this.filtertion(deliveryTypeList)
      this.directionTypeList = this.filtertion(directionTypeList)
      this.statusList = this.filtertion(statusList)
      this.tags = tags
      this.statisticsResults = statisticsResults
      this.typeList = this.filtertion(typeList)
    } catch (ex) {
      this.handleError(ex)
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

  async beginAdver() {
    try {
      const {
        data: {
          items
        }
      } = await advertising({
        pageIndex: 1,
        pageSize: 200000,
      })
      this.adverList = items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async adverDetail(id: number) {
    try {
      const {
        data: {
          item
        }
      } = await advertDetail(id)
      this.length = item.length
      this.customerName = item.customerName
    } catch (ex) {
      this.handleError(ex)
    }
  }
  // 过滤未知
  filtertion(data: any) {
    const list = data.filter((it: any) => it.key != 0)
    return list
  }

  // 查询档期
  async diaries() {
    if (this.form.year) {
      const year = new Date(this.form.year).getFullYear()
      const {
        data: {
          items
        }
      } = await drairesList(year)
      this.airiesList = items || []
    }
  }

  handleChange() {
    if (this.form.areaType == 0) {
      this.citySel = false
    } else {
      this.citySel = true
    }
  }
  handleVenue() {
    if (this.allType && this.form.venueType.length >= 1) {
      this.allType = false
    }
  }

  handleAllType() {
    if (!this.allType && this.form.venueType.length >= 1) {
      this.form.venueType = []
      this.allType = true
    }
  }

  handleTabs(val: any) {
    this.ding = val - 1
    this.selectTab = `tabs${val}`
  }

  putActive(id: any) {
    this.putType = id
  }


  selectFilm(film: Film) {
    this.form.filmIdSelected = film.id
  }

  mounted() {
    // const handler = () => {
    //   this.$router.push({ name: 'pop-planps' })
    //   event.off(systemSwitched, handler)
    //   return false
    // }
    // event.on(systemSwitched, handler)
  }

  @Watch('form.age', { deep: true })
  watchAge(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.age = newValue
    })
    if (value.length == 0) {
      this.form.age = [0]
    }
  }

  @Watch('form.filmHobby', { deep: true })
  watchFilmHobby(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.filmHobby = newValue
    })
  }

  @Watch('form.filmType', { deep: true })
  watchfilmType(value: number[], oldValue: number[]) {
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.filmType = newValue
    })
  }

  // 观测广告片Id
  @Watch('form.adverId', { deep: true })
  watchadverId(val: any) {
    if (val) {
      this.adverDetail(val)
    }
  }

  // 观测档期Id
  @Watch('form.calendarId', { deep: true })
  watchcalendarId(val: any) {
    if (val) {
      this.beginDateId = this.formatTime(this.airiesList.filter((it: any) => it.id == val)[0].beginDate)
      this.endDateId = this.formatTime(this.airiesList.filter((it: any) => it.id == val)[0].endDate)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.float {
  float: left;
}
.btn-center {
  margin: 40px 0 30px;
  text-align: center;
}
.radio-item {
  font-size: 14px;
  margin-right: 40px;
  border-radius: 2px;
  border-left: 0;
  user-select: none;
}
.form-item-type {
  margin-top: 35px;
}

.orient-tabs {
  margin-top: 4px;
  label {
    margin-right: 30px;
    border-radius: 4px;
    &:hover {
      border: 1px solid #d2d2d2;
      border-radius: 4px;
      color: @c-head;
    }
  }
}

.city-wrap {
  padding-right: 40px;
  margin-left: 130px;
}
.item-radio-top {
  margin-top: 3px;
}
.forms {
  font-size: 14px;
  .clear-f::after {
    clear: both;
    content: '.';
    display: block;
  }
  .float-left {
    float: left;
  }
  .float-right {
    float: right;
  }
  .pr30 {
    padding-right: 30px;
  }
  .pr130 {
    padding-right: 130px;
  }
  .tag, .tag1 {
    width: 120px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin-right: 30px;
    margin-top: 5px;
  }
  .tag-date {
    /deep/ .ivu-form-item-content .ivu-input-wrapper {
      width: 300px;
    }
  }
  .all-type {
    line-height: 22px;
    margin-right: 6px;
    cursor: pointer;
    &.checked {
      color: #fff;
      background-color: @c-button;
    }
  }
  .check-type {
    margin: 8px 15px 0 0;
    width: 60px;
    height: 26px;
    font-size: 14px;
    text-align: center;
    border-radius: 2px;
    border: 1px solid rgba(210, 210, 210, 1);
    &.checked {
      color: #fff;
      background-color: @c-button;
    }
    /deep/ .ivu-checkbox {
      display: none;
      & + span {
        position: relative;
        top: -4px;
        margin-right: 0;
      }
    }
  }
  .xad {
    width: 400px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .select-adv-type {
    font-size: 0;
    span {
      display: inline-block;
      width: 155px;
      height: 50px;
      line-height: 47px;
      text-align: center;
      color: #444;
      margin-top: -3px;
      font-size: 14px;
      cursor: pointer;
      background: #f7f7f7;
    }
    .put-active {
      background: #fb8135;
      color: #fff;
    }
  }
  /deep/ .checkd .ivu-select-selection {
    width: 300px;
  }
  /deep/ .ivu-input {
    font-size: 14px;
    &::placeholder {
      font-size: 14px;
    }
  }
  /deep/ .ivu-form-item {
    margin-left: 30px;
    font-size: 14px;
  }
  /deep/ .ivu-select-dropdown {
    /deep/ li, /deep/ .ivu-select-loading {
      line-height: 30px;
      height: 30px;
    }
    /deep/ .ivu-select-item {
      line-height: 25px;
      height: 30px;
    }
  }
  /deep/ .ivu-select-input {
    height: 40px;
    font-size: 14px;
    line-height: 40px;
  }
  .put-tab {
    font-size: 14px;
    position: relative;
    span {
      position: absolute;
      top: 11px;
      right: -12px;
      display: inline-block;
      width: 2px;
      height: 22px;
      background: #ededed;
      &:nth-child(2) {
        right: -12px;
        top: 51px;
      }
    }
    p {
      width: 120px;
      padding: 4px 10px 4px 18px;
      border-bottom: solid 1px #ededed;
      cursor: pointer;
      position: relative;
      &.active {
        color: @c-button;
        background: url('./assets/active.png') no-repeat 1px center;
        background-size: 11px;
      }
      &.active::before {
        display: block;
        content: '';
        position: absolute;
        left: 0;
        top: 5px;
        width: 10px;
        font-size: 14px;
        color: @c-button;
      }
    }
  }
  .tabs-active {
    margin-left: 30px;
    padding-top: 5px;
  }
  .adv-position {
    font-size: 14px;
    color: #444;
    width: 120px;
    margin-top: 30px;
    span {
      display: block;
      cursor: pointer;
      margin-bottom: 10px;
      padding-left: 35px;
      width: 200px;
      &.adv-active {
        font-size: 17px;
        background: url('./assets/arrow.png') no-repeat left center;
        background-size: 20px;
        color: @c-button;
      }
    }
  }
  /deep/ .ivu-input-icon {
    height: 40px;
    line-height: 40px;
  }
}

/deep/ .custom-monery {
  .ivu-input-wrapper {
    width: 150px;
    input {
      height: 30px;
      line-height: 30px;
    }
  }
}
/deep/ .ivu-radio-wrapper {
  font-size: 14px;
}
.select-tabs {
  margin: 30px 0 0 50px;
  width: 536px;
  height: 260px;
}
.tabs1 {
  background: url('./assets/tabs1.png') no-repeat;
  background-size: cover;
}
.tabs2 {
  background: url('./assets/tabs2.png') no-repeat;
  background-size: cover;
}
.tabs3 {
  background: url('./assets/tabs3.png') no-repeat;
  background-size: cover;
}
.tabs4 {
  background: url('./assets/tabs4.png') no-repeat;
  background-size: cover;
}
.tabs5 {
  background: url('./assets/tabs5.png') no-repeat;
  background-size: cover;
}
.tabs6 {
  background: url('./assets/tabs6.png') no-repeat;
  background-size: cover;
}
.tabs7 {
  background: url('./assets/tabs7.png') no-repeat;
  background-size: cover;
}

.people-wrap {
  margin: 36px 0 23px 70px;
  .ivu-form-item {
    margin: 0 0 8px 52px;
  }
}
.group-title {
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 10px;
}

.check-item {
  position: relative;
  top: 3px;
  min-width: 80px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border: 1px solid #d2d2d2;
  margin-right: 15px;
  font-size: 14px;
  user-select: none;
  /deep/ .ivu-checkbox {
    display: none;
  }
  /deep/&.ivu-checkbox-wrapper-checked {
    color: #fff;
    border-color: @c-button;
    background-color: @c-button;
  }
}

.single-result,
.single-film-list {
  margin-left: 169px;
}
.single-result {
  color: @c-sub-text;
}

.single-film-list {
  display: flex;
  flex-wrap: wrap;
  column-count: 3;
  margin-top: -15px;
  margin-bottom: 40px;
}
.single-film-item {
  position: relative;
  width: 270px;
  margin: 25px 10px 0 0;

  &::before {
    content: '选择影片';
    position: absolute;
    left: 10px;
    top: 10px;
    width: 60px;
    height: 60px;
    padding: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    background-color: fade(@c-button, 90%);
    border-radius: 100%;
    z-index: 1;
    text-align: center;
    line-height: 1.2;
  }
}
.single-film-item-on {
  &::before {
    content: '已选影片';
    background-color: fade(#059bfb, 90%);
  }
}

.film-cover-box {
  position: relative;
  width: 270px;
  height: 405px;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.film-date {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
}
.film-name,
.film-tags {
  line-height: 22px;
  text-align: center;
  font-weight: normal;
}
.film-name {
  margin-top: 10px;
}

.form-item-film-name {
  /deep/ .ivu-input {
    border-color: @c-button;
  }
  /deep/ .ivu-input-search {
    border-color: @c-button !important;
    background-color: @c-button !important;
    &:hover,
    &:active {
      border-color: darken(@c-button, 10%) !important;
      background-color: darken(@c-button, 10%) !important;
    }
  }
}
</style>
