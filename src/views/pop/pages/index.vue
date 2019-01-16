<template>
  <div class="page home-bg">
    <h3 class="reportTitle">
      投放类型: <span v-if="$route.params.id == 1">映前广告－标准定向</span>
      <span v-if="$route.params.id == 2">映前广告－按单部影片</span>
      <span v-if="$route.params.id == 3">线下场馆</span>
    </h3>
    <Row class="body">
      <Row>
        <Col :span="24">
          <h3 class="square">概览</h3>
        </Col>
        <Col :span="10">
          <div class="report-title-left">
            <dl>
              <dd>广告计划</dd>
              <dt>{{forMat.name}}</dt>
            </dl>
            <dl>
              <dd>客户名称</dd>
              <dt>{{forMat.client}}</dt>
            </dl>
            <dl>
              <dd>投放排期</dd>
              <dt>{{forMat.time}}</dt>
            </dl>
            <dl>
              <dd>投放周期</dd>
              <dt>{{forMat.longTime}}天</dt>
            </dl>
            <dl>
              <dd>档期</dd>
              <dt>{{forMat.data}}</dt>
            </dl>
          </div>
        </Col>
        <Col :span="14">
          <Row>
            <Col :span="12">
              <p class="report-title-p1">预计覆盖人次</p>
              <div class="people">
                <img style="width: 80%" src="./assets/money.png" alt="">
              </div>
              <p class="report-title-p2">{{forMat.man}}</p>
            </Col>
            <Col :span="12">
              <p class="report-title-p1">预估投放花费</p>
              <div class="people">
                <img style="width: 80%" src="./assets/people.png" alt="">
              </div>
              <p class="report-title-p2">¥{{forMat.ceil}}</p>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row class="pt40">
        <Col :span="24">
          <h3 class="square">覆盖区域</h3>
        </Col>
        <Col class="mt20" :span="24">
          <ul class="tag" style="left: 0px">
            <li class="tag-ltme" v-if="$route.params.corp != 2">
              <span>区域</span>
              <span>4个</span>
            </li>
            <li class="tag-ltme" v-if="$route.params.corp != 2">
              <span>省份</span>
              <span>6个</span>
            </li>
            <li class="tag-ltme" v-if="$route.params.corp != 2">
              <span>城市</span>
              <span>8个</span>
            </li>
            <li class="tag-ltme" v-if="$route.params.corp != 2">
              <span>影院</span>
              <span>500个</span>
            </li>
             <li class="tag-ltme" v-if="$route.params.corp == 2">
              <span>城市</span>
              <span>1个</span>
            </li>
            <li class="tag-ltme" v-if="$route.params.corp == 2">
              <span>门店</span>
              <span>67</span>
            </li>
            <li class="tag-ltme" v-if="$route.params.corp == 2">
              <span>场馆</span>
              <span>237个</span>
            </li>
          </ul>
        </Col>
        <Col class="mt70" :span="12">
          <CitySelect v-if="$route.params.corp != 2" :value="[1,2,3,4,5,6,7]" readonly class="city-map"/>
          <CitySelect v-else :value="[1,2,3,4,5,6]" type="beijing" readonly class="city-map"/>
        </Col>
        <Col class="mt70" :span="12">
          <Table ref="selection" stripe class="tables" :columns="columns" :data="tableData"></Table>
          <Button v-if="$route.params.corp == 2" type="primary" class="mt30" @click="edit" style="float: right; height: 40px">查看全部</Button>
        </Col>
      </Row>

      <Row class="pt40" v-if="$route.params.corp == 1">
        <Col :span="24">
          <h3 class="square">投放影片</h3>
        </Col>
        <Col class="mt20" :span="24">
          <Col :span="4"><h4 class="select-people">您选择的观影人群画像</h4></Col>
          <Col :span="20">
           <ul class="tag" style="left:2px">
              <li class="tag-ltme">
                <img style="vertical-align: middle;" src="./assets/man.png" alt="">
              </li>
              <li class="tag-ltme">
                <span>30-40岁</span>
              </li>
              <li class="tag-ltme">
                <span>科幻</span>
              </li>
              <li class="tag-ltme">
                <span>冒险</span>
              </li>
              <li class="tag-ltme">
                <span>动作</span>
              </li>
            </ul>
          </Col>
        </Col>
        <Col class="mt30" :span="24">
           <Row :gutter="30">
             <Col :span="8">
              <dl class="cinema-img">
                <dd><img src="//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgv9f4i893rg0080030g.png" alt=""></dd>
              </dl>
             </Col>
             <Col :span="8">
              <dl class="cinema-img">
                <dd><img src="//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgv9feq893rg00800310.png" alt=""></dd>
              </dl>
             </Col>
             <Col :span="8">
              <dl class="cinema-img">
                <dd><img src="//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgv9fj2893rg0080031g.png" alt=""></dd>
              </dl>
             </Col>
           </Row>
        </Col>
      </Row>

      <Row class="pt40" v-if="$route.params.corp == 3">
        <Col :span="24">
          <h3 class="square">投放影片</h3>
        </Col>
        <Col class="mt20" :span="24">
          <Col :span="4"><h4 class="select-people">您选择的观影人群画像</h4></Col>
          <Col :span="20">
           <ul class="tag" style="left:2px">
              <li class="tag-ltme">
                <img style="vertical-align: middle;" src="./assets/woman.png" alt="">
              </li>
              <li class="tag-ltme">
                <span>30-40岁</span>
              </li>
              <li class="tag-ltme">
                <span>剧情</span>
              </li>
              <li class="tag-ltme">
                <span>冒险</span>
              </li>
            </ul>
          </Col>
        </Col>
        <Col class="mt30" :span="24">
           <Row :gutter="30">
             <Col :span="4" style="text-indent: 2em">已选定投放的影片</Col>
             <Col :span="7" style="height: 430px">
              <img src="./assets/poster.png" alt="">
             </Col>
             <Col class="poster-title" :span="13" style="height: 430px">
              <h3 class="pt40">《飞驰人生》</h3>
              <p class="pt40">导演: <span>韩寒</span> </p>
              <p class="mt6">编剧: <span>韩寒</span></p>
              <p class="mt6">主演: <span>沈腾 / 黄景瑜 / 尹正 / 尹昉 / 田雨 / 腾格尔 / 赵文瑄 / 张本</span></p>
              <p class="mt6">类型：<span>喜剧</span></p>
              <p class="mt6">制片国家/地区：<span>中国大陆</span></p>
              <p class="mt6">语言：<span>汉语普通话</span></p>
              <p class="mt6">上映时间：<span>2019-02-05(中国大陆)</span></p>
              <p class="mt6">片长：<span>125分钟</span></p>
              <p class="mt6">又名：<span>Pegasus</span></p>
              <p class="pt40"><span style="margin-left: 0px">预告片(1)</span><span>新闻(10)</span></p>
             </Col>
           </Row>
        </Col>
      </Row>

      <Row class="pt40" v-if="$route.params.corp == 2">
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
      </Row>

      <Row class="pt40">
        <Col :span="24">
          <h3 class="square">预算和计费</h3>
        </Col>
        <Col :span="23" class="mt30" offset="1">
          <div class="flex">
            <span>预期投放花费=</span>
            <h4 class="ceil">¥{{forMat.ceil}}</h4>
          </div>
        </Col>
        <Col :span="23" class="mt30" offset="1">
          <div class="flex">
            <span>预估冻结金额 = 预估投放发费 = </span>
            <h4 class="ceil">¥{{forMat.ceil}}</h4>
          </div>
        </Col>
      </Row>
    </Row>
    <div class="report-button">
      <Button type="primary" @click="edit" style="width: 370px">确认投放方案</Button>
      <Button type="default">存为草稿</Button>
    </div>
    <DlgDetail v-if="addOrUpdateVisible" ref="addOrUpdate" />
  </div>
