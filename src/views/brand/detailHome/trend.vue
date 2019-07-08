<template>
  <div>
    <Form label-position="left" :label-width="100">
      <Card class="detailmore-card">
        <div slot="title">
          <Row type="flex" justify="space-between">
            <Col :span="24">
            <DetailNavBar titleText="统计周期">
              <div slot="item">
                <RadioGroup class='nav' style="margin-right:15px" @on-change="handleChange" v-model="form.dayRangesKey" size="large" type="button">
                  <Radio v-for="(item) in dict.dayRanges" :key="item.key" :disabled="item.disabled" :label="item.key">{{item.text}}</Radio>
                </RadioGroup>
                <DatePicker type="daterange" v-model="form.beginDate" @on-change="handleChange" placement="bottom-end" placeholder="自定义时间段"></DatePicker>
              </div>
            </DetailNavBar>
            </Col>
          </Row>
        </div>
        <div class="content">
          <Row type="flex" justify="space-between">
            <Col :span="24">
            <div class="chart-wp">
              <AreaBasic :initDone="chart1.initDone" :title="chart1.title" :dict1="chart1.dict1" :dict2="chart1.dict2" :toolTip="chart1.toolTip" :height="chart1.height" :color="chart1.color" :dataList="chart1.dataList" :currentTypeIndex="chart1.currentTypeIndex" />
            </div>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col :span="24">
            <div class="chart-wp borderRadius">
              <AreaBasicxtra :initDone="chart2.initDone" :title="chart2.title" :dict1="chart2.dict1" :dict2="chart2.dict2" :color="chart2.color" :dataList="chart2.dataList" :currentTypeIndex="chart2.currentTypeIndex" @typeChange="typeChangeHander2" />
            </div>
            </Col>
          </Row>
        </div>
      </Card>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { formatTimestamp, formatTimes, formatNumber } from '@/util/validateRules'
import DetailNavBar from './components/detailNavBar.vue'
import { trend } from '@/api/brandfans'
import AreaBasic from '@/components/chartsGroup/areaBasic/area-basic.vue'
import AreaBasicxtra from '@/components/chartsGroup/areaBasicExtra/'
const timeFormat = 'YYYYMMDD'
import { findIndex, at, keyBy } from 'lodash'
import { KeyText } from '@/util/types'

const getName = (key: string, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return key === it.key
  })
  const res: string = list[i].text
  return res
}
const dot = (object: any, path: string) => at(object, path)[0]
const getNames = (keys: string[], list: KeyText[]) => {
  const map = keyBy(list, 'key')
  const names = (keys || []).map((it: any) => dot(map[it], 'text') as string)
  return names
}
const toolTip: any = {
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, .8)',
  backgroundColor: 'rgba(0, 0, 0, .8)',
  padding: [7, 10],
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
            color: 'rgba(255, 255, 255, .01)'
          },
          {
            offset: 1,
            color: 'rgba(255, 255, 255, .5)'
          }
        ]
      }
    }
  }
}

@Component({
  components: {
    AreaBasic,
    AreaBasicxtra,
    DetailNavBar
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  form: any = {
    beginDate: [
      // new Date(2019, 3, 9), new Date(2019, 4, 11)
    ],
    dayRangesKey: 'last_7_day'
  }

  dict: any = {
    dayRanges: [
      {
        key: 'yesterday',
        text: '昨日',
        disabled: false
      },
      {
        key: 'last_7_day',
        text: '最近7天',
        disabled: false
      },
      {
        key: 'last_30_day',
        text: '最近30天',
        disabled: false
      },
      {
        key: 'last_90_day',
        text: '最近90天',
        disabled: false
      }
    ]
  }

  chart1: any = {
    title: '综合热度',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [
      {
        data: [],
        date: []
      }
    ],
    color: ['#00b6cc'],
    height: 350,
    toolTip
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
      beginDate: this.beginDate(this.form.dayRangesKey),
      endDate: this.endDate()
    }
    const id = this.id
    try {
      const { data } = await trend({ ...mockObj }, id)

      const items = data.items || null

      if (items && items.length > 0) {
        this.chart2.dict1 = items[0].channels.map((it: any, index: number) => {
          return {
            text: it.name + '指数',
            key: index
          }
        })
        items[0].channels.forEach((it: any) => {
          this.chart2.dataList.push({
            data: [],
            date: []
          })
        })
        items.forEach((it: any, index: number) => {
          this.chart1.dataList[0].date.push(it.date)
          this.chart1.dataList[0].data.push(it.count)
          it.channels.forEach((channelItem: any, i: number) => {
            this.chart2.dataList[i].data.push(channelItem.count)
            this.chart2.dataList[i].date.push(it.date)
          })
        })
      }
      this.chart1.initDone = true
      this.chart2.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  /**
   * 根据筛选返回起始日期，影人、影片、kol字段名未统一
   * @param dayRangesKey 昨天 | 过去7天 | 过去30天 | 过去90天
   */
  beginDate(dayRangesKey: string) {
    switch (dayRangesKey) {
      case 'yesterday':
        return moment(new Date())
          .add(-1, 'days')
          .format(timeFormat)
      case 'last_30_day':
        return moment(new Date())
          .add(-30, 'days')
          .format(timeFormat)
      case 'last_90_day':
        return moment(new Date())
          .add(-90, 'days')
          .format(timeFormat)
      default:
        return moment(new Date())
          .add(-7, 'days')
          .format(timeFormat)
    }
  }

  endDate() {
    return this.form.dayRangesKey == 'yesterday'
      ? moment(new Date())
          .add(-1, 'days')
          .format(timeFormat)
      : moment(new Date()).format(timeFormat)
  }

  async handleChange() {
    this.chart1.initDone = false
    this.chart2.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }

  async mounted() {
    await this.getChartsData('', 0)
  }

  resetData() {
    this.chart1.dataList[0].data = []
    this.chart1.dataList[0].date = []
    this.chart2.dataList = []
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>
