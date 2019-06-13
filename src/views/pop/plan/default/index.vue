<template>
  <div class="plan-box" v-if="loadding">
    <Header v-model="headerValue" />
    <h3 v-if="status != 1" class="plan-title">投放方案</h3>
    <div v-if="status != 1" class="plan-result">
      <div class="result-top">
        <h3>效果预估</h3>
        <span>以下为预估效果，仅供参考；实际效果以全网最终上报专资数据为准，最终支出费用超出【500,000.00】时，您无需补缴任何款项</span>
      </div>
      <Row class="precept" :gutter="16">
        <Col span="5" class="item">
          <div>
            <p class="title">曝光人次预估</p>
            <p class="number">
              <Number :addNum="item.estimatePersonCount" />
            </p>
          </div>
        </Col>
        <Col span="5" class="item">
          <div>
            <p class="title">投放场次数预估</p>
            <p class="number">
              <Number :addNum="item.estimateShowCount" />
            </p>
          </div>
        </Col>
        <Col span="5" class="item">
          <div>
            <p class="title">预估花费</p>
            <p class="number">
              <Number :addNum="!item.estimateCostAmount ? 0 : item.estimateCostAmount" />
            </p>
          </div>
        </Col>
      </Row>
    </div>
    <!-- <div v-if="planMovies.length > 0" class="plan-cinema">
      <div class="result-top">
        <h3>投放影片{{planMovies.length}}部</h3>
        <span>效果不足时允许系统投放更多影片确保曝光效果</span>
      </div>
      <ul class="film-list" v-if="planMovies.length > 0">
        <li v-for="(it) in planMovies" :key="it.id"
          :class="['film-item']">
          <div class="film-top">
            <img :src="it.image" class="film-cover">
            <div style="position: relative">
              <p class="film-title" :title="it.movieName">{{it.movieName}}</p>
              <p class="film-title" style="margin-bottom: 20px">{{it.movieName}}</p>
              <p><span>上映时间：</span>{{formatDate(it.publishStartDate)}}</p>
              <p><span>影片类型：</span>{{it.movieType}}</p>
              <p><span>想看人数：</span>{{it.wantSeeNum}}</p>
              <i-circle trail-color="#fff" stroke-color="#DA6C70" class="circle-per" :size="73" :percent="it.matchPercent">
                <p class="demo-Circle-inner" style="font-size:14px;height:16px;margin-top: 4px; color:#DA6C70">匹配度</p>
                <p class="demo-Circle-inner" style="font-size:22px;color:#DA6C70">{{it.matchPercent}}%</p>
              </i-circle>
            </div>
          </div>

          <div class="film-center">
            <p style="opacity: .7">受众性别</p>
            <div class="file-sex-box">
              <div>
                <div class="file-sex-man" :style="{width: `${it.matching * 0.7 + 20}px`, height: `${it.matching * 0.8 + 30}px`}">
                  <img width="30px" height="30" src="../vadver/assets/man.png" alt="">
                </div>
              </div>
              <span style="color: #57B4C9">男性：{{it.matching}}%</span>
            </div>
            <div class="file-sex-box">
              <div>
                <div class="file-sex-woman" :style="{width: `${it.matching * 0.7 + 20}px`, height: `${it.matching * 0.8 + 30}px`}">
                  <img width="30px" height="30" src="../vadver/assets/woman.png" alt="">
                </div>
              </div>
              <span style="color: #CA7273">女性：{{it.matching}}%</span>
            </div>
          </div>

          <div class="film-buttom">
            <dl style="margin-bottom: 15px">
              <dd>受众年龄：</dd>
              <dt>{{it.matching}}%</dt>
            </dl>
            <dl>
              <dd>投放周期：</dd>
              <dt>{{it.beginDate}}</dt>
            </dl>
          </div>
        </li>
      </ul>
    </div> -->

    <div class="plan-cinema-num">
      <div class="result-top">
        <h3>覆盖范围</h3>
        <span class="custom">下载列表</span>
      </div>
      <div class="cinema-box">
        <div class="cinema-right">
          <div>
            <dl @click="tags(1)" :class="tag=='1' ? 'dl-active' : ''">
              <dd>{{count.cinemaCount}}</dd>
              <dt>覆盖影院</dt>
            </dl>
            <dl @click="tags(2)" :class="tag=='2' ? 'dl-active' : ''">
              <dd>{{count.chainCount}}</dd>
              <dt>覆盖影线</dt>
            </dl>
            <dl @click="tags(3)" :class="tag=='3' ? 'dl-active' : ''">
              <dd>{{count.cityCount}}</dd>
              <dt>覆盖城市</dt>
            </dl>
            <dl @click="tags(4)" :class="tag=='4' ? 'dl-active' : ''">
              <dd>{{count.provinceCount}}</dd>
              <dt>覆盖省份</dt>
            </dl>
          </div>

          <div class="cinema-find">
            <div style="position: relative">
              <div :class="'border-top' + tag"></div>
              <div :class="'border-bottom' + tag"></div>
            </div>
            <div class="cineme-input" v-if="tag == 1">
              <Input v-model="name" placeholder="影院名称" style="width: 275px">
                  <Icon type="ios-search" @click="seach" slot="suffix" />
              </Input>
            </div>
            <div class="cineme-input" v-if="tag == 2">
              <Input v-model="name" placeholder="院线名称" style="width: 275px">
                  <Icon type="ios-search" @click="seach" slot="suffix" />
              </Input>
            </div>
            <div class="cineme-input" v-if="tag == 3">
              <Input v-model="name" placeholder="城市名称" style="width: 275px">
                  <Icon type="ios-search" @click="seach" slot="suffix" />
              </Input>
            </div>
            <div class="cineme-input" v-if="tag == 4">
              <Input v-model="name" placeholder="省份名称" style="width: 275px">
                  <Icon type="ios-search" @click="seach" slot="suffix" />
              </Input>
            </div>
            <Table height="320" :loading="loading"  stripe :columns="columns" :data="tableDate">
              <template v-if="tag == 1" slot-scope="{ row }" slot="citys">
                {{row.provinceName}} {{row.cityName}} {{row.countyName}}
              </template>

              <template slot-scope="{ row }" slot="estimateShowCount">
                {{formatNums(row.estimateShowCount)}}
              </template>

              <template slot-scope="{ row }" slot="estimatePersonCount">
                {{formatNums(row.estimatePersonCount)}}
              </template>
            </Table>

            <Page :total="total" v-if="total>0" class="btnCenter"
              :current="pageIndex"
              :page-size="pageSize"
              :page-size-opts="[6, 20, 50, 100]"
              show-total
              show-sizer
              show-elevator
              :transfer = "true"
              @on-change="sizeChangeHandle"
              @on-page-size-change="currentChangeHandle"/>
          </div>
        </div>
      </div>
    </div>

    <h3 class="plan-title">计划信息</h3>
    <div class="plan-msg">
      <Row>
        <Row :gutter="16">
          <Col :span="2"><span>计划名称:</span></Col>
          <Col :span="10"><span>{{item.name}}</span></Col>
          <Col :span="2"><span>广告片:</span></Col>
          <Col :span="10"><span>{{item.videoName}}</span></Col>
        </Row>
        <Row :gutter="16">
          <Col :span="2"><span>投放排期:</span></Col>
          <Col :span="10"><span>{{formatDate(item.beginDate)}} 至 {{formatDate(item.endDate)}}</span></Col>
          <Col :span="2"><span>客户:</span></Col>
          <Col :span="10"><span>{{item.customerName}}</span></Col>
        </Row>
        <Row :gutter="16">
          <Col :span="2"><span>预算:</span></Col>
          <Col :span="22">
            <span style="color: #DA6C70">￥{{formatNums(item.budgetAmount)}}</span>
          </Col>
        </Row>
        <Row :gutter="16" style="height: 126px">
          <Col :span="2"><span>定向设置:</span></Col>
          <Col :span="22"></Col>
        </Row>
        <Row :gutter="16">
          <Col :span="2"><span>影片定向:</span></Col>
          <Col :span="10"></Col>
        </Row>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Number from '@/components/number.vue'
