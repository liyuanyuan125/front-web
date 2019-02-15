<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">创建广告计划 > 
      <span v-if="!$route.params.id">新建</span>
      <span v-else>编辑</span>广告计划
    </h2>

    <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="edit-input forms">
      <h3 class="layout-title">基本信息</h3>
      <!-- 投放类型 -->
      <FormItem label="投放类型" class="item-top select-adv-type">
        <span class="put-active" v-for="item in deliveryTypeList" :key="item.text">
          <img src="./assets/icon3.png"/>
        {{item.text}}</span>
      </FormItem>

      <div class="clear-f sel-header">
        <FormItem class="float-left" label="广告计划名称" prop="name">
          <Input class="input-media" v-model="form.name" placeholder="请输入广告计划名称"></Input>
        </FormItem>
        <FormItem style="margin-left:0px" class="float-right pr30" label="关联广告片">
          <Select class="input-media" v-model="form.videoId" filterable clearable>
            <Option v-if="item.status == 4" v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </div>

      <div class="clear-f" v-if="form.videoId">
        <FormItem class="float-left" label="广告片规格">
          <div class="xad input-media"><span>{{specification}}s</span></div>
        </FormItem>
        <FormItem class="float-right pr30" style="margin-left:0px" label="选择客户">
          <div class="xad input-media"><span>{{customerName}}</span></div>
        </FormItem>
      </div>

      <!-- 投放排期 -->
      <h3 @click="dateSet(1)" class="layout-title">投放排期</h3>
      <FormItem label="定向类型" class="form-item-type">
        <Tags v-model="dateType" :tagMess = 'dateObj' />
      </FormItem>
      <!-- 投放排期 自定义时间 -->
      <div class="clear-f" key="save" v-if="dateType == 1">
        <FormItem class="tag-date float-left" label="开始时间" prop="beginDate">
          <DatePicker type="date" @on-change="cinemaFind" v-model="form.beginDate" :options="startDate" placeholder="请选择开始时间"></DatePicker>
        </FormItem>
        <FormItem class="tag-date float-right pr130" label="结束时间" prop="endDate">
          <DatePicker type="date" @on-change="cinemaFind" v-model="form.endDate" :options="endDate" placeholder="请选择结束时间"></DatePicker>
        </FormItem>
      </div>

      <!-- 投放排期 按热门档期 -->
      <div v-else key="edited" class="checkd">
        <div class="clear-f">
          <FormItem class="tag-date float-left" label="选择年份" prop="year">
            <DatePicker type="year" v-model="form.year" @on-change="diaries()" placeholder="请选择年份"></DatePicker>
          </FormItem>
          <FormItem class="tag-date float-right pr130" label="选择档期" prop="calendarId">
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
        <span :class="['put', putType== item.key ? 'put-active' : '']" v-for="(item, index) in directionTypeList" @click="putActive(item.key)" :key="item.key">
          <b :class="`put-icon${index + 1}`"></b>
          {{item.text}}
        </span>
      </FormItem>

      <!-- 投放定向 标准定向 -->
      <div v-if="putType == 1">
        <FormItem label="投放地区" class="form-item-type">
          <radioTab v-model="form.throwInAreaType" :tagMess="areaTypeList" />
        </FormItem>

        <div class="city-wrap mb20">
          <AreaPane v-model="form.ids" :type="form.throwInAreaType"
            :boxLevelList="boxLevelList" @statsChange="onThrowInStatsChange"/>
        </div>

        <FormItem v-if="index != 3" v-for="(item, index) in tags" :key="index" :label="item.name" :class="['form-item-age', index == 0 ? 'pb3' : '']">
          <radioTab v-if="index != 0" v-model="cinema[item.code]" :tagMess="item.values" />
          <CheckboxGroup v-else v-model="cinema[item.code]" class="item-radio-top">
            <Checkbox  :class="index == 0 ? 'check-item form-item-first' : 'check-item'" :label="0">不限</Checkbox>
            <Checkbox  v-for="it in item.values" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem label="推荐影片" class="form-item-type-sort">
          <ul class="film-list">
            <li v-for="(it, index) in normCinema" :key="it.id"
              :class="['film-item']">
              <div :class="['film-cover-box']">
                <b :class="`img-rank${index + 1}`"></b>
                <img :src="it.mainPicUrl" class="film-cover">
                <div class="film-date">上映时间：{{formatDate(it.openTime)}}</div>
              </div>
              <h4 class="film-name">{{it.name}}</h4>
              <div class="film-tags">{{it.type.join(' / ')}}</div>
            </li>
          </ul>
        </FormItem>
      </div>

      <!-- 投放定向 按单部影片 -->
      <div v-else class="single-wrap">
        <SingCinema v-model="singleObject" :data="tags[0]" />
        <FormItem label="地域偏好" class="form-item-age">
          <CheckboxGroup v-model="form.tagTypeCode" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox v-if="it.controlStatus != 2" v-for="it in tags[3].values" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </div>

      <!-- 预算与计费 -->
      <h3 class="layout-title">预算与计费</h3>
      <FormItem label="总预算/￥" style="margin-top: 20px" class="form-cell">
        <radioTab typeName='1' v-model="form.budgetCode" width="100" :tagMess="tagCodes" />
        <FormItem v-if="form.budgetCode == '00-00'" prop="budgetAmount" class="money">
          <Input v-model="form.budgetAmount" placeholder="请输入自定义金额"/>万
        </FormItem>
      </FormItem>
      <FormItem label="计算方式">
        <radioTab v-model="form.status" typeName='1' width="100" :tagMess="billingModeList" />
      </FormItem>
    </Form>

    <div class="btn-center">
      <Button type="primary" class="button-ok" @click="createSolutions('dataform')">生成投放方案</Button>
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
import { info } from '@/ui/modal.ts'
import { scrollToError } from '@/util/form'
import radioTab from './radioTab.vue'
import { drairesList, beforePlan, advertising, advertDetail, cinemaList } from '@/api/popPlan.ts'
import moment from 'moment'
import SingCinema from './singcinema.vue'
import AreaPane, { Stats } from './components/areaPane'
import { formatYell } from '@/util/validateRules'
import { planDefault, queryRelevanceList } from '@/api/plan'
import { clean } from '@/fn/object'

