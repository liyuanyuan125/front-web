<template>
  <Modal v-model='showDlg'
  :transfer='false'
  :width='770'
  :closable='false'
  :mask-closable='false'
  :styles="{top: '30px'}">
    <div class="title">
      <h3>选择影片</h3>
      <i @click="cancel"></i>
    </div>
    <CheckboxGroup v-model="form.types" class="item-radio-top">
      <Checkbox style="width: 220px" class="check-item form-item-first" :label="0">不限</Checkbox>
      <Checkbox class="check-item" v-for="it in movieTypeList" :key="it.key" :label="it.key" >
        <span>{{it.text}}</span>
      </Checkbox>
    </CheckboxGroup>
    <div class="reject-cinema">
      <div class="flex-box search-input">
      </div>
      <div class="detail">
        <ul class="film-list" v-if="data.length > 0">
          <li @click="checkNum(it.id)" v-for="(it, index) in data" :key="index"
            :class="['film-item', !!checkId.includes(it.id + '') ? 'list-active' : '']">
            <div :class="['film-cover-box']">
              <img :src="it.image ? it.image : 'http://img31.mtime.cn/ph/1473/1213473/1213473_290X440X4.jpg'"   class="film-cover">
              <div style='width: 60%;'>
                
                <Tooltip  max-width="200" transfer :content="it.nameCn">
                    <div class="film-title">{{it.nameCn}}</div></Tooltip>
                <div class="film-time">上映时间：{{it.releaseDate}}</div>
                <div class="film-time">
                  <span>{{typelists(movieTypeList, it.type)}}</span>
                  <!-- <span v-for='(its, index) in movieTypeList' :key='index'>
                    <span v-for='(itsem, index) in it.type' :key='index' v-if='its.key == itsem'>{{its.text + ' '}}</span>
                  </span> -->
                </div>
                <Tooltip  max-width="200" transfer :content="it.director.join(' / ')">
                    <div class="film-time">导演: {{it.director.join(' / ')}}</div></Tooltip>
                <Tooltip  max-width="200" transfer :content="it.actor.join(' / ')">
                    <div class="film-time">主演: {{it.actor.join(' / ')}}</div></Tooltip>
              </div>
            </div>
          </li>
        </ul>
       </div>
       <div class="check-films">
         <span @click="checkAll">
          <Checkbox :disabled="data.length > 0 ? false : true" v-model="checkboxall">全选</Checkbox>
          已选择 {{checkObj.length}} 个
         </span>
       </div>
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
    <div slot="footer" class="foot">
        <Button class="foot-cancel-button default-btn" type="info" @click="cancel">取消</Button>
        <Button class="foot-button open-button" type="primary" @click="open">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { searchcinema } from '@/api/popPlan'
import { clean } from '@/fn/object'
import { isEqual } from 'lodash'
import { toast, warning } from '@/ui/modal.ts'
import moment from 'moment'
import { uniq, uniqBy } from 'lodash'
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
@Component
export default class DlgEditCinema extends ViewBase {
  showDlg = false
  total = 0
  form: any = {
    pageIndex: 1,
    pageSize: 4,
    types: [0]
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
    return data ? moment(data).format(timeFormat) : '暂无'
  }

  async init(type: any) {
    (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: hidden'
    this.loading = true
    this.showDlg = true
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

  async seach() {
    try {
      const { data: {
       items,
       movieTypeList,
       totalCount
      } } = await searchcinema(clean({
        ...this.form,
        types: this.form.types[0] == 0 ? '' : this.form.types.join(',')
      }))
      this.data = (items || []).map((it: any) => {
        return {
          ...it,
          releaseDate : String(it.releaseDate).slice(0, 4) + '-' +
          String(it.releaseDate).slice(4, 6) + '-' + String(it.releaseDate).slice(6, 8)
        }
      })
      this.total = totalCount
      this.movieTypeList = movieTypeList || []
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

  // get defaultImg() {
  //   return 'this.src="' + require('http://img31.mtime.cn/ph/1473/1213473/1213473_290X440X4.jpg') + '"'
  // }

  // 当前页
  currentChangeHandle(val: any) {
    this.form.pageSize = val
    this.seach()
  }

  cancel() {
    (document.getElementsByTagName('html')[0] as any).style = 'overflow-y: auto'
    this.showDlg = false
  }

  async cinemaseach() {
    try {
      const {
        data: {

        }
      } = await searchcinema(this.form)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async open() {
    try {
      this.checkId = uniq(this.checkId)
      this.checkObj = uniqBy(this.checkObj, 'id').filter((it: any) => this.checkId.includes(it.id + ''))
      this.$emit('done', [...this.checkObj])
      toast('操作成功')
      this.cancel()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  typelists(val: any, type: any) {
    const maps: any = []
    ; (val || []).forEach((item: any) => {
      if (item) {
        (type || []).forEach((it: any) => {
          if (item.key == it) {
            maps.push(item.text)
          }
        })
      }
    })
    return maps.join(' / ')
  }

  checkAll() {
    this.$nextTick(() => {
      const id = this.data.map((it: any) => it.id)
      this.idO = {}
      if (this.checkboxall) {
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
    })
  }

  checkNum(id?: any) {
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
      ids = ids.filter((item: any) => item != it)
    })
    if (this.data.length > 0) {
      this.checkboxall = ids.length > 0 ? false : true
    } else {
      this.checkboxall = false
    }
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
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(209, 216, 219, 1);
    &::before {
      content: "×";
      font-size: 34px;
      line-height: 36px;
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
  max-height: 500px;
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
  min-height: 400px;
}
.film-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 20px;
  .film-item {
    width: 48%;
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
        font-weight: 400;
        margin-left: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .film-time {
        margin-left: 20px;
        height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
    margin-right: 3.4%;
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
.types::after {
  content: '/';
  display: inline-block;
}
.type-box:only-child .types:not(:last-of-type)::after {
  content: '';
  display: inline-block;
}
/deep/ .ivu-tooltip {
  width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 24px;
  line-height: 24px;
}
</style>
