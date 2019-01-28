<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">创建广告计划</h2>

    <Form :model="form" label-position="left" :label-width="100" class="edit-input forms">
      <h3 class="layout-title">基本信息</h3>

      <FormItem label="投放类型" class="item-top select-adv-type">
        <span :class="{active: form.putType == 'refBefore'}"
          @click="form.putType = 'refBefore'">品牌</span>
        <span :class="{active: form.putType == 'refafter'}"
          @click="form.putType = 'refafter'">线下场馆</span>
        <span>艺人</span>
        <span>KOL</span>
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
              <DatePicker v-model="form.date" format="yyyy/MM/dd" type="daterange"
                placement="bottom-end" placeholder="请输入投放开始日期和结束日期"></DatePicker>
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

      <FormItem label="广告影片">
        <Select v-model="form.advType" class="select-adv-list"
          style="width:400px;margin-left:-35px" placeholder="请选择影片">
          <Option :value="item.id" :key="item.id" v-for="item in advTypeList">{{item.name}}</Option>
        </Select>
      </FormItem>

      <FormItem label="投放形式" class="form-item-xingshi">
        <RadioGroup v-model="form.xingshi" type="button" class="orient-tabs">
          <Radio v-for="it in xingshiList" :key="it.key" :label="it.key"
            class="target-type">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="总预算" class="form-item-yusuan" :label-width="60"
        v-if="form.xingshi == 1">
        <CheckboxGroup v-model="form.yusuan" class="item-radio-top">
          <Checkbox v-for="it in yusuanList" :key="it.key" :label="it.key"
            class="check-item">{{it.text}}</Checkbox>
        </CheckboxGroup>
      </FormItem>

      <FormItem label="权益" class="form-item-quanyi" :label-width="60"
        v-if="form.xingshi == 2">
        <CheckboxGroup v-model="form.quanyi" class="item-radio-top">
          <Checkbox v-for="it in quanyiList" :key="it.key" :label="it.key"
            class="check-item">{{it.text}}</Checkbox>
        </CheckboxGroup>
      </FormItem>

      <h3 class="layout-title">投放定向</h3>

      <FormItem label="定向地区" class="form-item-type">
        <RadioGroup v-model="form.areaType" class="item-radio-top">
          <Radio v-for="it in areaTypeList" :key="it.key"
            :label="it.key" class="radio-item">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="线级" class="form-item-xianji" v-if="form.areaType == 4">
        <CheckboxGroup v-model="form.xianji" class="item-radio-top">
          <Checkbox v-for="it in xianjiList" :key="it.key" :label="it.key"
            class="check-item">{{it.text}}</Checkbox>
        </CheckboxGroup>
      </FormItem>

      <div class="city-wrap">
        <CitySelect/>
      </div>

      <div class="people-wrap">
        <h3 class="group-title">品牌受众</h3>

        <FormItem label="品牌类型" class="form-item-pptype">
          <RadioGroup v-model="form.pptype" class="item-radio-top">
            <Radio v-for="it in pptypeList" :key="it.key" :label="it.key"
              class="radio-item">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="受众性别" class="form-item-sex">
          <RadioGroup v-model="form.sex" class="item-radio-top">
            <Radio v-for="it in sexList" :key="it.key" :label="it.key"
              class="radio-item">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="受众年龄" class="form-item-age">
          <CheckboxGroup v-model="form.age" class="item-radio-top">
            <Checkbox v-for="it in ageStageList" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem label="消费能力" class="form-item-nengli">
          <CheckboxGroup v-model="form.nengli" class="float item-radio-top">
            <Checkbox v-for="it in nengliList" :key="it.key"
              :label="it.key" class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </div>

      <FormItem label="广告形式" class="form-item-ggtype">
        <CheckboxGroup v-model="form.ggtype" class="item-radio-top">
          <Checkbox v-for="it in ggtypeList" :key="it.id"
            :label="it.id" class="ggtype-check">
            <img :src="it.url" class="ggtype-img">
            <h4 class="ggtype-name">{{it.name}}</h4>
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>

    <div class="btn-center">
      <Button type="primary" class="button-ok" @click="handleScheme">生成投放方案</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { sexList, ageStageList, filmHobbyList,
  areaTypeList, filmList as allFilmList, Film } from './types'