import { orienteering, cinemaFilm, adverdetail, getcinemas, getchains,
  getcities, getprovinces } from '@/api/popPlan.ts'
import { toMap } from '@/fn/array.ts'
import { formatCurrency } from '@/fn/string.ts'
import moment from 'moment'
import Header from './header.vue'

const statusMap =  (list: any[]) => toMap(list, 'code', 'text')
const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    Number,
    Header
  }
})
export default class App extends ViewBase {
  filmList: any = []
  tag = 1
  pageIndex = 1
  pageSize = 6
  total = 0
  tableDate: any = []
  loading = false
  loadding = false
  item: any = {}
  statusList: any = []
  headerValue: any = {}
  planMovies: any = []
  status = 0
  name = ''
  count: any = {
    cinemaCount: '',
    chainCount: '',
    provinceCount: '',
    cityCount: ''
  }

  get columns() {
    const tag = ['影院名称', '影院名称', '城市名称', '省份名称']
    const key = ['cinemaName', 'chainName', 'cityName', 'provinceName' ]
    const one = [{
      title: tag[this.tag - 1],
      key: key[this.tag - 1],
      align: 'center'
    }]
    const two = [
      {
        title: '包含城市',
        slot: 'citys',
        align: 'center'
      }
    ]
    const therr = [
      {
        title: '包含影院',
        key: 'containCinemas',
        align: 'center'
      }
    ]
    const four = [
      {
        title: '所在地',
        slot: 'citys',
        align: 'center'
      }
    ]
    const five = [
      {
        title: '预估投放场次',
        key: 'estimateShowCount',
        slot: 'estimateShowCount',
        align: 'center'
      },
      {
        title: '预估曝光人次',
        key: 'estimatePersonCount',
        slot: 'estimatePersonCount',
        align: 'center'
      }
    ]
    if (this.tag == 1) {
      return [
        ...one,
        {
          title: '所属院线',
          key: 'chainName',
          align: 'center'
        },
        ...four,
        ...five
      ]
    } else if (this.tag == 2 || this.tag == 3) {
      return [
        ...one,
        ...therr,
        ...five
      ]
    } else {
      return [
        ...one,
        {
          title: '包含城市',
          key: 'containCities',
          align: 'center'
        },
        {
          title: '包含影院',
          key: 'containCinemas',
          align: 'center'
        },
        ...five
      ]
    }

  }

