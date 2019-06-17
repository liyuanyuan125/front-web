<template>
  <div>
    <Row>
      <Col span="24">
      <Form label-position="left"
            :label-width="100">
        <Card class="detailmore-card">
          <div slot="title">
            <Row type="flex"
                 justify="space-between" align="middle">
              <Col :span="17">
                <DetailNavBar titleText=''>
                  <div slot='item' type="flex" justify="space-between" align="left" >
                    <span>整体匹配度72%</span>
                  </div>
                </DetailNavBar>
              </Col>
              <Col :span="7" class-name="select-box" align="middle" >
                <span class='one-v-one'>
                  <i style="background-color: #DA6C70"></i>Papi酱<span>PK</span><i style="background-color: #00B6CC"></i>
                </span>
                <Select v-model="form.brandId"
                        @on-change="handleChange"
                        class='selectedBox'
                        style='width:100px'>
                  <Option v-for="item in dict.brandList"
                          :value="item.id"
                          :key="item.id">{{ item.name }}</Option>
                </Select>
              </Col>
            </Row>
          </div>
          <div class="content">
            <Row type="flex" justify="space-between">
              <Col :span="12">
                <div class='chart-wp' style='margin-right:10px'>
                  <div class='circle-box'>
                    <i-circle :percent="chart1.percent"
                              :size="iCircleOption.size"
                              :trail-color="iCircleOption.trailColor"
                              :stroke-color="iCircleOption.strokeColor"
                              :trail-width="iCircleOption.trailWidth"
                              :stroke-width="iCircleOption.strokeWidth">
                      <h6>{{chart1.percent}}%</h6>
                      <p>匹配度</p>
                    </i-circle>
                  </div>
                  <BarXCategory :initDone="chart1.initDone"
                                :title='chart1.title'
                                :dict1="chart1.dict1"
                                :dict2="chart1.dict2"
                                :dict3="chart1.dict3"
                                :toolTip="tooltipStyles({trigger:  'item', formatter:'{a}<br/>{b}:{c}'})"
                                :color="chart1.color"
                                :dataList="chart1.dataList"
                                :currentTypeIndex="chart1.currentTypeIndex"  />
                </div>
              </Col>
              <Col :span="12">
                <div class='chart-wp'>
                  <div class='circle-box'>
                    <i-circle :percent="chart2.percent"
                              :size="iCircleOption.size"
                              :trail-color="iCircleOption.trailColor"
                              :stroke-color="iCircleOption.strokeColor"
                              :trail-width="iCircleOption.trailWidth"
                              :stroke-width="iCircleOption.strokeWidth">
                      <h6>{{chart2.percent}}%</h6>
                      <p>匹配度</p>
                    </i-circle>
                  </div>
                  <BarXCategory :initDone="chart2.initDone"
                                :title='chart2.title'
                                :dict1="chart2.dict1"
                                :dict2="chart2.dict2"
                                :dict3="chart2.dict3"
                                :toolTip="tooltipStyles({trigger:  'item', formatter:'{a}<br/>{b}:{c}'})"
                                :color="chart2.color"
                                :dataList="chart2.dataList"
                                :currentTypeIndex="chart2.currentTypeIndex" />
                </div>
              </Col>
            </Row>
            <Row type="flex" justify="space-between" style='margin-top:10px'>
              <Col :span="12">
                <div class='chart-wp borderRadius' style='margin-right:10px'>
                  <div class='circle-box'>
                    <i-circle :percent="chart3.percent"
                              :size="iCircleOption.size"
                              :trail-color="iCircleOption.trailColor"
                              :stroke-color="iCircleOption.strokeColor"
                              :trail-width="iCircleOption.trailWidth"
                              :stroke-width="iCircleOption.strokeWidth">
                      <h6>{{chart3.percent}}%</h6>
                      <p>匹配度</p>
                    </i-circle>
                  </div>
                  <BarYCategoryDouble :initDone="chart3.initDone"
                                      :title="chart3.title"
                                      :titleTips="chart3.titleTips"
                                      :dict1="chart3.dict1"
                                      :dict2="chart3.dict2"
                                      :toolTip="tooltipStyles({trigger:  'item', formatter:'{a}<br/>{b}:{c}'})"
                                      :color="chart3.color"
                                      :dataList="chart3.dataList"
                                      :currentTypeIndex="chart3.currentTypeIndex"  />
                </div>
              </Col>
              <Col :span="12">
                <div class='chart-wp borderRadius'>
                  <div class='circle-box'>
                    <i-circle :percent="chart4.percent"
                              :size="iCircleOption.size"
                              :trail-color="iCircleOption.trailColor"
                              :stroke-color="iCircleOption.strokeColor"
                              :trail-width="iCircleOption.trailWidth"
                              :stroke-width="iCircleOption.strokeWidth">
                      <h6>{{chart4.percent}}%</h6>
                      <p>匹配度</p>
                    </i-circle>
                  </div>
                  <BarYCategoryDouble :initDone="chart4.initDone"
                                      :title="chart4.title"
                                      :dict1="chart4.dict1"
                                      :dict2="chart4.dict2"
                                      :toolTip="tooltipStyles({trigger:  'item', formatter:'{a}<br/>{b}:{c}'})"
                                      :color="chart4.color"
                                      :dataList="chart4.dataList"
                                      :currentTypeIndex="chart4.currentTypeIndex" />
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
import {
  formatTimestamp,
  formatTimes,
  formatNumber
} from '@/util/validateRules'
import { matching } from '@/api/figureDetailMoreInfo'
import BarXCategory from '@/components/chartsGroup/barXCategory/'
import BarYCategoryDouble from '@/components/chartsGroup/barYCategoryDouble/'
import DetailNavBar from '@/views/film/figure/detailMoreInfo/components/detailNavBar.vue'
import { tooltipStyles } from '@/util/echarts'
@Component({
  components: {
    BarXCategory,
    BarYCategoryDouble,
    DetailNavBar
  }
})
export default class Temporary extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
  tooltipStyles = tooltipStyles
  form: any = {
    brandId: 0
  }
  dict: any = {
    brandList: [
      {
        id: 0,
        name: '奔驰',
        disabled: false
      },
      {
        id: 1,
        name: '奥迪',
        disabled: false
      },
      {
        id: 2,
        name: '宝马',
        disabled: false
      }
    ]
  }
  iCircleOption: any = {
    size: 60,
    trailColor: '#00202D',
    strokeColor: '#BCE2F0',
    trailWidth: 6,
    strokeWidth: 3
  }
  chart1: any = {
    percent: 80,
    title: '男女分布',
    dict1: [],
    dict2: [],
    dict3: [],
    color: ['#DA6C70', '#00B6CC'],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  chart2: any = {
    percent: 80,
    title: '年龄分布',
    dict1: [],
    dict2: [],
    dict3: [],
    color: ['#DA6C70', '#00B6CC'],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  chart3: any = {
    percent: 80,
    title: '省份分布TOP10',
    titleTips: '描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息',
    dict1: [],
    dict2: [],
    color: ['#DA6C70', '#00B6CC'],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  chart4: any = {
    percent: 80,
    title: '城市分布TOP10',
    titleTips: '描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息',
    dict1: [],
    dict2: [],
    color: ['#DA6C70', '#00B6CC'],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const that: any = this
    const mockObj = {
      accountType: 'ads',
      effectType: typeIndex
    }
    try {
      const { data } = await matching({ ...mockObj })
      that.chart1.dict2 = data.chart1.effectTypeList1
      that.chart1.dict3 = data.chart1.effectTypeList2
      that.chart1.dataList[typeIndex] = [
        {
          name: 'Papi酱',
          barMaxWidth: '20',
          type: 'bar',
          data: [230230, 330230, 630230, 230230, 630230]
        },
        {
          name: '奔驰',
          barMaxWidth: '20',
          type: 'bar',
          data: [134141, 681807, 630230, 630230, 630230]
        }
      ]
      that.chart1.initDone = true

      that.chart2.dict2 = data.chart2.effectTypeList1
      that.chart2.dict3 = data.chart2.effectTypeList2
      that.chart2.dataList[typeIndex] = [
          {
              name: 'Papi酱',
              type: 'bar',
              barMaxWidth: '20',
              data: [
                  230230,
                  330230,
                  630230,
                  230230,
                  630230
              ]
          },
          {
              name: '奔驰',
              type: 'bar',
              barMaxWidth: '20',
              data: [
                  134141,
                  681807,
                  630230,
                  630230,
                  630230
              ]
          }
      ]
      that.chart2.initDone = true

      that.chart3.dict2 = data.chart3.effectTypeList
      that.chart3.dataList[typeIndex] = data.chart3.dataList
      that.chart3.initDone = true

      that.chart4.dict2 = data.chart4.effectTypeList
      that.chart4.dataList[typeIndex] = data.chart4.dataList
      that.chart4.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleChange() {
    this.chart1.initDone = false
    this.chart2.initDone = false
    this.chart3.initDone = false
    this.chart4.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }
  async mounted() {
    this.initHandler()
  }
  async initHandler() {
    if (this.chart1.dict1.length > 0) {
      this.chart1.dict1.map((item: any, index: number) => {
        this.chart1.dataList.push([])
      })
    } else {
      this.chart1.dataList.push([])
    }

    if (this.chart2.dict1.length > 0) {
      this.chart2.dict1.map((item: any, index: number) => {
        this.chart2.dataList.push([])
      })
    } else {
      this.chart2.dataList.push([])
    }

    if (this.chart3.dict1.length > 0) {
      this.chart3.dict1.map((item: any, index: number) => {
        this.chart3.dataList.push([])
      })
    } else {
      this.chart3.dataList.push([])
    }

    if (this.chart4.dict1.length > 0) {
      this.chart4.dict1.map((item: any, index: number) => {
        this.chart4.dataList.push([])
      })
    } else {
      this.chart4.dataList.push([])
    }

    await this.getChartsData('', 0)
  }
  resetData() {
    this.chart1.dataList.forEach((item: any) => {
      item.splice(0, item.length)
    })
    this.chart2.dataList.forEach((item: any) => {
      item.splice(0, item.length)
    })
    this.chart3.dataList.forEach((item: any) => {
      item.splice(0, item.length)
    })
    this.chart4.dataList.forEach((item: any) => {
      item.splice(0, item.length)
    })
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>