<template>
  <div>
    <Row>
      <Col span="24">
      <Form label-position="left" :label-width="100">
        <Card class="detailmore-card">
          <div slot="title">
            <Row type="flex" justify="space-between" align="middle">
              <Col :span='12' style="color: #fff">
              平台
              <Select v-model="pageQuery.channelCode" placeholder="平台" filterable style="max-width:150px; margin-right:10px;" class="selectedBox" @on-change="channelChange">
                <Option v-for="(option, index) in channelList" :value="option.key" :key="index">{{option.text}}</Option>
              </Select>
              </Col>
              <Col :span="12" style="text-align:right; color: #fff">
              <!-- <Select
                    placeholder="可选品牌"
                    filterable
                    remote
                    clearable
                    :remote-method="remoteBrands"
                    :loading="brandsLoading"
                    style="max-width:150px; margin-right:10px;"
                    class="selectedBox"
                  >
                    <Option
                      v-for="(option, index) in channelList"
                      :value="option.key"
                      :key="index"
                    >{{option.text}}</Option>
                  </Select> -->
              <!-- <router-link :to="{path: '/figure/detailMoreInfo/matching/'+pageQuery.brandId}"><Button :disabled="pageQuery.brandId === ''"
                        size="small"
                  type="primary">查看匹配度</Button></router-link>-->
              </Col>
            </Row>
          </div>
          <div class="content">
            <Row type="flex" justify="space-between">
              <Col :span="12">
              <div class="chart-wp" style="margin-right:10px">
                <Pie :initDone="chart1.initDone" :title="chart1.title" :dict1="chart1.dict1" :dict2="chart1.dict2" :color="chart1.color" :dataList="chart1.dataList" :toolTip="tooltipStyles({trigger:  'item', formatter:'{b} {c} %'})" :currentTypeIndex="chart1.currentTypeIndex" />
              </div>
              </Col>
              <Col :span="12">
              <div class="chart-wp">
                <BarXCategory :initDone="chart2.initDone" :title="chart2.title" :dict1="chart2.dict1" :dict3="chart2.dict3" :color="chart2.color" :dataList="chart2.dataList" :currentTypeIndex="chart2.currentTypeIndex" />
              </div>
              </Col>
            </Row>
            <Row type="flex" justify="space-between" style="margin-top:10px">
              <Col :span="12">
              <div class="chart-wp borderRadius" style="margin-right:10px; height:460px">
                <MapChina :initDone="chart3.initDone" :title="chart3.title" :dict1="chart3.dict1" :dict2="chart3.dict2" :color="chart3.color" :max="chart3.max" :dataList="chart3.dataList" :currentTypeIndex="chart3.currentTypeIndex" />
              </div>
              </Col>
              <Col :span="12">
              <div class="chart-wp" style="height:460px">
                <BarYCategory :initDone="chart4.initDone" :title="chart4.title" :dict1="chart4.dict1" :dict2="chart4.dict2" :color="chart4.color" :dataList="chart4.dataList" :currentTypeIndex="chart4.currentTypeIndex" @typeChange="typeChangeHander4" />
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
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fanslist, brands } from '@/api/kolfans'
import DetailNavBar from './components/detailNavBar.vue'
import BarXCategory from '@/components/chartsGroup/barXCategory/'
import MapChina from '@/components/chartsGroup/mapChina/'
import Pie from '@/components/chartsGroup/pieSimple/'
import BarYCategory from '@/components/chartsGroup/barYCategory/'
import { toMap } from '@/fn/array'
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
export default class Fans extends ViewBase {
  @Prop({ type: String, default: 'weibo' }) channel!: string

  tooltipStyles = tooltipStyles

  form: any = {}

  pageQuery: any = {
    channelCode: this.channel
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
    noData: false,
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
    color: ['#ff9933', '#169bd5']
  }

  brandsLoading = false

  brands = []

  channelList: any = []

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

