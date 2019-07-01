<template>
  <div class="plan-box" v-if="loadding">
    <Header @done="uplist" v-model="headerValue" />
    <h3 v-if="status != 1" class="plan-title">投放方案</h3>
    <div v-if="status != 1" class="plan-result">
      <div class="result-top">
        <h3>效果预估</h3>
        <span>以下为预估效果，仅供参考；实际效果以全网最终上报专资数据为准，最终支出费用超出【
          <span v-if="item.needPayAmount">
            {{formatNums(item.needPayAmount)}}
          </span>
          <span v-else>
            {{formatNums(item.estimateCostAmount)}}
          </span>
          】时，您无需补缴任何款项</span>
      </div>
      <Row class="precept" :gutter="16">
        <Col span="5" class="item">
          <div>
            <p class="title">曝光人次预估</p>
            <p v-if="item.estimatePersonCount && (item.estimatePersonCount + '').length > 4" class="number">
              <Number :addNum="!item.estimatePersonCount ? 0 : item.estimatePersonCount / 10000" />
            </p>
            <p class="onenumber" v-else>
              <Number :flag="2"  :addNum="item.estimatePersonCount" />
            </p>
          </div>
        </Col>
        <Col span="5" class="item">
          <div>
            <p class="title">投放场次数预估</p>
            <p v-if="item.estimateShowCount && (item.estimateShowCount + '').length > 4" class="number">
              <Number :addNum="!item.estimateShowCount ? 0 : item.estimateShowCount / 10000" />
            </p>
            <p class="onenumber" v-else>
              <Number :flag="2"  :addNum="item.estimateShowCount" />
            </p>
          </div>
        </Col>
        <Col span="5" class="item">
          <div>
            <p class="title">预估花费</p>
            <p v-if="item.estimateCostAmount && (item.estimateCostAmount + '').length > 4" class="number">
              <Number :addNum="!item.estimateCostAmount ? 0 : item.estimateCostAmount / 10000" />
            </p>
            <p class="onenumber" v-else>
              <Number :flag="2"  :addNum="item.estimateCostAmount" />
            </p>
          </div>
        </Col>
      </Row>
    </div>

    <div v-if="planMovies && planMovies.length > 0" class="plan-cinema">
      <div class="result-top">
        <h3>投放影片{{planMovies.length}}部</h3>
        <span>效果不足时允许系统投放更多影片确保曝光效果</span>
      </div>
      <ul class="film-list" :class="[ !arrowloding ? 'film-max' : '']" v-if="planMovies.length > 0">
        <li @click="filmdetail(it.movieId)" v-for="(it) in planMovies" :key="it.id"
          :class="['film-item']">
          <div class="film-top">
            <img :src="it.image" class="film-cover">
            <div style="position: relative">
              <p class="film-title" style="margin-bottom: 20px" :title="it.movieName">{{it.movieName}}</p>
              <p style="margin-bottom: 6px"><span>上映时间：</span>{{formatDate(it.publishStartDate)}}</p>
              <p style="margin-bottom: 6px"><span>影片类型：</span>{{movieMap(it.movieType)}}</p>
              <p style="margin-bottom: 6px"><span>想看人数：</span>{{formatNums(it.wantSeeNum, 2)}}</p>
              <i-circle trail-color="#fff" stroke-color="#DA6C70" class="circle-per" :size="73" :percent="Number(it.matchPercent)">
                <p class="demo-Circle-inner" style="font-size:14px;height:16px;margin-top: 4px; color:#DA6C70">匹配度</p>
                <p class="demo-Circle-inner" style="font-size:16px;color:#DA6C70">{{it.matchPercent}}%</p>
              </i-circle>
            </div>
          </div>

          <div class="film-center">
            <p style="opacity: .7">受众性别</p>
            <p style="margin-left: 20px" v-if="it.sexCodes == 'man'">男性</p>
            <p style="margin-left: 20px" v-else-if="it.sexCodes == 'woman'">女性</p>
            <p  style="margin-left: 20px" v-else>-</p>
            <!-- <div class="file-sex-box">
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
            </div> -->
          </div>

          <div class="film-buttom">
            <dl style="margin-bottom: 15px">
              <dd>受众年龄：</dd>
              <dt v-if="it.ages && it.ages.length > 0">
                <span v-for="(item, index) in it.ages" :key="index">{{ageTypeMap(item.key)}} {{item.text}}%
                  <span v-if="it.ageCodes.length > 0 && index != it.ageCodes.length - 1" style="margin: 0px 4px">/  </span>
                </span>
              </dt>
              <dt v-else>-</dt>
            </dl>
            <dl>
              <dd>投放周期：</dd>
              <dt>{{formatDate(it.beginDate)}} 至 {{formatDate(it.endDate)}}</dt>
            </dl>
          </div>
        </li>
      </ul>
      <div class="arrow-box">
        <Checkbox :disabled="false" v-if="item.allowAutoDelivery" v-model="item.allowAutoDelivery">效果不足时允许系统投放更多影片确保曝光效果</Checkbox>
        <div @click="arrowloding = true" v-if="arrowshow && !arrowloding" class="arrow">展开<Icon type="ios-arrow-forward" ></Icon></div>
        <div @click="arrowloding = false" v-if="arrowshow && arrowloding" class="arrow">收起<Icon type="ios-arrow-up" /></div>
      </div>
    </div>

    <div v-if="status != 1" class="plan-cinema-num">
      <div class="result-top">
        <h3>覆盖范围</h3>
        <span class="custom" @click="exportData">导出影院</span>
      </div>
      <div class="cinema-box">
        <div class="cinema-right">
          <div>
            <dl @click="tages(1)" :class="tag=='1' ? 'dl-active' : ''">
              <dd>{{count.cinemaCount}}</dd>
              <dt>覆盖影院</dt>
            </dl>
            <dl @click="tages(2)" :class="tag=='2' ? 'dl-active' : ''">
              <dd>{{count.chainCount}}</dd>
              <dt>覆盖院线</dt>
            </dl>
            <dl @click="tages(3)" :class="tag=='3' ? 'dl-active' : ''">
              <dd>{{count.cityCount}}</dd>
              <dt>覆盖城市</dt>
            </dl>
            <dl @click="tages(4)" :class="tag=='4' ? 'dl-active' : ''">
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
              <Input @on-enter="seach" v-model="name" placeholder="影院名称" style="width: 275px">
                  <Icon type="ios-search" @click="seach" slot="suffix" />
              </Input>
            </div>
            <div class="cineme-input" v-if="tag == 2">
              <Input @on-enter="seach" v-model="name" placeholder="院线名称" style="width: 275px">
                  <Icon type="ios-search" @click="seach" slot="suffix" />
              </Input>
            </div>
            <div class="cineme-input" v-if="tag == 3">
              <Input @on-enter="seach" v-model="name" placeholder="城市名称" style="width: 275px">
                  <Icon type="ios-search" @click="seach" slot="suffix" />
              </Input>
            </div>
            <div class="cineme-input" v-if="tag == 4">
              <Input @on-enter="seach" v-model="name" placeholder="省份名称" style="width: 275px">
                  <Icon type="ios-search" @click="seach" slot="suffix" />
              </Input>
            </div>
            <Table height="320" :loading="loading"  stripe :columns="columns" :data="tableDate">
              <template v-if="tag == 1" slot-scope="{ row }" slot="citys">
                {{row.provinceName}} {{row.cityName}} {{row.countyName}}
              </template>

              <template slot-scope="{ row }" slot="estimateShowCount">
                {{formatNums(row.estimateShowCount, 1)}}
              </template>

              <template slot-scope="{ row }" slot="estimatePersonCount">
                {{formatNums(row.estimatePersonCount, 1)}}
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

    <h3 class="plan-title">计划信息
      <span v-if="headerValue.status > 0 && headerValue.status < 3" @click="edit" class="custom">编辑广告计划</span>
    </h3>
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
          <Col :span="22">
            <Row :gutter="16">
              <Col :span="2"><span>覆盖城市</span></Col>
              <Col :span="10">
                <div v-if="headerValue.cityCustom">
                  <span>共{{length}}个
                    <b style="margin-left: 5px">|</b> 
                  </span>
                  <span style="margin-left: 5px" v-for="it in citynums" :key="it.sort">{{it.gradeName}}
                    <b style="margin-left: 5px">|</b> 
                  </span>
                </div>
                <div v-else>
                  <span v-if="headerValue.allNation">全国</span>
                  <p v-else>
                    <span>
                      {{citys(headerValue.deliveryCityTypes)}}
                    </span>
                  </p>
                </div>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col :span="2"><span>受众性别</span></Col>
              <Col :span="6">
                <span>{{sexs(headerValue)}}</span>
              </Col>
              <Col :span="2"><span>受众年龄</span></Col>
              <Col :span="6"><span>{{ages(headerValue)}}</span></Col>
              <Col :span="2"><span>影片类型</span></Col>
              <Col :span="6"><span>{{types(headerValue)}}</span></Col>
            </Row>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="2"><span>影片定向:</span></Col>
          <Col :span="10">
            <span v-if="item.movieCustom == 1">
              自定义影片
            </span>
            <span v-else>
              系统智能匹配
            </span>
          </Col>
        </Row>
      </Row>
    </div>
    <Xlsx v-if="status != 1" ref="down" :id="$route.params.id" />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Number from '@/components/number.vue'
