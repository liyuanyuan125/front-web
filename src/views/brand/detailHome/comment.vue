<template>
  <div>
    <Form label-position="left" :label-width="100">
      <Card class="detailmore-card">
        <div slot="title">
          <Row type="flex" justify="space-between" align="middle">
            <Col :span="17">
            <DetailNavBar titleText="统计周期">
              <div slot="item">
                <RadioGroup class="nav" @on-change="handleChange" v-model="form.dayRangesKey" size="large" type="button">
                  <Radio v-for="(item) in dict.dayRanges" :key="item.key" :disabled="item.disabled" :label="item.key">{{item.text}}</Radio>
                </RadioGroup>
              </div>
            </DetailNavBar>
            </Col>
            <!--  <Col :span="7" style="text-align:right">
              平台
              <Select
                v-model="form.channelCode"
                clearable
                @on-change="handleChange"
                style="width:150px; text-align:left"
              >
                <Option
                  v-for="(item) in dict.channelList"
                  :key="item.key"
                  :value="item.key"
                >{{item.text}}</Option>
              </Select>
            </Col>-->
          </Row>
        </div>

        <div class="content">
          <Row type="flex" justify="space-between" class="chart-group">
            <Col :span="12" class="chart-item">
            <div class="chart-wp" style="margin-right:10px">
              <PieNest :initDone="chart1.initDone" :noData="chart1.noData" :title="chart1.title" :dict1="chart1.dict1" :dict2="chart1.dict2" :toolTip="tooltipStyles({trigger:  'item', formatter:'{b} {c} %'})" :color="chart1.color" :dataList="chart1.dataList" :currentTypeIndex="chart1.currentTypeIndex" />
            </div>
            </Col>

            <Col :span="12" class="chart-item">
            <div class="chart-wp">
              <BarxCategoryStack :initDone="chartNature.initDone" :noData="chartNature.noData" :title="chartNature.title" :dict1="chartNature.dict1" :dict2="chartNature.dict2" :xAxis="chartNature.xAxis" :toolTip="tooltipStyles({trigger:  'item', formatter:'{b}-{c}'})" :color="chartNature.color" :dataList="chartNature.dataList" :currentTypeIndex="chartNature.currentTypeIndex" @typeChange="typeChangeHander" />
            </div>
            </Col>
          </Row>

          <Row type="flex" justify="space-between" class="chart-group" style="margin-top:10px">
            <Col :span="12" class="chart-item">
            <div class="chart-wp borderRadius" style="margin-right:10px;cursor: pointer;">
              <WordCloud :initDone="chart3.initDone" :title="chart3.title" :dict1="chart3.dict1" :color="chart3.color" :dataList="chart3.dataList" @keyChange="keyChangeHandle1" :currentTypeIndex="chart3.currentTypeIndex" />
            </div>
            </Col>
            <Col :span="12" class="chart-item">
            <div class="chart-wp borderRadius" style="cursor: pointer">
              <WordCloud :initDone="chart4.initDone" :title="chart4.title" :dict1="chart4.dict1" :color="chart4.color" :dataList="chart4.dataList" @keyChange="keyChangeHandle2" :currentTypeIndex="chart4.currentTypeIndex" />
            </div>
            </Col>
          </Row>

          <Row v-if="tableData.length > 0" type="flex" justify="space-between" class="chart-group" style="margin-top:10px">
            <Col :span="24" class="chart-item">
            <div class="chart-wp keyword-box borderRadius">
              <div class="keyword-title">提及到“{{keywordQuery.keyword}}”的热门评论</div>
              <div class="table-box">
                <Table stripe ref="table" :columns="tableColumns" :loading="tableLoading" :data="tableData"></Table>
                <Page
                    class="info-page"
                    show-total
                    @on-change="keywordCommentPageChange"
                    :total="keywordCommentTotal"
                    :current.sync="keywordCommentQueryData.pageIndex"
                    :page-size="keywordCommentQueryData.pageSize"
                    v-if="!keywordCommentLoading && keywordCommentTotal > 50"
                  />
              </div>
            </div>
            </Col>
          </Row>
        </div>
      </Card>
    </Form>
    <!-- <Table ref="selection"  class="table"  :columns="columns" :data="wordlist"></Table> -->
  </div>
