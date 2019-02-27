<template>
  <div class="items">
    <div class='imgs'>
        <!-- <DatePicker type="daterange" style="margin-left: 20px;width: 300px;height:40px;background:rgba(255,255,255,1);border-radius:2px;" v-model='showTime' @on-change="handleChange"
        placement="bottom-start" placeholder="请选择开始日期和结束日期" ></DatePicker> -->
        <Row>
            <Col span='9' style='height: 400px;padding: 86px 0 0 85px;'>
                <i-circle
                    :size="200"
                    :trail-width="8"
                    :stroke-width="8"
                    :percent="datalist.coverCinema"
                    stroke-linecap="square"
                    stroke-color="#41D9C1">
                    <div class="demo-Circle-custom">
                        <h1>覆盖影院</h1>
                        <!-- <p>{{datalist.coverCinema}}个</p> -->
                        <p><number v-if='asd' :addNum="datalist.coverCinema">个</number></p>
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
        <Row style='margin-top: 20px'>
            <Col style='margin-left: 1.7%' class='chen-fu'>
                <p class='ps1'>影院数</p>
                <p class='ps2'><number v-if='asd' :addNum="datalist.coverCinema"></number></p>
            </Col>
            <Col class='chen-fu'>
                <p class='ps1'>影厅数</p>
                <p class='ps2'><number v-if='asd' :addNum="cinemaDataList.hall"></number></p>
            </Col>
            <Col class='chen-fu'>
                <p class='ps1'>场次数</p>
                <p class='ps2'><number v-if='asd' :addNum="cinemaDataList.scene"></number></p>
            </Col>
            <Col class='chen-fu'>
                <p class='ps1'>银屏数</p>
                <p class='ps2'><number v-if='asd' :addNum="cinemaDataList.screen"></number></p>
            </Col>
        </Row>
        <Row style='margin-top: 20px;'>
          <Table ref="selection" stripe class="tables" :columns="columns" :data="tableData"></Table>
          <Button type="primary" class="mt30 bp" @click="viewCinema" style='margin-left: 86.5%;' >查看全部影院</Button>
        </Row>
    </div>
    <div class='imgs'>
        <div class='ze'>单个影院成效</div>
        <Select style='width: 300px; margin-top: 20px;margin-left: 25px' v-model='form.cinemaId'  clearable placeholder="选择影院" @on-change="seachcin">
              <Option
                v-for="item in cinemaDataList.cinemas"
                :key="item.cinemaId"
                :value="item.cinemaId"
              >{{item.cinema}}</Option>
            </Select>
        <Row>
            <Col span='9'>
                <div class='dan-fu'>
                    <p class='ps1'>覆盖人次</p>
                    <p class='ps2'><number v-if='asd' :addNum="querydatalist.coverPeople"></number></p>
                </div>
                <div class='dan-fu'>
                    <p class='ps1'>覆盖场次</p>
                    <p class='ps2'><number v-if='asd' :addNum="querydatalist.coverScene"></number></p>
                </div>
            </Col>
            <Col span='15' style='height: 400px;background: #fff;'>
                <div ref="container" style='height: 400px;'></div>
            </Col>
        </Row>
        <commonDlg ref="dlg" v-if="loadding" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop  } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import number from '@/views/order/dispatch/number.vue'
import { cinemadata , querylist } from '@/api/cinemadata'
import { formatTimestamp } from '@/util/validateRules'
// import numAdd from './number.vue'
import echarts from 'echarts'
import { formatCurrency } from '@/fn/string.ts'
import commonDlg from './dlg/commonDlg.vue'