import { orienteering, adverdetail, getcinemas, getchains,
  getcities, getprovinces } from '@/api/popPlan.ts'
import { toMap } from '@/fn/array.ts'
import { uniq } from 'lodash'
import { formatCurrency } from '@/fn/string.ts'
import moment from 'moment'
import Header from './header.vue'
import Exportfile from '../vadver/exportfile.vue'
import Xlsx from '../vadver/downxsxl.vue'

const statusMap =  (list: any[]) => toMap(list, 'code', 'text')
const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    Number,
    Header,
    Exportfile,
    Xlsx
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
  ageTypeList: any = []
  tags: any = []
  deliveryCityTypeList: any = []
  citynums: any = []
  length = 0
  movieTypeList: any = []
  arrowloding = false

  get arrowshow() {
    if (this.planMovies.length > 6) {
      return true
    } else {
      return false
    }
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

  filmdetail(id: any) {
    this.$router.push({
      name: 'film-movie',
      params: {
        id
      }
    })
  }

  created() {
    (this.$Spin as any).show()
    this.init()
    this.seach()
  }

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  formatNums(data: any, id?: any) {
    const datanums = data ? formatCurrency(data) : '0'
    if (id == 1 && datanums != '0') {
      const msg = data ? formatCurrency(data, 0) : '0'
      return msg
    } else if (id == 2 && datanums != '0') {
      const msg1 = data ? formatCurrency(data, 0) : 0
      return msg1 ? msg1 + '人' : '-'
    } else {
      return datanums
    }
  }

  tages(id: any) {
    this.tag = id
    this.name = ''
    this.seach()
  }

  uplist() {
    this.init()
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

  exportData() {
    (this.$refs.down as any).down()
  }

  ageTypeMap(val: any) {
    if (!val) {
      return '-'
    }
    const vals = val || []
    return this.ageTypeList.filter((it: any) => {
      return vals.includes(it.key)
    }).map((it: any) => it.text).join(' | ')
  }

  movieMap(val: any) {
    if (!val) {
      return '-'
    }
    const vals = val ? val.split('|') : []
    return this.movieTypeList.filter((it: any) => {
      return vals.includes(it.key)
    }).map((it: any) => it.text).join(' | ')
  }

  async init() {
    try {
      (this.$Spin as any).hide()
      const { data } = await adverdetail(this.$route.params.id)
      this.headerValue = {
        ...data.item
      }
      this.length = (data.cities || []).length
      const citynums = uniq((data.cities || []).map((it: any) => {
        return {
          gradeName: it.gradeName,
          sort: it.sort
        }
      }))
      this.citynums = citynums.sort((a: any, b: any) => {
        return a.sort - b.sort
      })
      this.ageTypeList = data.ageTypeList
      this.count.cinemaCount = data.cinemaCount
      this.count.chainCount = data.chainCount
      this.count.provinceCount = data.provinceCount
      this.count.cityCount = data.cityCount
      this.statusList = data.statusList || []
      this.item = data.item || {}
      this.tags = data.tags
      this.status = data.item.status
      this.movieTypeList = data.movieTypeList || []
      this.deliveryCityTypeList = data.deliveryCityTypeList
      this.planMovies = (data.planMovies || []).map((it: any) => {
        const names = (it.ageCodes || []).map((items: any, ins: number) => {
          return {
            key: items,
            text: (it.ageValues) ? it.ageValues[ins] : '-'
          }
        })
        return {
          ...it,
          ages: names
        }
      })
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    }
    this.loadding = true
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.pageSize = val
    this.seach()
  }

  citys(val: any) {
    if (val) {
      const message = val.map((it: any) => {
        const msg = this.deliveryCityTypeList.filter((item: any) => it == item.key)[0].text
        return msg
      })
      return message.join(' / ')
    }
    return '不限'
  }

  sexs(val: any) {
    const msg = (this.item.deliveryGroups || []).filter((item: any) => item.tagTypeCode == 'PLAN_GROUP_SEX')
    if (msg.length > 0) {
      const message = msg.map((it: any) => {
        const value = this.tags[2].values.filter((item: any) => it.text == item.key)[0].text
        return value
      })
      return message.join(' / ')
    } else {
      return '不限'
    }
  }

  ages(val: any) {
    const msg = (this.item.deliveryGroups || []).filter((item: any) => item.tagTypeCode == 'PLAN_GROUP_AGE')

    if (msg.length > 0) {
        const message = msg.map((it: any) => {
        const value = this.tags[1].values.filter((item: any) => it.text == item.key)[0].text
        return value
      })
      return message.join(' / ')
    } else {
      return '不限'
    }
  }

  types(val: any) {
    const msg = (this.item.deliveryGroups || []).filter((item: any) => item.tagTypeCode == 'MOVIE_TYPE')
    if (msg.length > 0) {
      const message = msg.map((it: any) => {
        const value = this.tags[0].values.filter((item: any) => it.text == item.key)[0].text
        return value
      })
      return message.join(' / ')
    } else {
      return '不限'
    }
  }

  async cinemfind() {
    try {
      const { data } = await getcinemas(this.$route.params.id, {
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
      const { data } = await getprovinces(this.$route.params.id, {
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
      const { data } = await getcities(this.$route.params.id, {
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
      const { data } = await getchains(this.$route.params.id, {
        name: this.name
      })
      this.tableDate = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  edit() {
    this.$router.push({
      name: 'pop-planlist-edit',
      params: {id: '0', setid: this.headerValue.id}
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './index.less';
</style>