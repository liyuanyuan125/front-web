<template>
  <div class="page home-bg">
    <h2 class="layout-nav-title">广告计划 > 编辑广告计划</h2>
    <Form
      :model="form"
      ref="dataform"
      label-position="left"
      :rules="rule"
      :label-width="100"
      class="edit-input"
    >
      <h3 class="layout-title">基本信息</h3>
      <FormItem label="投放类型" class="item-top">
        <span class="edit-adv-type">{{deliveryType(item.deliveryType)}}</span>
      </FormItem>
      <div class="flex-box">
        <FormItem label="广告计划名称" prop="name">
          <Input v-model="form.name" placeholder="请输入广告计划名称"/>
        </FormItem>
        <FormItem label="关联广告片" prop="videoId">
          <Select v-model="form.videoId" clearable>
            <Option v-for="item in videoIDList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </div>
      <div class="flex-box">
        <FormItem label="广告片规格">
          <span class="edit-item-text">{{form.specification}}s</span>
          <!-- <Input v-model="form.specification" placeholder="请输入广告片规格" /> -->
        </FormItem>
        <FormItem label="选择客户">
          <span class="edit-item-text">{{form.customerName}}</span>
          <!-- <Input v-model="form.customerName" placeholder="请输入客户" /> -->
        </FormItem>
      </div>

      <h3 class="layout-title">投放排期</h3>
      <FormItem label="定向类型" class="form-item-type">
        <Tags v-model="dateType" :tagMess="dateObj"/>
      </FormItem>

      <!-- 投放排期 自定义时间 -->
      <div class="flex-box" key="save" v-if="dateType == 1">
        <FormItem class="tag-date float-left" label="开始时间" prop="beginDate">
          <DatePicker type="date" v-model="form.beginDate" placeholder="请选择开始时间"></DatePicker>
        </FormItem>
        <FormItem class="tag-date float-right pr130" label="结束时间" prop="endDate">
          <DatePicker type="date" v-model="form.endDate" placeholder="请选择结束时间"></DatePicker>
        </FormItem>
      </div>
      <!-- 投放排期 按热门档期 -->
      <div v-else key="edited" class="checkd">
        <div class="flex-box">
          <FormItem class="tag-date float-left" label="选择年份" prop="year">
            <DatePicker type="year" v-model="form.year" @on-change="diaries()" placeholder="请选择年份"></DatePicker>
          </FormItem>
          <FormItem class="tag-date float-right pr130" label="选择档期" prop="calendarId">
            <Select
              style="width: 300px"
              :disabled="!form.year"
              v-model="form.calendarId"
              filterable
              clearable
            >
              <Option
                v-for="(item, index) in airiesList"
                :value="item.id"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="flex-box">
          <FormItem class="tag-date float-left" label="开始时间">
            <Input disabled v-model="beginDateId" placeholder/>
          </FormItem>
          <FormItem class="tag-date float-right pr130" label="结束时间">
            <Input disabled v-model="endDateId" placeholder/>
          </FormItem>
        </div>
      </div>

      <!-- 投放定向 -->
      <h3 class="layout-title">投放定向</h3>
      <FormItem label="投放类型" class="item-top select-adv-type">
        <span
          :class="['put', putType== item.key ? 'put-active' : '']"
          v-for="(item, index) in directionTypeList"
          v-if="index != 0"
          @click="putActive(item.key)"
          :key="item.key"
        >
          <b :class="`put-icon${index}`"></b>
          {{item.text}}
        </span>
      </FormItem>

      <!-- 投放定向 标准定向 -->
      <div v-if="putType == 1">
        <FormItem label="投放地区" class="form-item-type">
          <radioTab v-model="form.throwInAreaType" :tagMess="areaTypeList"/>
        </FormItem>

        <div class="city-wrap mb20">
          <AreaPane
            v-model="form.ids"
            :type="form.throwInAreaType"
            :boxLevelList="boxLevelList"
            @statsChange="onThrowInStatsChange"
          />
        </div>

        <FormItem
          v-if="index != 3"
          v-for="(item, index) in tags"
          :key="index"
          :label="item.name"
          :class="['form-item-age', index == 0 ? 'pb3' : '']"
        >
          <radioTab v-if="index != 0" v-model="cinema[item.code]" :tagMess="item.values"/>
          <CheckboxGroup v-else v-model="cinema[item.code]" class="item-radio-top">
            <Checkbox
              :class="index == 0 ? 'check-item form-item-first' : 'check-item'"
              :label="0"
            >不限</Checkbox>
            <Checkbox
              v-for="it in item.values"
              :key="it.key"
              :label="it.key"
              class="check-item"
            >{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem label="推荐影片" class="form-item-type-sort">
          <ul class="film-list">
            <li v-for="(it, index) in normCinema" :key="it.id" :class="['film-item']">
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
    </Form>
    <div class="btn-center">
      <Button type="primary" class="button-ok" @click="createSolutions('dataform')">生成投放方案</Button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info } from '@/ui/modal'
