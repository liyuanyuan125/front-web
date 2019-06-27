<template>
  <div class="plan-box">
    <Row>
      <Col >
        <Form :model="form" ref="dataform" label-position="left" :rules="rule" :label-width="100" class="edit-input forms">
          <PreceptHead v-model="deatilItem"/>
          <h3 class="layout-titles">投放影片
              <span class="item-detail">优先投放 {{filmList.length}} 部</span>
              <!-- <span class="custom">自定义投放电影</span> -->
          </h3>
          <div class="item-top">
            <ul class="film-list" :class="[ !arrowloding ? 'film-max' : '']" v-if="filmList.length > 0">
              <li @click="filmdetail(it.movieId)" v-for="(it) in filmList" :key="it.id"
                :class="['film-item']">
                <div class="film-top">
                  <img :src="it.image ? it.image : defaultImg" @onerror="defaultImg" class="film-cover">
                  <div style="position: relative">
                    <!-- <p class="film-title" :title="it.movieName">{{it.movieName}}</p> -->
                    <p class="film-title" :title="it.movieName" style="margin-bottom: 30px">{{it.movieName}}</p>
                    <p style="margin-bottom: 6px"><span>上映时间：</span>{{formatDate(it.publishStartDate)}}</p>
                    <p style="margin-bottom: 6px"><span>影片类型：</span>{{movieMap(it.movieType)}}</p>
                    <p style="margin-bottom: 6px"><span>想看人数：</span>{{formatNums(it.wantSeeNum, 2)}}</p>
                    <i-circle trail-color="#fff" stroke-color="#DA6C70" class="circle-per" :size="73" :percent="Number(it.matchPercent)">
                      <p class="demo-Circle-inner" style="font-size:14px;height:16px;margin-top: 4px; color:#DA6C70">匹配度</p>
                      <p class="demo-Circle-inner" style="font-size:16px;color:#DA6C70">{{it.matchPercent || '-'}}%</p>
                    </i-circle>
                  </div>
                </div>

                <div class="film-center">
                  <p style="opacity: .7">受众性别: </p>
                  <p style="margin-left: 20px" v-if="it.sexCodes == 'man'">男性</p>
                  <p style="margin-left: 20px" v-else-if="it.sexCodes == 'woman'">女性</p>
                  <p  style="margin-left: 20px" v-else>-</p>
                </div>

                <div class="film-buttom">
                  <dl style="margin-bottom: 15px">
                    <dd>受众年龄：</dd>
                    <dt v-if="it.ageCodes && it.ageCodes.length > 0">
                      <span v-for="(item, index) in it.ageCodes" :key="item">{{ageTypeMap(item)}}
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
              <Checkbox v-model="single">效果不足时允许系统投放更多影片确保曝光效果</Checkbox>
              <div @click="arrowloding = true" v-if="arrowshow && !arrowloding" class="arrow">展开<Icon type="ios-arrow-forward" ></Icon></div>
              <div @click="arrowloding = false" v-if="arrowshow && arrowloding" class="arrow">收起<Icon type="ios-arrow-up" /></div>
            </div>
          </div>

          <h3 class="layout-titles">覆盖影院
            <!-- <span class="item-detail">影院总数</span> -->
            <span class="custom" @click="exportData">导出影院</span>
            <!-- <span class="custom" style="margin-right: 160px">自定义投放影院</span> -->
          </h3>
          <div class="item-top">
           
          </div>
          <div class="item-top">
            <div class="cinema-box">
              <div class="cinema-right">
                <div v-if="detaildata">
                  <dl @click="tags(1)" :class="tag=='1' ? 'dl-active' : ''">
                    <dd>{{detaildata.cinemaCount}}</dd>
                    <dt>覆盖影院</dt>
                  </dl>
                  <dl @click="tags(2)" :class="tag=='2' ? 'dl-active' : ''">
                    <dd>{{detaildata.chainCount}}</dd>
                    <dt>覆盖影线</dt>
                  </dl>
                  <dl @click="tags(3)" :class="tag=='3' ? 'dl-active' : ''">
                    <dd>{{detaildata.cityCount}}</dd>
                    <dt>覆盖城市</dt>
                  </dl>
                  <dl @click="tags(4)" :class="tag=='4' ? 'dl-active' : ''">
                    <dd>{{detaildata.provinceCount}}</dd>
                    <dt>覆盖省份</dt>
                  </dl>
                </div>

                <div class="cinema-find">
                  <div style="position: relative">
                    <div :class="'border-top' + tag"></div>
                    <div :class="'border-bottom' + tag"></div>
                  </div>
                  <div class="cineme-input" v-if="tag == 1">
                    <Input placeholder="影院名称" v-model="form.name" style="width: 275px">
                        <Icon @click="seach" type="ios-search" slot="suffix" />
                    </Input>
                  </div>
                  <div class="cineme-input" v-if="tag == 2">
                    <Input v-model="form.name" placeholder="院线名称" style="width: 275px">
                        <Icon @click="seach" type="ios-search" slot="suffix" />
                    </Input>
                  </div>
                  <div class="cineme-input" v-if="tag == 3">
                    <Input v-model="form.name" placeholder="城市名称" style="width: 275px">
                        <Icon @click="seach" type="ios-search" slot="suffix" />
                    </Input>
                  </div>
                  <div class="cineme-input" v-if="tag == 4">
                    <Input v-model="form.name" placeholder="省份名称" style="width: 275px">
                        <Icon @click="seach" type="ios-search" slot="suffix" />
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

                  <!-- <Table height="320" style="display: none" ref="table" :loading="loading"  stripe :columns="columns" :data="tableDate1">
                    <template v-if="tag == 1" slot-scope="{ row }" slot="citys">
                      {{row.provinceName}} {{row.cityName}} {{row.countyName}}
                    </template>

                    <template slot-scope="{ row }" slot="estimateShowCount">
                      {{formatNums(row.estimateShowCount)}}
                    </template>

                    <template slot-scope="{ row }" slot="estimatePersonCount">
                      {{formatNums(row.estimatePersonCount)}}
                    </template>
                  </Table> -->

                  <Page :total="total" v-if="total>0" class="btnCenter"
                    :current="pageIndex"
                    :page-size="pageSize"
                    :page-size-opts="[6, 12, 20, 50]"
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

          <div class="btn-center">
            <Button type="default" class="button-ok btn-next" @click="back('dataform')"><img width="16px" src="./assets/next.png" /> 返回上一步</Button>
            <Button type="primary" class="button-ok btn-save" @click="next('dataform')">保存投放方案</Button>
            <!-- <Button type="default" class="button-ok btn-export" @click="back('dataform')"><img width="16px" src="./assets/export.png" /> 导出投放方案</Button> -->
            <!-- <Button type="default" class="button-ok btn-collect" @click="back('dataform')">联系商务</Button> -->
          </div>
        </Form>  
      </Col>
    </Row>
    <Xlsx ref="down" :id="$route.params.setid" />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import PreceptHead from './precepthead.vue'
