<template>
  <div class="compare-wp">
    <div class="compare-card">
      <div class="inner-box">
        <div class="compare-list-item central">
          <div class="avatar-wp">
            <img :src="kol.avatar" />
            <a class="remove-link"
               href="javascript:;"
               @click='removeItemHandle'>
              <Icon color='#fff'
                    size='29'
                    type="md-remove-circle" /></a>
          </div>
          <div class="nickName-wp">
            <i :style="{backgroundColor: kol.color}"></i> <span>{{kol.nickName}}</span>
          </div>
        </div>
        <ul >
          <li v-for="(item, index) in compareList"
              :key="item.id">
            <div class="compare-list-item">
              <div class="avatar-wp">
                <img :src="item.avatar" />
                <a class="remove-link"
                   href="javascript:;"
                   @click="removeItemHandle(item.id)">
                  <Icon color='#fff'
                        size='29'
                        type="md-remove-circle" /></a>
              </div>
              <div class="nickName-wp">
                <i :style="{backgroundColor: compareColors[`${index}`]}"></i> <span>{{item.nickName}}</span>
              </div>
            </div>
          </li>
          <li v-if=" compareList.length < 4 ">
            <!-- addItemHandle -->
            <a class="remove-link"
                   href="javascript:;"
                   @click="addItemHandle">
                  <Icon color='#fff'
                        size='50'
                        type="md-add-circle" /></a>
          </li>
        </ul>
      </div>
    </div>
    <div class="fans-card">
      <div class="title-text">粉丝分布</div>
        <BarCategoryStack :initDone="fansData.initDone"
                          :title='fansData.title'
                          :dict1="fansData.dict1"
                          :dict2="fansData.dict2"
                          :color="fansData.color"
                          :dataList="fansData.dataList"
                          :fn="channelChangeCb"
                          :height="255"
                          :currentTypeIndex="fansData.currentTypeIndex"
                          @typeChange='typeChangeHander' />
        <TotalPane :totalList="totalList" :index="totalIndex"></TotalPane>
        <div class="sex-age-pane">
          <div class="wp">
            <div class="cell">
              <div class="in">
                <div class="t">性别</div>
                <SexPane :sexData="sexData"></SexPane>
              </div>
            </div>
            <div class="cell">
              <div class="in">
                <div class="t">年龄分布</div>
                <BarPane
                  title="近7日新增想看人数"
                  :data="ageData"
                  :more="{ name: 'home' }"
                  class="active-fans-pane"
                /></BarPane>
              </div>
            </div>
          </div>
        </div>
        <CitysPane :citys="cityData"></CitysPane>
    </div>
    <div class="brand-card">
      <div class="title-text">合作品牌</div>
      <div class="wp">
        <Table
          stripe
          :columns="columns"
          :data="tabledata"
        ></Table>
      </div>
    </div>
    <WorksPane :filterList="dict.filterList"
                 :channelList="dict.channelList"
                 :productData="productData"></WorksPane>
    <SelectModal ref="SelectModal" :compareList="compareList" :kol="kol" @selectd="selectedHandle"></SelectModal>
  </div>
</template>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import {
  formatTimestamp,
  formatTimes,
  formatNumber
} from '@/util/validateRules'
import BarCategoryStack from '@/components/chartsGroup/barCategoryStack/'
import { fans, brands } from '@/api/kolCompare'
import WorksPane from './components/works.vue'
import CitysPane from './components/citys.vue'
import TotalPane from './components/total.vue'
import SexPane from './components/sex.vue'
import BarPane from './components/barPane.vue'
import SelectModal from './dlg.vue'

@Component({
  components: {
    WorksPane,
    TotalPane,
    CitysPane,
    SexPane,
    BarCategoryStack,
    BarPane,
    SelectModal
  }
})
export default class Temporary extends ViewBase {
  columns = [
    { title: 'KOL名称', key: 'name', align: 'center' },
    {
      title: '总数',
      width: 160,
      key: 'total',
      align: 'center'
    },
    {
      title: '品类TOP1',
      key: 'roleName1',
      align: 'center'
    },
    {
      title: '品类TOP2',
      key: 'roleName2',
      align: 'center'
    },
    {
      title: '品类TOP3',
      key: 'roleName3',
      align: 'center'
    }
  ]
  tabledata: any = [
    {
      name: 'Papi酱',
      total: 10,
      roleName1: '运动 3',
      roleName2: '运动 3',
      roleName3: '运动 3'
    },
    {
      name: '陈翔六点半',
      total: 8,
      roleName1: '运动 3',
      roleName2: '运动 3',
      roleName3: '运动 3'
    },
    {
      name: '办公室小野',
      total: 7,
      roleName1: '运动 3',
      roleName2: '运动 3',
      roleName3: '运动 3'
    },
    {
      name: '一禅小和尚',
      total: 7,
      roleName1: '运动 3',
      roleName2: '运动 3',
      roleName3: '运动 3'
    },
    {
      name: '李子柒',
      total: 6,
      roleName1: '运动 3',
      roleName2: '运动 3',
      roleName3: '运动 3'
    }
  ]

