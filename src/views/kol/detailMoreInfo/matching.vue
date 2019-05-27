<style lang="less">
@import '~@/site/lib.less';
@import '~@/site/detailmore.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
      <Form label-position="left"
            :label-width="100"
            class="edit-input">
        <Card class="detailmore-card">
          <div slot="title">
            <Row type="flex"
                 justify="space-between">
              <Col :span="24">
              <DetailNavBar titleText='整体匹配度72%'>
                <div class='title-right'
                     slot='item'>
                  <span>
                    Papi酱 PK
                  </span>
                  <Select v-model="form.brandId"
                          @on-change="handleChange"
                          class='selectedBox'
                          style='width:100px'>
                    <Option v-for="item in dict.brandList"
                            :value="item.id"
                            :key="item.id">{{ item.name }}</Option>
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
              <div class='chart-wp' style='margin-right:10px'>
                <div class='circle-box'>
                  <i-circle :percent="bar1.percent"
                            :size="iCircleOption.size"
                            :trail-color="iCircleOption.trailColor"
                            :stroke-color="iCircleOption.strokeColor"
                            :trail-width="iCircleOption.trailWidth"
                            :stroke-width="iCircleOption.strokeWidth">
                    <h6>{{bar1.percent}}%</h6>
                    <p>匹配度</p>
                  </i-circle>
                </div>
                <BarXCategory :initDone="bar1.initDone"
                              :title='bar1.title'
                              :dict1="bar1.dict1"
                              :dict2="bar1.dict2"
                              :dict3="bar1.dict3"
                              :color="bar1.color"
                              :dataList="bar1.dataList"
                              :currentTypeIndex="bar1.currentTypeIndex"
                              @typeChange='typeChangeHander1' />
              </div>
              </Col>
              <Col :span="12">
              <div class='chart-wp'>
                <div class='circle-box'>
                  <i-circle :percent="bar2.percent"
                            :size="iCircleOption.size"
                            :trail-color="iCircleOption.trailColor"
                            :stroke-color="iCircleOption.strokeColor"
                            :trail-width="iCircleOption.trailWidth"
                            :stroke-width="iCircleOption.strokeWidth">
                    <h6>{{bar2.percent}}%</h6>
                    <p>匹配度</p>
                  </i-circle>
                </div>
                <BarXCategory :initDone="bar2.initDone"
                              :title='bar2.title'
                              :dict1="bar2.dict1"
                              :dict2="bar2.dict2"
                              :dict3="bar2.dict3"
                              :color="bar2.color"
                              :dataList="bar2.dataList"
                              :currentTypeIndex="bar2.currentTypeIndex"
                              @typeChange='typeChangeHander2' />
              </div>
              </Col>
            </Row>
            <Row type="flex" justify="space-between" style='margin-top:10px'>
              <Col :span="12">
                <div class='chart-wp borderRadius' style='margin-right:10px'>
                  <div class='circle-box'>
                    <i-circle :percent="bar3.percent"
                              :size="iCircleOption.size"
                              :trail-color="iCircleOption.trailColor"
                              :stroke-color="iCircleOption.strokeColor"
                              :trail-width="iCircleOption.trailWidth"
                              :stroke-width="iCircleOption.strokeWidth">
                      <h6>{{bar3.percent}}%</h6>
                      <p>匹配度</p>
                    </i-circle>
                  </div>
                  <BarYCategoryDouble :initDone="bar3.initDone"
                                      :title="bar3.title"
                                      :titleTips="bar3.titleTips"
                                      :dict1="bar3.dict1"
                                      :dict2="bar3.dict2"
                                      :color="bar3.color"
                                      :dataList="bar3.dataList"
                                      :currentTypeIndex="bar3.currentTypeIndex"
                                      @typeChange='typeChangeHander3' />
                </div>
              </Col>
              <Col :span="12">
                <div class='chart-wp borderRadius'>
                  <div class='circle-box'>
                    <i-circle :percent="bar4.percent"
                              :size="iCircleOption.size"
                              :trail-color="iCircleOption.trailColor"
                              :stroke-color="iCircleOption.strokeColor"
                              :trail-width="iCircleOption.trailWidth"
                              :stroke-width="iCircleOption.strokeWidth">
                      <h6>{{bar4.percent}}%</h6>
                      <p>匹配度</p>
                    </i-circle>
                  </div>
                  <BarYCategoryDouble :initDone="bar4.initDone"
                                      :title="bar4.title"
                                      :dict1="bar4.dict1"
                                      :dict2="bar4.dict2"
                                      :color="bar4.color"
                                      :dataList="bar4.dataList"
                                      :currentTypeIndex="bar4.currentTypeIndex"
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
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {
  formatTimestamp,
  formatTimes,
  formatNumber
} from '@/util/validateRules'
import { platformData, matching } from '@/api/kolDetailMoreInfo'
import BarXCategory from '@/components/chartsGroup/barXCategory/'
import BarYCategoryDouble from '@/components/chartsGroup/barYCategoryDouble/'
import DetailNavBar from './components/detailNavBar.vue'
@Component({
  components: {
    BarXCategory,
    BarYCategoryDouble,
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
  iCircleOption: any = {
    size: 60,
    trailColor: '#00202D',
    strokeColor: '#BCE2F0',
    trailWidth: 6,
    strokeWidth: 3
  }
  bar1: any = {
    percent: 80,
    title: '男女分布',
    dict1: [],
    dict2: [],
    dict3: [],
    color: ['#DA6C70', '#00B6CC'],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  bar2: any = {
    percent: 80,
    title: '年龄分布',
    dict1: [],
    dict2: [],
    dict3: [],
    color: ['#DA6C70', '#00B6CC'],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  bar3: any = {
    percent: 80,
    title: '省份分布TOP10',
    titleTips: '描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息',
    dict1: [],
    dict2: [],
    color: ['#DA6C70', '#00B6CC'],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  bar4: any = {
    percent: 80,
    title: '城市分布TOP10',
    titleTips: '描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息',
    dict1: [],
    dict2: [],
    color: ['#DA6C70', '#00B6CC'],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  async typeChangeHander1(index: number = 0) {
    if (this.bar1.dataList[index].list.length < 1) {
      await this.getChartsData('bar1', index)
    }
    this.bar1.currentTypeIndex = index
  }
  async typeChangeHander2(index: number = 0) {}
  async typeChangeHander3(index: number = 0) {}
  async typeChangeHander4(index: number = 0) {}
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
      const { data } = await matching({ ...mockObj })
      that.bar1.dict2 = data.bar1.effectTypeList1
      that.bar1.dict3 = data.bar1.effectTypeList2
      that.bar1.dataList[0].list = data.bar1.dataList
      that.bar1.initDone = true

      that.bar2.dict2 = data.bar2.effectTypeList1
      that.bar2.dict3 = data.bar2.effectTypeList2
      that.bar2.dataList[0].list = data.bar2.dataList
      that.bar2.initDone = true

      that.bar3.dict2 = data.bar3.effectTypeList
      that.bar3.dataList[0].list = data.bar3.dataList
      that.bar3.initDone = true

      that.bar4.dict2 = data.bar4.effectTypeList
      that.bar4.dataList[0].list = data.bar4.dataList
      that.bar4.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleChange() {
    this.bar1.initDone = false
    this.bar2.initDone = false
    this.bar3.initDone = false
    this.bar4.initDone = false
    this.resetData()
    await this.getChartsData('', 0)
  }
  async mounted() {
    this.initHandler()
  }
  async initHandler() {
    if (this.bar1.dict1.length > 0) {
      this.bar1.dict1.map((item: any, index: number) => {
        this.bar1.dataList.push({
          list: []
        })
      })
    } else {
      this.bar1.dataList.push({
        list: []
      })
    }
    if (this.bar2.dict1.length > 0) {
      this.bar2.dict1.map((item: any, index: number) => {
        this.bar2.dataList.push({
          list: []
        })
      })
    } else {
      this.bar2.dataList.push({
        list: []
      })
    }
    if (this.bar3.dict1.length > 0) {
      this.bar3.dict1.map((item: any, index: number) => {
        this.bar3.dataList.push({
          list: []
        })
      })
    } else {
      this.bar3.dataList.push({
        list: []
      })
    }
    if (this.bar4.dict1.length > 0) {
      this.bar4.dict1.map((item: any, index: number) => {
        this.bar4.dataList.push({
          list: []
        })
      })
    } else {
      this.bar4.dataList.push({
        list: []
      })
    }

    await this.getChartsData('', 0)
  }
  resetData() {
    // 重置有问题
    this.bar1.dataList.forEach((item: any) => {
      item.list = []
    })
    this.bar2.dataList.forEach((item: any) => {
      item.list = []
    })
    this.bar3.dataList.forEach((item: any) => {
      item.list = []
    })
    this.bar4.dataList.forEach((item: any) => {
      item.list = []
    })
  }
}
</script>