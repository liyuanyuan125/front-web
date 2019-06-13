<template>
  <div class="fill-box">
    <div class="layout-fill-title">
      <span>KOL{{koltitle}}推广</span>
    </div>  

    <Form :model="form" ref="dataform" :rules="rule" label-position="left" :label-width="90" class="edit-input forms">

      <div class="item-top select-adv-type adv-left">
        <FormItem style="margin-left:0px" class="float-right pr30" label="推广品牌" prop="brandid">
          <Select v-model="form.brandid" filterable clearable>
            <Option v-for="(item, index) in brach" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </div>

      <div class="item-top select-adv-type adv-left" v-if="product.length > 0">
        <FormItem style="margin-left:0px" class="float-right pr30" label="推广产品" prop="productId">
          <Select v-model="form.productId" filterable clearable>
            <Option v-for="(item, index) in product" :value="item.id" :key="index">{{ item.name }} </Option>
          </Select>
        </FormItem>
      </div>

      <FormItem label="项目名称" class="item-top select-adv-type" prop="projectName">
        <Input  v-model="form.projectName" placeholder='例如"2019奥迪Q3'></Input>
      </FormItem>

      <FormItem label="推广内容" class="item-top select-adv-type" prop="content">
        <Input  v-model="form.content" placeholder='例如“奥迪Q3新款线上推广”'></Input>
      </FormItem>
    </Form>
    <p class="create-title">创建内容</p>
    <div>
      <Table :columns="columns" :data="tableDate" ref="selection"  @on-selection-change="singleSelect"  @on-select-all="selectAll" >
        <template style="marin-top: 100px" slot-scope="{ row }" slot="name">
          <div class="table-name">
            <img :src="row.mainPicUrl" alt=""> 
            <ul>
              <li>{{row.name}}</li>
              <li>{{row.type}}</li>
              <li>粉丝数: &nbsp;&nbsp;{{formatNumber(row.discuss)}}万</li>
            </ul>
            <p>
              <span>{{row.platform}}  ¥{{row.price}}</span>
              <span>转发价  ¥167,200</span>
            </p>
          </div>
        </template>
        <template style="marin-top: 100px" slot-scope="{ row }" slot="time">
          <div v-if="row.price">
            <p>{{formatDate(row.openTime)}}</p>
          </div>
          <div v-else>
            <span>待设置</span>
          </div>
        </template>
        <template style="marin-top: 100px" slot-scope="{ row }" slot="type">
          <div v-if="row.openTime">
            <p>{{row.platform}}</p>
            <p>¥{{formatNumber(row.price)}}</p>
          </div>
          <div v-else>
            <span>待设置</span>
          </div>
        </template>
        <template style="marin-top: 100px" slot-scope="{ row }" slot="content">
          <div v-if="row.title">
            <p>
              {{row.title}}
            </p>
          </div>
          <div v-else>
            <span>待设置</span>
          </div>
        </template>
        <template style="marin-top: 100px" slot-scope="{ row }" slot="action">
          <div v-if="row.title" class="action">
            <p @click="set(row.id)">修改</p>
            <p @click="del(rwo.id)">删除</p>
            <p @click="add(rwo.id)">追加</p>
          </div>
          <div v-else class="action">
            <p @click="set(row.id, 1)"><span>设置任务</span></p>
            <p @click="del(rwo.id)"><span>删除</span></p>
          </div>
        </template>
      </Table>

      <div class="create">
        <span @click="handleSelectAll">
          <Checkbox v-model="checkboxAll"></Checkbox>全选
        </span>
        <p>批量设置任务</p>
      </div>
      <div class="check-box">
        <p> 共 <b>1</b> 个账号    <b>{{}}</b> 个任务    粉丝合计 <b>892.93</b>万  </p>
        <p>订单金额（不含撰稿费用）：<b>¥167,200</b></p>
      </div>
    </div>
    <component v-if="comloading" ref="detailbox" :id="$route.params.id" :is="detail"></component>
    <div class="btn-center">
      <Button type="primary" class="button-ok" @click="next('dataform')">提交订单</Button>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Vue, Watch} from 'vue-property-decorator'
