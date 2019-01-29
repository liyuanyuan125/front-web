<template>
  <div class="page home-bg">
    <h3 class="reportTitle">
      广告计划 > 新建广告计划 > 生成投放方案
    </h3>
    <Row class="body">
      <Row>
        <Col :span="24">
          <div class="fince-list">
            <div @click='showClass(1)' :class="['fince-list-big',  {'fince-list-active ':showClassbiao}]">
              <div class="fince-list-acc"><img src="./assets/标准-选中.png" alt="" v-if='showClassbiao'><img src="./assets/标准-灰.png" alt="" v-if='!showClassbiao'>&nbsp;&nbsp;<span>标准投放</span></div>
              <p class="fince-list-sm">普通投放 ， 不支持选择投放影片</p>
            </div>
            <div @click='showClass(2)' :class="['fince-list-big',  {'fince-list-active ':showClassjia}]">
              <div class="fince-list-acc"><img src="./assets/加速.png" alt="" v-if='showClassjia'><img src="./assets/加速-灰.png" alt="" v-if='!showClassjia'>&nbsp;&nbsp;<span>加速投放</span></div>
              <p class="fince-list-sm">快速覆盖人次 ， 支持自主选择3部投放影片</p>
            </div>
            <div @click='showClass(3)' :class="['fince-list-big',  {'fince-list-active ':showClassyou}]">
              <div class="fince-list-acc"><img src="./assets/优享-选中.png" alt="" v-if='showClassyou'><img src="./assets/优享-灰.png" alt="" v-if='!showClassyou'>&nbsp;&nbsp;<span>优享投放</span></div>
              <p class="fince-list-sm">最快覆盖人次 ， 支持自主选择6部投放影片</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col :span="24">
          <h3 class="square">概览</h3>
        </Col>
        <Col :span="10" style='margin-left: 30px;'>
          <div class="report-title-left">
            <dl>
              <dd>广告计划</dd>
              <dt>映前广告</dt>
            </dl>
            <dl>
              <dd>广告计划名称</dd>
              <dt>喔喔奶糖北京复古营销计划</dt>
            </dl>
            <dl>
              <dd>客户名称</dd>
              <dt>奔驰 (ID 748596)</dt>
            </dl>
            <dl>
              <dd>广告片规格</dd>
              <dt>30s</dt>
            </dl>
            <dl>
              <dd>广告片名称</dd>
              <dt>喔喔奶糖北京影院映前广告</dt>
            </dl>
            <dl>
              <dd>投放排期</dd>
              <dt>2019-2-4 周五 ~ 2019-2-10 周二</dt>
            </dl>
            <dl>
              <dd>投放天数</dd>
              <dt>7天</dt>
            </dl>
            <dl>
              <dd>档期</dd>
              <dt>春节档</dt>
            </dl>
          </div>
        </Col>
        <Col :span="12">
          <Row>
            <Col :span="12">
              <div class="people">
                <!-- <div style="height: 100%"> -->
                  <img src="./assets/粉圈.png" alt="">
                  <div class='canpos'>
                    <p style='font-size: 30px;'>{{aboutcount}}</p>
                    <p>预估覆盖场次</p>
                  </div>
                <!-- </div> -->
              </div>
              <!-- <p class="report-title-p2">{{forMat.man}}</p> -->
            </Col>
            <Col :span="12">
              <div class="people">
                <!-- <div ref="container2" style="height: 100%"></div> -->
                <img src="./assets/蓝圈.png" alt="">
                <div class='canpos'>
                  <p style='font-size: 30px;'>￥{{pricecount}}</p>
                  <p>预估投放花费</p>
                </div>
              </div>
              <!-- <p class="report-title-p2">¥{{forMat.ceil}}</p> -->
            </Col>
          </Row>
        </Col>
      </Row>

      <Row class="pt40" v-if="$route.params.id == 2">
        <Col :span="24">
          <h3 class="square">投放影片</h3>
        </Col>
        <Col class="mt30 xq-m" :span="22">
           <Row :gutter="30">
             <Col :span="6" class='img-c' style="height: 240px">
              <img src="./assets/poster.png" alt="">
             </Col>
             <Col class="poster-title" :span="18" style="height: 240px">
              <Row class='row-xq'>
                <Col span='10'><span>影片名称</span>《大黄蜂》</Col>
                <Col span='14'><span style='width: 28%;'>影片标语</span> 纽特与邓布利多组队对决黑巫师</Col>
              </Row>
              <Row class='row-xq'>
                <Col span='10'><span>上映日期</span> 2019-1-4</Col>
                <Col span='14'><span style='width: 28%;'>片长</span> 125分钟</Col>
              </Row>
              <Row class='row-xq-24'>
                <Col span='24'><span>影片类型</span> 动作 / 科幻 / 冒险</Col>
              </Row>
              <Row class='row-xq-24'>
                <Col span='24'><span>导演</span> 特拉维斯 奈特</Col>
              </Row>
              <Row class='row-xq-24'>
                <Col span='24'><span>演员</span> 海莉 斯坦菲尔德／小豪尔赫 兰登伯格／约翰 塞纳／杰森 德鲁克...</Col>
              </Row>
              <Row class='row-xq-l24'>
                <Col span='24'><span>根据您选择的地域偏好，我们将优先为您覆盖以下地域</span> 华北 | 华东 | 华南</Col>
              </Row>
             </Col>
           </Row>
        </Col>
      </Row>

      <Row class="pt40">
        <Col :span="24">
          <h3 class="square">覆盖地区</h3>
        </Col>
        <Col class="mt20" :span="24">
          <ul class="tag" style="left: 0px">
            <li class="tag-ltme">
              <span>区域</span>
              <span>4个</span>
            </li>
            <li class="tag-ltme">
              <span>省份</span>
              <span>6个</span>
            </li>
            <li class="tag-ltme">
              <span>城市</span>
              <span>8个</span>
            </li>
            <li class="tag-ltme">
              <span>影院</span>
              <span>500个</span>
            </li>
          </ul>
        </Col>
        <Col class="mt70 posi-map" :span="12">
          <CitySelect :value="[1,2,3,4,5,6,7]" readonly class="city-map"/>
          <div class='pos-map'>
            <ul>
              <li>华北</li>
              <li>华南</li>
              <li>华中</li>
            </ul>
            <div>一线城市3个</div>
            <div>二线城市3个</div>
            <div>三线城市3个</div>
            <div>四线城市3个</div>
          </div>
          <!-- <CitySelect v-else :value="[1,2,3,4,5,6]" type="beijing" readonly class="city-map"/> -->
        </Col>
        <Col class="mt70" :span="12">
          <Table ref="selection" stripe class="tables" :columns="columns" :data="tableData"></Table>
          <Button  type="primary" class="mt30" @click="view" style="float: right; height: 40px; margin-right: 10px; margin-bottom: 10px;">查看全部影院</Button>
        </Col>
      </Row>

      <Row class="pt40" style='margin-bottom: 30px;' v-if='$route.params.id == 1'>
        <Col :span="24">
          <h3 class="square">投放影片</h3>
        </Col>
        <Col class="mt20" :span="24">
          <Col :span="4"><h4 class="select-people">观影人群画像</h4></Col>
          <Col :span="20">
           <ul class="tag" style="left:2px">
              <li class="tag-ltme" style='margin-left:30px;'>
                <img style="vertical-align: middle;" src="./assets/man.png" alt="">
              </li>
              <li class="tag-ltmes">
                <span>30-40岁</span>
              </li>
              <li class="tag-ltmes">
                <span>剧情</span>
              </li>
              <li class="tag-ltmes">
                <span>冒险</span>
              </li>
              <li class="tag-ltme">
                <span>动作</span>
              </li>
            </ul>
          </Col>
        </Col>
        <Col class="mt30" style='margin-top: 10px;' :span="24">
          <Row :gutter="30">
            <Col :span="4" style="text-indent: 1em;padding-left:30px;line-height: 50px;">推荐影片</Col>
            <Col :span="17" style="text-indent: 1em;padding-left:30px;line-height: 50px;">说明：请选择不超过3部影片，系统将优先为您排播所选择影片的映前广告。</Col>
            <Col :span='3' style='line-height:50px;color:#fe8135'>已选3部影片</Col>
          </Row>
           <Row class='pi' :gutter="30">
            <Col :span="4" style="text-indent: 1em;padding-left:30px;">&nbsp;&nbsp;&nbsp;&nbsp;</Col>
            <img class='pi-one' src="./assets/匹配度一.png" alt="">
            <img class='pi-two' src="./assets/匹配度二.png" alt="">
            <img class='pi-three' src="./assets/匹配度三.png" alt="">
            <Col :span='20'>
              <Col :span="5" class='sp-c' v-for='(it , index) in tuifilm' :key='index'>
                <dl  @click="selectFilm(it.id)" :class="['cinema-img',  {'cinema-img-active ': showClassimg}]">
                  <div class="cinema-check" v-if="cinemaIdArray.includes(it.id)"></div>
                  <dd class='s-img'>
                    <img class='img' :src=it.mainPicUrl alt="">
                    <div>上映日期：{{it.openTime}}</div>
                    <!-- <img class='posimg' src='./assets/已选.png' alt='' v-if="cinemaIdArray.includes(it.id)"> -->
                  </dd>
                  <dt>《{{it.name}}》</dt>
                  <dt><span v-for='(item , index) in it.type' :key='index'>{{item}}/</span></dt>
                </dl>
              </Col>
            </Col>
           </Row>
        </Col>
      </Row>


      <!-- <Row class="pt40" v-if="$route.params.corp == 2">
        <Col :span="24">
          <h3 class="square">广告版位－海报灯箱</h3>
        </Col>
        <Col class="mt30" :span="24">
           <Row :gutter="30">
             <Col :span="8">
              <ul class="version">
                <li><img src="./assets/check.png" alt="">img 位置</li>
                <li><img src="./assets/check.png" alt="">位置图片</li>
                <li><img src="./assets/check.png" alt="">尺寸</li>
                <li><img src="./assets/check.png" alt="">素材要求</li>
              </ul>
             </Col>
             <Col :span="16">
              <div class="tabs1"></div>
             </Col>
           </Row>
        </Col>
      </Row> -->

      <Row class="pt40">
        <Col :span="24">
          <h3 class="square">费用预估<span>说明：实际投放花费需要在广告播放后生成，会与预计花费有一定偏差。</span></h3>
        </Col>
        <Col :span="23" class="mt30" offset="1">
          <div class="flex">
            <span>预估投放花费=</span>
            <h4 class="ceil">¥{{pricecount}}</h4>
          </div>
        </Col>
        <Col :span="23" class="mt30" offset="1">
          <div class="flex">
            <span>预估冻结金额 = 预估投放发费 = </span>
            <h4 class="ceil">¥{{pricecount}}</h4>
          </div>
        </Col>
      </Row>
    </Row>
    <div class="report-button">
      <Button type="primary" @click="edit" style="width: 370px">确认投放方案</Button>
      <Button type="default">存为草稿</Button>
    </div>
    <!-- 确认生成 -->
    <DlgDetail v-if="addOrUpdateVisible" ref="addOrUpdate" />
    <!-- 查看已选影院 -->
    <dlgCinema v-if="addcinema" ref="addcine" />

  </div>