const timeFormat = 'YYYY-MM-DD'
const timeFormats = 'YYYYMMDD'

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
    SingCinema,
    AreaPane
  }
})
export default class Main extends ViewBase {
  tagColor = '#fe8135'
  tabs = 1
  ding = 0
  item: any = null
  selectTab = 'tabs1'
  auctionName = ''
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

  // 影片列表
  normCinema: any = []
  singleCinema: any = []

  advertisingName: any = ''
  // 选择档期的开始时间 结束时间
  airiesList: any = []
  beginDateId = ''
  endDateId = ''

  // 关联广告片
  adverList: any = []
  specification: any = ''
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

  singleObject: any = {}
  // 时间格式
  dateType: number = 1
  startDate: any = {
    disabledDate: (date: any) => {
      return date && (this.form.endDate && date.valueOf() > new Date(this.form.endDate).getTime())
      || date.valueOf() < Date.now()
    }
  }
  endDate: any = {
    disabledDate: (date: any) => {
      return date && this.form.beginDate && date.valueOf() < new Date(this.form.beginDate).getTime()
      || date.valueOf() < Date.now()
    }
  }

  // 标准投放影片类型
  cinema: any = {
    MOVIE_TYPE: [ 0 ],
    PLAN_GROUP_AGE: 0,
    PLAN_GROUP_SEX: 0
  }

  // 单步影片投放类型
  formCinema: any = {
    showTime: [],
    types: [],
    name: ''
  }

  form = {
    putType: 'refBefore',
    name: '',
    videoId: null,
    adverId: null,
    year: '',
    calendarId: '',
    beginDate: '',
    endDate: '',
    advType: '',
    date: '',
    budgetAmount: null,
    status: 1,
    budgetCode: '00-50',
    bill: '按人次计费',
    custom: '',
    venueType: [],
    tagTypeCode: [0],

    // 定向类型
    type: 1,
    sex: 0,
    age: [0],
    filmHobby: [0],

    // 投放地区类型
    throwInAreaType: 0,
    // 投放地区所选 id 列表
    ids: [],

    // 单个影片
    filmName: '',
    filmType: [0],
    filmIdSelected: 0,
  }

