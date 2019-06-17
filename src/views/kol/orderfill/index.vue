<template>
  <div class="fill-box">
    <div class="layout-fill-title">
      <span>KOL{{koltitle}}推广</span>
    </div>

    <Form
      :model="form"
      ref="dataform"
      :rules="rule"
      label-position="left"
      :label-width="90"
      class="edit-input forms"
    >
      <div class="item-top select-adv-type adv-left">
        <FormItem class="float-right pr30" label="推广品牌" prop="brandid">
          <Select v-model="form.brandid" filterable clearable>
            <Option v-for="(item, index) in brach" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </div>

      <div class="item-top select-adv-type adv-left">
        <FormItem class="float-right pr30" label="推广产品" prop="productId">
          <div class="fake">
            <Input
              v-model="query"
              class="select-postion"
              @on-change="copyselect"
              width="150px"
              @click.native="selcetfocus"
              placeholder="请输入产品名称"
            ></Input>
          </div>
          <Select
            v-model="form.productId"
            filterable
            clearable
            @on-change="labelShow"
            @on-clear="remove"
            ref="select"
            @remote-method="remoteMethod"
          >
            <Option ref="options" v-for="(item, index) in products" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </div>

      <FormItem label="项目名称" class="item-top select-adv-type" prop="projectName">
        <Input v-model="form.projectName" placeholder="例如2019奥迪Q3"></Input>
      </FormItem>

      <FormItem label="推广内容" class="item-top select-adv-type" prop="content">
        <Input v-model="form.content" placeholder="例如“奥迪Q3新款线上推广”"></Input>
      </FormItem>
    </Form>
    <p class="create-title">创建内容</p>
    <div>
      <Table
        :columns="columns"
        :data="tableDate"
        ref="selection"
        @on-selection-change="singleSelect"
        @on-select-all="selectAll"
      >
        <template style="marin-top: 100px" slot-scope="{ row }" slot="name">
          <div class="table-name">
            <img :src="row.accountImageUrl" alt>
            <ul>
              <li>{{row.accountName}}</li>
              <li>{{row.type}}</li>
              <li>粉丝数: &nbsp;&nbsp;{{formatNumber(row.fans)}}万</li>
            </ul>
            <p
              v-if="loaddings"
              v-for="(it, index) in row.priceList"
              :key="index"
              style="color: #00202d"
            >{{statusLists(it)}}</p>
          </div>
        </template>
        <template style="marin-top: 100px" slot-scope="{ row }" slot="time">
          <div v-if="row.orderItemList">
            <p>{{formatDate(row.orderItemList.publishTime)}}</p>
          </div>
          <div v-else>
            <span>待设置</span>
          </div>
        </template>
        <template style="marin-top: 100px" slot-scope="{ row }" slot="type">
          <div v-if="row.orderItemList">
            <p>{{statusLists({categoryCode: row.orderItemList.publishCategoryCode}, 1)}}</p>
            <p>¥{{formatNumber(row.totalFee)}}</p>
          </div>
          <div v-else>
            <span>待设置</span>
          </div>
        </template>
        <template style="marin-top: 100px" slot-scope="{ row }" slot="content">
          <div v-if="row.orderItemList">
            <p>{{row.orderItemList.summary}}</p>
          </div>
          <div v-else>
            <span>待设置</span>
          </div>
        </template>
        <template style="marin-top: 100px" slot-scope="{ row, coulum, index }" slot="action">
          <div v-if="row.orderItemList" class="action">
            <p @click="set(index, row.channelDataId, row.orderItemList)">修改</p>
            <p @click="del(index)">删除</p>
            <p @click="add(index)">追加</p>
          </div>
          <div v-else class="action">
            <p @click="set(index, row.channelDataId)">
              <span>设置任务</span>
            </p>
            <p @click="del(index)">
              <span>删除</span>
            </p>
          </div>
        </template>
      </Table>

      <div class="create">
        <span>
          <Checkbox :disabled="tableDate.length > 0" @click="handleSelectAll" v-model="checkboxAll">全选</Checkbox>
          <span v-if="tableDate.length > 0" style="cursor: pointer" @click="setall">批量设置任务</span>
        </span>
      </div>
      <div class="check-box">
        <p style="margin-left: 4px">
          共
          <b>{{accout(sunlist)}}</b> 个账号
          <span style="margin-left: 10px">共</span><b>{{checkId.length}}</b> 个任务 
          <span style="margin-left: 10px">粉丝合计</span>
          <b class="red">{{fanscount(sunlist)}}</b>万
        </p>
        <span style="margin-right: 20px">
          订单金额（不含撰稿费用
          <b class="big-red">¥{{mongysum}}</b>
        </span>
      </div>
    </div>
    <component v-if="comloading" ref="detailbox" @done="uplist" :id="$route.params.code" :is="detail"></component>
    <div class="btn-center">
      <Button type="primary" class="button-ok default-but" @click="next('dataform', 1)">保存草稿</Button>
      <Button type="primary" class="button-ok next-button" @click="next('dataform')">提交订单</Button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { queryList, productsList, brandsList, ordersdradt, addBrand, addorders } from '@/api/shopping'
