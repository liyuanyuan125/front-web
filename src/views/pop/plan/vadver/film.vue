<template>
  <div class="component">
    <!-- <ul class="film-list">
      <li v-for="(it, index) in inValue" :key="index"
            :class="['film-item']">
          <div :class="['film-cover-box']">
            <span @click="del(it.id)" class="del">×</span>
            <img :src="it.image ? it.image : defaultImg" :onerror="defaultImg" class="film-cover">
            <div>
              <div class="film-title">{{it.nameCn}}</div>
              <div class="film-time" style="margin-top: 10px"><span class="time-right">上映时间：</span>{{formatDate(it.releaseDate)}}</div>
              <div class="film-time timer">
                <span class="time-right">投放排期</span>
                <span>{{formatDate(beg)}}至{{formatDate(ends)}}</span>
              </div>
            </div>
          </div>
      </li>
      <li class="add-item" @click="onAdd" v-if="!type">
        <div>
          <Icon type="md-add" /><span>添加影片</span>
        </div>
      </li>
    </ul> -->
    <div class="reject-cinema">
      <div class="flex-box search-input">
      </div>
      <div class="detail">
        <ul class="film-list" v-if="data.length > 0">
          <li @click="checkNum(it.id, it)" v-for="(it, index) in data" :key="index"
            :class="['film-item', !!checkId.includes(it.id + '') ? 'list-active' : '']">
            <div :class="['film-cover-box']">
              <img :src="it.image ? it.image : defaultImg" :onerror="defaultImg" class="film-cover">
              <div>
                <div class="film-title">{{it.nameCn}}</div>
                <div class="film-time" style="margin-top: 10px">上映时间：{{formatDate(it.releaseDate)}}</div>
                <div class="film-time">影片类型：{{typeCinema(it.type)}}</div>
                <div class="film-time">导演: {{it.director.join(' / ')}}</div>
                <div class="film-time">主演: {{it.actor.join(' / ')}}</div>
              </div>
            </div>
          </li>
        </ul>
        <div class="film-no" v-else>
          <span>暂无影片</span>
        </div>
       </div>
       <div class="check-films">
         <span>
          <Checkbox @on-change="checkAll" :disabled="data.length > 0 ? false : true" v-model="checkboxall">全选</Checkbox>
          已选择 {{checkObj.length}} 个
         </span>
       </div>
        <updateschedule ref="updatetime" @done="updatetime" />
        <Page :total="total" v-if="total>0" class="btnCenter"
          :current="form.pageIndex"
          :page-size="form.pageSize"
          :page-size-opts="[4, 8, 16, 24]"
          show-total
          show-sizer
          show-elevator
          @on-change="sizeChangeHandle"
          @on-page-size-change="currentChangeHandle"/>
    </div>
    <AddCFilmModel v-if="flags" ref="addCinemaModel" :date="scheduletime" :cinemaend = "incinematype" :addData="inValue" @done="columndata" />
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

  flags = false
  beg = this.begin
  ends = this.end

  inValue: any[] = this.value
  addShow =  false

  form: any = {}

  get scheduletime() {
    return {
      begin: this.begin,
      end: this.end
    }
  }

  onAdd() {
    this.flags = true
    this.$nextTick(() => {
      (this.$refs.addCinemaModel as any).init(this.inValue, this.scheduletime)
    })
  }

  get defaultImg() {
    return 'this.src="' + require('../assets/error.png') + '"'
  }

  columndata(val: any, date: any) {
    this.inValue = val
    this.beg = date.begin
    this.ends = date.end
  }

  onSet(id: number) {
  }

  formatDate(data: any) {
    const years = data + ''
    if (data && years.length == 4) {
      return `${(data + '').slice(0, 4)}年`
    }
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  async del(id: number) {
    const index = this.inValue.findIndex(it => it.id == id)
    this.inValue.splice(index, 1)
  }

  @Watch('value')
  watchValue(val: any[]) {
    this.inValue = val
  }

  @Watch('form', {deep: true})
  watchForm(val: any) {
    this.$emit('donefilm', val)
  }

  @Watch('scheduletime', {deep: true})
  watchScheduletime(val: any) {
    this.$emit('donetime', val)
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

  @Watch('begin', { deep: true })
  watchBegin(val: any) {
    this.beg = val
  }

  @Watch('end', { deep: true })
  watchEnd(val: any) {
    this.ends = val
  }

}
</script>

<style lang="less" scoped>
.reject-cinema {
  min-height: 200px;
}
.film-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 20px;
  .film-item {
    width: calc(50% - 20px);
    height: 179px;
    padding-bottom: 5px;
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    border: 1px solid #d1d8db;
    color: #00202d;
    .film-cover-box {
      display: flex;
      margin-top: 30px;
      .film-title {
        font-size: 14px;
        height: 24px;
        width: 146px;
        font-weight: 400;
        margin-left: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .film-time {
        margin-left: 20px;
        height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 180px;
      }
      img {
        margin-left: 20px;
        width: 89px;
        height: 125px;
      }
    }
  }
  .list-active {
    background: #00202d;
    position: relative;
    color: #fff;
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
.check-item {
  position: relative;
  top: 3px;
  min-width: 60px;
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
.check-ra {
  /deep/ .ivu-checkbox {
    display: none;
  }
  /deep/&.ivu-checkbox-wrapper-checked {
    color: #fff;
    background-color: #00202d;
    border: 1px solid #00202d;
  }
}
.check-films {
  margin-left: 10px;
  margin-bottom: 20px;
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
