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
                    <DetailNavBar titleText='整体匹配度72%'>
                      <div class='title-right' slot='item'>
                        <span>
                          Papi酱 PK
                        </span>
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
                        <div class='total-tips'>
                          <div><p>90%</p><p>匹配度</p></div>
                        </div>
                        <BarXCategory :initDone="bar1.initDone"
                                    :title='bar1.title'
                                    :dict1="bar1.dict1"
                                    :dict2="bar1.dict2"
                                    :dataList="bar1.dataList"
                                    :currentTypeIndex="bar1.currentTypeIndex"
                                    @typeChange='typeChangeHander1' />
                    </div>
                  </Col>
                  <Col :span="12">
                    <div class='chart-wp'>
                      <div class='total-tips'>
                        <div><p>90%</p><p>匹配度</p></div>
                      </div>
                      <BarXCategory :initDone="bar2.initDone"
                                    :title='bar2.title'
                                    :dict1="bar2.dict1"
                                    :dict2="bar2.dict2"
                                    :dataList="bar2.dataList"
                                    :currentTypeIndex="bar2.currentTypeIndex"
                                    @typeChange='typeChangeHander2' />
                    </div>
                  </Col>
                </Row>
                <Row type="flex"
                     justify="space-between">
                  <Col :span="12">
                    <div class='chart-wp'
                        style='margin-right:10px'>
                        <div class='total-tips'>
                          <div><p>90%</p><p>匹配度</p></div>
                        </div>
                        <BarYCategoryDouble :initDone="bar3.initDone"
                                    :title="bar3.title"
                                    :dict1="bar3.dict1"
                                    :dict2="bar3.dict2"
                                    :dataList="bar3.dataList"
                                    :currentTypeIndex="bar3.currentTypeIndex"
                                    @typeChange='typeChangeHander3' />
                    </div>
                  </Col>
                  <Col :span="12">
                    <div class='chart-wp'
                          style='margin-right:10px'>
                          <div class='total-tips'>
                            <div><p>70%</p><p>匹配度</p></div>
                          </div>
                          <BarYCategoryDouble :initDone="bar4.initDone"
                                      :title="bar4.title"
                                      :dict1="bar4.dict1"
                                      :dict2="bar4.dict2"
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
import { platformData1, matching } from '@/api/kolDetailMoreInfo'
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
  bar1: any = {
    title: '男女分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  bar2: any = {
    title: '年龄分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  bar3: any = {
    title: '省份分布TOP10',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: []
  }
  bar4: any = {
    title: '城市分布TOP10',
    dict1: [],
    dict2: [],
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
  async typeChangeHander2(index: number = 0) {
  }
  async typeChangeHander3(index: number = 0) {
  }
  async typeChangeHander4(index: number = 0) {
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
      const { data } = await matching({ ...mockObj })
      that.bar1.dict2 = data.bar1.effectTypeList
      that.bar1.dataList[0].list = data.bar1.dataList
      that.bar1.initDone = true

      that.bar2.dict2 = data.bar2.effectTypeList
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