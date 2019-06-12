<template>
  <div class="kol-page">
    <h3 class="kol-title">KOL列表</h3>
    <Header v-model="type" :invalue="acount" />
    <div>
      <Form :model="form" ref="dataform" label-position="left" :label-width="100" class="edit-input forms">
        <div class="check-detail">
          <FormItem label="账号类别"  class="form-item-type">
            <RadioGroup  v-model="form.accountCategoryCode" class="item-radio-top">
              <Radio :disabled="acount==2" class="check-item form-item-first" :label="0">不限</Radio>
              <Radio :disabled="acount==2" v-for="it in accountList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="粉丝数量"  class="form-item-type">
            <RadioGroup  v-model="form.fansRangCode" class="item-radio-top">
              <Radio :disabled="acount==2" class="check-item form-item-first" :label="0">不限</Radio>
              <Radio :disabled="acount==2" v-for="it in fansList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="地域分布"  class="form-item-type">
            <RadioGroup  v-model="area" class="item-radio-top">
              <Radio :disabled="acount==2" @click.native="areabox(false)" class="check-item form-item-first" :label="0">不限</Radio>
              <Radio :disabled="acount==2" @click.native="areabox(true)" class="check-item" :label='1'>指定区域</Radio>
            </RadioGroup>
          </FormItem>
          <div v-if="areaShow" class="area-box">
            <FormItem :label-width="0"  class="">
              <CheckboxGroup v-model="areacode">
                <Checkbox :disabled="acount==2" v-for="(it, index) in areaLists" :key="index" :label="it.id">{{it.nameCn}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <Button type="primary" class="button-ok" @click="sure()">确定</Button>
          </div>
          <FormItem label="价格区间"  class="form-item-type">
            <RadioGroup  v-model="form.priceRangCode" class="item-radio-top">
              <Radio :disabled="acount==2" class="check-item form-item-first" :label="0">不限</Radio>
              <Radio :disabled="acount==2" v-for="it in priceList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="受众性别"  class="form-item-type">
            <RadioGroup  v-model="form.sex" class="item-radio-top">
              <Radio :disabled="acount==2" class="check-item form-item-first" :label="-1">不限</Radio>
              <Radio :disabled="acount==2" v-for="it in sexList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
            </RadioGroup>
          </FormItem>
        </div>
        
        <div class="acount-box">
          <div class="acount">
            <span @click="allcollects(1)" :class="acount == 1 ? 'active' : ''">
              全部账号
            </span>
            <span @click="allcollects(2)" :class="acount == 2 ? 'active' : ''">我的收藏</span>
          </div>
          <span class="content-set">平均数量以近90天的内容计算</span>
          <span class="content-set">数据更新日期2019-04-28</span>
          <FormItem  class="form-name">
            <Input :disabled="acount == 2" style="width: 300px" v-model="form.name" suffix="ios-search" :placeholder="nameList[type]" />
          </FormItem>
        </div>
      </Form>

    <div class="list-box">
      <div class="list-table">
        <Table width="1130px" :loading="loading" @on-sort-change="sortTable" :columns="columns" :data="tabledata">
          <template slot-scope="{ row }" slot="name">
            <div class="table-name">
              <div class="to-detail" @click="$router.push({name: 'kol-figure', params: {id: row.kolId}})">
                <img :src="row.image" alt=""> 
                 <span>{{row.name}}</span>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="type">
            {{row.typeName}}
          </template>
          <template slot-scope="{ row }" slot="read">
            <div style="text-align:center">
              <span>{{formatNum(row.avgReadCount)}}w+</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="flansNumber">
            {{formatNum(row.followersCount)}}
          </template>
          <template slot-scope="{ row }" slot="flansFace">
            <div>
              <p class="flans-box">
                <span>男性：</span>  <span>{{row.maleFans}}%</span>
              </p>
              <p class="flans-box">
                <span>女性：</span>  <span>{{row.femaleFans}}%</span>
              </p>
              <div>
                <a @click="viewArea(row.areaId, row.id)" >查看地域</a>
                <AreaModal v-show="handleShow" v-clickoutside="handleClose" v-if="row.id == areaIdshow" class="flans-modeal" :id="row.id" />
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="discuss">
            <div style="text-align:center">
              <span>{{formatNum(row.avgCommentsCount)}}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="like">
            <div style="text-align:center">
              <span>{{formatNum(row.avgAttitudesCount)}}w+</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="transmit">
            <div style="text-align:center">
              <span>{{formatNum(row.avgRepostsCount)}}w+</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="price">
            <div v-if="row.prices">
              <p v-for="it in row.prices" :key="it" style="margin-top: 5px">
                {{it}}
              </p>
            </div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="table-action">
              <p v-if="row.putStatus == 1" @click="debounce(row, $event, 1000)">
                <Icon type="md-add-circle" style="margin-top: 5px; font-size: 17px; color: #CA7273" />
                加入投放
              </p>
              <p v-else @click="cancelShop(row)">
                <Icon type="md-add-circle" style="margin-top: 5px;font-size: 17px; color: #001F2C; opacity: .3" />
                取消投放
              </p>
              <p v-if="!row.collected" @click="collects(row.id)">
                <Icon type="md-heart" style="margin-top: 5px;font-size: 17px; color: #CA7273" />
                收藏
              </p>
              <p v-else @click="cancelcollects(row.id)">
                <Icon type="md-heart" style="margin-top: 5px;font-size: 17px; color: #001F2C; opacity: .3" />
                取消收藏
              </p>
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
        :page-size-opts="[10, 20, 50, 100]"
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
import { titleMsgList, areaList, kolmsglist, addcollet, cancelcollect, allcollect, addShopIng } from '@/api/kolList.ts'
import AreaModal from './areaModal.vue'
import clickoutside from './directive'
import { formatCurrency } from '@/fn/string'
import Detail from './detail.vue'
import { animation } from '@/fn/self.ts'
import jsxReactToVue from '@/util/jsxReactToVue'
import { clean } from '@/fn/object.ts'

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
const defaultForm: any = {
  channelCode: 'weibo',
  accountCategoryCode: 0,
  fansRangCode: 0,
  sex: -1,
  priceRangCode: 0,
  areaIds: [0],
  name: '',
  pageIndex: 1,
  pageSize: 10
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
  type: any = 0
  total = 0
  areaId = 0
  areaIdshow = -1
  radiusUrl = ''
  loading: boolean = false
  form: any = {
    ...defaultForm
  }
  acount = 1
  checkDetail = false
  checkCount = 0
  checkPeople = 0
  area = 0
  accountList: any = []
  fansList: any = []
  sexList: any = []
  priceList: any = []
  areaLists: any = []
  kolType: any = 1
  detail = false
  handleShow = false
  tabledata: any = []
  nameList: any = ['微博名', '公众号名称', '账号名称', '账号名称', '账号名称', '账号名称', '账号名称']
  left: any = 0
  top: any = 0
  areacode: any = []
  areaShow = false
  title: any = ['weibo', 'wechat', 'douyin', 'xiaohonghsu']

  get columns() {
    const title = ['微博账号', '公众号/微信号', '抖音账号', '快手账号', '小红书账号', '全部账号', '全部账号']
    return [
      {
        title: title[this.type],
        minWidth: 110,
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
        key: 'followersCount',
        slot: 'flansNumber',
        sortable: 'custom'
      },
      {
        title: '粉丝画像',
        align: 'center',
        minWidth: 40,
        slot: 'flansFace'
      },
      {
        title: '平均阅读数',
        minWidth: 51,
        align: 'left',
        key: 'avgReadCount',
        slot: 'read',
        sortable: 'custom'
      },
      {
        title: '平均评论数',
        minWidth: 51,
        align: 'left',
        slot: 'discuss',
        key: 'avgCommentsCount',
        sortable: 'custom',
      },
      {
        title: '平均点赞数',
        minWidth: 51,
        align: 'left',
        slot: 'like',
        key: 'avgAttitudesCount',
        sortable: 'custom'
      },
      {
        title: '平均转发数',
        align: 'left',
        minWidth: 51,
        key: 'avgRepostsCount',
        slot: 'transmit',
        sortable: 'custom'
      },
      {
        title: '投放价格',
        align: 'left',
        minWidth: 70,
        slot: 'price',
        renderHeader: (hh: any, { row }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class='row-acts'>
            <div>投放价格</div>
          </div>
          /* tslint:enable */
        }
      },
      {
        title: '操作',
        width: 90,
        align: 'left',
        slot: 'action'
      }
    ]
  }

  areabox(check: boolean) {
    this.areaShow = check
  }

  formatNum(data: any) {
    return data ? formatCurrency(data, 0) : 0
  }

  created() {
    this.init()
    this.seach()
    this.KolSeach()
  }

  viewArea(areaId: any, id: any) {
    this.handleShow = true
    this.areaIdshow = id
  }

  handleClose(e: any) {
    this.areaIdshow = -1
  }

  async seach() {
    try {
      const { data: {
        channelAccountCategoryList,
        channelFansCountList,
        sexList,
        channelPriceList
      } } = await titleMsgList(this.title[this.type])
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
        this.KolSeach(column.key, 'desc')
    } else {
      this.KolSeach(column.key, '')
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
      this.$nextTick(() => {
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
            // await addShopIng({
            //   kolId: row.id,
            //   channelCode: row.
            // })
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
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 加入收藏
  async collects(id: any) {
    try {
      await addcollet({
        channelCode: this.title[this.type],
        channelDataId: id
      })
      this.KolSeach()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 取消收藏
  async cancelcollects(id: any) {
    try {
      await cancelcollect({
        channelCode: this.title[this.type],
        channelDataId: id
      })
      this.KolSeach()
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

  async KolSeach(key?: any, order?: any) {
    this.loading = true
    const query = clean({
      ...this.form,
      accountCategoryCode: this.form.accountCategoryCode == 0 ? '' : this.form.accountCategoryCode,
      fansRangCode: this.form.fansRangCode == 0 ? '' : this.form.fansRangCode,
      sex: this.form.sex == -1 ? '' : this.form.sex,
      priceRangCode: this.form.priceRangCode == 0 ? '' : this.form.priceRangCode,
      areaIds: this.area == 0 && this.form.areaIds.join(',') == 0 ? '' : this.form.areaIds.join(','),
      sortBy: key,
      order
    })
    try {
      const { data: {
        items,
        totalCount
      }} = await kolmsglist(query)
      this.tabledata = items || []
      this.total = totalCount
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async allcollects(count: any) {
    this.acount = count
    if (this.acount == 1) {
      this.KolSeach()
    } else {
      try {
        await allcollect({
          channelCode: this.title[this.type],
          pageIndex: this.form.pageIndex,
          pageSize: this.form.pageSize
        })

      } catch (ex) {
        this.handleError(ex)
      }
    }
  }

  // @Watch('area', { deep: true })
  // watchArea(value: number[], oldValue: number[]) {
  //   // 不限与其他项互斥
  //   keepExclusion(value, oldValue, 0, newValue => {
  //     this.area = newValue
  //   })
  //   if (value.length == 0) {
  //     this.area = [0]
  //   }
  // }

  @Watch('form', { deep: true })
  watchForm(value: any) {
    this.KolSeach()
  }

  @Watch('area')
  watchArea(value: any) {
    if (value == 0) {
      this.form.areaIds = []
    }
  }
  @Watch('type')
  watchType(value: number) {
    if (this.acount == 1) {
      this.form = {
        ...defaultForm,
        channelCode: this.title[value]
      }
      this.seach()
    } else {
      this.allcollects(2)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.to-detail {
  cursor: pointer;
}
/deep/ .ivu-checkbox-wrapper {
  width: 150px;
}
.kol-page {
  padding: 0 30px;
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
  position: absolute;
  margin-bottom: 40px;
  left: 160px;
  right: 40px;
  overflow: auto;
  background: rgba(255, 255, 255, .9);
  border-radius: 5px;
}
.area-box {
  margin: 0 24px;
  margin-top: -20px;
  padding: 20px 30px;
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
    cursor: pointer;
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
  position: relative;
  border-radius: 5px;
  width: 1146px;
  padding-left: 20px;
  padding-right: 20px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 61px;
    border-radius: 5px 5px 0 0;
    background: #f8f8f9;
  }
  /deep/ .ivu-table-header {
    position: relative;
  }
  /deep/ .ivu-table-row {
    border-bottom: 2px solid rgba(255, 255, 255, .4);
  }
}
/deep/ .ivu-table-wrapper {
  width: calc(100% - 19);
  margin: 0;
  min-height: 240px;
  overflow: auto;
  /deep/ .ivu-table-header th {
    height: 60px;
    line-height: 60px;
    span {
      font-size: 14px;
    }
  }
  /deep/ .ivu-table-column-center, /deep/ .ivu-table-column-left {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-row {
    background: rgba(255, 255, 255, 0);
    /deep/ td {
      background: rgba(0, 0, 0, 0);
    }
  }
  /deep/ .ivu-table-tbody {
    color: #001f2c;
  }
  /deep/ .ivu-table-tip td {
    margin-top: 50px;
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
