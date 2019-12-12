<template>
  <div :class="`effect-report-wp ${exporting ? 'exporting' : ''}`">
    <div ref='PDF0'>
      <BannerCard v-if="bannerData.item6" :exporting="exporting" :data="bannerData" @selectPlan="selectPlanHandle" @exportPlan="exportPlanHandle"></BannerCard>
      <TotalCard :data="totalData"></TotalCard>
      <div class="flex-box">
        <ReportPane title="数据趋势">
          <div class="echarts-box">
            <AreaBasic
              :initDone="chart1.initDone"
              :title="chart1.title"
              :dict1="chart1.dict1"
              :dict2="chart1.dict2"
              :toolTip="chart1.toolTip"
              :height="chart1.height"
              :color="chart1.color"
              :dataList="chart1.dataList"
              :currentTypeIndex="chart1.currentTypeIndex"
              @typeChange="typeChangeHander1"
            />
          </div>
        </ReportPane>
        <DetailTableCard :data="tableData"></DetailTableCard>
      </div>
    </div>
    <div ref="PDF1">
      <MoviesCard @showMore="showMoreMoviesHandle" :moviesTotal="moviesTotal" :data="moviesData"></MoviesCard>
    </div>
    <div ref='PDF2'>
      <CinemaCard @showMore="showMoreCinemasHandle" :data="cinemasData"></CinemaCard>
    </div>
    <div ref='PDF3'>
      <UserCard :data="userData" ref="usercard" @moreCity="showMoreCitysHandle"></UserCard>
    </div>
    <div ref='PDF4'>
      <Monitors :planId="planId" :data="monitorsData" ref="monitorscard"></Monitors>
    </div>
    <MoreCinemasDlg ref="moreCinemasDlg" :id="planId"></MoreCinemasDlg>
    <MoreMoviesDlg
      ref="moreMoviesDlg"
      :id="planId"
      :moviesTotal="moviesTotal"
      :data="moreMovieData"
    ></MoreMoviesDlg>
    <MoreCitysDlg ref="moreCitysDlg" :id="planId"></MoreCitysDlg>
    <SelectPlanDlg ref="selectPlanDlg" @update="updateHandle"></SelectPlanDlg>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatTimestamp } from '@/util/validateRules'
import TinyLoading from '@/components/TinyLoading.vue'
import ReportPane from './components/report-pane.vue'
import BannerCard from './components/banner-card.vue'
import TotalCard from './components/total-card.vue'
import DetailTableCard from './components/detail-table-card.vue'
import CinemaCard from './components/cinema-card.vue'
import MoviesCard from './components/movies-card.vue'
import UserCard from './components/user-card.vue'
import Monitors from './components/monitors-card.vue'
import AreaBasic from '@/components/chartsGroup/areaBasic/area-basic.vue'
import SelectPlanDlg from './components/select-plan-dlg.vue'
import MoreCinemasDlg from './components/more-cinemas-dlg.vue'
import MoreCitysDlg from './components/more-citys-dlg.vue'
import MoreMoviesDlg from './components/more-movies-dlg.vue'
import { getPlansReport } from '@/api/effectReport'
import { findIndex, at, keyBy } from 'lodash'
import { KeyText } from '@/util/types'
import { datarange, formatDate } from '@/fn/duration.ts'
import { toThousands } from '@/util/dealData'

import { delay } from '@/fn/timer'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import moment from 'moment'
const format = 'YYYY/MM/DD'

const getName = (key: string, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return key === it.key
  })
  const res: string = list[i].text || ''
  return res
}
const dot = (object: any, path: string) => at(object, path)[0]
const getNames = (keys: string[], list: KeyText[]) => {
  const map = keyBy(list, 'key')
  const names = (keys || []).map((it: any) => dot(map[it], 'text') as string)
  return names
}
// 格式化时间
function formartDate(beginDate: string, endDate: string) {
  if ( beginDate === '' &&  endDate === '') {
    return ''
  } else {
    return moment(beginDate, 'YYYY-MM-DD').format('MM/DD') + '-' + moment(endDate, 'YYYY-MM-DD').format('MM/DD')
  }
}

