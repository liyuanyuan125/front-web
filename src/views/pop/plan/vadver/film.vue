<template>
  <div class="component">
    <ul class="film-list">
      <li v-for="(it, index) in inValue" :key="index"
            :class="['film-item']">
          <div :class="['film-cover-box']">
            <span @click="del" class="del">×</span>
            <img :src="it.image" class="film-cover">
            <div>
              <div class="film-title">{{it.nameCn}}</div>
              <div class="film-time" style="margin-top: 10px">上映时间：{{formatDate(it.releaseDate)}}</div>
              <div class="film-time">{{it.type.join(' / ')}}</div>
              <div class="film-time">导演: {{it.director.join(' / ')}}</div>
              <div class="film-time">主演: {{it.actor.join(' / ')}}</div>
            </div>
          </div>
      </li>
      <li class="add-item">
        <div @click="onAdd" v-if="!type">
          <Icon type="md-add" /><span>添加影片</span>
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

const timeFormat = 'YYYY-MM-DD'
@Component ({
  components: {
    AddCFilmModel,
    Img
  }
})
export default class ComponentMain extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Array, default: () => [] }) value!: any[]

  // 判断新增和添加
  @Prop() type: any

  /**
   * 分润单位列表
   */

  /**
   * 是否为影院
   */
  @Prop() incinematype: any

  inValue: any[] = this.value
  addShow =  false

  formatDate(data: any) {
    return data ? moment(data).format(timeFormat) : '暂无'
  }

  onAdd() {
    this.addShow = true
    this.$nextTick(() => {
      (this.$refs.addCinemaModel as any).init(this.inValue)
    })
  }

  columndata(val: any) {
    this.inValue = val
  }

  onSet(id: number) {
  }

  async del(id: number) {
    const index = this.inValue.findIndex(it => it.id == id)
    this.inValue.splice(index, 1)
  }

  @Watch('value')
  watchValue(val: any[]) {
    this.inValue = val
  }

  @Watch('inValue', { deep: true })
  watchInValue(val: any[]) {
    this.$emit('input', val)
  }
}
</script>

<style lang="less" scoped>
.film-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: -15px;
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
        content: '\2716';
        cursor: pointer;
        color: #fff;
        font-size: 18px;
        position: absolute;
        right: -8px;
        top: -38px;
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
</style>
