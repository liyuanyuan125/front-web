<template>
  <div class="fans-box">
    <Form label-position="left" :label-width="100">
      <Card class="detailmore-card">
        <!-- <div slot="title">
            <Row type="flex"
                 justify="space-between"
                 align="middle">
              <Col :span="24" style="text-align:right">
              <Select v-model="pageQuery.brandId"
                      placeholder="可选品牌"
                      filterable
                      remote
                      clearable
                      :remote-method="remoteBrands"
                      :loading="brandsLoading"
                      style="max-width:150px; margin-right:10px;"
                      class='selectedBox'>
                <Option v-for="(option, index) in brands"
                        :value="option.value"
                        :key="index">{{option.label}}</Option>
              </Select>
              <router-link :to="{path: `/film/figure/detail/${id}/matching/${pageQuery.brandId}`}"><Button :disabled="pageQuery.brandId === ''"
                        size="small"
                        type="primary">查看匹配度</Button></router-link>
              </Col>
            </Row>
        </div> 演示临时关闭 nxd 20190621-->
        <div class="content">
          <Row type="flex" justify="space-between">
            <Col :span="12">
            <div class="chart-wp sex-chart" style="margin-right:10px">
              <Pie :initDone="chart1.initDone" :title="chart1.title" :dict1="chart1.dict1" :dict2="chart1.dict2" :color="chart1.color" :dataList="chart1.dataList" :toolTip="tooltipStyles({trigger:  'item', formatter:'{b} {c} %'})" :currentTypeIndex="chart1.currentTypeIndex" />
            </div>
            </Col>
            <Col :span="12">
            <div class="chart-wp age-chart">
              <BarXCategory :initDone="chart2.initDone" :title="chart2.title" :dict1="chart2.dict1" :dict3="chart2.dict3" :color="chart2.color" :dataList="chart2.dataList" :currentTypeIndex="chart2.currentTypeIndex" />
            </div>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" style="margin-top:10px">
            <Col :span="12">
            <div class="chart-wp province-chart" style="margin-right:10px; height:460px">
              <MapChina :initDone="chart3.initDone" :title="chart3.title" :dict1="chart3.dict1" :dict2="chart3.dict2" :color="chart3.color" :max="chart3.max" :dataList="chart3.dataList" :currentTypeIndex="chart3.currentTypeIndex" />
            </div>
            </Col>
            <Col :span="12">
            <div class="chart-wp city-chart" style="height:460px">
              <BarYCategory :initDone="chart4.initDone" :title="chart4.title" :dict1="chart4.dict1" :dict2="chart4.dict2" :color="chart4.color" :dataList="chart4.dataList" :currentTypeIndex="chart4.currentTypeIndex" @typeChange="typeChangeHander4" />
            </div>
            </Col>
          </Row>
        </div>
      </Card>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fans, brands } from '@/api/figureDetailMoreInfo'
import DetailNavBar from './components/detailNavBar.vue'
import BarXCategory from '@/components/chartsGroup/barXCategory'
import MapChina from '@/components/chartsGroup/mapChina'
import Pie from '@/components/chartsGroup/pieSimple'
import BarYCategory from '@/components/chartsGroup/barYCategory'
import { tooltipStyles } from '@/util/echarts'

