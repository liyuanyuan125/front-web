<template>
  <div class="page detail-list">
    <div class="order-nav">广告单详情</div>
    <!-- 基本信息 -->
    <div class="list-col-item">
      <h3 class="title">基本信息</h3>
      <div class="text-rows-col">
        <Row>
          <Col span="8">
              <p><label>广告片名称</label>{{list.videoName || '暂无'}} </p>
              <p><label>投放周期</label>{{list.cycle || 0}}天</p>
              <p><label>投放排期</label>{{formatConversion(list.beginDate)}} ~ {{formatConversion(list.endDate)}}</p>
          </Col>
          <Col span="8">
              <p>
                <label>预估最大收益</label>
                <span v-if="list.estimateRevenue" class="max-pofit">{{formatNumber(list.estimateRevenue)}}</span>
                <span v-else>暂无</span>
              </p>
              <p v-if="targetCinemaLength > 1">
                    <label>目标影院：</label>
                    <em>{{targetCinemaLength}}家</em> 
                    <span class="query-status"  @click="edittarget(list.id, 1)" >查看</span></p>
              <p v-else><label>目标影院：</label><em>{{list.cinemaName || '暂无'}}</em></p>
              <p><label>目标场次</label>{{list.sceneCount || '暂无'}} </p>
          </Col>
          <Col :span="8">
              <p><label>广告片规格</label>{{list.specification || 0}}s </p>
              <p><label>目标影厅</label>{{list.hallsCount || '暂无'}} </p>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 广告排期 -->
    <div class="list-col-item">
      <h3 class="title">广告排期</h3>
      <div class="text-rows-col">
        <Row>
          <Col :span="8"><p><label>影片</label>{{schedulingData.movieName || '暂无'}} </p></Col>
          <Col :span="8"><p><label>投放排期</label> <span>{{formatConversion(schedulingData.beginDate)}} ~ {{formatConversion(schedulingData.endDate)}}</span> </p></Col>
          <Col :span="8"><p><label>投放周期</label>{{schedulingData.cycle || 0}}天 </p></Col>
        </Row>
      </div>
    </div>
    <!-- 接单影院 -->
    <div v class="list-col-item">
      <h3 class="title">接单影院</h3>
      <div class="text-rows-col table-wrapper-list">
        <ul class="cinema-list-title flex-box">
          <li >专资编码</li>
          <li >影院名称</li>
          <li >专资编码</li>
          <li >影院名称</li>
        </ul>
        <ul class="cinema-ul">
          <li v-for="item in cinemaDataList" :key="item.id" class="flex-box cinema-li">
            <span>{{item.code}}</span><span>{{item.shortName}}</span>
          </li>
        </ul>
      </div>
      <Page :total="total"  v-if="total>0" class="page-list" :current="pageIndex"
      :page-size="pageSize"  show-total  show-elevator 
       @on-change="handlepageChange"  @on-page-size-change="handlepageChange" />
    </div>
    
    <!-- dcp包 -->
    <div class="list-col-item">
      <h3 class="title">DCP包</h3>
      <div class="video-plyr">
        <VuePlyr> <video :src="list.srcFileUrl" ></video></VuePlyr>
      </div>
      <div class="down-dcp-url">
        <h4 class="flex-box"><span>格式</span><span>下载链接</span></h4>
        <ul>
          <li v-for="item in dcpData" class="flex-box">
             <span v-for=" it in list.typeList" v-if="item.typeCode == it.key">{{it.text}}</span>
             <a :href="item.fileUrl" target="_blank">{{item.name}}</a>
          </li>
        </ul>
      </div>
    </div>
    <!-- <Table  stripe  :columns="columnsDcp" :data="dcpData">
      <template slot="typeCode" slot-scope="{row}">
        <span v-for=" item in list.typeList" v-if="row.typeCode == item.key">{{item.text}}</span>
      </template>
      <template slot="name" slot-scope="{row, index}">
        <a :href="row.fileUrl" target="_blank">{{row.name}}</a>
      </template>
    </Table> -->
    <!-- 日志 -->
    <div class="list-col-item">
      <h3 class="title">日志</h3>
      <div class="text-rows log-list">
        <p v-for="(item, index) in logList" :key="index">
          <span>{{handleCreateTime(item.createTime)}}</span>
          <span>{{item.email}}</span>
          <span>{{item.description}}</span>
        </p>
      </div>
    </div>
    <targetDlg ref="target" v-if="targetShow" />
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatConversion, formatNumber } from '@/util/validateRules.ts'
import { VuePlyr } from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import { orderDetail, receiveCinemaList } from '@/api/norderDis'
import targetDlg from './targetDlg.vue'
import moment from 'moment'

