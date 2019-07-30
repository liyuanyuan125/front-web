<template>
  <div class="plan-box">
    <Spin v-if="spinshow" fix>
      <img style="width: 200px" src="./assets/doing.gif">
      <Progress :percent="spins" status="active" />
      <p style="font-size: 30px; color: #3959A8">{{spins}}%</p>
    </Spin>
    <Row>
      <Col>
        <Form
          :model="form"
          ref="dataform"
          label-position="left"
          :label-width="0"
          class="edit-input forms"
        >
          <h3 class="layout-titles">覆盖范围设置</h3>
          <Row>
            <Col :span="24">
              <Row>
                <FormItem :labelWidth="0" class="item-top form-item-type">
                  <Tags v-model="cityCustom" :tagMess="areaList"/>
                </FormItem>
                <div class="item-top" v-show="cityCustom == 1">
                  <!-- <div @click="visible = true" class="set-city">
                    共{{citysId.length}}个城市
                    <span>设置</span>
                  </div> -->
                  <City :warehouseLisst='warehouseLisst' v-if='cityfalse' @ok="onCitySelectOk" v-model="visible" :cityIds.sync="citysId" :topCityIds="warehouseId"></City>
                </div>
                <div v-show="cityCustom != 1" class="xls-box">
                  <p class="title">注（请先下载影院数据表，编辑为仅包含自己目标投放影院的“.xls”格式文件，
                    然后再导入；请勿修改表格格式，否则将导入失败）</p>
                  <FormItem :labelWidth="0"  class="item-top form-item-type">
                    <div class="set-film">
                      可选影院：
                      <span>影院数据.xls</span>
                      <a :href='herf' download='影院数据' class='down-xls' style="margin-left: 40px;cursor: pointer;">
                        下载
                        <img src='./assets/down.png' />
                      </a>
                    </div>
                  </FormItem>
                  <FormItem style="margin-left: 30px" :labelWidth="0"  class="form-item-type">
                    <div class="set-film">
                      目标影院：
                      <label class="upload-film">
                        <span>选取文件</span>
                        <input ref='downinput' type="file" style="display: none" accept="application/vnd.ms-excel" @change="filmchange"/>
                      </label>
                      <span v-if='!xlsname' style="margin-left: 20px;">未选择文件</span>
                      <span v-else>
                        {{xlsname}}
                      </span>
                      <p style="margin-left: 90px; margin-top: 20px">成功识别 {{xlslid.length}} 家影院</p>
                    </div>
                  </FormItem>
                </div>
              </Row>
            </Col>
          </Row>

          <h3 class="layout-titles" style="margin-top: 45px">受众偏好</h3>
          <Row class="item-top item-three">
            <Col :span="24" class="flex">
              <Col :span="7" class="title-box">
                <div class="orient-title">受众性别</div>
                <FormItem class="item-top form-item-type">
                  <div class="age-box">
                    <RadioGroup v-model="form.sex" class="item-radio-top">
                      <Radio  style="width: 250px" class="check-item form-item-first" :label="0">不限</Radio>
                      <Radio
                        v-if="it.key != 'unknow'"
                        style="width: 116px; height: 40px; float: left;"
                        v-for="it in sexList"
                        :key="it.key"
                        :label="it.key"
                        class="check-item check-icon"
                      >
                        <span>{{it.text}}</span>
                      </Radio>
                    </RadioGroup>
                  </div>
                </FormItem>
              </Col>

              <Col :span="17">
                <div class="title-box" style='margin-left: 20px'>
                  <div class="orient-title">受众年龄</div>
                  <FormItem class="item-top form-item-type">
                    <CheckboxGroup v-model="form.age" class="item-radio-top">
                      <Checkbox  style="width: 250px" class="check-item form-item-first" :label="0">不限</Checkbox>
                      <div class="check-box">
                        <Checkbox
                          v-for="it in ageList"
                          :key="it.key"
                          :label="it.key"
                          class="check-item"
                        >
                          <span>{{it.text}}</span>
                        </Checkbox>
                      </div>
                    </CheckboxGroup>
                  </FormItem>
                </div>
              </Col>

              <Col :span="12">
              </Col>
            </Col>
          </Row>

          <h3 class="layout-titles">
            影片定向
          </h3>
           <FormItem :labelWidth="0" class="item-top cinema-position form-item-type">
              <Tags v-model="movieCustom" :tagMess="movieList"/>
            </FormItem>
          <div v-show="movieCustom != 0">
            <Film v-if="typeList.length > 0" v-model="numsList" @donefilm="timerfilm" :begin="beginDate" :end="endDate" />
          </div>
          <div class="title-box item-top" v-show="movieCustom == 0">
            <div ref="types">
              <FormItem :labelWidth="0" class="item-top form-item-type">
                <CheckboxGroup v-model="form.type" class="item-radio-top">
                  <Checkbox  style="width: 100px" class="check-item form-item-first" :label="0">不限</Checkbox>
                  <Checkbox
                    v-for="it in typeList"
                    :key="it.key"
                    :label="it.key"
                    class="check-item"
                  >{{it.text}}</Checkbox>
                </CheckboxGroup>
              </FormItem>
            </div>
            <!-- <Film v-model="numsList" :begin="beginDate" :end="endDate" @donetime="updatetime" @donefilm="timerfilm"/> -->
          </div>

          <!-- <div v-show='movieCustom == 0'>
            <div class='all-box'>
              系统将自动为您安排投放周期内所有的场次进行投放
            </div>
          </div> -->

          <div class="btn-center">
            <Button
              type="default"
              class="button-ok last-button default-but"
              @click="back('dataform')"
            >
              <img width="16px" src="./assets/next.png">返回上一步
            </Button>
            <Button
              type="primary"
              class="button-ok next-button"
              @click="next('dataform')"
            >下一步,进入推广方案</Button>
          </div>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Tags from '../tag.vue'
