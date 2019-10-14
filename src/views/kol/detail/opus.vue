<template>
  <div class="brand-list com-modal">
    <div class="select-brand com-modal-title">
      <span>90日热门内容</span>
      <Select v-model="form.channelCode" style="width:100px">
        <Option v-for="item in platformList" :value="item.key" :key="item.key">{{ item.text }}</Option>
      </Select>
    </div>

    <div class="query-select">
      <Tabs class v-model="form.sortBy">
        <TabPane v-for="item in selectOption" :key="item.key" :value="item.key" :label="item.text"></TabPane>
      </Tabs>
    </div>

    <div class="list-items">
      <div class="item" v-for="(item, index) in list" :key="index">
        <div class="item-inner flex-box">
          <a :href="item.url" target="_blank" class="video-url" >
            <i v-if="item.url"></i>
            <img class="img" v-real-img="item.coverPic" />
          </a>

          <div class="inner-right">
            <p class="title" :title="item.title">{{handleSlice(item.title || item.content)}}</p>
            <p class="icon-num">
              <span>
                <i class="iconfont icon-shipin" />
                <em>{{roleNumber(item.playCount)}}</em>
              </span>
              <span>
                <i class="iconfont icon-dianzan" />
                <em>{{roleNumber(item.likeCount)}}</em>
              </span>
              <span>
                <i class="iconfont icon-dianping" />
                <em>{{roleNumber(item.commentCount)}}</em>
              </span>
            </p>
            <p class="times">{{item.publishTime}}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="list.length == 0" class="no-data-list">暂无数据</div>
    <pagination :pageList="pageList" :total="total" @uplist="uplist"></pagination>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { opusList } from '@/api/kolDetails'
import { querySelectList } from '@/api/brandList'
import defaultImg from '../assets/error.png'
import pagination from '@/components/page.vue'
import moment from 'moment'
import { roleNumber } from '@/util/validateRules'
import { formatValidDate } from '@/util/dealData'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
    pagination
  }
})
export default class Opus extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: 'weibo' }) channel!: string

  total = 0
  pageList = {
    pageIndex: 1,
    pageSize: 20
  }

  form = {
    channelCode: this.channel,
    sortBy: 0
  }
  // 选择平台
  platformList = []

  // 排序
  selectOption = []

  list: any = []

  get roleNumber() {
    return roleNumber
  }

  mounted() {
    this.tableList()
  }

  async tableList() {
    try {
      const {
        data: { items, totalCount, sortByList, channelList }
      } = await opusList({
        ...this.form,
        ...this.pageList,
        sortBy: this.form.sortBy + 1,
        id: this.id
      })

      this.list = (items || []).map((it: any) => {
        return {
          ...it,
          publishTime: formatValidDate(it.publishTime, {format: timeFormat})
        }
      })
      this.total = totalCount
      this.selectOption = sortByList || []
      this.platformList = channelList || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  handleSlice(text: string) {
    if (!text) {
      return
    }
    return text.length > 45 ? text.substring(0, 45) + '.....' : text
  }

  uplist(size: any) {
    this.pageList.pageIndex = size
    this.tableList()
  }

  @Watch('form', { deep: true })
  watchForm() {
    this.pageList.pageIndex = 1
    this.tableList()
  }
}
</script>

<style lang='less' scoped>
@import '~@/site/lib.less';
@import '~@/views/kol/less/common.less';

.no-data-list {
  text-align: center;
  color: #fff;
  font-size: 15px;
}
.iconfont {
  font-size: 19px;
  color: #a3d5e6;
  padding-right: 5px;
  position: relative;
  top: 2px;
}

.brand-list {
  font-size: 14px;
  .select-brand {
    padding-left: 30px;
    span {
      padding-right: 20px;
    }
  }
  .query-select {
    color: #fff;
    font-size: 14px;
    margin: 15px 0;
    span {
      margin-right: 15px;
      cursor: pointer;
    }
  }
  .list-items {
    padding: 0 30px 20px;
    margin-left: -15px;
    margin-right: -15px;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 50%;
      padding: 0 15px;
      margin-bottom: 30px;
      .item-inner {
        overflow: hidden;
        position: relative;
        background: rgba(0, 32, 45, 0.5);
        border-radius: 8px;
        height: 200px;
        .video-url {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 200px;
          min-width: 200px;
          height: 200px;
          border-radius: 8px;
          margin-right: 20px;
          overflow: hidden;
          i {
            display: block;
            width: 50px;
            height: 50px;
            background: url('../assets/play.png') no-repeat;
            background-size: 100%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .inner-right {
          padding: 25px 15px 25px;
          color: #fff;
          .icon-num {
            font-size: 14px;
            span {
              padding-right: 10px;
            }
          }
          .times {
            font-size: 14px;
            padding-top: 12px;
          }
        }
        .title {
          font-size: 17px;
          overflow: hidden;
          height: 80px;
          text-align: justify;
          color: #a3d5e6;
        }
        .img {
          height: 200px;
          border-radius: 8px;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
