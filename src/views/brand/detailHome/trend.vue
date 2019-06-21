<template>
  <div>
    <Form label-position="left" :label-width="100">
      <Card class="detailmore-card">
        <div slot="title">
          <Row type="flex" justify="space-between">
            <Col :span="24">
              <DetailNavBar titleText="统计周期">
                <div slot="item">
                  <RadioGroup
                    style="margin-right:15px"
                    @on-change="handleChange"
                    v-model="form.dayRangesKey"
                    size="large"
                    type="button"
                  >
                    <Radio
                      v-for="(item) in dict.dayRanges"
                      :key="item.key"
                      :disabled="item.disabled"
                      :label="item.key"
                    >{{item.text}}</Radio>
                  </RadioGroup>
                  <DatePicker
                    type="daterange"
                    v-model="form.beginDate"
                    @on-change="handleChange"
                    placement="bottom-end"
                    placeholder="自定义时间段"
                  ></DatePicker>
                </div>
              </DetailNavBar>
            </Col>
          </Row>
        </div>
        <div class="content">
          <Row type="flex" justify="space-between">
            <Col :span="24">
              <div class="chart-wp">
                <AreaBasic
                  :initDone="chart1.initDone"
                  :title="chart1.title"
                  :dict1="chart1.dict1"
                  :dict2="chart1.dict2"
                  :color="chart1.color"
                  :dataList="chart1.dataList"
                  :currentTypeIndex="chart1.currentTypeIndex"
                />
              </div>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col :span="24">
              <div class="chart-wp borderRadius">
                <AreaBasicxtra
                  :initDone="chart2.initDone"
                  :title="chart2.title"
                  :dict1="chart2.dict1"
                  :dict2="chart2.dict2"
                  :color="chart2.color"
                  :dataList="chart2.dataList"
                  :currentTypeIndex="chart2.currentTypeIndex"
                  @typeChange="typeChangeHander2"
                />
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {
  formatTimestamp,
  formatTimes,
  formatNumber
} from '@/util/validateRules'
import moment from 'moment'
import DetailNavBar from '@/views/film/figure/detailMoreInfo/components/detailNavBar.vue'
import { trend } from '@/api/brandtrend'
import AreaBasic from '@/components/chartsGroup/areaBasic/'
import AreaBasicxtra from '@/components/chartsGroup/areaBasicExtra/'
const timeFormat = 'YYYYMMDD'
@Component({
  components: {
    AreaBasic,
    AreaBasicxtra,
    DetailNavBar
  }
})
export default class Trend extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  form: any = {
    beginDate: [
      // new Date(2019, 3, 9), new Date(2019, 4, 11)
    ],
    dayRangesKey: 'sevenDay',
    statisticTimeId: 0
  }

  dict: any = {
    dayRanges: [
      {
        key: 'yesterday',
        text: '昨日',
        disabled: false
      },
      {
        key: 'sevenDay',
        text: '最近7天',
        disabled: false
      },
      {
        key: 'thirtyDay',
        text: '最近30天',
        disabled: false
      },
      {
        key: 'ninetyDay',
        text: '最近90天',
        disabled: false
      }
    ],
  }

  chart1: any = {
    title: '综合热度',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#0099cc']
  }

  chart2: any = {
    title: '',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#ff0000', '#3fb23f', '#0099cc', '#cc6600']
  }

  effectTypeList: any = [{
        text: '新浪微博',
        key: 0
      }, {
        text: '微信',
        key: 1
      }, {
        text: '抖音',
        key: 2
      }, {
        text: '快手',
        key: 3
      }]

  itemList: any = []

  async typeChangeHander2(index: number = 0) {
    if (this.chart2.dataList[index].length < 1) {
      await this.getChartsData('chart2', index)
    }
    this.chart2.currentTypeIndex = index
  }

  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const mockObj = {
      beginDate: this.form.beginDate[0],
      endDate: this.form.beginDate[1],
    }
    try {
      this.itemList = []

      const  { data }  = await trend(this.$route.params.id, { ...mockObj })

      this.chart1.dataList.push({
        data: [],
        date: []
      })

      if (data.items != null) {
        data.items.forEach((item: any, index: number) => {
          this.chart1.dataList[0].data.push(item.count)
          this.chart1.dataList[0].date.push(item.date)
        })

        this.chart1.initDone = true

        for ( const i in data.items ) {
          if ( 1 == 1 ) {
            for ( const j in data.items[i].channels ) {
              if ( 1 == 1 ) {
                this.itemList.push({
                  date: data.items[i].date,
                  count: data.items[i].channels[j].count,
                  key: data.items[i].channels[j].code
                  // data.items[i].channels[j]
                })
              }
            }
          }
        }
      }

      if (this.effectTypeList.length > 0) {
        this.chart2.dataList = this.effectTypeList.map(
          (item: any, index: number) => {
            return {
              data: [],
              date: []
            }
          }
        )
      } else {
        this.chart2.dataList.push({
          data: [],
          date: []
        })
      }
      for ( const i in this.itemList) {
        if (this.itemList[i].key === 'weibo') {
          this.itemList[i].key = 0
        } else if (this.itemList[i].key === 'wechat') {
          this.itemList[i].key = 1
        } else if (this.itemList[i].key === 'douyin') {
          this.itemList[i].key = 2
        } else if (this.itemList[i].key === 'kuaishou') {
          this.itemList[i].key = 3
        }
      }
      this.chart2.dict1 = this.effectTypeList
      this.itemList.forEach((item: any, index: number) => {
        this.chart2.dataList[index].data.push(item.count)
        this.chart2.dataList[index].date.push(item.date)
      })
      this.chart2.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  beginDate(dayRangesKey: string) {
    switch ( dayRangesKey ) {
      case 'yesterday' :
        return moment(new Date()).add(-1, 'days').format(timeFormat)
      case 'thirtyDay' :
        return moment(new Date()).add(-30, 'days').format(timeFormat)
      case 'ninetyDay' :
        return moment(new Date()).add(-90, 'days').format(timeFormat)
      default :
        return moment(new Date()).add(-7, 'days').format(timeFormat)
    }
  }
  endDate() {
    return moment(new Date()).format(timeFormat)
  }

  async handleChange() {
    this.form.beginDate[0] = this.beginDate(this.form.dayRangesKey)
    this.form.beginDate[1] = this.endDate()
    this.chart1.initDone = false
    this.chart2.initDone = false
    this.resetData()
    // this.getChartsData()
    await this.getChartsData('', 0)
  }

  async mounted() {
    this.form.beginDate[0] = this.beginDate(this.form.dayRangesKey)
    this.form.beginDate[1] = this.endDate()
    await this.getChartsData('', 0)
  }

  resetData() {
    this.chart1.dataList = []
    this.chart2.dataList = []
  }
}
</script>

<style lang="less">
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>
