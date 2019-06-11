
<template>
  <div>
    <Form label-position="left" :label-width="100">
      <Card class="detailmore-card">
        <div slot="title">
          <Row type="flex" justify="space-between" align="middle">
            <Col :span="17">
              <DetailNavBar titleText="平台">
                <div slot="item">
                  <Select v-model="form.platformId" clearable @on-change="handleChange">
                    <Option
                      v-for="(item) in dict.platform"
                      :key="item.id"
                      :value="item.id"
                    >{{item.name}}</Option>
                  </Select>
                </div>
              </DetailNavBar>
            </Col>
            <Col :span="7" style="text-align:right">
              <Select
                v-model="pageQuery.brandId"
                placeholder="可选品牌"
                style="width:150px; margin-right:10px;"
                class="selectedBox"
              >
                <Option
                  v-for="item in dict.brandList"
                  :value="item.id"
                  :key="item.id"
                >{{ item.name }}</Option>
              </Select>
              <router-link :to="{path: '/kol/detailMoreInfo/matching/'+pageQuery.brandId}">
                <Button :disabled="pageQuery.brandId === ''" size="small" type="primary">查看匹配度</Button>
              </router-link>
            </Col>
          </Row>
        </div>
        <div class="content">
          <Row type="flex" justify="space-between">
            <Col :span="12">
              <div class="chart-wp" style="margin-right:10px">
                <Pie
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
            <Col :span="12">
              <div class="chart-wp">
                <BarXCategory
                  :initDone="chart2.initDone"
                  :title="chart2.title"
                  :dict1="chart2.dict1"
                  :dict2="chart2.dict2"
                  :dict3="chart2.dict3"
                  :color="chart2.color"
                  :dataList="chart2.dataList"
                  :currentTypeIndex="chart2.currentTypeIndex"
                />
              </div>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" style="margin-top:10px">
            <Col :span="12">
              <div class="chart-wp borderRadius" style="margin-right:10px; height:460px">
                <MapChina
                  :initDone="chart3.initDone"
                  :title="chart3.title"
                  :dict1="chart3.dict1"
                  :dict2="chart3.dict2"
                  :color="chart3.color"
                  :dataList="chart3.dataList"
                  :currentTypeIndex="chart3.currentTypeIndex"
                />
              </div>
            </Col>
            <Col :span="12">
              <div class="chart-wp" style="height:460px">
                <BarYCategory
                  :initDone="chart4.initDone"
                  :title="chart4.title"
                  :dict1="chart4.dict1"
                  :dict2="chart4.dict2"
                  :color="chart4.color"
                  :dataList="chart4.dataList"
                  :currentTypeIndex="chart4.currentTypeIndex"
                  @typeChange="typeChangeHander4"
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
import { fans } from '@/api/kolDetailMoreInfo'
import DetailNavBar from './components/detailNavBar.vue'
import BarXCategory from '@/components/chartsGroup/barXCategory/'
import MapChina from '@/components/chartsGroup/mapChina/'
import Pie from '@/components/chartsGroup/pieSimple/'
import BarYCategory from '@/components/chartsGroup/barYCategory/'

@Component({
  components: {
    BarXCategory,
    Pie,
    MapChina,
    BarYCategory,
    DetailNavBar
  }
})
export default class Fans extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  form: any = {
    platformId: 0
  }

  pageQuery: any = {
    brandId: ''
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
    title: '粉丝男女分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#ff9933', '#169bd5']
  }

  chart2: any = {
    title: '粉丝年龄分布',
    dict1: [],
    dict2: [],
    dict3: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#ff9933', '#169bd5']
  }

  chart3: any = {
    title: '省份分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#ff9933', '#169bd5']
  }

  chart4: any = {
    title: '城市分粉丝量TOP10',
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
    color: ['#ff9933', '#169bd5']
  }

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
    const that: any = this
    const mockObj = {
      effectType: typeIndex
    }
    try {
      const { data } = await fans({ ...mockObj })

      that.chart1.dict2 = data.chart1.effectTypeList
      that.chart1.dataList[typeIndex] = data.chart1.dataList
      that.chart1.initDone = true

      that.chart2.dict3 = data.chart2.effectTypeList
      that.chart2.dataList[typeIndex] = data.chart2.dataList
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
      item = []
    })
    this.chart2.dataList.forEach((item: any) => {
      item = []
    })
    this.chart3.dataList.forEach((item: any) => {
      item = []
    })
    this.chart4.dataList.forEach((item: any) => {
      item = []
    })
  }
}
</script>

<style lang="less">
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>