  form: any = {
    channelCode: 0,
    filterKey: 'key1',
    beginDate: [
      // new Date(2019, 3, 9), new Date(2019, 4, 11)
    ]
  }

  pageQuery: any = {}

  dict: any = {
    filterList: [
      {
        key: 'key1',
        text: '点赞数',
        disabled: false
      },
      {
        key: 'key2',
        text: '评论数',
        disabled: false
      },
      {
        key: 'key3',
        text: '播放数',
        disabled: false
      },
      {
        key: 'key4',
        text: '发布频率',
        disabled: false
      }
    ],
    channelList: [
      {
        id: 0,
        name: '微博'
      },
      {
        id: 1,
        name: '微信'
      },
      {
        id: 2,
        name: '抖音'
      },
      {
        id: 3,
        name: '快手'
      },
      {
        id: 4,
        name: '小红书'
      }
    ]
  }

  productData: any = {
    title: '粉丝男女分布',
    dict1: [],
    dict2: [],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [],
    color: ['#ff9933', '#169bd5']
  }

  // 对比目标
  kol: any = {
    id: 0,
    color: '#DA6C70',
    nickName: 'papi',
    avatar: 'http://sina.lt/gdYZ'
  }

  // 对比项 颜色
  compareColors: string[] = ['#F9D85E', '#00B6CC', '#15B48A', '#B964CB']

  // 对比项
  compareList: any[] = [
    {
      id: 1,
      nickName: '陈翔六点半',
      avatar:
        'http://sina.lt/gdYZ'
    },
    {
      id: 2,
      nickName: '办公室小野',
      avatar:
        'http://sina.lt/gdYZ'
    },
    {
      id: 3,
      nickName: '一禅小和尚',
      avatar:
        'http://sina.lt/gdYZ'
    },
    {
      id: 4,
      nickName: '李子柒',
      avatar:
        'http://sina.lt/gdYZ'
    }
  ]

  fansData: any = {
    title: '',
    dict1: [],
    dict2: [
      {
        key: 0,
        text: 'papi'
      },
      {
        key: 1,
        text: '陈翔六点半'
      },
      {
        key: 2,
        text: '办公室小野'
      },
      {
        key: 3,
        text: '一禅小和尚'
      },
      {
        key: 4,
        text: '李子柒'
      }
    ],
    currentTypeIndex: 0,
    initDone: false,
    dataList: [
      [
        { data: 279486, date: '微博', key: 0 },
        { data: 828187, date: '微信', key: 0 },
        { data: 512768, date: '抖音', key: 0 },
        { data: 312768, date: '快手', key: 0 },
        { data: 312768, date: '小红书', key: 0 },

        { data: 279486, date: '微博', key: 1 },
        { data: 828187, date: '微信', key: 1 },
        { data: 512768, date: '抖音', key: 1 },
        { data: 312768, date: '快手', key: 1 },
        { data: 312768, date: '小红书', key: 1 },

        { data: 279486, date: '微博', key: 2 },
        { data: 828187, date: '微信', key: 2 },
        { data: 512768, date: '抖音', key: 2 },
        { data: 312768, date: '快手', key: 2 },
        { data: 312768, date: '小红书', key: 2 },

        { data: 279486, date: '微博', key: 3 },
        { data: 828187, date: '微信', key: 3 },
        { data: 512768, date: '抖音', key: 3 },
        { data: 312768, date: '快手', key: 3 },
        { data: 312768, date: '小红书', key: 3 }
      ]
    ],
    color: [this.kol.color, ...this.compareColors]
  }

  sexData: any[] = [
    { name: 'Papi酱', malePercent: 88, femalePercent: 87 },
    { name: '陈翔六点半', malePercent: 23, femalePercent: 56 },
    { name: '办公室小野', malePercent: 54, femalePercent: 67 },
    { name: '一禅小和尚', malePercent: 87, femalePercent: 33 },
    { name: '李子柒', malePercent: 66, femalePercent: 33 }
  ]