  citySel = false
  calendarName = ''
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

  boxLevelList = []

  // 投放统计信息，要在第二步显示
  throwInStats = {} as Stats

  get rule() {
    const moneyvalidator = ( rules: any, value: any, callback: any) => {
      if (this.form.budgetCode != '00-00') {
        callback()
      } else {
        const msg: any = value + ''
        const reg = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
        if (msg.length == 0) {
          callback(new Error('请输入指定金额'))
        } else if (!reg.test(msg)) {
          callback(new Error('金额格式不正确'))
        } else {
          callback()
        }
      }
    }
    return {
      name: [
        { required: true, message: '请输入广告片名称', trigger: 'change' }
      ],
      videoId: [
        { required: true, message: '请选择关联广告片', trigger: 'change', type: 'number' }
      ],
      beginDate: [
        { required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }
      ],
      year: [
        { required: true, type: 'date', message: '请选择年份', trigger: 'change' }
      ],
      endDate: [
        { required: true, type: 'date', message: '请选择结束时间', trigger: 'change' }
      ],
      calendarId: [
        { required: true, message: '请选择档期', trigger: 'change', type: 'number' }
      ],
      budgetAmount: [
        { validator: moneyvalidator }
      ]
    }
  }
  get foundFilmList() {
    return this.allFilmList
  }

  created() {
    this.beforePlan()
    this.beginAdver()
    this.cinemaFind()
    this.editId()
  }