@Component({
  components: {
    number,
    commonDlg
  }
})
export default class Main extends ViewBase {
  @Prop() value: any
  asd: any = false
  loadding = false
  query: any = {
    beginDate: this.value.mockObj.beginDate,
    endDate: this.value.mockObj.endDate,
    id: this.value.mockObj.id,
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
  datalist: any = []
  // cinemaDataList 成效概览
  cinemaDataList: any = []
  cinemas: any = []
//   itemsss: any= []
  // 单部数据
  querydatalist: any = []
  showTime: any = []
  option: any = null
  option2: any = null
  cin1: any = []
  cin2: any = []
  data1: any = []
  data2: any = []
  get tableData() {
      return (this.tcinemaList || []).map((item: any) => {
        return {
          ...item,
          scheduleTime: item.scheduleTime + 's',
          coverPeople: formatCurrency(item.coverPeople).slice(0, -3),
          advertAmount: formatCurrency(item.advertAmount).slice(0, -3),
        }
      })
  }

  get columns() {
      return [
        { title: '影院名称', key: 'cinema', align: 'center'},
        { title: '排播场次数', key: 'scheduleScene', align: 'center'},
        { title: '总排播时长', key: 'scheduleTime', align: 'center'},
        { title: '覆盖人次', key: 'coverPeople', align: 'center'},
        { title: '广告花费（元）', key: 'advertAmount', align: 'center'}
      ]
  }

  viewCinema() {
    this.loadding = true
    this.$nextTick(() => {
      (this.$refs.dlg as any).init({
        id: this.value.mockObj.id,
        beginDate: this.value.mockObj.beginDate,
        endDate: this.value.mockObj.endDate,
        planDataType: 2,
      })
    })
  }
  mounted() {
    this.asd = false
    this.seach()
  }

  async seach() {
      try {
        const cinemadatalist = await cinemadata(this.query)
        this.datalist = cinemadatalist.data.items
        // this.datalist = this.value
        this.cinemaDataList = this.datalist.cinemaDataList
        this.tcinemaList = []
        this.cinemas = this.datalist.cinemaDataList.cinemas
        if (this.cinemas.length <= 3 ) {
          this.tcinemaList = this.cinemas
        } else {
          this.tcinemaList.push(this.cinemas[0] , this.cinemas[1] , this.cinemas[2])
        }
        if (this.cinemas.length != 0) {
          this.form.cinemaId = (this.cinemas || []).map((it: any) => {
           return it.cinemaId
        })[0]
        }
        this.asd = true
        // console.log(this.datalist)
        // console.log(this.form.cinemaId)
        const querydatalist = await querylist(this.form)
        this.querydatalist = querydatalist.data

        this.cin1 = (this.cinemaDataList.cinemas || []).map((it: any) => {
            return it.cinema
        }).slice(0, 9)
        this.cin2 = (this.cinemaDataList.cinemas || []).map((it: any) => {
            return Number(it.cinemaAccount)
        }).slice(0, 9)
        this.data1 = (this.querydatalist.dataList || []).map((it: any) => {
            return it.date
        })
        this.data2 = (this.querydatalist.dataList || []).map((it: any) => {
            return it.data
        })
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
                data: ['曝光分布']
            },
            color: ['#FE8135'],
            // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //                 offset: 0, color: '#FE8D48' // 0% 处的颜色
            //             }, {
            //                 offset: 0.4, color: '#FEA772' // 100% 处的颜色
            //             }, {
            //                 offset: 1, color: '#FFFDFB' // 100% 处的颜色
            //             }]
            //         ), // 背景渐变色
            xAxis: [
                {
                    type : 'category',
                    boundaryGap : false,
                    data: this.data1
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
                    data: this.data2,
                },
            ]
        }
        this.option2 = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: '{c}%'
            },
            color(params: any) {
                    // build a color map as your need.
                    const colorList = [
                      '#F8C5B9', '#F2B39D', '#FBB1A0', '#F5A48E', '#F58588',
                      '#F85886', '#E72361', '#961322', '#6E1D48'
                  ]
                    return colorList[params.dataIndex]
            },
            label: {
              formatter: '{b}\n{c}%' // 这是关键，在需要的地方加上就行了
            },
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
                data: this.cin1
            },
            series: [
                {
                    name: '占比',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: this.cin2
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

  async seachcin() {
    const querydatalist = await querylist(this.form)
    this.querydatalist = querydatalist.data
    this.data1 = (this.querydatalist.dataList || []).map((it: any) => {
        return it.date
    })
    this.data2 = (this.querydatalist.dataList || []).map((it: any) => {
        return it.data
    })
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
            data: ['曝光分布']
        },
        color: ['#FE8135'],
        // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //                     offset: 0, color: '#FE8D48' // 0% 处的颜色
        //                 }, {
        //                     offset: 0.4, color: '#FEA772' // 100% 处的颜色
        //                 }, {
        //                     offset: 1, color: '#FFFDFB' // 100% 处的颜色
        //                 }]
        //             ), // 背景渐变色
        xAxis: [
            {
                type : 'category',
                boundaryGap : false,
                data: this.data1
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
                data: this.data2,
            },
        ]
    }
    if (this.option && typeof this.option === 'object') {
        echarts.init(this.$refs.container as any).setOption(this.option, true)
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
