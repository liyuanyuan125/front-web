<template>
  <div class="">
    <div class='pages'></div>
    <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="form">
      <Row>
        <Col span="14" offset="3" class="adver-name select-adv-type">
          <FormItem :show-message="!setadver" :label-width="210" label="广告计划名称:">
            <Input v-if="!setadver" style="width: 380px;border-radius: 5px"  v-model="form.name" placeholder=""></Input>
            <Input style="width: 380px;border-radius: 5px" v-model="pername" v-else></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="14" offset="3">
          <Row>
            <Col span="24">
              <Row :gutter="24" class="adver-detail">
                <Col span="17">
                  <FormItem :show-message="!setadver" :labelWidth='100' label="广告片:" :prop="setadver ? '': 'videoId'">
                    <Select v-model="form.videoId" :disabled="setadver" filterable clearable>
                      <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="6">
                  <Checkbox style="width: 180px" v-model="setadver" class="check-item check-no form-item-first">暂不设置</Checkbox>
                </Col>
              </Row>
              <Row class="adver-detail" :gutter="10">
                <Col :span="9">
                  <FormItem style="margin-left: 3px" label="广告片规格:" :labelWidth='100'>
                    <Select v-if="!setadver" :disabled="!setadver" v-model="form.specification" filterable clearable>
                      <Option v-for="(item, index) in adverList" :value="item.specification" :key="index">{{ item.specification }}</Option>
                    </Select>
                    <Select v-else v-model="query.specification"  clearable filterable>
                      <Option v-for="(item, index) in specificationList" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="9">
                  <FormItem style="margin-left: 3px" label="影片:" :labelWidth='100'>
                    <Select placeholder="请选择" v-if="!setadver" :disabled="!setadver" v-model="form.movieId" filterable clearable>
                      <Option v-for="(item, index) in adverList" :value="item.movieId" :key="index">{{ item.movieName }}</Option>
                    </Select>
                    <Select v-else v-model="query.movieId"  clearable filterable>
                      <Option v-for="(item, index) in movieList" :value="item.movieId" :key="index">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span="24">
              <Row class="adver-detail">
                <Col :span="10">
                  <FormItem label="投放排期:" class="timer" :labelWidth='100' prop="beginDate">
                    <DatePicker type="date"
                      :options="startDate"
                      v-model="form.beginDate"
                      placeholder="开始时间" style="width: 200px"></DatePicker>
                  </FormItem>
                </Col>
                <Col :span="1"><p style="text-align: center;margin-top: 8px;font-size: 16px;">至</p></Col>
                <Col :span="10">
                  <FormItem class="timer" :labelWidth='10' prop="endDate">
                    <DatePicker type="date"
                      :options="endDate"
                      v-model="form.endDate"
                      placeholder="结束时间" style="width: 200px"></DatePicker>
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span="24">
              <Row>
                <Col :span="10" style="padding-left: 0px" class="adver-schedule">
                  <FormItem label="推广预算:" :labelWidth='100' prop="budgetAmount">
                    <Input v-model="form.budgetAmount" placeholder="请输入"></Input>
                    <span class="hint">万元 </span>
                  </FormItem>
                </Col>
                <Col :span="13">
                  <div class="adver-time">
                    <p>预估曝光人次：<span>{{nums}}</span>人</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <div class="btn-center">
        <Button type="primary" class="button-ok" @click="next('dataform')">下一步,进入定向设置</Button>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { advertising, estimate, createdDraft, adverdetail, getaccounts, accoutdetail } from '@/api/popPlan.ts'
import { formatCurrency } from '@/fn/string.ts'
import { clean } from '@/fn/object.ts'
import weekDatePicker from '@/components/weekDatePicker/weekDatePicker.vue'
import moment, { relativeTimeRounding } from 'moment'
import { info } from '@/ui/modal'
// import Date from './date.vue'
import { productsList,
  brandsList } from '@/api/shopping'
