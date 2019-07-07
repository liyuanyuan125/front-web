<template>
  <div class="effect-report-wp">
    <BannerCard v-if="bannerData.item6" :data="bannerData" @selectPlan="selectPlanHandle"></BannerCard>
    <TotalCard :data="totalData"></TotalCard>
    <div class="flex-box">
      <ReportPane title="数据趋势">
        <div class="echarts-box">
          <AreaBasic :initDone="chart1.initDone"
                    :title="chart1.title"
                    :dict1="chart1.dict1"
                    :dict2="chart1.dict2"
                    :toolTip="chart1.toolTip"
                    :height="chart1.height"
                    :color="chart1.color"
                    :dataList="chart1.dataList"
                    :currentTypeIndex="chart1.currentTypeIndex"
                    @typeChange="typeChangeHander1" />
        </div>
      </ReportPane>      
      <DetailTableCard :data="tableData"></DetailTableCard>
    </div>
    <div>
      <MoviesCard @showMore="showMoreMoviesHandle" :moviesTotal="moviesTotal" :data="moviesData"></MoviesCard>
    </div>
    <div>
      <CinemaCard @showMore="showMoreCinemasHandle" :data="cinemasData"></CinemaCard>
    </div>
    <div>
      <UserCard :data="userData" ref="usercard" @moreCity="showMoreCitysHandle"></UserCard>
    </div>
    <MoreCinemasDlg ref="moreCinemasDlg" :id="planId"></MoreCinemasDlg>
    <MoreMoviesDlg ref="moreMoviesDlg" :id="planId" :moviesTotal="moviesTotal" :data="moreMovieData"></MoreMoviesDlg>
    <MoreCitysDlg ref="moreCitysDlg" :id="planId"></MoreCitysDlg>
    <SelectPlanDlg ref="selectPlanDlg" @update="updateHandle"></SelectPlanDlg>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatTimestamp, formatTimes, formatYell } from '@/util/validateRules'
import TinyLoading from '@/components/TinyLoading.vue'
import ReportPane from './components/report-pane.vue'
import BannerCard from './components/banner-card.vue'
import TotalCard from './components/total-card.vue'
import DetailTableCard from './components/detail-table-card.vue'
import CinemaCard from './components/cinema-card.vue'
import MoviesCard from './components/movies-card.vue'
import UserCard from './components/user-card.vue'
import AreaBasic from '@/components/chartsGroup/areaBasic/area-basic.vue'
import SelectPlanDlg from './components/select-plan-dlg.vue'
import MoreCinemasDlg from './components/more-cinemas-dlg.vue'
import MoreCitysDlg from './components/more-citys-dlg.vue'
import MoreMoviesDlg from './components/more-movies-dlg.vue'
import { getPlansReport } from '@/api/effectReportThird'
import { findIndex, at, keyBy } from 'lodash'
import { KeyText } from '@/util/types'

const getName = (key: string, list: any[]) => {
  const i: number = findIndex( list, (it: any) => {
    return key === it.key
  })
  const res: string = list[i].text
  return res
}
const dot = (object: any, path: string) => at(object, path)[0]
const getNames = (keys: string[], list: KeyText[]) => {
  const map = keyBy(list, 'key')
  const names = (keys || []).map((it: any) => dot(map[it], 'text') as string)
  return names
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
    ReportPane,
    AreaBasic,
    SelectPlanDlg,
    MoreCinemasDlg,
    MoreCitysDlg,
    MoreMoviesDlg
  }
})
export default class Index extends ViewBase {

  planId: number = 39

  bannerData: any = {}

  totalData: any = {}

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

  typelist: any = [
    {controlStatus: 1, text: '儿童', key: 'Kids'},
    {controlStatus: 1, text: '历史', key: 'History'},
    {controlStatus: 1, text: '纪录片', key: 'Documentary'},
    {controlStatus: 1, text: '战争', key: 'War'},
    {controlStatus: 1, text: '戏曲', key: 'Opera'},
    {controlStatus: 1, text: '音乐', key: 'Music'},
    {controlStatus: 1, text: '歌舞', key: 'Musical'},
    {controlStatus: 1, text: '犯罪', key: 'Crime'},
    {controlStatus: 1, text: '传记', key: 'Biography'},
    {controlStatus: 1, text: '青春', key: 'Youth'},
    {controlStatus: 1, text: '奇幻', key: 'Fantasy'},
    {controlStatus: 1, text: '短片', key: 'Short'},
    {controlStatus: 1, text: '惊悚', key: 'Thriller'},
    {controlStatus: 1, text: '冒险', key: 'Adventure'},
    {controlStatus: 1, text: '科幻', key: 'Sci-Fi'},
    {controlStatus: 1, text: '动作', key: 'Action'},
    {controlStatus: 1, text: '家庭', key: 'Family'},
    {controlStatus: 1, text: '动画', key: 'Animation'},
    {controlStatus: 1, text: '励志', key: 'Encouragement'},
    {controlStatus: 1, text: '喜剧', key: 'Comedy'},
    {controlStatus: 1, text: '悬疑', key: 'Mystery'},
    {controlStatus: 1, text: '爱情', key: 'Romance'},
    {controlStatus: 1, text: '剧情', key: 'Drama'}
  ]