@Component({
  components: {
    BarXCategory,
    Pie,
    MapChina,
    BarYCategory,
    DetailNavBar
  }
})
export default class Temporary extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  tooltipStyles = tooltipStyles

  form: any = {}

  pageQuery: any = {
    brandId: ''
  }

  dict: any = {
    brandList: [],
    genders: [
      // {
      //     "key": 0,
      //     "text": "未知"
      // },
      {
        key: 1,
        text: '男'
      },
      {
        key: 2,
        text: '女'
      }
    ]
  }

  chart1: any = {
    title: '粉丝男女分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#00B6CC', '#DA6C70']
  }

  chart2: any = {
    title: '粉丝年龄分布',
    dict1: [],
    dict2: [],
    dict3: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#00B6CC']
  }

  chart3: any = {
    title: '省份分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#ff9933', '#169bd5'],
    max: 100000
  }

  chart4: any = {
    title: '地域分布TOP10',
    dict1: [
      {
        key: 0,
        name: '省份'
      },
      {
        key: 1,
        name: '城市'
      }
    ],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: []
  }

  brandsLoading = false
  brands = []

  async typeChangeHander4(index: number = 0) {
    if (this.chart4.dataList[index].length < 1) {
      await this.getChartsData('chart4', index)
    }
    this.chart4.currentTypeIndex = index
  }

  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    try {
      const { data } = await fans(this.id)

      const item = data.item || null
      if (!item) {
        this.chart1.initDone = true
        this.chart2.initDone = true
        this.chart3.initDone = true
        this.chart4.initDone = true
        return
      }
      const genders = item.genders || null
      const ages = item.ages || null
      const provinces = item.provinces || null
      const cities = item.cities || null

      if (genders && genders.length > 0 && genders[0].rate && genders[0].rate !== '') {
        this.chart1.dict2 = data.genders.filter(({ key, text }: any) => {
          return text !== '未知' || key !== 0
        })
        this.chart1.dataList[this.chart1.currentTypeIndex] = this.chart1.dict2.map(
          ({ key, text }: any) => {
            return {
              name: text,
              value: genders.filter((it: any) => {
                return it.gender === key
              })[0].rate
            }
          }
        )
      }

      if (ages && ages.length > 0) {
        this.chart2.dataList[this.chart2.currentTypeIndex] = {
          type: 'bar',
          barMaxWidth: '20',
          data: []
        }
        ages.forEach(({ v, k }: any) => {
          this.chart2.dict3.push({
            text: k
          })
          this.chart2.dataList[this.chart2.currentTypeIndex].data.push(v)
        })
      }

      // 影人粉丝，省市数据返回占比，无需除100 xd 20190710
      const provinceList = ((provinces as any[]) || []).sort((a, b) => a.v - b.v)
      const cityList = ((cities as any[]) || []).sort((a, b) => a.v - b.v)

      let [min, max] = [0, 0]
      const provinceData = provinceList.map(({ v, k }) => {
        v = parseFloat(v)
        max = max < v ? v : max
        min = min > v ? v : min
        return { name: k, value: v }
      })
      const cityData = cityList.map(({ v, k }) => {
        return {
          name: k,
          value: typeof v === 'number' ? v : parseFloat(v)
        }
      })

      this.chart3.min = min
      this.chart3.max = max
      this.chart3.dataList[this.chart3.currentTypeIndex] = provinceData

      this.chart4.dataList[0] = provinceData.length > 10 ? provinceData.slice(0 , 10) : provinceData
      this.chart4.dataList[1] = cityData.length > 10 ? cityData.slice(0 , 10) : cityData

      this.chart1.initDone = true
      this.chart2.initDone = true
      this.chart3.initDone = true
      this.chart4.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async remoteBrands(query: string) {
    if (query !== '') {
      this.brandsLoading = true
      const mockObj = {
        name: query,
        pageIndex: 1,
        pageSize: 100
      }
      try {
        const {
          data,
          data: { items }
        } = await brands({ ...mockObj })
        const list = items.map((it: any) => {
          return {
            value: it.id,
            label: it.name
          }
        })
        this.brands = list.filter(
          (it: any) => it.label.toLowerCase().indexOf(query.toLowerCase()) > -1
        )
        this.brandsLoading = false
      } catch (ex) {
        this.handleError(ex)
      }
    } else {
      this.brands = []
    }
  }

  async brandsFetch() {
    const mockObj = {
      name: 'a',
      pageIndex: 1,
      pageSize: 100
    }
    try {
      const { data } = await brands({ ...mockObj })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  mounted() {
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
    this.chart1.dataList.forEach((item: any[]) => {
      item.splice(0, item.length)
    })
    this.chart2.dataList.forEach((item: any) => {
      item.data.splice(0, item.length)
    })
    this.chart2.dict3.splice(0, this.chart2.dict3.length)
    this.chart3.dataList.forEach((item: any[]) => {
      item.splice(0, item.length)
    })
    this.chart4.dataList.forEach((item: any[]) => {
      item.splice(0, item.length)
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';

.fans-box {
  margin-top: -10px;
}

.sex-chart {
  border-radius: 6px 0 0 0;
}

.age-chart {
  border-radius: 0 6px 0 0;
}

.province-chart {
  border-radius: 0 0 0 6px;
}

.city-chart {
  border-radius: 0 0 6px 0;
  /deep/ .chart-wrap:empty::before {
    position: relative;
    top: -25px;
  }
}
</style>