</template>

<script lang="tsx">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import DlgDetail from './dlgdetail.vue'
import dlgCinema from '../plan/default/cinemaDlg.vue'
import CitySelect from '../plan/citySelect.vue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import jsxReactToVue from '@/util/jsxReactToVue'
import { queryList , addplan , abcount , pricount , tuijian , cinemaList } from '@/api/planput'
import echarts from 'echarts' // 引入echarts

// const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD'


const mockMap = [
  {
    name: '2019款全新奔驰G级影院广告－春节档',
    client: '奔驰',
    time: '2019-2-4 ～2019-2-10',
    longTime : '7',
    data: '春节档',
    man : '400,000',
    ceil: '4,000,000.00',
    sex: '男',
    id: '1'
  },
  {
    name: '“我爱筱面”美食节6月推广',
    client: '西贝餐饮',
    time: '2019-6-1 ～2019-6-10',
    longTime : '10',
    data: '无',
    man : '400,000',
    ceil: '4,000,000.00',
    sex: '女',
    id: '2'
  },
  {
    name: 'DIOR 新品红管唇釉推广',
    client: '迪奥',
    time: '2019-2-4 ～2019-2-10',
    longTime : '7',
    data: '无',
    man : '400,000',
    ceil: '4,000,000.00',
    sex: '男',
    id: '3'
  }
]