import { cinemaFind, xlspost } from '@/api/popPlan.ts'
import { confirm, toast } from '@/ui/modal'
import moment from 'moment'
import Film from './newfilm.vue'
import Chain from '@/components/cityMap/CityMap.vue'
import { post } from '@/fn/ajax'
import {
  getTwodetail,
  warehouse,
  getRegionList,
  direction,
  searchcinema,
  adverdetail,
  getRecommend,
  downcinema
} from '@/api/popPlan.ts'
import { clean } from '@/fn/object.ts'
import City from '@/components/adverCity'
import { info } from '@/ui/modal'
import jsxReactToVue from '@/util/jsxReactToVue'

// 保持互斥
const keepExclusion = <T>(
  value: T[],
  oldValue: T[],
  aloneValue: any,
  setter: (newValue: T[]) => any
) => {
  if (value.length > 1) {
    const newHas = value.includes(aloneValue)
    const oldHas = oldValue.includes(aloneValue)
    newHas && setter([aloneValue])
    newHas && oldHas && setter(value.filter(it => it != aloneValue))
  }
}
const timeFormat = 'YYYY-MM-DD'
const timeFormats = 'YYYYMMDD'
@Component({
  components: {
    Tags,
    Film,
    Chain,
    City
  }
})
export default class Orienteering extends ViewBase {
  @Prop() value!: any
  xlsname: any = ''
  visible = false
  citysId = []
  topCitysId = []
  beginDate = ''
  endDate = ''
  cityfalse = false
  spins = 0
  planMovies: any = null
  form: any = {
    name: '',
    cinema: [0],
    sex: 0,
    age: [0],
    type: [0]
  }
  spinshow = false
  warehouseId: any = []
  warehouseLisst: any = []
  loadingitem: any = {}
  movies: any = []
  timers: any = {}
  numsList: any = []
  cityCustom: number = 1
  movieCustom: number = 1
  cinemaType: number = 0
  settime: any = null
  deliveryCityTypeList: any = []
  tags: any = []
  item: any = null

  areaList = [
    {
      label: 1,
      name: '按城市设置'
    },
    {
      label: 0,
      name: '按影院设置'
    }
  ]
  movieList = [
    {
      label: 1,
      name: '自定义影片'
    },
    {
      label: 0,
      name: '按类型定向'
    }
  ]
  cinemaList = [
    {
      label: 1,
      name: '数量不限'
    },
    {
      label: 2,
      name: '指定数量'
    }
  ]

