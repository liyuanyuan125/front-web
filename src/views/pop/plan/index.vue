<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">创建广告计划</h2>

    <Form :model="form" label-position="left" :label-width="100" class="edit-input forms">
      <h3 class="layout-title">基本信息</h3>

      <FormItem label="投放类型" class="item-top select-adv-type">
        <span
          :class="{active: form.putType == 'refBefore'}"
          @click="form.putType = 'refBefore'"
        >映前广告</span>
        <span :class="{active: form.putType == 'refafter'}" @click="form.putType = 'refafter'">线下场馆</span>
      </FormItem>

      <FormItem label="广告计划">
        <Input v-model="form.advMes" placeholder="如：2019款全新奔驰G级影院广告"></Input>
        <Select
          v-model="form.advType"
          class="select-adv-list"
          style="width:200px"
          placeholder="请选择类型"
        >
          <Option :value="item.id" :key="item.id" v-for="item in advTypeList">{{item.name}}</Option>
        </Select>
      </FormItem>

      <FormItem label="投放排期">
        <div class="flex-box">
          <div class="put-tab">
            <p :class="{active: tabs == 1}" @click="tabs = 1">自定义时间段</p>
            <span></span>
            <p :class="{active: tabs == 2}" @click="tabs = 2">按热门档期</p>
            <span></span>
          </div>
          <div class="tabs-active">
            <div v-if="tabs == 1">
              <DatePicker
                v-model="form.date"
                format="yyyy/MM/dd"
                type="daterange"
                placement="bottom-end"
                placeholder="请输入投放开始日期和结束日期"
              ></DatePicker>
            </div>
            <div v-else>
              <RadioGroup v-model="form.vacation">
                <Radio label="春节档" class="radio-item"></Radio>
                <Radio label="情人节档" class="radio-item"></Radio>
                <Radio label="五一档" class="radio-item"></Radio>
                <Radio label="暑假档" class="radio-item"></Radio>
              </RadioGroup>
            </div>
          </div>
        </div>
      </FormItem>
      <h3 class="layout-title">投放定向</h3>

      <FormItem label="定向类型" class="form-item-type" v-if="isRefBefore">
        <RadioGroup v-model="form.type" type="button">
          <Radio v-for="it in typeList" :key="it.key" :label="it.key"
            class="target-type">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="投放地区" class="form-item-type" v-if="!isSingle">
        <RadioGroup v-model="form.areaType">
          <Radio v-for="it in areaTypeList" :key="it.key" :label="it.key"
            class="radio-item">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>

      <div class="city-wrap" v-if="!isSingle">
        <CitySelect/>
      </div>

      <div class="people-wrap" v-if="isRefBefore && !isSingle">
        <h3 class="group-title">观影人群</h3>

        <FormItem label="观影人群性别" class="form-item-sex">
          <RadioGroup v-model="form.sex">
            <Radio v-for="it in sexList" :key="it.key" :label="it.key"
              class="radio-item">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="观影人群年龄" class="form-item-age">
          <RadioGroup v-model="form.age">
            <Radio v-for="it in ageStageList" :key="it.key" :label="it.key"
              class="radio-item">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="观影人群偏好" class="form-item-hobby">
          <CheckboxGroup v-model="form.filmHobby" class="float">
            <Checkbox v-for="it in filmHobbyList" :key="it.key"
              :label="it.key" class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </div>

      <div class="single-wrap" v-if="isSingle">
        <FormItem label="观影人群性别" class="form-item-sex">
          <RadioGroup v-model="form.sex">
            <Radio v-for="it in sexList" :key="it.key" :label="it.key"
              class="radio-item">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="观影人群年龄" class="form-item-age">
          <RadioGroup v-model="form.age">
            <Radio v-for="it in ageStageList" :key="it.key" :label="it.key"
              class="radio-item">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="观影人群偏好" class="form-item-hobby">
          <CheckboxGroup v-model="form.filmHobby" class="float">
            <Checkbox v-for="it in filmHobbyList" :key="it.key"
              :label="it.key" class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem label="选择影片" class="form-item-film-name">
          <Input v-model="form.filmName" class="input-film-name"
            placeholder="输入影片名字" search enter-button/>
        </FormItem>

        <FormItem label="影片类型" class="form-item-film-type">
          <CheckboxGroup v-model="form.filmType" class="float">
            <Checkbox v-for="it in filmHobbyList" :key="it.key"
              :label="it.key" class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <p class="single-result"
          v-if="foundFilmList.length > 0">已为您匹配以下{{foundFilmList.length}}部影片：</p>

        <ul class="single-film-list" v-if="foundFilmList.length > 0">
          <li v-for="(it, i) in foundFilmList" :key="i" class="single-film-item">
            <div class="film-cover-box">
              <img :src="it.cover" class="film-cover">
              <div class="film-date">上映时间：{{it.date}}</div>
            </div>
            <h4 class="film-name">{{it.name}}</h4>
            <div class="film-tags">{{it.tags}}</div>
          </li>
        </ul>
      </div>

      <FormItem label="场馆类型" class="item-top" v-if="!isSingle">
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

      <FormItem label="广告形式" v-if="!isSingle">
        <div class="flex-box">
          <div class="adv-position">
            <span
              v-for="(item, index) in advList"
              :key="item.key"
              :class="{'adv-active': index == ding}"
              @click="handleTabs(item.id)"
            >{{item.name}}</span>
          </div>
          <div class="select-tabs" :class="selectTab"></div>
        </div>
      </FormItem>

      <h3 class="layout-title">预算与计费</h3>

      <FormItem label="总预算/￥" class="item-top">
        <RadioGroup v-model="form.totalMonery">
          <Radio :label="item.label" v-for="item in amountList" :key="item.key"
            class="radio-item"></Radio>
          <Radio label="指定金额" class="radio-item">
            指定金额
            <em v-if="form.totalMonery == '指定金额'" class="custom-monery">
              <Input v-model="form.custom" placeholder="请输入自定义金额"/>万
            </em>
          </Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="计算方式">
        <RadioGroup v-model="form.bill">
          <Radio label="按人次计费"></Radio>
        </RadioGroup>
      </FormItem>
    </Form>

    <div class="btn-center">
      <button class="button-ok" @click="handleScheme">生成投放方案</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cityList, City, sexList, ageStageList, filmHobbyList,
  areaTypeList, filmList as allFilmList } from './types'