import { queryList, productsList, brandsList } from '@/api/shopping'
import ViewBase from '@/util/ViewBase'
import { formatCurrency } from '@/fn/string'
import moment from 'moment'
import wbDtail from './wbdetail.vue'
import otherdetail from './otherdetail.vue'
import webo from './webo.vue'

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
  comloading = false
  detail: any = null
  adverList: any = []
  tableDate: any = []
  checkId: any = []
  sumList: any = []
  title: any = ['weibo', 'wechat', 'douyin', 'kuaishou', 'xiaohonghsu']
  titles: any = ['微博', '微信', '抖音', '快手', '小红书']
  sum = 0
  product: any = []
  brach: any = []
  checkboxAll = false
  rule: any = {
    projectName: [
      { required: true, message: '请输入项目名称', trigger: 'change' }
    ],
    brandid: [
      { required: true, message: '请选择推广品牌', type: 'number', trigger: 'change' }
    ]
  }

  get koltitle() {
    const index = this.title.findIndex((it: any) => it == this.$route.params.id)
    return this.titles[index]
  }

  columns: any = [
    { type: 'selection', width: 60, align: 'center' },
    {
      title: '账号',
      align: 'left',
      width: 360,
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
    },
  ]

  created() {
    this.seach()
  }

  mounted() {
    this.init()
  }
  async seach() {
    try {
      const { data: {
        items
      }} = await brandsList({
        pageIndex: 1,
        pageSize: 400
      })
      this.brach = items
      // this.tableDate = data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async seachList() {
    try {
      const { data: {
        items
      }} = await productsList({
        brandId: this.form.brandid,
        pageIndex: 1,
        pageSize: 400
      })
      this.product = items
      // this.tableDate = data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async init() {
    try {
      if (this.$route.params.type) {
        // const { data } = await queryList({})
      } else {
        this.tableDate = JSON.parse(sessionStorage.getItem('shopList') as any)
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  singleSelect(select: any) {
    const ids = this.tableDate.map((it: any) => it.id)
    const dataId = select.map((it: any) => it.id)
    select.forEach((item: any) => {
      if (!this.checkId.includes(item.id)) {
        this.checkId.push(item.id)
        this.sumList.push(item)
      }
    })
    const filterId = ids.filter((it: any) => !dataId.includes(it))
    this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
    this.sumList = this.sumList.filter((it: any) => !filterId.includes(it.id))
    this.checkboxAll = select.length == this.tableDate.length ? true : false
  }

  set(id: any, set: any) {
    this.comloading = true

    this.$nextTick(() => {
      (this.$refs.detailbox as any).init(id, set)
    })
  }

  formatNumber(num: any) {
    return formatCurrency(num)
  }

  async next(form: any) {
    try {
      const volid = await (this.$refs[form] as any).validate()
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

  selectAll() {

  }

  @Watch('$route.params', {immediate: true})
  watch$routeParams(val: any) {
    if (val.id == 'weibo') {
      this.detail = webo
    } else if (val.id == 'weixin') {
      this.detail = wbDtail
    } else {
      this.detail = otherdetail
    }
  }

  @Watch('form.brandid', {immediate: true})
  watchFormBrandid(val: any) {
    if (val) {
      this.seachList()
    }
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
  /deep/ .ivu-table-column-center, /deep/ .ivu-table-column-left {
    background: rgba(213, 231, 242, 0.6);
    color: rgba(0, 32, 45, 0.5);
  }
  /deep/ .ivu-table {
    background: rgba(255, 255, 255, .3);
  }
  /deep/ .ivu-table-body .ivu-table-column-center, /deep/ .ivu-table-body .ivu-table-column-left {
    background: rgba(0, 0, 0, 0);
    border-bottom: 1px solid rgba(255, 255, 255, .5);
    color: rgba(68, 68, 68, 1);
    font-size: 14px;
    span {
      color: rgba(68, 68, 68, 1);
      font-size: 14px;
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
      width: 140px;
      li {
        margin-top: 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    p {
      width: 100px;
      color: #ccc;
      margin-left: 20px;
      span {
        width: 100px;
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
    /deep/ li, /deep/ .ivu-select-loading {
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
.create-title {
  font-size: 16px;
  color: rgba(0, 32, 45, 1);
  line-height: 14px;
  margin-top: 30px;
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
  height: 80px;
  border-radius: 5px;
  span {
    margin-left: 20px;
    font-size: 14px;
  }
}
</style>