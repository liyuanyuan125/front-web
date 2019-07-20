<template>
  <div class="component">
    <ul class="film-list">
      <li v-for="(it, index) in inValue" :key="index"
            :class="['film-item']">
          <div :class="['film-cover-box']">
            <span @click="del(it.id ? it.id : it.movie_id , index)" class="del">×</span>
            <img :src="it.main_pic ? it.main_pic : 'http://img31.mtime.cn/ph/1473/1213473/1213473_290X440X4.jpg'"  class="film-cover">
            <div>
              <div class="film-title">{{it.name_cn}}</div>
              <div class="film-time" style="margin-top: 10px"><span class="time-right">上映时间：</span>{{it.release_date}}</div>
              <div class="film-time timer">
                <span class="time-right">投放排期：</span>
                <span>{{formatDate(begin)}}至{{formatDate(end)}}</span>
              </div>
            </div>
          </div>
      </li>
      <li class="add-item" @click="onAdd" v-if="!type">
        <div>
          <span>+&nbsp;&nbsp;添加影片</span>
        </div>
      </li>
    </ul>
    <AddCFilmModel ref="addCinemaModel" :cinemaend = "incinematype" :addData="inValue" @done="columndata" />
  </div>
</template>

<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import AddCFilmModel from './addfilm.vue'
import Img from '@/components/imagePreviewer/ImagePreviewer.vue'
import moment from 'moment'
import weekDatePicker from '@/components/weekDatePicker/weekDatePicker.vue'
import { uniq, uniqBy } from 'lodash'

const timeFormat = 'YYYY-MM-DD'
@Component ({
  components: {
    AddCFilmModel,
    weekDatePicker
  }
})
export default class ComponentMain extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */

  @Prop({ type: Array, default: () => [] }) value!: any[]

  @Prop() type: any

  @Prop() begin: any

  @Prop() end: any

  @Prop() incinematype: any

  inValue: any[] = this.value
  addShow =  false

  form: any = {}

  onAdd() {
    this.addShow = true
    this.$nextTick(() => {
      (this.$refs.addCinemaModel as any).init()
    })
  }

  // get defaultImg() {
  //   return 'this.src="' + require('http://img31.mtime.cn/ph/1473/1213473/1213473_290X440X4.jpg') + '"'
  // }

  columndata(val: any) {
    val.forEach((it: any) => {
      if ((this.inValue || []).map((its: any) => {
              return its.id ? its.id : its.movie_id
            }).indexOf(it.movie_id)   == -1 ) {

          this.inValue.push(it)
      }
    })
  }

  onSet(id: number) {
  }

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  async del(id: any , index: any) {
    this.inValue.splice(index, 1)
  }

  @Watch('value')
  watchValue(val: any[]) {
    this.inValue = val
  }

  @Watch('form', {deep: true})
  watchForm(val: any) {
    this.$emit('donefilm', this.inValue)
  }

  @Watch('inValue', { deep: true })
  watchInValue(val: any[]) {
    val.forEach((it: any) => {
      if (!!this.form[it.id] && this.form[it.id].length > 0) {

      } else {
        this.$set(this.form, it.id, [] )
      }
    })
    this.$emit('input', val)
  }
}
</script>

<style lang="less" scoped>
.film-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 40px;
  .film-item {
    width: calc(50% - 20px);
    height: 200px;
    padding-bottom: 5px;
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 1);
    .film-cover-box {
      position: relative;
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
        margin-left: 20px;
      }
      .del {
        display: block;
        content: "\2716";
        cursor: pointer;
        color: #00202d;
        font-weight: bold;
        font-size: 19px;
        position: absolute;
        right: -8px;
        top: -38px;
        border: 1px solid #fff;
        background: #fff;
        width: 17px;
        height: 18px;
        border-radius: 50%;
        text-align: center;
        line-height: 16px;
      }
    }
  }
  .add-item {
    width: calc(50% - 20px);
    height: 200px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 1);
    div {
      text-align: center;
      padding-top: 70px;
      cursor: pointer;
      i {
        font-size: 27px;
      }
      span {
        font-size: 18px;
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
.time-right {
  margin-right: 10px;
  opacity: .7;
}
.timer {
  margin-left: 8px;
  /deep/ .week-date-picker {
    background: rgba(255, 255, 255, 0.4);
    outline: none;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    width: 230px;
    label {
      color: #00202d;
      font-size: 14px;
      width: 185px;
    }
  }
}
</style>
