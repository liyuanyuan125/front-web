<template>
  <div class="app">
     <div class="item-top" style="margin-top: 50px">
        <ul class="film-list" v-if="cinemaDetail.length > 0">
          <li @click="checknum(it.movieId)" v-for="(it, index) in cinemaDetail" :key="index"
            :class="['film-item']">
            <div :class="!singleId(it.movieId) ? 'check' : 'check checkall'"></div>
            <div :class="['film-cover-box']">
              <img :src="it.logoUrl" class="film-cover">
              <div>
                <div class="film-title">{{it.movieName}} <span>{{it.jyIndex}}</span></div>
                <div class="film-time" style="margin-top: 20px"><span>{{it.types.join(' / ')}}</span></div>
                <div class="film-time"><span>{{formatDate(it.releaseDate)}}</span></div>
                <div class="film-time">导演: <span>{{it.director}}</span></div>
                <div class="film-time">演员: <span>{{it.actorList.join(' /' )}}</span></div>
              </div>
            </div>
            <p class="item-bottom">申请合作</p>
          </li>
        </ul>
    </div>
    <!-- <Page :total="total" v-if="total>0" class="btnCenter"
        :current="pageIndex"
        :page-size="pageSize"
        :page-size-opts="[6, 20, 50, 100]"
        show-total
        show-sizer
        show-elevator
        @on-change="sizeChangeHandle"
        @on-page-size-change="currentChangeHandle"/> -->
    <div class="audit">
      <span @click='checkAll' :class="!single ? 'check' : 'check checkall'"></span>
      <span style="color: #444">全选</span>
      <span @click="del" style="color: #00202D; cursor: pointer;">取消收藏</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getTwodetail, cinemaFilm } from '@/api/popPlan.ts'
import moment from 'moment'
import { getmovies, delcollect } from '@/api/mycollect.ts'
import { info } from '@/ui/modal'

const timeFormat = 'YYYY-MM-DD'
@Component
export default class App extends ViewBase {
  cinemaDetail: any = []
  total = 6
  single = false
  checkNum: any = []
  checkId: any = []
  pageSize = 6
  pageIndex = 1

  formatDate(data: any) {
    return data ? moment(data).format(timeFormat) : '暂无'
  }

  created() {
    this.init()
  }

  singleId(id: any) {
    return this.checkId.includes(id)
  }

  check(data: any) {
    const ids = this.cinemaDetail.map((it: any) => it.movieId)
    const dataId = data.map((it: any) => it)
    const checkSingle: any = []
    data.forEach((item: any) => {
      if (!this.checkId.includes(item)) {
        this.checkId.push(item)
      }
    })
    const filterId = ids.filter((it: any) => !dataId.includes(it))
    this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
    ids.forEach((item: any) => {
      if (this.checkId.includes(item)) {
        checkSingle.push(item)
      }
    })
    if (checkSingle.length == ids.length) {
      this.single = true
    } else {
      this.single = false
    }
  }

  async del() {
    try {
      if (this.checkId.length == 0) {
        info('至少选择一个影片')
      }
      await delcollect({
        channelType: 1,
        dataIdList: this.checkId
      })
      this.init()
      this.check([])
    } catch (ex) {
      this.handleError(ex)
    }
  }

  checkAll() {
    const ids = this.cinemaDetail.map((it: any) => it.movieId)
    this.single = !this.single
    if (this.single) {
      this.check(ids)
    } else {
      this.check([])
    }
  }

   // 每页数
  sizeChangeHandle(val: any) {
    this.pageIndex = val
    this.init()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.pageSize = val
    this.init()
  }

  checknum(id: number) {
    if (this.checkNum.includes(id)) {
      this.checkNum = this.checkNum.filter((it: any) => it != id)
    } else {
      this.checkNum.push(id)
    }
    this.check(this.checkNum)
  }

  async init() {
    try {
      const { data } = await getmovies()
      this.cinemaDetail = data.items || []

      const checkSingle: any = []
      const ids = this.cinemaDetail.map((it: any) => it.movieId)
      ids.forEach((item: any) => {
      if (this.checkId.includes(item)) {
          checkSingle.push(item)
        }
      })
      if (checkSingle.length == ids.length) {
        this.single = true
      } else {
        this.single = false
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
.film-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: -15px;
  .film-item {
    cursor: pointer;
    position: relative;
    width: calc(33.3% - 20px);
    height: 284px;
    padding-bottom: 5px;
    padding-top: 40px;
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 1);
    .film-cover-box {
      display: flex;
      margin-top: 30px;
      .film-title {
        font-size: 18px;
        color: #00202d;
        height: 24px;
        font-weight: 400;
        margin-left: 20px;
      }
      .film-time {
        margin-left: 20px;
        height: 24px;
      }
      img {
        margin-left: 30px;
        width: 104px;
        height: 146px;
        user-select: none;
      }
    }
  }
  .film-item:nth-child(n) {
    margin-right: 20px;
  }
  .film-item:nth-child(3n) {
    margin-right: 0;
  }
  .film-name,
  .film-tags {
    line-height: 22px;
    text-align: center;
    font-weight: normal;
  }
  .film-name {
    margin-top: 10px;
  }
  .item-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    background: rgba(0, 32, 45, 1);
    border-radius: 0 0 5px 5px;
    color: #fff;
  }
  .check {
    position: absolute;
    left: 8px;
    top: 20px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
  }
  .checkall {
    background: #00202d;
    &::after {
      content: '';
      display: table;
      position: absolute;
      left: 7px;
      top: 4px;
      width: 8px;
      height: 12px;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg) scale(1);
      transition: all 0.2s ease-in-out;
    }
  }
}
.audit {
  display: flex;
  .check {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }
  .checkall {
    background: #00202d;
    position: relative;
    &::after {
      content: '';
      display: table;
      position: absolute;
      left: 7px;
      top: 4px;
      width: 8px;
      height: 12px;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg) scale(1);
      transition: all 0.2s ease-in-out;
    }
  }
  span {
    line-height: 24px;
    font-size: 14px;
    margin-left: 20px;
  }
}
</style>