  recommend: any = false
  cityList: any = []
  cinemastatusList: any = []
  sexList: any = []
  ageList: any = []
  typeList: any = []
  cinemaDetail: any = []
  citiesList: any = []
  xlslid = []

  get herf() {
    return `${VAR.ajaxBaseUrl}/xadvert/plans/export-cinemas`
  }

  mounted() {
    this.init()
  }

  timerfilm(val: any) {
    this.numsList = val
  }

  formatDate(data: any) {
    return data ? moment(data).format(timeFormat) : '暂无'
  }

  async init() {
    try {
      const { data } = await getTwodetail()
      await getRegionList()
      const {
        data: { item, deliveryCityTypeList, tags, movies, cities }
      } = await adverdetail(this.value.setid)
      const datas = await warehouse()
      this.warehouseLisst = datas.data || []
      this.citiesList = cities || []
      this.citysId = (this.citiesList || []).map((it: any) => it.id)
      this.warehouseId = (datas.data || []).map((it: any) => it.cityId)
      this.beginDate = item.beginDate
      this.endDate = item.endDate
      this.tags = tags
      if (this.$route.name == 'pop-planlist-edit') {
        this.cityCustom = item.cityCustom || 0
        this.deliveryCityTypeList = deliveryCityTypeList
        this.item = item
        this.movies = movies
        this.movieCustom = item.movieCustom
        this.renders(item)
      }
      // this.citysId = item.customDeliveryCities || []
      this.xlslid = item.deliveryCinemas || []
      this.cityList = data.deliveryCityTypeList
      this.cinemastatusList = data.cinemaList
      this.sexList = data.tags[2].values || []
      this.ageList = data.tags[1].values || []
      this.typeList = data.tags[0].values || []
      this.cinemaDetail = data.items || []
      this.cityfalse = true
    } catch (ex) {
      this.handleError('系统错误，请重新尝试！')
    }
  }

  renders(val: any) {
    this.citys(val.deliveryCityTypes)
    this.sexs()
    this.ages()
    this.types()
    this.movieCustoms()
  }

  movieCustoms() {
    if (this.item.movieCustom == 1) {
      this.movieCustom = 0
      this.numsList = (this.movies || []).map((it: any) => {
        return {
          id: it.id,
          nameCn: it.name,
          releaseDate: it.releaseDate,
          image: it.mainPic
        }
      })
    }
  }

  citys(val: any) {
    if (this.item.allNation != 1) {
      const message = (val || []).map((it: any) => {
        const msg = this.deliveryCityTypeList.filter(
          (item: any) => it == item.key
        )[0].key
        return msg
      })
      this.form.cinema = message
    } else {
      this.form.cinema = [0]
    }
  }

  sexs() {
    const msg = (this.item.deliveryGroups || []).filter(
      (item: any) => item.tagTypeCode == 'PLAN_GROUP_SEX'
    )
    if (msg.length > 0) {
      const msgKey = msg[0].text.split(';')
      const message = msgKey.map((it: any) => {
        const value = this.tags[2].values.filter(
          (item: any) => it == item.key
        )[0].key
        return value
      })
      this.form.sex = message.join(',')
    } else {
      this.form.sex = 0
    }
  }

  ages() {
    const msg = (this.item.deliveryGroups || []).filter(
      (item: any) => item.tagTypeCode == 'PLAN_GROUP_AGE'
    )
    if (msg.length > 0) {
      const msgKey = msg[0].text.split(';')
      const message = msgKey.map((it: any) => {
        const value = this.tags[1].values.filter(
          (item: any) => it == item.key
        )[0].key
        return value
      })
      this.form.age = message
    } else {
      this.form.age = [0]
    }
  }

  types() {
    const msg = (this.item.deliveryGroups || []).filter(
      (item: any) => item.tagTypeCode == 'MOVIE_TYPE'
    )
    if (msg.length > 0) {
      const msgKey = msg[0].text.split(';')
      const message = msgKey.map((it: any) => {
        const value = this.tags[0].values.filter(
          (item: any) => it == item.key
        )[0].key
        return value
      })
      this.form.type = message
    } else {
      this.form.type = [0]
    }
  }

