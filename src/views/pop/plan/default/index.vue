<template>
  <div class="plan-box">
    <div v-if="status != 1" class="plan-message">
      <span>当前计划已失效或已关闭，如有疑问，请点击下放"联系商务"</span>
      <Button type="default" class="btn-contact">联系商务</Button>
    </div>
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
              <Number :addNum="1234" />
            </p>
          </div>
        </Col>
        <Col span="5" class="item">
          <div>
            <p class="title">投放场次数预估</p>
            <p class="number">
              <Number :addNum="1234" />
            </p>
          </div>
        </Col>
        <Col span="5" class="item">
          <div>
            <p class="title">预估花费</p>
            <p class="number">
              <Number :addNum="1234" />
            </p>
          </div>
        </Col>
      </Row>
    </div>
    <div v-if="status != 1" class="plan-cinema">
      <div class="result-top">
        <h3>投放影片3部</h3>
        <span>效果不足时允许系统投放更多影片确保曝光效果</span>
      </div>
      <ul class="film-list" v-if="filmList.length > 0">
        <li v-for="(it) in filmList" :key="it.id"
          :class="['film-item']">
          <div class="film-top">
            <img :src="it.mainPicUrl" class="film-cover">
            <div style="position: relative">
              <p class="film-title">{{it.name}}</p>
              <p class="film-title" style="margin-bottom: 20px">{{it.name}}</p>
              <p><span>上映时间：</span>{{formatDate(it.openTime)}}</p>
              <p><span>影片类型：</span>{{it.type.join('/')}}</p>
              <p><span>想看人数：</span>{{it.viewNumber}}</p>
              <i-circle trail-color="#fff" stroke-color="#DA6C70" class="circle-per" :size="73" :percent="80">
                <p class="demo-Circle-inner" style="font-size:14px;height:16px;margin-top: 4px; color:#DA6C70">匹配度</p>
                <p class="demo-Circle-inner" style="font-size:22px;color:#DA6C70">80%</p>
              </i-circle>
            </div>
          </div>

          <div class="film-center">
            <p style="opacity: .7">受众性别</p>
            <div class="file-sex-box">
              <div>
                <div class="file-sex-man" :style="{width: `${it.matching * 0.8 + 30}px`, height: `${it.matching * 0.8 + 30}px`}">
                  <img width="30px" height="30" src="../vadver/assets/man.png" alt="">
                </div>
              </div>
              <span style="color: #57B4C9">男性：{{it.matching}}%</span>
            </div>
            <div class="file-sex-box">
              <div>
                <div class="file-sex-woman" :style="{width: `${it.matching * 0.8 + 30}px`, height: `${it.matching * 0.8 + 30}px`}">
                  <img width="30px" height="30" src="../vadver/assets/man.png" alt="">
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
              <dt>{{it.week}}</dt>
            </dl>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="status != 1" class="plan-cinema-num">
      <div class="result-top">
        <h3>覆盖范围</h3>
        <span class="custom">下载列表</span>
      </div>
      <div class="cinema-box">
        <div class="cinema-right">
          <div>
            <dl @click="tags(1)" :class="tag=='1' ? 'dl-active' : ''">
              <dd>1234</dd>
              <dt>覆盖影院</dt>
            </dl>
            <dl @click="tags(2)" :class="tag=='2' ? 'dl-active' : ''">
              <dd>234</dd>
              <dt>覆盖影线</dt>
            </dl>
            <dl @click="tags(3)" :class="tag=='3' ? 'dl-active' : ''">
              <dd>23</dd>
              <dt>覆盖城市</dt>
            </dl>
            <dl @click="tags(4)" :class="tag=='4' ? 'dl-active' : ''">
              <dd>3</dd>
              <dt>覆盖省份</dt>
            </dl>
          </div>

          <div class="cinema-find">
            <div style="position: relative">
              <div :class="'border-top' + tag"></div>
              <div :class="'border-bottom' + tag"></div>
            </div>
            <div class="cineme-input" v-if="tag == 1">
              <Input placeholder="影院名称" style="width: 275px">
                  <Icon type="ios-search" slot="suffix" />
              </Input>
            </div>
            <div class="cineme-input" v-if="tag == 2">
              <Input placeholder="院线名称" style="width: 275px">
                  <Icon type="ios-search" slot="suffix" />
              </Input>
            </div>
            <div class="cineme-input" v-if="tag == 3">
              <Input placeholder="城市名称" style="width: 275px">
                  <Icon type="ios-search" slot="suffix" />
              </Input>
            </div>
            <div class="cineme-input" v-if="tag == 4">
              <Input placeholder="省份名称" style="width: 275px">
                  <Icon type="ios-search" slot="suffix" />
              </Input>
            </div>
            <Table height="320" :loading="loading"  stripe :columns="columns" :data="tableDate">
              <template slot-scope="{ row }" slot="citys">
                {{row.name}}
              </template>

              <template slot-scope="{ row }" slot="code">
                {{row.start}}
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
            <span>{{formatNums(item.budgetAmount)}}</span>
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
import { orienteering, cinemaFilm, adverdetail } from '@/api/popPlan.ts'
import { toMap } from '@/fn/array.ts'
import { formatCurrency } from '@/fn/string.ts'
import moment from 'moment'

const statusMap =  (list: any[]) => toMap(list, 'code', 'text')
const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    Number
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
  status = 0
  item: any = {}
  statusList: any = []
  columns = [
    {
      title: '影院名称',
      slot: 'citys',
      align: 'center'
    },
    {
      title: '转资编号',
      slot: 'code',
      align: 'center'
    },
    {
      title: '影院星级',
      slot: 'code',
      align: 'center'
    }
  ]

  created() {
    this.init()
  }

  formatDate(data: any) {
    return data ? moment(data).format(timeFormat) : '暂无'
  }

  formatNums(data: any) {
    return data ? formatCurrency(data) : '暂无'
  }

  tags(id: any) {
    this.tag = id
  }

  async init() {
    // const { data } = await orienteering({})
    try {
      const { data } = await adverdetail(25)
      this.status = data.item.status
      this.statusList = data.statusList
      this.item = data.item
    } catch (ex) {
      this.handleError(ex)
    }
    // this.status = statusMap(this.statusList)
    // this.filmList = data.items || []
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import './index.less';
</style>