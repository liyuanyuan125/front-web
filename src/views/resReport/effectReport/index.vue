<template>
  <div class="effect-report-wp">
    <BannerCard :data="bannerData" @selectPlan="selectPlanHandle"></BannerCard>
    <TotalCard :data="totalData"></TotalCard>
    <Row type="flex" justify="space-between">
      <Col :span="11">
        <TrendCard></TrendCard>
      </Col>      
      <Col :span="11">
        <DetailTableCard></DetailTableCard>
      </Col>      
    </Row>
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
import BannerCard from './components/banner-card.vue'
import TotalCard from './components/total-card.vue'
import DetailTableCard from './components/detail-table-card.vue'
import TrendCard from './components/trend-card.vue'
import CinemaCard from './components/cinema-card.vue'
import FilmCard from './components/film-card.vue'
import UserCard from './components/user-card.vue'
import SelectPlanDlg from './components/select-plan-dlg.vue'

@Component({
  components: {
    TinyLoading,
    BannerCard,
    TotalCard,
    DetailTableCard,
    TrendCard,
    FilmCard,
    CinemaCard,
    UserCard,
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

  selectPlanHandle() {
    this.selectPlanVisible = true
    this.$nextTick(() => {
      (this.$refs.selectPlanDlg as any).init()
    })
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
</style>


