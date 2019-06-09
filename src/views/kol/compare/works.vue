<style lang="less">
@import '~@/site/lib.less';
@import './kolcompare.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
        <Form label-position="left" :label-width="100">
          <Card class="detailmore-card">
            <div slot="title">
              <Row type="flex" justify="space-between" align="middle">
                <Col :span="14">
                  <span class="title-text">作品数据</span>
                  <RadioGroup class='nav'
                              @on-change="handleChange"
                              v-model="form.filterKey"
                              size="large"
                              type="button">
                    <Radio v-for="(item) in filterList"
                          :key="item.key"
                          :disabled="item.disabled"
                          :label="item.key">{{item.text}}</Radio>
                  </RadioGroup>
                </Col>
                <Col :span="10" align="right">
                  <Select v-model="form.channelCode"
                          clearable
                          @on-change="handleChange"
                          style="width:150px; text-align:left">
                    <Option v-for="(item) in channelList"
                            :key="item.id"
                            :value="item.id">{{item.name}}</Option>
                  </Select>
                  <DatePicker style="margin-left:15px"
                              type="daterange"
                              v-model="form.beginDate"
                              @on-change="handleChange"
                              placement="bottom-end"
                              placeholder="自定义时间段"></DatePicker>
                </Col>
              </Row>
            </div>
            <div class="content">
              <Row type="flex" justify="space-between">
                <Col :span="24">
                  <div class='chart-wp'>
                    charts
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Form>
      </Col>
    </Row>
  </div>
</template>
<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import {
  formatTimestamp,
  formatTimes,
  formatNumber
} from '@/util/validateRules'
import { fans, brands } from '@/api/kolCompare'
import DetailNavBar from './components/detailNavBar.vue'
@Component({
  components: {
    DetailNavBar
  }
})
export default class Temporary extends ViewBase {
  @Prop({ type: Array, default: () => [] }) filterList!: any[]
  @Prop({ type: Array, default: () => [] }) channelList!: any[]
  @Prop({ type: Object, default: () => {} }) chartData!: any
  form: any = {
    channelCode: 0,
    filterKey: 'key1',
    beginDate: [
      // new Date(2019, 3, 9), new Date(2019, 4, 11)
    ],
  }

  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const that: any = this
    // 107028 dev有数据
    const id = parseInt(this.$route.params.id, 0)
    try {
      // const {
      //   data,
      //   data: {
      //     item: { genders, ages, cities, provinces }
      //   }
      // } = await fans(id)

    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleChange() {
    this.resetData()
    await this.getChartsData('', 0)
  }
  async mounted() {
    this.initHandler()
  }
  async initHandler() {
    await this.getChartsData('', 0)
  }
  resetData() {
  }
}
</script>