const toolTip: any = {
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, .8)',
  backgroundColor: 'rgba(0, 0, 0, .8)',
  padding: [7, 10],
  textStyle: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 22
  },
  trigger: 'axis',
  axisPointer: {
    type: 'line',
    lineStyle: {
      width: 22,
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(255, 255, 255, .01)'
          },
          {
            offset: 1,
            color: 'rgba(255, 255, 255, .5)'
          }
        ]
      }
    }
  }
}

@Component({
  components: {
    TinyLoading,
    BannerCard,
    TotalCard,
    DetailTableCard,
    MoviesCard,
    CinemaCard,
    UserCard,
    Monitors,
    ReportPane,
    AreaBasic,
    SelectPlanDlg,
    MoreCinemasDlg,
    MoreCitysDlg,
    MoreMoviesDlg
  }
})
export default class Index extends ViewBase {

  // 导出ing...
  exporting: boolean = false

  planId: number = 0

  initDone: boolean = false

  bannerData: any = {}

  // 汇总摘要
  totalData: any = {}

  // 数据明细
  tableData: any = {
    columns: [
      { title: '时间', key: 'date', align: 'center' },
      {
        title: '曝光人次',
        key: 'viewCount',
        align: 'center'
      },
      {
        title: '曝光场次',
        key: 'scheduleCount',
        align: 'center'
      },
      {
        title: '支出金额',
        key: 'cost',
        align: 'center'
      }
    ],
    data: [
      // {
      //   date: '2019-05-08',
      //   viewCount: '113,456',
      //   scheduleCount: '8,789',
      //   cost: '¥ 6,345.23'
      // }
    ]
  }

  // 影片总数
  moviesTotal: number = 0

  // 影片列表
  moviesData: any[] = [
    /* {
      movieId: 0,
      poster: 'http://img5.mtime.cn/mt/2019/05/31/163639.93224012_1280X720X2.jpg',
      name: '攀登者',
      score: '时光评分：8.6',
      time: '2019-09-30上映',
      type: '剧情／冒险（中国大陆）',
      viewCount: '67789', // 曝光人次
      scheduleCount: '33333', // 曝光场次
      viewRate: '40', // 曝光人次占比
      userPortrait: {
        ages: [
          {
            key: '0~20岁',
            value: 50
          },
          {
            key: '20~50岁',
            value: 30
          }
        ],
        male: 20,
        female: 80
      }
    } */
  ]

  // 更多影片 弹窗
  moreMovieData: any[] = []

  // 影院
  cinemasData: any = {
    totalCount: 0,
    viewRate: {
      listName: '曝光人次 TOP10',
      data: []
    },
    scheduleRate: {
      listName: '曝光场次 TOP10',
      data: []
    },
    costRate: {
      listName: '支出金额 TOP10',
      data: []
    }
  }

  // 数据趋势 图表
  chart1: any = {
    title: '',
    dict1: [
      {
        name: '曝光人次',
        text: '曝光人次',
        key: 0
      },
      {
        name: '曝光场次',
        text: '曝光场次',
        key: 1
      },
      {
        name: '支出金额',
        text: '支出金额',
        key: 2
      }
    ],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [
      {
        data: [],
        date: []
      },
      {
        data: [],
        date: []
      },
      {
        data: [],
        date: []
      }
    ],
    color: ['#00B6CC', '#00B6CC', '#00B6CC'],
    height: 350,
    toolTip
  }

  // 用户画像
  userData: any = {
    sex: {},
    cityData: [],
    ageData: {
      age: [],
      data: []
    },
    cityLevelData: []
  }

  // 监播视频
  monitorsData: any = []

  async exportPlanHandle() {
    const nothingExport = !this.totalData.item0 || !this.totalData.item1 || !this.totalData.item2
    if ( this.exporting || nothingExport) { return }
    this.exporting = true
    this.$Notice.info({
      title: '正在导出PDF！',
      desc: '请稍等。。。 ',
      duration: 0.3,
      onClose: () => {
        this.exportPDF()
      }
    })
  }

