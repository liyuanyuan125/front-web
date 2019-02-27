<template>
  <div class="page">
    <div class='t-title'>账户概览</div>
    <Row class='ov-list'>
        <Col class='ovs ov-list-img1'>
            <Row class='ovs-title'>
                <Col span='3'><img src='./assets/money.png' /></Col>
                <Col span='20' style='font-size: 18px;'>账户余额</Col>
            </Row>
            <Row class='ovs-sma poovs'>
                <!-- ￥{{accountBalance}} -->
                ￥<numAdd v-if='abc' :addNum=accountBalance></numAdd>
            </Row>
        </Col>
        <Col class='ovs ov-list-img2'>
            <Row class='ovs-title'>
                <Col span='3'><img src='./assets/gdan.png' /></Col>
                <Col span='20' style='font-size: 18px;'>广告单</Col>
            </Row>
            <Row class='ovs-sma'>
                <Row class='ovs-line'>
                    <Col span='4'>待接单:</Col>
                    <Col span='8'>{{dispatch.waiting}}个</Col>
                    <Col span='4'>已接单:</Col>
                    <Col span='8'>{{dispatch.received}}个</Col>
                </Row>
                <Row class='ovs-line'>
                    <Col span='4'>已拒绝:</Col>
                    <Col span='8'>{{dispatch.refuse}}个</Col>
                    <Col span='4'>已失效:</Col>
                    <Col span='8'>{{dispatch.faliure}}个</Col>
                </Row>
            </Row>
        </Col>
        <Col class='ovs ov-list-img3'>
            <Row class='ovs-title'>
                <Col span='3'><img src='./assets/zdan.png' /></Col>
                <Col span='20' style='font-size: 18px;'>执行单</Col>
            </Row>
            <Row class='ovs-sma'>
                <Row class='ovs-line'>
                    <Col span='4'>待执行:</Col>
                    <Col span='8'>{{executeOrder.unExecuteCount}}个</Col>
                    <Col span='4'>执行中:</Col>
                    <Col span='8'>{{executeOrder.beExecuteCount}}个</Col>
                </Row>
                <Row class='ovs-line'>
                    <Col span='4'>已完成:</Col>
                    <Col span='20'>{{executeOrder.outExecuteCount}}个</Col>
                </Row>
            </Row>
        </Col>
    </Row>
    <div class='t-title' style='margin-top: 20px;'>广告成效</div>
    <Row class='ses'>
        <Col style='width: 23.8%;'><Select v-model='form.status'  clearable @on-change='searchsas'>
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
            <div class='data-one'>广告收益 / ￥</div>
            <div class='data-two'>{{dataitem.executeScene}}</div>
        </Col>
        <Col class='data-list two'>
            <div class='data-one'>播放广告片数 / ￥</div>
            <div class='data-two'>{{dataitem.playVideo}}</div>
        </Col>
        <Col class='data-list three'>
            <div class='data-one'>执行影院数 / ￥</div>
            <div class='data-two'>{{dataitem.executeCinema}}</div>
        </Col>
        <Col class='data-list four'>
            <div class='data-one'>执行场次数 / ￥</div>
            <div class='data-two'>{{dataitem.advertRevenue}}</div>
        </Col>
    </Row>
    <Row class='ses'>
        <Col style='width: 23.8%;'><Select v-model='query.effectType'  clearable @on-change='searchs'>
            <Option
            v-for="item in effectTypeList"
            :key="item.key"
            :value="item.key"
            v-if='item.key!=0'
            >{{item.text}}</Option>
        </Select></Col>
    </Row>
    <Row style='height: 400px;background: #fff;'>
        <div ref="container" style='height: 400px;'></div>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { effect , nums , resdata , viewdata } from '@/api/home'
import echarts from 'echarts'
import numAdd from '../number.vue'

