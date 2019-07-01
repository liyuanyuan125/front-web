<template>
  <div class="film-cooperation-wp">
    <div class="guide">
      <h3>影片合作推广 - 流程介绍：</h3>
      <ul>
        <li class="icon-1">
          <div>
            <p>1</p>
            <p>
              品牌申请
              <br>影片合作
            </p>
          </div>
        </li>
        <li class="icon-2">
          <div>
            <p>2</p>
            <p>
              片方审核通过
              <br>开放资源
            </p>
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
            <p>
              品牌上传<br>使用图片
            </p>
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
      <Form :model="form" label-position="left" class="edit-input" :label-width="100">
        <Row type="flex" class="filtertop" justify="space-between">
          <Col :span="24">
            <FormItem label="上映时间:">
              <RadioGroup
                class="nav"
                @on-change="handleChange"
                v-model="form.releaseStatus"
                size="large"
                type="button"
              >
                <Radio
                  v-for="(item) in dict.timeSelected"
                  :key="item.key"
                  :disabled="item.disabled"
                  :label="item.key"
                >{{item.text}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="影片类型:">
              <RadioGroup
                class="nav"
                @on-change="handleChange"
                v-model="form.movieTypeCode"
                size="large"
                type="button"
              >
                <Radio
                  v-for="(item) in dict.typeList"
                  :key="item.key"
                  :label="item.key"
                >{{item.text}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="影片量级:">
              <RadioGroup
                @on-change="handleChange"
                v-model="form.movieCategoryCode"
                size="large"
                type="button"
              >
                <Radio
                  v-for="(item) in dict.categoryList"
                  :key="item.key"
                  :label="item.key"
                >{{item.text}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="space-between" class="filterbottom">
          <Col :span="24">
            <FormItem label="排序方式:">
              <RadioGroup
                class="nav"
                @on-change="handleChange"
                v-model="form.sortBy"
                size="large"
                type="button"
              >
                <Radio
                  v-for="(item) in dict.sortBy"
                  :key="item.key"
                  :label="item.key"
                >{{item.text}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="res-box">
      <div class="res-list">
        <Row :gutter="10" v-if="done" type="flex" justify="start" class="res-row">
          <Col span="4" v-for="(item, index) in dataList" :key="index" class="res-col">
            <div class="res-item">
              <router-link target='_blank' :to="{ name: 'film-movie', params: { id: item.movie_id}}">
                <div class="poster" >
                  <img :src="item.main_pic">
                </div>
                <div class="movtitle cut-text">{{item.name_cn}}</div>
                <p class="movscore" v-if=" form.sortBy === 'hots' "><i class="hots"></i><span>{{getItemValue(item)}}</span></p>
                <p class="movscore" v-else-if=" form.sortBy === 'wantSeeCount' "><span>{{getItemValue(item)}}</span>人想看</p>
                <p class="movscore" v-else-if=" form.sortBy === 'commentsScore' "><span>{{getItemValue(item)}}</span>分</p>
                <p class="movscore" v-else ><span>{{getItemValue(item)}}</span></p>
              </router-link>
            </div>
          </Col>
        </Row>
        <div v-else class="loading-box">
          <TinyLoading />
        </div>
      </div>
      <Page
        class="info-page"
        :total="totalPages"
        :current="form.pageIndex"
        :page-size="form.pageSize"
        show-total
        show-elevator
        @on-change="handlepageChange"
        @on-page-size-change="handlePageSize"
      ></Page>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { fetchList } from '@/api/filmCooperation'
import TinyLoading from '@/components/TinyLoading.vue'
import { dayOffset } from '@/util/date'
import { percent, readableNumber, textList } from '@/util/dealData'

const typeListMore: any[] = []

@Component({
  components: {
    TinyLoading
  }
})
export default class CooperationFilmList extends ViewBase {
  done = false
  filterShowMore = false
  filterShowMoreIcon = 'ios-arrow-down'
  filterShowMoreText = '更多'
  selectdTime: string = ''
  totalPages: number = 0
  form: any = {
    movieTypeCode: '',
    movieCategoryCode: '',
    sortBy: 'wantSeeCount',
    pageIndex: 1,
    pageSize: 18,
    releaseStatus: 0
  }
  dataList: any[] = []
  dict = {
    // 上映时间
    timeSelected: [
      {
        key: 0,
        text: '不限'
      },
      {
        key: 3,
        text: '正在热映'
      },
      {
        key: 4,
        text: '1个月内'
      },
      {
        key: 5,
        text: '3个月内'
      },
      {
        key: 6,
        text: '6个月内'
      },
      {
        key: 7,
        text: '一年内'
      }
    ],
    // 影片类型
    typeList: [
      {
        key: '',
        text: '不限'
      }
    ],
    // 影片量级 :
    categoryList: [
      {
        key: '',
        text: '不限'
      }
    ],
    // 排序选择
    sortBy: [
      {
        key: 'wantSeeCount',
        text: '想看人数'
      },
      {
        key: 'commentsScore',
        text: '口碑评分'
      },
      {
        key: '',
        text: '鲸娱指数'
      },
      {
        key: 'hots',
        text: '实时热度'
      },
    ]
  }

  async typeChangeHander4(index: number = 0) {}

  async fetchHandler() {
    this.done = false
    const that: any = this
    const mockObj = {
      ...this.form
    }
    if ( mockObj.releaseStatus !== 3 &&  mockObj.releaseStatus !== 0 ) {
      mockObj.beginDate = dayOffset(0)
      switch ( mockObj.releaseStatus ) {
        case 4:
          mockObj.endDate = dayOffset(+30)
          break
        case 5:
          mockObj.endDate = dayOffset(+90)
          break
        case 6:
          mockObj.endDate = dayOffset(+120)
          break
        default:
          mockObj.endDate = dayOffset(+365)
      }
      mockObj.releaseStatus = ''
    }
    try {
      const {
        data: {
          movies,
          categoryList,
          typeList,
          totalPages,
          totalCount
        }
      } = await fetchList({ ...mockObj })
      if ( movies && movies.length > 0 ) {
        this.dataList = movies.map((it: any) => {
          return {
            movie_id: it.movie_id,
            name_cn: it.name_cn,
            release_date: it.release_date,
            main_pic: it.main_pic,
            release_status: it.release_status,
            jy_index: it.jy_index,
            want_see: it.want_see,
            hots: it.hots,
            comments_score: it.comments_score
          }
        })
        this.totalPages = totalCount
        if ( this.dict.typeList.length === 1 ) {
          const res = typeList.filter((it: any) => {
            return it.controlStatus !== 0
          })
          this.dict.typeList.push( ...res )
        }
        if ( this.dict.categoryList.length === 1 ) {
          const res = categoryList.filter((it: any) => {
            return it.controlStatus !== 0
          })
          this.dict.categoryList.push( ...res )
        }
        that.done = true
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handleChange() {
    this.form.moveTypeCode = 0
    this.form.pageIndex = 1
    this.restHandler()
    this.fetchHandler()
  }

  getItemValue(it: any) {
    switch ( this.form.sortBy ) {
      case 'hots':
        return it.hots
        break
      case 'wantSeeCount':
        return readableNumber(it.want_see)
        break
      case 'commentsScore':
        return it.comments_score
        break
      default:
        return it.jy_index != 0 ? (it.jy_index / 100).toFixed(2) : it.jy_index
    }
  }

  restHandler() {
    this.dataList = []
  }

  handlepageChange(val: any) {
    this.form.pageIndex = val
    this.fetchHandler()
  }

  handlePageSize(val: any) {
    this.form.pageIndex = val
    this.fetchHandler()
  }

  created() {
    this.fetchHandler()
  }
}
</script>

<style lang="less" scoped>
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
      /deep/ .ivu-form-item-label {
        color: #fff;
        padding: 6px 0 10px 0;
      }
      /deep/ .ivu-radio-group {
        .showMore.ivu-radio-wrapper-checked {
          color: #fff;
          font-weight: 400;
          background: none;
        }
      }
      /deep/ .ivu-radio-wrapper {
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
      /deep/ .ivu-radio-wrapper-checked {
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
    .filterbottom {
      background: rgba(255, 255, 255, 0.7);
      padding: 40px 63px;
      /deep/ .ivu-form-item {
        margin-bottom: 0;
      }
      /deep/ .ivu-radio-wrapper {
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        background: none;
        border: none;
        box-shadow: none !important;
        color: #00202d;
        border-radius: 0;
        margin-right: 50px;
        padding-left: 0;
        padding-right: 0;
        &::before,
        &::after {
          display: none;
        }
      }
      /deep/ .ivu-form-item-label {
        font-size: 16px;
        padding: 10px 12px 10px 0;
        color: #00202d;
      }
      /deep/ .ivu-radio-wrapper-checked {
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
  .res-box {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 0 0 7px 7px;
    .res-list {
      width: 100%;
      .res-row {
        min-height: 580px;
        .res-col {
          text-align: center;
          margin-bottom: 66px;
          .poster {
            img {
              width: 168px;
              height: 238px;
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
            line-height: 36px;
            white-space: nowrap;
          }
          .movscore {
            color: #00202d;
            display: flex;
            flex-flow: row;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            font-weight: 500;
            span {
              color: #da6c70;
              font-size: 24px;
              font-weight: 500;
              position: relative;
              top: -4px;
            }
            i.hots {
              display: inline-block;
              width: 24px;
              height: 24px;
              background: url('./assets/images/hots.png') center center no-repeat;
              position: relative;
              top: -6px;
            }
          }
        }
      }
    }
    //底部页码
    .info-page {
      text-align: center;
      padding-bottom: 59px;
      /deep/ .ivu-page-prev,
      /deep/ .ivu-page-next,
      /deep/ .ivu-page-item,
      /deep/ .ivu-page-item-jump-prev,
      /deep/ .ivu-page-item-jump-next {
        width: 35px;
        height: 35px;
        border-radius: 20px;
        background: none;
        border: none;
        color: #00202d;
      }
      /deep/ .ivu-page-item-active a,
      /deep/ .ivu-page-item-active:hover a {
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
.res-item {
  cursor: pointer;
}
.loading-box {
  width: 100%;
  height: 500px;
  text-align: center;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
</style>