  /**
   * @see html2canvas http://html2canvas.hertzen.com/configuration
   * @see jspdf+html2canvas实现网页转pdf https://juejin.im/post/5c74e940518825629a77d078
   * @see jsPDF http://raw.githack.com/MrRio/jsPDF/master/docs/
   * @see jsPDF https://parall.ax/products/jspdf
   */
  async exportPDF() {
    const fileName = `${this.bannerData.item6}(${this.bannerData.item0})`
    const pdf = new jsPDF('p', 'pt', 'a4')
    const width = pdf.internal.pageSize.getWidth()
    const height = pdf.internal.pageSize.getHeight()
    const backgroundColor = 'rgba(49, 145, 170)'
    const promistList = [
      html2canvas((this.$refs.PDF0 as any), {
        backgroundColor
      }),
      html2canvas((this.$refs.PDF1 as any), {
        backgroundColor
      }),
      html2canvas((this.$refs.PDF2 as any), {
        backgroundColor
      }),
      html2canvas((this.$refs.PDF3 as any), {
        backgroundColor
      }),
      html2canvas((this.$refs.PDF4 as any), {
        backgroundColor
      })
    ]
    Promise.all(promistList).then(canvases => {
      const [p0, p1, p2, p3, p4] = canvases
      const heightP0 = Math.round((p0.height * width / p0.width) || 100)
      const heightP1 = Math.round((p1.height * width / p1.width) || 100)
      const heightP2 = Math.round((p2.height * width / p2.width) || 100)
      const heightP3 = Math.round((p3.height * width / p3.width) || 100)
      const heightP4 = Math.round((p4.height * width / p4.width) || 100)

      // 间距
      const padding = 10
      // 每增加一条高度+41
      const cinemasDataLen: number = getMaxLen(this.cinemasData) || 1

      function getMaxLen(obj: any) {
        const numArr: number[] = [
          obj.costRate.data.length || 0,
          obj.scheduleRate.data.length || 0,
          obj.viewRate.data.length || 0,
        ]
        return numArr.sort((a: number, b: number) => {
          return b - a
        })[0]
      }

      pdf.setFillColor(49, 145, 170)
      pdf.rect(0, 0, 2000, 2000, 'FD')
      pdf.addImage(p0.toDataURL(), 'JPEG', 0, 0, width, heightP0, null, 'NONE')
      pdf.addImage(p1.toDataURL(), 'JPEG', 0, heightP0, width, heightP1, null, 'NONE')

      pdf.addPage()
      pdf.setFillColor(49, 145, 170)
      pdf.rect(0, 0, 2000, 2000, 'FD')

      pdf.addImage(p2.toDataURL(), 'JPEG', 0, 0, width, heightP2, null, 'NONE')
      pdf.addImage(p3.toDataURL(), 'JPEG', 0, heightP2 + padding, width, heightP3, null, 'NONE')
      pdf.addImage(p4.toDataURL(), 'JPEG', 0, heightP2 + heightP3 + padding, width, heightP4, null, 'NONE')
      return true
    }).then(() => {
      pdf.internal.scaleFactor = 1.33
      pdf.save(`${fileName}.pdf`)
      this.$Notice.success({
        title: '导出成功！',
        desc: ''
      })
      this.exporting = false
    })
  }

  async reset() {
    this.userData = {
      sex: {},
      cityData: [],
      ageData: {
        age: [],
        data: []
      },
      cityLevelData: []
    }
    this.chart1 = {
      title: '',
      dict1: [
        {
          name: '曝光人次',
          text: '曝光人次',
          key: 0
        },
        {
          name: '曝光场次',
          text: '曝光场次',
          key: 1
        },
        {
          name: '支出金额',
          text: '支出金额',
          key: 2
        }
      ],
      dict2: [],
      currentTypeIndex: 0,
      initDone: false,
      dataList: [
        {
          data: [],
          date: []
        },
        {
          data: [],
          date: []
        },
        {
          data: [],
          date: []
        }
      ],
      color: ['#00B6CC', '#00B6CC', '#00B6CC'],
      height: 350,
      toolTip
    }

    this.cinemasData = {
      totalCount: 0,
      viewRate: {
        listName: '曝光人次 TOP10',
        data: []
      },
      scheduleRate: {
        listName: '曝光场次 TOP10',
        data: []
      },
      costRate: {
        listName: '支出金额 TOP10',
        data: []
      }
    }

    this.moreMovieData = []
    this.moviesData = []
    this.moviesTotal = 0
    this.tableData.data = []
    this.totalData = {}
    this.bannerData = {}
    this.$nextTick(() => {
      (this.$refs.usercard as any).reset()
    })
  }