</template>

<script lang="tsx">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import DlgDetail from './dlgdetail.vue'
import CitySelect from '../plan/citySelect.vue'
import jsxReactToVue from '@/util/jsxReactToVue'

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
    CitySelect
  }
})
export default class Main extends ViewBase {
  addOrUpdateVisible = false

  get tableData() {
    if (this.$route.params.corp != '2') {
      return [
        { name : '北京横店影视电影城', code: '23375741', seat: '10,000'},
        { name : '深圳万众国际影城', code: '70023342', seat: '10,000'},
        { name : '上海中影国际影城', code: '98574212', seat: '10,000'},
        { name : '北京万达影城', code: '12668473', seat: '10,000'},
        { name : '浙江新远国际影城', code: '12358553', seat: '10,000'},
        { name : '杭州百老汇影城', code: '66273647', seat: '10,000'}
      ]
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
        { title: '影院名称', key: 'name', align: 'center'},
        { title: '总座位数', key: 'seat', align: 'center'}
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

  edit() {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).init(this.forMat)
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
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
  border-top: 3px solid #fe8135;
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
    .colBg;
    .addUser {
      width: 140px;
      height: 40px;
      line-height: 40px;
      display: block;
      text-align: center;
      color: #333;
      font-weight: normal;
      cursor: pointer;
      background: @c-button;
    }
    span {
      margin-left: 8px;
    }
  }
  .money, .people {
    margin-top: 10px;
    text-align: center;
  }
  .select-people {
    height: 40px;
    line-height: 40px;
    font-weight: 400;
  }
  .body {
    padding: 16px 40px 40px;
    .square {
      padding-left: 24px;
      font-size: 18px;
    }
    .square::before {
      position: absolute;
      left: 0;
      top: 4px;
      content: "";
      width: 16px;
      height: 16px;
      background: #fe8135;
      margin-right: 8px;
    }
    .report-title-left {
      padding-top: 48px;
      dl {
        margin-bottom: 18px;
        display: flex;
        font-size: 14px;
        dd {
          width: 80px;
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
      li {
        float: left;
        width: 120px;
        height: 40px;
        background-color: rgba(255, 248, 242, 1);
        text-align: center;
        line-height: 40px;
        margin-right: 20px;
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
      img {
        width: 95%;
      }
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
      padding-top: 40px;
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
</style>