  async editId() {
    if (!this.$route.params.id) {
      return
    }
    try {
      const id = this.$route.params.id
      const {
        data: {
          item,
          movieList
        }
      } = await planDefault(id)
      this.item = item
      this.form.name = item.name
      this.form.videoId = item.videoId

      // 投放区域Id
      if (item.calendarId) {
        this.dateType = 2

        ; (this.form.year as any) = new Date(item.calendarYear + 1, 0, 0)
        this.diaries(item.calendarId)
      } else {
        this.form.beginDate = this.formatDate(item.beginDate)
        this.form.endDate = this.formatDate(item.endDate)
      }
      // 投放区域类型
      if (item.directionType == 2) {
        this.putType = 2
        this.singleObject = movieList[0] || []
        if (item.deliveryGroups[0].text == 'ALL') {
          this.form.tagTypeCode = [0]
        } else {
          this.form.tagTypeCode = item.deliveryGroups.map((it: any) => it.text)
        }
      } else {
        this.form.throwInAreaType = item.throwInAreaType
        ; (this.form.ids as any) = item.throwInAreaIds.length > 0 ? item.throwInAreaIds.split(',') : []
        const sex: any = item.deliveryGroups.filter((it: any) => it.tagTypeCode == 'PLAN_GROUP_SEX')
        const age: any = item.deliveryGroups.filter((it: any) => it.tagTypeCode == 'PLAN_GROUP_AGE')
        const types: any = item.deliveryGroups.filter((it: any) => it.tagTypeCode == 'MOVIE_TYPE')
        this.cinema.MOVIE_TYPE = types[0].text != 'ALL' ? types.map((items: any) => items.text) : [0]
        this.cinema.PLAN_GROUP_AGE = age[0].text != 'ALL' ? age[0].text : 0
        this.cinema.PLAN_GROUP_SEX = sex[0].text != 'ALL' ? sex[0].text : 0
      }
      this.form.budgetCode = item.budgetCode
      if (item.budgetCode == '00-00') {
        this.form.budgetAmount = item.budgetAmount
      }
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }

  formatDate(data: any) {
    return moment(data).format(timeFormat)
  }

  scrollToError() {
    const form = this.$refs.dataform as any
    this.$nextTick(() => scrollToError(form))
  }

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
          statisticsResults,
          boxLevelList
        }
      } = await beforePlan()
      this.billingModeList = this.filtertion(billingModeList)
      this.deliveryTypeList = this.filtertion(deliveryTypeList)
      this.directionTypeList = this.filtertion(directionTypeList)
      this.statusList = this.filtertion(statusList)
      this.tags = tags
      this.statisticsResults = statisticsResults
      const cell = tagCodes.shift()
      this.typeList = this.filtertion(typeList)
      this.tagCodes = [ ...tagCodes, cell]
      this.boxLevelList = boxLevelList
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
      this.advertisingName = item.name
      this.specification = item.specification
      this.customerName = item.customerName
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 影片列表查询
  async cinemaFind() {
    if (this.putType == 1) {
      let type: any = this.cinema.MOVIE_TYPE
      if ( this.cinema.MOVIE_TYPE.includes(0) ) {
        type = []
      }
      const times: any = {}
      if (this.dateType == 1) {
        times.startTime = this.form.beginDate ? Number(moment(this.form.beginDate).format(timeFormats)) : ''
        times.endTime = this.form.endDate ? Number(moment(this.form.endDate).format(timeFormats)) : ''
      } else {
        times.startTime = this.beginDateId ? Number(moment(this.beginDateId).format(timeFormats)) : ''
        times.endTime = this.endDateId ? Number(moment(this.endDateId).format(timeFormats)) : ''
      }
      try {
        const {
          data: {
            data: {
              items
            }
          }
        } = await cinemaList(clean({
          types: type.join(','),
          pageSize: 3,
          ...times
        }))
        this.normCinema = items
      } catch (ex) {
        this.handleError(ex)
      }
    } else {

    }
  }

  // 过滤未知
  filtertion(data: any) {
    const list = data.filter((it: any) => it.key != 0)
    return list
  }

  // 查询档期
  async diaries(val?: any) {
    if (this.form.year) {
      const year = new Date(this.form.year).getFullYear()
      const {
        data: {
          items
        }
      } = await drairesList({years: year})
      this.airiesList = items || []
      this.form.calendarId = val || ''
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

  async createSolutions(dataform: any) {
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) {
      return this.scrollToError()
    }

    const query = {
      deliveryType: 1,
      name: this.form.name,
      videoId: this.form.videoId ? this.form.videoId : null,
      specification: this.specification,
      customerName: this.customerName,
      advertisingName: this.advertisingName,
      billingMode: this.form.status,
      budgetCode: this.form.budgetCode,
      budgetAmount: this.form.budgetCode == '00-00' ? this.form.budgetAmount : ''
    }

    // 排期
    let schedule: any = {}
    if (this.dateType == 1) {
      schedule = {
        beginDate: Number(moment(this.form.beginDate).format(timeFormats)),
        endDate: Number(moment(this.form.endDate).format(timeFormats))
      }
    } else {
      schedule = {
        beginDate: Number(moment(this.beginDateId).format(timeFormats)),
        endDate: Number(moment(this.endDateId).format(timeFormats)),
        calendarId: this.form.calendarId,
        calendarName: this.calendarName
      }
    }

    // 投放定向
    let direction: any = {}
    if (this.putType == 1) {
      if (this.form.throwInAreaType != 0 && this.form.ids.length < 1) {
        info('请选择投放区域')
        return
      }
      direction = {
        directionType: this.putType,
        ids: this.form.ids,
        throwInAreaType: this.areaTypeList.filter((it: any) => this.form.throwInAreaType == it.key),
        deliveryGroups: [
          {
            tagTypeCode: 'MOVIE_TYPE',
            text: this.cinema.MOVIE_TYPE.includes(0) ? [] : [...this.cinema.MOVIE_TYPE]
          },
          {
            tagTypeCode: 'PLAN_GROUP_AGE',
            text: this.cinema.PLAN_GROUP_AGE == 0 ? [] : [this.cinema.PLAN_GROUP_AGE]
          },
          {
            tagTypeCode: 'PLAN_GROUP_SEX',
            text: this.cinema.PLAN_GROUP_SEX == 0 ? [] : [this.cinema.PLAN_GROUP_SEX]
          }
        ]
      }
    } else {
      if (!this.singleObject.id || this.singleObject.id.length != 1) {
        info('请选择一部影片')
        return
      }
      direction = {
        directionType: this.putType,
        deliveryGroups: [
          {
            tagTypeCode: 'MOVIE_TYPE',
            text: this.cinema.MOVIE_TYPE.includes(0) ? [] : [...this.formCinema.types]
          }
        ],
        deliveryMovies: this.singleObject.id,
        tagTypeCode: this.form.tagTypeCode.includes(0) ? [] : this.form.tagTypeCode
      }
    }
    let addObject = {
      ...query,
      ...schedule,
      ...direction,
      throwInStats: this.throwInStats,
    }
    if (this.$route.params.id) {
      addObject = {
        ...addObject,
        id: this.$route.params.id
      }
    }
    const index: any = 'pop_plan_edit_' + Math.floor(Math.random() * 1000 + 1)
    sessionStorage.setItem(`${index}`, JSON.stringify(addObject))
    this.$router.push({ name: 'pop-plan-scheme', params: { id: index}})
  }

  onThrowInStatsChange(stats: Stats) {
    this.throwInStats = stats
  }

  mounted() {
  }

  @Watch('cinema.MOVIE_TYPE', { deep: true })
  watchMOVIE_TYPE(value: any, oldValue: any) {
    // 不限与其他项互斥
    if (value.length > 3) {
      info('电影类型最多选3项')
      this.cinema.MOVIE_TYPE = value.slice(0, 3)
    } else {
      keepExclusion(value, oldValue, 0, newValue => {
        this.cinema.MOVIE_TYPE = newValue
      })
      if (value.length == 0) {
        this.cinema.MOVIE_TYPE = [0]
      }
      this.cinemaFind()
    }
  }

  @Watch('cinema.PLAN_GROUP_AGE', { deep: true })
  watchPLAN_GROUP_AGE(value: any, oldValue: any) {
    // 不限与其他项互斥
      this.cinemaFind()
  }

  @Watch('cinema.PLAN_GROUP_SEX', { deep: true })
  watchPLAN_GROUP_SEX(value: any, oldValue: any) {
    // 不限与其他项互斥
      this.cinemaFind()
  }

  @Watch('form.tagTypeCode', { deep: true })
  watchformtagTypeCode(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    if (value.length > 3) {
      info('地域偏好最多选3项')
      this.form.tagTypeCode = value.slice(0, 3)
    } else {
      keepExclusion(value, oldValue, 0, newValue => {
        this.form.tagTypeCode = newValue
      })
      if (value.length == 0) {
        this.form.tagTypeCode = [0]
      }
    }
    // keepExclusion(value, oldValue, 0, newValue => {
    //   this.form.tagTypeCode = newValue
    // })
    // if (value.length == 0) {
    //   this.form.tagTypeCode = [0]
    // }
  }

  @Watch('form.filmType', { deep: true })
  watchfilmType(value: number[], oldValue: number[]) {
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.filmType = newValue
    })
  }

  // 观测广告片Id
  @Watch('form.videoId', { deep: true })
  watchvideoId(val: any) {
    if (val) {
      this.adverDetail(val)
    } else {
      this.advertisingName = ''
      this.specification = ''
      this.customerName = ''
    }
  }

  // 观测档期Id
  @Watch('form.calendarId', { deep: true })
  watchcalendarId(val: any) {
    if (val) {
      this.beginDateId = this.formatTime(this.airiesList.filter((it: any) => it.id == val)[0].beginDate)
      this.endDateId = this.formatTime(this.airiesList.filter((it: any) => it.id == val)[0].endDate)
      this.calendarName = this.airiesList.filter((it: any) => it.id == val)[0].name
      if (this.putType == 1) {
        this.cinemaFind()
      }
    } else {
      this.beginDateId = ''
      this.endDateId = ''
      this.calendarName = ''
      this.cinemaFind()
    }
  }
}
</script>

<style lang="less" scoped>
@import './ggadd.less';

.city-wrap {
  margin-top: -12px;
  /deep/ .input-search .ivu-input-icon {
    height: 32px;
    line-height: 32px;
  }
  /deep/ .ivu-select-item {
    line-height: normal !important;
    height: auto !important;
  }
}
</style>
