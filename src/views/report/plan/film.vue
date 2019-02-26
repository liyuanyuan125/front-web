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
                        <p>{{(movies.length)}}个</p>
                    </div>
                </i-circle>
            </Col>
            <Col span='15' style='height: 400px;background: #fff;'>
                <div ref="container2" style='height: 400px;'></div>
            </Col>
        </Row>
        <div v-if='datalist.movieDataList' style='width: 500px;
    height: 80px;
    background: rgb(255, 248, 242);
    border-radius: 2px;
    line-height: 80px;
    font-size: 24px;
    padding-left: 30px;'>
          <span style='color: red'>类型：</span>{{datalist.movieDataList.type}}
        </div>
    </div>
    <div class='imgs'>
        <div class='ze'>成效概览</div>
        <Row style='margin-top: 20px;'>
          <Table ref="selection" stripe class="tables" :columns="columns" :data="tableData"></Table>
          <Button v-if='movies.length > 3'  type="primary" class="mt30 bp" @click="viewCinema" style='margin-left: 43%;'>查看全部影院</Button>
        </Row>
    </div>
    <div class='imgs'>
        <div class='ze'>单个影院成效</div>
        <Select style='width: 300px; margin-top: 20px;' v-model='form.movieId'  clearable placeholder="选择影院" @on-change="seachmov">
              <Option
                v-for="item in movies"
                :key="item.movieId"
                :value="item.movieId"
                v-if='item.key!=0'
              >{{item.movie}}</Option>
            </Select>
        <Row>
            <Col span='9'>
                <!-- <div v-for="(item, index) in cover" :key="index" class="dan-fu">
                  <p  class='ps1'>{{cover[index].name}}</p>
                  <p class='ps2'><number :addNum="cover[index].num"></number></p>
                </div> -->
                <div class='dan-fu'>
                    <p class='ps1'>覆盖人次</p>
                    <p class='ps2'><number v-if='asd' :addNum="querydatalist.coverPeople"></number></p>
                </div>
                <div class='dan-fu'>
                    <p class='ps1'>覆盖场次</p>
                    <p class='ps2'><number v-if='asd' :addNum="querydatalist.coverPeople"></number></p>
                </div>
            </Col>
            <Col span='15' style='height: 400px;background: #fff;'>
                <div ref="container" style='height: 400px;'></div>
            </Col>
        </Row>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Prop   } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import number from '@/views/order/dispatch/number.vue'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'
import { cinemadata , querylist } from '@/api/cinemadata'
import { formatTimestamp } from '@/util/validateRules'
// import numAdd from './number.vue'
import echarts from 'echarts'
import { formatCurrency } from '@/fn/string.ts'

@Component({
  components: {
    number,
  }
})
export default class Main extends ViewBase {
  @Prop() value: any
  asd: any = false
  query: any = {
    beginDate: this.value.mockObj.beginDate,
    endDate: this.value.mockObj.endDate,
    id: this.value.mockObj.id,
    planDataType: 3
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
  // movielist
  movielist: any = []
  movies: any = []
  // 单部数据
  querydatalist: any = []
  showTime = []
  option: any = null
  option2: any = null
  cin1: any = []
  cin2: any = []
  data1: any = []
  data2: any = []
  get tableData() {
      return (this.movielist || []).map((item: any) => {
        return {
          ...item,
          coverPeople: formatCurrency(item.coverPeople).slice(0, -3),
          advertAmount: formatCurrency(item.advertAmount).slice(0, -3),
        }
      })
  }

  get columns() {
      return [
        { title: '影片名称', key: 'movie', align: 'center'},
        { title: '上映时间', key: 'openTime', align: 'center',
          render: (hh: any, { row: { openTime } }: any) => {
            /* tslint:disable */
            const h = jsxReactToVue(hh)
            const html = openTime == null ? '-' : String(openTime).slice(0, 4) + '-' + String(openTime).slice(4, 6) + '-' + String(openTime).slice(6, 8)
            return openTime == null ? (
              <span class="datetime" v-html="-" />
            ) : (
              <span class="datetime" v-html={html} />
            )
            /* tslint:enable */
          }
        },
        { title: '覆盖人次', key: 'coverPeople', align: 'center'},
        { title: '广告花费 / ￥', key: 'advertAmount', align: 'center'}
      ]
  }

  viewCinema() {

  }
  mounted() {
    this.asd = false
    this.seach()
  }

  async seach() {
      try {
        const datalist = await cinemadata(this.query)
        this.datalist = datalist.data.items
        // this.datalist = this.value
        // console.log(this.value)
        this.movielist = []
        this.movies = this.datalist.movieDataList.movies
        if (this.movies.length <= 3 ) {
          this.movielist = this.movies
        } else {
          this.movielist.push(this.movies[0] , this.movies[1] , this.movies[2])
        }
        if (this.movielist.length != 0) {
          this.form.movieId = (this.movielist || []).map((it: any) => {
            return it.movieId
          })[0]
        }
        this.asd = true
        // console.log(this.form.movieId)
        const querydatalist = await querylist(this.form)
        this.querydatalist = querydatalist.data

        this.cin1 = (this.movielist || []).map((it: any) => {
            return it.movie
        })
        this.cin2 = (this.movielist || []).map((it: any) => {
            return Number(it.movieAccount)
        })
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

  async seachmov() {
    const querydatalist = await querylist(this.form)
    this.querydatalist = querydatalist.data
    this.data1 = (this.querydatalist.dataList || []).map((it: any) => {
        return it.date
    })
    this.data2 = (this.querydatalist.dataList || []).map((it: any) => {
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
            data: ['曝光分布']
        },
        color: ['#FE8135'],
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

  get cover() {
    const value = this.querydatalist
    return [{
      name: '覆盖人次',
      num: value.coverPeople ? value.coverPeople : 0
    }, {
      name: '覆盖场次',
      num: value.coverScene ? value.coverScene : 0
    }]
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