@Component ({
  components: {
    DlgDetail,
    CitySelect,
    dlgCinema
  }
})
export default class Main extends ViewBase {
  // tab
  showClassbiao: any = true
  showClassjia: any = false
  showClassyou: any = false

  // img
  showClassimg: any = false
  isActive: any = null


  addOrUpdateVisible = false
  addcinema = false

  // 加速类型
  typeList: any = []
  // 预估chanci
  aboutcount: any = 0
  // 预估huafei
  pricecount: any = 0
  // 推荐影片
  tuifilm: any = []
  // yingyuan
  cinemaList: any = []

  cinemaIdArray: any = []


  dataFrom: any = {
    type: '1', // 方案类型
    name: '', // 计划名称
    videoId: null, // 广告片ID
    calendarId: null, // 档期ID
    beginDate: null, // 排期开始时间
    endDate: null, // 排期结束时间
    deliveryType: null, // 投放类型
    budgetCode: '', // 预算区间
    budgetAmount: null, // 预算金额
    billingMode: null, // 击飞方式
    deliveryMovies: [], // 投放影片
    status: null, // 计划状态
    estimateCostAmount: null, // 预估花费
    estimateShowCount: null, // 预估曝光场次
    directionType: null, // 定向投放类型（1标准投放2单片投放）
    deliveryGroups: [], // 观影人群画像
    cinemas: [], // 影院列表
  }

