<template>
  <div class="items">
    <div class='imgs'>
        <!-- <DatePicker type="daterange" style="margin-left: 20px;width: 300px;height:40px;background:rgba(255,255,255,1);border-radius:2px;" v-model='showTime' @on-change="handleChange"
        placement="bottom-start" placeholder="请选择开始日期和结束日期" ></DatePicker> -->
        <Row>
            <Col span='9' style='height: 400px;padding: 86px 0 0 85px;'>
                <i-circle
                    :size="250"
                    :trail-width="4"
                    :stroke-width="5"
                    :percent="75"
                    stroke-linecap="square"
                    stroke-color="#FE8135">
                    <div class="demo-Circle-custom">
                        <h1>影片数</h1>
                        <p>42,001,776个</p>
                    </div>
                </i-circle>
            </Col>
            <Col span='15' style='height: 400px;background: #fff;'>
                <div ref="container2" style='height: 400px;'></div>
            </Col>
        </Row>
    </div>
    <div class='imgs'>
        <div class='ze'>成效概览</div>
        <Row style='margin-top: 20px;'>
          <Table ref="selection" stripe class="tables" :columns="columns" :data="tableData"></Table>
          <Button  type="primary" class="mt30 bp" @click="viewCinema" style="position: absolute; height: 40px; right: 10px; top: 350px;">查看全部影院</Button>
        </Row>
    </div>
    <div class='imgs'>
        <div class='ze'>单个影院成效</div>
        <Select style='width: 300px; margin-top: 20px;' v-model='query.id'  clearable placeholder="选择影院" @on-change="seach">
              <Option
                v-for="item in [45]"
                :key="item.key"
                :value="item.key"
                v-if='item.key!=0'
              >{{item.text}}</Option>
            </Select>
        <Row>
            <Col span='9'>
                <div class='dan-fu'>
                    <p class='ps1'>覆盖人次</p>
                    <p class='ps2'>9800</p>
                </div>
                <div class='dan-fu'>
                    <p class='ps1'>覆盖场次</p>
                    <p class='ps2'>5</p>
                </div>
            </Col>
            <Col span='15' style='height: 400px;background: #fff;'>
                <div ref="container" style='height: 400px;'></div>
            </Col>
        </Row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { cinemadata , querylist } from '@/api/cinemadata'
import { formatTimestamp } from '@/util/validateRules'
import numAdd from './number.vue'
import echarts from 'echarts'

@Component
export default class Main extends ViewBase {
  query: any = {
    beginDate: null,
    endDate: null,
    id: null,
    planDataType: 2
  }
  form: any = {
    beginDate: this.query.beginDate,
    endDate: this.query.endDate,
    movieId: null, // 影片id
    cinemaId: null, // 影院id
    cityId: null, // 城市id
  }
  // 查看影院
  tcinemaList: any = []
  // 数据列表
  cinemadatalist: any = []
  // 单部数据
  querydatalist: any = []
  showTime = []
  option: any = null
  option2: any = null
  get tableData() {
      return this.tcinemaList
  }

  get columns() {
      return [
        { title: '影院名称', key: 'code', align: 'center'},
        { title: '排播场次数', key: 'shortName', align: 'center'},
        { title: '总排播时长', key: 'seatCount', align: 'center'},
        { title: '覆盖人次', key: 'seatCount', align: 'center'},
        { title: '广告花费（元）', key: 'seatCount', align: 'center'}
      ]
  }

  viewCinema() {

  }
  mounted() {
    this.seach()
  }

  async seach() {
      try {
        const cinemadatalist = await cinemadata(this.query)
        this.cinemadatalist = cinemadatalist.data

        const querydatalist = await querylist(this.form)
        this.querydatalist = querydatalist.data
        //   单个影院折现
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
                data: ['曝光分布0']
            },
            color: ['#FE8135'],
            xAxis: [
                {
                    type : 'category',
                    boundaryGap : false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '曝光分布',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                },
            ]
        }
        this.option2 = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            color: ['#F58588'],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            series: [
                {
                    name: '直接访问',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [320, 302, 301, 334, 390, 330, 320]
                }
            ]
        }
        if (this.option && typeof this.option === 'object') {
            echarts.init(this.$refs.container as any).setOption(this.option, true)
        }
        if (this.option2 && typeof this.option2 === 'object') {
            echarts.init(this.$refs.container2 as any).setOption(this.option2, true)
        }
      } catch (ex) {
          this.handleError(ex)
      } finally {
    }
  }

  handleChange(data: any) {
     this.showTime = data
     this.query.beginDate = Number(formatTimestamp(this.showTime[0])) - 8 * 60 * 60 * 1000
     this.query.endDate = Number(formatTimestamp(this.showTime[1])) + 16 * 60 * 60 * 1000 - 1
     this.seach()
   }


}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.items {
  background: #fff;
}
.demo-Circle-custom {
  & h1 {
    color: #3f414d;
    font-size: 14px;
    font-weight: normal;
  }
  & p {
    color: #657180;
    font-size: 26px;
    margin: 20px 0 15px;
  }
}
.imgs {
  width: 100%;
  padding: 20px;
  position: relative;
  .ze {
    width: 100%;
    height: 50px;
    background: #f9f9f9;
    top: 0;
    left: 0;
    line-height: 50px;
    font-size: 14px;
    padding-left: 27px;
  }
}
.dan-fu {
  height: 120px;
  background: rgba(255, 248, 242, 1);
  border-radius: 2px;
  float: left;
  width: 40%;
  margin-left: 7%;
  text-align: center;
  margin-top: 24%;
  padding-top: 35px;
  .ps1 {
    height: 24px;
    font-size: 24px;
    font-weight: 500;
    color: rgba(68, 68, 68, 1);
    line-height: 24px;
  }
  .ps2 {
    font-size: 24px;
    font-weight: 500;
    color: rgba(254, 129, 53, 1);
    line-height: 45px;
  }
}
.chen-fu {
  height: 120px;
  background: rgba(255, 248, 242, 1);
  border-radius: 2px;
  float: left;
  width: 22%;
  margin-left: 3%;
  text-align: center;
  padding-top: 35px;
  .ps1 {
    height: 24px;
    font-size: 24px;
    font-weight: 500;
    color: rgba(68, 68, 68, 1);
    line-height: 24px;
  }
  .ps2 {
    font-size: 24px;
    font-weight: 500;
    color: rgba(254, 129, 53, 1);
    line-height: 45px;
  }
}
</style>
