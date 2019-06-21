<template>
  <div>
    <Form label-position="left" :label-width="100">
      <Card class="detailmore-card">
        <div slot="title">
          <Row type="flex" justify="space-between" align="middle">
            <Col :span="17">
              <DetailNavBar titleText="统计周期">
                <div slot="item">
                  <RadioGroup
                    style="margin-right:15px"
                    @on-change="handleChange"
                    v-model="form.statisticTimeId"
                    size="large"
                    type="button"
                  >
                    <Radio
                      v-for="(item) in dict.statisticTime"
                      :key="item.id"
                      :disabled="item.disabled"
                      :label="item.id"
                    >{{item.name}}</Radio>
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
            <Col :span="7" style="text-align:right">
              平台
              <Select
                v-model="form.platformId"
                clearable
                @on-change="handleChange"
                style="width:150px; text-align:left"
              >
                <Option
                  v-for="(item) in dict.platform"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</Option>
              </Select>
            </Col>
          </Row>
        </div>
        <div class="content">
          <Row type="flex" justify="space-between">
            <Col :span="24">
              <div class="chart-wp borderRadius">
                <AreaBasic
                  :initDone="chart1.initDone"
                  :title="chart1.title"
                  :dict1="chart1.dict1"
                  :dict2="chart1.dict2"
                  :color="chart1.color"
                  :dataList="chart1.dataList"
                  :currentTypeIndex="chart1.currentTypeIndex"
                  @typeChange="typeChangeHander1"
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
import DetailNavBar from './components/detailNavBar.vue'
import { platformData } from '@/api/kolDetailMoreInfo'
import numAdd from '../number.vue'
import AreaBasic from '@/components/chartsGroup/areaBasic/'

@Component({
  components: {
    AreaBasic,
    DetailNavBar
  }
})
export default class Platform extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  form: any = {
    platformId: 0,
    beginDate: [
      // new Date(2019, 3, 9), new Date(2019, 4, 11)
    ],
    statisticTimeId: 0
  }

  dict: any = {
    statisticTime: [
      {
        id: 0,
        name: '昨天',
        disabled: false
      },
      {
        id: 1,
        name: '最近7天',
        disabled: false
      },
      {
        id: 2,
        name: '最近30天',
        disabled: false
      },
      {
        id: 3,
        name: '最近90天',
        disabled: true
      }
    ],
    platform: [
      {
        id: 0,
        name: '微信公众号'
      },
      {
        id: 1,
        name: '新浪微博'
      },
      {
        id: 2,
        name: '小红书'
      },
      {
        id: 3,
        name: '抖音'
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
    color: ['#0099cc', '#0099cc', '#0099cc', '#0099cc']
  }

  async typeChangeHander1(index: number = 0) {
    if (this.chart1.dataList[index].length < 1) {
      await this.getChartsData('chart2', index)
    }
    this.chart1.currentTypeIndex = index
  }

  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const mockObj = {
      effectType: typeIndex
    }
    try {
      const { data } = await platformData({ ...mockObj })
      if (data.chart1.effectTypeList.length > 0) {
        this.chart1.dataList = data.chart1.effectTypeList.map(
          (item: any, index: number) => {
            return {
              data: [],
              date: []
            }
          }
        )
      } else {
        this.chart1.dataList.push({
          data: [],
          date: []
        })
      }
      this.chart1.dict1 = data.chart1.effectTypeList
      data.chart1.dataList.forEach((item: any, index: number) => {
        this.chart1.dataList[item.key].data.push(item.data)
        this.chart1.dataList[item.key].date.push(item.date)
      })
      this.chart1.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async handleChange() {
    this.chart1.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }

  async mounted() {
    await this.getChartsData('', 0)
  }

  resetData() {
    this.chart1.dataList = []
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>