import CitySelect from './citySelect.vue'

// 保持互斥
const keepExclusion = <T>(value: T[], oldValue: T[], aloneValue: T, setter: (newValue: T[]) => any) => {
  if (value.length > 1) {
    const newHas = value.includes(aloneValue)
    const oldHas = oldValue.includes(aloneValue)
    newHas && setter([aloneValue])
    newHas && oldHas && setter(value.filter(it => it != aloneValue))
  }
}

@Component({
  components: {
    CitySelect
  }
})
export default class Main extends ViewBase {
  tabs = 1
  ding = 0
  selectTab = 'tabs1'
  allType = true

  form = {
    putType: 'refBefore',
    advMes: '',
    advType: '',
    date: '',
    vacation: '春节档',
    totalMonery: '50万以下',
    bill: '按人次计费',
    custom: '',
    venueType: [],

    // 定向类型
    type: 1,
    areaType: 3,
    sex: 0,
    age: 0,
    filmHobby: [0],

    // 单个影片
    filmName: '',
    filmType: [0]
  }

  // 是否为映前广告
  get isRefBefore() {
    return this.form.putType == 'refBefore'
  }

  // 是否为「按单部影片模式」
  get isSingle() {
    return this.isRefBefore && this.form.type == 2
  }

  typeList = [
    { key: 1, text: '标准定向' },
    { key: 2, text: '按单部影片' },
  ]

  areaTypeList = areaTypeList

  sexList = sexList

  ageStageList = ageStageList

  filmHobbyList = filmHobbyList

  allFilmList = allFilmList

  get foundFilmList() {
    return this.allFilmList
  }

  advTypeList = [
    { id: 1, name: '奔驰' },
    { id: 2, name: '西贝餐饮' },
    { id: 3, name: '迪奥' }
  ]
  amountList = [
    { key: 1, label: '50万以下' },
    { key: 2, label: '50~100万以下' },
    { key: 4, label: '100~300万以下' },
    { key: 5, label: '300~500万以下' },
    { key: 6, label: '500~800万以下' },
    { key: 7, label: '800~1000万以下' },
    { key: 8, label: '1000万以上' }
  ]
  advList = [
    { id: 1, name: '海报灯箱' },
    { id: 2, name: '墙体灯箱' },
    { id: 3, name: '冠名厅' },
    { id: 4, name: 'LCD拼接屏' },
    { id: 5, name: 'LED' },
    { id: 6, name: '卖品柜台屏幕' },
    { id: 7, name: '门贴' }
  ]

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

  handleScheme() {
    // id 为 1 映前广告－标准定向2 映前广告－按单部影片3 线下场馆
    const id = this.form.putType == 'refBefore'
      ? (this.form.type == 1 ? 1 : 2)
      : 3
    this.$router.push({ name: 'pop-plan-scheme', params: { id: String(id) } })
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
}
.form-item-type {
  margin-top: 35px;
}

.city-wrap {
  width: 790px;
  margin-left: 70px;
}

.forms {
  font-size: 14px;
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
    margin: 10px 15px 0 0;
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
      }
    }
  }
  .select-adv-type {
    span {
      display: inline-block;
      width: 160px;
      height: 50px;
      line-height: 47px;
      text-align: center;
      color: #444;
      margin-right: 20px;
      font-size: 14px;
      border: solid 1px #fff;
      cursor: pointer;
      background: #f7f7f7;
      &.active {
        background: url('./assets/bg-type.png') no-repeat;
        background-size: contain;
      }
    }
  }
  /deep/ .ivu-input {
    font-size: 14px;
    &::placeholder {
      font-size: 14px;
    }
  }
  /deep/ .ivu-form-item {
    margin-left: 70px;
    font-size: 14px;
  }
  /deep/ .ivu-select-selection {
    margin-left: 35px;
    width: 200px;
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
/deep/ .ivu-radio-checked .ivu-radio-inner {
  border-color: @c-button;
  &::after {
    background-color: @c-button;
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
  margin: 36px 0 0 70px;
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
  min-width: 60px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border: 1px solid #d2d2d2;
  margin-right: 15px;
  font-size: 14px;
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
  width: 270px;
  margin: 25px 10px 0 0;
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
  background-color: rgba(0, 0, 0, .8);
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