import { kolShoppingCar } from '@/api/kolList.ts'
import ViewBase from '@/util/ViewBase'
import { formatCurrency } from '@/fn/string'
import moment from 'moment'
import wbDtail from './wbdetail.vue'
import otherdetail from './otherdetail.vue'
import webo from './webo.vue'
import { clean } from '@/fn/object.ts'
import { uniqBy } from 'lodash'

const timeFormat = 'YYYY-MM-DD SS:DD'
@Component({
  components: {
    wbDtail,
    otherdetail,
    webo
  }
})
export default class Main extends ViewBase {
  form: any = {
    brandid: null,
    productId: 0,
    projectName: '',
    content: ''
  }
  loaddings = false
  statusList: any = []
  comloading = false
  detail: any = null
  adverList: any = []
  tableDate: any = []
  checkId: any = []
  sunlist: any = []
  titles: any = ['weibo', 'wechat', 'douyin', 'kuaishou', 'xiaohonghsu']
  title: any = ['微博', '微信', '抖音', '快手', '小红书']
  sum = 0
  query: any = ''
  product: any = []
  products: any = []
  brach: any = []
  checkboxAll = false
  prodId: any = null

  rule: any = {
    projectName: [
      { required: true, message: '请输入项目名称', trigger: 'change' }
    ],
    brandid: [
      {
        required: true,
        message: '请选择推广品牌',
        type: 'number',
        trigger: 'change'
      }
    ]
  }

  get koltitle() {
    const index = this.titles.findIndex(
      (it: any) => it == this.$route.params.code
    )
    return this.title[index]
  }

  columns: any = [
    { type: 'selection', width: 60, align: 'center' },
    {
      title: '账号',
      align: 'left',
      width: 380,
      slot: 'name'
    },
    {
      title: '任务类型',
      align: 'left',
      slot: 'type'
    },
    {
      title: '期望发布时间',
      align: 'left',
      slot: 'time'
    },
    {
      title: '任务内容',
      align: 'left',
      slot: 'content'
    },
    {
      title: '操作',
      align: 'left',
      width: 120,
      slot: 'action'
    }
  ]

  get mongysum() {
    let money = 0
    this.tableDate.forEach((it: any) => {
      money += Number(it.orderItemList ? it.totalFee : 0)
    })
    return money
  }

  created() {
    this.seach()
    this.inits()
  }

  mounted() {
    this.init()
  }

  uplist(val: any) {
    this.tableDate = this.tableDate.map((it: any, index: any) => {
      if (val.id.includes(index)) {
        const msg = this.tableDate[index].priceList
        const money = msg.filter((item: any) => item.categoryCode == val.form.publishCategoryCode)[0].value
        return {
          ...it,
          orderItemList: val.form,
          totalFee: money,
          _checked: this.checkId.includes(index)
        }
      } else {
        return {
          ...it,
          _checked: this.checkId.includes(index)
        }
      }
    })
    this.singleSelect(this.tableDate.filter((it: any) => it._checked))
  }

