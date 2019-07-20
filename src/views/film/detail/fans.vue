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
              <div class='chart-wp' style='margin-right:10px;'>
                <Pie :initDone="chart1.initDone" :title='chart1.title' :dict1="chart1.dict1" :dict2="chart1.dict2" :color="chart1.color" :dataList="chart1.dataList" :currentTypeIndex="chart1.currentTypeIndex" />
              </div>
              </Col>
              <Col :span="12">
              <div class='chart-wp' style=''>
                <BarXCategory :initDone="chart2.initDone" :title='chart2.title' :dict1="chart2.dict1" :dict3="chart2.dict3" :color="chart2.color" :dataList="chart2.dataList" :currentTypeIndex="chart2.currentTypeIndex" />
              </div>
              </Col>
            </Row>
            <Row type="flex" justify="space-between" style='margin-top:10px'>
              <Col :span="12">
              <div class='chart-wp borderRadius' style='margin-right:10px;'>
                <BarXCategory :initDone="chart3.initDone" :title='chart3.title' :dict1="chart3.dict1" :dict3="chart3.dict3" :color="chart3.color" :dataList="chart3.dataList" :currentTypeIndex="chart3.currentTypeIndex" />
              </div>
              </Col>
              <Col :span="12">
              <div class='chart-wp borderRadius' style=''>
                <PieNest :initDone="chart4.initDone" :title='chart4.title' :dict1="chart4.dict1" :dict2="chart4.dict2" :color="chart4.color" :dataList="chart4.dataList" :currentTypeIndex="chart4.currentTypeIndex" />
              </div>
              </Col>
              <Col :span="12">
              <div class='chart-wp borderRadius' style='margin-right:10px;margin-top: 10px;'>
                <PieNest :initDone="chart5.initDone" :title='chart5.title' :dict1="chart5.dict1" :dict2="chart5.dict2" :color="chart5.color" :dataList="chart5.dataList" :currentTypeIndex="chart5.currentTypeIndex" />
              </div>
              </Col>
              <Col :span="12">
              <div class='chart-wp borderRadius' style='margin-top:10px;'>
                <PieNest :initDone="chart6.initDone" :title='chart6.title' :dict1="chart6.dict1" :dict2="chart6.dict2" :color="chart6.color" :dataList="chart6.dataList" :currentTypeIndex="chart6.currentTypeIndex" />
              </div>
              </Col>
              <Col :span="12">
              <div class='chart-wp borderRadius' style='margin-right:10px;margin-top: 10px;'>
                <PieNest :initDone="chart7.initDone" :title='chart7.title' :dict1="chart7.dict1" :dict2="chart7.dict2" :color="chart7.color" :dataList="chart7.dataList" :currentTypeIndex="chart7.currentTypeIndex" />
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
import { fans, brands, film } from '@/api/filmfans'
import DetailNavBar from './components/detailNavBar.vue'
import BarXCategory from '@/components/chartsGroup/barXCategory/'
import MapChina from '@/components/chartsGroup/mapChina/'
import Pie from '@/components/chartsGroup/pieSimple/'
import PieNest from '@/components/chartsGroup/pieNest/'
import { toMap } from '@/fn/array'
import { findIndex } from 'lodash'

const getName = (key: string, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return key === it.key
  })
  const res: string = list[i].text
  return res
}

@Component({
  components: {
    BarXCategory,
    Pie,
    MapChina,
    DetailNavBar,
    PieNest
  }
})
export default class Temporary extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
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
    title: '地域分布',
    dict1: [],
    dict2: [],
    dict3: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#D0BF6B']
  }
  chart4: any = {
    title: '购物类型偏好',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: [
      '#FF8B92',
      '#9B83FF',
      '#F5D44E',
      '#29CFE4',
      '#E49E42',
      '#F17A40',
      '#00B6CC',
      '#55DE6A',
      '#599BFC'
    ]
  }
  chart5: any = {
    title: '电影偏好',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: [
      '#FF8B92',
      '#9B83FF',
      '#F5D44E',
      '#29CFE4',
      '#E49E42',
      '#F17A40',
      '#00B6CC',
      '#55DE6A',
      '#599BFC'
    ]
  }
  chart6: any = {
    title: '学历',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#FF8B92', '#F5D44E', '#29CFE4', '#55DE6A']
  }
  chart7: any = {
    title: '职业',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#FF8B92', '#F5D44E', '#29CFE4', '#55DE6A']
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
        data
      } = await fans(id)

      const genders = data.genders || null
      const ages = data.ages || null
      const cityLevels = data.cityLevels || null
      const shoppingTypes = data.shoppingTypes || null
      const movieTypes = data.movieTypes || null
      const educations = data.educations || null
      const jobs = data.jobs || null
      const genderCodeList = data.genderCodeList || null

      if ( genders && genders.length > 0 ) {
        genders.forEach((it: any) => {
          if (getName(it.gender, genderCodeList) === '男') {
            this.chart1.dataList[0].push({
              name: '男',
              value: it.rate,
              itemStyle: {
                color: '#00B6CC'
              }
            })
          } else if (getName(it.gender, genderCodeList) === '女') {
            this.chart1.dataList[0].push({
              name: '女',
              value: it.rate,
              itemStyle: {
                color: '#DA6C70'
              }
            })
          }
        })
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

      if ( cityLevels && cityLevels.length > 0 ) {
        this.chart3.dataList[this.chart3.currentTypeIndex] = {
          type: 'bar',
          barMaxWidth: '20',
          data: []
        }
        cityLevels.forEach(({ v, k }: any) => {
          this.chart3.dict3.push({
            text: k
          })
          this.chart3.dataList[this.chart3.currentTypeIndex].data.push(v)
        })
      }

      if (shoppingTypes && shoppingTypes.length > 0) {
        this.chart4.dataList[this.chart4.currentTypeIndex] = shoppingTypes.map(
          (it: any) => {
            return {
              name: it.k,
              value: it.v
            }
          }
        )
      }

      if (movieTypes && movieTypes.length > 0) {
        this.chart5.dataList[this.chart5.currentTypeIndex] = movieTypes.map(
          (it: any) => {
            return {
              name: it.k,
              value: it.v
            }
          }
        )
      }

      if (educations && educations.length > 0) {
        this.chart6.dataList[this.chart6.currentTypeIndex] = educations.map(
          (it: any) => {
            return {
              name: it.k,
              value: it.v
            }
          }
        )
      }

      if (jobs && jobs.length > 0) {
        this.chart7.dataList[this.chart7.currentTypeIndex] = jobs.map((it: any) => {
          return {
            name: it.k,
            value: it.v
          }
        })
      }

      this.chart1.initDone = true
      this.chart2.initDone = true
      this.chart3.initDone = true
      this.chart4.initDone = true
      this.chart5.initDone = true
      this.chart6.initDone = true
      this.chart7.initDone = true

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