  created() {
    (this.$Spin as any).show()
    this.init()
    this.seach()
  }

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  formatNums(data: any) {
    return data ? formatCurrency(data) : '暂无'
  }

  tags(id: any) {
    this.tag = id
    this.name = ''
    this.seach()
  }

  seach() {
    if (this.tag == 1) {
      this.cinemfind()
    } else if (this.tag == 2) {
      this.chainsfind()
    } else if (this.tag == 3) {
      this.cityfind()
    } else {
      this.provienfind()
    }
  }

  async init() {
    try {
      const { data } = await adverdetail(this.$route.params.id)
      this.headerValue = {
        ...data.item
      }
      this.count.cinemaCount = data.cinemaCount
      this.count.chainCount = data.chainCount
      this.count.provinceCount = data.provinceCount
      this.count.cityCount = data.cityCount
      this.statusList = data.statusList || []
      this.item = data.item || {}
      this.status = data.item.status
      this.planMovies = data.planMovies
      (this.$Spin as any).hide()
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    }
    this.loadding = true
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.pageIndex = val
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.pageSize = val
  }

  async cinemfind() {
    try {
      const { data } = await getcinemas(22, {
        name: this.name
      })
      this.tableDate = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async provienfind() {
    try {
      const { data } = await getprovinces(22, {
        name: this.name
      })
      this.tableDate = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async cityfind() {
    try {
      const { data } = await getcities(22, {
        name: this.name
      })
      this.tableDate = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async chainsfind() {
    try {
      const { data } = await getchains(22, {
        name: this.name
      })
      this.tableDate = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './index.less';
</style>