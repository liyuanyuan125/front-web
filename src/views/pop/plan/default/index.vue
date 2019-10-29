<template>
  <div class="plan-box" v-if="loadding">
    <Header @done="uplist" v-model="headerValue" />
    <h3 v-if="status != 1" class="plan-title">投放方案</h3>
    <div v-if="status != 1" class="plan-result">
      <div class="result-top">
        <h3>效果预估</h3>
        <span>以下为预估效果，仅供参考；实际效果以全网最终上报专资数据为准。
          <!-- 最终支出费用超出【
          <span v-if="item.needPayAmount || item.needPayAmount == 0 ">
            {{formatNums(item.needPayAmount)}}
          </span>
          <span v-else>
            {{formatNums(item.estimateCostAmount)}}
          </span>
          】时，您无需补缴任何款项 -->
        </span>
      </div>
      <Row class="precept" :gutter="16">
        <Col span="8" class="item">
          <div>
            <p class="title">曝光人次预估</p>
            <p v-if="item.estimatePersonCount && (item.estimatePersonCount + '').length > 4" class="number">
              <Number :addNum="!item.estimatePersonCount ? 0 : item.estimatePersonCount / 10000 * 7" /> ~ 
              <Number :addNum="!item.estimatePersonCount ? 0 : item.estimatePersonCount / 10000 * 13" />
            </p>
            <p class="onenumber" v-else>
              <Number :flag="2"  :addNum="Math.floor(item.estimatePersonCount * 7 / 10)" /> ~ 
              <Number :flag="2"  :addNum="Math.floor(item.estimatePersonCount * 13 / 10)" />
            </p>
          </div>
        </Col>
        <Col span="8" class="item">
          <div>
            <p class="title">投放场次数预估</p>
            <p v-if="item.estimateShowCount && (item.estimateShowCount + '').length > 4" class="number">
              <Number :addNum="!item.estimateShowCount ? 0 : item.estimateShowCount / 10000 * 7" /> ~
              <Number :addNum="!item.estimateShowCount ? 0 : item.estimateShowCount / 10000 * 13" />
            </p>
            <p class="onenumber" v-else>
              <Number :flag="2"  :addNum="Math.floor(item.estimateShowCount * 7 / 10)" /> ~ 
              <Number :flag="2"  :addNum="Math.floor(item.estimateShowCount * 13 / 10)" />
            </p>
          </div>
        </Col>
        <Col span="8" class="item">
          <div>
            <p class="title">预估花费</p>
            <p v-if="item.estimateCostAmount && (item.estimateCostAmount + '').length > 4" class="number">
              <Number :addNum="!item.estimateCostAmount ? 0 : item.estimateCostAmount / 10000" />
              <!-- <Number :addNum="!item.estimateCostAmount ? 0 : item.estimateCostAmount / 100000 * 13" /> -->
            </p>
            <p class="onenumber" v-else>
              <Number :flag="2"  :addNum="item.estimateCostAmount" />
              <!-- <Number :flag="2"  :addNum="item.estimateCostAmount * 13 / 10" />  -->
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
        <li @click="filmdetail(it.movieId)" v-for="(it) in planMovies" :key="it.movieId"
          :class="['film-item']">
          <div class="film-top">
            <img :onerror="defaultImg" :src="it.image ? it.image : defaultImg" class="film-cover">
            <div style="position: relative">
              <p class="film-title" style="margin-bottom: 20px" :title="it.movieName">{{it.movieName}}</p>
              <p style="margin-bottom: 6px"><span>上映时间：</span>{{formatDate(it.publishStartDate)}}</p>
              <p style="margin-bottom: 6px"><span>影片类型：</span>{{movieMap(it.movieType)}}</p>
              <p style="margin-bottom: 6px"><span>想看人数：</span>{{formatNums(it.wantSeeNum, 2)}}</p>
              <i-circle v-if='movieCustom == 1 || (item.deliveryGroups || []).length > 0'
                trail-color="#fff" stroke-color="#DA6C70" class="circle-per" :size="73" :percent="Number(it.matchPercent)">
                <p class="demo-Circle-inner" style="font-size:14px;height:16px;margin-top: 4px; color:#DA6C70">匹配度</p>
                <p class="demo-Circle-inner" style="font-size:16px;color:#DA6C70">{{it.matchPercent}}%</p>
              </i-circle>
            </div>
          </div>

          <div class="film-center">
            <p style="opacity: .7">受众性别</p>
            <div v-if="it.genders && it.genders.length > 0">
              <div style="margin-left: 20px" :key="index" v-for="(item, index) in it.genders">
                <p style="margin-bottom: 10px" v-if="item.k == 'F'">女<span class="ageitem-box"
                :style="{width: 60 + (item.rate/100) + 'px'}">{{item.rate/100}}%</span></p>
                <p style="margin-bottom: 10px" v-else>男<span class="ageitem-box"
                :style="{width: 60 + (item.rate/100) + 'px'}">{{item.rate/100}}%</span></p>
              </div>
            </div>
            <div v-else>-</div>
          </div>

          <div class="film-buttom">
            <dl style="margin-bottom: 15px">
              <dd>受众年龄：</dd>
              <dt v-if="it.ages && it.ages.length > 0">
                <p :style="index != (it.ages.length -1) ? 'margin-bottom: 15px' : ''"
                   v-for="(item, index) in it.ages" :key="index">{{ageTypeMap(item.key)}}
                  <span class="ageitem-box"
                  :style="{width: 60 + (item.text/1) + 'px'}">{{item.text}}%</span>
                </p>
              </dt>
              <dt style="margin-left: 20px; margin-top: 10px" v-else>-</dt>
            </dl>
            <dl>
              <dd>投放排期：</dd>
              <dt>
                <p v-if="it.status > 9">
                  <span>{{formatDate(it.beginDate)}}</span>至
                  <span>{{formatDate(it.endDate)}}</span>
                </p>
                <p v-else>
                  <span>开始于{{formatDate(it.beginDate)}}</span>
                </p>
              </dt>
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

    <div v-if="item.recommend" class="plan-cinema-num">
      <div class="result-top">
        <h3>覆盖范围</h3>
        <span class="custom" @click="exportData">导出影院</span>
        <Xlsx  ref="down" :id="$route.params.id" />
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
                {{formatNums(row.estimateShowCount * 7 / 10, 1)}} ~ 
                {{formatNums(row.estimateShowCount * 13 / 10, 1)}}
              </template>

              <template slot-scope="{ row }" slot="estimatePersonCount">
                {{formatNums(row.estimatePersonCount * 7 / 10, 1)}} ~ 
                {{formatNums(row.estimatePersonCount * 13 / 10, 1)}}
              </template>

              <template slot-scope="{ row }" slot="cpm">
                {{formatNums(row.cpm)}}
              </template>
              <!-- <template slot-scope="{ row }" slot="estimateShowCount">
                {{formatNums(row.estimateShowCount, 1)}}
              </template>

              <template slot-scope="{ row }" slot="estimatePersonCount">
                {{formatNums(row.estimatePersonCount, 1)}}
              </template> -->
            </Table>

            <pagination :pageList="pageList" :total="total" @uplist="uplists"></pagination>
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
          <Col :span="10"><span>{{item.videoName || '暂无'}}</span></Col>
        </Row>
        <Row :gutter="16">
          <Col :span="2"><span>投放周期:</span></Col>
          <Col :span="10"><span>{{formatDate(item.beginDate)}} 至 {{formatDate(item.endDate)}}</span></Col>
          <Col :span="2" v-if="item.advertTypeCode == 'TRAILER'"><span>客户:</span></Col>
          <Col :span="10" v-if="item.advertTypeCode == 'TRAILER'"><span>{{item.customerName}}</span></Col>
          <Col :span="2" v-if="item.advertTypeCode != 'TRAILER'"><span>影片:</span></Col>
          <Col :span="10" v-if="item.advertTypeCode != 'TRAILER'"><span>{{item.customerName}}</span></Col>
        </Row>
        <Row :gutter="16">
          <Col :span="2"><span>预算:</span></Col>
          <Col :span="10">
            <span style="color: #DA6C70">￥{{formatNums(item.budgetAmount * 7 / 10)}}</span>
            <!-- <span style="color: #DA6C70">￥{{formatNums(item.budgetAmount * 13 / 10)}}</span> -->
          </Col>
          <Col :span="2"><span>广告位置:</span></Col>
          <Col :span="10">
            <span>{{location}}</span>
            <!-- <span style="color: #DA6C70">￥{{formatNums(item.budgetAmount * 13 / 10)}}</span> -->
          </Col>
        </Row>
        <Row :gutter="8" style="height: 126px">
          <Col :span="2"><span>定向设置:</span></Col>
          <Col :span="20">
            <Row :gutter="10" v-if="headerValue.cityCustom">
              <Col :span="2"><span>覆盖城市</span></Col>
              <Col :span="18">
                <div>
                  <span>共{{length}}个
                    <!-- <b style="margin-left: 5px">|</b>  -->
                  </span>
                  <!-- <span style="margin-left: 5px" v-for="it in citynums" :key="it.sort">{{it.gradeName}}
                    <b style="margin-left: 5px">|</b> 
                  </span> -->
                </div>
              </Col>
            </Row>
            <Row  :gutter="10" v-else>
              <Col :span="2"><span>覆盖影院</span></Col>
              <Col :span="10">
                <div>
                  <span>共{{headerValue.cinemaCount}}个
                    <b style="margin-left: 5px"></b> 
                  </span>
                  <a v-if='headerValue.cinemaCount && headerValue.cinemaCount > 0'
                     style='font-size: 18px' :href='herf' download='影院数据' >影院数据</a>
                </div>
              </Col>
            </Row>
            <Row :gutter="10">
              <Col :span="2"><span>受众性别</span></Col>
              <Col :span="6">
                <span>{{sexs(headerValue)}}</span>
              </Col>
              <Col :span="2"><span>受众年龄</span></Col>
              <Col :span="6"><span>{{ages(headerValue)}}</span></Col>
              <Col  v-if="item.movieCustom != 1" :span="2"><span>影片类型</span></Col>
              <Col v-if="item.movieCustom != 1" :span="4"><span>{{types(headerValue)}}</span></Col>
            </Row>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col :span="2"><span>影片定向:</span></Col>
          <Col :span="9">
            <span v-if="item.movieCustom == 1">
              自定义影片
            </span>
            <span v-else>
              类型定向
            </span>
          </Col>
        </Row>
      </Row>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Number from '@/components/number.vue'
