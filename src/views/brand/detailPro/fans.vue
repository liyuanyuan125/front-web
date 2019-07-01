<template>
  <div>
    <Row>
      <Col span="24">
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
              <router-link :to="{path: '/figure/detailMoreInfo/matching/'+pageQuery.brandId}"><Button :disabled="pageQuery.brandId === ''"
                        size="small"
                        type="primary">查看匹配度</Button></router-link>
              </Col>
            </Row>
          </div> -->
          <div class="content">
            <Row type="flex" justify="space-between">
              <Col :span="12">
              <div class='chart-wp' style='margin-right:10px'>
                <Pie :initDone="chart1.initDone" :noData="chart1.noData" :title='chart1.title' :dict1="chart1.dict1" :dict2="chart1.dict2" :color="chart1.color" :dataList="chart1.dataList" :currentTypeIndex="chart1.currentTypeIndex" />
              </div>
              </Col>
              <Col :span="12">
              <div class='chart-wp'>
                <BarXCategory :initDone="chart2.initDone" :noData="chart2.noData" :title='chart2.title' :dict1="chart2.dict1" :dict3="chart2.dict3" :color="chart2.color" :dataList="chart2.dataList" :currentTypeIndex="chart2.currentTypeIndex" />
              </div>
              </Col>
            </Row>
            <Row type="flex" justify="space-between" style='margin-top:10px'>
              <Col :span="12">
              <div class='chart-wp borderRadius' style='margin-right:10px; height:460px'>
                <MapChina :initDone="chart3.initDone" :title="chart3.title" :dict1="chart3.dict1" :dict2="chart3.dict2" :color="chart3.color" :max="chart3.max" :dataList="chart3.dataList" :currentTypeIndex="chart3.currentTypeIndex" />
              </div>
              </Col>
              <Col :span="12">
              <div class='chart-wp' style='height:460px'>
                <BarYCategory :initDone="chart4.initDone" :title="chart4.title" :dict1="chart4.dict1" :dict2="chart4.dict2" :color="chart4.color" :dataList="chart4.dataList" :currentTypeIndex="chart4.currentTypeIndex" @typeChange='typeChangeHander4' />
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
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fans, brands } from '@/api/productfans'
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
export default class Temporary extends ViewBase {
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
    noData: false,
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
    noData: false,
    dataList: [],
    color: ['#00B6CC']
  }
  chart3: any = {
    title: '省份分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    dataList: [],
    color: ['#ff9933', '#169bd5'],
    max: 100000
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
    const that: any = this
    const id: string = this.$route.params.id || ''

    try {
      const {
        data,
        data: {
          item: { femalePercent, malePercent, ages, citys, provinces }
        }
      } = await fans(id)
      if (femalePercent && malePercent) {
        this.chart1.dataList[this.chart1.currentTypeIndex] = [
          { name: '男', value: malePercent / 100 },
          { name: '女', value: femalePercent / 100 }
        ]
        this.chart1.initDone = true
      } else {
        this.chart1.initDone = true
        this.chart1.noData = true
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
        // console.log(this.chart2.dict3)
        this.chart2.initDone = true
      } else {
        this.chart2.initDone = true
        this.chart2.noData = true
      }

      if (provinces && provinces.length > 0) {
        let [min, max] = [0, 0]
        provinces.forEach(({ count, name }: any) => {
          count = parseInt(count, 0)
          max = max < count ? count : max
          min = min > count ? count : min
          this.chart3.dataList[this.chart3.currentTypeIndex].push({
            name: name.substr(0, name.length - 1),
            value: count
          })
          this.chart4.dataList[0].push({
            name: name.substr(0, name.length - 1),
            value: count
          })
        })
        this.chart3.min = min
        this.chart3.max = max
        this.chart3.initDone = true
        this.chart4.initDone = true
      }

      if (citys && citys.length > 0) {
        // cities.map((it: any) => {
        //   this.chart4.dataList[1].push({
        //     name: it.name,
        //     value: typeof it.count === 'number' ? it.count : parseInt(it.count, 0)
        //   })
        // })
        citys.forEach(({ count, name }: any) => {
          this.chart4.dataList[1].push({
            name,
            value: typeof count === 'number' ? count : parseInt(count, 0)
          })
        })
        this.chart4.initDone = true
      }
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
</style>
