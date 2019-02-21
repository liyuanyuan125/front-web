<template>
  <div class="page">
    <div class='t-title'>账户概览</div>
    <Row class='ov-list'>
        <Col class='ovs ov-list-img1'>
            <Row class='ovs-title'>
                <Col span='3'><img src='./assets/账户余额.png' /></Col>
                <Col span='20' style='font-size: 18px;'>账户余额</Col>
            </Row>
            <Row class='ovs-sma poovs'>
                ￥{{accountBalance}}
            </Row>
        </Col>
        <Col class='ovs ov-list-img2'>
            <Row class='ovs-title'>
                <Col span='3'><img src='./assets/广告计划.png' /></Col>
                <Col span='20' style='font-size: 18px;'>广告计划</Col>
            </Row>
            <Row class='ovs-sma'>
                <Row class='ovs-line'>
                    <Col span='4'>待审核:</Col>
                    <Col span='8'>{{plan.unApprove}}个</Col>
                    <Col span='4'>待支付:</Col>
                    <Col span='8'>{{plan.unPay}}个</Col>
                </Row>
                <Row class='ovs-line'>
                    <Col span='4'>执行中:</Col>
                    <Col span='8'>{{plan.onExecute}}个</Col>
                    <Col span='4'>已拒绝:</Col>
                    <Col span='8'>{{plan.refuse}}个</Col>
                </Row>
            </Row>
        </Col>
        <Col class='ovs ov-list-img3'>
            <Row class='ovs-title'>
                <Col span='3'><img src='./assets/广告片.png' /></Col>
                <Col span='20' style='font-size: 18px;'>广告片</Col>
            </Row>
            <Row class='ovs-sma'>
                <Row class='ovs-line'>
                    <Col span='4'>待审核:</Col>
                    <Col span='8'>{{video.unApprove}}个</Col>
                    <Col span='4'>待支付:</Col>
                    <Col span='8'>{{video.unPay}}个</Col>
                </Row>
                <Row class='ovs-line'>
                    <Col span='4'>转码中:</Col>
                    <Col span='8'>{{video.trans}}个</Col>
                    <Col span='4'>转码完成:</Col>
                    <Col span='8'>{{video.completed}}个</Col>
                </Row>
            </Row>
        </Col>
    </Row>
    <div class='t-title' style='margin-top: 20px;'>广告成效</div>
    <Row class='ses'>
        <Col span='6'><Select v-model='form.status'  clearable @on-change='search'>
            <Option
            v-for="item in data"
            :key="item.key"
            :value="item.key"
            v-if='item.key!=0'
            >{{item.text}}</Option>
        </Select></Col>
    </Row>
    <Row style='background: #fff;'>
        <Col class='data-list one'>
            <div class='data-one'>广告花费 / ￥</div>
            <div class='data-two'>800000</div>
        </Col>
        <Col class='data-list two'>
            <div class='data-one'>覆盖人次 / ￥</div>
            <div class='data-two'>800000</div>
        </Col>
        <Col class='data-list three'>
            <div class='data-one'>覆盖影院数 / ￥</div>
            <div class='data-two'>800000</div>
        </Col>
        <Col class='data-list four'>
            <div class='data-one'>覆盖场次数 / ￥</div>
            <div class='data-two'>800000</div>
        </Col>
    </Row>
    <Row class='ses'>
        <Col span='6'><Select v-model='query.effectType'  clearable @on-change='search'>
            <Option
            v-for="item in types"
            :key="item.key"
            :value="item.key"
            v-if='item.key!=0'
            >{{item.text}}</Option>
        </Select></Col>
    </Row>
    <div ref="container" style='height: 400px;'></div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { effect , nums } from '@/api/home'
import echarts from 'echarts'

@Component
export default class Main extends ViewBase {
    query: any = {
        beginDate: null,
        endDate: null,
        effectType: 1,
        accountType: 'ads',
    }
    form: any = {
        status: 1
    }
    data: any = [
        {
            key: 1,
            text: '昨天'
        },
        {
            key: 2,
            text: '过去七天'
        },
        {
            key: 3,
            text: '过去一个月'
        }
    ]

    types: any = [
        {
            key: 1,
            text: '广告花费(元)'
        },
        {
            key: 2,
            text: '覆盖人次'
        },
        {
            key: 3,
            text: '覆盖影院'
        },
        {
            key: 4,
            text: '覆盖城市'
        }
    ]

