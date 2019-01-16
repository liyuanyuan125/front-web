<template>
  <div class="page home-bg">
    <h3 class="reportTitle">
      投放类型: 品牌 - 联合推广
    </h3>
    <Row class="body">
      <Row>
        <Col :span="24">
          <h3 class="square">概览</h3>
        </Col>
        <Col :span="3" class="pt20">
          <img style="width: 100%" src="./assets/cinema.png" alt="">
        </Col>
        <Col :span="6" offset="1" class="pt20">
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
              <dt>{{forMat.longTime}}</dt>
            </dl>
            <dl>
              <dd>档期</dd>
              <dt>{{forMat.data}}</dt>
            </dl>
          </div>
        </Col>
        <Col :span="14" class="pt20">
          <img style="width:60%;margin-left:30%" src="./assets/num.png" alt="">
        </Col>
      </Row>

      <Row>
        <Col :span="24">
          <h3 class="square">覆盖区域</h3>
        </Col>
        <Col class="mt20" :span="24">
         <img style="width: 100%" src="./assets/city.png" alt="">
        </Col>
      </Row>

      <Row class="pt20">
        <Col :span="24">
          <h3 class="square">覆盖品牌</h3>
        </Col>
        <Col class="mt20" :span="24">
          <img style="width: 100%" src="./assets/list.png" alt="">
        </Col>
      </Row>

      <Row class="pt20">
        <Col :span="24">
          <h3 class="square">预算和计费</h3>
        </Col>
        <Col :span="23" class="mt30" offset="1">
          <div class="flex">
            <span>平台花费=</span>
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
import jsxReactToVue from '@/util/jsxReactToVue'

const mockMap = [
  {
    name: '《新喜剧之王》',
    client: '2019/02/05',
    time: '2019/02/01 至 2019/02/28',
    longTime : '28 天',
    data: '春节档 , 元宵档',
    man : '400,000',
    ceil: '3,400.00',
    sex: '男',
  }
]

@Component ({
  components: {
    DlgDetail,
  }
})
export default class Main extends ViewBase {
  addOrUpdateVisible = false

  get forMat() {
    return mockMap[0]
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