import PrecepFilm from './preceptfile.vue'
import { orienteering, adverdetail, getRecommend, getCheme,
  getcinemas, getchains, getcities, getprovinces } from '@/api/popPlan.ts'
import moment from 'moment'
import { formatCurrency } from '@/fn/string.ts'
import Exportfile from './exportfile.vue'
import Xlsx from './downxsxl.vue'

const timeFormat = 'YYYY-MM-DD'
@Component({
  components: {
    PreceptHead,
    PrecepFilm,
    Exportfile,
    Xlsx
  }
})
export default class App extends ViewBase {
  form: any = {
    name: ''
  }
  dataitem: any = null
  tag = 1
  pageIndex = 1
  pageSize = 6
  tableDate: any = []
  total = 0
  detaildata: any = null
  data: any = {}
  filmList: any = []
  commendata: any = null
  loading = false
  single = true
  tableDate1: any = []
  deatilItem: any = {}
  movieTypeList: any = []
  ageTypeList: any = []
  arrowloding: any = false

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

  get rule() {
    return {}
  }

  get arrowshow() {
    if (this.filmList.length > 6) {
      return true
    } else {
      return false
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

  movieMap(val: any) {
    if (val && val.length > 0) {
      const vals = val ? val.split('|') : []
      return this.movieTypeList.filter((it: any) => {
        return vals.includes(it.key)
      }).map((it: any) => it.text).join(' | ')
    } else {
      return '-'
    }
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

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  formatNums(data: any, id: any) {
    const datanums = data ? formatCurrency(data) : '暂无'
    if (id == 1 && datanums != '暂无') {
      const msg = data ? formatCurrency(data, 0) : '暂无'
      return msg
    } else if (id == 2 && datanums != '暂无') {
      const msg1 = data ? formatCurrency(data, 0) : 0
      return msg1 ? msg1 + '人' : '-'
    } else {
      return datanums
    }
  }

  created() {
    this.seach()
    this.detail()
  }

  async detail() {
    try {
      const { data } = await adverdetail(this.$route.params.setid)
      this.filmList = data.planMovies || []
      this.detaildata = data
      this.ageTypeList = data.ageTypeList || []
      this.movieTypeList = data.movieTypeList
      this.deatilItem = data.item || {}
      this.cinemaFind()
    } catch (ex) {
      this.handleError(ex)
    }
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

  async cinemfind() {
    try {
      const { data } = await getcinemas(this.$route.params.setid, {
        name: this.form.name,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      this.tableDate = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async provienfind() {
    try {
      const { data } = await getprovinces(this.$route.params.setid, {
        name: this.form.name,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      this.tableDate = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async cityfind() {
    try {
      const { data } = await getcities(this.$route.params.setid, {
        name: this.form.name,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      this.tableDate = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async chainsfind() {
    try {
      const { data } = await getchains(this.$route.params.setid, {
        name: this.form.name,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      this.tableDate = data.items || []
      this.total = data.totalCount
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async next(dataform: any) {
    try {
      // await getCheme({
      //   planId: this.$route.params.setid,
      //   allowAutoDelivery: this.single ? 1 : 0,
      //   planRecommed: { ...this.commendata }
      // })
      this.$emit('input', {
        id: 3,
        setid: this.$route.params.setid
      })
      if (this.$route.name == 'pop-planlist-add') {
          this.$router.push({
            name: 'pop-planlist-add',
            params: { id: '3', setid: this.$route.params.setid  }
          })
        } else {
          this.$router.push({
            name: 'pop-planlist-edit',
            params: { id: '3', setid: this.$route.params.setid  }
          })
        }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  exportData() {
    (this.$refs.down as any).down()
  }

  get defaultImg() {
    return 'this.src="' + require('./assets/error.png') + '"'
  }

  async cinemaFind() {
    try {
       (this.$Spin as any).show()
      const msg = {
        budgetAmount: this.deatilItem.budgetAmount,
        specification: this.deatilItem.specification,
        beginDate: this.deatilItem.beginDate,
        endDate: this.deatilItem.endDate,
        deliveryCityTypes: this.deatilItem.deliveryCityTypes,
        cityIds: this.deatilItem.cityIds,
        sexCodes: this.deatilItem.sexCodes,
        ageCodes: this.deatilItem.ageCodes,
        movieIds: this.deatilItem.movieIds,
        cinemaIds: this.deatilItem.cinemaIds
      }
      // const { data } = await getRecommend({
      //   ...msg
      // })
      // this.commendata = data || {}
      ; (this.$Spin as any).hide()
    } catch (ex) {
       (this.$Spin as any).hide()
      this.handleError(ex)
    }
  }

  tags(id: any) {
    this.tag = id
    this.form.name = ''
    this.pageIndex = 1
    this.pageSize = 6
    this.seach()
  }

  back(dataform: any) {
    this.$emit('input', {
      id: 1,
      setid: this.$route.params.setid
    })
    if (this.$route.name == 'pop-planlist-add') {
      this.$router.push({
        name: 'pop-planlist-add',
        params: { id: '1', setid: this.$route.params.setid  }
      })
    } else {
      this.$router.push({
        name: 'pop-planlist-edit',
        params: { id: '1', setid: this.$route.params.setid  }
      })
    }
  }

  @Watch('commendata', { deep: true })
  watchCommendata(val: any) {
    if (val) {
      // ; (this.$Spin as any).hide()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.plan-box {
  margin: 0 20px;
}
.layout-titles {
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 32, 46, 1);
  margin-left: 30px;
  margin-top: 46px;
  .item-detail {
    display: inline-block;
    width: 100px;
    font-size: 14px;
    margin-left: 20px;
  }
  .custom {
    position: absolute;
    font-size: 14px;
    right: 20px;
    width: 152px;
    height: 37px;
    line-height: 37px;
    text-align: center;
    background: rgba(240, 245, 248, 1);
    border-radius: 19px;
    opacity: 0.6181;
  }
}
.item-top {
  margin-left: 30px;
  font-size: 14px;
  color: #26344b;
}
.hint {
  position: absolute;
  left: 105px;
  top: 14px;
}
.button-ok {
  width: 200px;
  margin-right: 16px;
}
.btn-center {
  margin: 40px 0 30px;
  text-align: center;
}
.default-but {
  border: 1px solid #dcdee2;
  .button-style(#515a6e, rgba(236, 245, 255, 1));
}
.form-item-first:first-child {
  margin-bottom: 20px;
}
.film-max {
  overflow: hidden;
  max-height: 690px;
}
.arrow-box {
  position: relative;
  .arrow {
    position: absolute;
    right: 20px;
    font-size: 20px;
    bottom: 4px;
    cursor: pointer;
  }
}
.film-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
  margin-bottom: 10px;
  position: relative;
  .film-item {
    width: 32%;
    margin-bottom: 20px;
    border-radius: 5px;
    position: relative;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.3);
    padding: 28px;
    cursor: pointer;
    &:not(:nth-child(3n)) {
      margin-right: 1.5%;
    }
    .film-top {
      display: flex;
      img {
        width: 104px;
        height: 146px;
      }
      div {
        margin-left: 20px;
        height: 30px;
        line-height: 30px;
        flex: 1;
      }
      p {
        height: 24px;
        color: #00202d;
        span {
          opacity: .8;
        }
      }
      .film-title {
        font-size: 18px;
        width: 134px;
        color: #00202d;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 24px;
        font-weight: 400;
      }
      .circle-per {
        position: absolute;
        top: -20px;
        right: -20px;
        z-index: 5;
      }
    }
    .film-center {
      margin: 15px 0;
      display: flex;
      p {
        height: 30px;
        line-height: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        span {
          margin-left: 10px;
        }
      }
      .file-sex-box {
        margin-left: 10px;
        width: 110px;
        text-align: center;
        span {
          text-align: center;
          color: rgba(87, 180, 201, 1);
          font-size: 14px;
        }
        > div {
          width: 110px;
          height: 110px;
          margin-left: 10px;
          display: flex;
          margin-bottom: 16px;
          justify-content: center;
          align-items: center;
          .file-sex-man {
            background: #00b6cc;
            border: 1px solid #00b6cc;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .file-sex-woman {
            background: #d96b6f;
            color: #da6c70;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
    .film-buttom {
      margin-top: 15px;
      margin-bottom: 15px;
      dl {
        display: flex;
        dd {
          color: rgba(0, 32, 45);
          opacity: .7;
        }
        dt {
          margin-left: 10px;
          color: rgba(0, 32, 45);
        }
      }
    }
  }
}
.cinema-box {
  display: flex;
  margin-right: 20px;
  overflow: hidden;
  max-height: 498px;
  .cinema-right {
    display: flex;
    width: 100%;
    dl {
      width: 156px;
      height: 118px;
      margin-right: 10px;
      background: rgba(255, 255, 255, 0.3);
      border: 1px solid #fff;
      position: relative;
      cursor: pointer;
      &:not(:first-child) {
        margin-top: 8px;
      }
      dd {
        font-weight: 500;
        font-size: 30px;
        width: 100%;
        text-align: center;
        color: rgba(0, 32, 45, 1);
        line-height: 30px;
        margin-top: 30px;
        margin-bottom: 10px;
      }
      dt {
        text-align: center;
        font-size: 16px;
        color: #00202d;
      }
    }
    .dl-active {
      border-right: 0;
    }
    .dl-active::after {
      content: '';
      display: block;
      width: 10px;
      height: 118px;
      position: absolute;
      border-top: 1px solid #fff;
      border-bottom: 1px solid #fff;
      background: rgba(255, 255, 255, 0.3);
      right: -10px;
      top: -1px;
    }
    .cinema-find {
      flex: 1;
      padding-right: 20px;
      background: rgba(255, 255, 255, 0.3);
      border: 1px solid #fff;
      border-left: 0;
      .cineme-input {
        display: flex;
        justify-content: flex-end;
        margin-top: 26px;
        margin-bottom: 37px;
        /deep/ .ivu-input {
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid #fff;
          color: #00202d;
          &::placeholder {
            color: #00202d;
          }
        }
        /deep/ .ivu-input-suffix {
          background: #00202d;
          border-radius: 0 5px 5px 0;
        }
        /deep/ .ivu-icon-ios-search {
          color: #fff;
        }
      }
      .border-top1 {
        display: none;
      }
      .border-bottom1 {
        .tags;
        top: 118px;
        height: 376px;
      }
      .border-top2 {
        .tags;
        top: 0;
        height: 126px;
      }
      .border-bottom2 {
        .tags;
        top: 243px;
        height: 251px;
      }
      .border-top3 {
        .tags;
        top: 0;
        height: 252px;
      }
      .border-bottom3 {
        .tags;
        top: 369px;
        height: 126px;
      }
      .border-top4 {
        .tags;
        top: 0;
        height: 378px;
      }
      .border-bottom4 {
        display: none;
      }
      /deep/ .ivu-table-wrapper {
        margin: 14px 0 20px 14px;
      }
    }
  }
}
.btn-save {
  width: 200px;
  .button-style(#fff, #00202d);
  border-radius: 25px;
}
.btn-next {
  width: 200px;
  .button-style(#00202d, rgba(0, 0, 0, 0));
  vertical-align: middle;
  border-radius: 25px;
  img {
    vertical-align: middle;
  }
}
.btn-export {
  width: 200px;
  .button-style(#00202d, rgba(255, 255, 255, .6));
  border-radius: 25px;
  img {
    vertical-align: middle;
  }
}
.btn-collect {
  width: 200px;
  .button-style(#00202d, rgba(255, 255, 255, .6));
  border-radius: 25px;
}
.tags {
  position: absolute;
  left: -1px;
  background: #fff;
  width: 1px;
}
/deep/ .ivu-table-wrapper {
  border-radius: 5px;
  min-height: 280px;
  position: relative;
  /deep/ .ivu-table-header th {
    height: 60px;
    background: rgba(255, 255, 255, 0.3);
    color: #00202d;
    line-height: 60px;
    span {
      font-size: 14px;
    }
  }
  /deep/ .ivu-table-column-center, /deep/ .ivu-table-column-left {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-row {
    background: rgba(255, 255, 255, 0);
    /deep/ td {
      color: #00202d;
      background: rgba(0, 0, 0, 0);
      a {
        color: #4fa6bb;
      }
    }
    border-bottom: 2px solid rgba(255, 255, 255, .5);
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr:nth-child(2n - 1) td {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
    background: rgba(255, 255, 255, 0);
  }
  /deep/ .ivu-table-body .ivu-table-column-center, /deep/ .ivu-table-body .ivu-table-column-left {
    span {
      color: #00202d;
      font-size: 14px;
    }
  }

  /deep/ .ivu-table-tip {
    line-height: 200px;
    /deep/ td {
      color: #00202d;
      background: rgba(255, 255, 255, 0);
    }
  }
}
</style>