import { orienteering, adverdetail, getcinemas, getchains,
  getcities, getprovinces } from '@/api/popPlan.ts'
import { toMap } from '@/fn/array.ts'
import { uniq, uniqBy } from 'lodash'
import { formatCurrency } from '@/fn/string.ts'
import moment from 'moment'
import Header from './header.vue'
import Exportfile from '../vadver/exportfile.vue'
import Xlsx from '../vadver/downxsxl.vue'
import pagination from '@/components/page.vue'

// 样式修改
const codeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    Number,
    Header,
    Exportfile,
    Xlsx,
    pagination
  }
})
export default class Apps extends ViewBase {
  filmList: any = []
  tag = 1
  pageIndex = 1
  pageSize = 6
  total = 0
  movieCustom = 0
  tableDate: any = []
  loading = false
  loadding = false
  item: any = {}
  statusList: any = []
  headerValue: any = {}
  planMovies: any = []
  status = 0
  name = ''
  location = ''
  deliveryPositionList: any = []
  count: any = {
    cinemaCount: '',
    chainCount: '',
    provinceCount: '',
    cityCount: ''
  }

  pageList = {
    pageIndex: 1,
    pageSize: 5
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

  get downsrc() {
    return `/xadvert/plans/${this.$route.params.id}/export-cinemas`
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
    const specification = this.item.specification || 0
    if (this.tag == 1) {
      return [
        ...one,
        {
          title: '所属院线',
          key: 'chainName',
          align: 'center'
        },
        ...four,
        {
          title: `${specification}s 刊例价（元/千人次）`,
          width: 136,
          key: 'cpm',
          align: 'center',
          slot: 'cpm'
        },
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

  get defaultImg() {
    return 'this.src="' + require('../assets/error.png') + '"'
  }

  uplists(size: any) {
    this.pageList.pageIndex = size
    this.seach()
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
    this.pageList.pageIndex = 1
    this.pageList.pageSize = 5
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

  get herf() {
    return `${VAR.ajaxBaseUrl}/xadvert/plans/${this.$route.params.id}/export-cinemas`
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
      this.deliveryPositionList = codeMap(data.deliveryPositionList)
      this.location = this.deliveryPositionList[data.item.deliveryPositionCode]
      const citylength = ['票仓城市Top10', '一线城市', '二线城市', '三线城市', '四线城市', '五线城市']
      const citynums = uniqBy((data.cities || []), 'gradeName').map((it: any) => {
        const index = citylength.findIndex((item: any) => item == it.grade)
        return {
          gradeName: it.gradeName,
          sort: index
        }
      })
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
      this.movieCustom = data.item.movieCustom
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
          ages: (names || []).slice(0, 2),
        }
      })
      if (this.planMovies.length > 0) {
        // this.planMovies = this.planMovies.sort((a: any, b: any) => b.wantSeeNum - a.wantSeeNum ).slice(0, 3)
        this.planMovies = this.planMovies.slice(0, 3)
      }
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    }
    this.loadding = true
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.pageList.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.pageList.pageSize = val
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
          const maps = it.text.split(';')
          const value = this.tags[1].values.filter((item: any) => maps.includes(item.key))
          return value.map((its: any) => its.text).join('/')
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
        const maps = it.text.split(';')
        const value = this.tags[0].values.filter((item: any) => maps.includes(item.key))
        return value.map((its: any) => its.text).join('/')
      })
      return message.join(' / ')
    } else {
      return '不限'
    }
  }

  async cinemfind() {
    try {
      const { data } = await getcinemas(this.$route.params.id, {
        name: this.name,
        pageIndex: this.pageList.pageIndex,
        pageSize: this.pageList.pageSize
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
        name: this.name,
        pageIndex: this.pageList.pageIndex,
        pageSize: this.pageList.pageSize
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
        name: this.name,
        pageIndex: this.pageList.pageIndex,
        pageSize: this.pageList.pageSize
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
        name: this.name,
        pageIndex: this.pageList.pageIndex,
        pageSize: this.pageList.pageSize
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
      params: {step: '0', setid: this.headerValue.id}
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './index.less';
/deep/ .page-list {
  padding: 0;
  .ivu-page-prev a, .ivu-page-total, .ivu-page-next a {
    color: #00202d;
  }
  .ivu-page-item {
    a {
      color: #00202d;
    }
  }
  .ivu-page-item.ivu-page-item-active {
    background: #00202d;
    a {
      color: #fff;
    }
  }
}
/deep/ .ivu-col-span-10 span:empty::before {
  content: '暂无数据';
  font-size: 16px;
}
</style>