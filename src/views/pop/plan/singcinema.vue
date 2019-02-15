<template>
  <div class="page">
    <Form :model="form" label-position="left" :label-width="100" class="edit-input forms">
      <FormItem :label="data.name" class="form-item-film-type">
        <CheckboxGroup v-model="types" class="float">
          <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
          <Checkbox
            v-for="it in data.values"
            :key="it.key"
            :label="it.key"
            class="check-item">
              {{it.text}}
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="上映时间" class="form-item-film-type">
        <CheckboxGroup v-model="releaseTime" class="float">
          <Checkbox class="check-item" :label="0">不限</Checkbox>
          <Checkbox
            :label="1"
            class="check-item">
            指定时间段
          </Checkbox>
        </CheckboxGroup>
        <DatePicker v-model="showTime" v-if="releaseTime != 0" type="daterange" placeholder="请选择上映时间"></DatePicker>
      </FormItem>

      <FormItem label="选择影片" class="form-item-film-name">
        <Input
        v-model="form.name"
        class="input-film-name"
        placeholder="输入影片名字"
        @on-search="cinemaFind"
        search
        enter-button
        />
      </FormItem>
    </Form>
    <div class="flex-box">
      <p class="single-length" v-if="length > 0">已为您匹配以下{{length}}部影片：</p>
      <!-- <p class="red">已选中{{cinemaIdArray.length}}部影片</p> -->
    </div>
    
    <ul class="single-film-list" v-if="length > 0">
      <li v-for="(it, index) in cinemaList" :key="index" @click="selectFilm(it.id)"
      :class="['single-film-item']">
      <div class="cinema-check" v-if="cinemaIdArray.includes(it.id)"></div>
      <div class="single-cover-box">
        <!-- <b :class="`img-rank${index + 1}`"></b> -->
        <img :src="it.mainPicUrl" class="film-cover">
        <div class="film-date">上映时间：{{formatDate(it.date)}}</div>
      </div>
      <h4 class="film-name">{{it.name}}</h4>
      <div class="film-tags">{{it.type.join(',')}}</div>
      </li>
    </ul>
    <!-- :current="form.pageIndex" -->
    <Page :total="length" v-if="length>0" class="btnCenter"
      :page-size="form.pageSize"
      :page-size-opts="[8, 12, 16, 24]"
      show-total
      show-sizer
      show-elevator
      @on-change="sizeChangeHandle"
      @on-page-size-change="currentChangeHandle"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinemaList } from '@/api/popPlan.ts'
import { clean } from '@/fn/object'
import moment from 'moment'
import { info } from '@/ui/modal.ts'

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

const timeFormat = 'YYYYMMDD'
const timeFormats = 'YYYY-MM-DD'

@Component
export default class Main extends ViewBase {
  @Prop({type: Object, default: () => {}}) data!: any
  @Prop({type: Object, default: () => {}}) value!: any
  releaseTime = [0]
  form: any = {
    name: !!this.value.name ? this.value.name : '',
    pageSize: 8
  }
  cinemaList: any = []
  showTime: any = []
  types = [0]
  length = 0

  cinemaIdArray: any = []

  get ItemIdArray() {
    return this.cinemaList.length > 0 ? this.cinemaList.map((it: any) => it.id) : []
  }

  get parents() {
    return {
      id: this.cinemaIdArray,
      name: this.form.name,
      startTime: this.showTime[0] ? Number(moment(this.showTime[0]).format(timeFormat)) : '',
      endTime: this.showTime[1] ? Number(moment(this.showTime[1]).format(timeFormat)) : '',
      types: this.types
    }
  }
  created() {
    this.cinemaFind()
    if (this.value.id) {
      this.selectFilm(this.value.id)
    }
  }

  async cinemaFind() {
    try {
      let startTime = null
      let endTime = null
      if (this.releaseTime) {
        startTime = this.showTime[0] ? Number(moment(this.showTime[0]).format(timeFormat)) : ''
        endTime = this.showTime[1] ? Number(moment(this.showTime[1]).format(timeFormat)) : ''
      }
      const query = {
        startTime,
        endTime,
        ...this.form,
        types: this.types.includes(0) ? '' : this.types.join(',')
      }
      const {
        data: {
          data: {
            items,
            totalCount
          }
        }
      } = await cinemaList(clean(query))
      this.cinemaList = items || []
      this.length = totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  formatDate(data: any) {
    return moment(data).format(timeFormats)
  }

   // 每页数
  sizeChangeHandle(val: any) {
    // this.form.pageIndex = val
    // this.cinemaFind()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.form.pageSize = val
    this.cinemaFind()
  }

  selectFilm(id: any) {
    this.cinemaIdArray = [id]
    // if (!this.cinemaIdArray.includes(id)) {
    //   this.cinemaIdArray.push(id)
    // } else {
    //   this.cinemaIdArray = this.cinemaIdArray.filter((it: any) => it != id )
    // }
  }
  @Watch('releaseTime', { deep: true })

  watchreleseTime(value: any, oldValue: any) {
    keepExclusion(value, oldValue, 0, newValue => {
      this.releaseTime = newValue
    })
    if (value.length == 0) {
      this.releaseTime = [0]
    }
  }

  @Watch('types', { deep: true })

  watchtypes(value: any, oldValue: any) {
    if (value.length > 3) {
      info('电影类型最多选3项')
      this.types = value.slice(0, 3)
    } else {
      keepExclusion(value, oldValue, 0, newValue => {
        this.types = newValue
      })
      if (value.length == 0) {
        this.types = [0]
      }
    }
  }

  @Watch('parents', { deep: true })

  watchparents(value: any, oldValue: any) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
@import './ggadd.less';
.form-item-film-type {
  /deep/ .ivu-date-picker, /deep/ .ivu-input-wrapper {
    width: 210px;
  }
}
.cinema-check {
  position: absolute;
  left: -5px;
  right: -5px;
  top: -5px;
  bottom: -5px;
  z-index: 8;
  border: 5px solid #fe8135;
  background: url('./assets/crown.png') no-repeat top right;
}
.single-length {
  margin-left: 30px;
  margin-bottom: 20px;
}
.red {
  position: absolute;
  right: 50px;
  color: red;
}
.btnCenter {
  margin-bottom: 24px;
}
</style>
