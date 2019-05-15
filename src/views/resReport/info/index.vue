<template>
  <div class="page home-bg">
    <h3 class="layout-title">效果报表</h3>
    <div class="layout-panel">
      <Form label-position="left" :label-width="100" class="edit-input">
        <Row type="flex" justify="space-between">
          <Col :span="8">
            <FormItem label="投放时间" >
              <DatePicker type="daterange" v-model="form.beginDate" @on-change="handleChange" 
              placement="bottom-end" placeholder="请选择开始日期和结束日期" ></DatePicker>
            </FormItem>
          </Col>
          <Col :span="13">
            <FormItem label="广告片">
              <Select @on-change="handleChange" filterable>
                  <Option v-for="item in filmList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="ivu-form-item collection-wp">
        <Row style="background: #fff" :gutter="16">
            <Col :span="8">
                <div class='data-list one'>
                  <div class='data-one'>总播放场次</div>
                  <div class='data-two'><numAdd  v-if='collectionData.param1' :addNum="collectionData.param1"></numAdd>场</div>
                </div>
            </Col>
            <Col :span="8">
                <div class='data-list two'>
                  <div class='data-one'>总覆盖人次</div>
                  <div class='data-two'><numAdd  v-if='collectionData.param2' :addNum="collectionData.param2"></numAdd>人</div>
                </div>
            </Col>
            <Col :span="8">
                <div class='data-list three'>
                  <div class='data-one'>总收益</div>
                  <div class='data-two'><numAdd  v-if='collectionData.param3' :addNum="collectionData.param3"></numAdd>元</div>
                </div>
            </Col>
        </Row>
      </div>
    </div>
    <h3 class="layout-title">广告趋势分析</h3>
    <div class="layout-panel">
      <div style='text-align:center'>
        <RadioGroup size="large" @on-change="radioChangeHandler0" v-model="chartData0.chartsTypeKey" type="button">
          <Radio v-for="(item,index) in chartsType" :key="index" :label="item.key">{{item.name}}</Radio>
        </RadioGroup>
      </div>
      <summany :data="chartData0" v-if="reportDataInitDone" />
      <div class="loading-cover" v-else>
        <TinyLoading/>
      </div>
    </div>
    <div v-if="reportDataInitDone">
      <h3 class="layout-title">影片贡献度分析</h3>
      <div class="layout-panel">
        <div style='text-align:center'>
          <RadioGroup size="large" @on-change='radioChangeHandler1' v-model="chartData1.chartsTypeKey" type="button">
            <Radio v-for="(item,index) in chartsType" :key="index" :label="item.key">{{item.name}}</Radio>
          </RadioGroup>
        </div>
        <summany :data="chartData1" v-if="reportDataInitDone" />
        <div class="loading-cover" v-else>
          <TinyLoading/>
        </div>
      </div>
      <h3 class="layout-title">影院贡献度分析</h3>
      <div class="layout-panel">
        <div style='text-align:center'>
          <RadioGroup size="large" @on-change='radioChangeHandler2' v-model="chartData2.chartsTypeKey" type="button">
            <Radio v-for="(item,index) in chartsType" :key="index" :label="item.key">{{item.name}}</Radio>
          </RadioGroup>
        </div>
        <summany :data="chartData2" v-if="reportDataInitDone" />
        <div class="loading-cover" v-else>
          <TinyLoading/>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
 import { Component, Watch } from 'vue-property-decorator'
 import ViewBase from '@/util/ViewBase'
 import { formatTimestamp, formatTimes, formatNumber } from '@/util/validateRules'