  get tableData() {
    if (this.$route.params.corp != '2') {
      return this.cinemaList
    } else {
      return [
        { names : '金源购物中心', codes: '商场', seats: '西贝筱面村(王府井店)', juli: '0.78km'},
        { names : '伊斯特大厦', codes: '商场', seats: '西贝筱面村(王府井店)', juli: '0.90km'},
        { names : '万达广场', codes: '商场', seats: '西贝筱面村(通州万达店)', juli: '0.10km'},
        { names : '爱沐咖啡私人影院', codes: '商场', seats: '西贝筱面村(通州万达店)', juli: '1.21km'},
        { names : '奥体中心', codes: '体育馆', seats: '西贝筱面村(小关店)', juli: '0.28km'},
        { names : '中国木偶剧院', codes: '商场', seats: '西贝筱面村(小关店)', juli: '1.78km'}
      ]
    }
  }

  get columns() {
    if (this.$route.params.corp != '2') {
      return [
        { title: '专资编码', key: 'code', align: 'center'},
        { title: '影院名称', key: 'officialName', align: 'center'},
        { title: '总座位数', key: 'seatCount', align: 'center'}
      ]
    } else {
      return [
        { title: '场馆名称', width: 150, key: 'names', align: 'center'},
        { title: '场馆类型', key: 'codes', align: 'center'},
        { title: '最近门店', width: 170, key: 'seats', align: 'center'},
        { title: '距离', key: 'juli', align: 'center',
          render: (hh: any, { row: { juli } }: any) => {
            /* tslint:disable */
            const h = jsxReactToVue(hh)
            return <span class="orange">{juli}</span>
            /* tslint:enable */
          }
        }
      ]
    }
  }

  get forMat() {
    const corp: any = ((this.$route.params as any).corp) || 0
    return mockMap.filter((it: any) => {
      return it.id == corp
    })[0]
  }
  // 查看影院
  view() {
    this.addcinema = true
    this.$nextTick(() => {
      (this.$refs.addcine as any).init(this.forMat)
    })
  }

