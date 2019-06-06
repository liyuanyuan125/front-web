<template>
  <div class="film-cooperation-wp">
    <div class="guide">
      <h3>影片合作推广 - 流程介绍：</h3>
      <ul>
        <li class="icon-1">
          <div>
            <p>1</p>
            <p>品牌申请<br /> 影片合作</p>
          </div>
        </li>
        <li class="icon-2">
          <div>
            <p>2</p>
            <p>片方审核通过<br />开放资源</p>
          </div>
        </li>
        <li class="icon-3">
          <div>
            <p>3</p>
            <p>品牌下载资源</p>
          </div>
        </li>
        <li class="icon-4">
          <div>
            <p>4</p>
            <p>品牌上传资源<br />使用照片</p>
          </div>
        </li>
        <li class="icon-5">
          <div>
            <p>5</p>
            <p>完成</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="filter-box">
      <Form :model="form"
            label-position="left"
            class="edit-input"
            :label-width="100">
        <Row type="flex"
             class="filtertop"
             justify="space-between">
          <Col :span='24'>
          <FormItem label="上映时间:">
            <RadioGroup class='nav'
                        @on-change="handleChange"
                        v-model="form.time"
                        size="large"
                        type="button">
              <Radio v-for="(item) in dict.timeSelected"
                     :key="item.key"
                     :disabled="item.disabled"
                     :label="item.key">{{item.text}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="影片类型:">
            <RadioGroup class='nav'
                        @on-change="handleChange"
                        v-model="form.filmType"
                        size="large"
                        type="button">
              <Radio v-for="(item) in dict.filmTypes"
                     :key="item.key"
                     :disabled="item.disabled"
                     :label="item.key">{{item.text}}</Radio>
              <Radio :key="-1"
                     :label="-1"
                     class='showMore'><span @click="showMoreHandle">{{filterShowMoreText}}
                  <Icon :type="filterShowMoreIcon" /></span></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="影片量级:">
            <RadioGroup class='test'
                        @on-change="handleChange"
                        v-model="form.filmWeight"
                        size="large"
                        type="button">
              <Radio v-for="(item) in dict.filmWeights"
                     :key="item.key"
                     :disabled="item.disabled"
                     :label="item.key">{{item.text}}</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
        <Row type="flex"
             justify="space-between"
             class="filterbottom">
          <Col :span='24'>
          <FormItem label="排序方式:">
            <RadioGroup class='nav'
                        @on-change="handleChange"
                        v-model="form.rank"
                        size="large"
                        type="button">
              <Radio v-for="(item) in dict.rankSelected"
                     :key="item.key"
                     :disabled="item.disabled"
                     :label="item.key">{{item.text}}</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="res-box">
      <div class="res-list">
        <Row :gutter="10"
             v-if="done"
             class="res-row">
          <Col span="4"
               v-for="(item,index) in dataList"
               :key="index"
               class="res-col">
          <div>
            <div class="poster"><img :src='item.images' /></div>
            <router-link :to='{id:item.id}'
                         class="movtitle cut-text">{{item.title}}</router-link>
            <p class="movscore">{{item.score}}</p>
          </div>
          </Col>
        </Row>
        <div v-else
             style="width: 100%; height: 400px">
          <TinyLoading />
        </div>
      </div>
      <Page class="info-page"
            :total="form.total"
            :current="form.pageIndex"
            :page-size="form.pageSize"
            show-total
            show-elevator
            @on-change="handlepageChange"
            @on-page-size-change="handlePageSize"></Page>
    </div>
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
import { fetchList } from '@/api/filmCooperation'
import numAdd from '../number.vue'
import PieNest from '@/components/chartsGroup/pieNest/'
import BarCategoryStack from '@/components/chartsGroup/barCategoryStack/'
import WordCloud from '@/components/chartsGroup/wordCloud/'
import DetailNavBar from './components/detailNavBar.vue'
import TinyLoading from '@/components/TinyLoading.vue'

@Component({
  components: {
    TinyLoading
  }
})
export default class Temporary extends ViewBase {
  total = 0
  done = false
  filterShowMore = false
  filterShowMoreIcon = 'ios-arrow-down'
  filterShowMoreText = '更多'
  form: any = {
    time: 0,
    filmType: 0,
    filmWeight: 0,
    rank: 0,
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    showMore: true
  }
  dataList: any[] = [
    // {
    //   title: '复仇者联盟4：终局之战',
    //   score: 95.1,
    //   images: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3139737031,3366713682&fm=26&gp=0.jpg'
    // }
  ]
  dict = {
    // 上映时间
    timeSelected: [
      {
        key: 0,
        text: '不限'
      },
      {
        key: 1,
        text: '正在热映'
      },
      {
        key: 2,
        text: '1个月内'
      },
      {
        key: 3,
        text: '3个月内'
      },
      {
        key: 4,
        text: '6个月内'
      },
      {
        key: 5,
        text: '一年内'
      }
    ],
    // 影片类型
    filmTypes: [
      {
        key: 0,
        text: '不限'
      },
      {
        key: 1,
        text: '动作'
      },
      {
        key: 2,
        text: '动作'
      },
      {
        key: 3,
        text: '动作'
      },
      {
        key: 4,
        text: '动作'
      },
      {
        key: 5,
        text: '动作'
      },
      {
        key: 6,
        text: '动作'
      },
      {
        key: 7,
        text: '动作'
      },
      {
        key: 8,
        text: '动作'
      },
      {
        key: 9,
        text: '动作'
      },
      {
        key: 10,
        text: '动作'
      },
      {
        key: 11,
        text: '动作'
      },
      {
        key: 12,
        text: '动作'
      },
      {
        key: 13,
        text: '动作'
      },
      {
        key: 14,
        text: '动作'
      },
      {
        key: 15,
        text: '动作'
      },
      {
        key: 16,
        text: '动作'
      },
      {
        key: 17,
        text: '动作'
      },
      {
        key: 18,
        text: '动作'
      }
    ],
    // 影片量级 :
    filmWeights: [
      {
        key: 0,
        text: '不限'
      },
      {
        key: 1,
        text: '超级大片'
      },
      {
        key: 2,
        text: '热门影片'
      },
      {
        key: 3,
        text: '一般影片'
      }
    ],
    // 排序选择
    rankSelected: [
      {
        key: 0,
        text: '鲸娱指数'
      },
      {
        key: 1,
        text: '实时热度'
      },
      {
        key: 2,
        text: '想看人数'
      },
      {
        key: 3,
        text: '口碑评分'
      }
    ]
  }
  async typeChangeHander4(index: number = 0) {}
  async fetchHandler() {
    const that: any = this
    const mockObj = {
      ...this.form
    }
    try {
      const { data } = await fetchList({ ...mockObj })
      this.dataList = data.items
      this.form.total = data.totalCount
      that.done = true
    } catch (ex) {
      this.handleError(ex)
    }
  }
  handleChange() {
    if (this.form.filmType === -1) {
      return
    }
    this.fetchHandler()
  }
  handlepageChange(val: any) {
    this.form.pageIndex = val
    this.fetchHandler()
  }
  handlePageSize(val: any) {
    this.form.pageIndex = val
    this.fetchHandler()
  }
  showMoreHandle() {
    if (!this.filterShowMore) {
      const { filmType } = this.form
      this.dict.filmTypes.push(
        {
          key: 20,
          text: '动作'
        },
        {
          key: 21,
          text: '动作'
        },
        {
          key: 22,
          text: '动作'
        },
        {
          key: 23,
          text: '动作'
        },
        {
          key: 24,
          text: '动作'
        },
        {
          key: 25,
          text: '动作'
        },
        {
          key: 26,
          text: '动作'
        },
        {
          key: 27,
          text: '动作'
        },
        {
          key: 97,
          text: '动作'
        },
        {
          key: 98,
          text: '动作'
        },
        {
          key: 99,
          text: '动作'
        }
      )
      this.filterShowMore = true
      this.filterShowMoreIcon = 'ios-arrow-up'
      this.$nextTick(() => {
        this.form.filmType = filmType
      })
    } else {
      const { filmType } = this.form
      this.dict.filmTypes.splice(-11, 11)
      this.filterShowMore = false
      this.filterShowMoreIcon = 'ios-arrow-down'
      this.$nextTick(() => {
        this.form.filmType = 0
      })
    }
  }
  created() {
    this.fetchHandler()
  }
}
</script>
<style lang="less">
@import '~@/site/lib.less';
.film-cooperation-wp {
  .guide {
    margin-bottom: 40px;
    background: rgba(0, 31, 44, 0.5);
    h3 {
      font-size: 24px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 33px;
      margin-bottom: 67px;
      padding: 30px 0 0 36px;
    }
    ul {
      display: flex;
      flex-flow: row;
      justify-content: flex-start;
      align-items: center;
      padding-bottom: 87px;
      li {
        padding-left: 20px;
        background-repeat: no-repeat;
        width: 230px;
        height: 106px;
        margin-left: 68px;
        div {
          height: 106px;
          border-left: 1px solid;
          border-left-color: rgba(255, 255, 255, 0.5);
          padding-left: 15px;
          p {
            color: #fff;
            &:first-child {
              opacity: 0.5;
              font-size: 40px;
              line-height: 32px;
              padding-bottom: 21px;
            }
            &:last-child {
              font-size: 20px;
            }
          }
        }
      }
      li.icon-1 {
        background-image: url('./assets/images/cooperation-step1.png');
        background-size: 52px 103px;
        padding-left: 52px;
      }
      li.icon-2 {
        background-image: url('./assets/images/cooperation-step2.png');
        background-size: 58px 103px;
        padding-left: 58px;
        margin-left: 40px;
      }
      li.icon-3 {
        background-image: url('./assets/images/cooperation-step3.png');
        background-size: 70px 103px;
        padding-left: 70px;
      }
      li.icon-4 {
        background-image: url('./assets/images/cooperation-step4.png');
        background-size: 73px 103px;
        padding-left: 73px;
      }
      li.icon-5 {
        background-image: url('./assets/images/cooperation-step5.png');
        background-size: 72px 103px;
        padding-left: 72px;
      }
    }
  }
  .filter-box {
    .filtertop {
      padding: 40px 63px 20px 63px;
      background: rgba(0, 32, 45, 1);
      border-radius: 5px 5px 0 0;
      opacity: 0.8;
      .ivu-form-item-label {
        color: #fff;
        padding: 6px 12px 10px 0;
      }
      .ivu-radio-group {
        .showMore.ivu-radio-wrapper-checked {
          color: #fff;
          font-weight: 400;
          background: none;
        }
        .ivu-radio-wrapper {
          height: 28px;
          line-height: 28px;
          font-size: 14px;
          box-shadow: none !important;
          color: #cdd0d3;
          border-radius: 3px;
          background: none;
          border: none;
          margin-bottom: 10px;
          &::before,
          &::after {
            display: none;
          }
        }
        .ivu-radio-wrapper-checked {
          background-color: #82d1e4;
          color: #00202d;
          .ivu-radio-inner {
            display: none;
          }
          &::before,
          &::after {
            display: none;
          }
        }
      }
    }
    .filterbottom {
      background: rgba(255, 255, 255, 0.7);
      padding: 40px 63px;
      .ivu-form-item {
        margin-bottom: 0;
      }
      .ivu-form-item-label {
        font-size: 16px;
      }
      .ivu-radio-group {
        .ivu-radio-wrapper {
          height: 36px;
          line-height: 36px;
          font-size: 16px;
          background: none;
          border: none;
          box-shadow: none !important;
          color: #00202d;
          border-radius: 0;
          &::before,
          &::after {
            display: none;
          }
        }
        .ivu-form-item-label {
          color: #00202d;
          line-height: 35px;
        }
        .ivu-radio-wrapper-checked {
          color: #00202d;
          border-bottom: 2px solid #00202d;
          font-weight: 400;
          .ivu-radio-inner {
            display: none;
          }
          &::before,
          &::after {
            display: none;
          }
        }
      }
    }
  }
  .res-box {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 0 0 7px 7px;
    .res-list {
      width: 100%;
      .res-row {
        .res-col {
          text-align: center;
          margin-bottom: 66px;
          .poster {
            img {
              max-width: 168px;
              max-height: 238px;
            }
          }
          .movtitle {
            font-size: 16px;
            font-weight: 400;
            color: rgba(0, 32, 45, 1);
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 168px;
            white-space: nowrap;
          }
          .movscore {
            font-size: 24px;
            font-weight: 500;
            color: rgba(0, 32, 45, 1);
            line-height: 16px;
          }
        }
      }
    }
    //底部页码
    .info-page {
      text-align: center;
      padding-bottom: 59px;
      .ivu-page-prev,
      .ivu-page-next,
      .ivu-page-item,
      .ivu-page-item-jump-prev,
      .ivu-page-item-jump-next {
        width: 35px;
        height: 35px;
        border-radius: 20px;
        background: none;
        border: none;
        color: #00202d;
      }
      .ivu-page-item-active a,
      .ivu-page-item-active:hover a {
        display: inline-block;
        width: 35px;
        height: 35px;
        border-radius: 20px;
        line-height: 35px;
        text-align: center;
        background: #00202d;
        color: #fff;
      }
    }
  }
}
</style>