  async next(dataform: any) {
    // const timers = Object.keys(this.timers)
    if (this.cityCustom == 0 && this.xlslid.length == 0) {
      confirm('请设置目标影院')
      return
    }
    // if (this.movieCustom == 1 && this.numsList.length == 0) {
    //   confirm('最少选择一个影片')
    //   return
    // }
    try {
      await direction(
        clean({
          planId: this.$route.params.setid,
          cityCustom: this.cityCustom,
          deliveryGroups: [
            {
              tagTypeCode: 'MOVIE_TYPE',
              text: this.movieCustom == 1 && this.numsList.length > 0 ? 0 : this.form.type.join(';')
            },
            {
              tagTypeCode: 'PLAN_GROUP_AGE',
              text: this.form.age.join(';')
            },
            {
              tagTypeCode: 'PLAN_GROUP_SEX',
              text: this.form.sex
            }
          ].filter((it: any) => {
            return it.text != 0
          }),
          allNation: 1,
          movieCustom: this.numsList.length == 0 ? 0 : this.movieCustom,
          customDeliveryCities: this.cityCustom == 1 ? this.citysId : '' ,
          customDeliveryCinemas: this.cityCustom == 0 ? this.xlslid : '' ,
          deliveryMovies:
            this.movieCustom == 0
              ? ''
              : this.numsList.map((it: any) => {
                  return {
                    movieId: it.id,
                    beginDate: this.beginDate,
                    endDate: this.endDate
                  }
                })
        })
      )

      this.spins = 20
      this.spinshow = true
      this.recommend = false
      this.settime = setInterval(() => {
        if (this.recommend) {
          this.spins = 100
          clearInterval(this.settime)
          setTimeout(() => {
            this.spinshow = false
            if (this.planMovies && this.planMovies.length > 0) {
                this.$emit('input', {
                  step: 2,
                  setid: this.$route.params.setid
                })
                if (this.$route.name == 'pop-planlist-add') {
                  this.$router.push({
                    name: 'pop-planlist-add',
                    params: { step: '2', setid: this.$route.params.setid  }
                  })
                } else {
                  this.$router.push({
                    name: 'pop-planlist-edit',
                    params: { step: '2', setid: this.$route.params.setid  }
                  })
                }
              } else {
                info('非常抱歉，暂未找到匹配项；请尝试扩大定向范围或投放排期范围')
              }
              this.spins = 0
            }, 500)
          // }
        } else {
          this.loddding()
        }
      }, 3000)
    } catch (ex) {
      this.spinshow = false
      clearInterval(this.settime)
      this.handleError(ex)
    }
  }

  // async cinemaFind() {
  //   try {
  //     const { data } = await getRecommend({
  //       budgetAmount: 100000,
  //       specification: 15,
  //       beginDate: 20190701,
  //       endDate: 20190702
  //     })
  //     console.log(data)
  //   } catch (ex) {
  //     this.handleError(ex)
  //   }
  // }

  async loddding() {
    try {
      const {
        data,
        data: { item, planMovies, movies }
      } = await adverdetail(this.value.setid)
      if ( data.code == '401') {
        this.spinshow = false
        clearInterval(this.settime)
      }
      if (this.spins >= 80) {
        this.spins = 99
      } else {
        this.spins += 20
      }
      this.recommend = item.recommend
      this.planMovies = planMovies
      this.loadingitem = {
        item,
        movies
      }
    } catch (ex) {
      this.spinshow = false
      clearInterval(this.settime)
    }
  }

  onCitySelectOk({ fastList }: any) {
  }

  async filmchange(ev: Event) {
    try {
      const files: any = (ev.target as HTMLInputElement).files
      if (files == null || files.length === 0) {
        return
      }
      const form: any = new FormData
      this.xlsname = files[0].name
      form.append('file', files[0])
      const { data } = await xlspost(this.$route.params.setid, form)
      this.xlslid = data || []
    } catch (ex) {
      this.handleError(ex)
    }
    (this.$refs.downinput as any).value = ''
  }

