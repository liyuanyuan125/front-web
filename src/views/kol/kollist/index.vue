<template>
  <div class="kol-page">
    <h3 class="kol-title">KOL列表</h3>
    <Header v-model="type" :invalue="acount" />
    <div>
      
      <Form :model="form" ref="dataform" label-position="left" :label-width="100" class="edit-input forms">
        <div class="check-detail">
          <FormItem label="账号类别"  class="form-item-type">
            <RadioGroup  v-model="form.accountCategoryCode" class="item-radio-top">
              <Tooltip trigger="hover"  content="content">
                <Radio :disabled="acount==2" class="check-item form-item-first" :label="0">不限</Radio>
                <Radio :disabled="true" v-if="it.controlStatus != 2"  v-for="it in accountList" :key="it.key" :label="it.key"
                  class="check-item">{{it.text}}</Radio>
                <div slot="content">
                    <span>免费用户暂不支持筛选</span>
                </div>
              </Tooltip>
            </RadioGroup>
          </FormItem>
          <FormItem label="粉丝数量"  class="form-item-type">
            <RadioGroup  v-model="form.fansRangCode" class="item-radio-top">
              <Tooltip trigger="hover"  content="content">
              <Radio :disabled="acount==2" class="check-item form-item-first" :label="0">不限</Radio>
              <Radio :disabled="true" v-for="it in fansList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
                <div slot="content">
                    <span>免费用户暂不支持筛选</span>
                </div>
              </Tooltip>
            </RadioGroup>
          </FormItem>
          <FormItem label="地域分布"  class="form-item-type">
            <RadioGroup  v-model="area" class="item-radio-top">
              <Radio :disabled="acount==2" @click.native="areabox(false)" class="check-item form-item-first" :label="0">不限</Radio>
              <Tooltip trigger="hover"  content="content">
              <Radio :disabled="true" class="check-item" :label='1'>指定区域</Radio>
              <div slot="content">
                    <span>免费用户暂不支持筛选</span>
                </div>
              </Tooltip>
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
              <Tooltip trigger="hover"  content="content">
              <Radio :disabled="true" v-for="it in priceList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
                <div slot="content">
                    <span>免费用户暂不支持筛选</span>
                </div>
              </Tooltip>
            </RadioGroup>
          </FormItem>
          <FormItem label="受众性别"  class="form-item-type">
            <RadioGroup  v-model="form.sex" class="item-radio-top">
              <Radio :disabled="acount==2" class="check-item form-item-first" :label="-1">不限</Radio>
              <Tooltip trigger="hover"  content="content">
              <Radio :disabled="true" v-for="it in sexList" :key="it.key" :label="it.key"
                class="check-item">{{it.text}}</Radio>
                <div slot="content">
                    <span>免费用户暂不支持筛选</span>
                </div>
              </Tooltip>
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
          <span class="content-set">数据更新日期{{times}}</span>
          <FormItem  class="form-name">
            <div class="flex-box search-border-left" style="width: 100%">
              <Input :disabled="acount == 2" style="width: 250px" v-model="form.name" :placeholder="nameList[type]"/>
              <Button type="primary" class="bth-search" >
                <Icon type="ios-search" size="22"/>
              </Button>
            </div>
          </FormItem>
        </div>
      </Form>

    <div class="list-box">
      <div class="list-table">
        <Table width="1130px" :loading="loading" @on-sort-change="sortTable" :columns="columns" :data="tabledata">
          <template slot-scope="{ row }" slot="name">
            <div class="table-name">
              <div class="to-detail" @click="$router.push({ name: 'kol-figure', params: { id: row.kolId, channel: row.channelCode }})">
                <img v-if="acount == 1" width="30px" height="30px" :src="row.image" alt="">
                <img v-else width="30px" height="30px" :src="row.headerUrl" alt="">
                <span style='font-weight: bold'>{{row.name}}</span>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="type">
            <div v-if="acount == 1">{{row.typeName}}</div>
            <div v-else>{{row.categoryName}}</div>
          </template>
          <template slot-scope="{ row }" slot="read">
            <div>
              <span v-if="row.avgReadCount">{{formatnumber(row.avgReadCount)}}</span>
              <span v-else>-</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="flansNumber">
            <span v-if="row.followersCount">{{formatnumber(row.followersCount)}}</span>
            <span v-else>-</span>
          </template>
          <template slot-scope="{ row, index }" slot="flansFace">
            <div>
              <p class="flans-box" style="width: 80px">
                <span>男性：</span>
                <span v-if="row.maleFans">{{formatnums(row.maleFans/100, '%')}}</span>
                <span v-else>-</span>
              </p>
              <p class="flans-box" style="width: 80px">
                <span>女性：</span>
                <span v-if="row.femaleFans">{{formatnums(row.femaleFans/100, '%')}}</span>
                <span v-else>-</span>
              </p>
              <div>
                <a @click="viewArea(row.areaId, row.id)" >查看地域</a>
                <AreaModal
                  :style="
                  acount == 1 ? index + 1 == tabledata.length ? 'margin-top: -300px' : ''
                  : index == 0 ? 'margin-top: -300px' : ''
                  "
                  v-show="handleShow"
                  v-clickoutside="handleClose"
                  v-if="row.id == areaIdshow"
                  class="flans-modeal"
                  :type='title[type]'
                  :id="row.id" />
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="discuss">
            <div>
              <span v-if="row.avgCommentsCount">{{formatnumber(row.avgCommentsCount)}}</span>
              <span v-else>-</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="like">
            <div>
              <span v-if="row.avgAttitudesCount">{{formatnumber(row.avgAttitudesCount)}}</span>
              <span v-else>-</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="transmit">
            <div>
              <span v-if="row.avgShareCount">{{formatnumber(row.avgShareCount)}}</span>
              <span v-else>-</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="price">
            <div v-if="row.price && row.price.length > 0">
              <Tooltip placement="top">
                <div class="prices">
                  <p v-for="it in row.price" :key="it.key" style="margin-top: 5px">
                    {{it.key}} {{formatnums(it.value, '', '暂无报价', 1)}}
                  </p>
                </div>
                <div slot="content">
                  <p v-for="it in row.price" :key="it.key" style="margin-top: 5px">
                    {{it.key}} {{formatnums(it.value, '', '暂无报价', 1)}}
                  </p>
                </div>
              </Tooltip>
            </div>
            <div v-else>暂无报价</div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="table-action">
              <!-- <p v-if="!yudingListId.includes(row.kolId)" @click="debounce(row, $event, 1000)">
                <Icon type="md-add-circle" style=" font-size: 17px; color: #001F2C; opacity: .3" />
                加入投放
              </p>
              <p v-else @click="cancelShop(row.id)">
                <Icon type="ios-checkmark-circle" style="font-size: 17px; color: #CA7273;" />
                已加入
              </p> -->
              <p style="margin-top: 0px" v-if="!kolIds.includes(acount == 1 ? row.id : row.accountDataId)"
              @click="collects(acount == 1 ? row.id : row.accountDataId)">
                <Icon type="md-heart" style="font-size: 17px;color: #001F2C; opacity: .3" />
                收藏
              </p>
              <p style="margin-top: 0px" v-else @click="cancelcollects(acount == 1 ? row.id : row.accountDataId)">
                <Icon type="md-heart" style="font-size: 17px; color: #CA7273" />
                已收藏
              </p>
              <div :ref="'small' + row.id" class="radiu-url">
                <img :src="ballsrc" />
              </div>
            </div>
          </template>
        </Table>
      </div>

      <!-- <Page :total="total" v-if="total>0" class="btn-center-footer"
        :current="form.pageIndex"
        :page-size="form.pageSize"
        :page-size-opts="[10, 20, 50, 100]"
        show-total
        show-sizer
        show-elevator
        @on-change="sizeChangeHandle"
        @on-page-size-change="currentChangeHandle"/> -->
        <div class='black-pagination'>
          <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>
        </div>
        <div class="free-user-tip">免费用户仅可查看2页</div>
      </div>
      <Detail ref='detailbox' v-model="type" @done="checkDetailSet" />
    </div>
    <div>
      <div v-show="yudingList.length > 0" class="check-box">
        <div>
          <div class="check-title">已选择<span ref="end" class="red"> {{yudingList.length}} </span>个，总粉丝数：
          <span class="red">{{fansNums(yudingList)}}</span>
            <Icon @click="detailShow" v-if="detailflag" type="ios-arrow-up" class="ios-type" />
            <Icon @click="detailhide" v-else type="ios-arrow-down" />
          </div>
          <div style="margin-right: 20px">
            <!-- <Button type="primary" class="button-ok" @click="next">立即预定</Button> -->
          </div>
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
import { titleMsgList, areaList, kolmsglist, addcollet, cancelcollect, delShopping,
  allcollect, addShopIng, kolShoppingCar, delall, updatetime } from '@/api/kolList.ts'
