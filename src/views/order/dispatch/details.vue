<template>
  <div class="page home-bg">
    <div class="layout-nav-title">
       <router-link :to="{name: 'order-dispatch'}" >广告单</router-link> > 
       <span>广告单详情</span>
    </div>

    <h3 class="layout-title">基本信息</h3>
    <div class="text-rows">
      <Row>
        <Col span="12">
            <p><label>广告片名称</label>{{list.videoName}} </p>
            <p><label>广告片规格</label>{{list.specification}}s </p>
            <p><label>投放周期</label>{{list.cycle}}天</p>
            <p><label>投放排期</label>{{formatConversion(list.beginDate)}} ~ {{formatConversion(list.endDate)}}</p>
        </Col>
        <Col span="12">
            <p><label>预估最大收益</label>{{list.estimateRevenue}} </p>
            <p v-if="targetCinemaLength > 1">
                  <label>目标影院：</label>
                  <em>{{targetCinemaLength}}家</em> 
                  <span class="query-status"  @click="edittarget(list.id, 1)" >查看</span></p>
            <p v-else><label>目标影院：</label><em>{{list.cinemaName}}</em></p>
            <p><label>目标影厅</label>{{list.hallsCount}} </p>
            <p><label>目标场次</label>{{list.sceneCount}} </p>
        </Col>
      </Row>
    </div>

    <h3 class="layout-title">广告排期</h3>
    <Table stripe  :columns="schedulingList" :data="schedulingData" >
      <template slot="beginDate" slot-scope="{row, index}">
        <span>{{formatConversion(row.beginDate)}} ~ {{formatConversion(row.endDate)}}</span>
      </template>
      <template slot="cycle" slot-scope="{row}">
        <span>{{row.cycle}}天</span>
      </template>
    </Table>
    
    <h3 class="layout-title">接单影院({{total}})</h3>
    <div class="table-wrapper-list">
      <ul class="cinema-list-title flex-box">
        <li>专资编码</li>
        <li>影院名称</li>
        <li>专资编码</li>
        <li>影院名称</li>
      </ul>
      <ul>
        <li v-for="item in cinemaDataList" :key="item.id" class="flex-box cinema-li">
          <span>{{item.code}}</span><span>{{item.officialName}}</span>
        </li>
      </ul>
    </div>
    
    <h3 class="layout-title">DCP包</h3>
    <div class="video-plyr">
      <VuePlyr> <video :src="list.srcFileUrl" ></video></VuePlyr>
    </div>
    <Table  stripe  :columns="columnsDcp" :data="dcpData">
      <template slot="typeCode" slot-scope="{row}">
        <span v-for=" item in list.typeList" v-if="row.typeCode == item.key">{{item.text}}</span>
      </template>
      <template slot="name" slot-scope="{row, index}">
        <a :href="row.fileUrl" target="_blank">{{row.name}}</a>
      </template>
    </Table>

    <h3 class="layout-title">日志</h3>
    <div class="text-rows log-list">
      <p v-for="(item, index) in logList" :key="index">
        <span>{{item.createTime}}</span>
        <span>{{item.email}}</span>
        <span>{{item.description}}</span>
      </p>
    </div>
    <targetDlg ref="target" v-if="targetShow" />
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatConversion } from '@/util/validateRules.ts'
import { VuePlyr } from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import { orderDetail, receiveCinemaList } from '@/api/norderDis'
import targetDlg from './targetDlg.vue'


@Component({
  components: {
    VuePlyr,
    targetDlg
  }
})
export default class Main extends ViewBase {
  form = {
    pageIndex: 1,
    pageSize: 20
  }
  total = 0
  id: string = ''
  list: any = []
  targetShow = false
  targetCinemaLength = 0

  schedulingList = [
    {title: '影片', key: 'movieName', align: 'center'},
    {title: '投广排期', slot: 'beginDate', align: 'center'},
    {title: '投广周期', slot: 'cycle', align: 'center'},
  ]
  schedulingData = []
  cinemaDataList = []

  // DCP下载
  columnsDcp = [
    { title: '格式', slot: 'typeCode', align: 'center' },
    { title: '下载链接', slot: 'name', align: 'center'}
  ]
  dcpData = []
  logList = []

  get formatConversion() {
    return formatConversion
  }

  mounted() {
    this.id = this.$route.params.id
    this.querySelect()
    this.receiveCinemaList()
  }

  edittarget(id: any, type: any) {
    this.targetShow = true
    this.$nextTick(() => {
      (this.$refs.target as any).init(id, type)
    })
  }
  // 详情
  async querySelect() {
    const id = this.id
    try {
      const {
        data: {item}
      } = await orderDetail(id)
      this.list = item || {}
      this.schedulingData = item.targetMovies
      // 目标影院
      this.targetCinemaLength = item.targetCinemas.length
      this.dcpData = item.attachments
      this.logList = item.logList
    } catch (ex) {
     this.handleError(ex)
    }
  }
  // 接单影院
  async receiveCinemaList() {
    try {
      const {
        data: { items, totalCount}
      } = await receiveCinemaList(this.id, {
        ...this.form
      })
      this.cinemaDataList = items || []
      this.total = totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }
}

</script>
<style lang='less' scoped>
.query-status {
  color: #0f4d96;
  cursor: pointer;
  padding-left: 10px;
}
.table-wrapper-list {
  margin: 30px 20px 20px;
}
.cinema-list-title {
  li {
    width: 25%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    background-color: #f8f8f9;
  }
}
.cinema-li {
  width: 50%;
  display: inline-block;
  height: 48px;
  line-height: 48px;
  span {
    display: inline-block;
    width: 50%;
    text-align: center;
  }
}
.video-plyr {
  width: 80%;
  margin: 25px auto;
}
.log-list {
  color: #444;
  span {
    margin-right: 30px;
  }
}
</style>