<template>
  <div class="page home-bg">
    <Header v-model="type"/>
    <div>
      <Form :model="form" ref="dataform" label-position="left" :label-width="100" class="edit-input forms">
        <FormItem label="账号类别"  class="item-top form-item-type">
          <CheckboxGroup v-model="form.account" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox  v-for="it in accountList" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="粉丝数量"  class="item-top form-item-type">
          <CheckboxGroup v-model="form.fans" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox  v-for="it in fansList" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="地域分布"  class="item-top form-item-type">
          <CheckboxGroup v-model="form.area" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox class="check-item" :label='1'>指定区域</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="价格区间"  class="item-top form-item-type">
          <CheckboxGroup v-model="form.price" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox  v-for="it in priceList" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="受众性别"  class="item-top form-item-type">
          <CheckboxGroup v-model="form.sex" class="item-radio-top">
            <Checkbox class="check-item form-item-first" :label="0">不限</Checkbox>
            <Checkbox  v-for="it in sexList" :key="it.key" :label="it.key"
              class="check-item">{{it.text}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <div class="item-top">
          <RadioGroup v-model="kolType" type="button" size="large">
            <Radio label="全部账号"></Radio>
            <Radio label="我的收藏"></Radio>
          </RadioGroup>
          <span class="content-set">平均数量以近90天的内容计算</span>
          <span class="content-set">数据更新日期2019-04-28</span>
          <FormItem  class="form-name">
            <Input style="width: 300px" v-model="form.name" :placeholder="nameList[type]" />
          </FormItem>
        </div>
      </Form>

    <Table :loading="loading" @on-sort-change="sortTable" stripe :columns="columns" :data="tabledata">
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

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Header from './header.vue'
import { queryList } from '@/api/kolList.ts'
import AreaModal from './areaModal.vue'
import clickoutside from './directive'
import Detail from './detail.vue'
import { animation } from '@/fn/self.ts'

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
const inform: any = {
  account: [0],
  fans: [0],
  sex: [0],
  price: [0],
  area: [0],
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
export default class App extends ViewBase {
  time = 0
  type: number = 0
  total = 0
  areaId = 0
  radiusUrl = ''
  loading: boolean = false
  form: any = {
    ...inform
  }
  checkDetail = false
  checkCount = 0
  checkPeople = 0
  accountList: any = []
  fansList: any = []
  sexList: any = []
  priceList: any = []
  kolType: any = 1
  detail = false
  handleShow = false
  tabledata: any = []
  nameList: any = ['🔍 微博名', '🔍 公众号名称', '🔍 账号名称', '🔍 账号名称', '🔍 账号名称']

  get columns() {
    const title = ['微博账号', '公众号/微信号', '抖音账号', '快手账号', '小红书账号']
    return [
      {
        title: title[this.type],
        align: 'left',
        width: 160,
        slot: 'name'
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
      },
      {
        title: '操作',
        minWidth: 40,
        align: 'left',
        slot: 'action'
      }
    ]
  }

  created() {
    this.init()
  }

  viewArea(id: any) {
    this.handleShow = true
    this.areaId = id
  }

  handleClose(e: any) {
    this.areaId = 0
  }

  async init() {
    try {
      const { data } = await queryList({})
      this.accountList = data.accountList
      this.fansList = data.fansList
      this.sexList = data.sexList
      this.priceList = data.priceList
      this.tabledata = data.items
      this.total = 20
    } catch (ex) {
      this.handleError(ex)
    }
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

  async put(row: any, e: any) {
    try {
      const dom: any   = this.$refs[`small${row.id}`]
      const id = row.id
      const x = e.clientX
      const y = e.clientY
      const end: any  = this.$refs.end
      const left = end.getBoundingClientRect().left || 588
      const top = end.getBoundingClientRect().top || document.body.clientHeight - 50
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

  @Watch('form.account', { deep: true })
  watchformAccount(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.account = newValue
    })
    if (value.length == 0) {
      this.form.account = [0]
    }
  }

  @Watch('form.sex', { deep: true })
  watchformSex(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.sex = newValue
    })
    if (value.length == 0) {
      this.form.sex = [0]
    }
  }

  @Watch('form.fans', { deep: true })
  watchformFans(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.fans = newValue
    })
    if (value.length == 0) {
      this.form.fans = [0]
    }
  }

  @Watch('form.price', { deep: true })
  watchformAge(value: number[], oldValue: number[]) {
    // 不限与其他项互斥
    keepExclusion(value, oldValue, 0, newValue => {
      this.form.price = newValue
    })
    if (value.length == 0) {
      this.form.price = [0]
    }
  }
  @Watch('type')
  watchType(value: number) {
    this.form = {
      ...inform
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.title {
  text-align: center;
  font-size: 26px;
  margin-top: 40px;
}
.item-top {
  margin-left: 30px;
  .content-set {
    margin-left: 30px;
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
  user-select: none;
  /deep/ .ivu-checkbox {
    display: none;
  }
  /deep/&.ivu-checkbox-wrapper-checked {
    color: #fff;
    border-color: @c-button;
    background-color: @c-button;
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
/deep/ .ivu-table-wrapper {
  margin: 40px 30px 10px;
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
  margin-bottom: 80px;
}
.check-box {
  position: fixed;
  left: 178px;
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