import { getUser } from '@/store'
import customerList from '@/components/selectList/customerList.vue'
import brandList from '@/components/selectList/brandList.vue'
import productList from '@/components/selectList/productList.vue'
import { companyMovies } from '@/api/popFilm'

const timeFormat = 'YYYYMMDD'
@Component({
  components: {
    weekDatePicker,
    customerList,
    brandList,
    productList
  }
})
export default class Promotion extends ViewBase {
  @Prop() value!: any
  setadver: any = false
  form: any = {
    name: '',
    beginDate: null,
    endDate: null,
    budgetAmount: '',
    videoId: null,
    specification: null,
    movieId: 0
  }
  movieList: any = []
  query: any = {
    specification: null,
    movieId: 0
  }
  accountList: any = [] // 客户聊表
  specificationList: any = [] // 规格列表
  loading: any = false
  steps: any = 1
  planID: any = ''
  length = 0
  customerName = ''
  adverList: any = []
  nums: any = '0~0'
  times: any = new Date().getTime() - 86400000
  pername: any = ''
  productlist: any = []
  branidlist: any = []
  moneystep = 1
  startDate: any = {
    disabledDate: (dates: any) => {
      if (this.form.endDate) {
        const time = new Date(this.form.beginDate)
        return dates && dates.valueOf() < this.times || dates.getDay() != 4 ||
        dates.valueOf() > time
      }
      return dates && dates.valueOf() < this.times || dates.getDay() != 4
    }
  }

  endDate: any = {
    disabledDate: (dates: any) => {
      let time = this.times
      if (this.form.beginDate) {
        time = new Date(this.form.beginDate)
      }
      return dates && dates.valueOf() < time || dates.getDay() != 3
    }
  }

  creSpecificationList() {
    for ( let i = 1 ; i < 41; i ++) {
      this.specificationList.push({id: i * 15, name: i * 15})
    }
  }

