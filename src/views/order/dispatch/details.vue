<template>
  <div class="page home-bg">
    <div class="layout-nav-title">
       <router-link :to="{name: 'account-user'}" >广告单</router-link> > 
       <span>广告单详情</span>
    </div>

    <h3 class="layout-title">基本信息</h3>
    <div class="text-rows">
      <Row>
        <Col span="12">
            <p><label>广告片名称</label> xxxx </p>
            <p><label>广告片规格</label> xxx </p>
            <p><label>投放周期</label> xxx </p>
            <p><label>投放排期</label> xxx </p>
        </Col>
        <Col span="12">
            <p><label>预估最大收益</label> xxxx </p>
            <p><label>目标影院</label> xxx </p>
            <p><label>目标影厅</label> xxx </p>
            <p><label>目标场次</label> xxx </p>
        </Col>
      </Row>
    </div>

    <h3 class="layout-title">广告排期</h3>
    <Table stripe  :columns="schedulingList" :data="schedulingData" ></Table>
    
    <h3 class="layout-title">接单影院(99)</h3>
    <div class="table-wrapper-list">
      <ul class="cinema-list-title flex-box">
        <li>专资编码</li>
        <li>影院名称</li>
        <li>专资编码</li>
        <li>影院名称</li>
      </ul>
      <ul>
        <li v-for="item in cinemaDataList" class="flex-box cinema-li">
          <span>{{item.code}}</span><span>{{item.cinemaName}}</span>
        </li>
      </ul>
    </div>
    
    <h3 class="layout-title">DCP包</h3>
    <div class="video-plyr">
      <VuePlyr> <video :src="srcFileUrl" ></video></VuePlyr>
    </div>
    <Table  stripe  :columns="columnsDcp" :data="dcpData">
      <template slot="name" slot-scope="{row, index}">
        <a :href="row.name" target="_blank">{{row.name}}</a>
      </template>
    </Table>

    <h3 class="layout-title">日志</h3>
    <div class="text-rows log-list">
      <p v-for="(item, index) in logList" :key="index">
        <span>{{item.times}}</span>
        <span>{{item.name}}</span>
        <span>{{item.text}}</span>
      </p>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Vue} from 'vue-property-decorator'
import { VuePlyr } from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'


@Component({
  components: {
    VuePlyr
  }
})
export default class Main extends Vue {
  schedulingList = [
    {title: '影片', key: 'cinemaName', align: 'center'},
    {title: '投广排期', key: 'schedule', align: 'center'},
    {title: '投广周期', key: 'cycle', align: 'center'},
  ]
  schedulingData = [
    {cinemaName: 'xxxxxx', schedule: 'xxxxxx', cycle: 'xxxxxxxxxxxx'},
    {cinemaName: 'xxxxxx', schedule: 'xxxxxx', cycle: 'xxxxxxxxxxxx'},
    {cinemaName: 'xxxxxx', schedule: 'xxxxxx', cycle: 'xxxxxxxxxxxx'},
  ]

  cinemaDataList = [
    {code: '12222', cinemaName: '北京万达1'},
    {code: '12222', cinemaName: '北京万达2'},
    {code: '12222', cinemaName: '北京万达3'},
  ]

  columnsDcp = [
    { title: '格式', key: 'typeListText', align: 'center' },
    { title: '下载链接', slot: 'name', align: 'center'}
  ]
  dcpData = [
    {name: 'https://www.baidu.com', typeListText: 'JPEG 2000 Flat'},
    {name: 'https://www.baidu.com', typeListText: 'JPEG 2000 Flat'},
  ]
  srcFileUrl = '//aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bhnt4fp8jlg0008087u0.mp4'
  logList = [
    {times: '2019-1-1 00:00:00', name: 'yuanyuan.li@aiads.com', text: '下刊'},
    {times: '2019-1-1 00:00:00', name: 'yuanyuan.li@aiads.com', text: '下刊'},
    {times: '2019-1-1 00:00:00', name: 'yuanyuan.li@aiads.com', text: '下刊'},
  ]
}

</script>
<style lang='less' scoped>
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