<template>
  <div class="effect-report-wp">
    <BannerCard :data="bannerData" @selectPlan="selectPlanHandle"></BannerCard>
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
      <DetailTableCard></DetailTableCard>
    </div>
    <div>
      <FilmCard></FilmCard>
    </div>
    <div>
      <CinemaCard></CinemaCard>
    </div>
    <div>
      <UserCard></UserCard>
    </div>
    <SelectPlanDlg v-if="selectPlanVisible" ref="selectPlanDlg"></SelectPlanDlg>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { formatTimestamp, formatTimes, formatNumber } from '@/util/validateRules'
import TinyLoading from '@/components/TinyLoading.vue'
import ReportPane from './components/report-pane.vue'
import BannerCard from './components/banner-card.vue'
import TotalCard from './components/total-card.vue'
import DetailTableCard from './components/detail-table-card.vue'
import CinemaCard from './components/cinema-card.vue'
import FilmCard from './components/film-card.vue'
import UserCard from './components/user-card.vue'
import AreaBasic from '@/components/chartsGroup/areaBasic/area-basic.vue'
import SelectPlanDlg from './components/select-plan-dlg.vue'
import { trend, xadvertOrders } from '@/api/resReport'
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
    FilmCard,
    CinemaCard,
    UserCard,
    ReportPane,
    AreaBasic,
    SelectPlanDlg
  }
})
export default class Index extends ViewBase {

  selectPlanVisible: boolean = false

  bannerData: any = {
    item0: '2019-05-01 ～ 2019-05',
    item1: '7天',
    item2: 'vv6年轻有wey',
    item3: '30s',
    item4: '投放中',
    item5: '2019-05-11 12:22:33'
  }

  totalData: any = {
    item0: 1234567789,
    item1: 1234567,
    item2: 123456778900
  }

  chart1: any = {
    title: '',
    dict1: [
      {
        name: 'name0',
        text: '曝光人次',
        key: 0
      },
      {
        name: 'name1',
        text: '曝光场次',
        key: 1
      },
      {
        name: 'name2',
        text: '支出金额',
        key: 2
      }
    ],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [{
      data: [785051, 153851, 655097, 988405, 360493, 653878],
      date: ['02日', '03日', '04日', '05日', '06日', '07日']
    },
    {
      data: [181039, 852756, 493085, 480442, 823697, 961445],
      date: ['02日', '03日', '04日', '05日', '06日', '07日']
    },
    {
      data: [171354, 301210, 392339, 155343, 994929, 511870],
      date: ['02日', '03日', '04日', '05日', '06日', '07日']
    }],
    color: ['#CA7273'],
    height: 350,
    toolTip
  }

  async typeChangeHander1(index: number = 0) {
    this.chart1.currentTypeIndex = index
  }

  selectPlanHandle() {
    this.selectPlanVisible = true
    this.$nextTick(() => {
      (this.$refs.selectPlanDlg as any).init()
    })
  }

  mounted() {
    this.chart1.initDone = true
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


