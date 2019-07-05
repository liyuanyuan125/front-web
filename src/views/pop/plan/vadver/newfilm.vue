<template>
  <div class="reject-cinema">
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
    <!-- <updateschedule ref="updatetime" @done="updatetime" /> -->
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
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { searchcinema, moviefind, moviedate, updatedates } from '@/api/popPlan'
import { clean } from '@/fn/object'
import { isEqual } from 'lodash'
import { toast, warning, confirm } from '@/ui/modal.ts'
import moment from 'moment'
import { uniq, uniqBy } from 'lodash'
import updateschedule from './updateschedule.vue'

const timeFormat = 'YYYY-MM-DD'
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
@Component({
  components: {
    updateschedule
  }
})
export default class DlgEditCinema extends ViewBase {

  @Prop() value: any

  @Prop() begin: any

  @Prop() end: any

  showDlg = false
  total = 0
  form: any = {
    pageIndex: 1,
    pageSize: 4,
  }
  idO: any = {}
  checks: any = {}
  page: any = []
  name: any = []
  loading = false
  checkboxall = false
  movieTypeList: any = []
  data: any = []
  checkId: any = []
  checkObj: any = []

  formatDate(data: any) {
    const years = data + ''
    if (data && years.length == 4) {
      return `${(data + '').slice(0, 4)}年`
    }
    return data
      ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(
          data + ''
        ).substr(6, 2)}`
      : '暂无'
  }

  created() {
    this.seach()
  }

  async init(type: any) {
    this.checks = {}
    if (type.length > 0) {
      this.checkObj = [...type]
      this.checkId = this.checkObj.map((it: any) => it.id)
      this.checkId.forEach((it: any) => {
        this.checks[it] = true
      })
      this.seach()
    } else {
      this.checkObj = []
      this.checkId = []
      this.checkId.forEach((it: any) => {
        this.checks[it] = true
      })
      this.seach()
    }
  }

  typeCinema(type: any) {
    type = type || []
    const maps = this.movieTypeList.filter((it: any) => {
      return type.includes(it.key)
    })
    if (maps.length > 0) {
      return maps.map((it: any) => {
        return it.text
      }).join(' / ')
    } else {
      return '暂无'
    }
  }

  searchList() {
    this.form.pageIndex = 1
    this.seach()
  }

  async seach() {
    try {
      const { data: {
        items,
        typeList,
        totalCount,
        movies
        } } = await moviefind(clean({
          ...this.form,
        }))
      this.data = (movies || []).map((it: any) => {
        return {
          ...it,
          id: it.movie_id,
          image: it.main_pic,
          nameCn: it.name_cn,
          releaseDate: it.release_date,
          type: it.types
        }
      })
      this.total = totalCount
      this.movieTypeList = typeList || []
      this.checkNum()
    } catch (ex) {
      this.handleError(ex)
    }
  }

   // 每页数
  sizeChangeHandle(val: any) {
    this.form.pageIndex = val
    this.seach()
  }

  get defaultImg() {
    return 'this.src="' + require('../assets/error.png') + '"'
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.form.pageSize = val
    this.seach()
  }

  cancel() {
    this.showDlg = false
  }

  async checkAll(flag: any) {
    try {
      const id = this.data.map((it: any) => it.id)
      this.idO = {}
      if (flag) {
        await moviedate({
          ids: id.join(','),
          beginDate: this.begin,
          endDate: this.end
        })
        id.forEach((it: any) => {
          this.idO[it] = true
        })
      } else {
        id.forEach((it: any) => {
          this.idO[it] = false
        })
      }
      this.checks = {
        ...this.checks,
        ...this.idO
      }
    } catch (ex) {
      this.checkboxall = false
      this.handleError(ex)
    }
  }

  async checkNum(id?: any) {
    try {
      if (id) {
        await moviedate({
          ids: id,
          beginDate: this.begin,
          endDate: this.end
        })
      }
      this.checks[id] = !this.checks[id] ? true : false
      this.checkId = []
      let ids = this.data.map((it: any) => it.id)
      for (const i in this.checks) {
        if (this.checks[i]) {
          this.checkId.push(i)
        }
      }
      const nums = this.data.filter((it: any) => {
        return this.checkId.includes(it.id + '')
      })
      this.checkObj.push(...nums)
      this.checkObj = uniqBy(this.checkObj, 'id').filter((it: any) => this.checkId.includes(it.id + ''))
      this.checkId.forEach((it: any) => {
        ids = ids.filter((item: any) => item && item != it)
      })
      if (this.data.length > 0) {
        this.checkboxall = ids.length > 0 ? false : true
      } else {
        this.checkboxall = false
      }
    } catch (ex) {
      const checksid = this.checkId.filter((it: any) => !!it)
      if (checksid.length == 0) {
        await confirm(`是否根据影片上映日期，同步修改广告计划投放排期`, {
          title: '修改档期'
        })
      } else {
        this.handleError(ex)
      }
    }
  }

  @Watch('checkObj', { deep: true})
  watchCheckObj(val: any) {
    this.checkId = uniq(this.checkId)
    const checkObj = uniqBy(this.checkObj, 'id').filter((it: any) => this.checkId.includes(it.id + ''))
    this.$emit('donefilm', [...checkObj])
  }

  @Watch('value', { deep: true})
  watchValue(val: any) {
    this.init(val)
  }

  @Watch('checks', {deep: true})
  watchChecks(val: any) {
    this.checkId = []
    let id = this.data.map((it: any) => it.id)
    for (const i in val) {
      if (val[i]) {
        this.checkId.push(i)
      }
    }
    this.checkId.forEach((it: any) => {
      id = id.filter((item: any) => item == it)
    })
    const nums = this.data.filter((it: any) => {
      return this.checkId.includes(it.id + '')
    })
    this.checkObj.push(...nums)
    this.checkObj = uniqBy(this.checkObj, 'id').filter((it: any) => this.checkId.includes(it.id + ''))
    if (this.data.length > 0) {
      this.checkboxall = id.length > 0 ? false : true
    } else {
      this.checkboxall = false
    }
  }

  @Watch('form.types', { deep: true })
  watchformTypes(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    this.form.pageIndex = 1
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.types = newValue
    })
    if (value.length == 0) {
      this.form.types = [0]
    }
    this.seach()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
// /deep/ .ivu-modal-body {
// }
.title {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #00202d;
  i {
    position: absolute;
    right: -20px;
    top: -20px;
    display: block;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(209, 216, 219, 1);
    &::before {
      content: "×";
      font-size: 34px;
      line-height: 40px;
      text-align: center;
    }
  }
}
.search-input {
  margin-left: 20px;
  .name-input {
    /deep/ .ivu-input {
      padding-left: 20px;
      border-radius: 20px;
      height: 40px;
      line-height: 40px;
      &::placeholder {
        color: #00202d;
      }
    }
  }
  /deep/ .ivu-btn {
    height: 40px;
  }
  /deep/ .ivu-input-suffix i {
    font-size: 20px;
    line-height: 38px;
    margin-right: 20px;
    color: #00202d;
  }
}
@cancel-color: rgba(59, 152, 255, 1);
.detail {
  min-height: 200px;
  overflow: auto;
  margin-top: 16px;
  margin-left: 20px;
  color: rgba(152, 152, 152, 1);
  cursor: pointer;
}
.foot-button-box {
  width: 196px;
  height: 50px;
  margin-right: 20px;
}
.foot {
  text-align: center;
  height: 60px;
  .foot-button {
    .foot-button-box;
  }
}
/deep/ .ivu-table-wrapper {
  margin-top: 10px;
}
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
.default-btn {
  width: 100px;
  vertical-align: middle;
  .button-style(#00202d, rgba(0, 0, 0, 0));
  border-radius: 25px;
  img {
    vertical-align: middle;
  }
}
.open-button {
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.film-no {
  text-align: center;
  padding-top: 50px;
}
</style>
