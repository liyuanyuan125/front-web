<template>
  <div class="kol-page">
    <h3 class="kol-title">KOL列表</h3>
    <Header v-model="type"/>
    <div>
      <Form :model="form" ref="dataform" label-position="left" :label-width="100" class="edit-input forms">
        <div class="check-detail">
          <FormItem label="账号类别"  class="form-item-type">
            <RadioGroup  v-model="form.accountCategoryCode" class="item-radio-top">
              <Radio class="check-item form-item-first" :label="0">不限</Radio>
              <Radio  v-for="it in accountList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="粉丝数量"  class="form-item-type">
            <RadioGroup  v-model="form.fansRangCode" class="item-radio-top">
              <Radio class="check-item form-item-first" :label="0">不限</Radio>
              <Radio  v-for="it in fansList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="地域分布"  class="form-item-type">
            <RadioGroup  v-model="area" class="item-radio-top">
              <Radio @click.native="areabox(false)" class="check-item form-item-first" :label="0">不限</Radio>
              <Radio @click.native="areabox(true)" class="check-item" :label='1'>指定区域</Radio>
            </RadioGroup>
          </FormItem>
          <div v-if="areaShow" class="area-box">
            <FormItem :label-width="0"  class="">
              <CheckboxGroup v-model="areacode">
                <Checkbox v-for="(it, index) in areaLists" :key="index" :label="it.id">{{it.nameCn}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <Button type="primary" class="button-ok" @click="sure()">确定</Button>
          </div>
          <FormItem label="价格区间"  class="form-item-type">
            <RadioGroup  v-model="form.priceRangCode" class="item-radio-top">
              <Radio class="check-item form-item-first" :label="0">不限</Radio>
              <Radio  v-for="it in priceList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="受众性别"  class="form-item-type">
            <RadioGroup  v-model="form.sex" class="item-radio-top">
              <Radio class="check-item form-item-first" :label="-1">不限</Radio>
              <Radio  v-for="it in sexList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>
        </div>
        
        <div class="acount-box">
          <div class="acount">
            <span :class="acount == 1 ? 'active' : ''">全部账号</span>
            <span :class="acount == 2 ? 'active' : ''">全部收藏</span>
          </div>
          <span class="content-set">平均数量以近90天的内容计算</span>
          <span class="content-set">数据更新日期2019-04-28</span>
          <FormItem  class="form-name">
            <Input style="width: 300px" v-model="form.name" suffix="ios-search" :placeholder="nameList[type]" />
          </FormItem>
        </div>
      </Form>

    <div class="list-box">
      <div class="list-table">
        <Table :loading="loading" @on-sort-change="sortTable" :columns="columns" :data="tabledata">
          <template slot-scope="{ row }" slot="name">
            <div class="table-name">
              <img :src="row.mainPicUrl" alt=""> 
              <span>{{row.name}}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="type">
            {{row.type.join('/')}}
          </template>
          <template slot-scope="{ row }" slot="read">
            {{row.read}}w+
          </template>
          <template slot-scope="{ row }" slot="flansNumber">
            {{row.fansNumber}}
          </template>
          <template slot-scope="{ row }" slot="flansFace">
            <div v-show="row.fansList.length > 0">
              <p v-for="it in row.fansList" :key="it.sex" class="flans-box">
                <span style="margin-left: 10px">{{it.sex}}</span>  <span>{{it.percent}}</span>
              </p>
              <div>
                <a @click="viewArea(row.id)" >查看地域</a>
                <AreaModal v-show="handleShow" v-clickoutside="handleClose" v-if="row.id == areaId" class="flans-modeal" :id="row.id" />
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="discuss">
            {{row.discuss}}
          </template>
          <template slot-scope="{ row }" slot="like">
            {{row.like}}
          </template>
          <template slot-scope="{ row }" slot="transmit">
            {{row.transmit}}
          </template>
          <template slot-scope="{ row }" slot="price">
            {{row.price}}
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="table-action">
              <p v-if="row.putStatus == 1" @click="debounce(row, $event, 1000)">加入投放</p>
              <p v-else>取消投放</p>
              <p v-if="row.likeStatus == 1" @click="debounce(row, $event, 1000)">收藏</p>
              <p v-else>取消收藏</p>
              <div v-if="row.putStatus == 1" :ref="'small' + row.id" class="radiu-url">
                <img src="http://seopic.699pic.com/photo/50035/0520.jpg_wh1200.jpg" />
              </div>
            </div>
          </template>
        </Table>
      </div>
      

      <Page :total="total" v-if="total>0" class="btnCenter"
        :current="form.pageIndex"
        :page-size="form.pageSize"
        :page-size-opts="[6, 20, 50, 100]"
        show-total
        show-sizer
        show-elevator
        @on-change="sizeChangeHandle"
        @on-page-size-change="currentChangeHandle"/>
      </div>
      <Detail ref='detailbox' v-model="type" @done="checkDetailSet" />
    </div>
    
    <div>
      <div v-show="checkDetail || checkCount > 0" class="check-box">
      <div></div>
        <div class="check-title">已选择<span ref="end"> {{checkCount}} </span>个，总粉丝数：{{checkPeople}}万+
          <Icon @click="detailShow" type="ios-arrow-up" class="ios-type" />
        </div>
        <div>
          <Button type="primary" class="button-ok" @click="next()">立即绑定</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Header from './header.vue'
import { cloneDeep } from 'lodash'
import { titleMsgList, areaList, kolmsglist } from '@/api/kolList.ts'
import AreaModal from './areaModal.vue'
import clickoutside from './directive'
import Detail from './detail.vue'
import { animation } from '@/fn/self.ts'
import jsxReactToVue from '@/util/jsxReactToVue'

// 保持互斥
const keepExclusion = <T extends any>(
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
@Component({
  components: {
    Header,
    AreaModal,
    Detail
  },
  directives: {
    clickoutside
  }
})
export default class Main extends ViewBase {
  time = 0
  type: number = 0
  total = 0
  areaId = 0
  radiusUrl = ''
  loading: boolean = false
  form: any = {
    channelCode: 'weibo',
    accountCategoryCode: 0,
    fansRangCode: 0,
    sex: -1,
    priceRangCode: 0,
    areaIds: [0],
    // name: '',
    pageIndex: 1,
    pageSize: 10
  }
  acount = 1
  checkDetail = false
  checkCount = 0
  checkPeople = 0
  area = [0]
  accountList: any = []
  fansList: any = []
  sexList: any = []
  priceList: any = []
  areaLists: any = []
  kolType: any = 1
  detail = false
  handleShow = false
  tabledata: any = []
  nameList: any = ['微博名', '公众号名称', '账号名称', '账号名称', '账号名称']
  left: any = 0
  top: any = 0
  areacode: any = []
  areaShow = false

  get columns() {
    const title = ['微博账号', '公众号/微信号', '抖音账号', '快手账号', '小红书账号']
    return [
      {
        title: title[this.type],
        width: 150,
        slot: 'name',
      },
      {
        title: '账号分类',
        minWidth: 40,
        align: 'left',
        slot: 'type'
      },
      {
        title: '粉丝数',
        align: 'left',
        minWidth: 40,
        slot: 'flansNumber'
      },
      {
        title: '粉丝画像',
        align: 'left',
        minWidth: 40,
        slot: 'flansFace'
      },
      {
        title: '平均阅读数',
        minWidth: 51,
        align: 'left',
        slot: 'read'
      },
      {
        title: '平均评论数',
        minWidth: 51,
        align: 'left',
        slot: 'discuss',
        sortable: 'custom'
      },
      {
        title: '平均点赞数',
        minWidth: 51,
        align: 'left',
        slot: 'like',
        sortable: 'custom'
      },
      {
        title: '平均转发数',
        align: 'left',
        minWidth: 51,
        slot: 'transmit',
        sortable: 'custom'
      },
      {
        title: '投放价格',
        align: 'left',
        minWidth: 40,
        slot: 'price',
        renderHeader: (hh: any, { row }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class='row-acts'>
            <div></div>
          </div>
          /* tslint:enable */
        }
      },
      {
        title: '操作',
        width: 70,
        align: 'left',
        slot: 'action'
      }
    ]
  }

  areabox(check: boolean) {
    this.areaShow = check
  }

  created() {
    this.init()
    this.seach()
    this.KolSeach()
  }

  viewArea(id: any) {
    this.handleShow = true
    this.areaId = id
  }

  handleClose(e: any) {
    this.areaId = 0
  }

  async seach() {
    try {
      const { data: {
        channelAccountCategoryList,
        channelFansCountList,
        sexList,
        channelPriceList

      } } = await titleMsgList('weibo')
      const data: any = await areaList({
        parentIds: 0,
        pageIndex: 1,
        pageSize: 10000
      })
      this.accountList = channelAccountCategoryList
      this.fansList = channelFansCountList
      this.sexList = sexList
      this.areaLists = (data.data.items || []).map((it: any) => {
        return {...it, id: Number(it.id)}
      })
      this.priceList = channelPriceList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async init() {
    // try {
    //   const { data } = await queryList({})
    //   this.accountList = data.accountList
    //   this.fansList = data.fansList
    //   this.sexList = data.sexList
    //   this.priceList = data.priceList
    //   this.tabledata = data.items
    //   this.total = 20
    // } catch (ex) {
    //   this.handleError(ex)
    // }
  }

  sure() {
    const areaId = cloneDeep(this.areacode)
    this.form.areaIds = areaId.map((it: any) => {
      return Number(it)
    })
    this.areaShow = false
  }
  async sortTable(column: any) {
    if (column.order == 'desc') { // 降序

    } else {

    }
  }

   // 每页数
  sizeChangeHandle(val: any) {
    this.form.pageIndex = val
    this.init()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.form.pageSize = val
    this.init()
  }

  debounce(row: any, e: any, delay: any) {
    const prev: any = Date.now()
    this.checkDetail = true
    if ( prev - this.time > 1000) {
      this.put(row, e)
      this.time = Date.now()
    }
  }

  mounted() {
    const end: any  = this.$refs.end
    this.left = end.getBoundingClientRect().left
    this.top = end.getBoundingClientRect().top
  }

  async put(row: any, e: any) {
    try {
      const dom: any   = this.$refs[`small${row.id}`]
      const id = row.id
      const x = e.clientX
      const y = e.clientY
      const end: any  = this.$refs.end
      this.checkDetail = true
      const left = end.getBoundingClientRect().left || window.screen.width / 3 + 100
      const top = end.getBoundingClientRect().top || window.screen.availHeight - 120
      dom.style.cssText = `left: ${x }px; top: ${ y - 80}px; display: block`
      animation(dom, {
          left: `${left - 10}px`,
          top: `${top }px`,
          height: '30px',
          width: '30px'
        },
        1000,
        'easeBoth',
        async () => {
          this.tabledata = this.tabledata.map((it: any) => {
            return {
              ...it,
              putStatus: it.id == id ? 0 : 1
            }
          })
          this.checkCount ++
          this.checkPeople += row.fansNumber
          dom.style.cssText = `display: block`
        }
      )
    } catch (ex) {
      this.handleError(ex)
    }
  }

  detailShow() {
    this.$nextTick(() => {
      (this.$refs.detailbox as any).init()
    })
  }

  checkDetailSet(val: any) {
  }

  async KolSeach() {
    const query = {
      ...this.form,
      accountCategoryCode: this.form.accountCategoryCode,
      fansRangCode: this.form.fansRangCode,
      sex: Number(this.form.sex),
      priceRangCode: this.form.priceRangCode,
      areaIds: this.form.areaIds.join(',')
    }
    try {
      await kolmsglist(query)
    } catch (ex) {

    }
  }


  @Watch('area', { deep: true })
  watchArea(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.area = newValue
    })
    if (value.length == 0) {
      this.area = [0]
    }
  }

  @Watch('form', { deep: true })
  watchForm(value: any) {
    this.KolSeach()
  }

  // @Watch('type')
  // watchType(value: number) {
  //   this.form = {
  //     ...this.from
  //   }
  // }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.kol-page {
  padding: 0 40px;
}
.kol-title {
  text-align: center;
  font-size: 22px;
  color: #fff;
  font-weight: normal;
  line-height: 60px;
}
.title {
  text-align: center;
  font-size: 26px;
  margin-top: 40px;
}
.item-top {
  margin-left: 30px;
}
.check-detail {
  background: rgba(0, 31, 44, .6);
  padding-top: 20px;
  /deep/ .ivu-form-item-label {
    color: #fff;
  }
  .form-item-type {
    margin-left: 30px;
    margin-right: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, .4);
    padding-bottom: 20px;
  }
  .form-item-type:last-child {
    border-bottom: 0;
  }
}
.audit {
  text-align: center;
  height: 300px;
  line-height: 300px;
}
.audit-btn {
  text-align: center;
}
.list-box {
  background: #fff;
  border-radius: 5px;
}
.area-box {
  margin: 0 24px;
  margin-top: -20px;
  padding: 20px 0;
  background: rgba(255, 255, 255, .7);
  min-height: 140px;
  position: relative;
  /deep/ .ivu-Radio-wrapper {
    margin-left: 20px;
    width: 144px;
  }
  .button-ok {
    position: absolute;
    right: 20px;
    bottom: 10px;
    width: 60px;
    height: 34px;
    font-size: 14px;
    border-radius: 5px;
    .button-style(#fff, #00202d);
  }
}
.acount-box {
  display: flex;
  margin-top: 30px;
  margin-bottom: 30px;
  position: relative;
  .acount {
    border-right: 2px solid #fff;
    span {
      font-weight: bold;
      color: #fff;
      line-height: 19px;
      font-size: 14px;
      margin-right: 40px;
      padding-bottom: 4px;
    }
    .active {
      border-bottom: 2px solid #fff;
    }
  }
  .content-set {
    font-size: 14px;
    margin-left: 40px;
  }
  .form-name {
    position: absolute;
    right: -25px;
    top: -8px;
    /deep/ .ivu-input {
      background: rgba(255, 255, 255, .8);
      &::placeholder {
        color: #001f2c;
      }
    }
    /deep/ .ivu-input-suffix i {
      font-size: 24px;
      line-height: 40px;
    }
  }
}
.check-item {
  position: relative;
  top: 3px;
  min-width: 80px;
  height: 30px;
  line-height: 30px;
  border-radius: 2px;
  text-align: center;
  margin-right: 15px;
  font-size: 14px;
  color: rgba(255, 255, 255, .6);
  user-select: none;
  /deep/ .ivu-radio {
    display: none;
  }
  /deep/&.ivu-radio-wrapper-checked {
    color: #000;
    font-weight: 500;
    border-color: #82d1e4;
    background-color: #82d1e4;
  }
}
.form-name {
  float: right;
  margin-right: 30px;
  border-radius: 3px;
}
.radiu-url {
  position: fixed;
  z-index: 999;
  width: 40px;
  height: 40px;
  display: none;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
/deep/ .edit-input .ivu-form-item-content .ivu-input-wrapper input {
  border-radius: 5px;
}
.list-table {
  background: #fff;
  border-radius: 5px;
  padding-left: 20px;
  padding-right: 20px;
  &::before {
    content: '';
    position: absolute;
    left: 170px;
    right: 50px;
    height: 61px;
    background: #f8f8f9;
  }
  /deep/ .ivu-table-header {
    position: relative;
  }
  /deep/ .ivu-table-row {
    border-bottom: 2px solid #f8f8f9;
  }
}
/deep/ .ivu-table-wrapper {
  width: calc(100%);
  margin: 0;
  position: initial !important;
  /deep/ .ivu-table-header th {
    height: 60px;
    line-height: 60px;
    span {
      font-size: 14px;
    }
  }
  /deep/ .ivu-table-cell {
    padding-right: 10px;
    padding-left: 10px;
  }
  .table-action {
    p {
      cursor: pointer;
    }
  }
  .table-name {
    display: flex;
    padding: 20px 0;
    align-items: center;
    img {
      height: 60px;
      width: 60px;
      border-radius: 50%;
    }
    span {
      margin-left: 10px;
    }
  }

  .flans-modeal {
    position: absolute;
    margin-left: 60px;
    z-index: 999;
    margin-top: -130px;
  }
}
.btnCenter {
  margin-top: 30px;
  padding-bottom: 30px;
}
.check-box {
  position: fixed;
  left: 120px;
  right: 0;
  bottom: 0;
  z-index: 990;
  height: 80px;
  line-height: 80px;
  background: rgba(0, 0, 0, .6);
  display: flex;
  .check-title {
    color: #fff;
    font-size: 18px;
    margin-left: 30%;
  }
  .ios-type {
    cursor: pointer;
    font-size: 24px;
    margin-left: 20px;
  }
  .button-ok {
    margin-left: 100px;
  }
}
</style>
