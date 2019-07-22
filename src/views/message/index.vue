<template>
  <div class="message-page">
    <div class='top-wrap' v-if="!loading && !timeout && total !== 0">
      <span></span>
      <a class="read-all-button" @click="readAllHandler">全部标为已读</a>
    </div>
    <div class='message-wrap'>
      <div class="fetch-loading" v-if="loading">
        <TinyLoading /> 加载中</div>
      <div class="fetch-empty" v-if="!loading && !timeout && total === 0">暂无数据</div>
      <div class="fetch-timeout" v-if="timeout">
        请求超时，<a class="retry" @click="retry">点击重试</a>
      </div>
      <ul class="fetch-list" v-if="!loading && !timeout && total > 0">
        <li v-for="(it, index) in list" :key="index" :class=" it.status === 1 ? 'no-read' : '' ">
          <router-link :to="{ name: 'message-info', params: { id: it.id } }">
            <div class="inner">
              <div class="title-box">
                <i class="dot"></i> <i class="icons" :style=" `background-image: url('${it.icon}')` "></i>{{it.name}}
              </div>
              <div class="content-box">
                <span>{{it.title}}</span>
              </div>
              <div class="time-box">
                <span>{{transTime(it.sendTime)}}</span>
              </div>
            </div>
          </router-link>
        </li>
        <!-- <li class="no-read">
          <div class="inner">
            <div class="title-box">
              <i class="dot"></i> <i class="icons" style="background-image: url('https://u8b5.cn/uSUy2')"></i>紧急下刊
            </div>
            <div class="content-box">
              <span>广告片【 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》</span>
            </div>
            <div class="time-box">
              <span>13:41</span>
            </div>
          </div>
        </li>
        -->
      </ul>
      <Page class="info-page" :total="total" :current.sync="queryData.pageIndex" :page-size="queryData.pageSize" show-total show-elevator @on-change="handlepageChange" @on-page-size-change="handlePageSize" v-if="!loading && ( total > queryData.pageSize )" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { warning, success, toast } from '@/ui/modal'
import { messageList, readItem, readAll } from '@/api/message'
import TinyLoading from '@/components/TinyLoading.vue'
import { findIndex, isEmpty } from 'lodash'
import moment from 'moment'

const getName = (key: string, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return key === it.key
  })
  const res: string = list[i].text || ''
  return res
}

@Component({
  components: {
    TinyLoading
  }
})
export default class MessagePage extends ViewBase {
  queryData: any = {
    status: 0,
    pageIndex: 1,
    pageSize: 10
  }

  oldQuery: any = {}

  list: any[] = []

  statusList: any[] = []

  total: number | null = null

  loading = false

  timeout = false

  mounted() {
    this.fetchData()
  }

  async fetchData() {
    if (this.loading) {
      return
    }

    // 复制一份，预防被 fetch 改变
    const query = JSON.parse(JSON.stringify(this.queryData))
    this.oldQuery = { ...query }

    this.loading = true
    this.timeout = false
    try {
      const { data } = await messageList(query)
      const items = data.items || null
      const total = data.totalCount || 0
      const status = data.status || null
      if ( items && items.length > 0 ) {
        this.list = items.map((it: any) => {
          return {
            id: it.id,
            status: it.status,
            statusName: getName(it.status, status),
            name: it.name,
            title: it.title,
            icon: it.icon,
            sendTime: it.sendTime
          }
        })
        this.total = total
      } else {
        this.loading = false
        this.timeout = false
        this.total = 0
        return
      }
      if ( status && status.length > 0 ) {
        this.statusList = status
      }
      this.loading = false
    } catch (ex) {
      const name = ex && ex.code && `handle${ex.code}`
      ; ((this as any)[name] || this.handleError).call(this, ex)
    } finally {
      this.loading = false
    }
  }

  async readAllHandler() {
    try {
      const { data } = await readAll()
      if (data) {
        await toast('操作成功')
      } else {
        await toast('操作失败')
      }
      this.retry()
    } catch (ex) {
      const name = ex && ex.code && `handle${ex.code}`
      ; ((this as any)[name] || this.handleError).call(this, ex)
    } finally {
      this.loading = false
    }
  }

  transTime(sendTime: any) {
    if (!sendTime || sendTime == '') {
      return ''
    }
    const today = moment(new Date()).format('YYYYMMDD')
    const curDate = moment(sendTime).format('YYYYMMDD')
    if (curDate === today) {
      return moment(sendTime).format('h:mm')
    } else {
      return moment(sendTime).format('MM-DD')
    }
  }

  handlepageChange(val: any) {
    this.queryData.pageIndex = val
    this.fetchData()
  }

  handlePageSize(val: any) {
    this.queryData.pageIndex = val
    this.fetchData()
  }

  // timeout
  handle880() {
    this.timeout = true
  }

  retry() {
    this.list = []
    this.fetchData()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.fetch-loading,
.fetch-empty,
.fetch-timeout {
  color: #888;
  font-size: 16px;
  text-align: center;
  user-select: none;
}

.message-page {
  position: relative;
  .top-wrap {
    min-height: 30px;
    margin-bottom: 20px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    a.read-all-button {
      display: inline-block;
      width: 138px;
      height: 30px;
      background: rgba(0, 32, 45, 1);
      border-radius: 15px;
      color: #fff;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
  }
}
.message-wrap {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 1);
  min-height: 350px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  .fetch-list {
    width: 100%;
    margin-bottom: 200px;
    li.no-read {
      // 未读
      background: rgba(255, 255, 255, 0.6);
      .inner {
        border-bottom: none;
        .title-box {
          i.dot {
            visibility: visible;
          }
        }
      }
    }
    li:last-child {
      .inner {
        border-bottom: none;
      }
    }
    li {
      background: none;
      padding: 0 25px 0 45px;
      .inner {
        // 内衬
        width: 100%;
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        min-height: 100px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        .title-box {
          // 标题
          width: 190px;
          display: flex;
          flex-flow: row;
          justify-content: flex-start;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
          color: rgba(0, 32, 45, 1);
          i.dot {
            // 点
            visibility: hidden;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: inline-block;
            background: rgba(218, 108, 112, 1);
          }
          i.icons {
            // 图标
            width: 30px;
            height: 30px;
            display: inline-block;
            background-position: center center;
            background-size: contain;
            background-repeat: no-repeat;
            padding: 0 25px 0 35px;
          }
        }
        .content-box {
          // 摘要
          flex: 1;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 32, 45, 1);
          .cut-text;
        }
        .time-box {
          // 时间
          min-width: 100px;
          text-align: right;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 32, 45, 0.5);
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
</style>