  async typeChangeHander1(index: number = 0) {
    this.chart1.currentTypeIndex = index
  }

  selectPlanHandle() {
    this.$nextTick(() => {
      (this.$refs.selectPlanDlg as any).init()
    })
  }

  showMoreCinemasHandle() {
    this.$nextTick(() => {
      (this.$refs.moreCinemasDlg as any).init()
    })
  }

  showMoreCitysHandle() {
    this.$nextTick(() => {
      (this.$refs.moreCitysDlg as any).init()
    })
  }

  showMoreMoviesHandle() {
    this.$nextTick(() => {
      (this.$refs.moreMoviesDlg as any).init()
    })
  }

  async updateHandle(id: number) {
    this.$router.push({
      name: 'effect-report',
      params: {
        id: (typeof id === 'number' ) ? id.toString() : id
      }
    })
    this.reset()
    this.planId = id
    this.init(id)
  }

  mounted() {
    const id = parseInt(this.$route.params.id, 0) || -1
    // 不区分环境，所有环境默认传 -1
    // TODO: 线上演示 id 为 104，其他环境 173
    // (VAR.env == 'prd' ? 173 : -1 )
    // this.planId = id 未知id 传-1，接口返回的id 用于请求其他接口。2019.11.12 from 老范
    this.init(id)
  }