@Component({
  components: {
    numAdd
  }
})
export default class Main extends ViewBase {
    abc: any = false
    query: any = {
        beginDate: null,
        endDate: null,
        effectType: 1,
        accountType: 'resource',
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
    dataitem: any = []
    effectTypeList: any = []
    dataList: any = []
    data1: any = []
    data2: any = []

    option: any = null


    dispatch: any = []
    executeOrder: any = []
    accountBalance: any = 0

    mounted() {
        this.search()
    }

    async search() {
      try {
          const { data } = await resdata()
          this.accountBalance = data.balance
          this.executeOrder = data.executeOrder
          this.dispatch = data.dispatchMsg
          this.abc = true
          this.searchsas()
          this.searchs()
      } catch (ex) {
      this.handleError(ex)
      } finally {
      }
    }

    async searchsas() {
      if (this.form.status == 1) {
          this.query.beginDate =
          Number(new Date(new Date(new Date().toLocaleDateString()).getTime())) - 24 * 60 * 60 * 1000 + 1
          this.query.endDate =
          Number(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)) -
          24 * 60 * 60 * 1000
      }
      if (this.form.status == 2) {
          this.query.beginDate =
          Number(new Date(new Date(new Date().toLocaleDateString()).getTime())) - (24 * 60 * 60 * 1000) * 7 + 1
          this.query.endDate =
          Number(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)) -
          24 * 60 * 60 * 1000
      }
      if (this.form.status == 3) {
          this.query.beginDate =
          Number(new Date(new Date(new Date().toLocaleDateString()).getTime())) - (24 * 60 * 60 * 1000) * 30 + 1
          this.query.endDate =
          Number(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)) -
          24 * 60 * 60 * 1000
      }
      const dataitem = await viewdata(this.query)
      this.dataitem = dataitem.data
      this.searchs()
    }

    async searchs() {
      try {
            if (this.form.status == 1) {
                this.query.beginDate =
                Number(new Date(new Date(new Date().toLocaleDateString()).getTime())) - 24 * 60 * 60 * 1000 + 1
                this.query.endDate =
                Number(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)) -
                24 * 60 * 60 * 1000
            }
            if (this.form.status == 2) {
                this.query.beginDate =
                Number(new Date(new Date(new Date().toLocaleDateString()).getTime())) - (24 * 60 * 60 * 1000) * 7 + 1
                this.query.endDate =
                Number(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)) -
                24 * 60 * 60 * 1000
            }
            if (this.form.status == 3) {
                this.query.beginDate =
                Number(new Date(new Date(new Date().toLocaleDateString()).getTime())) - (24 * 60 * 60 * 1000) * 30 + 1
                this.query.endDate =
                Number(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)) -
                24 * 60 * 60 * 1000
            }
            // const dataitem = await viewdata(this.query)
            // this.dataitem = dataitem.data
            const datas = await effect(this.query)
            // this.dataitem = datas.data
            this.effectTypeList = datas.data.effectTypeList
            this.dataList = datas.data.dataList
            this.data1 = (this.dataList || []).map((it: any) => {
                    return it.date
                })
            this.data2 = (this.dataList || []).map((it: any) => {
                    return it.data
                })
            this.option = {
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
                    data: ['广告收益']
                },
                // color: ['#FE8135'],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0, color: '#FE8D48' // 0% 处的颜色
                      }, {
                          offset: 0.4, color: '#FEA772' // 100% 处的颜色
                      }, {
                          offset: 1, color: '#FFFDFB' // 100% 处的颜色
                      }]
                  ), // 背景渐变色
                lineStyle: {
                    width: 3,
                    type: 'solid',
                    color: '#FE8135' // 折线的颜色
                },
                xAxis: [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data: this.data1,
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '广告收益',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: this.data2,
                    },
                ]
            }
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
    background: url('./assets/moneybg.png') center center no-repeat;
    background-size: cover;
  }
  .ov-list-img2 {
    background: url('./assets/gdanbg.png') center center no-repeat;
    background-size: cover;
  }
  .ov-list-img3 {
    background: url('./assets/zdanbg.png') center center no-repeat;
    background-size: cover;
  }
  .ovs-line {
    line-height: 50px;
    padding-left: 20px;
    font-size: 15px;
  }
  .poovs {
    font-size: 36px;
    line-height: 183px;
    position: absolute;
    top: 7%;
    left: 8%;
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
