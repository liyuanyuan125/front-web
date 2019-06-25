<template>
  <div>
    <Row>
      <Col span="24">
        <Form label-position="left" :label-width="100">
          <Card class="work-card">
            <div slot="title">
              <Row type="flex" justify="space-between" align="middle">
                <Col :span="14">
                  <span class="title-text">作品数据</span>
                  <RadioGroup class='nav'
                              @on-change="handleChange"
                              v-model="form.filterKey"
                              size="large"
                              type="button">
                    <Radio v-for="(item) in filterList"
                          :key="item.key"
                          :disabled="item.disabled"
                          :label="item.key">{{item.text}}</Radio>
                  </RadioGroup>
                </Col>
                <Col :span="10" align="right">
                  <Select v-model="form.channelCode"
                          clearable
                          @on-change="handleChange"
                          style="width:150px; text-align:left">
                    <Option v-for="(item) in channelList"
                            :key="item.id"
                            :value="item.id">{{item.name}}</Option>
                  </Select>
                  <DatePicker style="margin-left:15px"
                              type="daterange"
                              v-model="form.beginDate"
                              @on-change="handleChange"
                              placement="bottom-end"
                              placeholder="自定义时间段"></DatePicker>
                </Col>
              </Row>
            </div>
            <div class="content">
              <Row type="flex" justify="space-between">
                <Col :span="24">
                  <div class='chart-wp'>
                    <ECharts :options="chartData" auto-resize class="chart"/>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Form>
      </Col>
    </Row>
  </div>
</template>
<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import {
  formatTimestamp,
  formatTimes,
  formatNumber
} from '@/util/validateRules'
import { fans, getBrands } from '@/api/kolCompare'
import DetailNavBar from './detailNavBar.vue'
@Component({
  components: {
    DetailNavBar,
    ECharts
  }
})
export default class Temporary extends ViewBase {
  @Prop({ type: Array, default: () => [] }) filterList!: any[]
  @Prop({ type: Array, default: () => [] }) channelList!: any[]
  @Prop({ type: Object, default: () => {} }) productData!: any
  form: any = {
    channelCode: 0,
    filterKey: 'key1',
    beginDate: [
      // new Date(2019, 3, 9), new Date(2019, 4, 11)
    ],
  }
  chartData: any = {
    tooltip: {
        borderWidth: 1,
        borderColor: 'rgba(87, 180, 201, .8)',
        backgroundColor: 'rgba(0, 39, 52, .8)',
        padding: [
            7,
            10
        ],
        textStyle: {
            color: '#fff',
            fontSize: 12,
            lineHeight: 22
        },
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            lineStyle: {
                width: 22,
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'rgba(87, 180, 201, .01)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(87, 180, 201, .9)'
                        }
                    ]
                }
            }
        }
    },
    xAxis: {
        type: 'category',
        data: [
           '5-16',
           '5-17',
           '5-18',
           '5-19',
           '5-20',
           '5-21',
           '5-22'
        ],
        axisLine: {
            lineStyle: {
                color: 'rgba(129, 180, 230, .6)'
            }
        },
        axisTick: false,
        axisLabel: {
            color: 'rgba(255, 255, 255, .8)'
        },
        boundaryGap: false
    },
    yAxis: {
        type: 'value',
        axisLine: false,
        splitLine: {
            lineStyle: {
                color: 'rgba(129, 180, 230, .6)'
            }
        },
        axisLabel: {
            color: 'rgba(255, 255, 255, .8)'
        },
        splitNumber: 4
    },
    grid: {
        left: 42,
        right: 42,
        top: 20,
        bottom: 20,
        containLabel: true
    },
    series: [
        {
            name: '全网热度',
            type: 'line',
            smooth: true,
            data: [
                855000,
                100000,
                808000,
                260000,
                600000,
                755000,
                555000
            ],
            itemStyle: {
                color: 'red'
            },
            symbol: 'circle',
            showSymbol: false
        },
        {
            name: '全网热度',
            type: 'line',
            smooth: true,
            data: [
                123000,
                300000,
                408000,
                660000,
                300000,
                855000,
                955000
            ],
            itemStyle: {
                color: '#57b4c9'
            },
            symbol: 'circle',
            showSymbol: false
        }
    ]
  }
  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const that: any = this
    // 107028 dev有数据
    const id = parseInt(this.$route.params.id, 0)
    try {
      // const {
      //   data,
      //   data: {
      //     item: { genders, ages, cities, provinces }
      //   }
      // } = await fans(id)

    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleChange() {
    this.resetData()
    await this.getChartsData('', 0)
  }
  async mounted() {
    this.initHandler()
  }
  async initHandler() {
    await this.getChartsData('', 0)
  }
  resetData() {
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '../kolcompare.less';
.chart {
  width: 100%;
  height: 300px;
}
</style>