import { effect, effectStatistics } from '@/api/resReport'
import TinyLoading from '@/components/TinyLoading.vue'
import numAdd from '../number.vue'
import summany from '../summary.vue'
@Component({
  components: {
    numAdd,
    summany,
    TinyLoading
  }
})
export default class Index extends ViewBase {
  // local dict
  chartsType: any[] = [{
      key: 'revenue',
      name: '收益'
    },
    {
      key: 'scene',
      name: '场次'
    },
    {
      key: 'people',
      name: '人次'
    }
  ]
  collectionData: any = {
    param1: 1092,
    param2: 1092091,
    param3: 1012345343436,
  }
  filmList: any[] = [
    {
      value: 'item1',
      label: 'item1'
    },
    {
      value: 'item2',
      label: 'item2'
    },
    {
      value: 'item3',
      label: 'item3'
    }
  ]
  reportDataInitDone: boolean = false
  form: any = {
    beginDate : [
      new Date(2019, 3, 9),
      new Date(2019, 4, 11)
    ]
  }
  chartData0: any = {
    time: new Date(),
    name: this.chartsType[0].name,
    type: 'line',
    stack: '总量',
    color: ['#FE8135'],
    chartsTypeKey: this.chartsType[0].key,
    dataList: {}
  }
  chartData1: any = {
    time: new Date(),
    name: this.chartsType[0].name,
    type: 'bar',
    stack: '总量',
    color: ['#FE8135'],
    chartsTypeKey: this.chartsType[0].key,
    dataList: {}
  }
  chartData2: any = {
    time: new Date(),
    name: this.chartsType[0].name,
    type: 'bar',
    stack: '总量',
    color: ['#FE8135'],
    chartsTypeKey: this.chartsType[0].key,
    dataList: {}
  }
  handleChange() {
    if (this.reportDataInitDone) {
      this.resetChartsData()
    }
    this.reportDataInitDone = false
    this.handleQueue()
  }
  async mounted() {
    this.handleQueue()
  }
  async handleQueue() {
    await this.getCollectionData()
    await this.getChartsData(0, 0)
    await this.getChartsData(1, 0)
    await this.getChartsData(2, 0)
    this.reportDataInitDone = true
  }
  resetChartsData() {
    const that: any = this
    const list: any[] = [0, 1, 2]
    list.forEach((item: any, index: number) => {
      that[`chartData${index}`].chartsTypeKey = this.chartsType[0].key
      that[`chartData${index}`].name = this.chartsType[0].name
      that[`chartData${index}`].dataList = {}
    })
  }
  async getChartsData(chartIndex: number = 0, typeNumber: number = 0 ) {
    const that: any = this
    const mockObj = {
      beginDate: formatTimestamp(that.form.beginDate[0]),
      endDate: formatTimestamp(that.form.beginDate[1]),
      accountType: 'ads',
      effectType: typeNumber
    }
    try {
      const { data } = await effect({ ...mockObj })
      const _chartName = 'chartData' + chartIndex
      that[_chartName].dataList[that.chartsType[typeNumber].key] = data.dataList
      that[_chartName].time = new Date()
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async getCollectionData() {
    const query = {
      beginDate: 1557590400001,
      endDate: 1557676799999,
      effectType: 1,
      accountType: 'ads'
    }
    try {
      const { data } = await effectStatistics({ ...query })
      this.collectionData = {
        param1: data.advertAmount,
        param2: data.coverPeople,
        param3: 1012345343436,
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }
  radioChangeHandler0(val: string) {
    const i: number = this.key2Index(this.chartsType, val)
    this.chartData0.name = this.chartsType[i].name
    if ( !this.chartData0.dataList[val] || this.chartData0.dataList[val].length < 1 ) {
      this.getChartsData(0, i)
    }
  }
  radioChangeHandler1(val: string) {
    const i: number = this.key2Index(this.chartsType, val)
    this.chartData1.name = this.chartsType[i].name
    if ( !this.chartData1.dataList[val] || this.chartData1.dataList[val].length < 1 ) {
      this.getChartsData(1, i)
    }
  }
  radioChangeHandler2(val: string) {
    const i: number = this.key2Index(this.chartsType, val)
    this.chartData2.name = this.chartsType[i].name
    if ( !this.chartData2.dataList[val] || this.chartData2.dataList[val].length < 1 ) {
      this.getChartsData(2, i)
    }
  }
  key2Index( obj: any, val: string ): number {
    let i: any = null
    obj.forEach((item: any, index: number) => {
      if (item.key === val) {
        i = index
      }
    })
    return i
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
.layout-panel {
  padding-top: 30px;
}
.ivu-form-item {
  padding-left: 30px;
  color: @c-text;
}
/deep/ .ivu-input-icon {
  line-height: 40px;
  height: 40px;
}
.search {
  width: 140px;
  height: 40px;
  border-radius: 2px;
  color: #fff;
  margin-left: 30px;
  background: @c-button;
}
.radio-item-type {
  font-size: 14px;
  margin-top: 4px;
  .ivu-radio-wrapper {
    font-size: 14px;
    margin-right: 35px;
  }
}
/deep/ .ivu-select-input {
  height: 40px;
  line-height: 40px;
}

.data-list {
  background: #fff;
  box-sizing: border-box;
  .data-one {
    height: 35px;
    line-height: 35px;
    color: #fff;
    padding-left: 10px;
    font-size: 13px;
  }
  .data-two {
    height: 65px;
    line-height: 65px;
    padding-left: 10px;
    font-size: 25px;
  }
}
.one {
  border: 2px solid #9a9bfc;
  .data-one {
    background: #9a9bfc;
  }
  .data-two {
    color: #9a9bfc;
  }
}
.two {
  border: 2px solid #64caff;
  .data-one {
    background: #64caff;
  }
  .data-two {
    color: #64caff;
  }
}
.three {
  border: 2px solid #41d9c1;
  .data-one {
    background: #41d9c1;
  }
  .data-two {
    color: #41d9c1;
  }
}
.loading-cover {
  padding: 50px;
  text-align: center;
}
.collection-wp {
  padding-right: 20px;
}
</style>