    // option: any = null
    option: any = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#FE8135'
                }
            }
        },
        legend: {
            data: ['邮件营销']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: [
            {
                type : 'category',
                boundaryGap : false,
                data: ['周一' , '周二' , '周三' , '周四' , '周五' , '周六' , '周日']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '邮件营销',
                type: 'line',
                stack: '总量',
                areaStyle: {},
                data: [120 , 132 , 101 , 134 , 90 , 230 , 210]
            },
        ]
    }

    effectTypeList: any = []
    dataList: any = []

    plan: any = []
    video: any = []
    accountBalance: any = 0

    mounted() {
        this.search()
    }

    async search() {
        try {
            const { data } = await nums({accountType: 'ads'})
            this.accountBalance = data.accountBalance
            this.video = data.video
            this.plan = data.plan
            // if (this.form.status == 1) {
            //     this.query.beginDate = moment().subtract(1, 'days').calendar()
            //     this.query.endDate = moment().calendar()
            // }
            // if (this.form.status == 2) {
            //     this.query.beginDate = moment().subtract(7, 'days').calendar()
            //     this.query.endDate = moment().calendar()
            // }
            // if (this.form.status == 3) {
            //     this.query.beginDate = moment().subtract(30, 'days').calendar()
            //     this.query.endDate = moment().calendar()
            // }  // 昨天下午3点41分
            if (this.form.status == 1) {
                this.query.beginDate = (new Date(Date.parse(String(new Date()))).getTime() / 1000) - 24 * 60 * 60 * 1000
                this.query.endDate = new Date().setTime(Date.parse(String(new Date())) / 1000 + 24 * 60 * 60 - 1)
            }
            if (this.form.status == 2) {
                this.query.beginDate =
                (new Date(Date.parse(String(new Date()))).getTime() / 1000) - (24 * 60 * 60 * 1000) * 7
                this.query.endDate = new Date().setTime(Date.parse(String(new Date())) / 1000 + 24 * 60 * 60 - 1)
            }
            if (this.form.status == 3) {
                this.query.beginDate =
                (new Date(Date.parse(String(new Date()))).getTime() / 1000) - (24 * 60 * 60 * 1000) * 30
                this.query.endDate = new Date().setTime(Date.parse(String(new Date())) / 1000 + 24 * 60 * 60 - 1)
            }
            const datas = await effect(this.query)
            this.effectTypeList = datas.data.effectTypeList
            this.dataList = datas.data.dataList

            if (this.option && typeof this.option === 'object') {
                echarts.init(this.$refs.container as any).setOption(this.option, true)
            }
        } catch (ex) {
        this.handleError(ex)
        } finally {
        }
    }
}
</script>

<style lang="less" scoped>
.t-title {
  width: 100%;
  height: 50px;
  background: rgba(249, 249, 249, 1);
  border-radius: 2px 2px 0 0;
  line-height: 50px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(36, 129, 215, 1);
  padding-left: 30px;
}
.ov-list {
  background: #fff;
  padding-top: 20px;
  .ovs {
    width: 32%;
    display: inline-block;
    height: 160px;
    border-radius: 2px;
    margin-left: 1%;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    color: #fff;
    .ovs-title {
      line-height: 40px;
      margin-top: 10px;
      margin-left: 10px;
    }
  }
  .ov-list-img1 {
    background: url('./assets/账户余额背景.png') center center no-repeat;
    background-size: cover;
  }
  .ov-list-img2 {
    background: url('./assets/广告计划背景.png') center center no-repeat;
    background-size: cover;
  }
  .ov-list-img3 {
    background: url('./assets/广告片背景.png') center center no-repeat;
    background-size: cover;
  }
  .ovs-line {
    line-height: 50px;
    padding-left: 20px;
    font-size: 15px;
  }
  .poovs {
    font-size: 50px;
    line-height: 183px;
    position: absolute;
    top: 7%;
    left: 19%;
  }
}
.ses {
  background: #fff;
  height: 70px;
  padding: 20px 0 0 20px;
}
.data-list {
  background: #fff;
  width: 23.7%;
  display: inline-block;
  margin-left: 1%;
  .data-one {
    height: 35px;
    line-height: 35px;
    color: #fff;
    padding-left: 10px;
    font-size: 13px;
  }
  .data-two {
    height: 65px;
    line-height: 65px;
    color: red;
    padding-left: 10px;
    font-size: 25px;
  }
}
.one {
  border: 2px solid #9a9bfc;
  .data-one {
    background: #9a9bfc;
  }
  .data-two {
    color: #9a9bfc;
  }
}
.two {
  border: 2px solid #64caff;
  .data-one {
    background: #64caff;
  }
  .data-two {
    color: #64caff;
  }
}
.three {
  border: 2px solid #41d9c1;
  .data-one {
    background: #41d9c1;
  }
  .data-two {
    color: #41d9c1;
  }
}
.four {
  border: 2px solid #f5c419;
  .data-one {
    background: #f5c419;
  }
  .data-two {
    color: #f5c419;
  }
}
</style>