  moviesTotal: number = 0

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

  moreMovieData: any[] = []

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
      listName: '',
      data: []
    }
  }

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
    color: ['#CA7273'],
    height: 350,
    toolTip
  }

  userData: any = {
    sex: {},
    cityData: [],
    ageData: {
      age: [],
      data: []
    },
    cityLevelData: []
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
      color: ['#CA7273'],
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
    this.reset()
    this.init(id)
  }

  async created() {
    this.planId = Number(this.$route.params.id)
    this.init(this.$route.params.id)
  }

  async init(id: any) {
    try {
      const {
        data: {
          plan,
          report,
          movies,
          cinemas,
          user,
          gradeCodes,
          planStatus,
          movieTypes,
        }
      } = await getPlansReport(id)
      // const name = getName( plan.status, planStatus)
      const a = String(plan.beginDate).slice(0, 4) + '-' + String(plan.beginDate).slice(4, 6)
      + '-' + String(plan.beginDate).slice(6, 8)
      const b = String(plan.endDate).slice(0, 4) + '-' + String(plan.endDate).slice(4, 6)
      + '-' + String(plan.endDate).slice(6, 8)
      const sum = ((new Date(b).getTime() + (16 * 60 * 60 * 1000))
        - (new Date(a).getTime() - (8 * 60 * 60 * 1000))) / (24 * 60 * 60 * 1000)
      this.bannerData = {
        item0: a + '~' + b,
        item1: sum,
        item5: report == null ? '暂无' : formatYell(report.lastModifyTime),
        item6: plan.name
      }
      this.totalData = {
        item0: report == null ? '-' : report.viewCount,
        item1: report == null ? '-' : report.scheduleCount,
      }
      if ( cinemas && cinemas.length > 0 ) {
        this.cinemasData.totalCount = cinemas.length
        cinemas.slice(0, 10).forEach((it: any, index: number) => {
          this.cinemasData.viewRate.data.push({
            name: it.name,
            count: it.viewRate
          })
          this.cinemasData.scheduleRate.data.push({
            name: it.name,
            count: it.scheduleRate
          })
          this.cinemasData.costRate.data.push({
            name: it.name,
            count: it.costRate
          })
        })
      }
      if ( movies && movies.length > 0 ) {
        this.moviesTotal = movies.length
        movies.forEach((item: any) => {
          this.moreMovieData.push({
            name: item.name,
            viewCount: item.viewCount, // 曝光人次
            viewRate: item.viewRate, // 曝光人次占比
            scheduleCount: `￥${item.scheduleCount}`// 曝光场次
          })
        })
        movies.slice(0, 3).forEach((it: any) => {
          this.moviesData.push({
            movieId: it.movieId,
            poster: it.poster,
            name: it.name,
            score: it.score == null ? '-' : it.score,
            time: String(it.release).slice(0, 4) + '-' + String(it.release).slice(4, 6)
            + '-' + String(it.release).slice(6, 8),
            type: getNames(it.types, this.typelist).join(' / ') + '（中国大陆）',
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
      report == null ? this.tableData.data = [] : report.dates.forEach((item: any, index: number) => {
        this.chart1.dataList[0].data.push(item.viewCount)
        this.chart1.dataList[1].data.push(item.scheduleCount)
        this.chart1.dataList[2].data.push(item.cost)
        this.chart1.dataList[0].date.push(item.date)
        this.chart1.dataList[1].date.push(item.date)
        this.chart1.dataList[2].date.push(item.date)
        this.tableData.data.push({
          date: String(item.date).slice(0, 4) + '-' +
          String(item.date).slice(4, 6) + '-' + String(item.date).slice(6, 8) ,
          viewCount: item.viewCount,
          scheduleCount: item.scheduleCount,
          cost: item.cost
        })
      })
      this.chart1.initDone = true
      if (user) {
        const _ageData: any = {
          age: [],
          data: []
        }
        if (user.ages.length > 0 ) {
          user.ages.forEach((it: any) => {
            _ageData.age.push(it.k)
            _ageData.data.push(it.v)
          })
        }
        this.userData = {
          sex: {
            male: parseInt(user.male, 0),
            female: parseInt(user.female, 0)
          },
          cityData: user.cities.map((item: any) => {
            return {
              cityName: item.k,
              percent: parseInt(item.v, 0)
            }
          }),
          cityLevelData: user.grades.map((it: any) => {
            return {
              name: getName(it.k, gradeCodes),
              value: parseInt(it.v, 0)
            }
          }),
          ageData: _ageData || {}
        }
        this.$nextTick(() => {
          (this.$refs.usercard as any).init()
        })
      }
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


