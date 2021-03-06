<template>
  <div>
    <Form label-position="left" :label-width="100">
      <Card class="detailmore-card">
        <div slot="title">
          <Row type="flex" justify="space-between">
            <Col :span="17">
              <DetailNavBar titleText="统计周期">
                <div slot="item">
                  <RadioGroup
                    class="nav"
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
                    @on-change="dateChange"
                    placement="bottom-end"
                    placeholder="自定义时间段"
                  ></DatePicker>
                </div>
              </DetailNavBar>
            </Col>
            <Col :span="7" style="text-align:right; color:#fff;">
              平台
              <Select
                v-model="form.channelCode"
                clearable
                @on-change="handleChange"
                style="width:150px; text-align:left"
              >
                <Option
                  v-for="(item, index) in dict.channelList"
                  :key="index"
                  :value="item.key"
                >{{item.text}}</Option>
              </Select>
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
                  :toolTip="chart1.toolTip"
                  :height="chart1.height"
                  :color="chart1.color"
                  :dataList="chart1.dataList"
                  :currentTypeIndex="chart1.currentTypeIndex"
                  @typeChange="typeChangeHander"
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
import moment from 'moment'
import { findIndex } from 'lodash'
import { formatTimestamp, formatTimes, formatNumber } from '@/util/validateRules'
import DetailNavBar from './components/detailNavBar.vue'
import { platform } from '@/api/kolDetailMoreInfo'
import AreaBasic from '@/components/chartsGroup/areaBasic/area-basic.vue'
const timeFormat = 'YYYYMMDD'
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
    DetailNavBar
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: 'weibo' }) channel!: string

  form: any = {
    dayRangesKey: 'sevenDay',
    channelCode: this.channel
  }

  dict: any = {
    channelList: [],
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
    ]
  }

  chart1: any = {
    title: '',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#00b6cc'],
    height: 350,
    toolTip
  }

  typeChangeHander(index: number = 0) {
    this.chart1.currentTypeIndex = index
  }

  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const mockObj = {
      channelCode: this.form.channelCode || 'weibo',
      beginDate: this.beginDate(this.form.dayRangesKey),
      endDate: this.endDate()
    }
    const id = this.id
    try {
      const { data } = await platform({ ...mockObj }, id)

      this.dict.channelList = data.channelList ? data.channelList : null
      // 接口缺少枚举，本地写死
      this.chart1.dict1 = [
        {
          key: 'dau',
          name: '日活跃'
        },
        {
          key: 'likeCount',
          name: '点赞数'
        },
        {
          key: 'commentCount',
          name: '评论数'
        },
        {
          key: 'playCount',
          name: '播放数'
        },
        {
          key: 'readCount',
          name: '阅读数'
        },
        {
          key: 'forwardCount',
          name: '转发数'
        },
        {
          key: 'shareCount',
          name: '分享数'
        }
      ]
      // 根据日期排序
      const items = ((data.items as any[]) || []).sort((a, b) => a.date - b.date)

      if (!items) {
        this.chart1.initDone = true
        return
      }
      const res = items.filter((it: any) => {
        return it.channelCode === this.form.channelCode
      })

      this.chart1.dataList = this.chart1.dict1.map((it: any) => {
        return {
          data: [],
          date: []
        }
      })

      // 填充颜色
      this.chart1.color = this.chart1.dict1.map((it: any) => {
        return this.chart1.color[0]
      })
      // k : dau, likeCount, commentCount, playCount, readCount, forwardCount, shareCount
      res.forEach((item: any, index: number) => {
        this.chart1.dataList.forEach((it: any) => {
          it.date.push(item.date)
        })
        for (const k in item) {
          if (this.getIndex(k) !== -1) {
            this.chart1.dataList[`${this.getIndex(k)}`].data.push(item[k])
          }
        }
      })
      this.chart1.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  /**
   * 根据筛选返回起始日期，影人、影片、kol字段名未统一
   * @param dayRangesKey 昨天 | 过去7天 | 过去30天 | 过去90天
   */
  beginDate(dayRangesKey: string) {
    if ( this.form.beginDate.length > 0 && this.form.beginDate[0] !== '' ) {
      return moment(this.form.beginDate[0]).format(timeFormat)
    }
    // 日期选择器和周期选择互斥
    switch (dayRangesKey) {
      case 'yesterday':
        return moment(new Date())
          .add(-1, 'days')
          .format(timeFormat)
      case 'thirtyDay':
        return moment(new Date())
          .add(-30, 'days')
          .format(timeFormat)
      case 'ninetyDay':
        return moment(new Date())
          .add(-90, 'days')
          .format(timeFormat)
      default:
        return moment(new Date())
          .add(-7, 'days')
          .format(timeFormat)
    }
  }

  getIndex(key: string) {
    return findIndex(this.chart1.dict1, (it: any) => {
      return it.key === key
    })
  }

  endDate() {
    if ( this.form.beginDate.length > 0 && this.form.beginDate[1] !== '' ) {
      return moment(this.form.beginDate[1]).format(timeFormat)
    }
    // 日期选择器和周期选择互斥
    return this.form.dayRangesKey == 'yesterday'
      ? moment(new Date())
          .add(-1, 'days')
          .format(timeFormat)
      : moment(new Date()).format(timeFormat)
  }

  async handleChange() {
    // 日期选择器和周期选择互斥,清除日历数据
    this.form.beginDate = []
    this.chart1.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }

  async dateChange() {
    // 日期选择器和周期选择互斥
    this.chart1.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }

  async mounted() {
    await this.getChartsData('', 0)
  }

  resetData() {
    this.chart1.dataList.forEach((it: any) => {
      it.data = []
      it.date = []
    })
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>