const timeFormat = 'YYYY/MM/DD HH:mm:ss'


@Component({
  components: {
    VuePlyr,
    targetDlg
  }
})
export default class Main extends ViewBase {
  pageIndex = 1 // 页码
  pageSize = 20 // 页数

  form = {
    pageIndex: 1,
    pageSize: 20
  }
  total = 0

  id: string = ''
  list: any = []
  targetShow = false
  targetCinemaLength = 0

  schedulingData = []
  cinemaDataList: any = []

  dcpData = []
  logList = []

  get formatConversion() {
    return formatConversion
  }

  get formatNumber() {
    return formatNumber
  }

  mounted() {
    this.id = this.$route.params.id
    this.querySelect()
    this.receiveCinemaList()
  }
  handleCreateTime(times: any) {
    return moment(times).format(timeFormat)
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
      this.schedulingData = item.targetMovies[0] || []
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

  handlepageChange(size: any) {
    this.pageIndex = size
    this.receiveCinemaList()
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/kol/less/common.less';
.detail-list {
  padding: 30px 40px 70px;
  .list-col-item {
    border-radius: 5px;
    border: solid 1px #fff;
    background: rgba(255, 255, 255, .3);
    padding: 25px 30px 12px;
    margin-bottom: 25px;
    color: #00202d;
    .title {
      font-size: 24px;
      font-weight: 0;
      padding-bottom: 35px;
    }
    .text-rows-col {
      font-size: 14px;
      p {
        padding-bottom: 18px;
        label {
          display: inline-block;
          width: 100px;
        }
        .max-pofit {
          color: #da6c70;
          font-size: 16px;
        }
      }
    }
    .down-dcp-url {
      h4 {
        height: 50px;
        line-height: 50px;
        background: #fff;
        margin-bottom: 10px;
        span {
          width: 50%;
          display: block;
          text-align: center;
        }
      }
      ul {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 14px;
      }
      li {
        font-size: 14px;
        padding: 23px 30px;
        color: #00202d;
        width: 49%;
        background: rgba(249, 249, 249, .6);
        border: 1px solid rgba(255, 255, 255, .6);
        margin-bottom: 20px;
        justify-content: space-between;
        span {
          width: 30%;
          display: block;
        }
        a {
          display: inline-block;
          color: #01a9be;
        }
      }
    }
  }
}
.page-list {
  text-align: center;
  padding: 30px 0;
}
.query-status {
  color: #0f4d96;
  cursor: pointer;
  padding-left: 10px;
}
.table-wrapper-list {
  margin: 0 30px 35px;
}
.cinema-list-title {
  li {
    height: 40px;
    width: 50%;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    font-weight: 300;
    background-color: #fff;
  }
}
.cinema-ul {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.cinema-li {
  width: 50%;
  padding: 20px 0;
  // height: 68px;
  // line-height: 68px;
  // border-bottom: 1px solid rgba(255, 255, 255, .2);
  span {
    display: inline-block;
    width: 50%;
    text-align: center;
  }
}
.video-plyr {
  width: 90%;
  margin: 0 auto 25px;
}
.log-list {
  color: #444;
  span {
    margin-right: 30px;
  }
}
</style>