import { planDefault, queryRelevanceList } from '@/api/plan'
import { drairesList } from '@/api/popPlan.ts'
import { scrollToError } from '@/util/form'
import { formatYell } from '@/util/validateRules'
import {
  cityList,
  City,
  sexList,
  ageStageList,
  filmHobbyList,
  areaTypeList,
  filmList as allFilmList,
  Film
} from '../types'
import AreaPane, { Stats } from '../components/areaPane'
import Tags from '../tag.vue'
import radioTab from '../radioTab.vue'

@Component({
  components: {
    Tags,
    radioTab
  }
})
export default class EditPlan extends ViewBase {
  item: any = []
  deliveryTypeList: any = []

  // 关联广告片
  videoIDList: any = []
  // 投放定向 投放类型
  directionTypeList: any = []

  putType = 1

  form: any = {
    putType: 'refBefore',
    name: '',
    videoId: '',
    specification: '',
    customerName: '',
    beginDate: '',
    endDate: '',
    year: '',
    calendarId: '',
    budgetAmount: '',

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
    filmIdSelected: 0
  }

  areaTypeList = areaTypeList

  calendarName = ''
  dateType: number = 1
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
  citySel = false
  // 是否为映前广告
  get isRefBefore() {
    return this.form.putType == 'refBefore'
  }

  // 是否为「按单部影片模式」
  get isSingle() {
    return this.isRefBefore && this.form.type == 2
  }

  // areaTypeList = areaTypeList

  sexList = sexList

  ageStageList = ageStageList

  filmHobbyList = filmHobbyList

  allFilmList = allFilmList

  boxLevelList = []

  // 投放统计信息，要在第二步显示
  throwInStats = {} as Stats