</template>

<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import { findIndex } from 'lodash'
import moment from 'moment'
import { dayRanges, comment, codelist, keywordComment } from '@/api/brandfans'
import PieNest from '@/components/chartsGroup/pieNest'
import BarxCategoryStack from '@/components/chartsGroup/barxCategoryStack'
import WordCloud from '@/components/chartsGroup/wordCloud'
import DetailNavBar from './components/detailNavBar.vue'
import { tooltipStyles } from '@/util/echarts'
import { intDate, dot } from '@/util/dealData'

const timeFormat = 'YYYYMMDD'
// #AD686C 正面 positive
// #57B4C9 负面 passive
// #D0BF6B 中性 neutral
const colors: string[] = ['#AD686C', '#57B4C9', '#D0BF6B']

@Component({
  components: {
    PieNest,
    BarxCategoryStack,
    WordCloud,
    DetailNavBar
  }
})
export default class Temporary extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  // 评论列表添加分页 20191010
  keywordCommentQueryData: any = {
    pageIndex: 1,
    pageSize: 50,
    isPositive: null
  }

  // 评论列表添加分页 20191010
  keywordCommentLoading = false

  // 评论列表添加分页 20191010
  keywordCommentTotal: number | null = null

  tooltipStyles = tooltipStyles

  form: any = {
    beginDate: [
      // new Date(2019, 3, 9), new Date(2019, 4, 11)
    ],
    dayRangesKey: 'ninetyDay',
    channelCode: 'weibo'
  }

  keywordQuery: any = {
    keyword: '',
    pageIndex: 0,
    pageSize: 50
  }

  dict: any = {
    dayRanges: [
      {
        key: 'yesterDay',
        text: '昨日',
        disabled: false
      },
      {
        key: 'sevenDay',
        text: '最近7天',
        disabled: false
      },
      {
        key: 'thirtyDay',
        text: '最近30天',
        disabled: false
      },
      {
        key: 'ninetyDay',
        text: '最近90天',
        disabled: false
      }
    ],

    // 情感分类 写死适配多模块
    emotionList: [
      {
        key: 'positive',
        text: '正面'
      },
      {
        key: 'passive',
        text: '负面'
      },
      {
        key: 'neutral',
        text: '中性'
      }
    ],
    channelList: []
  }

  // wordlist: any = []
  // columns = [
  //   { title: '序号', key: 'id', align: 'center' },
  //   {
  //     title: '内容',
  //     key: 'accountNumber',
  //     align: 'center'
  //   },
  //   {
  //     title: '赞同',
  //     key: 'accountName',
  //     align: 'center'
  //   },
  //   {
  //     title: '回复',
  //     key: 'remittanceDate',
  //     align: 'center',
  //   },
  //   {
  //     title: '来源内容',
  //     key: 'contactPhone',
  //     align: 'center'
  //   },
  //   {
  //     title: '评论时间',
  //     key: 'applyTime',
  //     align: 'center',
  //   },
  // ]

  chart1: any = {
    title: '评论情绪分布',
    dict1: [],
    dict2: this.dict.emotionList,
    currentTypeIndex: 0,
    initDone: false,
    noData: false,
    dataList: [],
    color: colors
  }

  chartNature: any = {
    title: '',
    dict1: [
      {
        key: 'trend',
        name: '新增'
      },
      {
        key: 'count',
        name: '累计'
      }
    ],
    dict2: this.dict.emotionList,
    xAxis: [],
    currentTypeIndex: 0,
    initDone: false,
    noData: false,
    dataList: [
      [
        {
          name: '正面',
          type: 'bar',
          stack: 'totalCount',
          barWidth: '20',
          data: []
        },
        {
          name: '负面',
          type: 'bar',
          stack: 'totalCount',
          barWidth: '20',
          data: []
        },
        {
          name: '中性',
          type: 'bar',
          stack: 'totalCount',
          barWidth: '20',
          data: []
        }
      ],
      [
        {
          name: '正面',
          type: 'bar',
          stack: 'totalCount',
          barWidth: '20',
          data: []
        },
        {
          name: '负面',
          type: 'bar',
          stack: 'totalCount',
          barWidth: '20',
          data: []
        },
        {
          name: '中性',
          type: 'bar',
          stack: 'totalCount',
          barWidth: '20',
          data: []
        }
      ]
    ],
    color: colors
  }

  chart3: any = {
    title: '正面评论关键词',
    dict1: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['rgba(0,32,45,0)']
  }

  chart4: any = {
    title: '负面评论关键词',
    dict1: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['rgba(0,32,45,0)']
  }

  tableLoading: boolean = false

  tableColumns = [
    {
      title: '序号',
      key: 'index',
      align: 'center',
      width: 70
    },
    {
      title: '内容',
      key: 'highlightContent',
      align: 'left',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class="wenben" v-html={row.highlightContent}></div>
        /* tslint:disable */
      }
    },
    {
      title: '赞同',
      key: 'likeCount',
      align: 'center',
      width: 100
    },
    {
      title: '回复',
      key: 'replyCount',
      align: 'center',
      width: 100
    },
    {
      title: '来源内容',
      key: 'sourceContent',
      align: 'left',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return (
          <a target="_blank"
            class="sourceContent "
            href={row.sourceContentUrl}
            v-html={row.sourceContent}
          ></a>
        )
        /* tslint:disable */
      }
    },
    {
      title: '评论时间',
      key: 'commentDate',
      align: 'center'
    }
  ]

  tableData: any[] = []

  async typeChangeHander(index: number = 0) {
    this.chartNature.currentTypeIndex = index
  }

  /**
   * 加载日期区间描述
   */
  async dayRangesFetch() {
    /* const query = {}
    const id: number = 107028
    try {
      const { data } = await dayRanges({ ...query, id })
      this.dict.dayRanges = data.dayRanges
    } catch (ex) {
      this.handleError(ex)
    } */
  }

  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const that: any = this
    // const mockObj = {
    //   beginDate: this.form.beginDate[0],
    //   endDate: this.form.beginDate[1]
    // }
    const mockObj = {
      beginDate: this.beginDate(this.form.dayRangesKey),
      endDate: this.endDate()
    }
    // 107028 dev有数据
    const id = this.$route.params.id || ''
    try {
      const { data } = await comment({ ...mockObj }, id)

      const items = ((data.items as any[]) || []).sort((a, b) => a.date - b.date)
      const rate = data.rate || null
      const keyWords = data.keyWords || null

      if (rate && rate.neutral && rate.passive && rate.positive) {
        // #AD686C 正面 positive
        // #57B4C9 负面 passive
        // #D0BF6B 中性 neutral
        // 按照字典顺序遍历成员，同时配置颜色
        this.dict.emotionList.forEach((it: any, index: number) => {
          if (rate[it.key] && rate[it.key] !== '') {
            this.chart1.dataList[0].push({
              value: rate[it.key],
              name: it.text
            })
          } else {
            this.chart1.dataList[0].push({
              value: null,
              name: it.text
            })
          }
        })
      }

      if (items.length > 0) {
        items.forEach((item: any) => {
          //  positive 正面 index:0 | passive 负面 index:1 | neutral 中性 indxe:2
          // trend 新增 index:0 | count 累计 index:1
          const date = intDate(item.date)

          this.chartNature.xAxis.push(date)
          this.chartNature.dataList[0][0].data.push(dot(item, 'positive.trend') || 0)
          this.chartNature.dataList[0][1].data.push(dot(item, 'passive.trend') || 0)
          this.chartNature.dataList[0][2].data.push(dot(item, 'neutral.trend') || 0)

          this.chartNature.dataList[1][0].data.push(dot(item, 'positive.count') || 0)
          this.chartNature.dataList[1][1].data.push(dot(item, 'passive.count') || 0)
          this.chartNature.dataList[1][2].data.push(dot(item, 'neutral.count') || 0)
        })
      }
      if (keyWords && keyWords[this.form.dayRangesKey]) {
        if (keyWords[this.form.dayRangesKey].positive) {
          keyWords[this.form.dayRangesKey].positive.forEach((item: any) => {
            this.chart3.dataList[0].push({
              name: item,
              value: Math.floor(Math.random() * 100 + 1)
            })
          })
        }
        if (keyWords[this.form.dayRangesKey].negative) {
          keyWords[this.form.dayRangesKey].negative.forEach((item: any) => {
            this.chart4.dataList[0].push({
              name: item,
              value: Math.floor(Math.random() * 100 + 1)
            })
          })
        }
      }

      this.chart1.initDone = true
      this.chartNature.initDone = true
      this.chart3.initDone = true
      this.chart4.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }

  /**
   * 根据筛选返回起始日期，影人、影片、kol字段名未统一
   * @param dayRangesKey 昨天 | 过去7天 | 过去30天 | 过去90天
   */
  beginDate(dayRangesKey: string) {
    if ( this.form.beginDate.length > 0 && this.form.beginDate[0] !== '' ) {
      return moment(this.form.beginDate[0]).format(timeFormat)
    }
    // 日期选择器和周期选择互斥
    switch (dayRangesKey) {
      case 'yesterDay':
        return moment(new Date())
          .add(-1, 'days')
          .format(timeFormat)
      case 'thirtyDay':
        return moment(new Date())
          .add(-30, 'days')
          .format(timeFormat)
      case 'ninetyDay':
        return moment(new Date())
          .add(-90, 'days')
          .format(timeFormat)
      default:
        return moment(new Date())
          .add(-7, 'days')
          .format(timeFormat)
    }
  }

  endDate() {
    if ( this.form.beginDate.length > 0 && this.form.beginDate[1] !== '' ) {
      return moment(this.form.beginDate[1]).format(timeFormat)
    }
    // 日期选择器和周期选择互斥
    return this.form.dayRangesKey == 'yesterDay'
      ? moment(new Date())
          .add(-1, 'days')
          .format(timeFormat)
      : moment(new Date()).format(timeFormat)
  }

  // 切换当前页，发起请求
  keywordCommentPageChange(val: any) {
    this.keywordCommentQueryData.pageIndex = val
    this.tableData = []
    this.getKeywordList(this.keywordQuery.keyword, this.keywordCommentQueryData.isPositive)
  }

  async handleChange() {
    // 日期选择器和周期选择互斥,清除日历数据
    this.form.beginDate = []
    this.chartNature.initDone = false
    this.chart1.initDone = false
    this.chart3.initDone = false
    this.chart4.initDone = false
    this.tableData = []
    this.resetData()
    await this.getChartsData('', 0)
  }

  created() {
    this.form.beginDate[0] = this.beginDate(this.form.dayRangesKey)
    this.form.beginDate[1] = this.endDate()
    // this.dayRangesFetch() // 本地写死，暂时取消
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
    this.chartNature.xAxis.splice(0, this.chartNature.xAxis.length)
    this.chartNature.dataList.forEach((item: any) => {
      item.forEach((it: any) => {
        it.data.splice(0, it.data.length)
      })
    })
    this.chart3.dataList.forEach((item: any) => {
      item.splice(0, item.length)
    })
    this.chart4.dataList.forEach((item: any) => {
      item.splice(0, item.length)
    })
  }

  async getKeywordList(key?: string, isPositive: boolean = true) {
    this.tableData = []
    const that: any = this
    const mockObj = {
      keyWord: key == '' ? this.keywordQuery.keyword : key,
      // channelCode: this.form.channelCode,
      beginDate: this.beginDate(this.form.dayRangesKey),
      endDate: this.endDate(),
      positive: isPositive,  // 是否正面
      // 评论列表添加分页 20191010
      pageIndex: this.keywordCommentQueryData.pageIndex,
      pageSize: this.keywordCommentQueryData.pageSize,
    }
    // 评论列表添加分页 20191010
    this.keywordCommentLoading = true
    const id = this.id
    try {
      const {
        data,
        data: { items, totalCount }
      } = await keywordComment({ ...mockObj }, id)
      if (items && items.length > 0) {
        // this.tableData = items
        items.map((it: any, index: number) => {
          this.tableData.push({
            index: index + 1,
            highlightContent: it.highlightContent,
            content: it.content,
            likeCount: it.likeCount, // 赞同数
            replyCount: it.replyCount, // 回复数
            sourceContent: it.sourceContent, // 来源内容
            sourceContentUrl: it.sourceContentUrl, // 来源url
            commentDate: it.commentDate // 评论时间
          })
        })
        // 评论列表添加分页 20191010
        this.keywordCommentLoading = false
        this.keywordCommentTotal = totalCount
      }
      this.tableLoading = false
    } catch (ex) {
      this.handleError(ex)
    }
  }

  indexNumber(index: number): string {
    return index + '1'
  }

  keyChangeHandle1(item: any) {
    this.tableData = []
    // 评论列表添加分页 20191010 记录正负面参数
    this.keywordCommentQueryData.isPositive = true
    // 切换热词重置当前分页
    this.keywordCommentQueryData.pageIndex = 1
    this.getKeywordList(item[0], true)
    this.keywordQuery.keyword = item[0]
  }

  keyChangeHandle2(item: any) {
    this.tableData = []
    // 评论列表添加分页 20191010 记录正负面参数
    this.keywordCommentQueryData.isPositive = false
    // 切换热词重置当前分页
    this.keywordCommentQueryData.pageIndex = 1
    this.getKeywordList(item[0], false)
    this.keywordQuery.keyword = item[0]
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';

.table-box {
  border-radius: 5px;
  padding: 25px 0;
  min-height: 445px;
  /deep/ .ivu-table th,
  /deep/ .ivu-table-header {
    background: rgba(208, 233, 246, 1);
    height: 40px;
    line-height: 40px;
    color: rgba(0, 32, 45, 1);
    font-size: 15px;
    font-weight: 400;
  }
  /deep/ .ivu-table {
    background: none;
  }
  /deep/ .ivu-table td {
    background: none;
    transition: background-color 0.2s ease-in-out;
    font-size: 13px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #0e3240;
  }
  /deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
    background: rgba(32, 67, 80, 1);
  }
  /deep/ .ivu-table-body {
    background: none;
    /deep/ .ivu-table-row {
      /deep/ .ivu-table-column-left {
        /deep/ .ivu-table-cell {
          div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            em {
              color: red;
            }
          }
        }
      }
    }
  }

  /deep/ .ivu-table-tip {
    overflow-x: auto;
    overflow-y: hidden;
    background: transparent;
  }

  /deep/ .ivu-table-wrapper {
    margin: 0;
    border: none;
  }

  /deep/.ivu-table-stripe .ivu-table-body tr:nth-child(2n) td,
  .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td {
    background: none;
  }

  /deep/.ivu-table-stripe .ivu-table-body tr:last-child td {
    border-bottom: 0;
  }
}

/deep/ .sourceContent {
  color: #a3d5e6;
  width: 80%;
  height: 120px;
  .cut-text;
}

.keyword-box {
  padding-left: 20px;
  .keyword-title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    padding: 25px 25px 0 0;
  }
  /deep/ .ivu-table-wrapper {
    /deep/ .ivu-table-cell > div {
      line-height: 28px;
    }
  }
  //底部页码
  .info-page {
    text-align: center;
    padding-bottom: 59px;
    padding-top: 50px;
    /deep/ .ivu-page-prev,
    /deep/ .ivu-page-next,
    /deep/ .ivu-page-item,
    /deep/ .ivu-page-item-jump-prev,
    /deep/ .ivu-page-item-jump-next {
      width: 35px;
      height: 35px;
      border-radius: 20px;
      background: none;
      border: none;
      color: #fff;
    }
    /deep/ .ivu-page-item a {
      color: #fff;
      line-height: 35px;
    }
    /deep/ .ivu-page-item-active a,
    /deep/ .ivu-page-item-active:hover a {
      display: inline-block;
      width: 35px;
      height: 35px;
      border-radius: 20px;
      line-height: 35px;
      text-align: center;
      background: #00202d;
      color: #fff;
    }
  }
}
</style>