  // 确认生成
  edit() {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).init(this.forMat)
    })
  }

  showClass( index: any) {
    if (index == 1) {
      this.showClassbiao = true
      this.showClassjia = false
      this.showClassyou = false
      this.dataFrom.type = '1'
      this.seach()
    } else if (index == 2) {
      this.showClassbiao = false
      this.showClassjia = true
      this.showClassyou = false
      this.dataFrom.type = '3'
      this.seach()
    } else if (index == 3) {
      this.showClassbiao = false
      this.showClassjia = false
      this.showClassyou = true
      this.dataFrom.type = '3'
      this.seach()
    }
  }
  showimg(index: any) {
    this.isActive = index

    // console.log(this.tuifilm)
    // if (this.isActive == index) {
    //   this.isActive = null
    // } else if (this.isActive == null) {
    //   this.isActive = index
    // }
  }

  selectFilm(id: any) {
    // console.log(123)
    if (!this.cinemaIdArray.includes(id)) {
      this.cinemaIdArray.push(id)
    } else {
      this.cinemaIdArray = this.cinemaIdArray.filter((it: any) => it != id )
    }
  }

  mounted() {
    this.seach()
    // console.log(this.$route.params.id)
    // console.log(sessionStorage.getItem(this.$route.params.id))
  }

  async seach() {
    try {
      const {
        data
      } = await queryList()
      // 获取状态列表
      this.typeList = data.typeList
      // 获取预估覆盖场次
      const resab = await abcount({cinemaCount: 5 , type: this.dataFrom.type})
      this.aboutcount = resab.data
      // console.log(this.aboutcount)
      // 获取预估投放花费
      const respri = await pricount({budgetCode: '00-50' , type: this.dataFrom.type , budgetAmount: ''})
      this.pricecount = respri.data
      // 推荐影片
      const tui = await tuijian({types: 'juqing' , pageSize : 8})
      this.tuifilm = (tui.data.data.items || []).map((it: any) => {
        return {
          ...it,
          openTime: moment(it.openTime).format(timeFormat)
        }
      })
      // yingyuan
      const cinema = await cinemaList({ids: '233,156', pageIndex: 1, pageSize: 6})
      this.cinemaList = cinema.data.items
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.cinema-check {
  position: absolute;
  left: -5px;
  right: -5px;
  top: -5px;
  bottom: -5px;
  z-index: 8;
  border: 5px solid #fe8135;
  background: url('./assets/已选.png') no-repeat top right;
}
.colBg {
  font-size: 18px;
  font-weight: 400;
  color: #444;
  height: 50px;
  line-height: 50px;
  padding: 0 40px;
  margin-bottom: 20px;
  background: @c-head-bg;
}
.page {
  background: #fff;
  height: 100%;
  font-size: 14px;
  .ivu-table-wrapper {
    margin: 0;
  }
  .table-box {
    div {
      display: inline-block;
    }
    background: rgba(249, 249, 249, 1);
    border-radius: 2px 2px 0  0;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
  }
  /deep/ .orange {
    color: #fe8135;
  }
  .table-left-title {
    float: left;
    padding-left: 1.2%;
    color: #222;
  }
  .table-right-title {
    float: right;
    padding-right: 1.2%;
    color: #2481d7;
    cursor: pointer;
  }
  .reportTitle {
    background: rgba(249, 249, 249, 1);
    height: 50px;
    line-height: 50px;
    display: block;
    color: #2481d7;
    font-family: normal;
    cursor: pointer;
    font-size: 14px;
    padding-left: 30px;
  }
  .posi-map {
    position: relative;
    font-size: 12px;
    .pos-map {
      position: absolute;
      top: 0;
      left: 20px;
      ul {
        height: 20px;
        margin-bottom: 8px;
        li {
          float: left;
          margin-right: 2px;
          border: 1px solid #fe8135;
          background: rgba(255, 239, 231, 0.5);
          line-height: 20px;
          color: #fe8135;
          padding: 2px 14px 2px 14px;
        }
      }
      div {
        width: 100px;
        border: 1px solid #fe8135;
        background: rgba(255, 239, 231, 0.5);
        line-height: 20px;
        margin-top: 2px;
        color: #fe8135;
        text-align: center;
        // padding: 2px 5px 2px 5px;
      }
    }
  }
  .pi {
    position: relative;
    .pi-one {
      position: absolute;
      top: 0.8%;
      left: 21.3%;
      z-index: 10;
    }
    .pi-two {
      position: absolute;
      top: 0.8%;
      left: 40.6%;
      z-index: 10;
    }
    .pi-three {
      position: absolute;
      top: 0.8%;
      left: 59.7%;
      z-index: 10;
    }
  }
  .s-img {
    position: relative;
    div {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #fff;
      background: rgba(0, 0, 0, 1);
    }
    .posimg {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .money, .people {
    width: 100%;
    margin-top: 72px;
    text-align: center;
    height: 300px;
    .canpos {
      width: 96%;
      height: 50px;
      margin-top: -152px;
    }
  }
  .select-people {
    height: 40px;
    line-height: 40px;
    font-weight: 400;
    padding-left: 30px;
  }
  .sp-c {
    margin-left: 3%;
    margin-bottom: 1%;
  }
  .body {
    padding: 16px 0 40px;
    .square {
      font-size: 14px;
      height: 50px;
      line-height: 50px;
      padding-left: 30px;
      background: rgba(249, 249, 249, 1);
      border-radius: 2px 2px 0 0;
      span {
        float: right;
      }
    }
    .img-c {
      img {
        height: 100%;
      }
    }
    .report-title-left {
      padding-top: 48px;
      dl {
        margin-bottom: 18px;
        display: flex;
        font-size: 14px;
        dd {
          width: 30%;
          color: #989898;
        }
        dt {
          flex: 1;
          color: #444;
        }
      }
    }
    .tag {
      position: absolute;
      top: 0;
      left: 160px;
      .tag-ltme {
        float: left;
        width: 120px;
        height: 30px;
        background: rgba(249, 249, 249, 1);
        text-align: center;
        line-height: 30px;
        margin-left: 20px;
        span {
          margin-right: 10px;
          color: #222;
        }
        span:nth-child(1) {
          color: #fe8135;
        }
        .orgrn {
          color: #fe8135;
          margin-right: 5px;
        }
      }
      .tag-ltmes {
        float: left;
        width: 120px;
        height: 30px;
        background: rgba(249, 249, 249, 1);
        text-align: center;
        line-height: 30px;
        margin-left: 20px;
        span {
          margin-right: 10px;
          color: #222;
        }
        .orgrn {
          color: #fe8135;
          margin-right: 5px;
        }
      }
    }
    .cinema-img {
      text-align: center;
      border: 5px solid #fff;
      .img {
        width: 100%;
        height: 265px;
      }
    }
    .cinema-img-active {
      border: 5px solid #fe8135 !important;
    }
    .poster-title {
      background: #f9f9f9;
      p {
        padding-left: 8px;
        color: #444;
        span {
          margin-left: 5px;
          margin-right: 40px;
        }
      }
    }
    .version {
      margin-left: 20px;
      li {
        margin-bottom: 20px;
        color: #444;
        img {
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
    .tabs1 {
      height: 260px;
      background: url('../plan/assets/tabs1.png') no-repeat;
      background-size: cover;
    }
    .ceil {
      font-size: 20px;
      font-weight: 500;
      color: rgba(254, 129, 53, 1);
      line-height: 20px;
      letter-spacing: 2px;
      margin-left: 8px;
    }
    .flex {
      display: flex;
    }
    .pt40 {
      // padding-top: 40px;
    }
    .pt20 {
      padding-top: 20px;
    }
    .mt6 {
      margin-top: 6px;
    }
    .mt10 {
      margin-top: 10px;
    }
    .mt20 {
      margin-top: 20px;
    }
    .mt30 {
      margin-top: 30px;
    }
    .xq-m {
      margin: 30px;
      background: rgba(249, 249, 249, 1);
      padding: 20px 30px 20px 30px;
    }
    .mt70 {
      margin-top: 70px;
    }
    .report-title-p1 {
      text-align: center;
      height: 48px;
      line-height: 58px;
      color: #262626;
    }
    .report-title-p2 {
      text-align: center;
      margin-top: 10px;
      font-size: 26px;
      font-weight: 400;
      color: #262626;
    }
  }
  .report-button {
    padding-top: 40px;
    padding-bottom: 40px;
    text-align: center;
    /deep/ button {
      height: 46px;
      margin-right: 20px;
      text-align: center;
    }
  }
}

.city-map {
  /deep/ .map-box {
    margin-top: 0;
    zoom: 0.62;
  }
}
.fince-list {
  .fince-list-big {
    width: 32%;
    display: inline-block;
    height: 120px;
    background: rgba(242, 242, 242, 1);
    border-radius: 2px;
    margin-left: 1%;
    margin-bottom: 12px;
    border-top: 10px solid #f2f2f2;
    .fince-list-acc {
      width: 100%;
      font-size: 22px;
      font-weight: 400;
      color: #222;
      line-height: 22px;
      text-align: center;
      padding-top: 30px;
    }
    .fince-list-sm {
      width: 100%;
      height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(136, 136, 136, 1);
      line-height: 14px;
      text-align: center;
      margin-top: 20px;
    }
  }
  .fince-list-active {
    border-top: 10px solid #fe8135 !important;
  }
}
.row-xq {
  line-height: 40px;
  span {
    color: #989898;
    display: inline-block;
    width: 36%;
  }
}
.row-xq-24 {
  line-height: 40px;
  span {
    color: #989898;
    display: inline-block;
    width: 15%;
  }
}
.row-xq-l24 {
  line-height: 40px;
  span {
    color: #989898;
    display: inline-block;
    width: 67%;
  }
}
</style>