  async init(id: number|string = -1) {
    this.initDone = false
    try {
      const { data } = await getPlansReport(id)
      // 临时调试监播视频 使用 nxd
      // const { data } = await getPlansReport(1402)

      const plan = data.plan || null
      const report = data.report || null
      const movies = data.movies || null
      const cinemas = data.cinemas as any[] || null
      const user = data.user || null
      const gradeCodes = data.gradeCodes || null
      const planStatus = data.planStatus || null
      const movieTypes = data.movieTypes || null
      const monitors = data.monitors || null
      // 没有广告计划id 2019.12.02
      if (!plan || !plan.id) {
        this.initDone = true
        this.chart1.initDone = true
        return
      }
      // 未知id 传-1，接口返回的id 用于请求其他接口。2019.11.12 from 老范
      this.planId = id === -1 ? plan.id : id

      if (report && report.lastModifyTime) {
        const dates = report.dates
        const name = getName(plan.status, planStatus)

        this.bannerData = {
          item0: `${formatDate(plan.beginDate)} ~ ${formatDate(plan.endDate)}`,
          item1: datarange(plan.beginDate, plan.endDate),
          item2: plan.videoName,
          item3: plan.specification,
          item4: getName(plan.status, planStatus),
          item5: moment(report.lastModifyTime).format(format), // 修改使用moment
          item6: plan.name
        }

        const viewCount = report.viewCount || null
        const scheduleCount = report.scheduleCount || null
        const cost = report.cost || null

        // 汇总摘要
        this.totalData = {
          item0: viewCount,
          item1: scheduleCount,
          item2: typeof cost === 'number' ? parseFloat(report.cost) / 100 : cost // 单位为'分'
        }

        // 影院
        if (cinemas && cinemas.length > 0) {
          this.cinemasData.totalCount = cinemas.length

          const cinemasTop = (field: string) => cinemas.sort((a, b) => b[field] - a[field])
            .slice(0, 10).map(it => ({ name: it.name, count: it[field] }))

          this.cinemasData.viewRate.data = cinemasTop('viewRate')
          this.cinemasData.scheduleRate.data = cinemasTop('scheduleRate')
          this.cinemasData.costRate.data = cinemasTop('costRate')
        }

        // 影片
        if (movies && movies.length > 0) {
          this.moviesTotal = movies.length
          movies.forEach((item: any) => {
            this.moreMovieData.push({
              name: item.name,
              viewCount: item.viewCount, // 曝光人次
              viewRate: parseFloat(item.viewRate) + '%', // 曝光人次占比
              scheduleCount: item.scheduleCount // 曝光场次
            })
          })

          movies.slice(0, 3).forEach((it: any) => {
            this.moviesData.push({
              movieId: it.movieId,
              poster: it.poster,
              name: it.name,
              score: it.score == null ? '-' : it.score,
              time:
                String(it.release).slice(0, 4) +
                '-' +
                String(it.release).slice(4, 6) +
                '-' +
                String(it.release).slice(6, 8),
              type: getNames(it.types, movieTypes).join(' / ') + '（中国大陆）',
              viewCount: it.viewCount, // 曝光人次
              scheduleCount: it.scheduleCount, // 曝光场次
              viewRate: it.viewRate, // 曝光人次占比
              userPortrait: {
                ages: it.userPortrait.ages.map((item: any) => {
                  return {
                    value: parseInt(item.value, 0),
                    key: item.key
                  }
                }),
                male: it.userPortrait.male,
                female: it.userPortrait.female
              }
            })
          })
        }

        // 数据趋势 && 数据明细
        if (dates && dates.length > 0) {
          dates.forEach((item: any, index: number) => {
            // 图表分类1
            this.chart1.dataList[0].data.push(item.viewCount)
            this.chart1.dataList[1].data.push(item.scheduleCount)
            // 图表分类2
            this.chart1.dataList[2].data.push(parseFloat(item.cost) / 100)
            this.chart1.dataList[0].date.push(item.date)
            // 图表分类3
            this.chart1.dataList[1].date.push(item.date)
            this.chart1.dataList[2].date.push(item.date)
            // 数据明细
            this.tableData.data.push({
              date:
                String(item.date).slice(0, 4) +
                '-' +
                String(item.date).slice(4, 6) +
                '-' +
                String(item.date).slice(6, 8),
              viewCount: item.viewCount,
              scheduleCount: item.scheduleCount,
              cost: toThousands(parseFloat(item.cost) / 100), // 单位为'分' 格式化金额
              originalCost: parseFloat(item.cost) / 100 // 用于导出内容，iview导出带逗号的字段有bug
            })
          })
        }

        // 用户画像
        if (user && user.ages && user.ages.length > 0) {
          const _ageData: any = {
            age: [],
            data: []
          }
          if (user.ages.length > 0) {
            user.ages.forEach((it: any) => {
              _ageData.age.push(it.k)
              _ageData.data.push(it.v)
            })
          }
          this.userData = {
            sex: {
              male: parseFloat(user.male),
              female: parseFloat(user.female)
            },
            cityData: user.cities.map((item: any) => {
              return {
                cityName: item.k,
                percent: parseFloat(item.v)
              }
            }),
            cityLevelData: user.grades.map((it: any) => {
              return {
                name: getName(it.k, gradeCodes),
                value: parseFloat(it.v)
              }
            }),
            ageData: _ageData || {}
          }
          this.$nextTick(() => {
            (this.$refs.usercard as any).init()
          })
        }

        // 监播视频
        if (monitors && monitors.length > 0) {
          this.monitorsData = monitors.map((it: any) => {
            return {
              img: it.img,
              id: it.id,
              time: moment(it.uploadTime).format('YYYY/MM/DD HH:mm'),
              name: `
                ${it.cinemaName} ${formartDate(it.beginDate, it.endDate)}
                ${it.movieName ? '《' + it.movieName + '》' : ''}
              `,
            }
          })
        }
        this.initDone = true
      }
      this.chart1.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
.effect-report-wp {
  .flex-box {
    flex-flow: row;
    justify-content: space-between;
    align-items: flex-start;
    section {
      width: 49.5%;
    }
  }
  .echarts-box {
    padding: 15px;
    min-height: 446px;
  }
}
</style>

<style lang="less">
// 导出前隐藏链接，调整排版
.exporting {
  .more-link {
    visibility: hidden;
  }
  ul.film-list li {
    margin-bottom: 4px;
  }
  .film-card {
    dd {
      .dsc-box {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 17px;
      }
    }
  }
}
</style>