  ageData = [
    { name: 'Papi酱', value: 40 },
    { name: '陈翔六点半', value: 33 },
    { name: '办公室小野', value: 22 },
    { name: '一禅小和尚', value: 66 },
    { name: '李子柒', value: 77 },
    { name: '5-21', value: 11 },
    { name: '5-22', value: 22 }
  ]
  totalIndex: number = 0
  totalList: any = {}

  cityData: any = {
    sColor: '#00B6CC',
    dColor: '#C46469',
    kol: [
      {
        cityName: '浙江',
        value: '69.8 万'
      },
      {
        cityName: '上海',
        value: '54.1 万'
      },
      {
        cityName: '北京',
        value: '22.1 万'
      },
      {
        cityName: '山东',
        value: '13.1 万'
      },
      {
        cityName: '河南',
        value: '66.1 万'
      }
    ],
    compare1: [
      {
        cityName: '西安',
        value: '33.1 万'
      },
      {
        cityName: '山东',
        value: '14.1 万'
      },
      {
        cityName: '山西',
        value: '33.1 万'
      },
      {
        cityName: '上海',
        value: '88.1 万'
      },
      {
        cityName: '北京',
        value: '11.1 万'
      }
    ],
    compare2: [
      {
        cityName: '西安',
        value: '33.1 万'
      },
      {
        cityName: '山东',
        value: '14.1 万'
      },
      {
        cityName: '山西',
        value: '33.1 万'
      },
      {
        cityName: '甘肃',
        value: '33.1 万'
      },
      {
        cityName: '北京',
        value: '11.1 万'
      }
    ],
    compare3: [
      {
        cityName: '西安',
        value: '11.1 万'
      },
      {
        cityName: '山东',
        value: '44.1 万'
      },
      {
        cityName: '成都',
        value: '33.1 万'
      },
      {
        cityName: '上海',
        value: '71.1 万'
      },
      {
        cityName: '北京',
        value: '55.1 万'
      }
    ],
    compare4: [
      {
        cityName: '西安',
        value: '22.1 万'
      },
      {
        cityName: '山东',
        value: '14.1 万'
      },
      {
        cityName: '广东',
        value: '55.1 万'
      },
      {
        cityName: '上海',
        value: '33.1 万'
      },
      {
        cityName: '北京',
        value: '11.1 万'
      }
    ]

  }
  fecthData() {
    const { id, ids } = this.$route.params
    // console.log( id , ids )
    this.fansData.initDone = true
  }
  typeChangeHander() {}
  mounted() {
    this.fecthData()
  }
  channelChangeHandle(name: string) {
    if ( name === '') { return }
    switch ( name ) {
      case '微信' :
        this.totalIndex = 1
        break
      case '抖音' :
        this.totalIndex = 2
        break
      case '快手' :
        this.totalIndex = 3
        break
      case '小红书' :
        this.totalIndex = 4
        break
      default :
        this.totalIndex = 0
    }
  }
  channelChangeCb(param: any) {
    this.channelChangeHandle(param.name)
  }
  selectedHandle(cart: any) {
    // console.log( cart)
  }
  addItemHandle() {
    (this.$refs.SelectModal as any).init()
  }
  removeItemHandle(val: string) {
    this.compareList = this.compareList.filter(item => item.id  !== val)
  }
}
</script>
<style lang="less" scoped>
@import '~@/site/lib.less';
@import './kolcompare.less';
/deep/ .ivu-table th, /deep/ .ivu-table-header {
  background: rgba(0, 32, 45, 0.8);
  height: 40px;
  line-height: 40px;
  color: rgba(179, 188, 192, 1);
  font-size: 15px;
  font-weight: 400;
}
/deep/ .ivu-table {
  background: none;
}
/deep/ .ivu-table td {
  background: none;
  transition: background-color 0.2s ease-in-out;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #0e3240;
}
/deep/ .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td {
  background: rgba(32, 67, 80, 1);
}
/deep/ .ivu-table-body {
  background: none;
}
/deep/ .ivu-table-tip {
  overflow-x: auto;
  overflow-y: hidden;
  background: transparent;
}
/deep/ .ivu-table-wrapper {
  margin: 0;
  border: none;
}
/deep/.ivu-table-stripe .ivu-table-body tr:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td {
  background: none;
}
/deep/.ivu-table-stripe .ivu-table-body tr:last-child td {
  border-bottom: 0;
}
</style>