import AreaModal from './areaModal.vue'
import clickoutside from './directive'
import { formatCurrency } from '@/fn/string'
import Detail from './detail.vue'
import moment from 'moment'
import { animation } from '@/fn/self.ts'
import jsxReactToVue from '@/util/jsxReactToVue'
import { clean } from '@/fn/object.ts'
import { getpersons, delcollect } from '@/api/mycollect.ts'
import { kolList } from '@/api/collect.ts'
import { findkol } from '@/api/shopping'
import pagination from '@/components/page.vue'
import { readableNumber } from '@/util/dealData.ts'
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
const timeFormat = 'YYYY-MM-DD'
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
    Detail,
    pagination
  },
  directives: {
    clickoutside
  }
})
export default class Main extends ViewBase {
  time = 0
  type: any = 0
  detailflag = true
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
  title: any = ['weibo', 'wechat', 'douyin', 'kuaishou', 'xiaohonghsu']
  yudingList: any = []
  yudingListId: any = []
  kolIds: any = []
  times: any = ''
  ballsrc: any = ''
  tabledataid: any[] = []
  desckey = 'followersCount'
  desc = 'desc'

  pageList = {
    pageIndex: 1,
    pageSize: 10
  }

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
        sortable: this.acount == 1 ? 'custom' : '',
        sortType: 'desc'
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
        key: 'avgReadCount',
        slot: 'read',
        sortable: this.acount == 1 ? 'custom' : ''
      },
      {
        title: '平均评论数',
        minWidth: 51,
        align: 'left',
        slot: 'discuss',
        key: 'avgCommentsCount',
        sortable: this.acount == 1 ? 'custom' : ''
      },
      {
        title: '平均点赞数',
        minWidth: 51,
        align: 'left',
        slot: 'like',
        key: 'avgAttitudesCount',
        sortable: this.acount == 1 ? 'custom' : ''
      },
      {
        title: '平均转发数',
        align: 'left',
        minWidth: 51,
        key: 'avgShareCount',
        slot: 'transmit',
        sortable: this.acount == 1 ? 'custom' : ''
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
        minWidth: 50,
        align: 'left',
        slot: 'action'
      }
    ]
  }

  formatnumber(val: any) {
    return readableNumber(val)
  }

  formatnums(val: any, msg: any = '', errors: string = '-', id: number = 0) {
    if (val == '0') {
      return errors
    }
    const num = (val + '').split('.')
    if (msg == '%') {
      const numbers = formatCurrency(val, 2)
       return `${numbers}${msg}`
    }
    if (num.length > 1) {
      const numbers = formatCurrency(val, 2)
      if (id == 1) {
        return `￥${numbers}${msg}`
      }
      return `${numbers}${msg}`
    } else {
      const numbers = formatCurrency(val, 0)
      if (id == 1) {
        return `￥${numbers}${msg}`
      }
      return `${numbers}${msg}`
    }
  }

  areabox(check: boolean) {
    if ( this.acount == 1) {
      this.areaShow = check
    }
  }

  uplist(size: any) {
    this.pageList.pageIndex = size
    this.KolSeach()
  }

  formatNum(data: any) {
    if ((data + '').length > 4) {
      return data ? formatCurrency(data / 10000, 2) + '万' : 0
    } else if (data.length > 8) {
      return data ? formatCurrency(data / 1000000000, 2) + '亿' : 0
    } else {
      return data ? formatCurrency(data, 0) : 0
    }
  }

  created() {
    this.init()
    this.seach()
    this.KolSeach()
    this.kolinit()
  }

  async kolinit() {
    try {
      const { data } = await kolList({
        channelTypeCode: this.type + 4
      })
      this.kolIds = (data.items || []).map((it: any) => it.accountDataId)
    } catch (ex) {
      this.handleError(ex)
    }
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
      const time = await updatetime(this.title[this.type])
      this.times = time.data ? moment(time.data * 1000).format(timeFormat) : '暂无'
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
    try {
      const { data } = await kolShoppingCar()
      switch (this.type) {
        case 0: this.yudingList = data.weiboList
          break
        case 1: this.yudingList = data.weixinList
          break
        case 2: this.yudingList = data.douyinList
          break
        case 3: this.yudingList = data.kuaishouList
          break
        case 4: this.yudingList = data.xiaohongshuList
          break
      }
      this.yudingListId = this.yudingList.map((it: any) => it.kolId)
    } catch (ex) {
      this.handleError(ex)
    }
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
        this.desckey = column.key
        this.desc = 'desc'
        this.KolSeach(column.key, 'desc')
    } else if (column.order == 'normal') {
      this.desc = 'desc'
      this.KolSeach(column.key, '')
    } else {
      this.desc = 'asc'
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
      const { data } = await findkol(this.title[this.type], {
        channelDataIds: row.id
      })
      this.$nextTick(() => {
        const dom: any   = this.$refs[`small${row.id}`]
        const id = row.id
        const x = e.clientX
        const y = e.clientY
        const end: any  = this.$refs.end
        this.checkDetail = true
        this.ballsrc = row.image
        const left = end.getBoundingClientRect().left || window.screen.width - 450
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
            try {
              await addShopIng({
                kolId: row.kolId,
                channelCode: this.title[this.type],
                channelDataId: row.id,
                accountImageUrl: row.image,
                accountType: row.typeCode,
                averageRead: row.avgReadCount,
                averageComment: row.avgCommentsCount,
                averageLike: row.avgAttitudesCount,
                averageShare: row.avgRepostsCount,
                collected: row.collected ? 1 : 0
              })
              await kolShoppingCar()
              dom.style.cssText = `display: none`
            this.init()
            } catch (ex) {
              dom.style.cssText = `display: none`
              this.handleError(ex)
            }
          }
        )
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 我的收藏
  async collectinit() {
    try {
      const { data } = await kolList({
        channelTypeCode: this.type + 4
      })
      this.tabledata = data.items || []
      this.tabledataid = [
        this.tabledata.length > 0 ? this.tabledata[this.tabledata.length - 1].id : ''
      ]
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 加入收藏
  async collects(id: any) {
    try {
      await addcollet({
        channelType: this.type + 4,
        dataId: id
      })
      this.kolinit()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 取消收藏
  async cancelcollects(id: any) {
    try {
      await delcollect({
        channelType: this.type + 4,
        dataIdList: [id]
      })
      this.collectinit()
      this.kolinit()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 取消投放
  async cancelShop(id: any) {
    try {
      await delShopping({
        channelCode: this.title[this.type],
        channelDataId: id
      })
      this.KolSeach()
      this.init()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 订单填写
  next() {
    const shopList = this.yudingList.filter((it: any) => it.controlStatus == 1)
    sessionStorage.setItem('shopList', JSON.stringify(this.yudingList))
    this.$router.push({
      name: 'order-orderfill',
      params: {
        code: this.title[this.type]
      }
    })
  }

  // 购物车显示
  detailShow() {
    this.detailflag = false
    this.$nextTick(() => {
      (this.$refs.detailbox as any).init(this.yudingList)
    })
  }

  detailhide() {
    (this.$refs.detailbox as any).flags()
    this.detailflag = true
  }

  checkDetailSet(val: any) {
    this.yudingList = val
    if (this.acount == 1) {
      this.KolSeach()
      this.kolinit()
    } else {
      this.collectinit()
      this.kolinit()
    }
    this.yudingListId = this.yudingList.map((it: any) => it.kolId)
  }

  // 粉丝数相加
  fansNums(row: any) {
    let num = 0

    row.forEach((it: any) => {
      num += Number(it.fans)
    })
    return this.formatNum(num)
  }

  // kol列表
  async KolSeach(key?: any, order?: any) {
    this.loading = true
    // await delall('weibo')
    const query = clean({
      ...this.form,
      ...this.pageList,
      accountCategoryCode: this.form.accountCategoryCode == 0 ? '' : this.form.accountCategoryCode,
      fansRangCode: this.form.fansRangCode == 0 ? '' : this.form.fansRangCode,
      sex: this.form.sex == -1 ? '' : this.form.sex,
      priceRangCode: this.form.priceRangCode == 0 ? '' : this.form.priceRangCode,
      areaIds: this.area == 0 && this.form.areaIds.join(',') == 0 ? '' : this.form.areaIds.join(','),
      sortBy: this.desckey,
      order: this.desc
    })
    try {
      const { data: {
        items,
        totalCount
      }} = await kolmsglist(query)
      this.tabledata = items || []
      this.tabledataid = [
        this.tabledata.length > 0 ? this.tabledata[this.tabledata.length - 1].id : ''
      ]
      this.total = totalCount
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
    }
  }

  allcollects(count: any) {
    this.acount = count
    if (this.acount == 1) {
      this.KolSeach()
    } else {
      this.collectinit()
    }
  }

  @Watch('form', { deep: true })
  watchForm(value: any) {
    this.pageList.pageIndex = 1
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
    this.yudingList = []
    this.yudingListId = []
    if (this.acount == 1) {
      this.form = {
        ...defaultForm,
        channelCode: this.title[value]
      }
      this.seach()
      this.init()
    } else {
      this.allcollects(2)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/formInput.less';

.to-detail {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/ .ivu-checkbox-wrapper {
  width: 150px;
}
.kol-page {
  padding: 0 30px 40px 30px;
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
  background: rgba(0, 31, 44, .8);
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
  position: relative;
  margin-bottom: 40px;
  left: 0;
  right: 40px;
  overflow: auto;
  background: rgba(255, 255, 255, .7);
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
    /deep/ .ivu-input,
    /deep/ .ivu-input-wrapper {
      border-radius: 5px 0 0 5px;
      .ivu-icon-ios-search {
        margin-top: -2px;
      }
    }
    /deep/ .ivu-input {
      background: rgba(255, 255, 255, .8);
      &::placeholder {
        color: #001f2c;
      }
    }
  }
}
.red {
  color: #f18d94;
  font-size: 22px;
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
    border-radius: 58%;
  }
}
.list-table {
  border-radius: 5px;
  min-width: 1146px;
  padding-left: 20px;
  padding-right: 20px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 61px;
    border-radius: 5px 5px 0 0;
    background: #d5e7f2;
  }
  /deep/ .ivu-table-header {
    position: relative;
    background: #d5e7f2;
    th {
      height: 61px;
      background: #d5e7f2;
    }
  }
  /deep/ .ivu-table-row {
    border-bottom: 2px solid rgba(255, 255, 255, .4);
  }
}
/deep/ .ivu-table-wrapper {
  width: calc(100% - 19);
  margin: 0;
  min-height: 240px;
  position: initial !important;
  .ivu-table-header th {
    height: 60px;
    line-height: 60px;
    span {
      font-size: 14px;
    }
  }
  .ivu-table-column-center, .ivu-table-column-left {
    background: rgba(0, 0, 0, 0);
  }
  .ivu-table {
    background: rgba(0, 0, 0, 0);
  }
  .ivu-table-row {
    background: rgba(0, 0, 0, 0);
    td {
      background: rgba(0, 0, 0, 0);
    }
  }
  .ivu-table-tbody {
    color: #001f2c;
  }
  .ivu-table-tip td {
    background: rgba(0, 0, 0, 0);
    padding-top: 60px;
  }
  .ivu-table-cell {
    padding-right: 10px;
    padding-left: 10px;
  }
  .table-action {
    p {
      cursor: pointer;
    }
  }
  .prices {
    cursor: pointer;
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    margin-left: -160px;
    z-index: 999;
  }
}
.btn-center-footer {
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
  justify-content: flex-end;
  > div {
    display: flex;
  }
  .check-title {
    color: #fff;
    font-size: 18px;
  }
  .ios-type {
    cursor: pointer;
    font-size: 24px;
    margin-left: 20px;
  }
  .button-ok {
    margin-left: 30px;
    border-radius: 26px;
    .button-style(#fff, #f18d94);
  }
}
.black-pagination {
  /deep/ .page-list {
    .ivu-page-prev a, .ivu-page-total, .ivu-page-next a {
      color: #00202d;
    }
    .ivu-page-item {
      a {
        color: #00202d;
      }
    }
    .ivu-page-item.ivu-page-item-active {
      background: #00202d;
      a {
        color: #fff;
      }
    }
  }
}

.free-user-tip {
  position: relative;
  top: -30px;
  color: #999;
  text-align: center;
}
/deep/ .search-border-left {
  input {
    border-right: none;
  }
}
.bth-search {
  border-radius: 0 5px 5px 0;
  .button-style(#fff, #00202d);
}
</style>