  back(dataform: any) {
    this.$emit('input', {
      step: 0,
      setid: this.$route.params.setid
    })
    if (this.$route.name == 'pop-planlist-add') {
      this.$router.push({
        name: 'pop-planlist-add',
        params: { step: '0', setid: this.$route.params.setid  }
      })
    } else {
      this.$router.push({
        name: 'pop-planlist-edit',
        params: { step: '0', setid: this.$route.params.setid  }
      })
    }
  }

  @Watch('form.cinema', { deep: true })
  watchformCinema(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.cinema = newValue
    })
    // keepExclusion(value, oldValue, 'top20', newValue => {
    //   this.form.cinema = newValue
    // })
    // if (value[value.length] == -1) {
    //   this.form.cinema = [-1]
    // }
    if (value.length == 0) {
      this.form.cinema = [0]
    }
  }

  // @Watch('form.sex', { deep: true })
  // watchformSex(value: number[], oldValue: number[]) {
  //   // 不限与其他项互斥
  //   keepExclusion(value, oldValue, 0, newValue => {
  //     this.form.sex = newValue
  //   })
  //   if (value.length == 0) {
  //     this.form.sex = [0]
  //   }
  // }

  @Watch('form.type', { deep: true })
  watchformType(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.type = newValue
    })
    if (value.length == -1) {
      this.form.type = [0]
    }
  }

  @Watch('form.age', { deep: true })
  watchformAge(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.age = newValue
    })
    if (value.length == 0) {
      this.form.age = [0]
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.item-top {
  margin-left: 30px;
  margin-right: 30px;
}
.plan-box {
  margin: 0 40px;
}
.layout-titles {
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  margin-left: 30px;
  margin-bottom: 23px;
}
.set-city {
  font-size: 18px;
  span {
    .button-style(#fff, #00202d);
    display: inline-block;
    width: 74px;
    height: 31px;
    text-align: center;
    line-height: 31px;
    border-radius: 16px;
    margin-left: 10px;
  }
}
.check-ra {
  /deep/ .ivu-checkbox {
    display: none;
  }
  /deep/ .ivu-radio {
    display: none;
  }
  /deep/&.ivu-checkbox-wrapper-checked {
    color: #fff;
    background-color: #00202d;
    border: 1px solid #00202d;
    &::after {
      content: '';
      position: absolute;
      right: -18px;
      top: -18px;
      background: url(./assets/sure.png);
      width: 36px;
      height: 36px;
      background-size: 36px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
    }
  }
  /deep/&.ivu-radio-wrapper-checked {
    color: #fff;
    background-color: #00202d;
    border: 1px solid #00202d;
    &::after {
      content: '';
      position: absolute;
      right: -18px;
      top: -18px;
      background: url(./assets/sure.png);
      width: 36px;
      height: 36px;
      border: 0;
      background-size: 36px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
    }
  }
}
.check-cinem {
  margin-top: 30px;
}
.item-three {
  margin-bottom: 80px;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
}
.adv-left {
  width: 500px;
  /deep/ .ivu-select-dropdown {
    /deep/ li,
    /deep/ .ivu-select-loading {
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
}
.orient-title {
  margin-left: 30px;
  font-size: 18px;
  margin-top: 20px;
}
/deep/ .ivu-checkbox-checked .ivu-checkbox-inner {
  background: #00202d;
}
.hint {
  position: absolute;
  left: 105px;
  top: 14px;
}
.button-ok {
  width: 200px;
  margin-right: 16px;
}
.btn-center {
  margin: 60px 0 30px;
  text-align: center;
}
.default-but {
  width: 200px;
  vertical-align: middle;
  .button-style(#00202d, rgba(0, 0, 0, 0));
  border-radius: 25px;
  img {
    vertical-align: middle;
  }
}
.next-button {
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.cinema-wrap {
  position: relative;
  /deep/ .ivu-form-item-content .ivu-input-wrapper input {
    height: 32px;
  }
  .cinema-input {
    position: absolute;
    left: 430px;
    top: 25px;
    width: 0;
    z-index: 999;
    span {
      position: absolute;
      top: 8px;
      right: -116px;
    }
  }
}
.form-item-first:first-child {
  margin-bottom: 20px;
}
.check-box {
  display: flex;
  .check-item {
    position: relative;
    top: 3px;
    flex: 1;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    text-align: center;
    margin-right: 15px;
    font-size: 14px;
    color: #00202d;
    border: 1px solid #fff;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.3);
    user-select: none;
    .check-ra;
  }
}
.check-item {
  position: relative;
  top: 3px;
  min-width: 99px;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  text-align: center;
  margin-right: 15px;
  font-size: 14px;
  color: #00202d;
  border: 1px solid #fff;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.3);
  user-select: none;
  .check-ra;
}
.check-icon {
  .check-ra;
  height: 70px;
  line-height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  div {
    width: 40px;
    height: 40px;
    overflow: hidden;
    margin-right: 30px;
  }
  i {
    position: relative;
    display: inline-block;
    top: 0;
    width: 40px;
    height: 40px;
  }
  .check-man {
    background: url(./assets/checkman.png);
    background-size: 40px;
  }
  .check-woman {
    background: url(./assets/checkwoman.png);
    background-size: 40px;
  }
}
/deep/ .ivu-radio-wrapper-checked {
  .check-man {
    background: url(./assets/man.png);
    background-size: 40px;
  }
  .check-woman {
    background: url(./assets/woman.png);
    background-size: 40px;
  }
}
.cinema-position {
  margin: -20px 30px 20px;
}
.chain {
  transform: scale(0.75);
  margin-top: -90px;
  /deep/ .city-map {
    background-color: #fff0;
  }
}
.film-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: -15px;
  margin-bottom: 40px;
  .film-item {
    width: calc(50% - 20px);
    height: 179px;
    padding-bottom: 5px;
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 1);
    .film-cover-box {
      display: flex;
      margin-top: 30px;
      .film-title {
        font-size: 18px;
        color: #00202d;
        height: 24px;
        font-weight: 400;
        margin-left: 20px;
      }
      .film-time {
        margin-left: 20px;
        height: 24px;
      }
      img {
        margin-left: 20px;
        width: 89px;
        height: 125px;
      }
    }
  }
  .film-item:nth-child(2n-1) {
    margin-right: 40px;
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
}
.city-show {
  display: flex;
  flex-wrap: wrap;
  width: 320px;
  span {
    width: 80px;
    color: #00202d;
    overflow: hidden;
  }
}
/deep/ .ivu-spin-fix {
  position: fixed;
}
/deep/ .ivu-progress-inner {
  background: #fec52f;
}
/deep/ .ivu-progress-text-inner {
  display: none;
}
/deep/ .ivu-progress-bg {
  background: #3959a8;
}
.btn-export {
  width: 150px;
  height: 40px;
  border: 1px solid fff;
  .button-style(#00202d, rgba(255, 255, 255, .3));
  border-radius: 5px;
  img {
    vertical-align: middle;
  }
}
.age-box {
  display: flex;
  align-items: center;
  justify-content: center;
  /deep/ .ivu-radio-group {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
}
.xls-box {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid #fff;
  margin: 0 30px;
  .title {
    margin-left: 30px;
    font-size: 16px;
    color: rgba(0, 32, 45, 1);
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .set-film {
    font-size: 16px;
    color: rgba(0, 32, 45, 1);
  }
  .upload-film {
    font-size: 16px;
    span {
      .button-style(#fff, #00202d);
      display: inline-block;
      width: 100px;
      height: 31px;
      text-align: center;
      line-height: 31px;
      border-radius: 16px;
      margin-left: 10px;
    }
  }
}
.title-box {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid #fff;
}
.all-box {
  margin: 0 30px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid #fff;
  border-radius: 5px;
  text-align: center;
  line-height: 150px;
  font-size: 18px;
  height: 150px;
}
.down-xls {
  color: #00202d;
  &:hover {
    color: #00202d;
  }
  img {
    width: 18px;
    vertical-align: middle;
  }
}
</style>
