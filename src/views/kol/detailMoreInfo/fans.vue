<style lang="less" scoped>
@import '~@/site/lib.less';
.layout-panel {
  padding-top: 30px;
  border-radius: 10px;
}
.ivu-form-item {
  padding-left: 30px;
  color: @c-text;
  margin-bottom: 0;
}
/deep/ .ivu-input-icon {
  line-height: 40px;
  height: 40px;
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
</style>
<style lang='less'>
/* 公用 */
.my-card {
  .ivu-card-head {
    background: #f6f6f6;
  }
  .title-right {
    flex: 1;
    width: 100%;
    text-align: right;
  }
  .ivu-card-body {
    padding: 0;
  }
  .content {
    padding: 15px 0;
    .chart-wp {
      border-radius: 5px;
      background: #fff;
      min-height: 520px;
      position: relative;
      .total-tips {
        position: absolute;
        right: 0;
        top: 15px;
        border: 2px solid #999;
        background: #fff;
        border-radius: 80px;
        padding: 15px;
        width: 90px;
        height: 90px;
        text-align: center;
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
        z-index: 9;
      }
    }
  }
  .selectedBox {
    text-align: left;
  }
}
</style>
<template>
  <div style='display:flex; background:blue'>
    <div style='width:300px; text-align:center; color:#ffffff'>
      <h3>吴京</h3>
      <h5>演员/导演/制片人</h5>
      <ul>
        <li>概览</li>
        <li>作品列表</li>
        <li>全网热度</li>
        <li>平台运营</li>
      </ul>
    </div>
    <div style='flex:1; background:#ffffff'>
      <div style='background:#ffffff'>
        <Row>
          <Col span="24">
          <Form label-position="left"
                :label-width="100"
                class="edit-input">
            <Card class="my-card">
              <div slot="title">
                <Row type="flex"
                     justify="space-between">
                  <Col :span="24">
                    <DetailNavBar titleText=''>
                      <div class='title-right' slot='item'>
                        <Select v-model="form.brandId"
                        @on-change="handleChange"
                        class='selectedBox' style='width:100px' >
                            <Option v-for="item in dict.brandList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                      </div>
                    </DetailNavBar>
                  </Col>
                </Row>
              </div>
              <div class="content">
                <Row type="flex"
                     justify="space-between">
                  <Col :span="12">
                    <div class='chart-wp'
                        style='margin-right:10px'>
                        <Pie :initDone="chart1.initDone"
                                    :title='chart1.title'
                                    :dict1="chart1.dict1"
                                    :dict2="chart1.dict2"
                                    :dataList="chart1.dataList"
                                    :currentTypeIndex="chart1.currentTypeIndex"
                                    @typeChange='typeChangeHander1' />
                    </div>
                  </Col>
                  <Col :span="12">
                    <div class='chart-wp'>
                      <BarXCategory :initDone="chart2.initDone"
                                    :title='chart2.title'
                                    :dict1="chart2.dict1"
                                    :dict2="chart2.dict2"
                                    :dataList="chart2.dataList"
                                    :currentTypeIndex="chart2.currentTypeIndex"
                                    @typeChange='typeChangeHander2' />
                    </div>
                  </Col>
                </Row>
                <Row type="flex"
                     justify="space-between">
                  <Col :span="12">
                    <div class='chart-wp'
                        style='margin-right:10px'>
                        <MapChina :initDone="chart3.initDone"
                                      :title="chart3.title"
                                      :dict1="chart3.dict1"
                                      :dict2="chart3.dict2"
                                      :dataList="chart3.dataList"
                                      :currentTypeIndex="chart3.currentTypeIndex"
                                      @typeChange='typeChangeHander3' />
                    </div>
                  </Col>
                  <Col :span="12">
                    <div class='chart-wp'
                          style='margin-right:10px'>
                          <BarYCategory :initDone="chart4.initDone"
                                      :title="chart4.title"
                                      :dict1="chart4.dict1"
                                      :dict2="chart4.dict2"
                                      :dataList="chart4.dataList"
                                      :currentTypeIndex="chart4.currentTypeIndex"
                                      @typeChange='typeChangeHander4' />
                      </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Form>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {
  formatTimestamp,
  formatTimes,
  formatNumber
} from '@/util/validateRules'
import { fans } from '@/api/kolDetailMoreInfo'
import BarXCategory from '@/components/chartsGroup/barXCategory/'
import MapChina from '@/components/chartsGroup/mapChina/'
import Pie from '@/components/chartsGroup/pieSimple/'
import BarYCategory from '@/components/chartsGroup/barYCategory/'
import DetailNavBar from './components/detailNavBar.vue'

@Component({
  components: {
    BarXCategory,
    Pie,
    MapChina,
    BarYCategory,
    DetailNavBar
  }
})
export default class Temporary extends ViewBase {
  form: any = {
    brandId: 0
  }
  dict: any = {
    brandList: [
      {
        id: 0,
        name: '奔驰',
        disabled: false
      },
      {
        id: 1,
        name: '奥迪',
        disabled: false
      },
      {
        id: 2,
        name: '宝马',
        disabled: false
      }
    ]
  }
  chart1: any = {
    title: '粉丝男女分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  chart2: any = {
    title: '粉丝年龄分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  chart3: any = {
    title: '粉丝量TOP10',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  chart4: any = {
    title: '城市分粉丝量TOP10',
    dict1: [
      {
        key: 0,
        name: '省份'
      },
      {
        key: 1,
        name: '城市'
      }
    ],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  async typeChangeHander1(index: number = 0) {
    if (this.chart1.dataList[index].list.length < 1) {
      await this.getChartsData('chart1', index)
    }
    this.chart1.currentTypeIndex = index
  }
  async typeChangeHander2(index: number = 0) {
  }
  async typeChangeHander3(index: number = 0) {
  }
  async typeChangeHander4(index: number = 0) {
    if (this.chart4.dataList[index].list.length < 1) {
      await this.getChartsData('chart4', index)
    }
    this.chart4.currentTypeIndex = index
  }
  /**
   * 加载图表数据
   * @param chart 图表名 (因为接口返回全部数据，暂时不用)
   * @param typeIndex 当前类别下标
   */
  async getChartsData(chart: string = '', typeIndex: number = 0) {
    const that: any = this
    const mockObj = {
      accountType: 'ads',
      effectType: typeIndex
    }
    try {
      const { data } = await fans({ ...mockObj })
      that.chart1.dict2 = data.chart1.effectTypeList
      that.chart1.dataList[0].list = data.chart1.dataList
      that.chart1.initDone = true

      that.chart2.dict2 = data.chart2.effectTypeList
      that.chart2.dataList[0].list = data.chart2.dataList
      that.chart2.initDone = true

      that.chart3.dict2 = data.chart3.effectTypeList
      that.chart3.dataList[0].list = data.chart3.dataList
      that.chart3.initDone = true

      that.chart4.dict2 = data.chart4.effectTypeList
      that.chart4.dataList[typeIndex].list = data.chart4.dataList
      that.chart4.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleChange() {
    this.chart1.initDone = false
    this.chart2.initDone = false
    this.chart3.initDone = false
    this.chart4.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }
  async mounted() {
    this.initHandler()
  }
  async initHandler() {
    if (this.chart1.dict1.length > 0) {
      this.chart1.dict1.map((item: any, index: number) => {
        this.chart1.dataList.push({
          list: []
        })
      })
    } else {
      this.chart1.dataList.push({
        list: []
      })
    }
    if (this.chart2.dict1.length > 0) {
      this.chart2.dict1.map((item: any, index: number) => {
        this.chart2.dataList.push({
          list: []
        })
      })
    } else {
      this.chart2.dataList.push({
        list: []
      })
    }
    if (this.chart3.dict1.length > 0) {
      this.chart3.dict1.map((item: any, index: number) => {
        this.chart3.dataList.push({
          list: []
        })
      })
    } else {
      this.chart3.dataList.push({
        list: []
      })
    }
    if (this.chart4.dict1.length > 0) {
      this.chart4.dict1.map((item: any, index: number) => {
        this.chart4.dataList.push({
          list: []
        })
      })
    } else {
      this.chart4.dataList.push({
        list: []
      })
    }

    await this.getChartsData('', 0)
  }
  resetData() {
    // 重置有问题
    this.chart1.dataList.forEach((item: any) => {
      item.list = []
    })
    this.chart2.dataList.forEach((item: any) => {
      item.list = []
    })
    this.chart3.dataList.forEach((item: any) => {
      item.list = []
    })
    this.chart4.dataList.forEach((item: any) => {
      item.list = []
    })
  }
}
</script>