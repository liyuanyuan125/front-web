<template>
  <div class="page home-bg">
    <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="edit-input forms">
      <h3 class="layout-title">覆盖范围设置</h3>
      <FormItem label="覆盖城市" class="item-top form-item-type">
        <Tags v-model="cityType" :tagMess = 'areaList' />
      </FormItem>
      <div class="item-top" v-if="cityType == 1">
        <FormItem>
          <CheckboxGroup v-model="form.cinema" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">全国</Checkbox>
            <Checkbox  v-for="it in cityList" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </div>
      <div class="item-top" v-else>

      </div>
      <div class="cinema-wrap">
        <FormItem label="覆盖影院" class="item-top form-item-type">
          <Tags v-model="cinemaType" :tagMess = 'cinemaList' />
        </FormItem>
        <FormItem v-if="cinemaType == 2" class="cinema-input" label-width='0'>
          <Input style="width: 100px;height: 34px" v-model="cinemaType" placeholder="请输入" :tagMess = 'cinemaList' />
          <span>家</span>
        </FormItem>
      </div>
      <FormItem label="影院星级"  class="item-top form-item-type">
        <CheckboxGroup v-model="form.sex" class="item-radio-top">
          <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
          <Checkbox  v-for="it in cinemastatusList" :key="it.key" :label="it.key"
            class="check-item">{{it.text}}</Checkbox>
        </CheckboxGroup>
      </FormItem>

      <h3 class="layout-title">受众定向</h3>
      <FormItem label="受众性别"  class="item-top form-item-type">
        <CheckboxGroup v-model="form.sex" class="item-radio-top">
          <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
          <Checkbox  v-for="it in sexList" :key="it.key" :label="it.key"
            class="check-item">{{it.text}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="受众年龄" class="item-top form-item-type">
        <CheckboxGroup v-model="form.age" class="item-radio-top">
          <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
          <Checkbox  v-for="it in ageList" :key="it.key" :label="it.key"
            class="check-item">{{it.text}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="影片类型" class="item-top form-item-type">
        <CheckboxGroup v-model="form.type" class="item-radio-top">
          <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
          <Checkbox  v-for="it in typeList" :key="it.key" :label="it.key"
            class="check-item">{{it.text}}</Checkbox>
        </CheckboxGroup>
      </FormItem>

      <h3 class="layout-title">影片定向</h3>
      <FormItem label="选择模式" class="item-top form-item-type">
        <Tags v-model="movieType" :tagMess = 'movieList' />
      </FormItem>
      <div class="item-top" v-show="movieType == 1">
        <FormItem label="推荐影片" class="form-item-type-sort">
          <ul class="film-list" v-if="cinemaDetail.length > 0">
            <li v-for="(it, index) in cinemaDetail" :key="it.id"
              :class="['film-item']">
              <div :class="['film-cover-box']">
                <b :class="`img-rank${index + 1}`"></b>
                <img :src="it.mainPicUrl" class="film-cover">
                <div class="film-date">上映时间：{{formatDate(it.openTime)}}</div>
              </div>
              <h4 class="film-name">{{it.name}}</h4>
              <div class="film-tags"><p class="cinema-type">
                <span>{{it.type.join('/')}}</span></p>
              </div>
            </li>
          </ul>
        </FormItem>
      </div>
      <div class="item-top" v-show="movieType != 1">
        <Film />
      </div>

      <div class="btn-center">
        <Button type="primary" class="button-ok" @click="next('dataform')">下一步,进入推广方案</Button>
        <Button type="default" class="button-ok default-but" @click="back('dataform')">返回上一步</Button>
      </div>
    </Form>  
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Tags from '../tag.vue'
import { orienteering } from '@/api/popPlan.ts'
import moment from 'moment'
import Film from './film.vue'

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
const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    Tags,
    Film
  }
})
export default class Orienteering extends ViewBase {
  @Prop() value!: number

  form: any = {
    name: '',
    cinema: [0],
    sex: [0],
    age: [0],
    type: [0]
  }
  rule: any = {
  }
  cityType: number = 1
  movieType: number = 2
  cinemaType: number = 1
  areaList = [{
    label: 1,
    name: '快速选择'
  }, {
    label: 2,
    name: '自定义城市列表'
  }]
  movieList = [
    {
      label: 1,
      name: '系统智能匹配'
    }, {
      label: 2,
      name: '自定义影片'
    }
  ]
  cinemaList = [
    {
      label: 1,
      name: '数量不限'
    }, {
      label: 2,
      name: '指定数量'
    }
  ]
  cityList: any = []
  cinemastatusList: any = []
  sexList: any = []
  ageList: any = []
  typeList: any = []
  cinemaDetail: any = []

  created() {
    this.init()
  }

  formatDate(data: any) {
    return data ? moment(data).format(timeFormat) : '暂无'
  }

  async init() {
    try {
      const { data } = await orienteering({})
      this.cityList = data.cityList
      this.cinemastatusList = data.cinemaList
      this.sexList = data.sexList
      this.ageList = data.ageList
      this.typeList = data.typeList
      this.cinemaDetail = data.items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async next(dataform: any) {
    this.$emit('input', 2)
    try {
      const volid = await (this.$refs[dataform] as any).validate()
      if (volid) {
        this.$emit('input', 1)
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  back(dataform: any) {
    this.$emit('input', 0)
  }

  @Watch('form.cinema', { deep: true })
  watchformCinema(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.cinema = newValue
    })
  }

  @Watch('form.sex', { deep: true })
  watchformSex(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.sex = newValue
    })
  }

  @Watch('form.type', { deep: true })
  watchformType(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.type = newValue
    })
  }

  @Watch('form.age', { deep: true })
  watchformAge(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.age = newValue
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.item-top {
  margin-left: 30px;
}
.adv-left {
  width: 500px;
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
  margin: 40px 0 30px;
  text-align: center;
}
.default-but {
  border: 1px solid #dcdee2;
  .button-style(#515a6e, rgba(236, 245, 255, 1));
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

.check-item {
  position: relative;
  top: 3px;
  min-width: 80px;
  height: 30px;
  line-height: 30px;
  border-radius: 2px;
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
.film-list {
  display: flex;
  flex-wrap: wrap;
  column-count: 3;
  margin-top: -15px;
  margin-bottom: 40px;
  .film-item {
    position: relative;
    width: 270px;
    margin: 25px 20px 0 0;
    background: rgba(249, 249, 249, 1);
    padding-bottom: 5px;
    img {
      width: 100%;
      height: 100%;
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
}
</style>