  get rule() {
    const moneyvalidator = (rules: any, value: any, callback: any) => {
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
        {
          required: true,
          message: '请选择关联广告片',
          trigger: 'change',
          type: 'number'
        }
      ],
      beginDate: [
        {
          required: true,
          type: 'date',
          message: '请选择开始时间',
          trigger: 'change'
        }
      ],
      year: [
        {
          required: true,
          type: 'date',
          message: '请选择年份',
          trigger: 'change'
        }
      ],
      endDate: [
        {
          required: true,
          type: 'date',
          message: '请选择结束时间',
          trigger: 'change'
        }
      ],
      calendarId: [
        {
          required: true,
          message: '请选择档期',
          trigger: 'change',
          type: 'number'
        }
      ],
      budgetAmount: [{ validator: moneyvalidator }]
    }
  }
  mounted() {
    this.list()
    this.queryReleList()
  }
  async list() {
    try {
      const id = this.$route.params.id
      const {
        data: { item, deliveryTypeList, directionTypeList }
      } = await planDefault(id)
      this.item = item
      this.deliveryTypeList = deliveryTypeList
      this.directionTypeList = directionTypeList
      // 默认赋值
      this.form = {
        name: item.name,
        videoId: item.videoId,
        specification: item.specification,
        customerName: item.customerName,
        beginDate: formatYell(item.beginDate, '-'),
        endDate: formatYell(item.endDate, '-'),
        year: item.calendarYear
      }
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }
  onThrowInStatsChange(stats: Stats) {
    this.throwInStats = stats
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
  deliveryType(id: any) {
    const list = this.deliveryTypeList
    if (list) {
      for (const i of list) {
        if (i.key == id) {
          return i.text
        }
      }
    }
  }
  async queryReleList() {
    try {
      const {
        data: { items }
      } = await queryRelevanceList({
        // status: 4,
        pageIndex: 1,
        pageSize: 99999
      })
      this.videoIDList = items
    } catch (ex) {
      this.handleError(ex.msg)
    }
  }

  // 查询档期
  async diaries() {
    if (this.form.year) {
      const year = new Date(this.form.year).getFullYear()
      const {
        data: { items }
      } = await drairesList(year)
      this.airiesList = items || []
    }
  }
  putActive(id: any) {
    this.putType = id
  }
  scrollToError() {
    const form = this.$refs.dataform as any
    this.$nextTick(() => scrollToError(form))
  }

  async createSolutions(dataform: any) {
    const volid = await (this.$refs[dataform] as any).validate()
    if (!volid) {
      return this.scrollToError()
    }
    // const query = {
    //   deliveryType: 1,
    //   name: this.form.name,
    //   videoId: this.form.videoId,
    //   specification: this.specification,
    //   customerName: this.customerName,
    //   advertisingName: this.advertisingName,
    //   billingMode: this.form.status,
    //   budgetCode: this.form.budgetCode,
    //   budgetAmount: this.form.budgetCode == '00-00' ? this.form.budgetAmount : ''
    // }
  }
  // 观测档期Id
  @Watch('form.calendarId', { deep: true })
  watchcalendarId(val: any) {
    if (val) {
      this.beginDateId = this.formatTime(
        this.airiesList.filter((it: any) => it.id == val)[0].beginDate
      )
      this.endDateId = this.formatTime(
        this.airiesList.filter((it: any) => it.id == val)[0].endDate
      )
      this.calendarName = this.formatTime(
        this.airiesList.filter((it: any) => it.id == val)[0].name
      )
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '../ggadd.less';

.ivu-form-item {
  padding-left: 30px;
  color: @c-text;
  /deep/ .ivu-select-selection,
  .ivu-input-wrapper input {
    width: 350px;
  }
}
/deep/ .ivu-form-item-content .ivu-input-wrapper {
  width: 350px;
  input {
    width: 350px;
  }
  .ivu-input-icon {
    height: 40px;
    line-height: 40px;
  }
}
.edit-item-text {
  display: inline-block;
  width: 350px;
  line-height: 40px;
}
.edit-adv-type {
  width: 160px;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  color: #fff;
  border-radius: 2px;
  text-align: center;
  padding-left: 21px;
  font-size: 14px;
  background: @c-button url('../assets/icon3.png') no-repeat 40px center;
  background-size: 16px;
}
.select-adv-type {
  span {
    display: inline-block;
    width: 160px;
    height: 40px;
    line-height: 40px;
    border-radius: 2px;
    text-align: center;
    color: #444;
    font-size: 14px;
    cursor: pointer;
    background: #f7f7f7;
    .put-icon1 {
      display: inline-block;
      width: 20px;
      height: 18px;
      margin-bottom: -5px;
      background: url('../assets/icon1.png') no-repeat;
    }
    .put-icon2 {
      display: inline-block;
      width: 20px;
      height: 18px;
      margin-bottom: -5px;
      background: url('../assets/icon2.png') no-repeat;
    }
  }
  .put-active {
    line-height: 40px;
    background: #fb8135;
    color: #fff;
    .put-icon1 {
      display: inline-block;
      width: 20px;
      height: 18px;
      margin-bottom: -5px;
      background: url('../assets/iconcheck1.png') no-repeat;
    }
    .put-icon2 {
      display: inline-block;
      width: 20px;
      height: 18px;
      margin-bottom: -5px;
      background: url('../assets/iconcheck2.png') no-repeat;
    }
  }
}
</style>