  async seach() {
    try {
      const {
        data: { items }
      } = await brandsList({
        pageIndex: 1,
        pageSize: 400
      })
      this.brach = items
      // this.tableDate = data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  copyselect() {
    (this.$refs.select as any).visible = true
    this.form.productId = this.query
    this.remoteMethod()
  }

  selcetfocus() {
    (this.$refs.select as any).visible = true
  }

  async seachList() {
    try {
      const {
        data: { items }
      } = await productsList({
        brandId: this.form.brandid,
        pageIndex: 1,
        pageSize: 400
      })
      this.products = items
      this.product = items
      // this.tableDate = data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  remoteMethod() {
    if (this.query !== '') {
      this.products = this.product.filter((it: any) => it.name.indexOf(this.query + '') != -1)
    } else {
      this.products = this.product
    }
  }

  remove() {
    this.query = ''
  }

  add(index: any) {
    const msg: any = {
      ...this.tableDate[index],
      orderItemList: '',
      totalFee: '',
      _checked: false
    }
    this.tableDate.splice(index + 1, 0, clean({...msg}))
    this.tableDate = this.tableDate.map((it: any, indexs: any) => {
      return {
        ...it,
        index: indexs,
      }
    })
    this.singleSelect(this.tableDate.filter((it: any) => it._checked))
  }

  del(index: any) {
    this.tableDate.splice(index, 1)
    this.singleSelect(this.tableDate.filter((it: any) => it._checked))
  }

  async inits() {
    try {
      const type: any = this.$route.params.id
        ? this.title.findIndex((it: any) => it == this.$route.params.id)
        : 0
      const { data } = await kolShoppingCar()
      switch (type) {
        case 0:
          this.statusList = data.weiboPublishCategoryList
          break
        case 1:
          this.statusList = data.weixinPublishCategoryList
          break
        case 2:
          this.statusList = data.douyinPublishCategoryList
          break
        case 3:
          this.statusList = data.kuaishouPublishCategoryList
          break
        case 4:
          this.statusList = data.xiaohongshuPublishCategoryList
          break
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  labelShow(val: any) {
    this.query = this.product.filter((it: any) => it.id == val)[0].name
  }

  async init() {
    try {
      if (this.$route.params.id) {
        const { data } = await ordersdradt(this.$route.params.id)
        this.loaddings = true
      } else {
        this.tableDate = JSON.parse(sessionStorage.getItem('shopList') as any).map((it: any, index: any) => {
          return {
            ...it,
            index
          }
        })
        this.loaddings = true
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  accout(val: any) {
    return uniqBy(val, 'kolid').length
  }

  singleSelect(select: any) {
    const ids = this.tableDate.map((it: any) => it.index)
    const dataId = select.map((it: any) => it.index)
    select.forEach((item: any) => {
      if (!this.checkId.includes(item.index)) {
        this.checkId.push(item.index)
        this.sunlist.push(item)
      }
    })
    const filterId = ids.filter((it: any) => !dataId.includes(it))
    this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
    this.sunlist = this.sunlist.filter((it: any) => !filterId.includes(it.index))
    this.checkboxAll = select.length == this.tableDate.length ? true : false
    if (this.tableDate.length == 0) {
      this.checkboxAll = false
    }
  }

  set(id: any, kolid: any, orderItemList: any) {
    this.comloading = true
    this.$nextTick(() => {
      (this.$refs.detailbox as any).init(this.statusList, id, kolid, orderItemList )
    })
  }

  setall() {
    this.comloading = true
    this.$nextTick(() => {
      (this.$refs.detailbox as any).init(this.statusList, this.checkId )
    })
  }

  statusLists(it: any, id?: any) {
    // console.log(it)
    if (it) {
      const msg: any = (this.statusList.filter(
        (its: any) => its.key == it.categoryCode
      )[0] as any)
      if (id) {
        return msg.text
      }
      return `${msg ? msg.text : ''} + ${it.salePrice}万`
    } else {
      return '暂无'
    }
  }

  formatNumber(num: any) {
    return formatCurrency(num)
  }

  fanscount(val: any) {
    let fans = 0
    val.forEach((it: any) => {
      fans += Number(it.fans)
    })
    return fans
  }

  async next(form: any, id?: number) {
    try {
      const volid = await (this.$refs[form] as any).validate()
      if (volid) {
        if (this.product.filter((it: any) => it.name.indexOf(this.query + '') == -1)) {
          const { data } = await addBrand({
            brandId: this.form.brandid,
            name: this.query
          })
          this.prodId = data
        } else {
          this.prodId = this.form.productId
        }
        const msg = this.tableDate.map((it: any) => {
          const item = it.orderItemList
          const message = clean({
            ...item,
            pictureFileIds: item.pictureFileIds.join(','),
            publishTime: new Date(item.publishTime).getTime()
          })
          return {
            kolId: it.kolId,
            channelDataId: it.channelDataId,
            channelCode: it.channelCode,
            accountPhotoFileId: it.accountImageUrl,
            accountName: it.accountName,
            salePrice: it.totalFee || 0,
            accountTypeCode: it.accountTypeCode,
            ...message
          }
        })
        // console.log(JSON.stringify({
        //   ...this.form,
        //   draft: id ? id : '',
        //   channelCode: this.$route.params.code,
        //   totalFee: this.mongysum,
        //   productId: this.prodId,
        //   orderItemList: msg
        // }))
        await addorders({
          ...this.form,
          draft: 1,
          channelCode: this.$route.params.code,
          totalFee: this.mongysum,
          productId: this.prodId,
          orderItemList: msg
        })
        this.$router.push({ name: 'kol-orderlist' })
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  formatDate(data: any) {
    return data ? moment(data).format(timeFormat) : '暂无'
  }

  handleSelectAll() {
    const selection = this.$refs.selection as any
    selection.selectAll(!this.checkboxAll)
  }

  selectAll() {}

  @Watch('$route.params', { immediate: true })
  watch$routeParams(val: any) {
    if (val.code == 'weibo') {
      this.detail = webo
    } else if (val.code == 'weixin') {
      this.detail = wbDtail
    } else {
      this.detail = otherdetail
    }
  }

  @Watch('form.brandid', { immediate: true })
  watchFormBrandid(val: any) {
    if (val) {
      this.seachList()
    }
  }

  @Watch('sunlist', { deep: true })
  watchSunList(val: any) {

  }
}
</script>
<style lang='less' scoped>
@import '~@/site/common.less';
/deep/ .ivu-checkbox {
  /deep/ .ivu-checkbox-inner {
    border-radius: 50%;
    width: 23px;
    height: 23px;
    color: #00202d;
    background: #fff;
    border: 1px solid #fff;
    &::after {
      left: 7px;
      top: 4px;
      width: 8px;
      height: 12px;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
    }
  }
}
/deep/ .ivu-checkbox-checked {
  /deep/ .ivu-checkbox-inner {
    background: #ff5353;
    border: 1px solid #ff5353;
  }
}
.select-postion {
  position: absolute;
  z-index: 6;
  cursor: pointer;
}
.fill-box {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: 1px solid #fff;
  margin: 20px 50px;
  padding: 40px;
  .layout-fill-title {
    font-size: 24px;
    font-weight: 500;
    color: rgba(0, 32, 45, 1);
    line-height: 24px;
    margin-bottom: 40px;
  }
  /deep/ .ivu-select,
  /deep/ .ivu-select-selection,
  /deep/ .ivu-input-wrapper,
  /deep/ .ivu-form-item-content,
  /deep/ .ivu-input,
  /deep/ .ivu-select-input {
    border-radius: 5px;
    font-size: 16px;
  }
  /deep/ .ivu-form-item-label {
    font-size: 16px;
    font-weight: 500;
    color: #00202d;
  }
}
/deep/ .ivu-table-wrapper {
  margin: 20px 0;
  border-radius: 5px;
  /deep/ .ivu-table-header th {
    height: 50px;
    line-height: 50px;
    span {
      font-size: 14px;
    }
  }
  /deep/ .ivu-table-column-center,
  /deep/ .ivu-table-column-left {
    background: rgba(213, 231, 242, 0.6);
    color: rgba(0, 32, 45, 0.5);
  }
  /deep/ .ivu-table {
    background: rgba(255, 255, 255, 0.3);
  }
  /deep/ .ivu-table-body .ivu-table-column-center,
  /deep/ .ivu-table-body .ivu-table-column-left, /deep/ .ivu-table td {
    background: rgba(0, 0, 0, 0);
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    color: rgba(68, 68, 68, 1);
    font-size: 14px;
    span {
      color: rgba(68, 68, 68, 1);
      font-size: 14px;
    }
  }
  /deep/ .ivu-table-tip {
    td {
      height: 70px;
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
    ul {
      margin-left: 10px;
      width: 150px;
      li {
        margin-top: 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    p {
      width: 110px;
      color: #ccc;
      margin-left: 20px;
      span {
        width: 110px;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .action {
    cursor: pointer;
  }
}
.adv-left {
  width: 500px;
  /deep/ .ivu-select-dropdown {
    /deep/ li,
    /deep/ .ivu-select-loading {
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
.check-all {
  cursor: pointer;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 0 0 18px;
  justify-content: space-between;
  p {
    color: rgba(0, 32, 45, 1);
  }
}
.btn-center {
  margin: 40px 0 30px;
  text-align: center;
}
.next-button {
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.create-title {
  font-size: 16px;
  color: rgba(0, 32, 45, 1);
  line-height: 14px;
  margin-top: 30px;
}
.fake {
  /deep/ .ivu-input-wrapper {
    width: 300px;
    border-right: 1px solid #fff;
  }
  /deep/ .ivu-input-wrapper input {
    cursor: pointer;
    border-right: 1px solid #fff;
  }
}
.create {
  display: flex;
  padding-left: 18px;
  color: rgba(0, 32, 45, 1);
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 30px;
}
.check-box {
  position: relative;
  display: flex;
  padding-left: 14px;
  background: #fff;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  border-radius: 5px;
  span {
    margin-left: 20px;
    font-size: 14px;
  }
  .red {
    color: #ff5353;
  }
  .big-red {
    color: #ff5353;
    font-size: 30px;
  }
}
.default-but {
  width: 200px;
  vertical-align: middle;
  .button-style(#00202d, rgba(0, 0, 0, 0));
  border-radius: 25px;
}
</style>