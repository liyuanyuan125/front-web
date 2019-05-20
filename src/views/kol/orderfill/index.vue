<template>
  <div class="page home-bg">
    <div class="layout-nav-title">
      <span>KOL微博推广</span>
    </div>  

    <Form :model="form" ref="dataform" :rules="rule" label-position="left" :label-width="100" class="edit-input forms">
      <FormItem label="项目名称" class="item-top select-adv-type" prop="name">
        <Input  v-model="form.name" placeholder='例如"2019奥迪Q3'></Input>
      </FormItem>

      <div class="item-top select-adv-type adv-left">
        <FormItem style="margin-left:0px" class="float-right pr30" label="推广品牌" prop="videoId">
          <Select v-model="form.videoId" filterable clearable>
            <Option v-for="(item, index) in adverList" :value="item.id" :key="index">{{ item.name }} ({{item.length}}s) {{ item.customerName }}</Option>
          </Select>
        </FormItem>
      </div>

      <FormItem label="推广内容" class="item-top select-adv-type" prop="name">
        <Input  v-model="form.name" placeholder='例如"2019奥迪Q3'></Input>
      </FormItem>
    </Form>

    <div>
      <Table stripe  :columns="columns" :data="tableDate" ref="selection"  @on-selection-change="singleSelect"  @on-select-all="selectAll" >
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

      <div class="check-all" style="background: #fff">
        <span @click="handleSelectAll">
          <Checkbox v-model="checkboxAll"></Checkbox>全选
        </span>
        <a>批量设置任务</a>
      </div>
      <div class="checkAll">
        <p> 共 <b>1</b> 个账号    <b>{{}}</b> 个任务    粉丝合计 <b>892.93</b>万  </p>
        <p>订单金额（不含撰稿费用）：<b>¥167,200</b></p>
      </div>
    </div>
    <component v-if="comloading" ref="detail" :id="$route.params.id" :is="detail"></component>
    <div class="btn-center">
      <Button type="primary" class="button-ok" @click="next('dataform')">提交订单</Button>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Vue, Watch} from 'vue-property-decorator'
import { queryList } from '@/api/shopping'
import { formatCurrency } from '@/fn/string'
import moment from 'moment'
import wbDtail from './wbdetail.vue'
import otherdetail from './otherdetail.vue'

const timeFormat = 'YYYY-MM-DD SS:DD'
@Component({
  components: {
    wbDtail,
    otherdetail
  }
})
export default class Main extends Vue {
  form: any = {
    name: '',
    videoId: 0,
  }
  comloading = false
  detail: any = null
  adverList: any = []
  tableDate: any = []
  checkId: any = []
  sumList: any = []
  sum = 0
  checkboxAll = false
  rule: any = {

  }

  columns: any = [
    { type: 'selection', width: 50, align: 'center' },
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
    this.init()
  }

  async init() {
    try {
      const { data } = await queryList({})
      this.tableDate = data.items
    } catch (ex) {

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
      (this.$refs.detail as any).init(id, set)
    })
  }

  formatNumber(num: any) {
    return formatCurrency(num)
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
    if (val.id == 1) {
      this.detail = wbDtail
    } else {
      this.detail = otherdetail
    }
  }
}

</script>
<style lang='less' scoped>
@import '~@/site/common.less';
.item-top {
  margin-left: 30px;
}
/deep/ .ivu-table-wrapper {
  /deep/ .ivu-table-header th {
    height: 50px;
    line-height: 50px;
    span {
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
  margin: 10px 20px 0;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background: #f9f9f9;
  padding: 0 30px 0 18px;
}
.btn-center {
  margin: 40px 0 30px;
  text-align: center;
}
</style>