import CitySelect from './citySelect.vue'
import { systemSwitched } from '@/util/globalEvents'
import event from '@/fn/event'

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
    age: [0],
    filmHobby: [0],

    // 单个影片
    filmName: '',
    filmType: [0],
    filmIdSelected: 0,

    // 新增的
    xingshi: 1,
    yusuan: [],
    quanyi: [1, 2],
    xianji: [],
    nengli: [0],
    pptype: 1,
    ggtype: [],
  }

  xingshiList = [
    { key: 1, text: '广告投放' },
    { key: 2, text: '联合推广' },
  ]

  yusuanList = [
    { key: 1, text: '5万以下' },
    { key: 2, text: '5-10万' },
    { key: 3, text: '10-15万' },
    { key: 4, text: '15-20万' },
    { key: 5, text: '20-30万' },
    { key: 6, text: '30-50万' },
    { key: 7, text: '50万以上' },
  ]

  quanyiList = [
    { key: 1, text: '授权IP' },
    { key: 2, text: '发放优惠券' },
  ]

  pptypeList = [
    { key: 1, text: '快消品' },
    { key: 2, text: '餐饮' },
    { key: 3, text: '手机3C' },
    { key: 4, text: '家居用品' },
    { key: 5, text: '玩具礼品' },
  ]

  nengliList = [
    { key: 0, text: '不限' },
    { key: 1, text: '白领' },
    { key: 2, text: '金领' },
    { key: 3, text: '粉领' },
    { key: 4, text: '灰领' },
    { key: 5, text: '蓝领' },
    { key: 6, text: '绿领' },
  ]

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
    { key: 2, text: '按单部影片' }
  ]

  areaTypeList = [
    { key: 0, text: '不限' },
    { key: 1, text: '按区域' },
    { key: 2, text: '按省份' },
    { key: 3, text: '按城市' },
    { key: 4, text: '按线级' },
  ]

  xianjiList = [
    { key: 1, text: '一线城市' },
    { key: 2, text: '二线城市' },
    { key: 3, text: '三线城市' },
    { key: 4, text: '四线城市' },
    { key: 5, text: '五线城市' },
  ]

  sexList = sexList

  ageStageList = ageStageList

  filmHobbyList = filmHobbyList

  allFilmList = allFilmList

  get foundFilmList() {
    return this.allFilmList
  }

  advTypeList = [
    { id: 1, name: '《阿丽塔：战斗天使》 2019-02-22 上映' },
    { id: 2, name: '《掠食城市》 2019-01-18 上映' },
    { id: 3, name: '《新喜剧之王》 2019-02-05 上映' }
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

  // tslint:disable:max-line-length
  ggtypeList = [
    { id: 1, name: '易拉宝', url: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgvi02i893rg00800470.png?x-oss-process=image/resize,w_180,h_300' },
    { id: 2, name: '外卖袋', url: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgvi02i893rg00800460.png?x-oss-process=image/resize,w_180,h_300' },
    { id: 3, name: '外卖盒', url: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgvi02a893rg0080045g.png?x-oss-process=image/resize,w_180,h_300' },
    { id: 4, name: '宣传单', url: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgvi02i893rg0080046g.png?x-oss-process=image/resize,w_180,h_300' },
    { id: 5, name: '纸巾盒', url: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgvi02i893rg0080047g.png?x-oss-process=image/resize,w_180,h_300' },
    { id: 6, name: '餐桌贴纸', url: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgvi02i893rg00800480.png?x-oss-process=image/resize,w_180,h_300' },
  ]
  // tslint:enable:max-line-length

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
    const corp = this.form.advType || 1
    this.$router.push({ name: 'pop-plan-scheme-two', params: {
      id: String(id),
      corp: String(corp),
    }})
  }

  selectFilm(film: Film) {
    this.form.filmIdSelected = film.id
  }

  mounted() {
    // const handler = () => {
    //   this.$router.push({ name: 'pop-plan' })
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
  }

  @Watch('form.nengli', { deep: true })
  watchNengli(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.nengli = newValue
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
  user-select: none;
}
.form-item-type {
  margin-top: 35px;
}
.orient-tabs {
  margin-top: 4px;
}
.city-wrap {
  width: 790px;
  margin-left: 70px;
}
.item-radio-top {
  margin-top: 3px;
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
  .select-adv-type {
    span {
      display: inline-block;
      width: 155px;
      height: 50px;
      line-height: 47px;
      text-align: center;
      color: #444;
      margin-right: 10px;
      margin-top: -3px;
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

.form-item-yusuan,
.form-item-quanyi {
  margin-left: 170px !important;
  margin-top: -18px !important;
  background-color: #f2f2f2;
  padding: 5px 0 5px 16px;
  .item-radio-top {
    margin-top: 1px;
  }
  .check-item {
    background-color: #fff;
  }
  .check-item.ivu-checkbox-wrapper-checked {
    background-color: @c-button;
  }
}
.select-adv-list {
  /deep/ .ivu-select-selection {
    width: 100% !important;
  }
}

.form-item-pptype,
.form-item-sex {
  .radio-item {
    min-width: 62px;
  }
}

.ggtype-check {
  margin: 8px 15px 0 0;
  padding: 2px;
  /deep/&.ivu-checkbox-wrapper-checked {
    background-color: @c-button;
    .ggtype-name {
      color: #fff;
    }
  }
  /deep/ .ivu-checkbox {
    display: none;
  }
}
.ggtype-img {
  width: 90px;
  height: 150px;
}
.ggtype-name {
  text-align: center;
  margin-top: -8px;
  line-height: 30px;
  font-weight: normal;
}
</style>
