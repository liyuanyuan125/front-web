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
  .ivu-card-body {
    padding: 0;
  }
  .content {
    padding: 15px 0;
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
                  <DetailNavBar titleText='统计周期'>
                    <div slot='item'>
                      <RadioGroup style='margin-right:15px'
                                  @on-change="handleChange"
                                  v-model="form.statisticTimeId"
                                  size="large"
                                  type="button">
                        <Radio v-for="(item) in dict.statisticTime"
                               :key="item.id"
                               :disabled="item.disabled"
                               :label="item.id">{{item.name}}</Radio>
                      </RadioGroup>
                      <DatePicker type="daterange"
                                  v-model="form.beginDate"
                                  @on-change="handleChange"
                                  placement="bottom-end"
                                  placeholder="自定义时间段"></DatePicker>
                    </div>
                  </DetailNavBar>
                  </Col>
                </Row>
              </div>
              <div class="content">
                <FormItem label="平台">
                  <Select v-model="form.platformId"
                          style="width: 400px"
                          clearable
                          @on-change="handleChange">
                    <Option v-for="(item) in dict.platform"
                            :key="item.id"
                            :value="item.id">{{item.name}}</Option>
                  </Select>
                </FormItem>
                <chartsGroup :initDone="initDone"
                             :typeList="typeDict"
                             :dataList="dataList"
                             :currentTypeIndex="currentTypeIndex"
                             @typeChange='typeChangeHandler' />
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
import { platformData1 } from '@/api/kolDetailMoreInfo'
import numAdd from '../number.vue'
import chartsGroup, { IcurrentType } from '@/components/chartsGroup/line/'
import DetailNavBar from './components/detailNavBar.vue'
@Component({
  components: {
    chartsGroup,
    DetailNavBar
  }
})
export default class Temporary extends ViewBase {
  form: any = {
    platformId: 0,
    beginDate: [
      // new Date(2019, 3, 9), new Date(2019, 4, 11)
    ],
    statisticTimeId: 0
  }
  dict: any = {
    statisticTime: [
      {
        id: 0,
        name: '昨天',
        disabled: false
      },
      {
        id: 1,
        name: '最近7天',
        disabled: false
      },
      {
        id: 2,
        name: '最近30天',
        disabled: false
      },
      {
        id: 3,
        name: '最近90天',
        disabled: true
      }
    ],
    platform: [
      {
        id: 0,
        name: '微信公众号'
      },
      {
        id: 1,
        name: '新浪微博'
      },
      {
        id: 2,
        name: '小红书'
      },
      {
        id: 3,
        name: '抖音'
      }
    ]
  }
  typeDict: IcurrentType[] = [
    {
      key: 'k0',
      name: '活跃粉丝数'
    },
    {
      key: 'k1',
      name: '点赞数'
    },
    {
      key: 'k2',
      name: '评论数'
    },
    {
      key: 'k3',
      name: '播放数'
    }
  ]
  currentTypeIndex: number = 0
  initDone: boolean = false
  dataList: any[] = []
  async typeChangeHandler(index: number = 0) {
    if (this.dataList[index].list.length < 1) {
      await this.getChartsData(0, index)
    }
    this.currentTypeIndex = index
  }
  async getChartsData(chartIndex: number = 0, typeIndex: number = 0) {
    const that: any = this
    const mockObj = {
      beginDate: formatTimestamp(new Date(2019, 3, 9)),
      endDate: formatTimestamp(new Date(2019, 9, 11)),
      accountType: 'ads',
      effectType: typeIndex
    }
    try {
      const { data } = await platformData1({ ...mockObj })
      this.dataList[typeIndex].list = data.dataList
      this.initDone = true
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleChange() {
    this.initDone = false
    this.resetData()
    await this.getChartsData(0, this.currentTypeIndex)
  }
  async mounted() {
    this.initHandler()
  }
  async initHandler() {
    this.typeDict.map((item: any, index: number) => {
      this.dataList.push({
        list: []
      })
    })
    await this.getChartsData(0, 0)
  }
  resetData() {
    this.dataList.forEach(item => {
      item.list = []
    })
    // this.currentTypeIndex = 0
  }
}
</script>