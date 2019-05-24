<template>
  <div class="page home-bg">
    <Row>
      <Col :span="22" :offset="1">
        <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="0" class="edit-input forms">
          <h3 class="layout-title">覆盖范围设置</h3>
          <Row>
            <Col :span="12">
              <Row>
                <FormItem :labelWidth="0" class="item-top form-item-type">
                  <Tags v-model="cityType" :tagMess = 'areaList' />
                </FormItem>
                <div class="item-top check-cinem" v-if="cityType == 1">
                  <FormItem :labelWidth="0">
                    <CheckboxGroup v-model="form.cinema" class="item-radio-top">
                      <div style="width: 480px; margin-bottom: 30px">
                        <Checkbox style="width: 180px" class="check-item form-item-first" :label="0">全国</Checkbox>
                        <Checkbox style="width: 180px" class="check-item form-item-first" :label="-1">票仓城市Top20</Checkbox>
                      </div>
                      <Checkbox  v-for="it in cityList" :key="it.key" :label="it.key"
                        class="check-item">{{it.text}}</Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </div>
                <div class="item-top" v-else>

                </div>
              </Row>
            </Col>
            <Col :span="12">
              <Row>
                <div><Chain /></div>
              </Row>
            </Col>
          </Row>
          
          <h3 class="layout-title">受众定向</h3>
          <Row class="item-top item-three">
            <Col :span="12" class="flex">
              <Col :span="12" class="three-left">
                <div class="orient-title">受众年龄</div>
                <FormItem class="item-top form-item-type">
                  <CheckboxGroup v-model="form.sex" class="item-radio-top">
                    <Checkbox style="width: 220px" class="check-item form-item-first" :label="0">不限</Checkbox>
                    <Checkbox style="width: 220px; height: 70px;"  v-for="it in sexList" :key="it.key" :label="it.key"
                      class="check-item check-icon">
                      <div v-if="it.text == '男'"><i class="check-man"></i></div>
                      <div v-else><i class="check-woman"></i></div>
                      <span>{{it.text}}</span>
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </Col>

              <Col :span="12" class="three-left">
                <div class="orient-title">受众性别</div>
                <FormItem class="item-top form-item-type">
                  <CheckboxGroup v-model="form.age" class="item-radio-top">
                    <Checkbox style="width: 220px" class="check-item form-item-first" :label="0">不限</Checkbox>
                    <Checkbox style="100px"  v-for="it in ageList" :key="it.key" :label="it.key"
                      class="check-item">
                      <span>{{it.text}}</span>
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </Col>
              
            </Col>
            <Col :span="12">
              <div class="orient-title">影片类型</div>
              <FormItem :labelWidth="0" class="item-top form-item-type">
                <CheckboxGroup v-model="form.type" class="item-radio-top">
                  <Checkbox  v-for="it in typeList" :key="it.key" :label="it.key"
                    class="check-item">{{it.text}}</Checkbox>
                </CheckboxGroup>
              </FormItem>
            </Col>
          </Row>

          <h3 class="layout-title">影片定向</h3>
          <FormItem :labelWidth="0" class="item-top form-item-type">
            <Tags v-model="movieType" :tagMess = 'movieList' />
          </FormItem>
          <div class="item-top" v-show="movieType == 1">
            <FormItem :labelWidth="0" class="form-item-type-sort">
              <ul class="film-list" v-if="cinemaDetail.length > 0">
                <li v-for="(it) in cinemaDetail" :key="it.id"
                  :class="['film-item']">
                  <div :class="['film-cover-box']">
                    <img :src="it.mainPicUrl" class="film-cover">
                    <div>
                      <div class="film-title">{{it.name}}</div>
                      <div class="film-title">{{it.name}}</div>
                      <div class="film-time" style="margin-top: 20px">上映时间：{{formatDate(it.openTime)}}</div>
                      <div class="film-time">投放排期: {{formatDate(it.openTime)}}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </FormItem>
          </div>
          <div class="item-top" v-show="movieType != 1">
            <Film />
          </div>

          <div class="btn-center">
            <Button type="primary" class="button-ok next-button" @click="next('dataform')">下一步,进入推广方案</Button>
            <Button type="default" class="button-ok last-button default-but" @click="back('dataform')">返回上一步</Button>
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
import { orienteering } from '@/api/popPlan.ts'
import moment from 'moment'
import Film from './film.vue'
import Chain from '@/components/cityMap/CityMap.vue'

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
    Film,
    Chain
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
    keepExclusion(value, oldValue, -1, newValue => {
      this.form.cinema = newValue
    })
    if (value[value.length] == -1) {
      this.form.cinema = [-1]
    }
    if (value.length == 0) {
      this.form.cinema = [0]
    }
  }

  @Watch('form.sex', { deep: true })
  watchformSex(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.sex = newValue
    })
    if (value.length == 0) {
      this.form.sex = [0]
    }
  }

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
      z-index: 999;
    }
  }
}
.check-cinem {
  margin-top: 30px;
  border-bottom: 1px solid #fff;
}
.item-three {
  border-bottom: 1px solid #000;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .three-left {
    border-right: 2px solid;
    border-image: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 100%) 10;
  }
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
.orient-title {
  text-align: center;
  margin-bottom: 30px;
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

.check-item {
  position: relative;
  top: 3px;
  min-width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  text-align: center;
  margin-right: 15px;
  font-size: 14px;
  color: #00202d;
  border: 1px solid #fff;
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
    left: -40px;
    top: 0;
    height: 40px;
    border-right: 40px solid transparent;
    filter: drop-shadow(40px 0);
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
.film-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: -15px;
  margin-bottom: 40px;
  .film-item {
    width: calc(50% - 20px);
    height: 160px;
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
</style>