    const id: string = this.$route.params.id || ''
    try {
      const { data } = await fanslist(id, {
        channelCode: this.pageQuery.channelCode
      })

      this.channelList = data.channelList ? data.channelList : []

      // 检查 channel 是否在 navList 中，若不在，就强制跳转到第一个 nav
      const navItem = data.channelList.find((it: any) => it.key == this.pageQuery.channelCode)
      if (navItem == null && data.channelList.length > 0) {
        const firstNav = data.channelList[0]
        this.$router.push({
          name: 'kol-detail-fans',
          params: { id: this.$route.params.id as any, channel: firstNav.key }
        })
        return
      }

      const item = data.item || null
      if (!item) {
        this.chart1.initDone = true
        this.chart2.initDone = true
        this.chart3.initDone = true
        this.chart4.initDone = true
        return
      }
      const ages = item.ages || null
      const cities = item.cities || null
      const provinces = item.provinces || null
      const fans = item.fans || null

      if (fans && fans.length > 0) {
        this.chart1.dataList[this.chart1.currentTypeIndex] = fans.map((it: any) => {
          return {
            name: it.k == 'male' ? '男' : '女',
            value: it.r / 100,
            itemStyle: {
              color: it.k == 'male' ? '#00B6CC' : '#DA6C70'
            }
          }
        })
        // [
        //   {name: '男', value: malePercent},
        //   {name: '女', value: femalePercent},
        // ]
      }

      if (ages && ages.length > 0) {
        this.chart2.dataList[this.chart2.currentTypeIndex] = {
          type: 'bar',
          barMaxWidth: '20',
          data: []
        }
        ages.forEach(({ r, k }: any) => {
          this.chart2.dict3.push({
            text: k
          })
          this.chart2.dataList[this.chart2.currentTypeIndex].data.push(r / 100)
        })
      }

      const provinceList = ((provinces as any[]) || []).sort((a, b) => a.rate - b.rate)
      const cityList = ((cities as any[]) || []).sort((a, b) => a.rate - b.rate)

      let [min, max] = [0, 0]
      const provinceData = provinceList.map(({ rate, name }) => {
        rate = parseFloat(rate) / 100
        max = max < rate ? rate : max
        min = min > rate ? rate : min

        if (name.indexOf('省') !== -1) {
          name = name.substr(0, name.length - 1)
        } else if (name.indexOf('市') !== -1) {
          name = name.substr(0, name.length - 1)
        } else {
          name = name
        }
        return {
          name,
          value: rate
        }
      })
      const cityData = cityList.map(({ rate, name }) => {
        return {
          name,
          value: typeof rate === 'number' ? rate / 100 : parseFloat(rate) / 100
        }
      })

      this.chart3.min = min
      this.chart3.max = max
      this.chart3.dataList[this.chart3.currentTypeIndex] = provinceData

      this.chart4.dataList[0] = provinceData.slice(-10)
      this.chart4.dataList[1] = cityData.slice(-10)

      this.chart1.initDone = true
      this.chart2.initDone = true
      this.chart3.initDone = true
      this.chart4.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 可选品牌搜索
  async remoteBrands(query: string) {
    if (query !== '') {
      this.brandsLoading = true
      const mockObj = {
        name: query,
        pageIndex: 1,
        pageSize: 100
      }
      try {
        const { data } = await brands({ ...mockObj })
        const items = data.items || null

        if (items && items.length > 0) {
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
          this.initHandler()
        }
      } catch (ex) {
        this.handleError(ex)
      }
    } else {
      this.brands = []
    }
  }

  created() {
    this.initHandler()
  }

  async initHandler() {
    this.resetData()
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
    this.chart1.dataList = []
    this.chart2.dataList = []
    this.chart2.dict3 = []
    this.chart3.dataList = []
    this.chart4.dataList = []
    this.chart1.initDone = false
    this.chart2.initDone = false
    this.chart3.initDone = false
    this.chart4.initDone = false
  }

  channelChange() {
    this.initHandler()
  }

  @Watch('$route', {deep: true})
  watch$router(val: any) {
    this.pageQuery = {
      channelCode: val.params.channel
    }
    this.initHandler()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>