  get rule() {
    const moneyvalidator = ( rules: any, value: any, callback: any) => {
      const msg: any = value + ''
      const reg = /^(?!(0[0-9]{0,}$))[0-9]+(.[0-9]+)?$/
      // if () {

      // }
      if (msg.length == 0) {
        if (!this.form.name && this.setadver == false) {
          callback(new Error('请设置广告片'))
        } else {
          callback(new Error('请输入推广预算'))
        }
      } else if (!reg.test(msg)) {
        callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }
    const video = ( rules: any, value: any, callback: any) => {
      if (this.setadver == true) {
          callback()
      } {
        if (!this.setadver && !value) {
          callback(new Error('请选择广告片'))
        } else {
          callback()
        }
      }
    }
    const msgtime = ( rules: any, value: any, callback: any) => {
      if (value[0] == '') {
        callback(new Error('请选择投放排期'))
      } else {
        const begin: any = (new Date(value[0]) as any).getTime()
        if ((begin - new Date().getTime()) <= 0 ) {
          callback(new Error('投放时间必须大于当前时间'))
        }
        if (new Date(value[0]).getDay() != 4) {
          callback(new Error('开始时间必须为周四'))
        }
        if (new Date(value[1]).getDay() != 3) {
          callback(new Error('结束时间必须为周3'))
        }
        const end: any = (new Date(value[1]) as any).getTime()
        const flag = (end - begin) / 86400000 % 7
        if (flag == 6) {
          callback()
        } else {
          callback(new Error('投放排期为7的倍数'))
        }
      }
    }
    return {
      name: [
        { required: true, message: '请设置广告片', trigger: 'change' }
      ],
      videoId: [
        { validator: video }
      ],
      budgetAmount: [
        { validator: moneyvalidator }
      ],
      specification: [
        { required: true, type: 'number', message: '不能为空', trigger: 'change' }
      ],
      beginDate: [
        { required: true, type: 'date', message: '不能为空', trigger: 'change' }
      ],
      endDate: [
        { required: true, type: 'date', message: '不能为空', trigger: 'change' }
      ]
    }
  }

  created() {
    this.init()
    this.creSpecificationList()
    this.movieSeach()
  }

  async movieSeach() {
    try {
      const { data } = await companyMovies()
      this.movieList = data || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async init() {
    (this.$Spin as any).show()
    try {
      const { data } = await advertising( clean({
        pageIndex: 1,
        pageSize: 288,
        status: this.setadver ? '' : 4,
        videoType: 2
      }) )
      this.adverList = (data.items || []).map((it: any) => {
        const movieId = it.movieId || '0'
        return {
          ...it,
          movieId
        }
      })
      this.seach()
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    }
  }

  async seachs(id: any) {
    try {
      const { data } = await accoutdetail(id)
      this.productlist = data.item ? [
        {
          id: data.item.id,
          name: data.item.name
        }
      ] : []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async seach() {
    if (!this.$route.params.setid) {
      (this.$Spin as any).hide()
      return
    }
    (this.$Spin as any).hide()
    if (this.moneystep == 2) {
      return
    }
    try {
      this.moneystep = 2
      const { data } = await adverdetail(this.$route.params.setid)
      this.form.budgetAmount = (data.item.budgetAmount / 10000) + ''
      this.steps = 2
      if (!data.item.videoId) {
        this.setadver = true
        this.pername = data.item.name
        // data.item.brandId ? this.seachs(data.item.brandId) : ''
        this.query.specification = data.item.specification || ''
        this.query.movieId = data.item.movieId || 0
      } else {
        this.form.name = data.item.name
        this.form.specification = data.item.specification
        this.form.videoId = data.item.videoId
      }
      const begin: any = new Date(this.formatDate(data.item.beginDate))
      const end: any = new Date(this.formatDate(data.item.endDate))
      this.form.beginDate = begin
      this.form.endDate = end
    } catch (ex) {
      this.handleError(ex)
    }
  }

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  // 下一步
  async next(dataform: any) {
    try {
      const volid = await (this.$refs[dataform] as any).validate()
      if (volid) {
        if ( this.setadver ) {
          if (this.pername.length == 0) {
            info('请输入广告计划名称')
            return
          }
          if (!this.query.specification) {
            info('请选择广告片规格')
            return
          }
        } else {
          if (this.form.name.length == 0) {
            info('请输入广告计划名称')
            return
          }
        }
        const query = this.setadver ? clean({
          ...this.form,
          ...this.query,
          beginDate: moment(this.form.beginDate).format(timeFormat),
          endDate: moment(this.form.endDate).format(timeFormat),
          brandId: this.query.brandId,
        }) : clean({ ...this.form,
                     beginDate: moment(this.form.beginDate).format(timeFormat),
                     endDate: moment(this.form.endDate).format(timeFormat)
        })
        const data = await createdDraft(clean({
          ...query,
          name: this.setadver ? this.pername : this.form.name,
          videoId: this.setadver ? '' : this.form.videoId,
          id: this.$route.params.setid ? this.$route.params.setid : '',
          specification: this.setadver ? this.query.specification + '' : this.form.specification + '',
          budgetAmount: Number(this.form.budgetAmount * 10000),
          advertTypeCode: 'BRAND' }, [0, '']))
        if (!this.$route.params.setid) {
          this.$router.push({
            name: 'pop-business-add',
            params: { step: '1', setid: data.data  }
          })
        } else {
          this.$router.push({
            name: 'pop-business-edit',
            params: { step: '1', setid: data.data  }
          })
        }
        this.$emit('input', {
          step: 1,
          setid: data.data
        })
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 获取金钱
  async getnums(val: any) {
    try {
      const price = this.setadver ? this.query.specification : this.form.specification
      if (!price) {
        info('请选择广告片规格')
        return
      }
      const { data } = await estimate({budgetAmount: val, specification: price })
      this.nums = `${formatCurrency(data.estimatePersonCount * 0.7, 0)}
      ~ ${formatCurrency(data.estimatePersonCount * 1.3, 0)}`
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('form.videoId')
  watchformVideoId(val: any, old: any) {
    if (val) {
      const data = this.adverList.filter((it: any) => val == it.id)
      this.form.movieId = data[0].movieId || 0
      this.form.specification = data[0].specification
      if (this.steps == 2) {
      } else {
        this.form.budgetAmount = ''
        this.form.productId = data[0].productId
        const name1 = data[0].name ? `[ ${data[0].name} ]` : ''
        const movieName = data[0].movieName ? `[ ${data[0].movieName} ]` : ''
        this.form.name = `${name1}${movieName}`
      }
      this.steps = 1
    } else {
      this.form.name = ''
    }
  }

  @Watch('form.budgetAmount')
  watchformBudgetAmount(val: any) {
    const reg = /^(?!(0[0-9]{0,}$))[0-9]+(.[0-9]+)?$/
    if (val && reg.test(val)) {
      this.getnums(val * 10000)
    } else {
      this.nums = '0~0'
    }
  }

  @Watch('query.brandId')
  watchqueryBrandId(val: any) {
    if (val) {
      // this.seachproction(val, this.steps)
    } else {
      if (this.steps == 1) {
        this.query.productId = null
      }
    }
  }

  @Watch('query', {deep: true})
  watchQuery(val: any) {
    if (this.steps == 1) {
      let movieName = ''
      // if (val.brandId) {
      //   braname = (this.$refs.refBrand as any).queryBrandName()
      //   braname = braname ? `[${braname}]` : ''
      //   // braname = this.productlist.filter((it: any) => val.brandId == it.id)[0].name
      // }
      if (val.movieId && this.movieList.length > 0) {
        movieName = this.movieList.filter((it: any) => val.movieId == it.movieId)[0].name
        movieName = movieName ? `[${movieName}]` : ''
      }
      this.pername = `${movieName}`
    } else {
      this.steps = 1
    }
  }

  @Watch('setadver')
  watchSetadver(val: any) {
    this.init()
    if (val) {
      this.form.videoId = 0
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.item-top {
  margin-left: 30px;
}
.jia-input {
  display: inline-block;
  height: 47px;
  line-height: 60px;
  border: 0;
  font-size: 20px;
  color: #fff;
  width: 380px;
}
.form {
  height: 570px;
}
.input-height {
  height: 58px;
  line-height: 48px;
}
.adver-sel {
  /deep/ .ivu-form-item-label {
    color: #a3d5e6;
    text-align: right;
  }
}
.adver-name {
  margin-top: 30px;
  margin-bottom: 52px;
  /deep/ .ivu-form-item-label {
    font-size: 20px;
    color: #fff;
    margin-left: 10px;
    line-height: 38px;
  }
  /deep/ .ivu-select-input {
    color: #fff;
  }
  /deep/ .ivu-form-item {
    border: none;
    background: #00202d;
    height: 57px;
    border-radius: 5px;
    .ivu-input-wrapper {
      margin-top: 7px;
    }
    .ivu-input-wrapper, .ivu-input {
      background: #00202d;
      height: 47px;
      border: 0;
      font-size: 20px;
      color: #fff;
      width: 400px;
      &::placeholder {
        color: #fff;
      }
    }
    /deep/ .ivu-form-item-error-tip {
      padding-top: 14px;
      margin-left: 15px;
      font-size: 16px;
    }
  }
}
/deep/ .ivu-form-item-label {
  text-align: right;
}
/deep/ .ivu-select-input[disabled] {
  color: #fff;
  -webkit-text-fill-color: #fff;
}
.adver-detail {
  background: rgba(0, 32, 45, 0);
  /deep/ .ivu-select-selection,
  /deep/ .ivu-input-wrapper,
  /deep/ .ivu-select,
  /deep/ .ivu-input,
  /deep/ .ivu-select-input {
    background: rgba(208, 233, 246, 0);
    border: 0;
    outline: none;
    font-size: 16px;
    &::placeholder {
      font-size: 16px;
      color: #fff;
    }
  }
  /deep/ .ivu-form-item-error-tip {
    font-size: 16px;
  }
  /deep/ .ivu-form-item-label {
    font-size: 16px;
    font-weight: 500;
    color: #00202d;
  }
  /deep/ .ivu-select-input, /deep/ .ivu-input-default {
    border-bottom: 1px solid #00202d;
  }
  /deep/ .ivu-select-selection {
    padding-left: 5px;
  }
  /deep/ .ivu-input, /deep/ .ivu-select-input {
    color: #fff;
    line-height: 30px;
    height: 30px;
  }
  /deep/ .ivu-select-arrow {
    right: 0;
    color: #00202d;
  }
  /deep/ .ivu-date-picker {
    display: block;
  }
  /deep/ .ivu-icon-ios-calendar-outline {
    position: absolute;
    right: 0;
    width: 22px;
    top: 4px;
    height: 22px;
    background: url(./assets/time.png) no-repeat;
    background-size: 20px;
  }
  .timer {
    /deep/ .ivu-form-item-content {
      label {
        color: #fff;
        font-size: 16px;
        width: 185px;
      }
    }
    /deep/ .ivu-icon-ios-close-circle {
      width: 20px;
      background: url(./assets/cancel.png) no-repeat;
      background-size: 20px;
    }
  }
  /deep/ .ivu-input-prefix i, /deep/ .ivu-input-suffix i {
    color: rgba(255, 255, 255, 0);
  }
}
.adver-time {
  margin-left: 30px;
  span {
    font-size: 22px;
  }
}
.adver-schedule {
  /deep/ .ivu-input-wrapper,
  /deep/ .ivu-form-item-content,
  /deep/ .ivu-input,
  /deep/ .ivu-select-input {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 1);
    color: #00202d;
    border-radius: 5px;
    font-size: 16px;
    &::placeholder {
      font-size: 16px;
      color: #00202d;
    }
  }
  /deep/ .ivu-input-wrapper {
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  /deep/ .ivu-input {
    border: 0;
  }
  /deep/ .ivu-form-item-label {
    font-size: 16px;
    font-weight: 500;
    color: #00202d;
  }
}
.check-ra {
  /deep/ .ivu-checkbox {
    display: none;
  }
  /deep/&.ivu-checkbox-wrapper-checked {
    color: #fff;
    border-color: @c-button;
    background-color: @c-button;
    &::after {
      content: '\2713';
      color: #fff;
      position: absolute;
      right: -8px;
      top: -8px;
      border: 1px solid #00202d;
      background: #00202d;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
    }
  }
}
.check-item {
  /deep/ .ivu-checkbox-inner {
    width: 20px;
    height: 20px;
    border-color: #fff;
    background: #fff;
    &::after {
      line-height: 20px;
      text-align: center;
      width: 7px;
      height: 11px;
      top: 1px;
      left: 5px;
      border-color: #00202d;
    }
  }
  &.check-no {
    margin-top: 3px;
    font-size: 16px;
    margin-left: 6px;
  }
}
.hint {
  position: absolute;
  right: 10px;
  top: 2px;
  color: #00202d;
}
.button-ok {
  width: 200px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.btn-center {
  position: absolute;
  margin: 40px 0 30px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
}
/deep/ .ivu-form-item-required .ivu-form-item-label::before {
  margin-right: 0;
}
.pages {
  background: url(./assets/step1.jpg) no-repeat;
  position: fixed;
  left: 100px;
  right: 0;
  top: 0;
  bottom: 0;
  margin-top: -30px;
  background-size: 100%;
}
</style>
